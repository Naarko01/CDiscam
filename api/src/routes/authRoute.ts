import { HTTPException } from "hono/http-exception";
import { loginSchema as loginBody } from "@cdiscam/shared";
import bcrypt from "bcrypt";
import User from "../models/usersModel";
import { env } from "../config/env";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sign, type JwtVariables } from "hono/jwt";
import { requireAuth } from "../middlewares/tokenValidation";
import { setCookie, deleteCookie } from "hono/cookie";
import { toPublicUser } from "../utils/helper";

export const COOKIE_NAME = "token";

const cookieOptions = {
	httpOnly: true,
	secure: env.NODE_ENV === "production",
	sameSite: "Lax" as const,
	path: "/",
};

const TOKEN_TTL = 60 * 60;

// Hash factice : on compare toujours, pour éviter de révéler si l'email existe (timing)
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);

const authRoute = new Hono<{ Variables: JwtVariables }>()
	.post("/login", zValidator("json", loginBody), async (c) => {
		const { email, password } = c.req.valid("json");

		const user = await User.findOne({ email: email.toLowerCase() });
		const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

		if (!user || !ok || !user.isActive) {
			throw new HTTPException(401, { message: "Identifiants invalides" });
		}

		const now = Math.floor(Date.now() / 1000);
		const token = await sign(
			{ sub: user.id, role: user.role, iat: now, exp: now + TOKEN_TTL },
			env.JWT_SECRET,
			"HS256",
		);

		await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });
		setCookie(c, COOKIE_NAME, token, { ...cookieOptions, maxAge: TOKEN_TTL });
		return c.json(toPublicUser(user));
	})
	.get("/me", requireAuth, async (c) => {
		const { sub } = c.get("jwtPayload");
		const user = await User.findById(sub).select("email firstName lastname role isActive").lean();
		if (!user || !user.isActive) throw new HTTPException(401, { message: "Session invalide" });
		return c.json(toPublicUser(user));
	})
	.post("/logout", (c) => {
		deleteCookie(c, COOKIE_NAME, cookieOptions);
		return c.body(null, 204);
	});

export default authRoute;

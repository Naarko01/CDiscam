import { jwt } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { env } from "../config/env";

export const requireAuth = jwt({ secret: env.JWT_SECRET, alg: "HS256", cookie: "token" });

export const requireRole = (...roles: string[]) =>
	createMiddleware(async (c, next) => {
		const payload = c.get("jwtPayload") as { role?: string };
		if (!payload.role || !roles.includes(payload.role)) {
			throw new HTTPException(403, { message: "Accès refusé" });
		}
		await next();
	});

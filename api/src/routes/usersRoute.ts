import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { type JwtVariables } from "hono/jwt";
import User from "../models/usersModel";
import { createUserSchema as createUserBody, updateUserSchema as updateUserBody } from "@cdiscam/shared";
import { toHttpError } from "../utils/dbErrors";
import { requireAuth, requireRole } from "../middlewares/tokenValidation";
import { toUserProfile } from "../utils/helper";

const idParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) }); //objectId MongoDB
const SALT_ROUNDS = 12; //taille du salt dans le hashage

const listQuery = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

const usersRoute = new Hono<{ Variables: JwtVariables }>()
	.get("/", requireAuth, requireRole("admin"), zValidator("query", listQuery), async (c) => {
		const { limit } = c.req.valid("query");
		const users = await User.find().limit(limit).select("-passwordHash").lean();
		return c.json(users.map(toUserProfile));
	})
	.get("/:id", requireAuth, zValidator("param", idParam), async (c) => {
		const { id } = c.req.valid("param");

		const { sub, role } = c.get("jwtPayload");
		if (role !== "admin" && sub !== id) return c.json({ error: "Accès refusé" }, 403);

		const user = await User.findById(id).select("-passwordHash").lean();
		if (!user) return c.json({ error: "Not found" }, 404);
		return c.json(toUserProfile(user));
	})
	.post("/", zValidator("json", createUserBody), async (c) => {
		const { password, ...rest } = c.req.valid("json");

		try {
			const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
			await User.create({ ...rest, passwordHash });
			return c.json({ ok: true }, 201);
		} catch (err) {
			toHttpError(err); // 11000 (email dupliqué) → 409
		}
	})
	.patch("/:id", requireAuth, zValidator("param", idParam), zValidator("json", updateUserBody), async (c) => {
		const { password, ...rest } = c.req.valid("json");
		const { id } = c.req.valid("param");

		const { sub, role } = c.get("jwtPayload");
		if (role !== "admin" && sub !== id) return c.json({ error: "Accès refusé" }, 403);

		try {
			const update = password ? { ...rest, passwordHash: await bcrypt.hash(password, SALT_ROUNDS) } : rest;
			const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
				.select("-passwordHash")
				.lean();
			if (!user) return c.json({ error: "Not found" }, 404);

			return c.json(toUserProfile(user));
		} catch (err) {
			toHttpError(err);
		}
	})
	.delete("/:id", requireAuth, zValidator("param", idParam), async (c) => {
		const { id } = c.req.valid("param");

		const { sub, role } = c.get("jwtPayload");
		if (role !== "admin" && sub !== id) return c.json({ error: "Accès refusé" }, 403);

		const deleted = await User.findByIdAndDelete(id).select("_id").lean();
		if (!deleted) return c.json({ error: "Not found" }, 404);

		return c.body(null, 204);
	});

export default usersRoute;

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { type JwtVariables } from "hono/jwt";
import Product from "../models/productsModel";
import { toHttpError } from "../utils/dbErrors";
import { requireAuth, requireRole } from "../middlewares/tokenValidation";

const idParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i) });

const listQuery = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

const productsRoute = new Hono<{ Variables: JwtVariables }>()
	.get("/", zValidator("query", listQuery), async (c) => {
		const { limit } = c.req.valid("query");
		try {
			const products = await Product.find({ isPublished: true }).limit(limit).select({ stock: 0 }).lean();
			return c.json(products);
		} catch (err) {
			toHttpError(err);
		}
	})
	.get("/:id", zValidator("param", idParam), async (c) => {
		const { id } = c.req.valid("param");
		try {
			const product = await Product.findById(id).select({ stock: 0, isPublished: 0 }).lean();
			if (!product) return c.json({ error: "Not found" }, 404);
			return c.json(product);
		} catch (err) {
			toHttpError(err);
		}
	});

export default productsRoute;

import { z } from "zod";

const NODE_ENV = ["development", "production", "test"] as const;

const envSchema = z.object({
	MONGO_URI: z.string().min(1),
	JWT_SECRET: z.string().min(32, "JWT_SECRET doit faire au moins 32 caractères"),
	PORT: z.coerce.number().int().positive().default(3000),
	NODE_ENV: z.enum(NODE_ENV),
});

export const env = envSchema.parse(process.env);

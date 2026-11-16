import { z } from "zod";
import { availableCountries, availableCurrencies, possibleLanguages } from "../constants";

export const addressSchema = z.object({
	label: z.string(),
	street: z.string().min(1),
	city: z.string().min(1),
	postalCode: z.string().min(1),
	country: z.enum(availableCountries),
	isDefaultShipping: z.boolean().default(false),
	isDefaultBilling: z.boolean().default(false),
});

export const preferencesSchema = z.object({
	newsletter: z.boolean(),
	language: z.enum(possibleLanguages).default("FR"),
	currency: z.enum(availableCurrencies).default("EUR"),
});

export const createUserSchema = z.object({
	email: z.email(),
	password: z.string().min(12).max(72),
	firstName: z.string().min(1),
	lastname: z.string().min(1),
	phone: z.string(),
	age: z.number().int().min(0),
	addresses: z.array(addressSchema).min(1),
	preferences: preferencesSchema,
});

export const updateUserSchema = createUserSchema
	.partial()
	.refine((body) => Object.keys(body).length > 0, { message: "Au moins un champ est requis" });

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

export type Address = z.infer<typeof addressSchema>;
export type CreateUserInput = z.input<typeof createUserSchema>;
export type UpdateUserInput = z.input<typeof updateUserSchema>;
export type LoginInput = z.input<typeof loginSchema>;

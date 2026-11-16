import { addressesSchema } from "./sharedSchema";
import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import { possibleLanguages, availableCurrencies } from "../utils/types";

const possibleRoles = ["admin", "user"];

const preferencesSchema = new Schema(
	{
		newsletter: { type: Boolean, default: false },
		language: { type: String, enum: possibleLanguages, required: true, default: "FR" },
		currency: { type: String, enum: availableCurrencies, required: true, default: "EUR" },
	},
	{ _id: false },
);

const userSchema = new Schema(
	{
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		passwordHash: { type: String, required: true },
		firstName: { type: String, required: true },
		lastname: { type: String, required: true },
		phone: { type: String, required: true },
		role: { type: String, enum: possibleRoles, default: "user", required: true },
		addresses: { type: [addressesSchema] },
		preferences: { type: preferencesSchema },
		isActive: { type: Boolean, required: true, default: true },
		emailVerified: { type: Boolean, required: true, default: true },
		lastLoginAt: { type: Date, required: true, default: () => new Date() },
		age: { type: Number, required: true },
	},
	{ timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export default model("User", userSchema, "users");

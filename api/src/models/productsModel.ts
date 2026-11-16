import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";
import { availableCurrencies } from "../utils/types";

const priceSchema = new Schema(
	{
		amout: { type: Number, required: true },
		currency: { type: String, enum: availableCurrencies, required: true },
	},
	{ _id: false },
);

const stockSchema = new Schema(
	{
		quantity: { type: Number, required: true },
		reserved: Number,
		lowStockThreshold: { type: Number, required: true },
	},
	{ _id: false },
);

const productImageSchema = new Schema(
	{
		url: { type: String, required: true },
		alt: { type: String, required: true },
	},
	{ _id: false },
);

const ratingSchema = new Schema(
	{
		average: { type: Number, required: true },
		count: { type: Number, required: true },
	},
	{ _id: false },
);

const productSchema = new Schema(
	{
		sku: { type: String, required: true },
		name: { type: String, required: true },
		slug: { type: String, required: true },
		description: { type: String, required: true },
		brand: { type: String, required: true },
		categories: { type: String, required: true },
		price: { type: priceSchema, required: true },
		stock: { type: stockSchema, required: true },
		image: { type: productImageSchema, required: true },
		rating: { type: ratingSchema, required: true },
		isPublished: { type: Boolean, required: true },
	},
	{ timestamps: true },
);

export type Product = InferSchemaType<typeof productImageSchema>;
export type ProductDocument = HydratedDocument<Product>;

export default model("Product", productSchema, "products");

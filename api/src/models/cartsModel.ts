import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const availableCurrencies = ["EUR", "USD", "GBP"] as const;
const cartStatuses = ["pending", "converted"] as const;

const cartItemSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
		sku: { type: String, required: true },
		name: { type: String, required: true },
		unitPrice: { type: Number, required: true },
		quantity: { type: Number, required: true },
		addedAt: { type: Date, required: true, default: () => new Date() },
	},
	{ _id: false },
);

const cartTotalSchema = new Schema(
	{
		subTotal: { type: Number, required: true, default: 0 },
		discount: { type: Number, required: true, default: 0 },
		currency: { type: String, enum: availableCurrencies, required: true, default: "EUR" },
	},
	{ _id: false },
);

const cartSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
		sessionId: { type: String, default: null },
		status: { type: String, enum: cartStatuses, required: true, default: "pending" },
		items: { type: [cartItemSchema], default: [] },
		couponCode: { type: String, default: null },
		totals: { type: cartTotalSchema, required: true },
		expiresAt: { type: Date, required: true /*, index: { expires: 0 } pour une expiration auto en TTL */ },
	},
	{ timestamps: true }, // génère/maintient createdAt & updatedAt automatiquement
);

export type Cart = InferSchemaType<typeof cartSchema>;
export type CartDocument = HydratedDocument<Cart>;

export default model("Cart", cartSchema, "carts");

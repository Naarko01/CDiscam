import { addressesSchema } from "./sharedSchema";
import { availableCurrencies } from "../utils/types";
import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const orderStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
const paymentMethods = ["card", "paypal"] as const;
const paymentStatuses = ["pending", "paid", "failed", "refunded"] as const;

const priceSchema = new Schema(
	{
		amout: { type: Number, required: true },
		currency: { type: String, enum: availableCurrencies, required: true },
	},
	{ _id: false },
);

const orderItemSchema = new Schema(
	{
		productId: { type: Schema.Types.ObjectId, ref: "Product", default: null, required: true },
		sku: { type: String, required: true },
		name: { type: String, required: true },
		unitPrice: { type: priceSchema, required: true },
		quantity: { type: Number, required: true },
		lineTotal: { type: priceSchema, required: true },
		tvaRate: { type: Number, required: true },
	},
	{ _id: false },
);

const paymentSchema = new Schema(
	{
		method: { type: String, enum: paymentMethods, required: true },
		transactionId: { type: String, required: true },
		status: { type: String, enum: paymentStatuses, required: true },
		paidAt: { type: Date, default: () => new Date() },
	},
	{ _id: false },
);

const orderTotalSchema = new Schema(
	{
		subtotal: { type: Number, required: true },
		discount: { type: Number, required: true },
		shipping: { type: Number, default: 0 },
		tax: Number,
		total: { type: Number, required: true },
		currency: { type: String, enum: availableCurrencies, required: true },
	},
	{ _id: false },
);

const statusHistorySchema = new Schema(
	{
		status: { type: String, enum: orderStatuses, required: true },
	},
	{ timestamps: true, _id: false },
);

const orderSchema = new Schema(
	{
		orderNumber: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId || null, ref: "User", default: null },
		guestEmail: { type: String || null, default: null },
		cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
		status: { type: String, enum: orderStatuses, required: true },
		items: { type: orderItemSchema, required: true },
		shippingAdresse: { type: addressesSchema, required: true },
		billingAdresse: { type: addressesSchema, required: true },
		payment: { type: paymentSchema, required: true },
		total: { type: orderTotalSchema, required: true },
		couponCode: { type: String || null, default: null },
		statusHistory: { type: statusHistorySchema, required: true },
	},
	{ timestamps: true },
);

export type Order = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<Order>;

export default model("Order", orderSchema, "orders");

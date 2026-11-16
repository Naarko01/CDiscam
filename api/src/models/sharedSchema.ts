import { Schema } from "mongoose";
import { availableCountries, availableCurrencies } from "../utils/types";

export const priceSchema = new Schema(
	{
		amout: { type: Number, required: true },
		currency: { type: String, enum: availableCurrencies, required: true },
	},
	{ _id: false },
);

export const addressesSchema = new Schema(
	{
		label: { type: String, required: true },
		street: { type: String, required: true },
		city: { type: String, required: true },
		postalCode: { type: String, required: true },
		country: { type: String, enum: availableCountries, required: true },
		isDefaultShipping: { type: Boolean, required: true },
		isDefaultBilling: { type: Boolean, required: true },
	},
	{ _id: false },
);

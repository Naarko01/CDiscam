export const availableCurrencies = ["EUR", "USD", "GBP"] as const;
export const paymentMethods = ["card", "paypal"] as const;
export const possibleLanguages = ["FR", "EN", "NL", "DE", "ES"] as const;
export const availableCountries = ["FR", "BE", "EN", "US", "CH", "ES", "NL", "DE"] as const;

export type Currencies = (typeof availableCurrencies)[number];
export type Languages = (typeof possibleLanguages)[number];
export type Country = (typeof availableCountries)[number];

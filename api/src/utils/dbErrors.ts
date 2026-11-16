import { Error as MongooseError } from "mongoose";
import { HTTPException } from "hono/http-exception";

//code erreur MongoDB en cas de tentative de création d'un documents contenant un index unique déjà présent
const DUPLICATE_KEY_CODE = 11000;

// Traduit les erreurs Mongo/Mongoose attendues en HTTPException, relance les autres (500 via app.onError)
export function toHttpError(err: unknown): never {
	if (err instanceof HTTPException) throw err;

	if (typeof err === "object" && err !== null && (err as { code?: number }).code === DUPLICATE_KEY_CODE) {
		throw new HTTPException(409, { message: "Cette valeur existe déjà" });
	}
	if (err instanceof MongooseError.ValidationError) {
		throw new HTTPException(400, { message: "Données invalides" });
	}
	if (err instanceof MongooseError.CastError) {
		throw new HTTPException(400, { message: "Identifiant invalide" });
	}
	throw err;
}

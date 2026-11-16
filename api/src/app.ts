import { Hono } from "hono";
import { type JwtVariables } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import usersRoute from "./routes/usersRoute";
import authRoute from "./routes/authRoute";
import productsRoute from "./routes/productsRoute";
import { requireAuth } from "./middlewares/tokenValidation";

type Variables = JwtVariables;
const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		return c.json({ error: err.message }, err.status);
	}
	console.error(err); // détails uniquement dans les logs serveur
	return c.json({ error: "Erreur interne du serveur" }, 500);
});

app.notFound((c) => c.json({ error: "Route introuvable" }, 404));

const routes = app
	.get("/health", (c) => c.json({ status: "ok" as const }))
	.route("/users", usersRoute)
	.route("/auth", authRoute)
	.route("/products", productsRoute);

export type AppType = typeof routes;
export default app;

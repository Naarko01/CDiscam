# cdiscam

App e-commerce éducative : API Hono (Node.js) + MongoDB (driver officiel) et frontend React + Tailwind, avec typage partagé via Hono RPC.

## Démarrage

```bash
npm install
npm run db:up        # MongoDB (replica set mono-noeud, requis pour les transactions)
npm run dev          # API (http://localhost:3000/api) + web (http://localhost:5173)
```

- `api/.env` est déjà créé ; modèle dans `api/.env.example`.
- mongo-express (optionnel) : `docker compose --profile tools up -d` → http://localhost:8081
- Tests : `npm test` — Types : `npm run typecheck`

## Structure

- `api/` : routes (HTTP) → services (métier + MongoDB) → models (types + Zod). Exporte `AppType` depuis `src/app.ts`.
- `web/` : React + Vite + Tailwind v4 + React Router + TanStack Query. Le client RPC est dans `src/lib/api.ts`.
  Vite proxifie `/api` vers l'API (même origine → cookie JWT httpOnly sans CORS).

## À propos de bcrypt

npm récent peut afficher un avertissement `allow-scripts` pour `bcrypt` et `esbuild` : sans impact, les binaires précompilés sont utilisés.

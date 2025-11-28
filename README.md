# Meetopia Monorepo

Local development now runs without Docker. Docker Compose is kept for production deployments only.

## Local development (no Docker)
- Prereqs: Node 20+ and a running Postgres instance you can reach via URL.
- Env setup:  
  - Copy `api/.env.example` to `api/.env` and point `DATABASE_URL` at your local Postgres database.  
  - Copy `Meetopia/.env.example` to `Meetopia/.env` and point `VITE_API_URL`/`VITE_SOCKET_URL` at your API (default `http://localhost:3000`).
- Install deps: `npm install` in `api` and `Meetopia`.
- Database: from `api/`, run `npx prisma migrate dev` (or `npx prisma db push`) so the schema exists, then `npx prisma generate` if needed.
- Run API: `npm run dev` in `api` (listens on `PORT` from `.env`, default 3000).
- Run frontend: `npm run dev` in `Meetopia` (served on port 5173).

## Production with Docker Compose
- Provide a production env file at the repo root named `.env.prod` (use the existing `.env.prod` in the repo root as the template). It must include `DATABASE_URL` pointing at the Postgres service host `postgres`.
- Build and start: `docker compose --env-file .env.prod up --build -d`.
- Stop: `docker compose down`.

## Notes
- The old dev-focused compose file was replaced with a production-only stack (`docker-compose.yml`). Local workflows rely on Node/npm directly.
- CORS defaults now target `http://localhost:5173`; set `FRONTEND_URL` in `api/.env` if you change the frontend port/host.

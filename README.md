# Scaffold

Nuxt 4 + AdonisJS + Drizzle + Postgres + Stripe, wired end-to-end so you can
clone this and start building a real idea within minutes instead of re-solving
auth and billing plumbing every time.

```
apps/
  web/    Nuxt 4, TypeScript, Tailwind v4 — frontend
  api/    AdonisJS 7, TypeScript — API backend
```

## Stack

| Layer      | Choice                                          |
| ---------- | ------------------------------------------------ |
| Frontend   | Nuxt 4, TypeScript, Tailwind v4                   |
| Backend    | AdonisJS 7 (API-only kit)                         |
| Database   | PostgreSQL, via Drizzle ORM                       |
| Auth       | Hand-rolled bearer tokens (see note below)        |
| Payments   | Stripe (Checkout + customer portal + webhooks)    |
| Local infra| Docker Compose (Postgres only)                    |

## Quick start

```bash
git clone <this repo> my-project
cd my-project
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

pnpm install
pnpm docker:up        # starts Postgres on :5432
pnpm db:migrate        # creates users + access_tokens tables
pnpm dev                # runs both apps: api on :3333, web on :3000
```

Open http://localhost:3000 — the homepage pings the API and tells you if it's
reachable. Sign up, log in, hit the dashboard: that whole loop is real and
working, not a stub.

## What's actually wired up

- **Signup / login / logout / profile** — `POST /api/v1/auth/signup`,
  `POST /api/v1/auth/login`, `POST /api/v1/account/logout`,
  `GET /api/v1/account/profile`. Passwords hashed with Adonis's `hash`
  service (scrypt). Nuxt pages for all of it: `/signup`, `/login`,
  `/dashboard` (protected via route middleware).
- **Stripe** — `POST /api/v1/billing/checkout` creates a Checkout session for
  a subscription price, `POST /api/v1/billing/portal` opens the customer
  portal, and `POST /webhooks/stripe` handles `customer.subscription.*`
  events and writes the subscription status back onto the user row. Point
  your Stripe webhook (or `stripe listen --forward-to localhost:3333/webhooks/stripe`
  while developing) at that endpoint.
- **Drizzle schema** (`apps/api/database/schema.ts`) — `users` and
  `access_tokens` tables, with `stripeCustomerId` / `stripeSubscriptionId` /
  `stripeSubscriptionStatus` already on the user row so you don't have to
  add a billing migration on day one.
- **CORS** — wide open in dev, locked to `CORS_ORIGIN` in production.

## A deliberate deviation: auth isn't `@adonisjs/auth`

AdonisJS's official auth package ships tightly coupled to Lucid (its own
ORM) for the token/user provider. Since this scaffold uses Drizzle instead,
I didn't try to force Drizzle through Lucid-shaped interfaces — that tends
to produce fragile glue code. Instead `apps/api/app/services/auth_service.ts`
implements the same idea directly: opaque random tokens, SHA-256-hashed
before they touch the database, verified by a small `AuthMiddleware`. It's
~60 lines, plain Drizzle queries, nothing clever. Swap it for
`@adonisjs/auth` + Lucid if you'd rather have Lucid than Drizzle, or extend
it with refresh tokens / scopes if you need more than what's here.

## Database workflow

```bash
pnpm db:generate   # diff database/schema.ts → new SQL migration file
pnpm db:migrate     # apply pending migrations
pnpm db:studio      # browse data in Drizzle Studio
```

An initial migration for `users` + `access_tokens` is already checked in at
`apps/api/database/migrations/0000_purple_gambit.sql` — `pnpm db:migrate`
after `docker:up` is all you need to get a working DB.

## Known upstream quirk

`apps/api`'s `pnpm build` currently needs `--ignore-ts-errors` (already set
in `apps/api/package.json`). There's a real type mismatch between
`@adonisjs/core@7.4.0`'s `indexEntities` hook and `@adonisjs/assembler@8.5.0`'s
hook types — an upstream version-skew issue, not something introduced here.
It doesn't affect runtime behaviour (`node ace serve` and the built output
both run fine). Worth removing the flag next time you bump AdonisJS
dependencies, to check if it's been fixed upstream.

## Deploying

Both apps are plain Node processes and build to `apps/api/build` and
`apps/web/.output` respectively — deploy them however you'd deploy any
Node app (a single Coolify instance with two services works well if that's
your setup). Set `DATABASE_URL`, `APP_KEY`, `CORS_ORIGIN`,
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` on the API, and
`NUXT_PUBLIC_API_BASE` on the web app, pointing at the API's public URL.

## Root scripts

```bash
pnpm dev            # both apps concurrently
pnpm dev:api         # api only
pnpm dev:web         # web only
pnpm build           # both apps, production builds
pnpm typecheck       # both apps
pnpm docker:up        # start local Postgres
pnpm docker:down      # stop it
```

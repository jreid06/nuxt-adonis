# apps/api

AdonisJS API — see the [root README](../../README.md) for setup and how the
whole stack fits together. Quick reference for this app specifically:

```bash
pnpm dev          # start with HMR on :3333
pnpm db:generate   # generate a migration from database/schema.ts
pnpm db:migrate    # apply migrations
pnpm db:studio     # browse the DB in Drizzle Studio
pnpm build         # production build → ./build
pnpm test          # Japa tests
```

Auth is a hand-rolled bearer-token scheme backed by Drizzle (`app/services/auth_service.ts`) —
not `@adonisjs/auth`, which ships wired to Lucid. See the root README for why.

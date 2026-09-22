/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Database (Postgres, via Drizzle)
  DATABASE_URL: Env.schema.string(),

  // CORS - comma separated list of allowed origins, e.g. the Nuxt dev server
  CORS_ORIGIN: Env.schema.string.optional(),

  // Stripe
  STRIPE_SECRET_KEY: Env.schema.string.optional(),
  STRIPE_WEBHOOK_SECRET: Env.schema.string.optional(),
})

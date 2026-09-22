/**
 * Drizzle ORM schema.
 *
 * This is the single source of truth for your database structure.
 * After changing this file, run:
 *
 *   pnpm db:generate   # creates a SQL migration from the diff
 *   pnpm db:migrate     # applies pending migrations to the database
 */
import { pgTable, serial, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: text('full_name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Populated once a user has a Stripe customer / subscription attached.
  // Handy default for SaaS ideas that need billing from day one.
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeSubscriptionStatus: text('stripe_subscription_status'),
})

export const usersRelations = relations(users, ({ many }) => ({
  accessTokens: many(accessTokens),
}))

export const accessTokens = pgTable(
  'access_tokens',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // SHA-256 hash of the token — the raw token is only ever shown once, at creation.
    hash: text('hash').notNull().unique(),
    name: text('name'),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('access_tokens_user_id_idx').on(table.userId)]
)

export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  user: one(users, { fields: [accessTokens.userId], references: [users.id] }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type AccessToken = typeof accessTokens.$inferSelect

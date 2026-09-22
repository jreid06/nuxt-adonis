import Stripe from 'stripe'
import env from '#start/env'

/**
 * Shared Stripe client. STRIPE_SECRET_KEY is optional in env validation so
 * the app still boots without it configured, but anything that touches
 * billing will throw a clear error until it's set.
 */
const secretKey = env.get('STRIPE_SECRET_KEY')

export const stripe = new Stripe(secretKey || 'sk_test_placeholder', {
  apiVersion: '2026-07-29.dahlia',
})

export const stripeIsConfigured = Boolean(secretKey)

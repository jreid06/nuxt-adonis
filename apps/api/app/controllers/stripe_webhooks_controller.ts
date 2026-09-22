import { eq } from 'drizzle-orm'
import type { HttpContext } from '@adonisjs/core/http'
import db from '#config/db'
import { users } from '#database/schema'
import env from '#start/env'
import { stripe } from '#services/stripe_service'

/**
 * Handles Stripe webhook events. Point your Stripe webhook endpoint at
 * POST /webhooks/stripe (see start/routes.ts) and set STRIPE_WEBHOOK_SECRET
 * from the dashboard / `stripe listen` output.
 *
 * Signature verification needs the *raw* request body — Adonis's
 * bodyparser keeps a copy of it even after JSON-parsing, available via
 * request.raw(), which is what makes this work without disabling global
 * body parsing for this one route.
 */
export default class StripeWebhooksController {
  async handle({ request, response }: HttpContext) {
    const signature = request.header('stripe-signature')
    const webhookSecret = env.get('STRIPE_WEBHOOK_SECRET')
    const rawBody = request.raw()

    if (!signature || !webhookSecret || !rawBody) {
      return response.badRequest({ message: 'Missing signature or webhook secret' })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch {
      return response.badRequest({ message: 'Invalid webhook signature' })
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id

        await db
          .update(users)
          .set({
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status,
          })
          .where(eq(users.stripeCustomerId, customerId))
        break
      }

      // Add more event types here as your product needs them, e.g.
      // 'invoice.payment_failed' to flag a user for a dunning email.
      default:
        break
    }

    return response.ok({ received: true })
  }
}

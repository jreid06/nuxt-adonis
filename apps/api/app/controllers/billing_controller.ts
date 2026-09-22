import vine from '@vinejs/vine'
import { eq } from 'drizzle-orm'
import type { HttpContext } from '@adonisjs/core/http'
import db from '#config/db'
import { users } from '#database/schema'
import env from '#start/env'
import { stripe } from '#services/stripe_service'

const checkoutValidator = vine.create({
  // The Stripe Price ID to subscribe the user to, e.g. "price_123"
  priceId: vine.string(),
})

/**
 * Minimal Stripe Checkout + customer-portal flow. This is the bit every
 * SaaS side project needs and always ends up rebuilding — swap the price
 * IDs and success/cancel URLs for your product and go.
 */
export default class BillingController {
  /**
   * Creates a Stripe Checkout session for the signed-in user and returns
   * the URL to redirect them to. Requires middleware.auth().
   */
  async createCheckoutSession({ request, user }: HttpContext) {
    const { priceId } = await request.validateUsing(checkoutValidator)

    const customerId = await this.#ensureStripeCustomer(user!)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.get('APP_URL')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.get('APP_URL')}/billing/cancelled`,
    })

    return { url: session.url }
  }

  /**
   * Creates a Stripe customer-portal session so the user can manage their
   * existing subscription (update card, cancel, view invoices).
   */
  async createPortalSession({ user }: HttpContext) {
    const customerId = await this.#ensureStripeCustomer(user!)

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.get('APP_URL')}/billing`,
    })

    return { url: session.url }
  }

  async #ensureStripeCustomer(user: typeof users.$inferSelect) {
    if (user.stripeCustomerId) return user.stripeCustomerId

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.fullName ?? undefined,
      metadata: { userId: user.id },
    })

    await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, user.id))

    return customer.id
  }
}

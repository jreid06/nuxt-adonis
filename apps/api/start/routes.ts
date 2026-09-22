/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import BillingController from '#controllers/billing_controller'
import StripeWebhooksController from '#controllers/stripe_webhooks_controller'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('checkout', [BillingController, 'createCheckoutSession'])
        router.post('portal', [BillingController, 'createPortalSession'])
      })
      .prefix('billing')
      .as('billing')
      .use(middleware.auth())
  })
  .prefix('/api/v1')

// Stripe posts here directly (not under /api/v1, and not through
// middleware.auth() — Stripe authenticates the request via its own
// signature header instead, verified inside the controller).
router.post('/webhooks/stripe', [StripeWebhooksController, 'handle'])

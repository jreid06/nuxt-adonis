import type { User } from '#database/schema'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    /**
     * Set by AuthMiddleware / SilentAuthMiddleware once a valid bearer
     * token has been verified. Undefined for anonymous requests.
     */
    user?: User
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { verifyAccessToken } from '#services/auth_service'

/**
 * Auth middleware. Reads the `Authorization: Bearer <token>` header,
 * verifies it against the `access_tokens` table, and denies the request
 * with a 401 if it's missing or invalid. On success, `ctx.user` is set
 * for the rest of the request lifecycle.
 *
 * Usage: router.get('/profile', handler).use(middleware.auth())
 */
export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = extractBearerToken(ctx.request.header('authorization'))

    if (!token) {
      return ctx.response.unauthorized({ message: 'Missing bearer token' })
    }

    const user = await verifyAccessToken(token)

    if (!user) {
      return ctx.response.unauthorized({ message: 'Invalid or expired token' })
    }

    ctx.user = user
    return next()
  }
}

export function extractBearerToken(header?: string) {
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim() || null
}

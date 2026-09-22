import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { verifyAccessToken } from '#services/auth_service'
import { extractBearerToken } from '#middleware/auth_middleware'

/**
 * Silent auth middleware. If a valid bearer token is present it attaches
 * `ctx.user`, but unlike AuthMiddleware it never rejects the request when
 * the token is missing or invalid — useful for routes that behave
 * differently for signed-in users without requiring sign-in (e.g. a
 * public page that shows a "your plan" banner when logged in).
 */
export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = extractBearerToken(ctx.request.header('authorization'))
    if (token) {
      ctx.user = (await verifyAccessToken(token)) ?? undefined
    }
    return next()
  }
}

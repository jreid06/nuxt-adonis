import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ user, serialize }: HttpContext) {
    // `user` is guaranteed to be set here because this route is behind
    // `middleware.auth()` — see start/routes.ts
    return serialize(UserTransformer.transform(user!))
  }
}

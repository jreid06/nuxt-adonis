import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/user'
import { findUserByEmail, issueAccessToken, revokeAccessToken } from '#services/auth_service'
import { extractBearerToken } from '#middleware/auth_middleware'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  async store({ request, response, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await findUserByEmail(email)
    const passwordIsValid = user ? await hash.verify(user.password, password) : false

    if (!user || !passwordIsValid) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = await issueAccessToken(user)

    return serialize({
      user: UserTransformer.transform(user),
      token,
    })
  }

  async destroy({ request }: HttpContext) {
    const token = extractBearerToken(request.header('authorization'))
    if (token) await revokeAccessToken(token)

    return { message: 'Logged out successfully' }
  }
}

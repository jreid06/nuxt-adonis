import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import db from '#config/db'
import { users } from '#database/schema'
import { signupValidator } from '#validators/user'
import { findUserByEmail, issueAccessToken } from '#services/auth_service'
import UserTransformer from '#transformers/user_transformer'

export default class NewAccountController {
  async store({ request, response, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const existing = await findUserByEmail(email)
    if (existing) {
      return response.conflict({ message: 'An account with this email already exists' })
    }

    const [user] = await db
      .insert(users)
      .values({
        fullName,
        email: email.toLowerCase(),
        password: await hash.make(password),
      })
      .returning()

    const token = await issueAccessToken(user)

    return serialize({
      user: UserTransformer.transform(user),
      token,
    })
  }
}

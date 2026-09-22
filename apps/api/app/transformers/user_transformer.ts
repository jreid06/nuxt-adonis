import type { User } from '#database/schema'
import { BaseTransformer } from '@adonisjs/core/transformers'

/**
 * Controls exactly which user fields ever leave the API. Notably, the
 * password hash and internal Stripe IDs are left out.
 */
export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, ['id', 'fullName', 'email', 'createdAt', 'updatedAt'])
  }
}

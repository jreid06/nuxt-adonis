import vine from '@vinejs/vine'

/**
 * Shared rules for email and password. Uniqueness is checked manually in
 * the controller (vine's `.unique()` rule ships wired up for Lucid; we're
 * on Drizzle here so a plain query is simpler than reimplementing it).
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(64)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().trim().nullable(),
  email: email(),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

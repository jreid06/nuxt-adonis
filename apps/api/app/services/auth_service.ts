import { randomBytes, createHash } from 'node:crypto'
import { eq } from 'drizzle-orm'
import db from '#config/db'
import { accessTokens, users, type User } from '#database/schema'

/**
 * Generates a new opaque bearer token for `user`, stores only its SHA-256
 * hash in the database (never the raw value), and returns the raw token so
 * the caller can hand it back to the client exactly once.
 */
export async function issueAccessToken(user: User, name = 'api_token') {
  const raw = randomBytes(40).toString('hex')
  const hash = hashToken(raw)

  await db.insert(accessTokens).values({ userId: user.id, hash, name })

  return raw
}

/**
 * Verifies a raw bearer token from an `Authorization: Bearer <token>`
 * header and returns the associated user, or `null` if it's invalid,
 * expired, or has been revoked.
 */
export async function verifyAccessToken(raw: string): Promise<User | null> {
  const hash = hashToken(raw)

  const token = await db.query.accessTokens.findFirst({
    where: eq(accessTokens.hash, hash),
    with: { user: true },
  })

  if (!token) return null
  if (token.expiresAt && token.expiresAt.getTime() < Date.now()) return null

  db.update(accessTokens)
    .set({ lastUsedAt: new Date() })
    .where(eq(accessTokens.id, token.id))
    .catch(() => {})

  return token.user
}

export async function revokeAccessToken(raw: string) {
  const hash = hashToken(raw)
  await db.delete(accessTokens).where(eq(accessTokens.hash, hash))
}

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) })
}

function hashToken(raw: string) {
  return createHash('sha256').update(raw).digest('hex')
}

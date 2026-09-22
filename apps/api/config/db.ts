import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import env from '#start/env'
import * as schema from '#database/schema'

/**
 * A single shared connection pool for the whole process.
 * `db` is what you import everywhere else: `import db from '#config/db'`
 */
export const pool = new Pool({
  connectionString: env.get('DATABASE_URL'),
})

const db = drizzle(pool, { schema })

export default db

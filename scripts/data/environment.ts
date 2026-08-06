import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export function loadDataEnvironment() {
  const target = process.env.DATA_ENV === 'production' ? 'production' : 'development'

  if (!process.env.DATABASE_URL) {
    const file = target === 'production' ? '.env' : '.env.local'
    const path = resolve(process.cwd(), file)
    if (!existsSync(path)) throw new Error(`${file} not found and DATABASE_URL is not injected.`)
    config({ path })
  }

  if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) {
    throw new Error('DATABASE_URL and DIRECT_URL are required.')
  }

  if (
    target === 'production' &&
    process.env.CONFIRM_READ_ONLY_PRODUCTION !== 'READ_PRODUCTION_DATA'
  ) {
    throw new Error(
      'Production read refused. Set CONFIRM_READ_ONLY_PRODUCTION=READ_PRODUCTION_DATA.'
    )
  }

  return target
}

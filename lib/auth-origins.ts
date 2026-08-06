type AuthEnvironment = Readonly<Record<string, string | undefined>>

const LOCAL_ORIGIN = 'http://localhost:3000'

function toOrigin(value: string | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null

  const candidate = /^https?:\/\//u.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    return new URL(candidate).origin
  } catch {
    return null
  }
}

export function getAuthBaseUrl(env: AuthEnvironment = process.env): string {
  if (env.VERCEL_ENV === 'preview') {
    const previewOrigin = toOrigin(env.VERCEL_URL)
    if (previewOrigin) return previewOrigin
  }

  return toOrigin(env.NEXT_PUBLIC_SITE_URL) ?? toOrigin(env.BETTER_AUTH_URL) ?? LOCAL_ORIGIN
}

export function getTrustedOrigins(env: AuthEnvironment = process.env): string[] {
  const configuredOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') ?? []
  const candidates = [
    getAuthBaseUrl(env),
    env.NEXT_PUBLIC_SITE_URL,
    env.BETTER_AUTH_URL,
    env.VERCEL_URL,
    env.VERCEL_BRANCH_URL,
    env.NODE_ENV === 'development' ? LOCAL_ORIGIN : undefined,
    ...configuredOrigins,
  ]

  return Array.from(
    new Set(candidates.map((candidate) => toOrigin(candidate)).filter((origin) => origin !== null))
  )
}

import type { Metadata } from 'next'

import type { Locale } from '@/lib/i18n-config'

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

export const SITE_URL = new URL(
  configuredSiteUrl && configuredSiteUrl.length > 0
    ? configuredSiteUrl
    : 'https://synck-psi.vercel.app'
)

export function localizedAlternates(locale: Locale, path = ''): Metadata['alternates'] {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return {
    canonical: `/${locale}${normalizedPath === '/' ? '' : normalizedPath}`,
    languages: {
      fr: `/fr${normalizedPath === '/' ? '' : normalizedPath}`,
      en: `/en${normalizedPath === '/' ? '' : normalizedPath}`,
    },
  }
}

export function pageMetadata({
  locale,
  title,
  description,
  path,
  image,
}: {
  locale: Locale
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const canonical = `/${locale}${path}`
  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
      siteName: 'Caroline Senyk',
      title,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

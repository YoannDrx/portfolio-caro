import type { Metadata } from 'next'

import { getArtistCatalog } from '@/lib/catalog/artists'
import { parseCatalogQuery } from '@/lib/catalog/query'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n-config'
import { pageMetadata } from '@/lib/seo'

import { ArtistCatalog } from '@/components/catalog/artist-catalog'

type ArtistsPageParams = {
  params: Promise<{
    locale: Locale
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({
  params,
}: Pick<ArtistsPageParams, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  return pageMetadata({
    locale: safeLocale,
    title: safeLocale === 'fr' ? 'Artistes & compositeurs' : 'Artists & composers',
    description:
      safeLocale === 'fr'
        ? 'Répertoire complet des artistes et compositeurs accompagnés par Caroline Senyk.'
        : 'Complete directory of artists and composers supported by Caroline Senyk.',
    path: '/artistes',
  })
}

export default async function ComposeursPage({ params, searchParams }: ArtistsPageParams) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  const query = parseCatalogQuery(safeLocale, resolvedSearchParams, {
    defaultSort: 'title',
    allowedSorts: ['title', 'collaborations'],
  })
  const [dictionary, result] = await Promise.all([
    getDictionary(safeLocale),
    getArtistCatalog(query),
  ])

  return (
    <ArtistCatalog
      locale={safeLocale}
      query={query}
      result={result}
      nav={{ home: dictionary.nav.home, artists: dictionary.nav.artists }}
      copy={dictionary.artistsPage}
    />
  )
}

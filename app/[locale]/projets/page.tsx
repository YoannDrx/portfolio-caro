import type { Metadata } from 'next'

import { getProjectCatalog } from '@/lib/catalog/projects'
import { parseCatalogQuery } from '@/lib/catalog/query'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n-config'
import { pageMetadata } from '@/lib/seo'

import { ProjectCatalog } from '@/components/catalog/project-catalog'

type ProjetsPageParams = {
  params: Promise<{
    locale: Locale
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({
  params,
}: Pick<ProjetsPageParams, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  return pageMetadata({
    locale: safeLocale,
    title: safeLocale === 'fr' ? 'Projets musicaux' : 'Music projects',
    description:
      safeLocale === 'fr'
        ? 'Catalogue de projets, albums, clips et collaborations gérés par Caroline Senyk.'
        : 'A catalogue of projects, albums, videos and collaborations managed by Caroline Senyk.',
    path: '/projets',
  })
}

export default async function ProjetsPage({ params, searchParams }: ProjetsPageParams) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  const query = parseCatalogQuery(safeLocale, resolvedSearchParams, {
    defaultSort: 'editorial',
    allowedSorts: ['editorial', 'year', 'title'],
  })
  const [dictionary, result] = await Promise.all([
    getDictionary(safeLocale),
    getProjectCatalog(query),
  ])

  return (
    <ProjectCatalog
      locale={safeLocale}
      query={query}
      result={result}
      nav={{ home: dictionary.nav.home, projects: dictionary.nav.projets }}
      copy={dictionary.projetsPage}
    />
  )
}

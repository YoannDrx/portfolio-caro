import { getArtistCatalog } from '@/lib/catalog/artists'
import { getFeaturedProjects } from '@/lib/catalog/projects'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n-config'
import { getAllExpertises } from '@/lib/prismaExpertiseUtils'

import { HomePage } from '@/components/sections/home-page'

type HomePageParams = {
  params: Promise<{
    locale: Locale
  }>
}

export default async function LocaleHome({ params }: HomePageParams) {
  const { locale } = await params
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  const [dictionary, projects, artistResult, expertises] = await Promise.all([
    getDictionary(safeLocale),
    getFeaturedProjects(safeLocale, 6),
    getArtistCatalog({
      locale: safeLocale,
      q: '',
      sort: 'title',
      order: 'asc',
      page: 1,
      pageSize: 6,
      view: 'grid',
    }),
    getAllExpertises(safeLocale, 3),
  ])

  return (
    <HomePage
      locale={safeLocale}
      layout={dictionary.layout}
      home={dictionary.home}
      projects={projects}
      artists={artistResult.items}
      expertises={expertises}
    />
  )
}

import type { Metadata } from 'next'

import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n-config'
import { getAllExpertises } from '@/lib/prismaExpertiseUtils'
import { pageMetadata } from '@/lib/seo'

import { ExpertisesPageClient } from '@/components/sections/expertises-page-client'

type ExpertisesPageParams = {
  params: Promise<{
    locale: Locale
  }>
}

export async function generateMetadata({ params }: ExpertisesPageParams): Promise<Metadata> {
  const { locale } = await params
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  return pageMetadata({
    locale: safeLocale,
    title: safeLocale === 'fr' ? 'Expertises' : 'Expertise',
    description:
      safeLocale === 'fr'
        ? "Droits d'auteur, édition musicale, droits voisins, contrats et accompagnement professionnel."
        : 'Copyright, music publishing, neighbouring rights, contracts and professional support.',
    path: '/expertises',
  })
}

export default async function ExpertisesPage({ params }: ExpertisesPageParams) {
  const { locale } = await params
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  const dictionary = await getDictionary(safeLocale)
  const expertises = await getAllExpertises(safeLocale)
  const copy = dictionary.expertisesPage

  return (
    <ExpertisesPageClient
      locale={safeLocale}
      expertises={expertises}
      nav={{
        home: dictionary.nav.home,
        expertises: dictionary.nav.expertises,
      }}
      copy={{
        description: copy.description,
        cardCta: copy.cardCta,
      }}
    />
  )
}

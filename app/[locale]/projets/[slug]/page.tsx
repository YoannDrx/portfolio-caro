import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n-config'
import {
  type WorkContribution,
  type WorkImage,
  getAdjacentWorks,
  getArtistsForWorkSlugs,
  getFeaturedWorkSlugs,
  getWorkBySlug,
  getWorkRelationCandidates,
} from '@/lib/prismaProjetsUtils'
import { pageMetadata } from '@/lib/seo'
import { buildWorkRelations, toSimpleWork } from '@/lib/workRelations'

import { ProjetDetailClient } from '@/components/sections/projet-detail-client'

// Generate static params for all work slugs
export async function generateStaticParams() {
  const slugs = await getFeaturedWorkSlugs()
  const locales: Locale[] = ['fr', 'en']

  const params: { locale: Locale; slug: string }[] = []

  locales.forEach((locale) => {
    slugs.forEach((slug) => {
      params.push({ locale, slug })
    })
  })

  return params
}

type WorkDetailPageParams = {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: Pick<WorkDetailPageParams, 'params'>): Promise<Metadata> {
  const { locale, slug } = await params
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  const work = await getWorkBySlug(slug, safeLocale)
  if (!work) return { title: safeLocale === 'fr' ? 'Projet introuvable' : 'Project not found' }
  const translation = work.translations[0]
  const title = translation?.title ?? work.slug
  const description = translation?.description?.trim()
  return pageMetadata({
    locale: safeLocale,
    title,
    description:
      description && description.length > 0
        ? description
        : safeLocale === 'fr'
          ? `Crédits et informations professionnelles pour ${title}.`
          : `Credits and professional information for ${title}.`,
    path: `/projets/${work.slug}`,
    image: assetPathToUrl(work.coverImage?.path),
  })
}

// Helper function to transform asset path to URL
function assetPathToUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  if (path.startsWith('public/')) {
    return `/${path.substring('public/'.length)}`
  }
  if (path.startsWith('/')) {
    return path
  }
  return `/${path}`
}

// Helper to create Spotify embed URL
function createSpotifyEmbedUrl(rawUrl: string | null): string | undefined {
  if (!rawUrl) return undefined
  try {
    const parsed = new URL(rawUrl)
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    const albumIndex = pathParts.findIndex((part) => part === 'album')
    if (albumIndex !== -1 && albumIndex + 1 < pathParts.length) {
      const albumId = pathParts[albumIndex + 1]
      return `https://open.spotify.com/embed/album/${albumId}`
    }
    return rawUrl.replace('https://open.spotify.com/', 'https://open.spotify.com/embed/')
  } catch {
    return rawUrl.replace('https://open.spotify.com/', 'https://open.spotify.com/embed/')
  }
}

export default async function WorkDetailPage({ params }: WorkDetailPageParams) {
  const { locale, slug } = await params
  const safeLocale = locale === 'en' ? 'en' : 'fr'
  const [work, dictionary, adjacentWorks, relationCandidates] = await Promise.all([
    getWorkBySlug(slug, safeLocale),
    getDictionary(safeLocale),
    getAdjacentWorks(slug, safeLocale),
    getWorkRelationCandidates(safeLocale, [slug]),
  ])
  const detailCopy = dictionary.projetDetail

  if (!work) {
    notFound()
  }

  const relations = buildWorkRelations(relationCandidates.map(toSimpleWork))

  // Extract data from Prisma work
  const translation = work.translations[0]
  const categoryTranslation = work.category?.translations[0]
  const labelTranslation = work.label?.translations[0]
  const translationDescription = translation?.description?.trim()
  const description =
    translationDescription &&
    translationDescription.length > 10 &&
    translationDescription !== 'See Details'
      ? translationDescription
      : undefined

  // Prepare project data for client component
  const projectData = {
    slug: work.slug,
    title: translation?.title ?? work.slug,
    subtitle: translation?.subtitle ?? undefined,
    description,
    coverImage: assetPathToUrl(work.coverImage?.path),
    coverImageAlt: work.coverImage?.alt ?? translation?.title ?? work.slug,
    category: categoryTranslation?.name,
    categorySlug: work.category?.slug,
    label: labelTranslation?.name,
    role: translation?.role ?? undefined,
    year: work.year ?? undefined,
    genre: work.genre ?? undefined,
    releaseDate: work.releaseDate ?? undefined,
    externalUrl: work.externalUrl?.trim() ?? undefined,
    youtubeUrl: work.youtubeUrl?.trim() ?? undefined,
    spotifyEmbedUrl: createSpotifyEmbedUrl(work.spotifyUrl),
  }
  const relatedClips = relations.projectToClips[slug] ?? []
  const relatedProjects = relations.clipToProjects[slug] ?? []

  const mapContributionToArtist = (contribution: WorkContribution, idPrefix?: string) => {
    const artistTranslation = contribution.artist.translations[0]
    const slug = contribution.artist.slug
    return {
      id: idPrefix ? `${idPrefix}-${slug}` : contribution.id,
      slug,
      name: artistTranslation?.name ?? 'Unknown Artist',
      image: assetPathToUrl(contribution.artist.image?.path),
      imageAlt: contribution.artist.image?.alt ?? artistTranslation?.name ?? 'Artist',
    }
  }

  const relatedArtists = await getArtistsForWorkSlugs(
    relatedProjects.map((project) => project.slug),
    safeLocale
  )
  const relatedProjectArtists = Array.from(
    new Map(
      relatedArtists.map((artist) => [artist.slug, { id: `related-${artist.slug}`, ...artist }])
    ).values()
  )

  // Prepare artists data
  const artists = (work.contributions ?? []).map((contribution) =>
    mapContributionToArtist(contribution)
  )

  // Prepare gallery data
  const gallery = (work.images ?? []).map((image: WorkImage) => ({
    id: image.id,
    path: assetPathToUrl(image.path) ?? '/images/placeholder.jpg',
    alt: image.alt ?? undefined,
  }))

  // Prepare navigation works
  const navPrevWork = adjacentWorks.previous
  const navNextWork = adjacentWorks.next

  return (
    <ProjetDetailClient
      locale={safeLocale}
      project={projectData}
      artists={artists}
      gallery={gallery}
      relatedClips={relatedClips}
      relatedProjects={relatedProjects}
      relatedProjectArtists={relatedProjectArtists}
      prevWork={navPrevWork}
      nextWork={navNextWork}
      nav={{
        home: dictionary.nav.home,
        projets: dictionary.nav.projets,
      }}
      copy={detailCopy}
    />
  )
}

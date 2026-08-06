import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { ArtistCatalogItem, ArtistCatalogResult, CatalogQuery } from './types'

function assetPathToUrl(path: string | null | undefined) {
  if (!path) return undefined
  if (/^https?:\/\//u.test(path) || path.startsWith('/')) return path
  return path.startsWith('public/') ? `/${path.slice(7)}` : `/${path}`
}

function artistWhere(query: CatalogQuery): Prisma.ArtistWhereInput {
  return {
    isActive: true,
    OR: query.q
      ? [
          { slug: { contains: query.q, mode: 'insensitive' } },
          {
            translations: {
              some: {
                locale: { in: Array.from(new Set([query.locale, 'fr'])) },
                name: { contains: query.q, mode: 'insensitive' },
              },
            },
          },
        ]
      : undefined,
  }
}

function artistSelect(locale: 'fr' | 'en') {
  return {
    id: true,
    slug: true,
    image: { select: { path: true, alt: true } },
    translations: {
      where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
      select: { locale: true, name: true },
    },
    _count: { select: { contributions: { where: { work: { isActive: true } } } } },
  } satisfies Prisma.ArtistSelect
}

type SelectedArtist = Prisma.ArtistGetPayload<{ select: ReturnType<typeof artistSelect> }>

function mapArtist(artist: SelectedArtist, locale: 'fr' | 'en'): ArtistCatalogItem {
  const name =
    artist.translations.find((translation) => translation.locale === locale)?.name ??
    artist.translations.find((translation) => translation.locale === 'fr')?.name ??
    artist.slug
  return {
    id: artist.id,
    slug: artist.slug,
    name,
    image: assetPathToUrl(artist.image?.path),
    imageAlt: artist.image?.alt ?? name,
    worksCount: artist._count.contributions,
  }
}

export async function getArtistCatalog(query: CatalogQuery): Promise<ArtistCatalogResult> {
  const search = query.q ?? ''
  const where = artistWhere(query)
  const [total, totalProjects] = await Promise.all([
    prisma.artist.count({ where }),
    prisma.work.count({ where: { isActive: true } }),
  ])
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize))
  const page = Math.min(query.page, pageCount)
  const skip = (page - 1) * query.pageSize
  const select = artistSelect(query.locale)

  let artists: SelectedArtist[]
  if (query.sort === 'collaborations') {
    artists = await prisma.artist.findMany({
      where,
      select,
      orderBy: [{ contributions: { _count: query.order } }, { slug: 'asc' }],
      skip,
      take: query.pageSize,
    })
  } else {
    const direction = query.order === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`
    const ids = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT a."id"
      FROM "Artist" a
      LEFT JOIN "ArtistTranslation" localized
        ON localized."artistId" = a."id" AND localized."locale" = ${query.locale}
      LEFT JOIN "ArtistTranslation" french
        ON french."artistId" = a."id" AND french."locale" = 'fr'
      WHERE a."isActive" = true
        AND (
          ${search} = ''
          OR COALESCE(localized."name", french."name", a."slug") ILIKE ${`%${search}%`}
          OR a."slug" ILIKE ${`%${search}%`}
        )
      ORDER BY COALESCE(localized."name", french."name", a."slug") ${direction}, a."slug" ${direction}
      OFFSET ${skip}
      LIMIT ${query.pageSize}
    `)
    const unordered = await prisma.artist.findMany({
      where: { id: { in: ids.map((item) => item.id) } },
      select,
    })
    const position = new Map(ids.map((item, index) => [item.id, index]))
    artists = unordered.sort(
      (first, second) =>
        (position.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
        (position.get(second.id) ?? Number.MAX_SAFE_INTEGER)
    )
  }

  const allArtistNames = await prisma.artist.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      translations: {
        where: { locale: { in: Array.from(new Set([query.locale, 'fr'])) } },
        select: { locale: true, name: true },
      },
    },
  })
  const letterCounts = new Map<string, number>()
  for (const item of allArtistNames) {
    const name =
      item.translations.find((translation) => translation.locale === query.locale)?.name ??
      item.translations.find((translation) => translation.locale === 'fr')?.name ??
      item.slug
    const letter = name.trim().charAt(0).toLocaleUpperCase(query.locale) || '#'
    letterCounts.set(letter, (letterCounts.get(letter) ?? 0) + 1)
  }

  return {
    items: artists.map((artist) => mapArtist(artist, query.locale)),
    total,
    page,
    pageSize: query.pageSize,
    pageCount,
    facets: {
      letters: Array.from(letterCounts.entries())
        .sort(([a], [b]) => a.localeCompare(b, query.locale))
        .map(([value, count]) => ({ value, label: value, count })),
    },
    totalProjects,
  }
}

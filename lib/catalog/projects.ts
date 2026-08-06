import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { CatalogFacets, CatalogQuery, PaginatedResult, ProjectCatalogItem } from './types'

function assetPathToUrl(path: string | null | undefined) {
  if (!path) return undefined
  if (/^https?:\/\//u.test(path) || path.startsWith('/')) return path
  return path.startsWith('public/') ? `/${path.slice(7)}` : `/${path}`
}

function projectWhere(query: CatalogQuery): Prisma.WorkWhereInput {
  return {
    isActive: true,
    category: query.category ? { slug: query.category } : undefined,
    label: query.label ? { slug: query.label } : undefined,
    year: query.year,
    contributions: query.artist ? { some: { artist: { slug: query.artist } } } : undefined,
    OR: query.q
      ? [
          { slug: { contains: query.q, mode: 'insensitive' } },
          {
            translations: {
              some: {
                locale: { in: Array.from(new Set([query.locale, 'fr'])) },
                title: { contains: query.q, mode: 'insensitive' },
              },
            },
          },
        ]
      : undefined,
  }
}

function projectSelect(locale: 'fr' | 'en') {
  return {
    id: true,
    slug: true,
    year: true,
    youtubeUrl: true,
    category: {
      select: {
        slug: true,
        color: true,
        translations: {
          where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
          select: { locale: true, name: true },
        },
      },
    },
    label: {
      select: {
        translations: {
          where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
          select: { locale: true, name: true },
        },
      },
    },
    coverImage: {
      select: {
        path: true,
        alt: true,
        width: true,
        height: true,
        blurDataUrl: true,
      },
    },
    translations: {
      where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
      select: { locale: true, title: true, subtitle: true, role: true },
    },
    contributions: {
      where: { artist: { isActive: true } },
      select: {
        artist: {
          select: {
            slug: true,
            translations: {
              where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
              select: { locale: true, name: true },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    },
  } satisfies Prisma.WorkSelect
}

type SelectedProject = Prisma.WorkGetPayload<{ select: ReturnType<typeof projectSelect> }>

function localized<T extends { locale: string }>(values: T[], locale: 'fr' | 'en') {
  return (
    values.find((value) => value.locale === locale) ?? values.find((value) => value.locale === 'fr')
  )
}

function mapProject(work: SelectedProject, locale: 'fr' | 'en'): ProjectCatalogItem {
  const translation = localized(work.translations, locale)
  const categoryTranslation = localized(work.category.translations, locale)
  const labelTranslation = work.label ? localized(work.label.translations, locale) : undefined
  return {
    id: work.id,
    slug: work.slug,
    title: translation?.title ?? work.slug,
    subtitle: translation?.subtitle ?? undefined,
    role: translation?.role ?? undefined,
    category: categoryTranslation?.name ?? work.category.slug,
    categorySlug: work.category.slug,
    categoryColor: work.category.color,
    label: labelTranslation?.name ?? undefined,
    coverImage: assetPathToUrl(work.coverImage?.path),
    coverImageAlt: work.coverImage?.alt ?? translation?.title ?? work.slug,
    coverImageWidth: work.coverImage?.width ?? undefined,
    coverImageHeight: work.coverImage?.height ?? undefined,
    coverImageBlurDataUrl: work.coverImage?.blurDataUrl ?? undefined,
    artists: work.contributions.map((contribution) => ({
      slug: contribution.artist.slug,
      name: localized(contribution.artist.translations, locale)?.name ?? contribution.artist.slug,
    })),
    youtubeUrl: work.youtubeUrl ?? undefined,
    year: work.year ?? undefined,
  }
}

async function getFacets(locale: 'fr' | 'en'): Promise<CatalogFacets> {
  const [categories, artists, labels, years] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, works: { some: { isActive: true } } },
      select: {
        slug: true,
        color: true,
        translations: {
          where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
          select: { locale: true, name: true },
        },
        _count: { select: { works: { where: { isActive: true } } } },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.artist.findMany({
      where: { isActive: true, contributions: { some: { work: { isActive: true } } } },
      select: {
        slug: true,
        translations: {
          where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
          select: { locale: true, name: true },
        },
        _count: { select: { contributions: { where: { work: { isActive: true } } } } },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.label.findMany({
      where: { isActive: true, works: { some: { isActive: true } } },
      select: {
        slug: true,
        translations: {
          where: { locale: { in: Array.from(new Set([locale, 'fr'])) } },
          select: { locale: true, name: true },
        },
        _count: { select: { works: { where: { isActive: true } } } },
      },
      orderBy: { order: 'asc' },
    }),
    prisma.work.groupBy({
      by: ['year'],
      where: { isActive: true, year: { not: null } },
      _count: { _all: true },
      orderBy: { year: 'desc' },
    }),
  ])

  return {
    categories: categories.map((item) => ({
      value: item.slug,
      label: localized(item.translations, locale)?.name ?? item.slug,
      count: item._count.works,
      color: item.color,
    })),
    artists: artists.map((item) => ({
      value: item.slug,
      label: localized(item.translations, locale)?.name ?? item.slug,
      count: item._count.contributions,
    })),
    labels: labels.map((item) => ({
      value: item.slug,
      label: localized(item.translations, locale)?.name ?? item.slug,
      count: item._count.works,
    })),
    years: years.flatMap((item) =>
      item.year === null
        ? []
        : [{ value: String(item.year), label: String(item.year), count: item._count._all }]
    ),
  }
}

export async function getProjectCatalog(
  query: CatalogQuery
): Promise<PaginatedResult<ProjectCatalogItem>> {
  const where = projectWhere(query)
  const total = await prisma.work.count({ where })
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize))
  const page = Math.min(query.page, pageCount)
  const skip = (page - 1) * query.pageSize
  const select = projectSelect(query.locale)

  let works: SelectedProject[]
  if (query.sort === 'title') {
    const filters: Prisma.Sql[] = [Prisma.sql`w."isActive" = true`]
    if (query.category) {
      filters.push(Prisma.sql`EXISTS (
        SELECT 1 FROM "Category" category
        WHERE category."id" = w."categoryId" AND category."slug" = ${query.category}
      )`)
    }
    if (query.label) {
      filters.push(Prisma.sql`EXISTS (
        SELECT 1 FROM "Label" label
        WHERE label."id" = w."labelId" AND label."slug" = ${query.label}
      )`)
    }
    if (query.artist) {
      filters.push(Prisma.sql`EXISTS (
        SELECT 1 FROM "Contribution" contribution
        JOIN "Artist" artist ON artist."id" = contribution."artistId"
        WHERE contribution."workId" = w."id" AND artist."slug" = ${query.artist}
      )`)
    }
    if (query.year !== undefined) filters.push(Prisma.sql`w."year" = ${query.year}`)
    if (query.q) {
      filters.push(Prisma.sql`(
        w."slug" ILIKE ${`%${query.q}%`}
        OR EXISTS (
          SELECT 1 FROM "WorkTranslation" translation
          WHERE translation."workId" = w."id"
            AND translation."locale" IN (${query.locale}, 'fr')
            AND translation."title" ILIKE ${`%${query.q}%`}
        )
      )`)
    }

    const direction = query.order === 'desc' ? Prisma.sql`DESC` : Prisma.sql`ASC`
    const ids = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT w."id"
      FROM "Work" w
      LEFT JOIN "WorkTranslation" localized
        ON localized."workId" = w."id" AND localized."locale" = ${query.locale}
      LEFT JOIN "WorkTranslation" french
        ON french."workId" = w."id" AND french."locale" = 'fr'
      WHERE ${Prisma.join(filters, ' AND ')}
      ORDER BY COALESCE(localized."title", french."title", w."slug") ${direction}, w."slug" ${direction}
      OFFSET ${skip}
      LIMIT ${query.pageSize}
    `)
    const unordered = await prisma.work.findMany({
      where: { id: { in: ids.map((item) => item.id) } },
      select,
    })
    const position = new Map(ids.map((item, index) => [item.id, index]))
    works = unordered.sort(
      (first, second) =>
        (position.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
        (position.get(second.id) ?? Number.MAX_SAFE_INTEGER)
    )
  } else {
    const orderBy: Prisma.WorkOrderByWithRelationInput[] =
      query.sort === 'year'
        ? [{ year: query.order }, { order: 'asc' }, { slug: 'asc' }]
        : [{ order: query.order }, { slug: 'asc' }]
    works = await prisma.work.findMany({ where, select, orderBy, skip, take: query.pageSize })
  }

  return {
    items: works.map((work) => mapProject(work, query.locale)),
    total,
    page,
    pageSize: query.pageSize,
    pageCount,
    facets: await getFacets(query.locale),
  }
}

export async function getFeaturedProjects(
  locale: 'fr' | 'en',
  take = 6
): Promise<ProjectCatalogItem[]> {
  const select = projectSelect(locale)
  const featured = await prisma.work.findMany({
    where: { isActive: true, isFeatured: true },
    select,
    orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    take,
  })

  if (featured.length >= take) return featured.map((work) => mapProject(work, locale))

  const fallback = await prisma.work.findMany({
    where: {
      isActive: true,
      id: { notIn: featured.map((work) => work.id) },
    },
    select,
    orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    take: take - featured.length,
  })

  return [...featured, ...fallback].map((work) => mapProject(work, locale))
}

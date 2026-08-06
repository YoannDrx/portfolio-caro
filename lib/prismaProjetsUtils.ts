import { cache } from 'react'

import type { Prisma } from '@prisma/client'

import type { Locale } from './i18n-config'
import { prisma } from './prisma'

/**
 * Transforme un chemin filesystem (public/images/...) en URL (/images/...)
 * pour le composant Next.js Image
 */
function assetPathToUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  // Si le chemin commence par 'public/', on retire ce préfixe
  if (path.startsWith('public/')) {
    return `/${path.substring('public/'.length)}`
  }
  // Si le chemin commence déjà par '/', on le retourne tel quel
  if (path.startsWith('/')) {
    return path
  }
  // Sinon, on ajoute '/' au début
  return `/${path}`
}

export type GalleryWork = {
  id: string
  slug: string
  title: string
  subtitle?: string
  category: string
  categorySlug: string
  coverImage: string
  coverImageAlt: string
  coverImageWidth?: number
  coverImageHeight?: number
  coverImageAspectRatio?: number
  coverImageBlurDataUrl?: string
  artists: string[]
  externalUrl?: string
  youtubeUrl?: string
  year?: number
  relatedProjectSlugs?: string[]
}

// Cache the projets data fetch for deduplication
export const getProjetsFromPrisma = cache(async (locale: Locale): Promise<GalleryWork[]> => {
  try {
    const works = await prisma.work.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: {
          include: {
            translations: {
              where: {
                locale,
              },
            },
          },
        },
        coverImage: true,
        translations: {
          where: {
            locale,
          },
        },
        contributions: {
          include: {
            artist: {
              include: {
                translations: {
                  where: {
                    locale,
                  },
                },
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    // Transform Prisma data to GalleryWork format
    const galleryWorks: GalleryWork[] = works.map((work) => {
      const translation = work.translations[0]
      const categoryTranslation = work.category.translations[0]

      return {
        id: work.id,
        slug: work.slug,
        title: translation?.title ?? work.slug,
        subtitle: translation?.subtitle ?? undefined,
        category: categoryTranslation?.name ?? 'Autres',
        categorySlug: work.category.slug,
        coverImage: assetPathToUrl(work.coverImage?.path) ?? '/images/placeholder.jpg',
        coverImageAlt: work.coverImage?.alt ?? translation?.title ?? work.slug,
        coverImageWidth: work.coverImage?.width ?? undefined,
        coverImageHeight: work.coverImage?.height ?? undefined,
        coverImageAspectRatio: work.coverImage?.aspectRatio ?? undefined,
        coverImageBlurDataUrl: work.coverImage?.blurDataUrl ?? undefined,
        relatedProjectSlugs:
          (work as unknown as { relatedProjectSlugs?: string[] }).relatedProjectSlugs ?? undefined,
        artists: work.contributions.map((contrib) => {
          const artistTranslation = contrib.artist.translations[0]
          return artistTranslation?.name ?? ''
        }),
        externalUrl: work.externalUrl ?? undefined,
        youtubeUrl: work.youtubeUrl ?? undefined,
        year: work.year ?? undefined,
      }
    })

    return galleryWorks
  } catch {
    return []
  }
})

// Get all categories with translations
export const getProjetsCategoriesFromPrisma = cache(async (locale: Locale) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        translations: {
          where: {
            locale,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.translations[0]?.name || cat.slug,
      color: cat.color,
    }))
  } catch {
    return []
  }
})

export type WorkImage = Prisma.AssetGetPayload<{
  select: {
    id: true
    path: true
    alt: true
    blurDataUrl: true
    width: true
    height: true
    aspectRatio: true
  }
}>

export type WorkContribution = Prisma.ContributionGetPayload<{
  include: {
    artist: {
      include: {
        translations: {
          where: {
            locale: Locale
          }
        }
        image: true
      }
    }
  }
}>

export type WorkWithDetails = Prisma.WorkGetPayload<{
  include: {
    category: {
      include: {
        translations: {
          where: {
            locale: Locale
          }
        }
      }
    }
    label: {
      include: {
        translations: {
          where: {
            locale: Locale
          }
        }
      }
    }
    coverImage: true
    images: true
    translations: {
      where: {
        locale: Locale
      }
    }
    contributions: {
      include: {
        artist: {
          include: {
            translations: {
              where: {
                locale: Locale
              }
            }
            image: true
          }
        }
      }
      orderBy: {
        order: 'asc'
      }
    }
  }
}>

// Get a single work by slug with full details
export const getWorkBySlug = cache(
  async (slug: string, locale: Locale): Promise<WorkWithDetails | null> => {
    try {
      const work = await prisma.work.findUnique({
        where: { slug },
        include: {
          category: {
            include: {
              translations: {
                where: {
                  locale,
                },
              },
            },
          },
          label: {
            include: {
              translations: {
                where: {
                  locale,
                },
              },
            },
          },
          coverImage: true,
          images: true,
          translations: {
            where: {
              locale,
            },
          },
          contributions: {
            include: {
              artist: {
                include: {
                  translations: {
                    where: {
                      locale,
                    },
                  },
                  image: true,
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      })

      return work
    } catch {
      return null
    }
  }
)

// Get all work slugs for generateStaticParams
export async function getAllWorkSlugs(): Promise<string[]> {
  try {
    const works = await prisma.work.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
      },
    })

    return works.map((work) => work.slug)
  } catch {
    return []
  }
}

export async function getFeaturedWorkSlugs(limit = 12): Promise<string[]> {
  const works = await prisma.work.findMany({
    where: { isActive: true, isFeatured: true },
    select: { slug: true },
    orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    take: limit,
  })
  return works.map((work) => work.slug)
}

type AdjacentWork = { slug: string; title: string }

export async function getAdjacentWorks(
  slug: string,
  locale: Locale
): Promise<{ previous: AdjacentWork | null; next: AdjacentWork | null }> {
  const current = await prisma.work.findFirst({
    where: { slug, isActive: true },
    select: { order: true, createdAt: true, slug: true },
  })
  if (!current) return { previous: null, next: null }

  const select = {
    slug: true,
    translations: { where: { locale }, select: { title: true }, take: 1 },
  } satisfies Prisma.WorkSelect
  const [previous, next] = await Promise.all([
    prisma.work.findFirst({
      where: {
        isActive: true,
        OR: [
          { order: { lt: current.order } },
          { order: current.order, createdAt: { lt: current.createdAt } },
          { order: current.order, createdAt: current.createdAt, slug: { lt: current.slug } },
        ],
      },
      select,
      orderBy: [{ order: 'desc' }, { createdAt: 'desc' }, { slug: 'desc' }],
    }),
    prisma.work.findFirst({
      where: {
        isActive: true,
        OR: [
          { order: { gt: current.order } },
          { order: current.order, createdAt: { gt: current.createdAt } },
          { order: current.order, createdAt: current.createdAt, slug: { gt: current.slug } },
        ],
      },
      select,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }, { slug: 'asc' }],
    }),
  ])

  const map = (work: typeof previous): AdjacentWork | null =>
    work ? { slug: work.slug, title: work.translations[0]?.title ?? work.slug } : null
  return { previous: map(previous), next: map(next) }
}

export async function getWorkRelationCandidates(
  locale: Locale,
  relevantSlugs: string[]
): Promise<GalleryWork[]> {
  const works = await prisma.work.findMany({
    where: {
      isActive: true,
      OR: [
        { slug: { in: relevantSlugs } },
        { category: { slug: { in: ['clip', 'clips', 'music-video', 'music-videos'] } } },
        {
          category: {
            translations: {
              some: {
                locale,
                OR: [
                  { name: { contains: 'clip', mode: 'insensitive' } },
                  { name: { contains: 'video', mode: 'insensitive' } },
                ],
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      year: true,
      externalUrl: true,
      youtubeUrl: true,
      coverImage: true,
      translations: { where: { locale }, select: { title: true, subtitle: true }, take: 1 },
      category: {
        select: {
          slug: true,
          translations: { where: { locale }, select: { name: true }, take: 1 },
        },
      },
      contributions: {
        where: { artist: { isActive: true } },
        select: {
          artist: {
            select: { translations: { where: { locale }, select: { name: true }, take: 1 } },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: [{ order: 'asc' }, { slug: 'asc' }],
  })

  return works.map((work) => ({
    id: work.id,
    slug: work.slug,
    title: work.translations[0]?.title ?? work.slug,
    subtitle: work.translations[0]?.subtitle ?? undefined,
    category: work.category.translations[0]?.name ?? work.category.slug,
    categorySlug: work.category.slug,
    coverImage: assetPathToUrl(work.coverImage?.path) ?? '/images/placeholder.jpg',
    coverImageAlt: work.coverImage?.alt ?? work.translations[0]?.title ?? work.slug,
    coverImageWidth: work.coverImage?.width ?? undefined,
    coverImageHeight: work.coverImage?.height ?? undefined,
    coverImageAspectRatio: work.coverImage?.aspectRatio ?? undefined,
    coverImageBlurDataUrl: work.coverImage?.blurDataUrl ?? undefined,
    artists: work.contributions.map(
      (contribution) => contribution.artist.translations[0]?.name ?? ''
    ),
    externalUrl: work.externalUrl ?? undefined,
    youtubeUrl: work.youtubeUrl ?? undefined,
    year: work.year ?? undefined,
  }))
}

export async function getArtistsForWorkSlugs(slugs: string[], locale: Locale) {
  if (slugs.length === 0) return []
  const contributions = await prisma.contribution.findMany({
    where: { work: { slug: { in: slugs }, isActive: true }, artist: { isActive: true } },
    select: {
      artist: {
        select: {
          slug: true,
          image: { select: { path: true, alt: true } },
          translations: { where: { locale }, select: { name: true }, take: 1 },
        },
      },
    },
    orderBy: { order: 'asc' },
  })

  return contributions.map(({ artist }) => ({
    slug: artist.slug,
    name: artist.translations[0]?.name ?? artist.slug,
    image: assetPathToUrl(artist.image?.path),
    imageAlt: artist.image?.alt ?? artist.translations[0]?.name ?? artist.slug,
  }))
}

// ============================================
// ARTISTS
// ============================================

export type GalleryArtist = {
  id: string
  slug: string
  name: string
  bio?: string
  image?: string
  imageAlt?: string
  externalUrl?: string
  worksCount: number
}

export type ArtistWithContributions = Prisma.ArtistGetPayload<{
  include: {
    translations: {
      where: {
        locale: Locale
      }
    }
    image: true
    links: {
      orderBy: {
        order: 'asc'
      }
    }
    contributions: {
      where: {
        work: {
          isActive: true
        }
      }
      include: {
        work: {
          include: {
            coverImage: true
            translations: {
              where: {
                locale: Locale
              }
            }
            category: {
              include: {
                translations: {
                  where: {
                    locale: Locale
                  }
                }
              }
            }
          }
        }
      }
      orderBy: {
        order: 'asc'
      }
    }
  }
}>

/**
 * Toutes les fiches artistes actives sont publiques, même lorsqu'une image ou
 * une contribution manque encore. L'interface fournit un état de repli pour
 * ces données incomplètes au lieu de masquer la fiche.
 */
const activeArtistWhere = {
  isActive: true,
} satisfies Prisma.ArtistWhereInput

// Get all artists with translations
// NOTE: cache() is used for performance. If image paths appear incorrect after DB changes,
// restart the dev server to clear React's in-memory cache.
export const getArtistsFromPrisma = cache(async (locale: Locale): Promise<GalleryArtist[]> => {
  try {
    const artists = await prisma.artist.findMany({
      where: activeArtistWhere,
      include: {
        translations: {
          where: {
            locale,
          },
        },
        image: true,
        contributions: {
          where: {
            work: {
              isActive: true,
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return artists.map((artist) => {
      const translation = artist.translations[0]
      const uniqueWorkIds = new Set(
        (artist.contributions ?? []).map((contribution) => contribution.workId)
      )
      return {
        id: artist.id,
        slug: artist.slug,
        name: translation?.name ?? artist.slug,
        bio: translation?.bio ?? undefined,
        image: assetPathToUrl(artist.image?.path),
        imageAlt: artist.image?.alt ?? translation?.name ?? artist.slug,
        externalUrl: artist.externalUrl ?? undefined,
        worksCount: uniqueWorkIds.size,
      }
    })
  } catch {
    return []
  }
})

// Get a single artist by slug with full details
export const getArtistBySlug = cache(
  async (slug: string, locale: Locale): Promise<ArtistWithContributions | null> => {
    try {
      const artist = await prisma.artist.findFirst({
        where: {
          ...activeArtistWhere,
          slug,
        },
        include: {
          translations: {
            where: {
              locale,
            },
          },
          image: true,
          links: {
            orderBy: {
              order: 'asc',
            },
          },
          contributions: {
            where: {
              work: {
                isActive: true,
              },
            },
            include: {
              work: {
                include: {
                  coverImage: true,
                  translations: {
                    where: {
                      locale,
                    },
                  },
                  category: {
                    include: {
                      translations: {
                        where: {
                          locale,
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      })

      return artist
    } catch {
      return null
    }
  }
)

// Get all artist slugs for generateStaticParams
export async function getAllArtistSlugs(): Promise<string[]> {
  try {
    const artists = await prisma.artist.findMany({
      where: activeArtistWhere,
      orderBy: [
        {
          order: 'asc',
        },
        {
          createdAt: 'asc',
        },
        {
          slug: 'asc',
        },
      ],
      select: {
        slug: true,
      },
    })

    return artists.map((artist) => artist.slug)
  } catch {
    return []
  }
}

export async function getFeaturedArtistSlugs(limit = 12): Promise<string[]> {
  const artists = await prisma.artist.findMany({
    where: activeArtistWhere,
    select: { slug: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }, { slug: 'asc' }],
    take: limit,
  })
  return artists.map((artist) => artist.slug)
}

// Get previous/next artists based on order field
export async function getAdjacentArtists(
  slug: string,
  locale: Locale
): Promise<{
  previous: { slug: string; name: string } | null
  next: { slug: string; name: string } | null
}> {
  try {
    const current = await prisma.artist.findFirst({
      where: { ...activeArtistWhere, slug },
      select: { order: true, createdAt: true, slug: true },
    })
    if (!current) return { previous: null, next: null }
    const select = {
      slug: true,
      translations: { where: { locale }, select: { name: true }, take: 1 },
    } satisfies Prisma.ArtistSelect
    const [previousArtist, nextArtist] = await Promise.all([
      prisma.artist.findFirst({
        where: {
          ...activeArtistWhere,
          OR: [
            { order: { lt: current.order } },
            { order: current.order, createdAt: { lt: current.createdAt } },
            { order: current.order, createdAt: current.createdAt, slug: { lt: current.slug } },
          ],
        },
        select,
        orderBy: [{ order: 'desc' }, { createdAt: 'desc' }, { slug: 'desc' }],
      }),
      prisma.artist.findFirst({
        where: {
          ...activeArtistWhere,
          OR: [
            { order: { gt: current.order } },
            { order: current.order, createdAt: { gt: current.createdAt } },
            { order: current.order, createdAt: current.createdAt, slug: { gt: current.slug } },
          ],
        },
        select,
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }, { slug: 'asc' }],
      }),
    ])

    const mapArtist = (artist: typeof previousArtist) =>
      artist
        ? {
            slug: artist.slug,
            name: artist.translations[0]?.name ?? artist.slug,
          }
        : null

    return {
      previous: mapArtist(previousArtist),
      next: mapArtist(nextArtist),
    }
  } catch {
    return { previous: null, next: null }
  }
}

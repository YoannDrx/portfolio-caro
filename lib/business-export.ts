import { prisma } from '@/lib/prisma'

export const BUSINESS_EXPORT_VERSION = 1

export async function buildBusinessExport() {
  const [assets, categories, labels, artists, works, expertises, cv] = await Promise.all([
    prisma.asset.findMany({
      select: {
        path: true,
        alt: true,
        blurDataUrl: true,
        width: true,
        height: true,
        aspectRatio: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { path: 'asc' },
    }),
    prisma.category.findMany({
      select: {
        slug: true,
        color: true,
        icon: true,
        order: true,
        isActive: true,
        coverImage: { select: { path: true } },
        translations: {
          select: { locale: true, name: true, description: true },
          orderBy: { locale: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    }),
    prisma.label.findMany({
      select: {
        slug: true,
        website: true,
        order: true,
        isActive: true,
        image: { select: { path: true } },
        translations: {
          select: { locale: true, name: true, description: true },
          orderBy: { locale: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    }),
    prisma.artist.findMany({
      select: {
        slug: true,
        externalUrl: true,
        order: true,
        isActive: true,
        image: { select: { path: true } },
        translations: {
          select: { locale: true, name: true, bio: true },
          orderBy: { locale: 'asc' },
        },
        links: {
          select: { platform: true, url: true, label: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    }),
    prisma.work.findMany({
      select: {
        slug: true,
        category: { select: { slug: true } },
        label: { select: { slug: true } },
        coverImage: { select: { path: true } },
        images: { select: { path: true }, orderBy: { path: 'asc' } },
        year: true,
        productionCompanySlugs: true,
        status: true,
        spotifyUrl: true,
        youtubeUrl: true,
        externalUrl: true,
        releaseDate: true,
        genre: true,
        order: true,
        isActive: true,
        isFeatured: true,
        translations: {
          select: {
            locale: true,
            title: true,
            subtitle: true,
            description: true,
            role: true,
          },
          orderBy: { locale: 'asc' },
        },
        contributions: {
          select: { artist: { select: { slug: true } }, role: true, order: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    }),
    prisma.expertise.findMany({
      select: {
        slug: true,
        order: true,
        isActive: true,
        coverImage: { select: { path: true } },
        images: { select: { path: true }, orderBy: { path: 'asc' } },
        translations: {
          select: {
            locale: true,
            title: true,
            subtitle: true,
            description: true,
            content: true,
          },
          orderBy: { locale: 'asc' },
        },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    }),
    prisma.cV.findFirst({
      include: {
        photoAsset: { select: { path: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            translations: { orderBy: { locale: 'asc' } },
            items: {
              orderBy: { order: 'asc' },
              include: { translations: { orderBy: { locale: 'asc' } } },
            },
          },
        },
        skills: {
          orderBy: { order: 'asc' },
          include: { translations: { orderBy: { locale: 'asc' } } },
        },
        socialLinks: { orderBy: { order: 'asc' } },
      },
    }),
  ])

  return {
    metadata: {
      format: 'portfolio-caro-business-export',
      version: BUSINESS_EXPORT_VERSION,
      generatedAt: new Date().toISOString(),
      excludedModels: [
        'User',
        'Account',
        'Session',
        'Invitation',
        'Verification',
        'AuditLog',
        'Notification',
        'PreviewToken',
        'ExportHistory',
        'WorkVersion',
      ],
      counts: {
        assets: assets.length,
        categories: categories.length,
        labels: labels.length,
        artists: artists.length,
        works: works.length,
        expertises: expertises.length,
        cv: cv ? 1 : 0,
      },
    },
    data: { assets, categories, labels, artists, works, expertises, cv },
  }
}

export type BusinessExport = Awaited<ReturnType<typeof buildBusinessExport>>

import { prisma } from '@/lib/prisma'

export type DashboardStats = {
  works: { total: number; active: number; inactive: number }
  artists: { total: number; active: number; inactive: number }
  categories: { total: number; active: number }
  labels: { total: number; active: number }
  assets: { total: number; orphaned: number }
  lastActivity: {
    work: { id: string; title: string; createdAt: string } | null
    artist: { id: string; name: string; createdAt: string } | null
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalWorks,
    activeWorks,
    inactiveWorks,
    totalArtists,
    activeArtists,
    totalCategories,
    activeCategories,
    totalLabels,
    activeLabels,
    totalAssets,
    orphanedAssets,
    lastWork,
    lastArtist,
  ] = await Promise.all([
    prisma.work.count(),
    prisma.work.count({ where: { isActive: true } }),
    prisma.work.count({ where: { isActive: false } }),
    prisma.artist.count(),
    prisma.artist.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.label.count(),
    prisma.label.count({ where: { isActive: true } }),
    prisma.asset.count(),
    prisma.asset.count({
      where: {
        AND: [
          { workCover: { none: {} } },
          { workImages: { none: {} } },
          { artistImages: { none: {} } },
          { categoryImages: { none: {} } },
          { labelImages: { none: {} } },
          { expertiseCover: { none: {} } },
          { expertiseImages: { none: {} } },
        ],
      },
    }),
    prisma.work.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        translations: { where: { locale: 'fr' }, select: { title: true }, take: 1 },
      },
    }),
    prisma.artist.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        translations: { where: { locale: 'fr' }, select: { name: true }, take: 1 },
      },
    }),
  ])

  return {
    works: { total: totalWorks, active: activeWorks, inactive: inactiveWorks },
    artists: {
      total: totalArtists,
      active: activeArtists,
      inactive: totalArtists - activeArtists,
    },
    categories: { total: totalCategories, active: activeCategories },
    labels: { total: totalLabels, active: activeLabels },
    assets: { total: totalAssets, orphaned: orphanedAssets },
    lastActivity: {
      work: lastWork
        ? {
            id: lastWork.id,
            title: lastWork.translations[0]?.title ?? 'Sans titre',
            createdAt: lastWork.createdAt.toISOString(),
          }
        : null,
      artist: lastArtist
        ? {
            id: lastArtist.id,
            name: lastArtist.translations[0]?.name ?? 'Sans nom',
            createdAt: lastArtist.createdAt.toISOString(),
          }
        : null,
    },
  }
}

import type { MetadataRoute } from 'next'

import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [works, artists, expertises] = await Promise.all([
    prisma.work.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.artist.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.expertise.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ])
  const entries: MetadataRoute.Sitemap = []

  for (const locale of ['fr', 'en'] as const) {
    for (const path of ['', '/projets', '/artistes', '/expertises', '/contact']) {
      entries.push({
        url: new URL(`/${locale}${path}`, SITE_URL).toString(),
        changeFrequency: path ? 'weekly' : 'monthly',
        priority: path ? 0.8 : 1,
      })
    }
    for (const work of works) {
      entries.push({
        url: new URL(`/${locale}/projets/${work.slug}`, SITE_URL).toString(),
        lastModified: work.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
    for (const artist of artists) {
      entries.push({
        url: new URL(`/${locale}/artistes/${artist.slug}`, SITE_URL).toString(),
        lastModified: artist.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
    for (const expertise of expertises) {
      entries.push({
        url: new URL(`/${locale}/expertises/${expertise.slug}`, SITE_URL).toString(),
        lastModified: expertise.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}

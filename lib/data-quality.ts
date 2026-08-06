import { prisma } from '@/lib/prisma'

export type DataQualitySeverity = 'error' | 'warning' | 'info'
export type DataQualityEntity = 'artist' | 'work' | 'asset'

export type DataQualityIssue = {
  id: string
  entity: DataQualityEntity
  entityId: string
  slug: string | null
  label: string
  code: string
  field: string
  severity: DataQualitySeverity
  message: string
  editPath: string
}

export type DataQualityReport = {
  generatedAt: string
  summary: {
    total: number
    errors: number
    warnings: number
    info: number
    artists: number
    works: number
    assets: number
  }
  issues: DataQualityIssue[]
}

function getTranslation<T extends { locale: string }>(translations: T[], locale: string) {
  return translations.find((translation) => translation.locale === locale)
}

export async function getDataQualityReport(locale: 'fr' | 'en' = 'fr') {
  const [artists, works, assets] = await Promise.all([
    prisma.artist.findMany({
      select: {
        id: true,
        slug: true,
        isActive: true,
        imageId: true,
        translations: { select: { locale: true, name: true, bio: true } },
        _count: {
          select: {
            links: true,
            contributions: { where: { work: { isActive: true } } },
          },
        },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    }),
    prisma.work.findMany({
      select: {
        id: true,
        slug: true,
        isActive: true,
        coverImageId: true,
        categoryId: true,
        translations: { select: { locale: true, title: true, role: true } },
      },
      orderBy: [{ order: 'asc' }, { slug: 'asc' }],
    }),
    prisma.asset.findMany({
      select: {
        id: true,
        path: true,
        alt: true,
        width: true,
        height: true,
        _count: {
          select: {
            workImages: true,
            workCover: true,
            categoryImages: true,
            labelImages: true,
            artistImages: true,
            expertiseImages: true,
            expertiseCover: true,
            cvPhotos: true,
          },
        },
      },
      orderBy: { path: 'asc' },
    }),
  ])

  const issues: DataQualityIssue[] = []

  const pushArtistIssue = (
    artist: (typeof artists)[number],
    code: string,
    field: string,
    severity: DataQualitySeverity,
    message: string
  ) => {
    const translation = getTranslation(artist.translations, locale)
    const fallback = getTranslation(artist.translations, 'fr') ?? artist.translations[0]
    issues.push({
      id: `${artist.id}:${code}`,
      entity: 'artist',
      entityId: artist.id,
      slug: artist.slug,
      label: translation?.name ?? fallback?.name ?? artist.slug,
      code,
      field,
      severity,
      message,
      editPath: `/admin/artistes/${artist.id}`,
    })
  }

  for (const artist of artists) {
    if (!artist.imageId) {
      pushArtistIssue(artist, 'artist.missing_image', 'imageId', 'warning', 'Portrait manquant')
    }
    const bioFr = getTranslation(artist.translations, 'fr')?.bio?.trim()
    const bioEn = getTranslation(artist.translations, 'en')?.bio?.trim()
    if (!bioFr) {
      pushArtistIssue(
        artist,
        'artist.missing_bio_fr',
        'bioFr',
        'warning',
        'Biographie FR manquante'
      )
    }
    if (!bioEn) {
      pushArtistIssue(artist, 'artist.missing_bio_en', 'bioEn', 'info', 'Biographie EN manquante')
    }
    if (artist._count.links === 0) {
      pushArtistIssue(artist, 'artist.missing_links', 'links', 'info', 'Aucun lien officiel')
    }
    if (artist._count.contributions === 0) {
      pushArtistIssue(
        artist,
        'artist.missing_contributions',
        'contributions',
        'warning',
        'Aucune collaboration publiée'
      )
    }
  }

  for (const work of works) {
    const translation = getTranslation(work.translations, locale)
    const fallback = getTranslation(work.translations, 'fr') ?? work.translations[0]
    const label = translation?.title ?? fallback?.title ?? work.slug
    const add = (code: string, field: string, severity: DataQualitySeverity, message: string) => {
      issues.push({
        id: `${work.id}:${code}`,
        entity: 'work',
        entityId: work.id,
        slug: work.slug,
        label,
        code,
        field,
        severity,
        message,
        editPath: `/admin/projets/${work.id}`,
      })
    }

    if (!work.coverImageId) add('work.missing_cover', 'coverImageId', 'warning', 'Cover manquante')
    if (!getTranslation(work.translations, 'fr')?.title.trim()) {
      add('work.missing_title_fr', 'titleFr', 'error', 'Titre FR manquant')
    }
    if (!getTranslation(work.translations, 'en')?.title.trim()) {
      add('work.missing_title_en', 'titleEn', 'info', 'Titre EN manquant')
    }
    if (!getTranslation(work.translations, 'fr')?.role?.trim()) {
      add('work.missing_role_fr', 'roleFr', 'info', 'Rôle de Caroline non renseigné')
    }
  }

  for (const asset of assets) {
    const usageCount = Object.values(asset._count).reduce((total, count) => total + count, 0)
    const add = (code: string, field: string, severity: DataQualitySeverity, message: string) => {
      issues.push({
        id: `${asset.id}:${code}`,
        entity: 'asset',
        entityId: asset.id,
        slug: null,
        label: asset.path,
        code,
        field,
        severity,
        message,
        editPath: `/admin/medias?asset=${encodeURIComponent(asset.id)}`,
      })
    }

    if (usageCount === 0) add('asset.orphan', 'relations', 'info', 'Média non utilisé')
    if (!asset.alt?.trim()) add('asset.missing_alt', 'alt', 'warning', 'Texte alternatif manquant')
    if (!asset.width || !asset.height) {
      add('asset.missing_dimensions', 'dimensions', 'warning', 'Dimensions manquantes')
    }
  }

  const count = (severity: DataQualitySeverity) =>
    issues.filter((issue) => issue.severity === severity).length
  const entityCount = (entity: DataQualityEntity) =>
    issues.filter((issue) => issue.entity === entity).length

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: issues.length,
      errors: count('error'),
      warnings: count('warning'),
      info: count('info'),
      artists: entityCount('artist'),
      works: entityCount('work'),
      assets: entityCount('asset'),
    },
    issues,
  } satisfies DataQualityReport
}

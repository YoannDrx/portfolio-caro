/* eslint-disable no-console */
import { Prisma } from '@prisma/client'

import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { BusinessExport } from '../../lib/business-export'
import { loadDataEnvironment } from './environment'

function getArgument(name: string) {
  const prefix = `--${name}=`
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
}

function assertExport(value: unknown): asserts value is BusinessExport {
  if (!value || typeof value !== 'object') throw new Error('Invalid export payload.')
  const candidate = value as Partial<BusinessExport>
  if (
    candidate.metadata?.format !== 'portfolio-caro-business-export' ||
    candidate.metadata.version !== 1 ||
    !candidate.data
  ) {
    throw new Error('Unsupported business export format.')
  }
}

async function main() {
  const environment = loadDataEnvironment()
  const fileArgument = getArgument('file')
  if (!fileArgument) throw new Error('Missing --file=/absolute/or/relative/export.json')

  const file = resolve(process.cwd(), fileArgument)
  const bytes = await readFile(file)
  const fingerprint = createHash('sha256').update(bytes).digest('hex').slice(0, 12)
  const payload: unknown = JSON.parse(bytes.toString('utf8'))
  assertExport(payload)

  const { prisma } = await import('../../lib/prisma')
  const [assetPaths, categorySlugs, labelSlugs, artistSlugs, workSlugs, expertiseSlugs] =
    await Promise.all([
      prisma.asset.findMany({ select: { path: true } }),
      prisma.category.findMany({ select: { slug: true } }),
      prisma.label.findMany({ select: { slug: true } }),
      prisma.artist.findMany({ select: { slug: true } }),
      prisma.work.findMany({ select: { slug: true } }),
      prisma.expertise.findMany({ select: { slug: true } }),
    ])

  const countChanges = (incoming: string[], existing: string[]) => {
    const known = new Set(existing)
    return {
      create: incoming.filter((value) => !known.has(value)).length,
      update: incoming.filter((value) => known.has(value)).length,
    }
  }

  const changes = {
    assets: countChanges(
      payload.data.assets.map((item) => item.path),
      assetPaths.map((item) => item.path)
    ),
    categories: countChanges(
      payload.data.categories.map((item) => item.slug),
      categorySlugs.map((item) => item.slug)
    ),
    labels: countChanges(
      payload.data.labels.map((item) => item.slug),
      labelSlugs.map((item) => item.slug)
    ),
    artists: countChanges(
      payload.data.artists.map((item) => item.slug),
      artistSlugs.map((item) => item.slug)
    ),
    works: countChanges(
      payload.data.works.map((item) => item.slug),
      workSlugs.map((item) => item.slug)
    ),
    expertises: countChanges(
      payload.data.expertises.map((item) => item.slug),
      expertiseSlugs.map((item) => item.slug)
    ),
  }

  console.log(JSON.stringify({ file, fingerprint, environment, changes }, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log(`Dry-run only. Apply with --apply --confirm=${fingerprint}`)
    await prisma.$disconnect()
    return
  }

  if (getArgument('confirm') !== fingerprint) {
    throw new Error(`Import confirmation mismatch. Expected --confirm=${fingerprint}`)
  }
  if (
    environment === 'production' &&
    process.env.CONFIRM_WRITE_PRODUCTION !== 'WRITE_PRODUCTION_DATA'
  ) {
    throw new Error(
      'Production import refused. Set CONFIRM_WRITE_PRODUCTION=WRITE_PRODUCTION_DATA.'
    )
  }

  await prisma.$transaction(
    async (tx) => {
      for (const asset of payload.data.assets) {
        await tx.asset.upsert({
          where: { path: asset.path },
          create: {
            path: asset.path,
            alt: asset.alt,
            blurDataUrl: asset.blurDataUrl,
            width: asset.width,
            height: asset.height,
            aspectRatio: asset.aspectRatio,
          },
          update: {
            alt: asset.alt,
            blurDataUrl: asset.blurDataUrl,
            width: asset.width,
            height: asset.height,
            aspectRatio: asset.aspectRatio,
          },
        })
      }

      for (const category of payload.data.categories) {
        const record = await tx.category.upsert({
          where: { slug: category.slug },
          create: {
            slug: category.slug,
            color: category.color,
            icon: category.icon,
            order: category.order,
            isActive: category.isActive,
            coverImage: category.coverImage
              ? { connect: { path: category.coverImage.path } }
              : undefined,
          },
          update: {
            color: category.color,
            icon: category.icon,
            order: category.order,
            isActive: category.isActive,
            coverImage: category.coverImage
              ? { connect: { path: category.coverImage.path } }
              : undefined,
          },
        })
        for (const translation of category.translations) {
          await tx.categoryTranslation.upsert({
            where: { categoryId_locale: { categoryId: record.id, locale: translation.locale } },
            create: { ...translation, categoryId: record.id },
            update: { name: translation.name, description: translation.description },
          })
        }
      }

      for (const label of payload.data.labels) {
        const record = await tx.label.upsert({
          where: { slug: label.slug },
          create: {
            slug: label.slug,
            website: label.website,
            order: label.order,
            isActive: label.isActive,
            image: label.image ? { connect: { path: label.image.path } } : undefined,
          },
          update: {
            website: label.website,
            order: label.order,
            isActive: label.isActive,
            image: label.image ? { connect: { path: label.image.path } } : undefined,
          },
        })
        for (const translation of label.translations) {
          await tx.labelTranslation.upsert({
            where: { labelId_locale: { labelId: record.id, locale: translation.locale } },
            create: { ...translation, labelId: record.id },
            update: { name: translation.name, description: translation.description },
          })
        }
      }

      for (const artist of payload.data.artists) {
        const record = await tx.artist.upsert({
          where: { slug: artist.slug },
          create: {
            slug: artist.slug,
            externalUrl: artist.externalUrl,
            order: artist.order,
            isActive: artist.isActive,
            image: artist.image ? { connect: { path: artist.image.path } } : undefined,
          },
          update: {
            externalUrl: artist.externalUrl,
            order: artist.order,
            isActive: artist.isActive,
            image: artist.image ? { connect: { path: artist.image.path } } : undefined,
          },
        })
        for (const translation of artist.translations) {
          await tx.artistTranslation.upsert({
            where: { artistId_locale: { artistId: record.id, locale: translation.locale } },
            create: { ...translation, artistId: record.id },
            update: { name: translation.name, bio: translation.bio },
          })
        }
        for (const link of artist.links) {
          await tx.artistLink.upsert({
            where: { artistId_url: { artistId: record.id, url: link.url } },
            create: { ...link, artistId: record.id },
            update: { platform: link.platform, label: link.label, order: link.order },
          })
        }
      }

      for (const work of payload.data.works) {
        const record = await tx.work.upsert({
          where: { slug: work.slug },
          create: {
            slug: work.slug,
            category: { connect: { slug: work.category.slug } },
            label: work.label ? { connect: { slug: work.label.slug } } : undefined,
            coverImage: work.coverImage ? { connect: { path: work.coverImage.path } } : undefined,
            year: work.year,
            productionCompanySlugs:
              work.productionCompanySlugs === null
                ? Prisma.JsonNull
                : (work.productionCompanySlugs as Prisma.InputJsonValue),
            status: work.status,
            spotifyUrl: work.spotifyUrl,
            youtubeUrl: work.youtubeUrl,
            externalUrl: work.externalUrl,
            releaseDate: work.releaseDate,
            genre: work.genre,
            order: work.order,
            isActive: work.isActive,
            isFeatured: work.isFeatured,
            images: { connect: work.images.map((image) => ({ path: image.path })) },
          },
          update: {
            category: { connect: { slug: work.category.slug } },
            label: work.label ? { connect: { slug: work.label.slug } } : undefined,
            coverImage: work.coverImage ? { connect: { path: work.coverImage.path } } : undefined,
            year: work.year,
            productionCompanySlugs:
              work.productionCompanySlugs === null
                ? Prisma.JsonNull
                : (work.productionCompanySlugs as Prisma.InputJsonValue),
            status: work.status,
            spotifyUrl: work.spotifyUrl,
            youtubeUrl: work.youtubeUrl,
            externalUrl: work.externalUrl,
            releaseDate: work.releaseDate,
            genre: work.genre,
            order: work.order,
            isActive: work.isActive,
            isFeatured: work.isFeatured,
            images: { set: work.images.map((image) => ({ path: image.path })) },
          },
        })
        for (const translation of work.translations) {
          await tx.workTranslation.upsert({
            where: { workId_locale: { workId: record.id, locale: translation.locale } },
            create: { ...translation, workId: record.id },
            update: {
              title: translation.title,
              subtitle: translation.subtitle,
              description: translation.description,
              role: translation.role,
            },
          })
        }
        for (const contribution of work.contributions) {
          const artist = await tx.artist.findUniqueOrThrow({
            where: { slug: contribution.artist.slug },
            select: { id: true },
          })
          await tx.contribution.upsert({
            where: { workId_artistId: { workId: record.id, artistId: artist.id } },
            create: {
              workId: record.id,
              artistId: artist.id,
              role: contribution.role,
              order: contribution.order,
            },
            update: { role: contribution.role, order: contribution.order },
          })
        }
      }

      for (const expertise of payload.data.expertises) {
        const record = await tx.expertise.upsert({
          where: { slug: expertise.slug },
          create: {
            slug: expertise.slug,
            order: expertise.order,
            isActive: expertise.isActive,
            coverImage: expertise.coverImage
              ? { connect: { path: expertise.coverImage.path } }
              : undefined,
            images: { connect: expertise.images.map((image) => ({ path: image.path })) },
          },
          update: {
            order: expertise.order,
            isActive: expertise.isActive,
            coverImage: expertise.coverImage
              ? { connect: { path: expertise.coverImage.path } }
              : undefined,
            images: { set: expertise.images.map((image) => ({ path: image.path })) },
          },
        })
        for (const translation of expertise.translations) {
          await tx.expertiseTranslation.upsert({
            where: {
              expertiseId_locale: { expertiseId: record.id, locale: translation.locale },
            },
            create: { ...translation, expertiseId: record.id },
            update: {
              title: translation.title,
              subtitle: translation.subtitle,
              description: translation.description,
              content: translation.content,
            },
          })
        }
      }

      const cv = payload.data.cv
      if (cv) {
        const existing = await tx.cV.findFirst({ select: { id: true } })
        const data = {
          isActive: cv.isActive,
          photoAsset: cv.photoAsset ? { connect: { path: cv.photoAsset.path } } : undefined,
          phone: cv.phone,
          email: cv.email,
          website: cv.website,
          location: cv.location,
          linkedInUrl: cv.linkedInUrl,
          headlineFr: cv.headlineFr,
          headlineEn: cv.headlineEn,
          bioFr: cv.bioFr,
          bioEn: cv.bioEn,
          layout: cv.layout,
          accentColor: cv.accentColor,
          showPhoto: cv.showPhoto,
          theme: cv.theme === null ? Prisma.JsonNull : (cv.theme as Prisma.InputJsonValue),
        }
        const cvRecord = existing
          ? await tx.cV.update({ where: { id: existing.id }, data })
          : await tx.cV.create({ data })

        await tx.cVSection.deleteMany({ where: { cvId: cvRecord.id } })
        await tx.cVSkill.deleteMany({ where: { cvId: cvRecord.id } })
        await tx.cVSocialLink.deleteMany({ where: { cvId: cvRecord.id } })

        for (const section of cv.sections) {
          await tx.cVSection.create({
            data: {
              cvId: cvRecord.id,
              type: section.type,
              icon: section.icon,
              color: section.color,
              placement: section.placement,
              layoutType: section.layoutType,
              order: section.order,
              isActive: section.isActive,
              translations: {
                create: section.translations.map((translation) => ({
                  locale: translation.locale,
                  title: translation.title,
                })),
              },
              items: {
                create: section.items.map((item) => ({
                  startDate: item.startDate,
                  endDate: item.endDate,
                  isCurrent: item.isCurrent,
                  order: item.order,
                  isActive: item.isActive,
                  translations: {
                    create: item.translations.map((translation) => ({
                      locale: translation.locale,
                      title: translation.title,
                      subtitle: translation.subtitle,
                      location: translation.location,
                      description: translation.description,
                    })),
                  },
                })),
              },
            },
          })
        }
        for (const skill of cv.skills) {
          await tx.cVSkill.create({
            data: {
              cvId: cvRecord.id,
              category: skill.category,
              level: skill.level,
              showAsBar: skill.showAsBar,
              order: skill.order,
              isActive: skill.isActive,
              translations: {
                create: skill.translations.map((translation) => ({
                  locale: translation.locale,
                  name: translation.name,
                })),
              },
            },
          })
        }
        await tx.cVSocialLink.createMany({
          data: cv.socialLinks.map((link) => ({
            cvId: cvRecord.id,
            platform: link.platform,
            url: link.url,
            label: link.label,
            order: link.order,
          })),
        })
      }
    },
    { timeout: 120_000 }
  )

  console.log('Business import applied successfully. No entity was deleted.')
  await prisma.$disconnect()
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Business import failed.')
  process.exitCode = 1
})

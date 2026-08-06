/* eslint-disable no-console */
import { createHash } from 'node:crypto'
import { access, readdir } from 'node:fs/promises'
import { extname, relative, resolve } from 'node:path'

import { loadDataEnvironment } from './environment'

type Repair = { id: string; from: string; to: string; targetId?: string }

// Legacy filenames recorded before the artist media normalization. Targets are
// the canonical paths currently declared in seed-data/artists.json.
const legacyArtistAliases: Record<string, string> = {
  foreverpavot: 'images/projets/photoscompo/emile-sornin-forever-pavot.jpg',
  gerz: 'images/projets/photoscompo/gerz-marcellino.jpg',
  lesarondes: 'images/projets/photoscompo/maxime-raynier-les-arondes.jpg',
  lescavaliers: 'images/projets/photoscompo/alexis-molenat-les-cavaliers.jpg',
  mutantninja: 'images/projets/photoscompo/mutant-ninja-records.jpg',
  nicodrum: 'images/projets/photoscompo/nicodrums-friends.jpg',
  stangalouo: 'images/projets/photoscompo/stan-galouo-palma-coco-reccords.jpeg',
  viromajorrecords: 'images/projets/photoscompo/patrice-dambrine-viro-major-records.jpg',
}

function normalizedStem(filePath: string) {
  const extension = extname(filePath)
  return filePath
    .slice(0, -extension.length || undefined)
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/gu, '')
}

async function listFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name)
      return entry.isDirectory() ? listFiles(path) : [path]
    })
  )
  return nested.flat()
}

async function main() {
  const environment = loadDataEnvironment()
  const { prisma } = await import('../../lib/prisma')
  const publicRoot = resolve(process.cwd(), 'public')
  const files = await listFiles(publicRoot)
  const candidates = new Map<string, string[]>()
  for (const absolutePath of files) {
    const relativePath = relative(publicRoot, absolutePath).replaceAll('\\', '/')
    const key = normalizedStem(relativePath)
    candidates.set(key, [...(candidates.get(key) ?? []), relativePath])
  }

  const assets = await prisma.asset.findMany({ select: { id: true, path: true } })
  const assetByPath = new Map(assets.map((asset) => [asset.path, asset.id]))
  const repairs: Repair[] = []
  const unresolved: { id: string; path: string; candidates: string[] }[] = []

  const addRepair = (asset: (typeof assets)[number], to: string) => {
    const targetId = assetByPath.get(to)
    repairs.push({ id: asset.id, from: asset.path, to, targetId })
  }

  for (const asset of assets) {
    if (/^https?:\/\//u.test(asset.path)) continue
    const currentRelative = asset.path.replace(/^public\//u, '').replace(/^\//u, '')
    try {
      await access(resolve(publicRoot, currentRelative))
      continue
    } catch {
      const legacyStem = normalizedStem(currentRelative).split('photoscompo').at(-1)
      const aliasedPath = legacyStem ? legacyArtistAliases[legacyStem] : undefined
      if (aliasedPath && files.includes(resolve(publicRoot, aliasedPath))) {
        addRepair(asset, `public/${aliasedPath}`)
        continue
      }
      const matches = candidates.get(normalizedStem(currentRelative)) ?? []
      const canonicalMatches = Array.from(new Set(matches.map((match) => match.toLowerCase())))
      if (canonicalMatches.length !== 1) {
        unresolved.push({ id: asset.id, path: asset.path, candidates: matches })
        continue
      }
      const preferred = matches.slice().sort((first, second) => {
        const firstLowercase = first === first.toLowerCase() ? 0 : 1
        const secondLowercase = second === second.toLowerCase() ? 0 : 1
        return firstLowercase - secondLowercase || first.localeCompare(second)
      })[0]
      if (preferred) addRepair(asset, `public/${preferred}`)
    }
  }

  const primaryByTarget = new Map<string, string>()
  for (const repair of repairs) {
    if (repair.targetId) continue
    const primaryId = primaryByTarget.get(repair.to)
    if (primaryId) repair.targetId = primaryId
    else primaryByTarget.set(repair.to, repair.id)
  }

  const fingerprint = createHash('sha256')
    .update(JSON.stringify(repairs))
    .digest('hex')
    .slice(0, 16)
  console.log(`Environment: ${environment}`)
  console.log(`Repairs: ${String(repairs.length)}`)
  console.log(`Unresolved: ${String(unresolved.length)}`)
  console.log(`Fingerprint: ${fingerprint}`)
  for (const repair of repairs) {
    console.log(`${repair.targetId ? 'MERGE' : 'UPDATE'} ${repair.from} -> ${repair.to}`)
  }
  if (unresolved.length > 0) {
    console.log('Unresolved paths:')
    for (const item of unresolved) console.log(item.path)
  }

  const apply = process.argv.includes('--apply')
  const confirmation = process.argv.find((argument) => argument.startsWith('--confirm='))?.slice(10)
  if (!apply) {
    console.log(`Dry-run only. Apply with --apply --confirm=${fingerprint}`)
    await prisma.$disconnect()
    return
  }
  if (confirmation !== fingerprint) throw new Error('Repair fingerprint confirmation is missing.')
  if (
    environment === 'production' &&
    process.env.CONFIRM_WRITE_PRODUCTION !== 'WRITE_PRODUCTION_DATA'
  ) {
    throw new Error('CONFIRM_WRITE_PRODUCTION=WRITE_PRODUCTION_DATA is required.')
  }

  await prisma.$transaction(
    async (tx) => {
      for (const repair of repairs) {
        if (!repair.targetId) {
          await tx.asset.update({ where: { id: repair.id }, data: { path: repair.to } })
          continue
        }

        const [source, target] = await Promise.all([
          tx.asset.findUnique({
            where: { id: repair.id },
            include: {
              workImages: { select: { id: true } },
              expertiseImages: { select: { id: true } },
            },
          }),
          tx.asset.findUnique({ where: { id: repair.targetId } }),
        ])
        if (!source || !target) throw new Error(`Asset merge target disappeared: ${repair.from}`)

        await Promise.all([
          tx.work.updateMany({
            where: { coverImageId: source.id },
            data: { coverImageId: target.id },
          }),
          tx.artist.updateMany({ where: { imageId: source.id }, data: { imageId: target.id } }),
          tx.category.updateMany({
            where: { coverImageId: source.id },
            data: { coverImageId: target.id },
          }),
          tx.label.updateMany({ where: { imageId: source.id }, data: { imageId: target.id } }),
          tx.expertise.updateMany({
            where: { coverImageId: source.id },
            data: { coverImageId: target.id },
          }),
          tx.cV.updateMany({
            where: { photoAssetId: source.id },
            data: { photoAssetId: target.id },
          }),
          ...source.workImages.map((work) =>
            tx.work.update({
              where: { id: work.id },
              data: { images: { connect: { id: target.id }, disconnect: { id: source.id } } },
            })
          ),
          ...source.expertiseImages.map((expertise) =>
            tx.expertise.update({
              where: { id: expertise.id },
              data: { images: { connect: { id: target.id }, disconnect: { id: source.id } } },
            })
          ),
        ])
        await tx.asset.update({
          where: { id: target.id },
          data: {
            alt: target.alt ?? source.alt,
            blurDataUrl: target.blurDataUrl ?? source.blurDataUrl,
            width: target.width ?? source.width,
            height: target.height ?? source.height,
            aspectRatio: target.aspectRatio ?? source.aspectRatio,
          },
        })
        await tx.asset.delete({ where: { id: source.id } })
      }
    },
    { maxWait: 10_000, timeout: 120_000 }
  )
  console.log(`Applied ${String(repairs.length)} asset path repairs.`)
  await prisma.$disconnect()
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Asset repair failed.')
  process.exitCode = 1
})

/* eslint-disable no-console */
import { access, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { loadDataEnvironment } from './environment'

type LocalAssetStatus = {
  id: string
  path: string
  status: 'present' | 'missing' | 'remote'
}

async function main() {
  const environment = loadDataEnvironment()
  const [{ getDataQualityReport }, { prisma }] = await Promise.all([
    import('../../lib/data-quality'),
    import('../../lib/prisma'),
  ])

  const [quality, assets, activeArtistCount] = await Promise.all([
    getDataQualityReport('fr'),
    prisma.asset.findMany({ select: { id: true, path: true }, orderBy: { path: 'asc' } }),
    prisma.artist.count({ where: { isActive: true } }),
  ])

  const localAssets: LocalAssetStatus[] = []
  for (const asset of assets) {
    if (/^https?:\/\//u.test(asset.path)) {
      localAssets.push({ ...asset, status: 'remote' })
      continue
    }
    const normalized = asset.path.replace(/^public\//u, '').replace(/^\//u, '')
    const path = resolve(process.cwd(), 'public', normalized)
    try {
      await access(path)
      localAssets.push({ ...asset, status: 'present' })
    } catch {
      localAssets.push({ ...asset, status: 'missing' })
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    environment,
    activeArtistCount,
    quality: quality.summary,
    issues: quality.issues,
    assets: {
      total: localAssets.length,
      present: localAssets.filter((asset) => asset.status === 'present').length,
      missing: localAssets.filter((asset) => asset.status === 'missing').length,
      remote: localAssets.filter((asset) => asset.status === 'remote').length,
      missingItems: localAssets.filter((asset) => asset.status === 'missing'),
    },
  }

  const output = resolve(process.cwd(), `exports/data-audit-${environment}.json`)
  await mkdir(resolve(process.cwd(), 'exports'), { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 })

  console.log(`Data audit created: ${output}`)
  console.log(`Active artists: ${String(activeArtistCount)}`)
  console.log(`Quality issues: ${String(quality.summary.total)}`)
  console.log(`Missing local assets: ${String(report.assets.missing)}`)

  await prisma.$disconnect()
  if (report.assets.missing > 0) process.exitCode = 2
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Data audit failed.')
  process.exitCode = 1
})

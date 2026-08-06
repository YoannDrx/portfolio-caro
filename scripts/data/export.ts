/* eslint-disable no-console */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'

import { loadDataEnvironment } from './environment'

function getArgument(name: string) {
  const prefix = `--${name}=`
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
}

async function getLatestMigration() {
  const migrationsPath = resolve(process.cwd(), 'prisma/migrations')
  const { readdir } = await import('node:fs/promises')
  const entries = await readdir(migrationsPath, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .at(-1)
}

async function main() {
  const environment = loadDataEnvironment()
  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')
  const output = resolve(
    process.cwd(),
    getArgument('output') ?? `exports/portfolio-caro-${environment}-${timestamp}.json`
  )

  const { buildBusinessExport } = await import('../../lib/business-export')
  const payload = await buildBusinessExport()
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 })

  const bytes = await readFile(output)
  const manifest = {
    archive: basename(output),
    generatedAt: payload.metadata.generatedAt,
    environment,
    exportVersion: payload.metadata.version,
    latestMigration: await getLatestMigration(),
    excludedModels: payload.metadata.excludedModels,
    counts: payload.metadata.counts,
    size: bytes.byteLength,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  }
  const manifestPath = `${output}.manifest.json`
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 })

  console.log(`Business export created: ${output}`)
  console.log(`Manifest created: ${manifestPath}`)
  console.log(
    `Entities: ${String(Object.values(payload.metadata.counts).reduce((a, b) => a + b, 0))}`
  )
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Business export failed.')
  process.exitCode = 1
})

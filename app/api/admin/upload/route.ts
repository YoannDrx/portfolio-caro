import { NextResponse } from 'next/server'

import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

import { ApiError } from '@/lib/api/error-handler'
import { withAuth } from '@/lib/api/with-auth'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const MAX_INPUT_PIXELS = 40_000_000
const MAX_OUTPUT_DIMENSION = 2400

function safeFileStem(fileName: string) {
  const stem = path.parse(fileName).name
  const normalized = stem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/[^a-zA-Z0-9_-]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 80)
  return normalized || 'image'
}

export const POST = withAuth(async (req) => {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    throw new ApiError(400, 'Aucun fichier fourni', 'NO_FILE')
  }

  // Validate file type
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    throw new ApiError(400, 'Le fichier doit être une image', 'INVALID_FILE_TYPE')
  }

  // Validate file size (max 5MB)
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ApiError(400, "L'image ne doit pas dépasser 5MB", 'FILE_TOO_LARGE')
  }

  // Convert to buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Get image metadata and generate blur placeholder
  let optimizedBuffer: Buffer
  let metadata: sharp.Metadata
  try {
    const image = sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS, failOn: 'warning' }).rotate()
    optimizedBuffer = await image
      .resize({
        width: MAX_OUTPUT_DIMENSION,
        height: MAX_OUTPUT_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4, smartSubsample: true })
      .toBuffer()
    metadata = await sharp(optimizedBuffer).metadata()
  } catch {
    throw new ApiError(400, "L'image est invalide ou trop grande", 'INVALID_IMAGE')
  }

  // Generate low-quality blur placeholder (20px width)
  const blurBuffer = await sharp(optimizedBuffer)
    .resize({ width: 20 })
    .jpeg({ quality: 45 })
    .toBuffer()

  const blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`

  // If Vercel Blob is configured, try it first
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  const outputName = `${safeFileStem(file.name)}-${randomUUID()}.webp`
  if (blobToken) {
    try {
      const blob = await put(`images/${outputName}`, optimizedBuffer, {
        access: 'public',
        contentType: 'image/webp',
        addRandomSuffix: false,
        token: blobToken,
      })

      return NextResponse.json({
        url: blob.url,
        pathname: blob.pathname,
        size: optimizedBuffer.byteLength,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: metadata.width && metadata.height ? metadata.width / metadata.height : null,
        blurDataUrl,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Vercel Blob upload failed:', error)
      throw new ApiError(
        502,
        "Le stockage d'images est temporairement indisponible",
        'UPLOAD_FAILED'
      )
    }
  }

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new ApiError(503, 'BLOB_READ_WRITE_TOKEN doit être configuré', 'BLOB_NOT_CONFIGURED')
  }

  // Local development fallback only.
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const filePath = path.join(uploadsDir, outputName)
  await fs.writeFile(filePath, optimizedBuffer)

  const publicPath = `/uploads/${outputName}`

  return NextResponse.json({
    url: publicPath,
    pathname: publicPath,
    size: optimizedBuffer.byteLength,
    width: metadata.width,
    height: metadata.height,
    aspectRatio: metadata.width && metadata.height ? metadata.width / metadata.height : null,
    blurDataUrl,
  })
})

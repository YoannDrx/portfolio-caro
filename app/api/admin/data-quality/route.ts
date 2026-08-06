import { NextResponse } from 'next/server'

import { z } from 'zod'

import { withAuth } from '@/lib/api/with-auth'
import {
  type DataQualityEntity,
  type DataQualitySeverity,
  getDataQualityReport,
} from '@/lib/data-quality'

const querySchema = z.object({
  locale: z.enum(['fr', 'en']).default('fr'),
  entity: z.enum(['artist', 'work', 'asset']).optional(),
  severity: z.enum(['error', 'warning', 'info']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
})

export const GET = withAuth(async (request) => {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()))
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_QUERY',
          message: 'Paramètres invalides',
          issues: parsed.error.issues,
        },
      },
      { status: 400 }
    )
  }

  const { locale, entity, severity, page, pageSize } = parsed.data
  const report = await getDataQualityReport(locale)
  const filtered = report.issues.filter(
    (issue) =>
      (!entity || issue.entity === (entity as DataQualityEntity)) &&
      (!severity || issue.severity === (severity as DataQualitySeverity))
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * pageSize

  return NextResponse.json({
    ...report,
    issues: filtered.slice(start, start + pageSize),
    pagination: { page: safePage, pageSize, pageCount, total: filtered.length },
  })
})

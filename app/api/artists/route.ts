import { NextResponse } from 'next/server'

import { getArtistCatalog } from '@/lib/catalog/artists'
import { parseCatalogQuery } from '@/lib/catalog/query'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const locale = url.searchParams.get('locale') === 'en' ? 'en' : 'fr'
    const params = Object.fromEntries(url.searchParams.entries())
    if (url.searchParams.has('limit') && !url.searchParams.has('pageSize')) {
      params.pageSize = url.searchParams.get('limit') ?? '24'
    }
    const query = parseCatalogQuery(locale, params, {
      defaultSort: 'title',
      allowedSorts: ['title', 'collaborations'],
    })
    const result = await getArtistCatalog(query)

    if (url.searchParams.get('format') === 'legacy') {
      return NextResponse.json(result.items, {
        headers: { Deprecation: 'true', Sunset: 'Wed, 30 Sep 2026 23:59:59 GMT' },
      })
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: { code: 'ARTIST_CATALOG_FAILED', message: 'Failed to fetch artists' } },
      { status: 500 }
    )
  }
}

import {
  CATALOG_MAX_PAGE_SIZE,
  CATALOG_PAGE_SIZE,
  type CatalogQuery,
  type CatalogSort,
  type CatalogView,
} from './types'

type SearchParamsInput = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function optionalTrim(value: string | string[] | undefined) {
  const trimmed = first(value)?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

export function parseCatalogQuery(
  locale: 'fr' | 'en',
  params: SearchParamsInput,
  options?: { defaultSort?: CatalogSort; allowedSorts?: CatalogSort[] }
): CatalogQuery {
  const allowedSorts = options?.allowedSorts ?? ['editorial', 'year', 'title']
  const requestedSort = first(params.sort) as CatalogSort | undefined
  const sort =
    requestedSort && allowedSorts.includes(requestedSort)
      ? requestedSort
      : (options?.defaultSort ?? 'editorial')
  const requestedView = first(params.view) as CatalogView | undefined
  const pageSize = Math.min(
    positiveInteger(first(params.pageSize), CATALOG_PAGE_SIZE),
    CATALOG_MAX_PAGE_SIZE
  )
  const rawYear = first(params.year)
  const year = rawYear ? Number(rawYear) : undefined

  return {
    locale,
    q: optionalTrim(params.q),
    category: optionalTrim(params.category),
    artist: optionalTrim(params.artist),
    label: optionalTrim(params.label),
    year: Number.isInteger(year) ? year : undefined,
    sort,
    order: first(params.order) === 'desc' ? 'desc' : 'asc',
    page: positiveInteger(first(params.page), 1),
    pageSize,
    view: requestedView === 'list' ? 'list' : 'grid',
  }
}

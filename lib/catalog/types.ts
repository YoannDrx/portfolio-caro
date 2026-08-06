import type { Locale } from '@/lib/i18n-config'

export const CATALOG_PAGE_SIZE = 24
export const CATALOG_MAX_PAGE_SIZE = 48

export type CatalogSort = 'editorial' | 'year' | 'title' | 'collaborations'
export type CatalogView = 'grid' | 'list'

export type CatalogQuery = {
  locale: Locale
  q?: string
  category?: string
  artist?: string
  label?: string
  year?: number
  sort: CatalogSort
  order: 'asc' | 'desc'
  page: number
  pageSize: number
  view: CatalogView
}

export type FacetItem = {
  value: string
  label: string
  count: number
  color?: string | null
}

export type CatalogFacets = {
  categories: FacetItem[]
  artists: FacetItem[]
  labels: FacetItem[]
  years: FacetItem[]
}

export type PaginatedResult<T, TFacets = CatalogFacets> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  pageCount: number
  facets: TFacets
}

export type ProjectCatalogItem = {
  id: string
  slug: string
  title: string
  subtitle?: string
  role?: string
  category: string
  categorySlug: string
  categoryColor: string | null
  label?: string
  coverImage?: string
  coverImageAlt: string
  coverImageWidth?: number
  coverImageHeight?: number
  coverImageBlurDataUrl?: string
  artists: { slug: string; name: string }[]
  youtubeUrl?: string
  year?: number
}

export type ArtistCatalogItem = {
  id: string
  slug: string
  name: string
  image?: string
  imageAlt: string
  worksCount: number
}

export type ArtistCatalogFacets = {
  letters: FacetItem[]
}

export type ArtistCatalogResult = PaginatedResult<ArtistCatalogItem, ArtistCatalogFacets> & {
  totalProjects: number
}

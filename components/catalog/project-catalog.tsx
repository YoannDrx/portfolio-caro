'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { Grid2X2Icon, ListIcon, PlayIcon, SearchIcon, XIcon } from 'lucide-react'

import type { CatalogQuery, PaginatedResult, ProjectCatalogItem } from '@/lib/catalog/types'
import type { Locale } from '@/lib/i18n-config'
import { cn } from '@/lib/utils'

import { Breadcrumb } from '@/components/breadcrumb'
import { PageLayout } from '@/components/layout/page-layout'
import { YouTubeModal } from '@/components/youtube-modal'

import type { ProjetsPageDictionary } from '@/types/dictionary'

type ProjectCatalogProps = {
  locale: Locale
  query: CatalogQuery
  result: PaginatedResult<ProjectCatalogItem>
  nav: { home: string; projects: string }
  copy: ProjetsPageDictionary
}

function selectClassName() {
  return 'min-h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--brand-neon)]'
}

export function ProjectCatalog({ locale, query, result, nav, copy }: ProjectCatalogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(query.q ?? '')
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null)

  const navigate = (changes: Record<string, string | null>, options?: { scroll?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    if (!('page' in changes)) params.delete('page')
    const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname
    startTransition(() => {
      router.push(href, { scroll: options?.scroll ?? false })
    })
  }

  useEffect(() => {
    setSearch(query.q ?? '')
  }, [query.q])
  useEffect(() => {
    if (search === (query.q ?? '')) return
    const timeout = window.setTimeout(() => {
      navigate({ q: search.trim() || null })
    }, 250)
    return () => {
      window.clearTimeout(timeout)
    }
    // navigate is intentionally derived from the current URL on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, query.q])

  const returnTo = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname
  const detailHref = (slug: string) =>
    `/${locale}/projets/${slug}?returnTo=${encodeURIComponent(returnTo)}`

  return (
    <PageLayout showOrbs={false} className="mx-auto max-w-[1600px]">
      <Breadcrumb items={[{ label: nav.home, href: `/${locale}` }, { label: nav.projects }]} />

      <header className="border-b border-[var(--color-border)] py-12 md:py-16">
        <p className="text-xs tracking-[0.2em] text-[var(--brand-neon)] uppercase">Catalogue</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-5xl font-semibold text-[var(--color-text-primary)] md:text-7xl">
              {nav.projects}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
              {copy.description}
            </p>
          </div>
          <p className="font-mono text-sm text-[var(--color-text-muted)]">
            {result.total} {copy.statsProjects.toLocaleLowerCase(locale)}
          </p>
        </div>
      </header>

      <section
        className="sticky top-16 z-20 -mx-4 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-4 py-4 backdrop-blur md:top-20"
        aria-label={locale === 'fr' ? 'Filtres du catalogue' : 'Catalog filters'}
      >
        <div className="grid gap-3 xl:grid-cols-[minmax(240px,1fr)_repeat(4,auto)_auto]">
          <label className="relative block">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              data-testid="projects-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
              }}
              placeholder={copy.searchPlaceholder}
              className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pr-10 pl-10 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--brand-neon)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                }}
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                aria-label={locale === 'fr' ? 'Effacer la recherche' : 'Clear search'}
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </label>

          <select
            data-testid="category-filter"
            value={query.category ?? ''}
            onChange={(event) => {
              navigate({ category: event.target.value || null })
            }}
            className={selectClassName()}
            aria-label={locale === 'fr' ? 'Catégorie' : 'Category'}
          >
            <option value="">{copy.filterAll}</option>
            {result.facets.categories.map((facet) => (
              <option key={facet.value} value={facet.value}>
                {facet.label} ({facet.count})
              </option>
            ))}
          </select>

          <select
            value={query.artist ?? ''}
            onChange={(event) => {
              navigate({ artist: event.target.value || null })
            }}
            className={selectClassName()}
            aria-label={locale === 'fr' ? 'Artiste' : 'Artist'}
          >
            <option value="">{locale === 'fr' ? 'Tous les artistes' : 'All artists'}</option>
            {result.facets.artists.map((facet) => (
              <option key={facet.value} value={facet.value}>
                {facet.label} ({facet.count})
              </option>
            ))}
          </select>

          <select
            value={query.label ?? ''}
            onChange={(event) => {
              navigate({ label: event.target.value || null })
            }}
            className={selectClassName()}
            aria-label="Label"
          >
            <option value="">{locale === 'fr' ? 'Tous les labels' : 'All labels'}</option>
            {result.facets.labels.map((facet) => (
              <option key={facet.value} value={facet.value}>
                {facet.label} ({facet.count})
              </option>
            ))}
          </select>

          <select
            value={`${query.sort}:${query.order}`}
            onChange={(event) => {
              const [sort, order] = event.target.value.split(':')
              navigate({ sort, order })
            }}
            className={selectClassName()}
            aria-label={copy.sortByLabel}
          >
            <option value="editorial:asc">
              {locale === 'fr' ? 'Ordre éditorial' : 'Editorial order'}
            </option>
            <option value="year:desc">{copy.sortOrderDateDesc}</option>
            <option value="year:asc">{copy.sortOrderDateAsc}</option>
            <option value="title:asc">{copy.sortOrderTitleAsc}</option>
            <option value="title:desc">{copy.sortOrderTitleDesc}</option>
          </select>

          <div className="flex rounded-lg border border-[var(--color-border)] p-1">
            {[
              ['grid', Grid2X2Icon, locale === 'fr' ? 'Grille' : 'Grid'],
              ['list', ListIcon, locale === 'fr' ? 'Liste' : 'List'],
            ].map(([view, Icon, label]) => (
              <button
                key={String(view)}
                type="button"
                onClick={() => {
                  navigate({ view: String(view) })
                }}
                className={cn(
                  'flex h-9 w-10 items-center justify-center rounded-md transition-colors',
                  query.view === view
                    ? 'bg-[var(--brand-neon)] text-[var(--color-background)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                )}
                aria-label={String(label)}
                aria-pressed={query.view === view}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 h-4 text-xs text-[var(--color-text-muted)]" aria-live="polite">
          {isPending ? (locale === 'fr' ? 'Mise à jour…' : 'Updating…') : null}
        </p>
      </section>

      <main className="py-10">
        {result.items.length === 0 ? (
          <div className="border border-[var(--color-border)] p-10 text-center">
            <p className="text-[var(--color-text-secondary)]">{copy.noResults}</p>
            <button
              type="button"
              onClick={() => {
                router.push(pathname)
              }}
              className="mt-5 min-h-11 text-sm text-[var(--brand-neon)] underline-offset-4 hover:underline"
            >
              {locale === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
            </button>
          </div>
        ) : query.view === 'grid' ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((project) => (
              <ProjectGridCard
                key={project.id}
                project={project}
                href={detailHref(project.slug)}
                onPlay={
                  project.youtubeUrl
                    ? () => {
                        setVideo({ url: project.youtubeUrl ?? '', title: project.title })
                      }
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {result.items.map((project) => (
              <Link
                key={project.id}
                data-testid="project-card"
                prefetch={false}
                href={detailHref(project.slug)}
                className="group grid min-h-20 gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-neon)] md:grid-cols-[minmax(260px,2fr)_1fr_1fr_100px] md:items-center"
              >
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--brand-neon)]">
                    {project.title}
                  </p>
                  {project.role && (
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">{project.role}</p>
                  )}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {project.artists.map((artist) => artist.name).join(', ') || '—'}
                </p>
                <p className="text-xs tracking-wider text-[var(--color-text-muted)] uppercase">
                  {project.category}
                </p>
                <p className="font-mono text-sm text-[var(--color-text-muted)]">
                  {project.year ?? '—'}
                </p>
              </Link>
            ))}
          </div>
        )}

        <Pagination
          locale={locale}
          page={result.page}
          pageCount={result.pageCount}
          onPage={(page) => {
            navigate({ page: String(page) }, { scroll: true })
          }}
        />
      </main>

      <YouTubeModal
        youtubeUrl={video?.url ?? ''}
        title={video?.title ?? ''}
        isOpen={video !== null}
        onClose={() => {
          setVideo(null)
        }}
      />
    </PageLayout>
  )
}

function ProjectGridCard({
  project,
  href,
  onPlay,
}: {
  project: ProjectCatalogItem
  href: string
  onPlay?: () => void
}) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-[border-color,transform] duration-200 focus-within:border-[var(--brand-neon)] hover:-translate-y-1 hover:border-[var(--brand-neon)]">
      <Link
        data-testid="project-card"
        prefetch={false}
        href={href}
        className="block focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand-neon)]"
      >
        <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-elevated)]">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.coverImageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              placeholder={project.coverImageBlurDataUrl ? 'blur' : 'empty'}
              blurDataURL={project.coverImageBlurDataUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-[var(--color-text-muted)]">
              {project.title.charAt(0).toLocaleUpperCase()}
            </div>
          )}
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3 font-mono text-[11px] tracking-wider text-[var(--color-text-muted)] uppercase">
            <span>{project.category}</span>
            <span>{project.year ?? ''}</span>
          </div>
          <h2 className="text-lg font-medium text-[var(--color-text-primary)]">{project.title}</h2>
          <p className="line-clamp-1 text-sm text-[var(--color-text-secondary)]">
            {project.artists.map((artist) => artist.name).join(', ') || '—'}
          </p>
          {project.role && <p className="text-xs text-[var(--color-text-muted)]">{project.role}</p>}
        </div>
      </Link>
      {onPlay && (
        <button
          type="button"
          onClick={onPlay}
          className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-background)]/85 text-[var(--color-text-primary)] backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-[var(--brand-neon)]"
          aria-label={`Lire ${project.title}`}
        >
          <PlayIcon className="ml-0.5 h-4 w-4" fill="currentColor" />
        </button>
      )}
    </article>
  )
}

function Pagination({
  locale,
  page,
  pageCount,
  onPage,
}: {
  locale: Locale
  page: number
  pageCount: number
  onPage: (page: number) => void
}) {
  if (pageCount <= 1) return null
  return (
    <nav
      className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-6"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => {
          onPage(page - 1)
        }}
        className="min-h-11 text-sm text-[var(--color-text-primary)] disabled:opacity-30"
      >
        {locale === 'fr' ? '← Précédent' : '← Previous'}
      </button>
      <span className="font-mono text-xs text-[var(--color-text-muted)]">
        {page} / {pageCount}
      </span>
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => {
          onPage(page + 1)
        }}
        className="min-h-11 text-sm text-[var(--color-text-primary)] disabled:opacity-30"
      >
        {locale === 'fr' ? 'Suivant →' : 'Next →'}
      </button>
    </nav>
  )
}

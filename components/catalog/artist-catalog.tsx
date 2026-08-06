'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { SearchIcon, XIcon } from 'lucide-react'

import type { ArtistCatalogResult, CatalogQuery } from '@/lib/catalog/types'
import type { Locale } from '@/lib/i18n-config'

import { Breadcrumb } from '@/components/breadcrumb'
import { PageLayout } from '@/components/layout/page-layout'

import type { ArtistsPageDictionary } from '@/types/dictionary'

export function ArtistCatalog({
  locale,
  query,
  result,
  nav,
  copy,
}: {
  locale: Locale
  query: CatalogQuery
  result: ArtistCatalogResult
  nav: { home: string; artists: string }
  copy: ArtistsPageDictionary
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(query.q ?? '')
  const [isPending, startTransition] = useTransition()

  const navigate = (changes: Record<string, string | null>, scroll = false) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    if (!('page' in changes)) params.delete('page')
    const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname
    startTransition(() => {
      router.push(href, { scroll })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, query.q])

  const returnTo = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname

  return (
    <PageLayout showOrbs={false} className="mx-auto max-w-[1600px]">
      <Breadcrumb items={[{ label: nav.home, href: `/${locale}` }, { label: nav.artists }]} />
      <header className="border-b border-[var(--color-border)] py-12 md:py-16">
        <p className="text-xs tracking-[0.2em] text-[var(--brand-neon)] uppercase">Répertoire</p>
        <h1 className="mt-4 text-5xl font-semibold text-[var(--color-text-primary)] md:text-7xl">
          {nav.artists}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
          {copy.description}
        </p>
        <div className="mt-6 flex gap-6 font-mono text-xs text-[var(--color-text-muted)]">
          <span>
            {result.total} {copy.statsArtists.toLocaleLowerCase(locale)}
          </span>
          <span>
            {result.totalProjects} {copy.statsProjects.toLocaleLowerCase(locale)}
          </span>
        </div>
      </header>

      <section className="sticky top-16 z-20 -mx-4 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-4 py-4 backdrop-blur md:top-20">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              data-testid="artists-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
              }}
              placeholder={copy.searchPlaceholder}
              className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pr-10 pl-10 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--brand-neon)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                }}
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[var(--color-text-muted)]"
                aria-label={locale === 'fr' ? 'Effacer la recherche' : 'Clear search'}
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </label>
          <select
            value={`${query.sort}:${query.order}`}
            onChange={(event) => {
              const [sort, order] = event.target.value.split(':')
              navigate({ sort, order })
            }}
            className="min-h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-primary)]"
            aria-label={locale === 'fr' ? 'Trier les artistes' : 'Sort artists'}
          >
            <option value="title:asc">{copy.sortOrderTitleAsc}</option>
            <option value="title:desc">{copy.sortOrderTitleDesc}</option>
            <option value="collaborations:desc">{copy.sortOrderDateDesc}</option>
            <option value="collaborations:asc">{copy.sortOrderDateAsc}</option>
          </select>
        </div>
        <p className="mt-2 h-4 text-xs text-[var(--color-text-muted)]" aria-live="polite">
          {isPending ? (locale === 'fr' ? 'Mise à jour…' : 'Updating…') : null}
        </p>
      </section>

      <main className="py-10">
        {result.items.length ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {result.items.map((artist) => (
              <Link
                key={artist.id}
                data-testid="artist-card"
                prefetch={false}
                href={`/${locale}/artistes/${artist.slug}?returnTo=${encodeURIComponent(returnTo)}`}
                className="group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-neon)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors group-hover:border-[var(--brand-neon)]">
                  {artist.image ? (
                    <Image
                      src={artist.image}
                      alt={artist.imageAlt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[var(--color-surface-elevated)]">
                      <span className="font-serif text-5xl text-[var(--color-text-muted)]">
                        {artist.name
                          .split(/\s+/u)
                          .slice(0, 2)
                          .map((part) => part.charAt(0).toLocaleUpperCase(locale))
                          .join('')}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="mt-3 text-base font-medium text-[var(--color-text-primary)] group-hover:text-[var(--brand-neon)]">
                  {artist.name}
                </h2>
                <p className="mt-1 font-mono text-[11px] tracking-wider text-[var(--color-text-muted)] uppercase">
                  {artist.worksCount}{' '}
                  {artist.worksCount === 1 ? copy.worksSingular : copy.worksPlural}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-[var(--color-border)] p-10 text-center">
            <p className="text-[var(--color-text-secondary)]">{copy.noResults}</p>
            <button
              type="button"
              onClick={() => {
                router.push(pathname)
              }}
              className="mt-5 min-h-11 text-sm text-[var(--brand-neon)]"
            >
              {locale === 'fr' ? 'Réinitialiser' : 'Reset'}
            </button>
          </div>
        )}

        {result.pageCount > 1 && (
          <nav
            className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-6"
            aria-label="Pagination"
          >
            <button
              type="button"
              disabled={result.page <= 1}
              onClick={() => {
                navigate({ page: String(result.page - 1) }, true)
              }}
              className="min-h-11 text-sm text-[var(--color-text-primary)] disabled:opacity-30"
            >
              {locale === 'fr' ? '← Précédent' : '← Previous'}
            </button>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              {result.page} / {result.pageCount}
            </span>
            <button
              type="button"
              disabled={result.page >= result.pageCount}
              onClick={() => {
                navigate({ page: String(result.page + 1) }, true)
              }}
              className="min-h-11 text-sm text-[var(--color-text-primary)] disabled:opacity-30"
            >
              {locale === 'fr' ? 'Suivant →' : 'Next →'}
            </button>
          </nav>
        )}
      </main>
    </PageLayout>
  )
}

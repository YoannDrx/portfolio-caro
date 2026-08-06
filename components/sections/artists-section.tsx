'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { ArtistCatalogItem } from '@/lib/catalog/types'
import type { Locale } from '@/lib/i18n-config'

import { Button } from '@/components/ui/button'

import type { HomeDictionary } from '@/types/dictionary'

import { AnimatedSection, SectionHeader } from './animated-section'

type ArtistsSectionProps = {
  locale: Locale
  copy: HomeDictionary['artists']
  artists: ArtistCatalogItem[]
}

export function ArtistsSection({ locale, copy, artists }: ArtistsSectionProps) {
  const renderWorksCount = (count: number) =>
    `${String(count)} ${count > 1 ? copy.worksPlural : copy.worksSingular}`

  return (
    <AnimatedSection id="artists" className="space-y-8 overflow-visible">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        <Button asChild variant="outline" className="inline-flex items-center gap-2 rounded-full">
          <Link href={`/${locale}/artistes`}>
            {copy.viewAll}
            <span aria-hidden>↗</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/${locale}/artistes/${artist.slug}`}
            prefetch={false}
            className="group flex min-w-0 flex-col bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
          >
            <div className="relative aspect-square overflow-hidden rounded-full bg-white/[0.05]">
              {artist.image ? (
                <Image
                  src={artist.image}
                  alt={artist.imageAlt}
                  fill
                  sizes="(max-width: 640px) 33vw, 160px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/[0.08] to-transparent text-3xl font-semibold text-white/75">
                  {artist.name.charAt(0).toLocaleUpperCase(locale)}
                </div>
              )}
            </div>
            <h3 className="mt-4 truncate text-base font-semibold text-[var(--color-text-primary)]">
              {artist.name}
            </h3>
            <p className="mt-1 font-mono text-[0.65rem] tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
              {renderWorksCount(artist.worksCount)}
            </p>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  )
}

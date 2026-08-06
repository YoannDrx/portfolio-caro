'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { ProjectCatalogItem } from '@/lib/catalog/types'
import type { Locale } from '@/lib/i18n-config'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { HomeDictionary } from '@/types/dictionary'

import { AnimatedSection, SectionHeader } from './animated-section'

type ProjectsSectionProps = {
  locale: Locale
  copy: HomeDictionary['projects']
  works: ProjectCatalogItem[]
}

export function ProjectsSection({ locale, copy, works }: ProjectsSectionProps) {
  return (
    <AnimatedSection id="projects" className="space-y-8 overflow-visible">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        <Button asChild variant="outline" className="inline-flex items-center gap-2 rounded-full">
          <Link href={`/${locale}/projets`}>
            {copy.viewAll}
            <span aria-hidden>↗</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work, index) => (
          <Link
            key={work.id}
            href={`/${locale}/projets/${work.slug}`}
            prefetch={false}
            className="group flex min-w-0 flex-col bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
          >
            <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[0.65rem] tracking-[0.16em] text-[var(--color-text-muted)] uppercase">
              <span className="truncate">{work.category}</span>
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
              {work.coverImage ? (
                <Image
                  src={work.coverImage}
                  alt={work.coverImageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder={work.coverImageBlurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={work.coverImageBlurDataUrl}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">
                  {work.title}
                </div>
              )}
            </div>
            <h3 className="mt-4 line-clamp-2 text-lg leading-tight font-semibold text-[var(--color-text-primary)]">
              {work.title}
            </h3>
            <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
              {work.artists.slice(0, 2).map((artist) => (
                <Badge key={artist.slug} variant="outline" size="sm">
                  {artist.name}
                </Badge>
              ))}
              {work.artists.length > 2 ? (
                <Badge variant="outline" size="sm">
                  +{work.artists.length - 2}
                </Badge>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  )
}

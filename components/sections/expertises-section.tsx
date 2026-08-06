'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { Locale } from '@/lib/i18n-config'
import type { ExpertiseListItem } from '@/lib/prismaExpertiseUtils'

import { Button } from '@/components/ui/button'

import type { HomeDictionary } from '@/types/dictionary'

import { AnimatedSection, SectionHeader } from './animated-section'

type ExpertisesSectionProps = {
  locale: Locale
  copy: HomeDictionary['expertises']
  expertises: ExpertiseListItem[]
}

export function ExpertisesSection({ locale, copy, expertises }: ExpertisesSectionProps) {
  return (
    <AnimatedSection id="expertises" className="space-y-8 overflow-visible">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} />
        <Button asChild variant="outline" className="inline-flex items-center gap-2 rounded-full">
          <Link href={`/${locale}/expertises`}>
            {copy.viewAll}
            <span aria-hidden>↗</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
        {expertises.map((expertise, index) => (
          <Link
            key={expertise.id}
            href={expertise.href}
            prefetch={false}
            className="group flex min-w-0 flex-col bg-[var(--color-surface)] transition-colors duration-200 hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">
              <Image
                src={expertise.imgHome}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
              />
              <span className="absolute top-4 right-4 border border-white/20 bg-black/50 px-2 py-1 font-mono text-[0.65rem] tracking-[0.16em] text-white backdrop-blur-sm">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-xl leading-tight font-semibold text-[var(--color-text-primary)]">
                {expertise.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {expertise.description}
              </p>
              <span className="mt-5 text-sm font-semibold text-[var(--color-accent)]">
                {copy.cardCta} <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </AnimatedSection>
  )
}

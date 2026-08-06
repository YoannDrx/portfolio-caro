'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { motion, useInView } from 'framer-motion'
import { X } from 'lucide-react'

import type { Locale } from '@/lib/i18n-config'
import { cn } from '@/lib/utils'

import { Breadcrumb } from '@/components/breadcrumb'
import { PageLayout } from '@/components/layout/page-layout'

import type { ArtistDetailDictionary } from '@/types/dictionary'

const artistAccent = {
  border: 'border-[#d5ff0a]/30',
  borderHover: 'hover:border-[#d5ff0a]',
  glow: 'hover:shadow-[0_0_25px_rgba(213,255,10,0.2)]',
  badge: 'bg-[#d5ff0a]/10 text-[#d5ff0a] border-[#d5ff0a]/30',
  ring: 'ring-[#d5ff0a]/50',
  gradient: 'from-[#d5ff0a] via-[#9eff00] to-[#00d9ff]',
}

type SocialLink = {
  label: string
  url: string
}

type ArtistWork = {
  id: string
  slug: string
  title: string
  coverImage: string
  coverImageAlt: string
  category: string
  categorySlug?: string
  subtitle?: string
}

type AdjacentArtist = {
  slug: string
  name: string
}

type ArtistDetailClientProps = {
  locale: Locale
  artist: {
    slug: string
    name: string
    bio?: string
    image?: string
    imageAlt?: string
  }
  projects: ArtistWork[]
  clips: ArtistWork[]
  socialLinks: SocialLink[]
  previousArtist: AdjacentArtist | null
  nextArtist: AdjacentArtist | null
  nav: {
    home: string
    artists: string
  }
  copy: ArtistDetailDictionary
}

function WorkCard({ work, locale }: { work: ArtistWork; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/projets/${work.slug}`}
      prefetch={false}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg',
        'border border-white/10 bg-white/[0.015]',
        'transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.035]',
        'focus-visible:border-[var(--brand-neon)] focus-visible:outline-none'
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-white/[0.03]">
        <Image
          src={work.coverImage}
          alt={work.coverImageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-0 border-[6px] border-transparent transition-colors duration-200 group-hover:border-black/10" />
      </div>

      <div className="flex min-h-28 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[0.62rem] tracking-[0.14em] text-white/45 uppercase">
          <span className="truncate">{work.category}</span>
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </div>
        <h3 className="line-clamp-2 text-[0.95rem] leading-snug font-medium text-white/90">
          {work.title}
        </h3>
      </div>
    </Link>
  )
}

function SocialLinkButton({ link }: { link: SocialLink }) {
  const getIcon = (url: string) => {
    if (url.includes('spotify')) return '🎵'
    if (url.includes('soundcloud')) return '☁'
    if (url.includes('youtube') || url.includes('youtu.be')) return '▶'
    if (url.includes('deezer')) return '🎧'
    if (url.includes('apple')) return '🍎'
    if (url.includes('instagram')) return '📷'
    if (url.includes('twitter') || url.includes('x.com')) return '𝕏'
    if (url.includes('facebook')) return '📘'
    return '🔗'
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 border-b border-white/25 px-1 py-2 text-xs font-medium tracking-[0.12em] text-white/70 uppercase transition-colors duration-200 hover:border-[var(--brand-neon)] hover:text-white"
    >
      <span aria-hidden>{getIcon(link.url)}</span>
      <span>{link.label}</span>
      <span className="opacity-60">↗</span>
    </a>
  )
}

export function ArtistDetailClient({
  locale,
  artist,
  projects,
  clips,
  socialLinks,
  previousArtist,
  nextArtist,
  nav,
  copy,
}: ArtistDetailClientProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const worksRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true, margin: '-50px' })
  const isWorksInView = useInView(worksRef, { once: true, margin: '-100px' })
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [catalogPath, setCatalogPath] = useState<string>()

  useEffect(() => {
    const returnTo = new URLSearchParams(window.location.search).get('returnTo')
    const nextCatalogPath = returnTo?.startsWith(`/${locale}/artistes`) ? returnTo : undefined
    const timeout = setTimeout(() => {
      setCatalogPath(nextCatalogPath)
      setMounted(true)
    }, 0)
    return () => {
      clearTimeout(timeout)
    }
  }, [locale])

  const hasValidImage = Boolean(artist.image && artist.image.trim() !== '')
  const allWorks = [...projects, ...clips]
  const worksCount = allWorks.length
  const worksLabel = worksCount > 1 ? copy.worksPlural : copy.worksSingular
  const closeLabel = locale === 'fr' ? 'Fermer' : 'Close'
  const enlargeLabel = locale === 'fr' ? "Agrandir l'image" : 'Enlarge image'
  const hasWorks = allWorks.length > 0
  const worksInView = hasWorks ? isWorksInView : true

  return (
    <PageLayout orbsConfig="subtle" className="mx-auto max-w-[1400px]">
      <Breadcrumb
        items={[
          { label: nav.home, href: `/${locale}` },
          { label: nav.artists, href: catalogPath ?? `/${locale}/artistes` },
          { label: artist.name },
        ]}
      />

      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 rounded-2xl border border-white/10 bg-[#0a0a0f]/90 p-6 sm:p-8 lg:p-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative flex-shrink-0"
              >
                <button
                  type="button"
                  aria-label={enlargeLabel}
                  className={cn(
                    'relative h-32 w-32 overflow-hidden rounded-full sm:h-40 sm:w-40',
                    'ring-4 ring-white/10',
                    'transition-all duration-300 focus:ring-4 focus:ring-[#d5ff0a]/50 focus:outline-none',
                    hasValidImage && 'cursor-zoom-in hover:scale-105 hover:ring-[#d5ff0a]/50'
                  )}
                  onClick={() => {
                    if (hasValidImage) setIsImageOpen(true)
                  }}
                  disabled={!hasValidImage}
                >
                  {hasValidImage && artist.image ? (
                    <Image
                      src={artist.image}
                      alt={artist.imageAlt ?? artist.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        'flex h-full w-full items-center justify-center',
                        'bg-gradient-to-br',
                        artistAccent.gradient
                      )}
                    >
                      <span className="text-5xl font-black text-white/80">
                        {artist.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>
                <div className="absolute inset-0 -z-10 rounded-full bg-[#d5ff0a]/20 blur-2xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center sm:text-left"
              >
                <p className="mb-3 font-mono text-[0.65rem] tracking-[0.22em] text-[var(--brand-neon)] uppercase">
                  {locale === 'fr' ? 'Compositeur · Catalogue' : 'Composer · Catalogue'}
                </p>
                <h1 className="mb-4 [font-family:var(--font-instrument-serif)] text-4xl leading-none tracking-[-0.025em] text-white sm:text-5xl lg:text-7xl">
                  {artist.name}
                </h1>
                <div className="flex items-center gap-3 font-mono text-[0.65rem] tracking-[0.14em] text-white/50 uppercase">
                  <span>{String(worksCount).padStart(2, '0')}</span>
                  <span className="h-px w-8 bg-white/25" />
                  <span>{worksLabel}</span>
                </div>
              </motion.div>
            </div>

            {artist.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
              >
                <p className="max-w-[74ch] text-base leading-[1.75] whitespace-pre-line text-white/70 lg:text-lg">
                  {artist.bio}
                </p>
              </motion.div>
            )}

            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                {socialLinks.map((link) => (
                  <SocialLinkButton key={link.url} link={link} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {hasWorks && (
        <motion.section
          ref={worksRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isWorksInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 rounded-2xl border border-white/10 bg-[#0a0a0f]/90 p-6 sm:p-8 lg:p-10"
        >
          <div className="mb-8 flex items-end justify-between">
            <h2 className="[font-family:var(--font-instrument-serif)] text-3xl tracking-[-0.02em] text-white sm:text-4xl">
              {copy.worksTitle}
            </h2>
            <div className="text-right">
              <p className="text-2xl font-black text-white">{worksCount}</p>
              <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase">{worksLabel}</p>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((work) => (
                <WorkCard key={work.id} work={work} locale={locale} />
              ))}
            </div>
          ) : null}

          {clips.length > 0 ? (
            <div className={projects.length > 0 ? 'mt-10 border-t border-white/10 pt-8' : ''}>
              <h3 className="mb-5 font-mono text-[0.68rem] tracking-[0.2em] text-white/50 uppercase">
                Clips & videos
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {clips.map((work) => (
                  <WorkCard key={work.id} work={work} locale={locale} />
                ))}
              </div>
            </div>
          ) : null}
        </motion.section>
      )}

      {(previousArtist ?? nextArtist) && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={worksInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 grid gap-4 sm:grid-cols-2"
        >
          {previousArtist ? (
            <Link
              href={`/${locale}/artistes/${previousArtist.slug}${catalogPath ? `?returnTo=${encodeURIComponent(catalogPath)}` : ''}`}
              className={cn(
                'group rounded-[20px] border-4 border-white/10 bg-[#0a0a0f]/90 p-6',
                'transition-all duration-300',
                'hover:border-white/20 hover:bg-white/[0.02]'
              )}
            >
              <div className="mb-2 text-xs font-bold tracking-wider text-[#d5ff0a] uppercase">
                {copy.previousArtistLabel}
              </div>
              <div className="line-clamp-1 text-lg font-bold text-white/80 uppercase transition-colors group-hover:text-white">
                {previousArtist.name}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextArtist ? (
            <Link
              href={`/${locale}/artistes/${nextArtist.slug}${catalogPath ? `?returnTo=${encodeURIComponent(catalogPath)}` : ''}`}
              className={cn(
                'group rounded-[20px] border-4 border-white/10 bg-[#0a0a0f]/90 p-6 text-right',
                'transition-all duration-300',
                'hover:border-white/20 hover:bg-white/[0.02]'
              )}
            >
              <div className="mb-2 text-xs font-bold tracking-wider text-[#d5ff0a] uppercase">
                {copy.nextArtistLabel}
              </div>
              <div className="line-clamp-1 text-lg font-bold text-white/80 uppercase transition-colors group-hover:text-white">
                {nextArtist.name}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </motion.section>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={worksInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-[24px] border-2 border-[#d5ff0a]/40 bg-gradient-to-br from-[#d5ff0a]/10 via-[#9eff00]/5 to-transparent p-6 sm:p-8"
      >
        <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">{copy.ctaTitle}</h2>
            <p className="text-sm text-white/60">{copy.ctaDescription}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-6 py-3',
              'border-2 border-[#d5ff0a] bg-[#d5ff0a]',
              'text-sm font-bold tracking-wider text-[#050505] uppercase',
              'transition-all duration-300',
              'hover:bg-transparent hover:text-[#d5ff0a]',
              'hover:shadow-[0_0_25px_rgba(213,255,10,0.3)]'
            )}
          >
            {copy.ctaButton}
            <span>→</span>
          </Link>
        </div>
      </motion.div>

      {mounted &&
        isImageOpen &&
        artist.image &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => {
              setIsImageOpen(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <button
                onClick={() => {
                  setIsImageOpen(false)
                }}
                aria-label={closeLabel}
                className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                <X size={24} />
              </button>
              <Image
                src={artist.image}
                alt={artist.imageAlt ?? artist.name}
                width={1200}
                height={1200}
                className="h-auto max-h-[85vh] w-auto object-contain"
                quality={90}
              />
            </motion.div>
          </div>,
          document.body
        )}
    </PageLayout>
  )
}

'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type DeferredEmbedProps = {
  src: string
  title: string
  poster?: string
  aspect?: 'video' | 'spotify'
}

export function DeferredEmbed({ src, title, poster, aspect = 'video' }: DeferredEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element || active || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setActive(true)
        observer.disconnect()
      },
      { rootMargin: '320px 0px' }
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [active])

  return (
    <div
      ref={containerRef}
      className={
        aspect === 'video'
          ? 'relative aspect-video overflow-hidden bg-black'
          : 'relative min-h-48 overflow-hidden bg-white/[0.02]'
      }
    >
      {active ? (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setActive(true)
          }}
          className="group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden text-white"
          aria-label={title}
        >
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : null}
          <span className="relative z-10 border border-white/40 bg-black/70 px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-sm transition-colors group-hover:border-[var(--brand-neon)]">
            {title}
          </span>
        </button>
      )}
    </div>
  )
}

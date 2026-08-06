'use client'

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto grid min-h-[70vh] w-full max-w-[900px] place-items-center px-6 py-20 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--brand-neon)] uppercase">
          Erreur
        </p>
        <h1 className="mt-4 [font-family:var(--font-instrument-serif)] text-5xl text-white">
          Une interruption dans la lecture.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-white/60">
          Le contenu n’a pas pu être chargé. Vos données n’ont pas été modifiées.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 min-h-11 border border-white/25 px-5 text-sm text-white transition-colors hover:border-[var(--brand-neon)]"
        >
          Réessayer
        </button>
      </div>
    </main>
  )
}

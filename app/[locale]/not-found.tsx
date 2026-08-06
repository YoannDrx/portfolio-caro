import Link from 'next/link'

export default function LocaleNotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] w-full max-w-[1000px] place-items-center px-6 py-20 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.22em] text-[var(--brand-neon)] uppercase">
          Catalogue 404
        </p>
        <h1 className="mt-4 [font-family:var(--font-instrument-serif)] text-6xl leading-none text-white sm:text-8xl">
          Cette référence n’existe plus.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-white/60">
          La page demandée est absente du catalogue public ou son adresse a changé.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center border border-white/25 px-5 text-sm text-white transition-colors hover:border-[var(--brand-neon)]"
        >
          Retour à l’accueil
        </Link>
      </div>
    </main>
  )
}

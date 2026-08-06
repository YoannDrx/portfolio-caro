'use client'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AlertCircleIcon, AlertTriangleIcon, InfoIcon, RefreshCwIcon } from 'lucide-react'

import type {
  DataQualityEntity,
  DataQualityIssue,
  DataQualityReport,
  DataQualitySeverity,
} from '@/lib/data-quality'
import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

type Response = DataQualityReport & {
  pagination: { page: number; pageSize: number; pageCount: number; total: number }
}

const severityIcon = {
  error: AlertCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
} satisfies Record<DataQualitySeverity, typeof AlertCircleIcon>

export default function DataQualityPage() {
  const routeParams = useParams<{ locale: string }>()
  const locale = routeParams.locale === 'en' ? 'en' : 'fr'
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<Response | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [resolvedKey, setResolvedKey] = useState('')
  const requestKey = `${locale}:${searchParams.toString()}:${String(reloadKey)}`
  const loading = resolvedKey !== requestKey

  const updateQuery = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    router.push(`/${locale}/admin/data-quality?${next.toString()}`)
  }

  useEffect(() => {
    const controller = new AbortController()
    const query = new URLSearchParams(searchParams.toString())
    query.set('locale', locale)
    fetchWithAuth(`/api/admin/data-quality?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Data quality request failed')
        return (await response.json()) as Response
      })
      .then((responseData) => {
        setData(responseData)
        setError(null)
        setResolvedKey(requestKey)
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return
        setError('Impossible de charger le rapport. Réessayez dans quelques instants.')
        setResolvedKey(requestKey)
      })
    return () => {
      controller.abort()
    }
  }, [locale, requestKey, searchParams])

  const entity = searchParams.get('entity') as DataQualityEntity | null
  const severity = searchParams.get('severity') as DataQualitySeverity | null

  return (
    <main className="space-y-8 p-4 md:p-8">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs tracking-[0.18em] text-[var(--color-text-muted)] uppercase">
            Gouvernance
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
            Qualité des données
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
            Ces alertes n’affectent jamais la publication. Une fiche active reste visible même si
            elle est incomplète.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setReloadKey((value) => value + 1)
          }}
        >
          <RefreshCwIcon className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </header>

      {data && (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Résumé">
          {[
            ['Total', data.summary.total],
            ['Erreurs', data.summary.errors],
            ['Alertes', data.summary.warnings],
            ['Informations', data.summary.info],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--color-border)] p-4">
              <p className="text-xs text-[var(--color-text-muted)] uppercase">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
                {value}
              </p>
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-wrap gap-2" aria-label="Filtres">
        {(['artist', 'work', 'asset'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              updateQuery('entity', entity === value ? null : value)
            }}
            className={cn(
              'min-h-11 rounded-lg border px-4 text-sm transition-colors',
              entity === value
                ? 'border-[var(--brand-neon)] text-[var(--brand-neon)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
            )}
          >
            {value === 'artist' ? 'Artistes' : value === 'work' ? 'Projets' : 'Médias'}
          </button>
        ))}
        {(['error', 'warning', 'info'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              updateQuery('severity', severity === value ? null : value)
            }}
            className={cn(
              'min-h-11 rounded-lg border px-4 text-sm transition-colors',
              severity === value
                ? 'border-[var(--brand-neon)] text-[var(--brand-neon)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
            )}
          >
            {value === 'error' ? 'Erreurs' : value === 'warning' ? 'Alertes' : 'Informations'}
          </button>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        {loading ? (
          <p className="p-8 text-sm text-[var(--color-text-muted)]" aria-live="polite">
            Analyse en cours…
          </p>
        ) : error ? (
          <p className="p-8 text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        ) : data?.issues.length ? (
          <ul className="divide-y divide-[var(--color-border)]">
            {data.issues.map((issue: DataQualityIssue) => {
              const Icon = severityIcon[issue.severity]
              return (
                <li key={issue.id} className="grid gap-3 p-4 md:grid-cols-[24px_1fr_auto]">
                  <Icon className="mt-0.5 h-5 w-5 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{issue.label}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {issue.message}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}${issue.editPath}`}
                    className="text-sm text-[var(--brand-neon)] underline-offset-4 hover:underline"
                  >
                    Corriger
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="p-8 text-sm text-[var(--color-text-muted)]">Aucune alerte.</p>
        )}
      </section>

      {data && data.pagination.pageCount > 1 && (
        <nav className="flex items-center justify-between" aria-label="Pagination">
          <Button
            variant="outline"
            disabled={data.pagination.page <= 1}
            onClick={() => {
              updateQuery('page', String(data.pagination.page - 1))
            }}
          >
            Précédent
          </Button>
          <p className="text-sm text-[var(--color-text-muted)]">
            Page {data.pagination.page} / {data.pagination.pageCount}
          </p>
          <Button
            variant="outline"
            disabled={data.pagination.page >= data.pagination.pageCount}
            onClick={() => {
              updateQuery('page', String(data.pagination.page + 1))
            }}
          >
            Suivant
          </Button>
        </nav>
      )}
    </main>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { AnimatePresence, type Variants, motion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
} from 'lucide-react'

import { fetchWithAuth } from '@/lib/fetch-with-auth'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DuplicatesSummary = {
  assets: {
    totalDuplicates: number
    totalUnused: number
    totalErrors: number
    totalWarnings: number
    totalInfo: number
  }
  works: {
    totalDuplicates: number
    totalErrors: number
    totalWarnings: number
    totalInfo: number
  }
  artists: {
    totalDuplicates: number
    totalErrors: number
    totalWarnings: number
    totalInfo: number
  }
  categories: {
    totalDuplicates: number
    totalErrors: number
    totalWarnings: number
    totalInfo: number
  }
  labels: {
    totalDuplicates: number
    totalErrors: number
    totalWarnings: number
    totalInfo: number
  }
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const severityVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const skeletonVariants: Variants = {
  pulse: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const checkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: 'easeInOut' },
      opacity: { duration: 0.2 },
    },
  },
}

function SkeletonLoader() {
  return (
    <Card className="border-white/10 bg-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            <AlertTriangleIcon className="h-5 w-5 text-orange-400" />
          </motion.div>
          Monitoring des doublons
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          variants={skeletonVariants}
          animate="pulse"
          className="h-20 rounded-lg bg-white/5"
        />
        <motion.div
          variants={skeletonVariants}
          animate="pulse"
          className="h-32 rounded-lg bg-white/5"
          style={{ animationDelay: '0.2s' }}
        />
      </CardContent>
    </Card>
  )
}

function SuccessState() {
  return (
    <Card className="group border-[var(--brand-neon)]/20 bg-black transition-all duration-300 hover:border-[var(--brand-neon)]/40 hover:shadow-[0_0_30px_rgba(213,255,10,0.1)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircleIcon className="h-5 w-5 text-[var(--brand-neon)]" />
          </motion.div>
          Monitoring des doublons
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-neon)]/10"
          >
            <motion.svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-[var(--brand-neon)]"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                variants={checkVariants}
                initial="hidden"
                animate="visible"
              />
            </motion.svg>
          </motion.div>
          <p className="text-sm text-[var(--brand-neon)]">
            Aucun problème détecté dans la base de données
          </p>
        </motion.div>
      </CardContent>
    </Card>
  )
}

type SeverityCardProps = {
  icon: React.ReactNode
  count: number
  label: string
  colorClass: string
  index: number
}

function SeverityCard({ icon, count, label, colorClass, index }: SeverityCardProps) {
  return (
    <motion.div
      custom={index}
      variants={severityVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`flex flex-col items-center rounded-lg border ${colorClass} p-3 transition-all duration-200`}
    >
      <motion.div variants={pulseVariants} animate="pulse">
        {icon}
      </motion.div>
      <motion.p
        className={`mt-1 text-2xl font-bold ${colorClass.includes('red') ? 'text-red-400' : colorClass.includes('orange') ? 'text-orange-400' : 'text-blue-400'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.1 }}
      >
        {count}
      </motion.p>
      <p
        className={`text-xs ${colorClass.includes('red') ? 'text-red-400/70' : colorClass.includes('orange') ? 'text-orange-400/70' : 'text-blue-400/70'}`}
      >
        {label}
      </p>
    </motion.div>
  )
}

type DetailItemProps = {
  title: string
  count: number
  errors: number
  warnings: number
  info: number
  description: string
  index: number
}

function DetailItem({ title, count, errors, warnings, info, description, index }: DetailItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.08)' }}
      className="space-y-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{title}</span>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 + index * 0.1 }}
        >
          <Badge variant="secondary" className="bg-white/10 text-white">
            {count}
          </Badge>
        </motion.div>
      </div>
      <div className="flex gap-2 text-xs">
        <AnimatePresence>
          {errors > 0 && (
            <motion.span
              key="errors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400"
            >
              {errors} erreur{errors > 1 ? 's' : ''}
            </motion.span>
          )}
          {warnings > 0 && (
            <motion.span
              key="warnings"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-orange-400"
            >
              {warnings} attention
            </motion.span>
          )}
          {info > 0 && (
            <motion.span
              key="info"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-blue-400"
            >
              {info} info
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p className="text-xs text-white/50">{description}</p>
    </motion.div>
  )
}

export function DuplicatesWidget({ locale }: { locale: string }) {
  const [data, setData] = useState<DuplicatesSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDuplicates = async () => {
      try {
        setIsLoading(true)
        const res = await fetchWithAuth('/api/admin/monitoring/duplicates')

        if (!res.ok) {
          throw new Error('Failed to fetch duplicates')
        }

        const result = (await res.json()) as DuplicatesSummary
        setData(result)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching duplicates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchDuplicates()
  }, [])

  if (isLoading) {
    return <SkeletonLoader />
  }

  if (!data) {
    return null
  }

  const totalIssues =
    data.assets.totalDuplicates +
    data.assets.totalUnused +
    data.works.totalDuplicates +
    data.artists.totalDuplicates +
    data.categories.totalDuplicates +
    data.labels.totalDuplicates

  const totalErrors =
    data.assets.totalErrors +
    data.works.totalErrors +
    data.artists.totalErrors +
    data.categories.totalErrors +
    data.labels.totalErrors

  const totalWarnings =
    data.assets.totalWarnings +
    data.works.totalWarnings +
    data.artists.totalWarnings +
    data.categories.totalWarnings +
    data.labels.totalWarnings

  const totalInfo =
    data.assets.totalInfo +
    data.works.totalInfo +
    data.artists.totalInfo +
    data.categories.totalInfo +
    data.labels.totalInfo

  if (totalIssues === 0) {
    return <SuccessState />
  }

  // Determine the most severe issue to set border color
  const borderColor =
    totalErrors > 0
      ? 'border-red-500/20 hover:border-red-500/40'
      : totalWarnings > 0
        ? 'border-orange-500/20 hover:border-orange-500/40'
        : 'border-blue-500/20 hover:border-blue-500/40'

  const glowColor =
    totalErrors > 0
      ? 'hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]'
      : totalWarnings > 0
        ? 'hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]'
        : 'hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'

  const detailItems = [
    {
      show: data.works.totalDuplicates > 0,
      title: 'Projets',
      count: data.works.totalDuplicates,
      errors: data.works.totalErrors,
      warnings: data.works.totalWarnings,
      info: data.works.totalInfo,
      description: 'Slugs ou titres en doublon',
    },
    {
      show: data.assets.totalDuplicates > 0 || data.assets.totalUnused > 0,
      title: 'Assets',
      count: data.assets.totalDuplicates + data.assets.totalUnused,
      errors: data.assets.totalErrors,
      warnings: 0,
      info: 0,
      description: 'Fichiers dupliqués ou inutilisés',
    },
    {
      show: data.artists.totalDuplicates > 0,
      title: 'Artistes',
      count: data.artists.totalDuplicates,
      errors: data.artists.totalErrors,
      warnings: data.artists.totalWarnings,
      info: data.artists.totalInfo,
      description: 'Slugs ou noms en doublon',
    },
    {
      show: data.categories.totalDuplicates > 0,
      title: 'Catégories',
      count: data.categories.totalDuplicates,
      errors: data.categories.totalErrors,
      warnings: data.categories.totalWarnings,
      info: data.categories.totalInfo,
      description: 'Slugs en doublon',
    },
    {
      show: data.labels.totalDuplicates > 0,
      title: 'Labels',
      count: data.labels.totalDuplicates,
      errors: data.labels.totalErrors,
      warnings: data.labels.totalWarnings,
      info: data.labels.totalInfo,
      description: 'Slugs en doublon',
    },
  ].filter((item) => item.show)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`${borderColor} ${glowColor} bg-black transition-all duration-300`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <AlertTriangleIcon className="h-5 w-5 text-orange-400" />
              </motion.div>
              Monitoring des doublons
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            >
              <Badge variant="destructive" className="bg-orange-500/20 text-orange-400">
                {totalIssues} problème{totalIssues > 1 ? 's' : ''}
              </Badge>
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Severity breakdown */}
          <div className="grid grid-cols-3 gap-2">
            {totalErrors > 0 && (
              <SeverityCard
                icon={<XCircleIcon className="h-5 w-5 text-red-400" />}
                count={totalErrors}
                label={`Erreur${totalErrors > 1 ? 's' : ''}`}
                colorClass="border-red-500/30 bg-red-500/10"
                index={0}
              />
            )}
            {totalWarnings > 0 && (
              <SeverityCard
                icon={<AlertCircle className="h-5 w-5 text-orange-400" />}
                count={totalWarnings}
                label="Attention"
                colorClass="border-orange-500/30 bg-orange-500/10"
                index={1}
              />
            )}
            {totalInfo > 0 && (
              <SeverityCard
                icon={<InfoIcon className="h-5 w-5 text-blue-400" />}
                count={totalInfo}
                label="Info"
                colorClass="border-blue-500/30 bg-blue-500/10"
                index={2}
              />
            )}
          </div>

          {/* Detailed breakdown by type */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <p className="text-xs font-semibold text-white/50 uppercase">Détails par type</p>
            {detailItems.map((item, index) => (
              <DetailItem
                key={item.title}
                title={item.title}
                count={item.count}
                errors={item.errors}
                warnings={item.warnings}
                info={item.info}
                description={item.description}
                index={index}
              />
            ))}
          </motion.div>

          {/* Action Button */}
          <Link href={`/${locale}/admin/monitoring/duplicates`}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full gap-2 border-[var(--brand-neon)]/30 text-[var(--brand-neon)] transition-all duration-200 hover:border-[var(--brand-neon)]/60 hover:bg-[var(--brand-neon)]/10"
              >
                Voir tous les doublons
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

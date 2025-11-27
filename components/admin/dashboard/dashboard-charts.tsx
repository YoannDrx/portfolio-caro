'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { BarChartIcon, PieChartIcon, TrendingUpIcon } from 'lucide-react'

import { fetchWithAuth } from '@/lib/fetch-with-auth'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CategoryChart } from '@/components/admin/charts/category-chart'
import { StatusChart } from '@/components/admin/charts/status-chart'
import { TimelineChart } from '@/components/admin/charts/timeline-chart'

type AnalyticsData = {
  timeline: {
    month: string
    works: number
    published: number
    draft: number
    artists: number
  }[]
  statusDistribution: {
    name: string
    value: number
    color: string
  }[]
  categoryDistribution: {
    name: string
    value: number
    color: string
  }[]
}

// Skeleton qui correspond au layout final
function ChartsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Timeline Skeleton - Full Width */}
      <Card className="border-[var(--brand-neon)]/20 bg-black">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-[var(--brand-neon)]/20" />
            <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded bg-white/5" />
        </CardContent>
      </Card>

      {/* Two charts skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[var(--brand-neon)]/20 bg-black">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded bg-[var(--brand-neon)]/20" />
              <div className="h-5 w-36 animate-pulse rounded bg-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 animate-pulse rounded bg-white/5" />
          </CardContent>
        </Card>

        <Card className="border-[var(--brand-neon)]/20 bg-black">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded bg-[var(--brand-neon)]/20" />
              <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 animate-pulse rounded bg-white/5" />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export function DashboardCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetchWithAuth('/api/admin/analytics')
        if (res.ok) {
          const analytics = (await res.json()) as AnalyticsData
          setData(analytics)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchAnalytics()
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <ChartsSkeleton key="skeleton" />
      ) : data ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Timeline Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="group border-[var(--brand-neon)]/20 bg-black transition-all duration-300 hover:border-[var(--brand-neon)]/40 hover:shadow-[0_0_30px_rgba(213,255,10,0.1)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <TrendingUpIcon className="h-5 w-5 text-[var(--brand-neon)]" />
                  </motion.div>
                  Évolution sur 6 mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineChart data={data.timeline} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Status & Category Distribution */}
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="group h-full border-[var(--brand-neon)]/20 bg-black transition-all duration-300 hover:border-[var(--brand-neon)]/40 hover:shadow-[0_0_30px_rgba(213,255,10,0.1)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <PieChartIcon className="h-5 w-5 text-[var(--brand-neon)]" />
                    </motion.div>
                    Distribution par statut
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusChart data={data.statusDistribution} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="group h-full border-[var(--brand-neon)]/20 bg-black transition-all duration-300 hover:border-[var(--brand-neon)]/40 hover:shadow-[0_0_30px_rgba(213,255,10,0.1)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <BarChartIcon className="h-5 w-5 text-[var(--brand-neon)]" />
                    </motion.div>
                    Top catégories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryChart data={data.categoryDistribution} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

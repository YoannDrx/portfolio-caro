'use client'

import { useEffect, useRef } from 'react'

import { type Variants, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { FolderIcon, MusicIcon, TagIcon, UsersIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Icon mapping - add more icons as needed
const iconMap = {
  music: MusicIcon,
  users: UsersIcon,
  folder: FolderIcon,
  tag: TagIcon,
} as const

type IconName = keyof typeof iconMap

type StatCardProps = {
  title: string
  value: string | number
  description?: string
  icon: IconName
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const iconPulseVariants: Variants = {
  pulse: {
    scale: [1, 1.15, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const trendVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.3, duration: 0.4 },
  },
}

// Animated counter component
function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    if (isInView) {
      motionValue.set(0)
      const animation = setTimeout(() => {
        const duration = 1500
        const startTime = Date.now()

        const animateValue = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3)
          motionValue.set(easeProgress * value)

          if (progress < 1) {
            requestAnimationFrame(animateValue)
          }
        }

        requestAnimationFrame(animateValue)
      }, 100)

      return () => {
        clearTimeout(animation)
      }
    }
  }, [isInView, value, motionValue])

  return (
    <motion.span ref={ref} className="tabular-nums">
      {rounded}
    </motion.span>
  )
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  const isNumeric = typeof value === 'number'
  const Icon = iconMap[icon]

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      <Card
        className={cn(
          'group relative overflow-hidden border-[var(--brand-neon)]/20 bg-black transition-all duration-300',
          'hover:border-[var(--brand-neon)]/40 hover:shadow-[0_0_30px_rgba(213,255,10,0.1)]',
          className
        )}
      >
        {/* Glow effect on hover */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--brand-neon)]/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/70">{title}</CardTitle>
          <motion.div className="relative" variants={iconPulseVariants} animate="pulse">
            <Icon className="h-5 w-5 text-[var(--brand-neon)]/50 transition-colors duration-300 group-hover:text-[var(--brand-neon)]" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {isNumeric ? <AnimatedCounter value={value} /> : value}
          </div>
          {description && (
            <motion.p
              className="mt-1 text-xs text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {description}
            </motion.p>
          )}
          {trend && (
            <motion.div
              className="mt-2 flex items-center gap-1 text-xs"
              variants={trendVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                className={cn(
                  'flex items-center gap-0.5 font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-sm">{trend.isPositive ? '↑' : '↓'}</span>
                {Math.abs(trend.value)}%
              </motion.span>
              <span className="text-white/50">vs mois dernier</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

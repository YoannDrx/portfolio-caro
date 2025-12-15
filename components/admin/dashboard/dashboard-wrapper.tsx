'use client'

import { type ReactNode } from 'react'

import { type Variants, motion } from 'framer-motion'

// Animation variants
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
    },
  },
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

type DashboardWrapperProps = {
  children: ReactNode
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-8">
      {children}
    </motion.div>
  )
}

type DashboardHeaderProps = {
  title: string
  description: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <motion.div variants={headerVariants}>
      <h1 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-3xl font-bold text-transparent">
        {title}
      </h1>
      <p className="mt-2 text-white/50">{description}</p>
    </motion.div>
  )
}

type StatsGridProps = {
  children: ReactNode
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <motion.div variants={gridVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {children}
    </motion.div>
  )
}

type DashboardSectionProps = {
  children: ReactNode
  className?: string
}

export function DashboardSection({ children, className }: DashboardSectionProps) {
  return (
    <motion.div variants={sectionVariants} className={className}>
      {children}
    </motion.div>
  )
}

type AnimatedCardWrapperProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCardWrapper({ children, className, delay = 0 }: AnimatedCardWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

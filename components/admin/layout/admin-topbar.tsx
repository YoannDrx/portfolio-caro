'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { type Variants, motion } from 'framer-motion'
import { ChevronRightIcon, LogOutIcon, MenuIcon } from 'lucide-react'

import { NotificationsBell } from '@/components/admin/notifications-bell'
import { ThemeToggle } from '@/components/admin/theme-toggle'

import type { AdminDictionary } from '@/types/dictionary'

type AdminTopBarProps = {
  locale: string
  dict: AdminDictionary
  onToggleSidebar?: () => void
}

// Animation variants
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const breadcrumbVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
}

const actionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
}

export function AdminTopBar({ locale, dict, onToggleSidebar }: AdminTopBarProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (!pathname) return []

    const segments = pathname.split('/').filter(Boolean)
    // Remove locale from segments
    const pathSegments = segments.slice(1) // Skip locale

    const breadcrumbs = [
      {
        label: 'Admin',
        href: `/${locale}/admin`,
      },
    ]

    let currentPath = `/${locale}/admin`

    for (const segment of pathSegments) {
      // Skip "admin" as it's already in the first breadcrumb
      if (segment === 'admin') continue

      currentPath += `/${segment}`

      // Capitalize and format segment
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        href: currentPath,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-30 border-b border-[var(--brand-neon)]/10 bg-black/90 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          {onToggleSidebar && (
            <motion.button
              type="button"
              onClick={onToggleSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-[var(--brand-neon)]/30 hover:bg-[var(--brand-neon)]/10 hover:text-[var(--brand-neon)] lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <MenuIcon className="h-5 w-5" />
            </motion.button>
          )}

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <motion.div
                  key={crumb.href}
                  custom={index}
                  variants={breadcrumbVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-2"
                >
                  {index > 0 && <ChevronRightIcon className="h-4 w-4 text-white/20" />}
                  {isLast ? (
                    <motion.span
                      className="font-medium text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {crumb.label}
                    </motion.span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-white/50 transition-colors hover:text-[var(--brand-neon)]"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.div custom={0} variants={actionVariants} initial="hidden" animate="visible">
            <ThemeToggle />
          </motion.div>

          {/* Notifications */}
          <motion.div custom={1} variants={actionVariants} initial="hidden" animate="visible">
            <NotificationsBell />
          </motion.div>

          {/* Logout Button */}
          <motion.button
            custom={2}
            variants={actionVariants}
            initial="hidden"
            animate="visible"
            type="button"
            onClick={() => {
              void (async () => {
                try {
                  await fetch('/api/auth/sign-out', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({}),
                  })
                  // Force full page reload with hard refresh
                  window.location.href = '/'
                  window.location.reload()
                } catch {
                  // Silently fail - user will notice they're still logged in
                }
              })()
            }}
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(213, 255, 10, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-[var(--brand-neon)]/10 hover:text-[var(--brand-neon)]"
            aria-label={dict.nav.logout}
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{dict.nav.logout}</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}

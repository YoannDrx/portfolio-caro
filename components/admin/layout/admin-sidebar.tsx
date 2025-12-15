'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AnimatePresence, type Variants, motion } from 'framer-motion'
import {
  AlertTriangleIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  FolderIcon,
  HomeIcon,
  ImageIcon,
  MusicIcon,
  ScrollTextIcon,
  ShieldCheckIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import type { AdminDictionary } from '@/types/dictionary'

type AdminSidebarProps = {
  locale: string
  dict: AdminDictionary
  userEmail: string
  userName?: string | null
  avatarUrl?: string | null
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
}

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  group?: 'content' | 'system'
}

// Animation variants
const sidebarVariants: Variants = {
  expanded: {
    width: 256,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  collapsed: {
    width: 64,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
}

const labelVariants: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
  hidden: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15 },
  },
}

const navItemVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
}

const activeIndicatorVariants: Variants = {
  inactive: { scaleY: 0, opacity: 0 },
  active: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// Nav item component - defined outside to avoid recreation on each render
type NavItemComponentProps = {
  item: NavItem
  index: number
  active: boolean
  collapsed: boolean
  onCloseMobile: () => void
}

function NavItemComponent({
  item,
  index,
  active,
  collapsed,
  onCloseMobile,
}: NavItemComponentProps) {
  return (
    <motion.div
      custom={index}
      variants={navItemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ x: collapsed ? 0 : 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link
        href={item.href}
        className={cn(
          'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
          active
            ? 'bg-[var(--brand-neon)]/10 text-[var(--brand-neon)]'
            : 'text-white/70 hover:bg-white/5 hover:text-white'
        )}
        onClick={onCloseMobile}
      >
        {/* Active indicator */}
        <motion.div
          className="absolute left-0 h-full w-[3px] rounded-r-full bg-[var(--brand-neon)]"
          variants={activeIndicatorVariants}
          initial="inactive"
          animate={active ? 'active' : 'inactive'}
          style={{ originY: 0.5 }}
        />

        {/* Icon with glow on active */}
        <motion.div
          animate={{
            scale: active ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          className={cn('relative', active && 'drop-shadow-[0_0_8px_rgba(213,255,10,0.5)]')}
        >
          <item.icon className="h-5 w-5" />
        </motion.div>

        {/* Label */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              variants={labelVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  )
}

export function AdminSidebar({
  locale,
  dict,
  userEmail,
  userName,
  avatarUrl,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: `/${locale}/admin`,
      label: dict.nav.dashboard,
      icon: HomeIcon,
    },
    {
      href: `/${locale}/admin/projets`,
      label: dict.nav.projets,
      icon: MusicIcon,
      group: 'content',
    },
    {
      href: `/${locale}/admin/artistes`,
      label: dict.nav.artists,
      icon: UsersIcon,
      group: 'content',
    },
    {
      href: `/${locale}/admin/categories`,
      label: dict.nav.categories,
      icon: FolderIcon,
      group: 'content',
    },
    {
      href: `/${locale}/admin/labels`,
      label: dict.nav.labels,
      icon: TagIcon,
      group: 'content',
    },
    {
      href: `/${locale}/admin/expertises`,
      label: dict.nav.expertises,
      icon: BookOpenIcon,
      group: 'content',
    },
    {
      href: `/${locale}/admin/cv`,
      label: 'CV',
      icon: FileTextIcon,
      group: 'content',
    },
    {
      href: `/${locale}/admin/medias`,
      label: 'Médias',
      icon: ImageIcon,
      group: 'system',
    },
    {
      href: `/${locale}/admin/monitoring/duplicates`,
      label: 'Doublons',
      icon: AlertTriangleIcon,
      group: 'system',
    },
    {
      href: `/${locale}/admin/exports/history`,
      label: 'Exports',
      icon: DownloadIcon,
      group: 'system',
    },
    {
      href: `/${locale}/admin/logs`,
      label: 'Audit Logs',
      icon: ScrollTextIcon,
      group: 'system',
    },
    {
      href: `/${locale}/admin/settings/security`,
      label: 'Sécurité',
      icon: ShieldCheckIcon,
      group: 'system',
    },
  ]

  const contentItems = navItems.filter((item) => item.group === 'content')
  const systemItems = navItems.filter((item) => item.group === 'system')
  const dashboardItem = navItems.find((item) => !item.group)

  const isActive = (href: string) => {
    if (href === `/${locale}/admin`) {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Backdrop mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={collapsed ? 'collapsed' : 'expanded'}
        className={cn(
          'fixed top-0 left-0 z-40 h-screen border-r border-[var(--brand-neon)]/10 bg-black/95 backdrop-blur-xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: collapsed ? 64 : 256 }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--brand-neon)]/10 px-3 py-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    {/* Avatar with glow */}
                    <motion.div
                      className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--brand-neon)]/30 bg-[var(--brand-neon)]/10"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={userName ?? userEmail}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-[var(--brand-neon)]">
                          {userEmail?.charAt(0).toUpperCase()}
                        </span>
                      )}
                      {/* Subtle glow ring */}
                      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(213,255,10,0.2)]" />
                    </motion.div>
                    <div className="transition-all">
                      <h1 className="text-sm font-semibold text-white">{userName ?? 'Admin'}</h1>
                      <p className="max-w-[120px] truncate text-xs text-white/50">{userEmail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Collapse toggle button */}
            <motion.button
              type="button"
              onClick={onToggleCollapse}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-[var(--brand-neon)]/30 hover:bg-[var(--brand-neon)]/10 hover:text-[var(--brand-neon)]"
              aria-label={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
            >
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {collapsed ? (
                  <ChevronRightIcon className="h-4 w-4" />
                ) : (
                  <ChevronLeftIcon className="h-4 w-4" />
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 overflow-y-auto p-2">
            {/* Dashboard */}
            {dashboardItem && (
              <NavItemComponent
                item={dashboardItem}
                index={0}
                active={isActive(dashboardItem.href)}
                collapsed={collapsed}
                onCloseMobile={onCloseMobile}
              />
            )}

            {/* Content Section */}
            {contentItems.length > 0 && (
              <div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mb-2 px-3 text-[10px] font-bold tracking-widest text-white/30 uppercase"
                    >
                      Contenu
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="space-y-1">
                  {contentItems.map((item, index) => (
                    <NavItemComponent
                      key={item.href}
                      item={item}
                      index={index + 1}
                      active={isActive(item.href)}
                      collapsed={collapsed}
                      onCloseMobile={onCloseMobile}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* System Section */}
            {systemItems.length > 0 && (
              <div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mb-2 px-3 text-[10px] font-bold tracking-widest text-white/30 uppercase"
                    >
                      Système
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="space-y-1">
                  {systemItems.map((item, index) => (
                    <NavItemComponent
                      key={item.href}
                      item={item}
                      index={index + contentItems.length + 2}
                      active={isActive(item.href)}
                      collapsed={collapsed}
                      onCloseMobile={onCloseMobile}
                    />
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Footer - Back to Site */}
          <div className="border-t border-[var(--brand-neon)]/10 p-2">
            <motion.div whileHover={{ x: collapsed ? 0 : 4 }}>
              <Link
                href={`/${locale}`}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/5 hover:text-white"
                onClick={onCloseMobile}
              >
                <HomeIcon className="h-5 w-5" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      variants={labelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {dict.nav.backToSite}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

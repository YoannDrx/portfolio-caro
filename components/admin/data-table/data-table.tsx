'use client'

import { AnimatePresence, type Variants, motion } from 'framer-motion'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Loader2Icon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type Column<T> = {
  key: string
  label: string | React.ReactNode
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  pagination?: {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string) => void
  isLoading?: boolean
  emptyMessage?: string
}

// Animation variants
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const loadingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

const pulseVariants: Variants = {
  pulse: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

const sortIndicatorVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: {
      duration: 0.15,
    },
  },
}

function LoadingState({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32">
        <div className="flex flex-col items-center justify-center gap-3">
          <motion.div variants={loadingVariants} animate="animate">
            <Loader2Icon className="h-8 w-8 text-[var(--brand-neon)]" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/50"
          >
            Chargement...
          </motion.p>
        </div>
      </TableCell>
    </TableRow>
  )
}

function EmptyState({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-2"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5"
          >
            <span className="text-2xl">📭</span>
          </motion.div>
          <p className="text-center text-white/50">{message}</p>
        </motion.div>
      </TableCell>
    </TableRow>
  )
}

// Deterministic widths for skeleton rows to avoid Math.random() during render
const SKELETON_WIDTHS = [75, 60, 85, 70, 90, 65, 80]

function _SkeletonRow({ colSpan }: { colSpan: number }) {
  return (
    <TableRow className="border-b border-white/5">
      {Array.from({ length: colSpan }).map((_, index) => (
        <TableCell key={index}>
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="h-4 rounded bg-white/10"
            style={{ width: `${String(SKELETON_WIDTHS[index % SKELETON_WIDTHS.length])}%` }}
          />
        </TableCell>
      ))}
    </TableRow>
  )
}

type SortIndicatorProps = {
  active: boolean
  order: 'asc' | 'desc' | undefined
}

function SortIndicator({ active, order }: SortIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.span
          key={order}
          variants={sortIndicatorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-[var(--brand-neon)]"
        >
          {order === 'asc' ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  isLoading = false,
  emptyMessage = 'Aucune donnée disponible',
}: DataTableProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[var(--brand-neon)]/20 bg-black transition-all duration-300 hover:border-[var(--brand-neon)]/30">
        <Table>
          <TableHeader>
            <motion.tr
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="border-b border-[var(--brand-neon)]/20 hover:bg-transparent"
            >
              {columns.map((column, index) => (
                <TableHead
                  key={column.key}
                  className="text-white/70"
                  onClick={
                    column.sortable && onSort
                      ? () => {
                          onSort(column.key)
                        }
                      : undefined
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={
                      column.sortable
                        ? 'flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-[var(--brand-neon)]'
                        : ''
                    }
                  >
                    {column.label}
                    {column.sortable && (
                      <SortIndicator
                        active={sortBy === column.key}
                        order={sortBy === column.key ? sortOrder : undefined}
                      />
                    )}
                  </motion.div>
                </TableHead>
              ))}
            </motion.tr>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingState colSpan={columns.length} />
            ) : data.length === 0 ? (
              <EmptyState colSpan={columns.length} message={emptyMessage} />
            ) : (
              data.map((item, rowIndex) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: rowIndex * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    transition: { duration: 0.15 },
                  }}
                  className="border-b border-white/5 transition-colors"
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="text-white/80">
                      {column.render
                        ? column.render(item)
                        : ((item as Record<string, unknown>)[column.key]?.toString() ?? '-')}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AnimatePresence>
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-white/50"
            >
              Page{' '}
              <motion.span
                key={pagination.page}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-medium text-white"
              >
                {pagination.page + 1}
              </motion.span>{' '}
              sur {pagination.totalPages}
            </motion.p>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pagination.onPageChange(pagination.page - 1)
                  }}
                  disabled={pagination.page === 0}
                  className="gap-1 border-white/20 text-white transition-all duration-200 hover:border-[var(--brand-neon)]/50 hover:bg-white/5 disabled:opacity-30"
                >
                  <motion.div
                    animate={pagination.page > 0 ? { x: [0, -2, 0] } : {}}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </motion.div>
                  Précédent
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    pagination.onPageChange(pagination.page + 1)
                  }}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="gap-1 border-white/20 text-white transition-all duration-200 hover:border-[var(--brand-neon)]/50 hover:bg-white/5 disabled:opacity-30"
                >
                  Suivant
                  <motion.div
                    animate={pagination.page < pagination.totalPages - 1 ? { x: [0, 2, 0] } : {}}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

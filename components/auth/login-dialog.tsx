'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import { AnimatePresence, type Variants, motion } from 'framer-motion'
import { KeyRoundIcon, Loader2Icon, LockIcon, MailIcon, SparklesIcon } from 'lucide-react'

import { signIn } from '@/lib/auth-client'
import type { Locale } from '@/lib/i18n-config'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type LoginDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  locale: Locale
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
}

const shakeVariants: Variants = {
  initial: { opacity: 0, y: -10, x: 0 },
  shake: {
    opacity: 1,
    y: 0,
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, y: -10 },
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

const spinnerVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export function LoginDialog({ open, onOpenChange, locale }: LoginDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)
  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError(result.error.message ?? 'Erreur de connexion')
      } else {
        // Connexion réussie, fermer la dialog et rediriger vers admin
        onOpenChange(false)
        router.push(`/${locale}/admin`)
        router.refresh()
      }
    } catch (err) {
      setError('Une erreur est survenue')
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void handleSubmit(e)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-[var(--brand-neon)]/20 bg-black/95 p-0 text-white backdrop-blur-xl sm:max-w-[440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key="login-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative"
          >
            {/* Decorative glow background */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[var(--brand-neon)]/20 blur-3xl" />

            <div className="relative p-6">
              <DialogHeader className="mb-6">
                <div className="mb-4 flex items-center justify-center">
                  <motion.div
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--brand-neon)]/30 bg-[var(--brand-neon)]/10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <KeyRoundIcon className="h-8 w-8 text-[var(--brand-neon)]" />
                    <motion.div
                      className="absolute -top-1 -right-1"
                      variants={pulseVariants}
                      animate="pulse"
                    >
                      <SparklesIcon className="h-4 w-4 text-[var(--brand-neon)]" />
                    </motion.div>
                  </motion.div>
                </div>
                <motion.div variants={itemVariants}>
                  <DialogTitle className="text-center text-2xl font-bold text-white">
                    Connexion{' '}
                    <span className="bg-gradient-to-r from-[var(--brand-neon)] to-[var(--brand-emerald)] bg-clip-text text-transparent">
                      Admin
                    </span>
                  </DialogTitle>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <DialogDescription className="text-center text-white/60">
                    Accédez à l'interface d'administration
                  </DialogDescription>
                </motion.div>
              </DialogHeader>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                  >
                    <MailIcon className="h-4 w-4" />
                    Email
                  </label>
                  <motion.div
                    className="relative"
                    animate={{
                      boxShadow:
                        focusedField === 'email'
                          ? '0 0 25px rgba(213, 255, 10, 0.25)'
                          : '0 0 0px rgba(213, 255, 10, 0)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ borderRadius: '12px' }}
                  >
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                      onFocus={() => {
                        setFocusedField('email')
                      }}
                      onBlur={() => {
                        setFocusedField(null)
                      }}
                      required
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white transition-all duration-200 placeholder:text-white/30 focus:border-[var(--brand-neon)] focus:bg-white/[0.08] focus:outline-none"
                      placeholder="ton-email"
                      disabled={loading}
                    />
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="password"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80"
                  >
                    <LockIcon className="h-4 w-4" />
                    Mot de passe
                  </label>
                  <motion.div
                    className="relative"
                    animate={{
                      boxShadow:
                        focusedField === 'password'
                          ? '0 0 25px rgba(213, 255, 10, 0.25)'
                          : '0 0 0px rgba(213, 255, 10, 0)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ borderRadius: '12px' }}
                  >
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      onFocus={() => {
                        setFocusedField('password')
                      }}
                      onBlur={() => {
                        setFocusedField(null)
                      }}
                      required
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white transition-all duration-200 placeholder:text-white/30 focus:border-[var(--brand-neon)] focus:bg-white/[0.08] focus:outline-none"
                      placeholder="ton-mot-de-passe"
                      disabled={loading}
                    />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      variants={shakeVariants}
                      initial="initial"
                      animate="shake"
                      exit="exit"
                      className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    >
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={
                      !loading
                        ? {
                            scale: 1.02,
                            boxShadow: '0 0 30px rgba(213, 255, 10, 0.4)',
                          }
                        : {}
                    }
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="relative w-full overflow-hidden rounded-xl bg-[var(--brand-neon)] px-4 py-3.5 font-semibold text-black transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className={loading ? 'opacity-0' : 'opacity-100'}>Se connecter</span>
                    {loading && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        variants={spinnerVariants}
                        animate="spin"
                      >
                        <Loader2Icon className="h-5 w-5" />
                      </motion.div>
                    )}
                  </motion.button>
                </motion.div>

                <motion.p variants={itemVariants} className="text-center text-xs text-white/40">
                  Espace réservé aux administrateurs
                </motion.p>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

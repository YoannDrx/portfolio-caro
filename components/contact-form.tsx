'use client'

import { useRef, useState } from 'react'

import type { ContactFormDictionary } from '@/types/dictionary'

type ContactFormProps = {
  dictionary: ContactFormDictionary
}

type FormData = {
  name: string
  email: string
  subject: string
  message: string
}

type FieldName = keyof FormData
type FieldErrors = Partial<Record<FieldName, string>>

const initialFormData: FormData = { name: '', email: '', subject: '', message: '' }

export function ContactForm({ dictionary }: ContactFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  const validate = () => {
    const nextErrors: FieldErrors = {}
    for (const field of ['name', 'email', 'subject', 'message'] as const) {
      if (!formData[field].trim()) nextErrors[field] = dictionary.required
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(formData.email.trim())) {
      nextErrors.email = dictionary.invalidEmail
    }
    setErrors(nextErrors)
    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setStatus('idle')
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    setStatus('loading')
    setErrorMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = (await response.json()) as { error?: string | { message?: string } }
      if (!response.ok) {
        const message = typeof data.error === 'string' ? data.error : data.error?.message
        throw new Error(message ?? dictionary.error)
      }
      setStatus('success')
      setErrors({})
      setFormData(initialFormData)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : dictionary.error)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as FieldName
    setFormData((previous) => ({ ...previous, [field]: event.target.value }))
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
    if (status === 'success') setStatus('idle')
  }

  const inputClasses =
    'min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-white placeholder:text-white/30 transition-colors focus:border-[var(--brand-neon)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-neon)]/20 aria-[invalid=true]:border-[var(--color-error)]'

  const renderField = (field: Exclude<FieldName, 'message'>, type: 'text' | 'email') => {
    const copy = dictionary.fields[field]
    return (
      <div>
        <label
          htmlFor={field}
          className="mb-2 block text-xs font-semibold tracking-wider text-white/70 uppercase"
        >
          {copy.label}
        </label>
        <input
          type={type}
          id={field}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          autoComplete={field === 'name' ? 'name' : field === 'email' ? 'email' : undefined}
          aria-invalid={Boolean(errors[field])}
          aria-describedby={errors[field] ? `${field}-error` : undefined}
          className={inputClasses}
          placeholder={copy.placeholder}
        />
        {errors[field] ? (
          <p id={`${field}-error`} className="mt-2 text-sm text-[var(--color-error)]">
            {errors[field]}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-6" noValidate>
      {Object.keys(errors).length > 0 ? (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-[var(--color-error)] bg-[var(--color-error)]/10 p-4 text-sm text-white focus:ring-2 focus:ring-[var(--color-error)]/40 focus:outline-none"
        >
          {dictionary.errorSummary}
        </div>
      ) : null}

      {renderField('name', 'text')}
      {renderField('email', 'email')}
      {renderField('subject', 'text')}

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-xs font-semibold tracking-wider text-white/70 uppercase"
        >
          {dictionary.fields.message.label}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={7}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${inputClasses} resize-y`}
          placeholder={dictionary.fields.message.placeholder}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-sm text-[var(--color-error)]">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {status === 'error' ? (
          <p className="rounded-lg border border-[var(--color-error)] bg-[var(--color-error)]/10 p-4 text-sm text-white">
            {errorMessage || dictionary.error}
          </p>
        ) : null}
        {status === 'success' ? (
          <p className="rounded-lg border border-[var(--brand-neon)]/40 bg-[var(--brand-neon)]/10 p-4 text-sm text-[var(--brand-neon)]">
            {dictionary.success}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="min-h-11 border border-[var(--brand-neon)] bg-[var(--brand-neon)] px-6 py-3 text-sm font-semibold tracking-wide text-black uppercase transition-colors hover:bg-transparent hover:text-[var(--brand-neon)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? dictionary.submit.loading : dictionary.submit.idle}
        </button>
      </div>
    </form>
  )
}

import { motion } from 'motion/react'
import { useState } from 'react'
import { QuizButton } from '@/components/ui/QuizButton'

interface EmailCaptureScreenProps {
  email: string
  firstName: string
  isSubmitting: boolean
  onEmailChange: (email: string) => void
  onFirstNameChange: (name: string) => void
  onSubmit: () => void
}

export function EmailCaptureScreen({
  email,
  firstName,
  isSubmitting,
  onEmailChange,
  onFirstNameChange,
  onSubmit,
}: EmailCaptureScreenProps) {
  const [emailError, setEmailError] = useState('')

  const validateEmail = (value: string) => {
    if (!value) return 'We need your email to reveal the magic'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "That doesn't look quite right"
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateEmail(email)
    if (error) {
      setEmailError(error)
      return
    }
    setEmailError('')
    onSubmit()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 w-full max-w-md mx-auto">
      {/* Mystery cocktail icon */}
      <motion.div
        className="text-6xl sm:text-7xl mb-6"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: [1, 1.05, 1],
        }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        🍸
      </motion.div>

      {/* Headline */}
      <motion.h2
        className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-text-dark text-center mb-3 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Your cocktail personality
        <br />
        <span className="bg-gradient-to-r from-teal to-pink bg-clip-text text-transparent">
          is ready...
        </span>
      </motion.h2>

      {/* Subheadline */}
      <motion.p
        className="text-text-body text-base sm:text-lg text-center mb-8 font-[family-name:var(--font-body)]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        Drop your email and we'll reveal it. Plus, you'll get first dibs on
        events, drops, and things that'll make your mates jealous.
      </motion.p>

      {/* Form */}
      <motion.form
        className="w-full space-y-4"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* First name */}
        <div>
          <input
            type="text"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="w-full bg-white/90 border-2 border-border-light rounded-2xl px-5 py-4 text-text-dark placeholder-text-muted text-base font-[family-name:var(--font-body)] outline-none focus:border-teal transition-colors duration-200 shadow-sm"
          />
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => {
              onEmailChange(e.target.value)
              if (emailError) setEmailError('')
            }}
            className={`w-full bg-white/90 border-2 rounded-2xl px-5 py-4 text-text-dark placeholder-text-muted text-base font-[family-name:var(--font-body)] outline-none transition-colors duration-200 shadow-sm ${
              emailError
                ? 'border-pink focus:border-pink'
                : 'border-border-light focus:border-teal'
            }`}
          />
          {emailError && (
            <motion.p
              className="text-pink text-sm mt-2 ml-1 font-medium font-[family-name:var(--font-body)]"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {emailError}
            </motion.p>
          )}
        </div>

        {/* Submit */}
        <QuizButton
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Mixing...
            </span>
          ) : (
            'Reveal My Personality'
          )}
        </QuizButton>

        {/* Trust text */}
        <p className="text-text-muted text-sm text-center font-[family-name:var(--font-body)]">
          No spam. Just good vibes and cocktail news.
        </p>
      </motion.form>
    </div>
  )
}

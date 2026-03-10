import { motion } from 'motion/react'
import { QuizButton } from '@/components/ui/QuizButton'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      {/* Cocktail icon */}
      <motion.div
        className="text-6xl sm:text-7xl mb-6"
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 12,
          delay: 0.1,
        }}
      >
        🍸
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-bold text-white leading-tight mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      >
        What's Your
        <br />
        <span className="text-teal">Cocktail Personality?</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        className="text-text-light text-base sm:text-lg max-w-md mb-10 font-[family-name:var(--font-body)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
      >
        Answer 5 ridiculous questions. Find out which drink matches your chaos.
        <span className="text-text-muted"> No judgement.</span>
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.7,
        }}
      >
        <QuizButton onClick={onStart}>Pour Me In</QuizButton>
      </motion.div>

      {/* Tiny brand footer */}
      <motion.p
        className="text-text-muted text-xs mt-12 font-[family-name:var(--font-body)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        by Designer Cocktails
      </motion.p>
    </div>
  )
}

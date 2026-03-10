import { motion } from 'motion/react'
import { QuizButton } from '@/components/ui/QuizButton'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6">
      {/* Desktop: side-by-side | Mobile: stacked */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

        {/* LEFT: Hero image */}
        <motion.div
          className="relative w-full max-w-sm lg:max-w-md lg:w-1/2 flex-shrink-0"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.15,
          }}
        >
          <img
            src="/hero-cans.jpg"
            alt="Designer Cocktails range"
            className="w-full rounded-3xl shadow-2xl shadow-pink/20"
          />
          {/* Colorful glow behind image */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-teal/20 via-pink/20 to-purple/20 blur-2xl -z-10" />
        </motion.div>

        {/* RIGHT: Text content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
          {/* Brand logo */}
          <motion.img
            src="/brand-logo.svg"
            alt="Designer Cocktails"
            className="h-10 sm:h-12 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Headline */}
          <motion.h1
            className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          >
            {"What's Your"}
            <br />
            <span className="bg-gradient-to-r from-teal via-pink to-purple bg-clip-text text-transparent">
              Cocktail Personality?
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-text-body text-lg sm:text-xl max-w-md mb-10 font-[family-name:var(--font-body)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
          >
            Answer 8 ridiculous questions. Find out which drink matches your chaos.
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
            className="text-text-muted text-xs mt-10 font-[family-name:var(--font-body)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            The Real Cocktail in a Can
          </motion.p>
        </div>
      </div>
    </div>
  )
}

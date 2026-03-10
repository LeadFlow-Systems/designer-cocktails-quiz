import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import type { Personality } from '@/types/quiz'
import { QuizButton } from '@/components/ui/QuizButton'
import { staggerContainer, fadeInUp } from '@/utils/animations'

interface ResultScreenProps {
  personality: Personality
  onRestart: () => void
}

export function ResultScreen({ personality, onRestart }: ResultScreenProps) {
  const [phase, setPhase] = useState<'burst' | 'reveal' | 'details'>('burst')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 800)
    const t2 = setTimeout(() => setPhase('details'), 2000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full max-w-lg mx-auto relative">
      {/* Burst effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={
          phase === 'burst'
            ? { opacity: [0, 1, 0.3, 0] }
            : { opacity: 0 }
        }
        transition={{ duration: 1.2 }}
      >
        {/* Radial burst rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border"
            style={{ borderColor: personality.color }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{
              width: [0, 200 * ring],
              height: [0, 200 * ring],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 1.2,
              delay: ring * 0.15,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Central glow */}
        <motion.div
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${personality.color}40 0%, transparent 70%)`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 3, 2], opacity: [0, 0.8, 0.2] }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>

      {/* Emoji */}
      <motion.div
        className="text-6xl sm:text-7xl mb-4 relative z-10"
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={
          phase !== 'burst'
            ? { scale: 1, opacity: 1, rotate: 0 }
            : { scale: 0, opacity: 0 }
        }
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 12,
        }}
      >
        {personality.emoji}
      </motion.div>

      {/* Personality name */}
      <motion.h2
        className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-center mb-2 leading-tight relative z-10"
        style={{ color: personality.color }}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          phase !== 'burst'
            ? { scale: 1, opacity: 1 }
            : { scale: 0, opacity: 0 }
        }
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 14,
          delay: 0.15,
        }}
      >
        {personality.name}
      </motion.h2>

      {/* Tagline */}
      <motion.p
        className="text-text-light text-base sm:text-lg text-center mb-6 italic font-[family-name:var(--font-body)] relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={
          phase !== 'burst'
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 10 }
        }
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        "{personality.tagline}"
      </motion.p>

      {/* Description + traits + CTA - only show in details phase */}
      {phase === 'details' && (
        <>
          {/* Description */}
          <motion.p
            className="text-text-light text-sm sm:text-base text-center mb-8 max-w-md font-[family-name:var(--font-body)] relative z-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {personality.description}
          </motion.p>

          {/* Traits */}
          <motion.div
            className="w-full grid grid-cols-2 gap-3 mb-8 relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {personality.traits.map((trait) => (
              <motion.div
                key={trait}
                className="bg-dark-surface border border-border-dark rounded-xl px-4 py-3 text-center"
                variants={fadeInUp}
              >
                <span className="text-sm text-text-light font-medium font-[family-name:var(--font-body)]">
                  {trait}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Matched drink */}
          <motion.div
            className="w-full bg-dark-card border border-border-dark rounded-2xl p-5 mb-8 text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1 font-[family-name:var(--font-body)]">
              Your Perfect Match
            </p>
            <p
              className="font-[family-name:var(--font-display)] text-xl font-bold"
              style={{ color: personality.color }}
            >
              {personality.matchedDrink}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 w-full relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <QuizButton
              onClick={() =>
                window.open('https://designercocktails.co.uk', '_blank')
              }
              className="flex-1"
            >
              Shop Your Match
            </QuizButton>
            <QuizButton
              variant="secondary"
              onClick={onRestart}
              className="flex-1"
            >
              Take It Again
            </QuizButton>
          </motion.div>

          {/* Share */}
          <motion.div
            className="mt-6 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-text-muted text-xs text-center mb-3 font-[family-name:var(--font-body)]">
              Share your result
            </p>
            <div className="flex gap-3 justify-center">
              <ShareButton
                label="Copy Link"
                icon="🔗"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                }}
              />
              <ShareButton
                label="X"
                icon="𝕏"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm "${personality.name}" - what's your cocktail personality? 🍸`)}&url=${encodeURIComponent(window.location.href)}`,
                    '_blank'
                  )
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

function ShareButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: string
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 bg-dark-surface border border-border-dark rounded-lg px-4 py-2 text-text-light text-sm hover:border-teal-glow cursor-pointer transition-colors duration-200 font-[family-name:var(--font-body)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.button>
  )
}

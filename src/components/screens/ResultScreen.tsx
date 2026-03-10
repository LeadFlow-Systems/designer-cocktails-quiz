import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import type { Personality } from '@/types/quiz'
import { QuizButton } from '@/components/ui/QuizButton'
import { staggerContainer, fadeInUp } from '@/utils/animations'
import { analytics } from '@/lib/analytics'

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
    <div className="flex flex-col items-center justify-start min-h-screen px-6 w-full max-w-xl mx-auto pt-8 pb-16 relative">
      <BurstEffect phase={phase} color={personality.color} />
      <ResultHeader phase={phase} personality={personality} />
      {phase === 'details' && (
        <ResultDetails personality={personality} onRestart={onRestart} />
      )}
    </div>
  )
}

function BurstEffect({ phase, color }: { phase: string; color: string }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={phase === 'burst' ? { opacity: [0, 1, 0.3, 0] } : { opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-2"
          style={{ borderColor: color }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: [0, 200 * ring], height: [0, 200 * ring], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, delay: ring * 0.15, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, ' + color + '50 0%, transparent 70%)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 4, 3], opacity: [0, 0.6, 0.1] }}
        transition={{ duration: 1.5 }}
      />
    </motion.div>
  )
}

function ResultHeader({ phase, personality }: { phase: string; personality: Personality }) {
  return (
    <motion.div
      className="w-full rounded-3xl p-8 sm:p-10 text-center mb-6 relative z-10 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, ' + personality.color + '15 0%, ' + personality.color + '08 100%)',
        border: '2px solid ' + personality.color + '30',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={phase !== 'burst' ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 14 }}
    >

      <motion.p
        className="text-sm font-bold uppercase tracking-[0.2em] text-text-muted mb-2 font-[family-name:var(--font-display)] relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={phase !== 'burst' ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
      >
        You are...
      </motion.p>

      <motion.div
        className="text-7xl sm:text-8xl mb-4 relative z-10"
        initial={{ scale: 0, rotate: -20 }}
        animate={phase !== 'burst' ? { scale: 1, rotate: 0 } : { scale: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
      >
        {personality.emoji}
      </motion.div>

      <motion.h1
        className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold text-center mb-3 leading-tight relative z-10"
        style={{ color: personality.color }}
        initial={{ scale: 0, opacity: 0 }}
        animate={phase !== 'burst' ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
      >
        {personality.name}
      </motion.h1>

      <motion.p
        className="text-text-body text-lg sm:text-xl text-center italic font-[family-name:var(--font-body)] relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={phase !== 'burst' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        "{personality.tagline}"
      </motion.p>
    </motion.div>
  )
}

function ResultDetails({ personality, onRestart }: ResultScreenProps) {
  const handleShop = () => {
    analytics.shopClicked(personality.name)
    window.open('https://designercocktails.co.uk/product/canned-cocktails-bundle/', '_blank')
  }

  const handleRetake = () => {
    analytics.retakeClicked()
    onRestart()
  }

  const handleInstagram = () => {
    analytics.shareClicked('instagram')
    window.open('https://www.instagram.com/designercocktailsuk/', '_blank')
  }

  const handleCopyLink = () => {
    analytics.shareClicked('copy_link')
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <>
      <motion.div
        className="w-full bg-white/70 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm border border-border-light relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-text-body text-base sm:text-lg leading-relaxed font-[family-name:var(--font-body)] text-center">
          {personality.description}
        </p>
      </motion.div>

      <motion.div
        className="w-full grid grid-cols-2 gap-3 mb-6 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {personality.traits.map((trait) => (
          <motion.div
            key={trait}
            className="bg-white/80 border border-border-light rounded-2xl px-4 py-4 text-center shadow-sm"
            variants={fadeInUp}
          >
            <span className="text-sm sm:text-base text-text-dark font-semibold font-[family-name:var(--font-body)]">
              {trait}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="w-full rounded-3xl p-8 mb-8 text-center relative z-10 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, ' + personality.color + '12 0%, white 50%, ' + personality.color + '08 100%)',
          border: '2px solid ' + personality.color + '25',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-4 font-[family-name:var(--font-display)]"
          style={{ color: personality.color }}
        >
          Your Perfect Match
        </p>

        <motion.img
          src={personality.image}
          alt={personality.matchedDrink}
          className="w-44 sm:w-52 h-auto mx-auto mb-6 drop-shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
        />

        <p
          className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold"
          style={{ color: personality.color }}
        >
          {personality.matchedDrink}
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <QuizButton onClick={handleShop} className="flex-1">
          Shop Your Match
        </QuizButton>
        <QuizButton variant="secondary" onClick={handleRetake} className="flex-1">
          Take It Again
        </QuizButton>
      </motion.div>

      <motion.div className="mt-8 relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <p className="text-text-muted text-sm text-center mb-3 font-[family-name:var(--font-body)]">Share your result</p>
        <div className="flex gap-3 justify-center">
          <ShareButton label="Copy Link" onClick={handleCopyLink} />
          <ShareButton label="Follow on Instagram" onClick={handleInstagram} />
        </div>
      </motion.div>

      <motion.div className="mt-8 relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <img src="/brand-logo.svg" alt="Designer Cocktails" className="h-8 mx-auto opacity-40" />
      </motion.div>
    </>
  )
}

function ShareButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 bg-white/80 border border-border-light rounded-xl px-5 py-3 text-text-body text-sm font-medium hover:border-teal hover:text-teal cursor-pointer transition-all duration-200 font-[family-name:var(--font-body)] shadow-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{label}</span>
    </motion.button>
  )
}

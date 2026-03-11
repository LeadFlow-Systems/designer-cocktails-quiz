import { motion } from 'motion/react'
import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
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
  const shareCardRef = useRef<HTMLDivElement>(null)
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (!shareCardRef.current || isSharing) return
    setIsSharing(true)

    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      })

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      )

      if (!blob) {
        setIsSharing(false)
        return
      }

      const file = new File([blob], 'my-cocktail-personality.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        analytics.shareClicked('native')
        await navigator.share({
          text: `I'm "${personality.name}" — find your cocktail personality!\n\nhttps://web.designercocktails.co.uk`,
          files: [file],
        })
      } else {
        analytics.shareClicked('download')
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'my-cocktail-personality.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      // User cancelled share sheet — not an error
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    } finally {
      setIsSharing(false)
    }
  }

  const handleShop = () => {
    analytics.shopClicked()
    window.open('https://designercocktails.co.uk/product/canned-cocktails-bundle/', '_blank')
  }

  const handleRetake = () => {
    onRestart()
  }

  return (
    <>
      {/* Hidden share card — rendered off-screen for capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <ShareCard ref={shareCardRef} personality={personality} />
      </div>

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

      <motion.div
        className="flex gap-3 w-full mt-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <QuizButton variant="secondary" onClick={handleShare} className="flex-1" disabled={isSharing}>
          {isSharing ? 'Creating...' : 'Share My Result'}
        </QuizButton>
        <QuizButton variant="secondary" onClick={() => window.open('https://www.instagram.com/designercocktailsuk/', '_blank')} className="flex-1">
          Follow Us
        </QuizButton>
      </motion.div>

      <motion.div className="mt-8 relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <img src="/brand-logo.svg" alt="Designer Cocktails" className="h-8 mx-auto opacity-40" />
      </motion.div>
    </>
  )
}

import { forwardRef } from 'react'

const BRAND_LOGO_PNG_URI =
  'data:image/png;base64,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'

const ShareCard = forwardRef<HTMLDivElement, { personality: Personality }>(
  ({ personality }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: 540,
          height: 960,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#ffffff',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Colored header band */}
        <div style={{
          width: '100%',
          background: `linear-gradient(135deg, ${personality.color} 0%, ${personality.color}dd 100%)`,
          padding: '28px 40px 24px',
          textAlign: 'center',
        }}>
          <img
            src={BRAND_LOGO_PNG_URI}
            alt="Designer Cocktails"
            style={{ width: 200, height: 'auto', marginBottom: 16, filter: 'brightness(0) invert(1)' }}
          />
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
          }}>
            My Cocktail Personality
          </p>
        </div>

        {/* Main content area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 36px 0',
          width: '100%',
        }}>
          {/* Emoji + Name + Tagline */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 4 }}>
              {personality.emoji}
            </div>
            <h1 style={{
              fontSize: 36,
              fontWeight: 700,
              color: personality.color,
              margin: '0 0 6px 0',
              lineHeight: 1.1,
              fontFamily: "'Fredoka', 'DM Sans', system-ui, sans-serif",
            }}>
              {personality.name}
            </h1>
            <p style={{
              fontSize: 15,
              fontStyle: 'italic',
              color: '#666',
              margin: '0 0 10px 0',
            }}>
              "{personality.tagline}"
            </p>
            <p style={{
              fontSize: 13,
              color: '#555',
              margin: 0,
              lineHeight: 1.5,
              padding: '0 12px',
            }}>
              {personality.description}
            </p>
          </div>

          {/* Traits row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '0 4px',
          }}>
            {personality.traits.map((trait) => (
              <div
                key={trait}
                style={{
                  background: `${personality.color}12`,
                  border: `1.5px solid ${personality.color}30`,
                  borderRadius: 20,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: personality.color,
                }}
              >
                {trait}
              </div>
            ))}
          </div>

          {/* Can image + drink name */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <img
              src={personality.image}
              alt={personality.matchedDrink}
              style={{ width: 200, height: 'auto', marginBottom: 8 }}
              crossOrigin="anonymous"
            />
            <p style={{
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#999',
              margin: '0 0 2px 0',
            }}>
              Your Perfect Match
            </p>
            <p style={{
              fontSize: 22,
              fontWeight: 700,
              color: personality.color,
              margin: 0,
              fontFamily: "'Fredoka', 'DM Sans', system-ui, sans-serif",
            }}>
              {personality.matchedDrink}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          background: `${personality.color}10`,
          borderTop: `2px solid ${personality.color}20`,
          padding: '14px 40px',
          width: '100%',
        }}>
          <p style={{
            fontSize: 13,
            color: '#888',
            margin: '0 0 2px 0',
            fontWeight: 500,
          }}>
            Find your cocktail personality
          </p>
          <p style={{
            fontSize: 16,
            fontWeight: 700,
            color: personality.color,
            margin: 0,
            letterSpacing: '0.02em',
          }}>
            web.designercocktails.co.uk
          </p>
        </div>
      </div>
    )
  }
)

ShareCard.displayName = 'ShareCard'

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
    // Fire Meta Pixel event when quiz is completed
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CompleteRegistration', {
        content_name: personality.name,
      })
    }

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
          padding: '24px 40px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: "'Fredoka', 'DM Sans', system-ui, sans-serif",
            marginBottom: 8,
            letterSpacing: '0.02em',
          }}>
            Designer Cocktails
          </div>
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
          padding: '20px 36px 0',
          width: '100%',
        }}>
          {/* Emoji + Name + Tagline */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 4 }}>
              {personality.emoji}
            </div>
            <h1 style={{
              fontSize: 32,
              fontWeight: 700,
              color: personality.color,
              margin: '0 0 6px 0',
              lineHeight: 1.1,
              fontFamily: "'Fredoka', 'DM Sans', system-ui, sans-serif",
            }}>
              {personality.name}
            </h1>
            <p style={{
              fontSize: 14,
              fontStyle: 'italic',
              color: '#666',
              margin: '0 0 12px 0',
            }}>
              "{personality.tagline}"
            </p>
          </div>

          {/* Description - separated with breathing room */}
          <div style={{
            textAlign: 'center',
            padding: '0 16px',
          }}>
            <p style={{
              fontSize: 13,
              color: '#555',
              margin: 0,
              lineHeight: 1.6,
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
                  padding: '6px 14px',
                  fontSize: 12,
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
              style={{ width: 160, height: 'auto', marginBottom: 6 }}
              crossOrigin="anonymous"
            />
            <p style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#999',
              margin: '0 0 2px 0',
            }}>
              Your Perfect Match
            </p>
            <p style={{
              fontSize: 20,
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
          padding: '12px 40px',
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

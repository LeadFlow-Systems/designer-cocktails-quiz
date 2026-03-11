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

const BRAND_LOGO_DATA_URI =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnDQogICB3aWR0aD0iNzk3LjI5NjU3Ig0KICAgem9vbUFuZFBhbj0ibWFnbmlmeSINCiAgIHZpZXdCb3g9IjAgMCA1OTcuOTcyNDMgMTcwLjg5NzEzIg0KICAgaGVpZ2h0PSIyMjcuODYyODQiDQogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ig0KICAgdmVyc2lvbj0iMS4wIg0KICAgaWQ9InN2Zzg1MiINCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyINCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8ZGVmcw0KICAgICBpZD0iZGVmczY5NCI+DQogICAgPGcNCiAgICAgICBpZD0iZzY4NiIgLz4NCiAgICA8Y2xpcFBhdGgNCiAgICAgICBpZD0iNGVlNzhjOTFkZSI+DQogICAgICA8cGF0aA0KICAgICAgICAgZD0ibSAzNDQsMjk4LjEwNTQ3IGggMTkgViAzMTYgaCAtMTkgeiBtIDAsMCINCiAgICAgICAgIGNsaXAtcnVsZT0ibm9uemVybyINCiAgICAgICAgIGlkPSJwYXRoNjg4IiAvPg0KICAgIDwvY2xpcFBhdGg+DQogICAgPGNsaXBQYXRoDQogICAgICAgaWQ9IjUzMDIxY2QxZjkiPg0KICAgICAgPHBhdGgNCiAgICAgICAgIGQ9Im0gMzMyLjcwMzEyLDMyOSBoIDQyIHYgNzQuMTA1NDcgaCAtNDIgeiBtIDAsMCINCiAgICAgICAgIGNsaXAtcnVsZT0ibm9uemVybyINCiAgICAgICAgIGlkPSJwYXRoNjkxIiAvPg0KICAgIDwvY2xpcFBhdGg+DQogIDwvZGVmcz4NCiAgPGcNCiAgICAgZmlsbD0iIzAwYjdjMyINCiAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICBpZD0iZzcwOCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOC4zODA4MSwtMjk4LjEyNSkiPg0KICAgIDxnDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA0LjgwMjY4LDQwMi41NTc5OCkiDQogICAgICAgaWQ9Imc3MDYiPg0KICAgICAgPGcNCiAgICAgICAgIGlkPSJnNzA0Ij4NCiAgICAgICAgPHBhdGgNCiAgICAgICAgICAgZD0iTSAzLjU3ODEyNSwtNTcuNTc4MTI1IEggMjEuNDA2MjUgViAtNTcuNjI1IGggMS4yNSBjIDMuMzgyODEyLDAgNi41NzAzMTIsMC4zNTkzNzUgOS41NjI1LDEuMDc4MTI1IDIuOTg4MjgxLDAuNzE4NzUgNS43MzQzNzUsMS43MTQ4NDQgOC4yMzQzNzUsMi45ODQzNzUgMi41MDc4MTMsMS4yNzM0MzggNC43MjY1NjMsMi43NDYwOTQgNi42NTYyNSw0LjQyMTg3NSAyLjY5NTMxMywyLjU5Mzc1IDQuNzE4NzUsNS42MDE1NjMgNi4wNjI1LDkuMDE1NjI1IDEuMzQzNzUsMy40MTc5NjkgMi4wMTU2MjUsNy4xOTkyMTkgMi4wMTU2MjUsMTEuMzQzNzUgMCw0LjE3OTY4OCAtMC42NzE4NzUsNy45Njg3NSAtMi4wMTU2MjUsMTEuMzc1IC0xLjM0Mzc1LDMuNDA2MjUgLTMuMzY3MTg3LDYuMzk4NDM4IC02LjA2MjUsOC45Njg3NSAtMy41NzQyMTksMi44MTI1IC03LjYyNSw0LjkyMTg3NSAtMTIuMTU2MjUsNi4zMjgxMjUgQyAzMC40Mjk2ODgsLTAuNzAzMTI1IDI1LjUsMCAyMC4xNTYyNSwwIEggMy41NzgxMjUgWiBNIDQwLjUzMTI1LC0yOC44NDM3NSBjIDAsLTIuNDA2MjUgLTAuNDYwOTM4LC00LjUyMzQzOCAtMS4zNzUsLTYuMzU5Mzc1IC0wLjkxNzk2OSwtMS44MzIwMzEgLTIuMTg3NSwtMy4zNzUgLTMuODEyNSwtNC42MjUgLTEuNjE3MTg4LC0xLjI1NzgxMyAtMy41MDc4MTIsLTIuMjA3MDMxIC01LjY3MTg3NSwtMi44NDM3NSAtMi4xNjc5NjksLTAuNjQ0NTMxIC00LjUxNTYyNSwtMC45Njg3NSAtNy4wNDY4NzUsLTAuOTY4NzUgaCAtMy43MTg3NSBsIDAuMTQwNjI1LDI5LjU5Mzc1IGggMS41NDY4NzUgYyA1LjcxODc1LDAgMTAuMzAwNzgxLC0xLjI1IDEzLjc1LC0zLjc1IDMuNDU3MDMxLC0yLjUgNS41MTk1MzEsLTYuMTc5Njg3IDYuMTg3NSwtMTEuMDQ2ODc1IHogbSAwLDAiDQogICAgICAgICAgIGlkPSJwYXRoNzAyIiAvPg0KICAgICAgPC9nPg0KICAgIDwvZz4NCiAgPC9nPg0KICA8Zw0KICAgICBmaWxsPSIjMDBiN2MzIg0KICAgICBmaWxsLW9wYWNpdHk9IjEiDQogICAgIGlkPSJnNzE2Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA4LjM4MDgxLC0yOTguMTI1KSI+DQogICAgPGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTEuODY5NSw0MDIuNTU3OTgpIg0KICAgICAgIGlkPSJnNzE0Ij4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzcxMiI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgIGQ9Im0gMy41NzgxMjUsMC4wNzgxMjUgdiAtNTcuODQzNzUgaCAzOS43NSBWIC00My43MTg3NSBIIDE4LjM0Mzc1IHYgNy44NzUgaCAxOS4xODc1IHYgMTQuMDQ2ODc1IEggMTguMzQzNzUgViAtMTMuOTM3NSBIIDQzLjMyODEyNSBWIDAuMDc4MTI1IFogbSAwLDAiDQogICAgICAgICAgIGlkPSJwYXRoNzEwIiAvPg0KICAgICAgPC9nPg0KICAgIDwvZz4NCiAgPC9nPg0KICA8Zw0KICAgICBmaWxsPSIjMDBiN2MzIg0KICAgICBmaWxsLW9wYWNpdHk9IjEiDQogICAgIGlkPSJnNzI0Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA4LjM4MDgxLC0yOTguMTI1KSI+DQogICAgPGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNjcuMDcxNjksNDAyLjU1Nzk4KSINCiAgICAgICBpZD0iZzcyMiI+DQogICAgICA8Zw0KICAgICAgICAgaWQ9Imc3MjAiPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICBkPSJtIDE1Ljc2NTYyNSwtMTkuNzM0Mzc1IHYgMS41IGMgMCwwLjcxODc1IDAuMjUsMS40MDIzNDQgMC43NSwyLjA0Njg3NSAwLjUsMC42MzY3MTkgMS4xNDQ1MzEsMS4xODc1IDEuOTM3NSwxLjY1NjI1IDAuODAwNzgxLDAuNDY4NzUgMS42NzE4NzUsMC43NjE3MTkgMi42MDkzNzUsMC44NzUgaCAwLjc1IGMgMC45NzY1NjIsMCAxLjkzNzUsLTAuMjEwOTM4IDIuODc1LC0wLjY0MDYyNSAwLjkzNzUsLTAuNDI1NzgxIDEuNzA3MDMxLC0wLjk3NjU2MyAyLjMxMjUsLTEuNjU2MjUgMC42MTMyODEsLTAuNjg3NSAwLjkyMTg3NSwtMS4zOTg0MzcgMC45MjE4NzUsLTIuMTQwNjI1IDAsLTAuOTQ1MzEyIC0wLjM1MTU2MywtMS43MTg3NSAtMS4wNDY4NzUsLTIuMzEyNSAtMC42ODc1LC0wLjU5Mzc1IC0xLjYwMTU2MiwtMS4wODU5MzggLTIuNzM0Mzc1LC0xLjQ4NDM3NSAtMS4xMjUsLTAuMzk0NTMxIC0yLjM1MTU2MywtMC43NDIxODcgLTMuNjcxODc1LC0xLjA0Njg3NSAtMS4zMjQyMTksLTAuMzEyNSAtMi42MzI4MTIsLTAuNjYwMTU2IC0zLjkyMTg3NSwtMS4wNDY4NzUgLTIsLTAuNTkzNzUgLTMuODkwNjI1LC0xLjM5MDYyNSAtNS42NzE4NzUsLTIuMzkwNjI1IC0xLjc3MzQzOCwtMSAtMy4zMzU5MzgsLTIuMTkxNDA2IC00LjY4NzUsLTMuNTc4MTI1IC0xLjM1NTQ2OSwtMS4zODI4MTMgLTIuNDIxODc1LC0yLjkzNzUgLTMuMjAzMTI1LC00LjY1NjI1IC0wLjc3MzQzNywtMS43MjY1NjMgLTEuMTU2MjUsLTMuNjA5Mzc1IC0xLjE1NjI1LC01LjY0MDYyNSAwLC0yLjQ0NTMxMiAwLjUsLTQuNzQyMTg4IDEuNSwtNi44OTA2MjUgMSwtMi4xNDQ1MzEgMi4zOTg0MzcsLTQuMDM1MTU2IDQuMjAzMTI1LC01LjY3MTg3NSAxLjgwMDc4MSwtMS42MzI4MTIgMy45MTQwNjIsLTIuOTEwMTU2IDYuMzQzNzUsLTMuODI4MTI1IDIuNDI1NzgxLC0wLjkxNDA2MyA1LjA5Mzc1LC0xLjM3NSA4LC0xLjM3NSAyLjYyNSwwIDUuMDY2NDA2LDAuNDE0MDYzIDcuMzI4MTI1LDEuMjM0Mzc1IDIuMjY5NTMxLDAuODI0MjE5IDQuMjg1MTU2LDEuOTY4NzUgNi4wNDY4NzUsMy40Mzc1IDEuNzU3ODEyLDEuNDYwOTM4IDMuMTkxNDA2LDMuMTY3OTY5IDQuMjk2ODc1LDUuMTI1IDEuMTEzMjgxLDEuOTYwOTM4IDEuODI4MTI1LDQuMDc4MTI1IDIuMTQwNjI1LDYuMzU5Mzc1IGwgMC4xNDA2MjUsMS4xMDkzNzUgLTE0Ljc5Njg3NSwzIGMgMCwtMS43ODEyNSAtMC4zOTg0MzgsLTMuMjQyMTg4IC0xLjE4NzUsLTQuMzkwNjI1IC0wLjc4MTI1LC0xLjE0NDUzMSAtMi4wNzgxMjUsLTEuNzE4NzUgLTMuODkwNjI1LC0xLjcxODc1IC0wLjkyOTY4NywwIC0xLjc4OTA2MywwLjE5OTIxOSAtMi41NzgxMjUsMC41OTM3NSAtMC43ODEyNSwwLjM5ODQzNyAtMS40MDYyNSwwLjkyOTY4NyAtMS44NzUsMS41OTM3NSAtMC40Njg3NSwwLjY2Nzk2OSAtMC43MDMxMjUsMS40MDIzNDQgLTAuNzAzMTI1LDIuMjAzMTI1IDAsMC45NjA5MzggMC4zMjgxMjUsMS43NzM0MzggMC45ODQzNzUsMi40Mzc1IDAuNjU2MjUsMC42Njc5NjkgMS41MTU2MjUsMS4yMzA0NjkgMi41NzgxMjUsMS42ODc1IDEuMDYyNSwwLjQ0OTIxOSAyLjIyMjY1NiwwLjgzOTg0NCAzLjQ4NDM3NSwxLjE3MTg3NSAxLjI1NzgxMiwwLjMzNTkzNyAyLjUsMC42NTYyNSAzLjcxODc1LDAuOTY4NzUgMi4wNTA3ODEsMC41MjM0MzcgMy45OTIxODgsMS4yNjE3MTkgNS44MjgxMjUsMi4yMTg3NSAxLjgzMjAzMSwwLjk0OTIxOSAzLjQ1MzEyNSwyLjEwMTU2MyA0Ljg1OTM3NSwzLjQ1MzEyNSAxLjQwNjI1LDEuMzQzNzUgMi41MDM5MDYsMi44NzUgMy4yOTY4NzUsNC41OTM3NSAwLjgwMDc4MSwxLjcxMDkzOCAxLjIwMzEyNSwzLjYwMTU2MiAxLjIwMzEyNSw1LjY3MTg3NSAwLDIuNDgwNDY5IC0wLjU0Mjk2OSw0Ljc5Njg3NSAtMS42MjUsNi45NTMxMjUgLTEuMDg1OTM4LDIuMTU2MjUgLTIuNTg1OTM4LDQuMDQ2ODc1IC00LjUsNS42NzE4NzUgLTEuOTE3OTY5LDEuNjE3MTg3IC00LjEzNjcxOSwyLjg4MjgxMyAtNi42NTYyNSwzLjc5Njg3NSAtMi41MTE3MTksMC45MTQwNjI1IC01LjE5NTMxMiwxLjM3NSAtOC4wNDY4NzUsMS4zNzUgLTIuNjQ4NDM3LDAgLTUuMTQ4NDM3LC0wLjQwMjM0NCAtNy41LC0xLjIwMzEyNSAtMi4zNDM3NSwtMC44MTI1IC00LjQ0OTIxOSwtMS45NDE0MDYgLTYuMzEyNSwtMy4zOTA2MjUgQyA2LjI1MzkwNiwtNS41MTk1MzEgNC43MjI2NTYsLTcuMjM0Mzc1IDMuNTE1NjI1LC05LjIwMzEyNSAyLjMxNjQwNiwtMTEuMTcxODc1IDEuNTUwNzgxLC0xMy4zMTI1IDEuMjE4NzUsLTE1LjYyNSBsIC0wLjE3MTg3NSwtMS4xMDkzNzUgeiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg3MTgiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGZpbGw9IiMwMGI3YzMiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgaWQ9Imc3MzAiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM0MS43Mzc4NCw0MDIuNTU3OTgpIg0KICAgICAgIGlkPSJnNzI4Ij4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzcyNiIgLz4NCiAgICA8L2c+DQogIDwvZz4NCiAgPGcNCiAgICAgZmlsbD0iIzAwYjdjMyINCiAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICBpZD0iZzczOCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOC4zODA4MSwtMjk4LjEyNSkiPg0KICAgIDxnDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzkzLjYzOTYyLDQwMi41NTc5OCkiDQogICAgICAgaWQ9Imc3MzYiPg0KICAgICAgPGcNCiAgICAgICAgIGlkPSJnNzM0Ij4NCiAgICAgICAgPHBhdGgNCiAgICAgICAgICAgZD0ibSAzNC4wMzEyNSwtNTguMDc4MTI1IDAuMDc4MTMsMC4xMDkzNzUgYyAzLjA3MDMxMywwLjA5Mzc1IDUuOTQ1MzEzLDAuNTQ2ODc1IDguNjI1LDEuMzU5Mzc1IDIuNjc1NzgxLDAuODA0Njg3IDUuMTI1LDEuODY3MTg3IDcuMzQzNzUsMy4xODc1IDIuMjE4NzUsMS4zMjQyMTkgNC4xNzE4NzUsMi43NzM0MzcgNS44NTkzNzUsNC4zNDM3NSBsIDAuOTA2MjUsMC44OTA2MjUgLTEwLjU0Njg3NSwxMC4wMTU2MjUgLTAuOTM3NSwtMC44NTkzNzUgYyAtMy40NDkyMTksLTMuMjE4NzUgLTcuNSwtNC44MjgxMjUgLTEyLjE1NjI1LC00LjgyODEyNSAtNC43NDIxODcsMCAtOC43ODkwNjMsMS40ODA0NjkgLTEyLjE0MDYyNSw0LjQzNzUgLTMuMzY3MTg4LDIuOTQ5MjE5IC01LjA0Njg3NSw2LjQ5NjA5NCAtNS4wNDY4NzUsMTAuNjQwNjI1IDAsNC4xNTYyNSAxLjY3OTY4Nyw3LjcxMDkzOCA1LjA0Njg3NSwxMC42NTYyNSAzLjMzMjAzMSwyLjkzNzUgNy4zNzg5MDYsNC40MDYyNSAxMi4xNDA2MjUsNC40MDYyNSAyLjEyNSwwIDQuMTA5Mzc1LC0wLjMxNjQwNiA1Ljk1MzEyNSwtMC45NTMxMjUgMS44NTE1NjIsLTAuNjMyODEzIDMuNTAzOTA2LC0xLjQ5MjE4NyA0Ljk1MzEyNSwtMi41NzgxMjUgMS40NTcwMzEsLTEuMDgyMDMxIDIuNjQ4NDM3LC0yLjI4MTI1IDMuNTc4MTI1LC0zLjU5Mzc1IGggLTE2LjQ4NDM4IHYgLTEyLjc1IEggNjQuNTYyNSBsIDAuMTA5Mzc1LDEuMTA5Mzc1IGMgMC4yODEyNSwzLjYxNzE4NyAwLjA4MjAzLDYuOTE0MDYzIC0wLjU5Mzc1LDkuODkwNjI1IC0wLjY3OTY4NywyLjk4MDQ2OSAtMS43MzA0NjksNS42NjQwNjIgLTMuMTU2MjUsOC4wNDY4NzUgLTEuNDE3OTY5LDIuMzg2NzE5IC0zLjEwMTU2Myw0LjUxNTYyNSAtNS4wNDY4NzUsNi4zOTA2MjUgLTYuMzQzNzUsNS43MTg3NSAtMTMuOTMzNTk0LDguNTc4MTI1IC0yMi43NjU2MjUsOC41NzgxMjUgLTguOTM3NSwwIC0xNi41MzEyNSwtMi44NDM3NSAtMjIuNzgxMjUsLTguNTMxMjUgQyA0LjM3ODkwNiwtMTMuNzg1MTU2IDEuNDA2MjUsLTIwLjY3NTc4MSAxLjQwNjI1LC0yOC43ODEyNSBjIDAsLTguMDE5NTMxIDIuOTcyNjU2LC0xNC45MTQwNjIgOC45MjE4NzUsLTIwLjY4NzUgNi4yNjk1MzEsLTUuNzM4MjgxIDEzLjg2MzI4MSwtOC42MDkzNzUgMjIuNzgxMjUsLTguNjA5Mzc1IHogbSAwLDAiDQogICAgICAgICAgIGlkPSJwYXRoNzMyIiAvPg0KICAgICAgPC9nPg0KICAgIDwvZz4NCiAgPC9nPg0KICA8Zw0KICAgICBmaWxsPSIjMDBiN2MzIg0KICAgICBmaWxsLW9wYWNpdHk9IjEiDQogICAgIGlkPSJnNzQ2Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA4LjM4MDgxLC0yOTguMTI1KSI+DQogICAgPGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0OTAuMzE5NjYsNDAyLjU1Nzk4KSINCiAgICAgICBpZD0iZzc0NCI+DQogICAgICA8Zw0KICAgICAgICAgaWQ9Imc3NDIiPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICBkPSJtIDMuNTc4MTI1LC01Ny43NjU2MjUgaCAzLjAzMTI1IGwgMzMuNzUsMzAuMzEyNSB2IC0zMC4zMTI1IEggNTQuOTA2MjUgViAwIGggLTMuMTg3NSBsIC0zMy42MjUsLTMwLjIzNDM3NSBWIDAgSCAzLjU3ODEyNSBaIG0gMCwwIg0KICAgICAgICAgICBpZD0icGF0aDc0MCIgLz4NCiAgICAgIDwvZz4NCiAgICA8L2c+DQogIDwvZz4NCiAgPGcNCiAgICAgZmlsbD0iIzAwYjdjMyINCiAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICBpZD0iZzc1NCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOC4zODA4MSwtMjk4LjEyNSkiPg0KICAgIDxnDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTc5LjI0NDc5LDQwMi41NTc5OCkiDQogICAgICAgaWQ9Imc3NTIiPg0KICAgICAgPGcNCiAgICAgICAgIGlkPSJnNzUwIj4NCiAgICAgICAgPHBhdGgNCiAgICAgICAgICAgZD0ibSAzLjU3ODEyNSwwLjA3ODEyNSB2IC01Ny44NDM3NSBoIDM5Ljc1IFYgLTQzLjcxODc1IEggMTguMzQzNzUgdiA3Ljg3NSBoIDE5LjE4NzUgdiAxNC4wNDY4NzUgSCAxOC4zNDM3NSBWIC0xMy45Mzc1IEggNDMuMzI4MTI1IFYgMC4wNzgxMjUgWiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg3NDgiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGZpbGw9IiMwMGI3YzMiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgaWQ9Imc3NjIiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY1NC40NDY5OCw0MDIuNTU3OTgpIg0KICAgICAgIGlkPSJnNzYwIj4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzc1OCI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgIGQ9Ik0gMTcuNjU2MjUsMCBIIDMuNTc4MTI1IEwgMy41NDY4NzUsLTU3LjYyNSBIIDI0LjU5Mzc1IGMgMy40NTcwMzEsMCA2LjgwNDY4OCwwLjQ5MjE4OCAxMC4wNDY4NzUsMS40Njg3NSAyLjgxMjUsMC45ODA0NjkgNS4yODkwNjMsMi40ODA0NjkgNy40Mzc1LDQuNSAxLjE4NzUsMS4xNzk2ODggMi4yMjY1NjMsMi4zODI4MTIgMy4xMjUsMy42MDkzNzUgMC44OTQ1MzEsMS4yMTg3NSAxLjU4NTkzNywyLjYxNzE4NyAyLjA3ODEyNSw0LjE4NzUgMC40ODgyODEsMS41NzQyMTkgMC43MzQzNzUsMy40MzM1OTQgMC43MzQzNzUsNS41NzgxMjUgdiAxLjQ2ODc1IGMgMCwzLjk4MDQ2OSAtMS4zMDQ2ODcsNy43MTA5MzggLTMuOTA2MjUsMTEuMTg3NSAtMC45MDYyNSwxLjI0MjE4OCAtMS44MDg1OTQsMi4yMjY1NjIgLTIuNzAzMTI1LDIuOTUzMTI1IC0wLjg4NjcxOSwwLjcxODc1IC0xLjk5NjA5NCwxLjM5MDYyNSAtMy4zMjgxMjUsMi4wMTU2MjUgTCA1MS45MDYyNSwwIGggLTE3LjEyNSBsIC0xNy4xMjUsLTIyLjUxNTYyNSB6IG0gOC4yNjU2MjUsLTMwLjIwMzEyNSBjIDEuMjgxMjUsMCAyLjQ4ODI4MSwtMC4yOTY4NzUgMy42MjUsLTAuODkwNjI1IDEuMTMyODEzLC0wLjU5Mzc1IDIuMDUwNzgxLC0xLjM5ODQzOCAyLjc1LC0yLjQyMTg3NSAwLjcwNzAzMSwtMS4wMzEyNSAxLjA2MjUsLTIuMjEwOTM3IDEuMDYyNSwtMy41NDY4NzUgMCwtMS43Njk1MzEgLTAuNzU3ODEzLC0zLjMyMDMxMiAtMi4yNjU2MjUsLTQuNjU2MjUgLTAuNSwtMC40MjU3ODEgLTEuMTU2MjUsLTAuNzgxMjUgLTEuOTY4NzUsLTEuMDYyNSAtMC44MDQ2ODgsLTAuMjg5MDYyIC0xLjY3OTY4OCwtMC41MDM5MDYgLTIuNjI1LC0wLjY0MDYyNSAtMC45Mzc1LC0wLjE0NDUzMSAtMS44NDM3NSwtMC4yMTg3NSAtMi43MTg3NSwtMC4yMTg3NSBIIDE3LjYyNSB2IDEzLjQwNjI1IGggNS4yMTg3NSB2IDAuMDMxMjUgeiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg3NTYiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGZpbGw9IiMwMGI3YzMiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgaWQ9Imc3NjgiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwMS4zMTEyOCw0ODMuMjIzNDUpIg0KICAgICAgIGlkPSJnNzY2Ij4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzc2NCIgLz4NCiAgICA8L2c+DQogIDwvZz4NCiAgPGcNCiAgICAgZmlsbD0iIzAwYjdjMyINCiAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICBpZD0iZzc3NiINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOC4zODA4MSwtMjk4LjEyNSkiPg0KICAgIDxnDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcxLjg4MzAyLDQ2OC42MTU4OCkiDQogICAgICAgaWQ9Imc3NzQiPg0KICAgICAgPGcNCiAgICAgICAgIGlkPSJnNzcyIj4NCiAgICAgICAgPHBhdGgNCiAgICAgICAgICAgZD0ibSAyNi44NzUsLTQ0LjQzNzUgLTAuMDE1NjMsMC4xNDA2MjUgYyAyLjI1NzgxMywwLjEwNTQ2OSA0LjM2NzE4NywwLjQ2ODc1IDYuMzI4MTI1LDEuMDkzNzUgMS45NTcwMzEsMC42MTcxODcgMy43MzgyODEsMS40MTc5NjkgNS4zNDM3NSwyLjQwNjI1IDEuNjAxNTYyLDAuOTgwNDY5IDMuMDM1MTU2LDIuMDc0MjE5IDQuMjk2ODc1LDMuMjgxMjUgbCAwLjY3MTg3NSwwLjY4NzUgLTcuNzM0Mzc1LDcuNjU2MjUgLTAuNzAzMTI1LC0wLjY1NjI1IEMgMzIuMzk0NTMxLC0zMi4yNzM0MzggMjkuMjM4MjgxLC0zMy41IDI1LjU5Mzc1LC0zMy41IGMgLTMuNjc5Njg4LDAgLTYuODA0Njg4LDEuMTIxMDk0IC05LjM3NSwzLjM1OTM3NSAtMi42MjUsMi4zMDQ2ODcgLTMuOTM3NSw1LjAyMzQzNyAtMy45Mzc1LDguMTU2MjUgMCwzLjE2Nzk2OSAxLjMwMDc4MSw1Ljg3NSAzLjkwNjI1LDguMTI1IDIuNTkzNzUsMi4yNDIxODcgNS43MjY1NjIsMy4zNTkzNzUgOS40MDYyNSwzLjM1OTM3NSAzLjY5NTMxMiwwIDYuODUxNTYyLC0xLjIyMjY1NiA5LjQ2ODc1LC0zLjY3MTg3NSBsIDAuNzM0Mzc1LC0wLjY1NjI1IDcuNzM0Mzc1LDcuNjU2MjUgLTAuNjg3NSwwLjY4NzUgYyAtMS4wNTQ2ODgsMS4wNDI5NjkgLTIuMjAzMTI1LDEuOTgwNDY5IC0zLjQ1MzEyNSwyLjgxMjUgLTEuMjUsMC44MjQyMTkgLTIuNjE3MTg3LDEuNTQ2ODc1IC00LjA5Mzc1LDIuMTcxODc1IC0zLDEuMTk5MjE5IC02LjI0NjA5NCwxLjc5Njg3NSAtOS43MzQzNzUsMS43OTY4NzUgLTYuODY3MTg4LC0wLjAxMTcxOSAtMTIuNzM0Mzc1LC0yLjE3NTc4MSAtMTcuNjA5Mzc1LC02LjUgLTQuNTc0MjE5LC00LjM3NSAtNi44NTkzNzUsLTkuNjQ0NTMxIC02Ljg1OTM3NSwtMTUuODEyNSAwLC02LjE0NDUzMSAyLjI4NTE1NiwtMTEuNDIxODc1IDYuODU5Mzc1LC0xNS44MjgxMjUgNC45MDYyNSwtNC4zOTQ1MzEgMTAuNzczNDM3LC02LjU5Mzc1IDE3LjYwOTM3NSwtNi41OTM3NSB6IG0gMCwwIg0KICAgICAgICAgICBpZD0icGF0aDc3MCIgLz4NCiAgICAgIDwvZz4NCiAgICA8L2c+DQogIDwvZz4NCiAgPGcNCiAgICAgZmlsbD0iIzAwYjdjMyINCiAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICBpZD0iZzc4NCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOC4zODA4MSwtMjk4LjEyNSkiPg0KICAgIDxnDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMxLjM0MTgsNDY4LjYxNTg4KSINCiAgICAgICBpZD0iZzc4MiI+DQogICAgICA8Zw0KICAgICAgICAgaWQ9Imc3ODAiPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICBkPSJtIDcuOTM3NSwtMzcuODQzNzUgYyAxLjYxMzI4MSwtMS40NTcwMzEgMy4yNjk1MzEsLTIuNjcxODc1IDQuOTY4NzUsLTMuNjQwNjI1IDEuNjk1MzEyLC0wLjk3NjU2MyAzLjUsLTEuNzEwOTM3IDUuNDA2MjUsLTIuMjAzMTI1IDEuOTE0MDYyLC0wLjUgNCwtMC43NSA2LjI1LC0wLjc1IDIuMjM4MjgxLDAgNC4zMTI1LDAuMjUgNi4yMTg3NSwwLjc1IDEuOTE0MDYyLDAuNDkyMTg4IDMuNzIyNjU2LDEuMjI2NTYyIDUuNDIxODc1LDIuMjAzMTI1IDEuNjk1MzEzLDAuOTY4NzUgMy4zNDc2NTYsMi4xODM1OTQgNC45NTMxMjUsMy42NDA2MjUgNC41OTM3NSw0LjM5ODQzOCA2Ljg5MDYyNSw5LjY3MTg3NSA2Ljg5MDYyNSwxNS44MjgxMjUgMCw2LjE3OTY4NyAtMi4yOTY4NzUsMTEuNDQ5MjE5IC02Ljg5MDYyNSwxNS44MTI1IC0xLjYwNTQ2OSwxLjQzNzUgLTMuMjUsMi42NDA2MjUgLTQuOTM3NSwzLjYwOTM3NSAtMS42ODc1LDAuOTYwOTM4IC0zLjQ5MjE4OCwxLjY4MzU5NCAtNS40MDYyNSwyLjE3MTg3NSAtMS45MDYyNSwwLjQ3NjU2MjUgLTMuOTkyMTg4LDAuNzE4NzUgLTYuMjUsMC43MTg3NSAtMi4yNjE3MTksMCAtNC4zNTE1NjIsLTAuMjQ2MDkzOCAtNi4yNjU2MjUsLTAuNzM0Mzc1IC0xLjkxNzk2OSwtMC40ODgyODEgLTMuNzI2NTYzLC0xLjIxMDkzOCAtNS40MjE4NzUsLTIuMTcxODc1IC0xLjY4NzUsLTAuOTU3MDMxIC0zLjMyODEyNSwtMi4xNTYyNSAtNC45MjE4NzUsLTMuNTkzNzUgLTQuNTc0MjE5LC00LjM3NSAtNi44NTkzNzUsLTkuNjQ0NTMxIC02Ljg1OTM3NSwtMTUuODEyNSAwLC02LjE0NDUzMSAyLjI4MTI1LC0xMS40MjE4NzUgNi44NDM3NSwtMTUuODI4MTI1IHogbSAyNS4wOTM3NSw3LjYyNSBjIC0wLjg3NSwtMC43NSAtMS43MzA0NjksLTEuMzc1IC0yLjU2MjUsLTEuODc1IC0wLjgyNDIxOSwtMC41IC0xLjcxMDkzOCwtMC44NjcxODggLTIuNjU2MjUsLTEuMTA5Mzc1IC0wLjk0OTIxOSwtMC4yNSAtMi4wMzEyNSwtMC4zNzUgLTMuMjUsLTAuMzc1IC0xLjI0MjE4OCwwIC0yLjMzOTg0NCwwLjEyNSAtMy4yOTY4NzUsMC4zNzUgLTAuOTYwOTM3LDAuMjQyMTg3IC0xLjg1NTQ2OSwwLjYwOTM3NSAtMi42ODc1LDEuMTA5Mzc1IC0wLjgyNDIxOSwwLjUgLTEuNjY3OTY5LDEuMTI1IC0yLjUzMTI1LDEuODc1IC0yLjU2MjUsMi4zMDQ2ODggLTMuODQzNzUsNS4wMjM0MzggLTMuODQzNzUsOC4xNTYyNSAwLDMuMTY3OTY5IDEuMjgxMjUsNS44NzEwOTQgMy44NDM3NSw4LjEwOTM3NSAwLjg2MzI4MSwwLjc3MzQzNyAxLjcxMDkzNywxLjQwMjM0NCAyLjU0Njg3NSwxLjg5MDYyNSAwLjg0Mzc1LDAuNDkyMTg4IDEuNzM4MjgxLDAuODU5Mzc1IDIuNjg3NSwxLjEwOTM3NSAwLjk1NzAzMSwwLjI1IDIuMDUwNzgxLDAuMzc1IDMuMjgxMjUsMC4zNzUgMS4xOTUzMTIsMCAyLjI2OTUzMSwtMC4xMjUgMy4yMTg3NSwtMC4zNzUgMC45NDUzMTIsLTAuMjUgMS44MzU5MzgsLTAuNjE3MTg3IDIuNjcxODc1LC0xLjEwOTM3NSAwLjg0Mzc1LC0wLjQ4ODI4MSAxLjcwMzEyNSwtMS4xMTcxODggMi41NzgxMjUsLTEuODkwNjI1IDIuNTkzNzUsLTIuMjE4NzUgMy44OTA2MjUsLTQuOTIxODc1IDMuODkwNjI1LC04LjEwOTM3NSAwLC0zLjE1NjI1IC0xLjI5Njg3NSwtNS44NzUgLTMuODkwNjI1LC04LjE1NjI1IHogbSAwLDAiDQogICAgICAgICAgIGlkPSJwYXRoNzc4IiAvPg0KICAgICAgPC9nPg0KICAgIDwvZz4NCiAgPC9nPg0KICA8Zw0KICAgICBmaWxsPSIjMDBiN2MzIg0KICAgICBmaWxsLW9wYWNpdHk9IjEiDQogICAgIGlkPSJnNzkyIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA4LjM4MDgxLC0yOTguMTI1KSI+DQogICAgPGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOTUuMzExNjcsNDY4LjYxNTg4KSINCiAgICAgICBpZD0iZzc5MCI+DQogICAgICA8Zw0KICAgICAgICAgaWQ9Imc3ODgiPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICBkPSJtIDI2Ljg3NSwtNDQuNDM3NSAtMC4wMTU2MywwLjE0MDYyNSBjIDIuMjU3ODEzLDAuMTA1NDY5IDQuMzY3MTg3LDAuNDY4NzUgNi4zMjgxMjUsMS4wOTM3NSAxLjk1NzAzMSwwLjYxNzE4NyAzLjczODI4MSwxLjQxNzk2OSA1LjM0Mzc1LDIuNDA2MjUgMS42MDE1NjIsMC45ODA0NjkgMy4wMzUxNTYsMi4wNzQyMTkgNC4yOTY4NzUsMy4yODEyNSBsIDAuNjcxODc1LDAuNjg3NSAtNy43MzQzNzUsNy42NTYyNSAtMC43MDMxMjUsLTAuNjU2MjUgQyAzMi4zOTQ1MzEsLTMyLjI3MzQzOCAyOS4yMzgyODEsLTMzLjUgMjUuNTkzNzUsLTMzLjUgYyAtMy42Nzk2ODgsMCAtNi44MDQ2ODgsMS4xMjEwOTQgLTkuMzc1LDMuMzU5Mzc1IC0yLjYyNSwyLjMwNDY4NyAtMy45Mzc1LDUuMDIzNDM3IC0zLjkzNzUsOC4xNTYyNSAwLDMuMTY3OTY5IDEuMzAwNzgxLDUuODc1IDMuOTA2MjUsOC4xMjUgMi41OTM3NSwyLjI0MjE4NyA1LjcyNjU2MiwzLjM1OTM3NSA5LjQwNjI1LDMuMzU5Mzc1IDMuNjk1MzEyLDAgNi44NTE1NjIsLTEuMjIyNjU2IDkuNDY4NzUsLTMuNjcxODc1IGwgMC43MzQzNzUsLTAuNjU2MjUgNy43MzQzNzUsNy42NTYyNSAtMC42ODc1LDAuNjg3NSBjIC0xLjA1NDY4OCwxLjA0Mjk2OSAtMi4yMDMxMjUsMS45ODA0NjkgLTMuNDUzMTI1LDIuODEyNSAtMS4yNSwwLjgyNDIxOSAtMi42MTcxODcsMS41NDY4NzUgLTQuMDkzNzUsMi4xNzE4NzUgLTMsMS4xOTkyMTkgLTYuMjQ2MDk0LDEuNzk2ODc1IC05LjczNDM3NSwxLjc5Njg3NSAtNi44NjcxODgsLTAuMDExNzE5IC0xMi43MzQzNzUsLTIuMTc1NzgxIC0xNy42MDkzNzUsLTYuNSAtNC41NzQyMTksLTQuMzc1IC02Ljg1OTM3NSwtOS42NDQ1MzEgLTYuODU5Mzc1LC0xNS44MTI1IDAsLTYuMTQ0NTMxIDIuMjg1MTU2LC0xMS40MjE4NzUgNi44NTkzNzUsLTE1LjgyODEyNSA0LjkwNjI1LC00LjM5NDUzMSAxMC43NzM0MzcsLTYuNTkzNzUgMTcuNjA5Mzc1LC02LjU5Mzc1IHogbSAwLDAiDQogICAgICAgICAgIGlkPSJwYXRoNzg2IiAvPg0KICAgICAgPC9nPg0KICAgIDwvZz4NCiAgPC9nPg0KICA8Zw0KICAgICBmaWxsPSIjMDBiN2MzIg0KICAgICBmaWxsLW9wYWNpdHk9IjEiDQogICAgIGlkPSJnODAwIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTA4LjM4MDgxLC0yOTguMTI1KSI+DQogICAgPGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNTQuNzcwNDUsNDY4LjYxNTg4KSINCiAgICAgICBpZD0iZzc5OCI+DQogICAgICA8Zw0KICAgICAgICAgaWQ9Imc3OTYiPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICBkPSJtIDIuNzAzMTI1LDAgdiAtNDQuMDc4MTI1IGggMTAuNzUgViAtMjcuMTg3NSBMIDI1LjE1NjI1LC00NC4wNzgxMjUgaCAxMi40Mzc1IEwgMjMuNTYyNSwtMjEuNzM0Mzc1IDM5Ljg1OTM3NSwwIGggLTEzLjA5Mzc1IGwgLTEzLjMxMjUsLTE2LjM3NSBWIDAgWiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg3OTQiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGZpbGw9IiMwMGI3YzMiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgaWQ9Imc4MDgiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQxMC41OTMwMSw0NjguNjE1ODgpIg0KICAgICAgIGlkPSJnODA2Ij4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzgwNCI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgIGQ9Im0gMS4wOTM3NSwtMzMuMzkwNjI1IHYgLTEwLjY4NzUgSCAzNS41IHYgMTAuNjg3NSBIIDI0LjI1IEwgMjQuNjcxODc1LDAgSCAxMi41IGwgLTAuMTQwNjI1LC0zMy4zOTA2MjUgeiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg4MDIiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGZpbGw9IiMwMGI3YzMiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgaWQ9Imc4MTYiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2Mi4wMTM4NSw0NjguNjE1ODgpIg0KICAgICAgIGlkPSJnODE0Ij4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzgxMiI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgIGQ9Im0gMjMuNjU2MjUsLTIxLjQzNzUgLTIuODc1LDUuOTUzMTI1IGggNS42ODc1IHogTSAxMi43NjU2MjUsMCBIIDEuMDkzNzUgbCAyMS4yNSwtNDQuMDMxMjUgaCAyLjU2MjUgTCA0Ni4xODc1LDAgSCAzNC40ODQzNzUgbCAtMy4yNSwtNi43MDMxMjUgSCAxNi4wMzEyNSBaIG0gMCwwIg0KICAgICAgICAgICBpZD0icGF0aDgxMCIgLz4NCiAgICAgIDwvZz4NCiAgICA8L2c+DQogIDwvZz4NCiAgPGcNCiAgICAgZmlsbD0iIzAwYjdjMyINCiAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICBpZD0iZzgyNCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOC4zODA4MSwtMjk4LjEyNSkiPg0KICAgIDxnDQogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTI0LjEyNDYsNDY4LjYxNTg4KSINCiAgICAgICBpZD0iZzgyMiI+DQogICAgICA8Zw0KICAgICAgICAgaWQ9Imc4MjAiPg0KICAgICAgICA8cGF0aA0KICAgICAgICAgICBkPSJNIDEzLjUxNTYyNSwwIEggMi43MzQzNzUgdiAtNDQuMDc4MTI1IGggMTAuNzgxMjUgeiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg4MTgiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGZpbGw9IiMwMGI3YzMiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgaWQ9Imc4MzIiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU1NS4yMDQ1Myw0NjguNjE1ODgpIg0KICAgICAgIGlkPSJnODMwIj4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzgyOCI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgIGQ9Im0gMi43MzQzNzUsMCB2IC00NC4wNzgxMjUgaCAxMC43ODEyNSB2IDMzLjM1OTM3NSBoIDE5LjYyNSBWIDAgWiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg4MjYiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGZpbGw9IiMwMGI3YzMiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgaWQ9Imc4NDAiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8Zw0KICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwNC4yNzQxMiw0NjguNjE1ODgpIg0KICAgICAgIGlkPSJnODM4Ij4NCiAgICAgIDxnDQogICAgICAgICBpZD0iZzgzNiI+DQogICAgICAgIDxwYXRoDQogICAgICAgICAgIGQ9Im0gMTIuMDYyNSwtMTUuMDkzNzUgdiAxLjE0MDYyNSBjIDAsMC41NTQ2ODcgMC4xODc1LDEuMDc0MjE5IDAuNTYyNSwxLjU2MjUgMC4zODI4MTIsMC40OTIxODcgMC44Nzg5MDYsMC45MTc5NjkgMS40ODQzNzUsMS4yODEyNSAwLjYxMzI4MSwwLjM1NTQ2OSAxLjI4MTI1LDAuNTc0MjE5IDIsMC42NTYyNSBoIDAuNTYyNSBjIDAuNzUsMCAxLjQ4NDM3NSwtMC4xNjAxNTYgMi4yMDMxMjUsLTAuNDg0Mzc1IDAuNzE4NzUsLTAuMzMyMDMxIDEuMzEyNSwtMC43NTM5MDYgMS43ODEyNSwtMS4yNjU2MjUgMC40Njg3NSwtMC41MTk1MzEgMC43MDMxMjUsLTEuMDY2NDA2IDAuNzAzMTI1LC0xLjY0MDYyNSAwLC0wLjcyNjU2MiAtMC4yNjU2MjUsLTEuMzE2NDA2IC0wLjc5Njg3NSwtMS43NjU2MjUgLTAuNTMxMjUsLTAuNDU3MDMxIC0xLjIzMDQ2OSwtMC44MzU5MzcgLTIuMDkzNzUsLTEuMTQwNjI1IC0wLjg2NzE4OCwtMC4zMDA3ODEgLTEuODA0Njg4LC0wLjU2NjQwNiAtMi44MTI1LC0wLjc5Njg3NSAtMS4wMTE3MTksLTAuMjM4MjgxIC0yLjAxMTcxOSwtMC41MDM5MDYgLTMsLTAuNzk2ODc1IC0xLjUzMTI1LC0wLjQ1NzAzMSAtMi45ODA0NjksLTEuMDY2NDA2IC00LjM0Mzc1LC0xLjgyODEyNSAtMS4zNTU0NjksLTAuNzY5NTMxIC0yLjU1NDY4OCwtMS42Nzk2ODcgLTMuNTkzNzUsLTIuNzM0Mzc1IC0xLjAzMTI1LC0xLjA2MjUgLTEuODQzNzUsLTIuMjUzOTA2IC0yLjQzNzUsLTMuNTc4MTI1IC0wLjU5Mzc1LC0xLjMyMDMxMyAtMC44OTA2MjUsLTIuNzU3ODEzIC0wLjg5MDYyNSwtNC4zMTI1IDAsLTEuODc1IDAuMzc4OTA2LC0zLjYyODkwNiAxLjE0MDYyNSwtNS4yNjU2MjUgMC43Njk1MzEsLTEuNjQ0NTMxIDEuODQzNzUsLTMuMDkzNzUgMy4yMTg3NSwtNC4zNDM3NSAxLjM3NSwtMS4yNSAyLjk4ODI4MSwtMi4yMjI2NTYgNC44NDM3NSwtMi45MjE4NzUgMS44NjMyODEsLTAuNjk1MzEzIDMuOTEwMTU2LC0xLjA0Njg3NSA2LjE0MDYyNSwtMS4wNDY4NzUgMiwwIDMuODYzMjgxLDAuMzEyNSA1LjU5Mzc1LDAuOTM3NSAxLjczODI4MSwwLjYyNSAzLjI4MTI1LDEuNSA0LjYyNSwyLjYyNSAxLjM1MTU2MywxLjEyNSAyLjQ1MzEyNSwyLjQzNzUgMy4yOTY4NzUsMy45Mzc1IDAuODUxNTYyLDEuNDkyMTg4IDEuMzk0NTMxLDMuMTA5Mzc1IDEuNjI1LDQuODU5Mzc1IGwgMC4xMDkzNzUsMC44NDM3NSAtMTEuMzEyNSwyLjI5Njg3NSBjIDAsLTEuMzYzMjgxIC0wLjMwNDY4NywtMi40ODQzNzUgLTAuOTA2MjUsLTMuMzU5Mzc1IC0wLjYwNTQ2OSwtMC44NzUgLTEuNjAxNTYzLC0xLjMxMjUgLTIuOTg0Mzc1LC0xLjMxMjUgLTAuNzEwOTM4LDAgLTEuMzY3MTg4LDAuMTUyMzQ0IC0xLjk2ODc1LDAuNDUzMTI1IC0wLjU5Mzc1LDAuMjkyOTY5IC0xLjA3NDIxOSwwLjY5NTMxMiAtMS40Mzc1LDEuMjAzMTI1IC0wLjM1NTQ2OSwwLjUxMTcxOSAtMC41MzEyNSwxLjA3ODEyNSAtMC41MzEyNSwxLjcwMzEyNSAwLDAuNzMwNDY5IDAuMjUsMS4zNTE1NjIgMC43NSwxLjg1OTM3NSAwLjUwNzgxMiwwLjUxMTcxOSAxLjE2NDA2MiwwLjkzNzUgMS45Njg3NSwxLjI4MTI1IDAuODEyNSwwLjM0Mzc1IDEuNzAzMTI1LDAuNjQ4NDM3IDIuNjcxODc1LDAuOTA2MjUgMC45Njg3NSwwLjI1IDEuOTE0MDYzLDAuNDk2MDk0IDIuODQzNzUsMC43MzQzNzUgMS41NzAzMTMsMC40MDYyNSAzLjA1NDY4NywwLjk3NjU2MiA0LjQ1MzEyNSwxLjcwMzEyNSAxLjQwNjI1LDAuNzMwNDY5IDIuNjQ0NTMxLDEuNjA5Mzc1IDMuNzE4NzUsMi42NDA2MjUgMS4wODIwMzEsMS4wMjM0MzggMS45MjU3ODEsMi4xODc1IDIuNTMxMjUsMy41IDAuNjEzMjgxLDEuMzEyNSAwLjkyMTg3NSwyLjc2NTYyNSAwLjkyMTg3NSw0LjM1OTM3NSAwLDEuODk4NDM3IC0wLjQxNzk2OSwzLjY2Nzk2OSAtMS4yNSw1LjMxMjUgLTAuODI0MjE5LDEuNjQ4NDM3IC0xLjk2ODc1LDMuMDg5ODQ0IC0zLjQzNzUsNC4zMjgxMjUgLTEuNDY4NzUsMS4yNDIxODggLTMuMTY3OTY5LDIuMjE0ODQ0IC01LjA5Mzc1LDIuOTIxODc1IC0xLjkxNzk2OSwwLjY5NTMxMjUgLTMuOTY4NzUsMS4wNDY4NzUgLTYuMTU2MjUsMS4wNDY4NzUgLTIuMDMxMjUsMCAtMy45NDUzMTMsLTAuMzA4NTkzOCAtNS43MzQzNzUsLTAuOTIxODc1IC0xLjc5Mjk2OSwtMC42MjUgLTMuNDAyMzQ0LC0xLjQ4ODI4MSAtNC44MjgxMjUsLTIuNTkzNzUgQyA0Ljc4NTE1NiwtNC4yMjI2NTYgMy42MTMyODEsLTUuNTMxMjUgMi42ODc1LC03LjAzMTI1IDEuNzY5NTMxLC04LjUzOTA2MiAxLjE3OTY4OCwtMTAuMTc5Njg4IDAuOTIxODc1LC0xMS45NTMxMjUgbCAtMC4xMjUsLTAuODQzNzUgeiBtIDAsMCINCiAgICAgICAgICAgaWQ9InBhdGg4MzQiIC8+DQogICAgICA8L2c+DQogICAgPC9nPg0KICA8L2c+DQogIDxnDQogICAgIGNsaXAtcGF0aD0idXJsKCM0ZWU3OGM5MWRlKSINCiAgICAgaWQ9Imc4NDQiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDguMzgwODEsLTI5OC4xMjUpIj4NCiAgICA8cGF0aA0KICAgICAgIGZpbGw9IiNmNjgyYzQiDQogICAgICAgZD0ibSAzNTkuNTg5ODQsMjk4LjEyNSBoIC0xMi4wMzUxNSBjIC0xLjg3ODkxLDAgLTMuNDA2MjUsMS41MjM0NCAtMy40MDYyNSwzLjQwNjI1IHYgMTQuMTYwMTYgaCAxOC44NDc2NSB2IC0xNC4xNjAxNiBjIDAsLTEuODgyODEgLTEuNTI3MzQsLTMuNDA2MjUgLTMuNDA2MjUsLTMuNDA2MjUiDQogICAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICAgIGZpbGwtcnVsZT0ibm9uemVybyINCiAgICAgICBpZD0icGF0aDg0MiIgLz4NCiAgPC9nPg0KICA8cGF0aA0KICAgICBmaWxsPSIjZjY4MmM0Ig0KICAgICBkPSJtIDI1NC42MTUyOCwxOC40Mzc1IGggLTE4Ljg0NzY1IGMgLTQuNzczNDQsMCAtOC42NDQ1MywzLjg3MTA5IC04LjY0NDUzLDguNjQ4NDQgdiAzLjUxMTcyIGggMzYuMTQwNjMgdiAtMy41MTE3MiBjIDAsLTQuNzc3MzUgLTMuODcxMDksLTguNjQ4NDQgLTguNjQ4NDQsLTguNjQ4NDQiDQogICAgIGZpbGwtb3BhY2l0eT0iMSINCiAgICAgZmlsbC1ydWxlPSJub256ZXJvIg0KICAgICBpZD0icGF0aDg0NiIgLz4NCiAgPGcNCiAgICAgY2xpcC1wYXRoPSJ1cmwoIzUzMDIxY2QxZjkpIg0KICAgICBpZD0iZzg1MCINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwOC4zODA4MSwtMjk4LjEyNSkiPg0KICAgIDxwYXRoDQogICAgICAgZmlsbD0iI2Y2ODJjNCINCiAgICAgICBkPSJtIDM3MS44ODY3MiwzMjkuNTk3NjYgaCAtMzYuNjI4OTEgYyAtMS40MzM1OSwwIC0yLjU1ODU5LDEuMjI2NTYgLTIuNDI5NjksMi42NTYyNSBsIDQuNzg1MTYsNjQuMTQwNjIgYyAwLjMzNTk0LDMuNzk2ODggMy41MTE3Miw2LjcwMzEzIDcuMzIwMzEsNi43MDMxMyBoIDE3LjI3NzM1IGMgMy44MDg1OSwwIDYuOTg4MjgsLTIuOTA2MjUgNy4zMjAzMSwtNi43MDMxMyBsIDQuNzg5MDYsLTY0LjE0MDYyIGMgMC4xMjUsLTEuNDI5NjkgLTEsLTIuNjU2MjUgLTIuNDMzNTksLTIuNjU2MjUiDQogICAgICAgZmlsbC1vcGFjaXR5PSIxIg0KICAgICAgIGZpbGwtcnVsZT0ibm9uemVybyINCiAgICAgICBpZD0icGF0aDg0OCIgLz4NCiAgPC9nPg0KPC9zdmc+DQo='

const ShareCard = forwardRef<HTMLDivElement, { personality: Personality }>(
  ({ personality }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: 540,
          height: 960,
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(180deg, ${personality.color}18 0%, #ffffff 40%, #ffffff 60%, ${personality.color}10 100%)`,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          position: 'relative',
        }}
      >
        {/* Logo + header */}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <img
            src={BRAND_LOGO_DATA_URI}
            alt="Designer Cocktails"
            style={{ width: 220, height: 'auto', marginBottom: 12 }}
          />
          <p style={{
            fontSize: 13,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#999',
            marginBottom: 12,
          }}>
            My Cocktail Personality
          </p>
          <div style={{ fontSize: 72, marginBottom: 8 }}>
            {personality.emoji}
          </div>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            color: personality.color,
            margin: '0 0 8px 0',
            lineHeight: 1.1,
            fontFamily: "'Fredoka', 'DM Sans', system-ui, sans-serif",
          }}>
            {personality.name}
          </h1>
          <p style={{
            fontSize: 16,
            fontStyle: 'italic',
            color: '#666',
            margin: 0,
          }}>
            "{personality.tagline}"
          </p>
        </div>

        {/* Traits */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          width: '100%',
          padding: '0 8px',
        }}>
          {personality.traits.map((trait) => (
            <div
              key={trait}
              style={{
                background: '#fff',
                border: `1.5px solid ${personality.color}30`,
                borderRadius: 14,
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: '#333',
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
            style={{ width: 140, height: 'auto', marginBottom: 12 }}
            crossOrigin="anonymous"
          />
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

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          background: '#00b7c3',
          margin: '0 -48px -48px -48px',
          padding: '20px 48px',
          width: 'calc(100% + 96px)',
        }}>
          <p style={{
            fontSize: 15,
            color: '#ffffff',
            margin: '0 0 4px 0',
            fontWeight: 500,
          }}>
            Find your cocktail personality at
          </p>
          <p style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#ffffff',
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

import { motion } from 'motion/react'
import { answerCardVariant } from '@/utils/animations'

interface AnswerCardProps {
  emoji: string
  text: string
  isSelected: boolean
  isOtherSelected: boolean
  onClick: () => void
}

export function AnswerCard({
  emoji,
  text,
  isSelected,
  isOtherSelected,
  onClick,
}: AnswerCardProps) {
  return (
    <motion.button
      variants={answerCardVariant}
      onClick={onClick}
      className={`
        relative w-full text-left rounded-2xl p-5 sm:p-6 cursor-pointer
        border-2 transition-all duration-200
        font-[family-name:var(--font-body)]
        backdrop-blur-sm
        ${
          isSelected
            ? 'bg-gradient-to-br from-teal/15 to-pink/10 border-teal shadow-lg shadow-teal/15'
            : 'bg-white/80 border-white/60 hover:border-teal/40 hover:shadow-md shadow-sm'
        }
      `}
      animate={
        isOtherSelected
          ? { opacity: 0.4, scale: 0.97 }
          : isSelected
            ? { scale: 1.02 }
            : { opacity: 1, scale: 1 }
      }
      whileHover={
        !isSelected && !isOtherSelected ? { scale: 1.02, y: -2 } : undefined
      }
      whileTap={!isSelected && !isOtherSelected ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl flex-shrink-0">{emoji}</span>
        <span
          className={`text-base sm:text-lg font-medium leading-snug ${isSelected ? 'text-text-dark' : 'text-text-body'}`}
        >
          {text}
        </span>
      </div>
      {isSelected && (
        <motion.div
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}

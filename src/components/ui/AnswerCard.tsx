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
        relative w-full text-left rounded-2xl p-5 cursor-pointer
        border transition-colors duration-200
        font-[family-name:var(--font-body)]
        ${
          isSelected
            ? 'bg-teal/15 border-teal shadow-[0_0_25px_rgba(0,184,195,0.25)]'
            : 'bg-dark-surface border-border-dark hover:border-teal-glow'
        }
      `}
      animate={
        isOtherSelected
          ? { opacity: 0.3, scale: 0.95 }
          : isSelected
            ? { scale: 1.02 }
            : { opacity: 1, scale: 1 }
      }
      whileHover={
        !isSelected && !isOtherSelected ? { scale: 1.02 } : undefined
      }
      whileTap={!isSelected && !isOtherSelected ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl flex-shrink-0">{emoji}</span>
        <span
          className={`text-sm sm:text-base font-medium ${isSelected ? 'text-white' : 'text-text-light'}`}
        >
          {text}
        </span>
      </div>
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-teal pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  )
}

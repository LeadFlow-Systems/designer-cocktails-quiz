import { motion } from 'motion/react'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-text-body font-semibold font-[family-name:var(--font-display)]">
          Question {current + 1} of {total}
        </span>
        <span className="text-sm font-bold text-teal font-[family-name:var(--font-display)]">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden shadow-inner border border-border-light">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal to-pink"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}

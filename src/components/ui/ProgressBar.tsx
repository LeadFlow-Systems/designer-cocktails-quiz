import { motion } from 'motion/react'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-text-muted font-medium font-[family-name:var(--font-body)]">
          {current + 1} of {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-dark-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-teal rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  )
}

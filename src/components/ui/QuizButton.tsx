import { motion } from 'motion/react'

interface QuizButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export function QuizButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
}: QuizButtonProps) {
  const baseStyles =
    'relative font-semibold rounded-xl cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-body)]'

  const variants = {
    primary:
      'bg-teal text-white px-8 py-4 text-base shadow-[0_0_20px_rgba(0,184,195,0.2)] hover:shadow-[0_0_30px_rgba(0,184,195,0.35)]',
    secondary:
      'bg-dark-card text-text-light border border-border-dark px-8 py-4 text-base hover:border-teal hover:text-white',
    ghost:
      'bg-transparent text-text-muted px-4 py-2 text-sm hover:text-white',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.button>
  )
}

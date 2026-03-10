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
    'relative font-semibold rounded-2xl cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-display)]'

  const variants = {
    primary:
      'bg-gradient-to-r from-teal to-[#00d4d4] text-white px-8 py-4 text-lg shadow-lg shadow-teal/20 hover:shadow-xl hover:shadow-teal/30',
    secondary:
      'bg-white text-text-dark border-2 border-border-light px-8 py-4 text-lg hover:border-teal hover:text-teal shadow-sm',
    ghost:
      'bg-transparent text-text-muted px-4 py-2 text-sm hover:text-teal',
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

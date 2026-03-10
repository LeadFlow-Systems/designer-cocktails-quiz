import { motion } from 'motion/react'
import { useMemo } from 'react'

interface Bubble {
  id: number
  size: number
  left: string
  delay: number
  duration: number
  opacity: number
}

export function BubbleBackground() {
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: 6 + Math.random() * 30,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 15,
      opacity: 0.08 + Math.random() * 0.15,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            bottom: -bubble.size,
            background: `radial-gradient(circle, rgba(0, 184, 195, ${bubble.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -window.innerHeight - bubble.size * 2],
            opacity: [0, bubble.opacity, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Subtle teal glow orb in center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 184, 195, 0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

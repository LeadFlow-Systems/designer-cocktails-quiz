import { motion } from 'motion/react'
import { useMemo } from 'react'

interface Blob {
  id: number
  size: number
  x: string
  y: string
  color: string
  opacity: number
  duration: number
  delay: number
}

const COLORS = [
  'rgba(0, 184, 195, 0.15)',   // teal
  'rgba(246, 130, 196, 0.12)', // pink
  'rgba(203, 108, 235, 0.10)', // purple
  'rgba(249, 115, 22, 0.08)',  // orange
  'rgba(45, 212, 191, 0.10)',  // mint
]

export function BubbleBackground() {
  const blobs = useMemo<Blob[]>(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 250 + Math.random() * 350,
      x: `${10 + Math.random() * 80}%`,
      y: `${10 + Math.random() * 80}%`,
      color: COLORS[i % COLORS.length],
      opacity: 0.6 + Math.random() * 0.4,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            delay: blob.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

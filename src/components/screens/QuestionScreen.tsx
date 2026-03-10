import { motion } from 'motion/react'
import { useCallback } from 'react'
import type { Question, SelectedAnswer } from '@/types/quiz'
import { AnswerCard } from '@/components/ui/AnswerCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { staggerContainer } from '@/utils/animations'
import { TOTAL_QUESTIONS } from '@/data/questions'

interface QuestionScreenProps {
  question: Question
  questionIndex: number
  selectedAnswerId: string | null
  onSelectAnswer: (answerId: string) => void
  onAdvance: (answer: SelectedAnswer) => void
}

export function QuestionScreen({
  question,
  questionIndex,
  selectedAnswerId,
  onSelectAnswer,
  onAdvance,
}: QuestionScreenProps) {
  const handleSelect = useCallback(
    (answer: (typeof question.answers)[number]) => {
      if (selectedAnswerId) return
      onSelectAnswer(answer.id)

      // Auto-advance after animation
      setTimeout(() => {
        onAdvance({
          questionId: question.id,
          answerId: answer.id,
          scores: answer.scores,
        })
      }, 600)
    },
    [selectedAnswerId, onSelectAnswer, onAdvance, question.id]
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 w-full max-w-lg mx-auto">
      {/* Progress */}
      <motion.div
        className="w-full mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProgressBar current={questionIndex} total={TOTAL_QUESTIONS} />
      </motion.div>

      {/* Question text */}
      <motion.h2
        className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white text-center mb-8 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      >
        {question.text}
      </motion.h2>

      {/* Answer cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {question.answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            emoji={answer.emoji}
            text={answer.text}
            isSelected={selectedAnswerId === answer.id}
            isOtherSelected={
              selectedAnswerId !== null && selectedAnswerId !== answer.id
            }
            onClick={() => handleSelect(answer)}
          />
        ))}
      </motion.div>
    </div>
  )
}

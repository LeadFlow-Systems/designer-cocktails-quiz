import { AnimatePresence, motion } from 'motion/react'
import { useQuizState } from '@/hooks/useQuizState'
import { questions } from '@/data/questions'
import { personalities } from '@/data/personalities'
import { submitQuizResult } from '@/lib/email'
import { BubbleBackground } from '@/components/ui/BubbleBackground'
import { WelcomeScreen } from '@/components/screens/WelcomeScreen'
import { QuestionScreen } from '@/components/screens/QuestionScreen'
import { EmailCaptureScreen } from '@/components/screens/EmailCaptureScreen'
import { ResultScreen } from '@/components/screens/ResultScreen'

function App() {
  const {
    state,
    startQuiz,
    selectAnswer,
    advanceQuestion,
    setEmail,
    setFirstName,
    submitEmailStart,
    submitEmailSuccess,
    submitEmailError,
    restart,
  } = useQuizState()

  const handleEmailSubmit = async () => {
    if (!state.result) return

    submitEmailStart()

    const personality = personalities[state.result]
    const result = await submitQuizResult({
      email: state.email,
      firstName: state.firstName || undefined,
      personalityId: state.result,
      personalityName: personality.name,
      matchedDrink: personality.matchedDrink,
      answers: state.answers,
      submittedAt: new Date().toISOString(),
    })

    if (result.success) {
      submitEmailSuccess()
    } else {
      submitEmailError()
    }
  }

  const screenKey =
    state.screen === 'question'
      ? `question-${state.currentQuestion}`
      : state.screen

  return (
    <div className="relative min-h-screen bg-dark">
      <BubbleBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, x: state.direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: state.direction * -60 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {state.screen === 'welcome' && (
              <WelcomeScreen onStart={startQuiz} />
            )}

            {state.screen === 'question' && (
              <QuestionScreen
                question={questions[state.currentQuestion]}
                questionIndex={state.currentQuestion}
                selectedAnswerId={state.selectedAnswerId}
                onSelectAnswer={selectAnswer}
                onAdvance={advanceQuestion}
              />
            )}

            {state.screen === 'email' && (
              <EmailCaptureScreen
                email={state.email}
                firstName={state.firstName}
                isSubmitting={state.isSubmitting}
                onEmailChange={setEmail}
                onFirstNameChange={setFirstName}
                onSubmit={handleEmailSubmit}
              />
            )}

            {state.screen === 'result' && state.result && (
              <ResultScreen
                personality={personalities[state.result]}
                onRestart={restart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App

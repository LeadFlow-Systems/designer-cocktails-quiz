import { useReducer, useCallback } from 'react'
import type { QuizState, SelectedAnswer, Screen } from '@/types/quiz'
import { calculatePersonality } from '@/utils/scoring'
import { TOTAL_QUESTIONS } from '@/data/questions'

type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'SELECT_ANSWER'; answerId: string }
  | { type: 'ADVANCE_QUESTION'; answer: SelectedAnswer }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_FIRST_NAME'; firstName: string }
  | { type: 'SUBMIT_EMAIL_START' }
  | { type: 'SUBMIT_EMAIL_SUCCESS' }
  | { type: 'SUBMIT_EMAIL_ERROR' }
  | { type: 'RESTART' }

const initialState: QuizState = {
  screen: 'welcome',
  currentQuestion: 0,
  answers: [],
  email: '',
  firstName: '',
  result: null,
  isSubmitting: false,
  direction: 1,
  selectedAnswerId: null,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, screen: 'question', currentQuestion: 0, direction: 1 }

    case 'SELECT_ANSWER':
      return { ...state, selectedAnswerId: action.answerId }

    case 'ADVANCE_QUESTION': {
      const newAnswers = [...state.answers, action.answer]
      const isLastQuestion = state.currentQuestion >= TOTAL_QUESTIONS - 1

      if (isLastQuestion) {
        const result = calculatePersonality(newAnswers)
        return {
          ...state,
          answers: newAnswers,
          result,
          screen: 'email' as Screen,
          direction: 1,
          selectedAnswerId: null,
        }
      }

      return {
        ...state,
        answers: newAnswers,
        currentQuestion: state.currentQuestion + 1,
        direction: 1,
        selectedAnswerId: null,
      }
    }

    case 'SET_EMAIL':
      return { ...state, email: action.email }

    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.firstName }

    case 'SUBMIT_EMAIL_START':
      return { ...state, isSubmitting: true }

    case 'SUBMIT_EMAIL_SUCCESS':
      return { ...state, isSubmitting: false, screen: 'result' as Screen }

    case 'SUBMIT_EMAIL_ERROR':
      return { ...state, isSubmitting: false }

    case 'RESTART':
      return { ...initialState }

    default:
      return state
  }
}

export function useQuizState() {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startQuiz = useCallback(() => dispatch({ type: 'START_QUIZ' }), [])

  const selectAnswer = useCallback(
    (answerId: string) => dispatch({ type: 'SELECT_ANSWER', answerId }),
    []
  )

  const advanceQuestion = useCallback(
    (answer: SelectedAnswer) => dispatch({ type: 'ADVANCE_QUESTION', answer }),
    []
  )

  const setEmail = useCallback(
    (email: string) => dispatch({ type: 'SET_EMAIL', email }),
    []
  )

  const setFirstName = useCallback(
    (firstName: string) => dispatch({ type: 'SET_FIRST_NAME', firstName }),
    []
  )

  const submitEmailStart = useCallback(
    () => dispatch({ type: 'SUBMIT_EMAIL_START' }),
    []
  )

  const submitEmailSuccess = useCallback(
    () => dispatch({ type: 'SUBMIT_EMAIL_SUCCESS' }),
    []
  )

  const submitEmailError = useCallback(
    () => dispatch({ type: 'SUBMIT_EMAIL_ERROR' }),
    []
  )

  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])

  return {
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
  }
}

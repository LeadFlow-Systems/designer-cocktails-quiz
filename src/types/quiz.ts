export type PersonalityId =
  | 'life-of-the-party'
  | 'sophisticate'
  | 'wild-card'
  | 'chill-one'
  | 'main-character'
  | 'secret-weapon'

export interface Answer {
  id: string
  text: string
  emoji: string
  scores: Partial<Record<PersonalityId, number>>
}

export interface Question {
  id: string
  text: string
  answers: Answer[]
}

export interface Personality {
  id: PersonalityId
  name: string
  tagline: string
  description: string
  color: string
  emoji: string
  traits: string[]
  matchedDrink: string
}

export interface SelectedAnswer {
  questionId: string
  answerId: string
  scores: Partial<Record<PersonalityId, number>>
}

export type Screen = 'welcome' | 'question' | 'email' | 'result'

export interface QuizState {
  screen: Screen
  currentQuestion: number
  answers: SelectedAnswer[]
  email: string
  firstName: string
  result: PersonalityId | null
  isSubmitting: boolean
  direction: 1 | -1
  selectedAnswerId: string | null
}

import type { PersonalityId, SelectedAnswer } from '@/types/quiz'

export interface QuizSubmissionPayload {
  email: string
  firstName?: string
  personalityId: PersonalityId
  personalityName: string
  matchedDrink: string
  answers: SelectedAnswer[]
  submittedAt: string
}

export async function submitQuizResult(
  payload: QuizSubmissionPayload
): Promise<{ success: boolean; error?: string }> {
  // MVP: Log to console. Replace with Go High Level API integration later.
  // GHL endpoint: POST /contacts with custom fields for personality data
  console.log('[Quiz Submission]', payload)

  // Simulate network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800))

  return { success: true }
}

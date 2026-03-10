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
  const webhookUrl =
    'https://services.leadconnectorhq.com/hooks/00KWHjPgKJJvH1gAZ9Li/webhook-trigger/5b983f24-e7bb-4cf8-bdbe-a3e91f8ca5e9'

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: payload.firstName || '',
        email: payload.email,
        personalityName: payload.personalityName,
        matchedDrink: payload.matchedDrink,
      }),
    })

    if (!response.ok) {
      console.error('[Quiz Submission] Webhook error:', response.status)
      return { success: false, error: 'Submission failed. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    console.error('[Quiz Submission] Network error:', error)
    return { success: false, error: 'Network error. Please try again.' }
  }
}

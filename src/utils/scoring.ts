import type { PersonalityId, SelectedAnswer } from '@/types/quiz'

const ALL_PERSONALITIES: PersonalityId[] = [
  'life-of-the-party',
  'sophisticate',
  'wild-card',
  'chill-one',
  'main-character',
  'secret-weapon',
]

export function calculatePersonality(answers: SelectedAnswer[]): PersonalityId {
  const scores: Record<PersonalityId, number> = {
    'life-of-the-party': 0,
    'sophisticate': 0,
    'wild-card': 0,
    'chill-one': 0,
    'main-character': 0,
    'secret-weapon': 0,
  }

  for (const answer of answers) {
    for (const [personalityId, weight] of Object.entries(answer.scores)) {
      scores[personalityId as PersonalityId] += weight
    }
  }

  let maxScore = 0
  let result: PersonalityId = ALL_PERSONALITIES[0]

  for (const id of ALL_PERSONALITIES) {
    if (scores[id] > maxScore) {
      maxScore = scores[id]
      result = id
    }
  }

  return result
}

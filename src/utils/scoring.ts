import type { PersonalityId, SelectedAnswer } from '@/types/quiz'

const ALL_PERSONALITIES: PersonalityId[] = [
  'french-martini',
  'pornstar-martini',
  'espresso-martini',
  'pineapple-paradise',
  'watermelon-cosmo',
  'strawberry-woo-woo',
  'peach-cobbler',
]

export function calculatePersonality(answers: SelectedAnswer[]): PersonalityId {
  const scores: Record<PersonalityId, number> = {
    'french-martini': 0,
    'pornstar-martini': 0,
    'espresso-martini': 0,
    'pineapple-paradise': 0,
    'watermelon-cosmo': 0,
    'strawberry-woo-woo': 0,
    'peach-cobbler': 0,
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

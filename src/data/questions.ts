import type { Question } from '@/types/quiz'

export const questions: Question[] = [
  {
    id: 'q1',
    text: "It's Friday night. What's your vibe?",
    answers: [
      {
        id: 'q1a',
        text: 'Pre-drinks at mine, obviously',
        emoji: '🏠',
        scores: { 'life-of-the-party': 3, 'main-character': 1 },
      },
      {
        id: 'q1b',
        text: 'Quiet corner, fancy glass',
        emoji: '🥃',
        scores: { 'sophisticate': 3, 'chill-one': 1 },
      },
      {
        id: 'q1c',
        text: 'Whatever happens, happens',
        emoji: '🎲',
        scores: { 'wild-card': 3, 'life-of-the-party': 1 },
      },
      {
        id: 'q1d',
        text: "I'm already two drinks in",
        emoji: '🍹',
        scores: { 'main-character': 3, 'secret-weapon': 1 },
      },
    ],
  },
  {
    id: 'q2',
    text: 'Your mates describe you as...',
    answers: [
      {
        id: 'q2a',
        text: 'The one who starts the group chat at 3am',
        emoji: '📱',
        scores: { 'life-of-the-party': 3, 'wild-card': 1 },
      },
      {
        id: 'q2b',
        text: 'The one with actual taste',
        emoji: '👑',
        scores: { 'sophisticate': 3, 'secret-weapon': 1 },
      },
      {
        id: 'q2c',
        text: 'The one with stories no one believes',
        emoji: '🤯',
        scores: { 'wild-card': 3, 'main-character': 1 },
      },
      {
        id: 'q2d',
        text: 'The responsible one (yeah right)',
        emoji: '😇',
        scores: { 'chill-one': 3, 'sophisticate': 1 },
      },
    ],
  },
  {
    id: 'q3',
    text: 'Pick your ideal weekend chaos:',
    answers: [
      {
        id: 'q3a',
        text: 'Brunch that turns into an all-dayer',
        emoji: '🥂',
        scores: { 'life-of-the-party': 3, 'main-character': 1 },
      },
      {
        id: 'q3b',
        text: 'Rooftop with a sunset view',
        emoji: '🌅',
        scores: { 'sophisticate': 3, 'chill-one': 1 },
      },
      {
        id: 'q3c',
        text: 'Spontaneous road trip, no plan',
        emoji: '🚗',
        scores: { 'wild-card': 3, 'secret-weapon': 1 },
      },
      {
        id: 'q3d',
        text: 'Netflix. Alone. Perfectly content',
        emoji: '📺',
        scores: { 'chill-one': 3, 'secret-weapon': 1 },
      },
    ],
  },
  {
    id: 'q4',
    text: 'Your go-to karaoke move?',
    answers: [
      {
        id: 'q4a',
        text: 'Mr. Brightside (obviously)',
        emoji: '🎤',
        scores: { 'life-of-the-party': 3, 'wild-card': 1 },
      },
      {
        id: 'q4b',
        text: "Something nobody's heard of",
        emoji: '🎵',
        scores: { 'sophisticate': 3, 'secret-weapon': 1 },
      },
      {
        id: 'q4c',
        text: 'Bohemian Rhapsody. Full commitment.',
        emoji: '🎸',
        scores: { 'main-character': 3, 'wild-card': 1 },
      },
      {
        id: 'q4d',
        text: "I don't do karaoke. I observe.",
        emoji: '👀',
        scores: { 'secret-weapon': 3, 'chill-one': 1 },
      },
    ],
  },
  {
    id: 'q5',
    text: 'How do you handle a bad day?',
    answers: [
      {
        id: 'q5a',
        text: 'Ring the group — emergency drinks',
        emoji: '🍻',
        scores: { 'life-of-the-party': 3, 'main-character': 1 },
      },
      {
        id: 'q5b',
        text: 'A perfectly made drink, alone, in silence',
        emoji: '🧘',
        scores: { 'sophisticate': 3, 'chill-one': 1 },
      },
      {
        id: 'q5c',
        text: 'Turn it into a story for later',
        emoji: '📖',
        scores: { 'wild-card': 3, 'main-character': 1 },
      },
      {
        id: 'q5d',
        text: "Honestly? Already forgotten about it",
        emoji: '🤷',
        scores: { 'chill-one': 3, 'secret-weapon': 1 },
      },
    ],
  },
]

export const TOTAL_QUESTIONS = questions.length

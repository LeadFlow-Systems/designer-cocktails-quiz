import type { Personality, PersonalityId } from '@/types/quiz'

export const personalities: Record<PersonalityId, Personality> = {
  'life-of-the-party': {
    id: 'life-of-the-party',
    name: 'The Life of the Party',
    tagline: 'First to arrive, last to leave. Legend.',
    description:
      "You're the energy. Without you, it's just people standing around holding drinks and checking their phones. You bring the chaos, the laughs, and the questionable decisions that make the best stories.",
    color: '#00b8c3',
    emoji: '🎉',
    traits: [
      'Always has a story',
      'Knows everyone everywhere',
      'Dangerously persuasive',
      'Allergic to early nights',
    ],
    matchedDrink: 'Passion Fruit Margarita',
  },
  sophisticate: {
    id: 'sophisticate',
    name: 'The Sophisticate',
    tagline: "You've got taste. And everyone knows it.",
    description:
      "You don't just drink — you curate. While your mates are ordering whatever's cheapest, you're three pages deep in the cocktail menu. Quality over quantity, always.",
    color: '#dbc31f',
    emoji: '✨',
    traits: [
      'Impeccable taste in everything',
      'Secretly judges drink orders',
      'Always finds the best spot',
      'Owns at least one fancy glass',
    ],
    matchedDrink: 'Espresso Martini',
  },
  'wild-card': {
    id: 'wild-card',
    name: 'The Wild Card',
    tagline: 'Plans? Never heard of them.',
    description:
      "Nobody knows what you're going to do next — including you. You live for spontaneity, thrive in chaos, and somehow always end up with the best nights out.",
    color: '#f43f5e',
    emoji: '🃏',
    traits: [
      'Thrives in chaos',
      'Has at least 3 unbelievable stories',
      'Makes friends with strangers',
      'Never checks the time',
    ],
    matchedDrink: 'Spicy Margarita',
  },
  'chill-one': {
    id: 'chill-one',
    name: 'The Chill One',
    tagline: "Chaos? Nah. Pass the drink.",
    description:
      "You're the calm in the storm. While everyone else is losing it, you're vibing in the corner with a perfect drink and zero stress. Unbothered. Moisturised. Thriving.",
    color: '#a78bfa',
    emoji: '😎',
    traits: [
      'Unshakeable vibes',
      'Could nap anywhere',
      'Secretly the wisest one',
      'Peak comfort at all times',
    ],
    matchedDrink: 'Gin & Tonic',
  },
  'main-character': {
    id: 'main-character',
    name: 'The Main Character',
    tagline: "Every night out is YOUR night out.",
    description:
      "You don't just show up — you arrive. Life is your stage, every drink is a prop, and everyone else is a supporting character. And honestly? We're all here for it.",
    color: '#f97316',
    emoji: '🌟',
    traits: [
      'Born for the spotlight',
      'Entrance game is unmatched',
      'Takes 47 selfies minimum',
      'Owns the dance floor',
    ],
    matchedDrink: 'Pornstar Martini',
  },
  'secret-weapon': {
    id: 'secret-weapon',
    name: 'The Secret Weapon',
    tagline: 'Quiet. Deadly. Unforgettable.',
    description:
      "You're the one nobody sees coming. You hang back, observe, and then casually drop the funniest line of the night. You don't need the spotlight — it finds you.",
    color: '#10b981',
    emoji: '🥷',
    traits: [
      'Delivers killer one-liners',
      'Disappears and reappears mysteriously',
      'Always has the best gossip',
      'Wins every drinking game silently',
    ],
    matchedDrink: 'Dark & Stormy',
  },
}

import type { Personality, PersonalityId } from '@/types/quiz'

export const personalities: Record<PersonalityId, Personality> = {
  'french-martini': {
    id: 'french-martini',
    name: 'The Fancy One',
    tagline: 'Elegant and sophisticated... aye right.',
    description:
      "You like to think you're all class and elegance, but let's be honest. You'll order a Sauvignon Blanc please — even though it took you a year to pronounce it properly. Pinky up, standards questionable.",
    color: '#d946a8',
    emoji: '🍸',
    traits: [
      "Thinks they're classy",
      'Wine snob in training',
      'Elegant on the surface',
      'Secretly chaotic',
    ],
    matchedDrink: 'French Martini',
    image: '/cans/french-martini.png',
  },
  'pornstar-martini': {
    id: 'pornstar-martini',
    name: 'The Party Animal',
    tagline: 'First up dancing, first in their bed.',
    description:
      "You're the designated party animal of the group and everyone knows it. First on the dance floor, last to remember what happened. The hangovers are brutal and the fear is real, but you'll do it all again next weekend.",
    color: '#f5a623',
    emoji: '🍹',
    traits: [
      'Party animal',
      'First up dancing',
      'Lives with the fear',
      'Absolute legend',
    ],
    matchedDrink: 'Pornstar Martini',
    image: '/cans/pornstar-martini.png',
  },
  'espresso-martini': {
    id: 'espresso-martini',
    name: 'The Dark Horse',
    tagline: "It's always the quiet ones.",
    description:
      "You sit back, relax, and watch everyone else make a fool of themselves. But then 14 cocktails deep and suddenly you're up on the tables leading a conga line. Nobody saw it coming. They never do.",
    color: '#C49A2A',
    emoji: '☕',
    traits: [
      'Dark horse',
      'Quiet then chaos',
      'Surprise package',
      'Table dancer (eventually)',
    ],
    matchedDrink: 'Espresso Martini',
    image: '/cans/espresso-martini.png',
  },
  'pineapple-paradise': {
    id: 'pineapple-paradise',
    name: 'The Beach Bum',
    tagline: 'Living the dream, one sunbed at a time.',
    description:
      "You love the finer things in life — lying on a beach with a Piña Colada or a Strawberry Daiquiri in hand. But let's be honest, you're also sneaking off for a cheeky sunbed four times a week. Bougie on a budget.",
    color: '#2dd4bf',
    emoji: '🍍',
    traits: [
      'Beach bum',
      'Sunbed addict',
      'Bougie on a budget',
      'Living their best life',
    ],
    matchedDrink: 'Pineapple Paradise',
    image: '/cans/pineapple-paradise.png',
  },
  'watermelon-cosmo': {
    id: 'watermelon-cosmo',
    name: 'The Beautiful Disaster',
    tagline: 'Arrived at brunch looking posh. Left in a bush.',
    description:
      "You think you're dead posh, turning up looking all elegant and put together. But let's face it — you arrive at a brunch and somehow end up in a bush missing your shoes. Classy on arrival, carnage by dessert.",
    color: '#e8445a',
    emoji: '🍉',
    traits: [
      'Faux posh',
      'Brunch queen',
      'Loses shoes regularly',
      'Beautiful disaster',
    ],
    matchedDrink: 'Watermelon Cosmo',
    image: '/cans/watermelon-cosmo.png',
  },
  'strawberry-woo-woo': {
    id: 'strawberry-woo-woo',
    name: 'The Day Drinker',
    tagline: "It's 5 o'clock somewhere.",
    description:
      "Fun, flirty, and always up for a drink — or seven. You're partial to an occasional Lambrini and you're always the first one to suggest getting back on it the next day. Your favourite line? It's 5 o'clock somewhere.",
    color: '#ec4899',
    emoji: '🍓',
    traits: [
      'Fun and flirty',
      'Day drinker',
      'Lambrini lover',
      'Always on it',
    ],
    matchedDrink: 'Strawberry Woo Woo',
    image: '/cans/strawberry-woo-woo.png',
  },
  'peach-cobbler': {
    id: 'peach-cobbler',
    name: 'The Straight Talker',
    tagline: 'Strong, no nonsense, and partial to a pint.',
    description:
      "You're strong, you pack a punch, and you put up with absolutely no nonsense. You're also partial to a pint of Guinness or a cold beer. No drama, no fuss — just straight talking and good times.",
    color: '#f97316',
    emoji: '🍑',
    traits: [
      'Takes no nonsense',
      'Packs a punch',
      'Guinness fan',
      'Straight talker',
    ],
    matchedDrink: 'Peach Cobbler',
    image: '/cans/peach-cobbler.png',
  },
}

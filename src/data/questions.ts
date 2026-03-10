import type { Question } from '@/types/quiz'

export const questions: Question[] = [
  {
    id: 'q1',
    text: 'On a night out, which one are you?',
    answers: [
      { id: 'q1a', text: 'Up on the tables giving it laldy', emoji: '💃', scores: { 'pornstar-martini': 3, 'strawberry-woo-woo': 1 } },
      { id: 'q1b', text: 'Hyping everyone up from the sidelines', emoji: '📣', scores: { 'espresso-martini': 3, 'pineapple-paradise': 1 } },
      { id: 'q1c', text: 'Flirting and giving people the wink', emoji: '😘', scores: { 'strawberry-woo-woo': 3, 'watermelon-cosmo': 1 } },
      { id: 'q1d', text: 'Parked at the bar getting absolutely steamboats', emoji: '🍺', scores: { 'peach-cobbler': 3, 'pornstar-martini': 1 } },
    ],
  },
  {
    id: 'q2',
    text: "Organising a hen do or special occasion — what's your style?",
    answers: [
      { id: 'q2a', text: "Ask everyone's opinion on absolutely everything", emoji: '🗳️', scores: { 'french-martini': 3, 'espresso-martini': 1 } },
      { id: 'q2b', text: 'My way or the highway', emoji: '👸', scores: { 'peach-cobbler': 3, 'watermelon-cosmo': 1 } },
      { id: 'q2c', text: 'Send out a poll and let democracy decide', emoji: '📊', scores: { 'watermelon-cosmo': 3, 'french-martini': 1 } },
      { id: 'q2d', text: 'Leave it to someone else — cannae be arsed', emoji: '🤷', scores: { 'pineapple-paradise': 3, 'peach-cobbler': 1 } },
    ],
  },
  {
    id: 'q3',
    text: "The group chat is popping off while you're at work. You...",
    answers: [
      { id: 'q3a', text: "Ignore it — I'm working, I'll catch up later", emoji: '💼', scores: { 'peach-cobbler': 3, 'espresso-martini': 1 } },
      { id: 'q3b', text: 'Sneak off for the gossip but never reply', emoji: '👀', scores: { 'espresso-martini': 3, 'pineapple-paradise': 1 } },
      { id: 'q3c', text: 'Stir things up so it kicks off even more', emoji: '🔥', scores: { 'pornstar-martini': 3, 'strawberry-woo-woo': 1 } },
      { id: 'q3d', text: 'Announce you need a "break" and phone your bestie', emoji: '📱', scores: { 'strawberry-woo-woo': 3, 'french-martini': 1 } },
    ],
  },
  {
    id: 'q4',
    text: "Date night with your partner, nae kids — what's the plan?",
    answers: [
      { id: 'q4a', text: 'Cosy night in with a cheese board and wine', emoji: '🧀', scores: { 'french-martini': 3, 'pineapple-paradise': 1 } },
      { id: 'q4b', text: 'Absolutely smashed and loving life', emoji: '🥳', scores: { 'pornstar-martini': 3, 'strawberry-woo-woo': 1 } },
      { id: 'q4c', text: "Tell your partner you're staying in, then sneak out with the girls", emoji: '🤫', scores: { 'watermelon-cosmo': 3, 'pornstar-martini': 1 } },
      { id: 'q4d', text: 'Invite a few couples round — keys in a bowl', emoji: '🔑', scores: { 'strawberry-woo-woo': 3, 'watermelon-cosmo': 1 } },
    ],
  },
  {
    id: 'q5',
    text: "Round the pool on a girls' holiday, you are...",
    answers: [
      { id: 'q5a', text: 'Tits oot, bombing in the pool', emoji: '💦', scores: { 'pornstar-martini': 3, 'peach-cobbler': 1 } },
      { id: 'q5b', text: "Leave me alone Karen, I'm working on my tan", emoji: '😎', scores: { 'pineapple-paradise': 3, 'french-martini': 1 } },
      { id: 'q5c', text: 'Hanging by the bar, getting back on it', emoji: '🍹', scores: { 'strawberry-woo-woo': 3, 'pornstar-martini': 1 } },
      { id: 'q5d', text: "Getting pics for the 'gram on the side of the pool", emoji: '📸', scores: { 'watermelon-cosmo': 3, 'french-martini': 1 } },
    ],
  },
  {
    id: 'q6',
    text: "Shopping for a new outfit for the weekend — what's the move?",
    answers: [
      { id: 'q6a', text: 'First shop, first dress... done', emoji: '⚡', scores: { 'peach-cobbler': 3, 'espresso-martini': 1 } },
      { id: 'q6b', text: 'Order 1,000 online, send them all back, wear something I already own', emoji: '📦', scores: { 'pineapple-paradise': 3, 'watermelon-cosmo': 1 } },
      { id: 'q6c', text: 'All day in town with Prosecco until I find one', emoji: '🥂', scores: { 'french-martini': 3, 'watermelon-cosmo': 1 } },
      { id: 'q6d', text: "Borrow one off a pal — can't be arsed", emoji: '👗', scores: { 'espresso-martini': 3, 'peach-cobbler': 1 } },
    ],
  },
  {
    id: 'q7',
    text: "In the gym, I'm this type of person...",
    answers: [
      { id: 'q7a', text: "What the hell's a gym?", emoji: '🤔', scores: { 'french-martini': 3, 'pornstar-martini': 1 } },
      { id: 'q7b', text: 'All about the booty gains and showing it on Insta', emoji: '🍑', scores: { 'watermelon-cosmo': 3, 'pineapple-paradise': 1 } },
      { id: 'q7c', text: 'Love a workout but keeping it to runs and home sessions', emoji: '🏃', scores: { 'espresso-martini': 3, 'french-martini': 1 } },
      { id: 'q7d', text: 'Got a programme and I am sticking to it — every calorie counted', emoji: '📋', scores: { 'pineapple-paradise': 3, 'peach-cobbler': 1 } },
    ],
  },
  {
    id: 'q8',
    text: 'What do you look for in a partner?',
    answers: [
      { id: 'q8a', text: 'Makes me laugh and has a good sense of humour', emoji: '😂', scores: { 'strawberry-woo-woo': 3, 'espresso-martini': 1 } },
      { id: 'q8b', text: 'Has to be tidy and dress well', emoji: '👔', scores: { 'french-martini': 3, 'pineapple-paradise': 1 } },
      { id: 'q8c', text: 'All about the bedroom — up for anything', emoji: '😈', scores: { 'pornstar-martini': 3, 'peach-cobbler': 1 } },
      { id: 'q8d', text: 'A pulse will do', emoji: '💀', scores: { 'peach-cobbler': 3, 'strawberry-woo-woo': 1 } },
    ],
  },
]

export const TOTAL_QUESTIONS = questions.length

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

export function initAnalytics() {
  if (!GA_ID) return

  // Load gtag.js
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}

function trackEvent(event: string, params?: Record<string, string | number>) {
  if (!GA_ID || !window.gtag) return
  window.gtag('event', event, params)
}

// Funnel events
export const analytics = {
  quizStarted: () => trackEvent('quiz_started'),

  questionViewed: (questionIndex: number) =>
    trackEvent('question_viewed', { question_number: questionIndex + 1 }),

  questionAnswered: (questionIndex: number) =>
    trackEvent('question_answered', { question_number: questionIndex + 1 }),

  emailScreenViewed: () => trackEvent('email_screen_viewed'),

  quizCompleted: (personalityName: string, matchedDrink: string) =>
    trackEvent('quiz_completed', {
      personality_name: personalityName,
      matched_drink: matchedDrink,
    }),

  shopClicked: (personalityName: string) =>
    trackEvent('shop_clicked', { personality_name: personalityName }),

  retakeClicked: () => trackEvent('retake_clicked'),

  shareClicked: (method: string) =>
    trackEvent('share_clicked', { method }),
}

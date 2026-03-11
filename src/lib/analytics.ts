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
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}

function trackEvent(event: string, params?: Record<string, string | number>) {
  if (!GA_ID || !window.gtag) return
  window.gtag('event', event, params)
}

// Funnel: started → answered (x8) → completed → shop/share
export const analytics = {
  quizStarted: () => trackEvent('quiz_started'),

  questionAnswered: (questionIndex: number) =>
    trackEvent('question_answered', { question_number: questionIndex + 1 }),

  quizCompleted: (personalityName: string, matchedDrink: string) =>
    trackEvent('quiz_completed', {
      personality_name: personalityName,
      matched_drink: matchedDrink,
    }),

  shopClicked: () => trackEvent('shop_clicked'),

  shareClicked: (method: string) =>
    trackEvent('share_clicked', { method }),
}

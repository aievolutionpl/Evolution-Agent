import { useEffect, useState, useCallback } from 'react'
import {
  detectBrowserLang,
  ONBOARDING_LANGS,
  type OnboardingLang,
} from '@/lib/onboarding-i18n'

const SEEN_KEY = 'aiel-welcome-tour-seen'
const LANG_KEY = 'aiel-welcome-tour-lang'

function readStoredLang(): OnboardingLang {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(LANG_KEY) as OnboardingLang | null
    if (stored && ONBOARDING_LANGS.some((l) => l.id === stored)) return stored
  } catch {
    /* ignore */
  }
  return detectBrowserLang()
}

function readSeen(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return true
  }
}

export function useWelcomeTour() {
  const [open, setOpen] = useState(false)
  const [lang, setLangState] = useState<OnboardingLang>('en')

  useEffect(() => {
    setLangState(readStoredLang())
    if (!readSeen()) {
      const t = window.setTimeout(() => setOpen(true), 250)
      return () => window.clearTimeout(t)
    }
    return undefined
  }, [])

  const setLang = useCallback((next: OnboardingLang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(LANG_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
    setOpen(false)
  }, [])

  const reopen = useCallback(() => setOpen(true), [])

  return { open, lang, setLang, dismiss, reopen }
}

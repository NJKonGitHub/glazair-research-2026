import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/portal.json'
import hu from './locales/hu/portal.json'
import de from './locales/de/portal.json'
import type { Lang } from './token'

export const SUPPORTED_LANGS: Lang[] = ['en', 'hu', 'de']
export const SESSION_KEY = 'glazair_portal_lang'

export function resolveInitialLang(tokenLang: Lang): Lang {
  const stored = sessionStorage.getItem(SESSION_KEY) as Lang | null
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored
  return tokenLang
}

export function initI18n(lang: Lang) {
  return i18n.use(initReactI18next).init({
    resources: {
      en: { portal: en },
      hu: { portal: hu },
      de: { portal: de },
    },
    lng: lang,
    fallbackLng: 'en',
    defaultNS: 'portal',
    interpolation: { escapeValue: false },
  })
}

export function switchLang(lang: Lang) {
  sessionStorage.setItem(SESSION_KEY, lang)
  i18n.changeLanguage(lang)
}

export default i18n

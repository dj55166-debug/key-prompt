import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import fr from './locales/fr/translation.json'
import es from './locales/es/translation.json'
import ar from './locales/ar/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'ar'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'keyprompt_lang',
    },
  })

// Apply RTL / LTR and lang attribute whenever language changes
const applyDirection = (lng) => {
  const isRTL = lng === 'ar'
  document.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
}

i18n.on('languageChanged', applyDirection)

// Apply on initial load
applyDirection(i18n.language)

export default i18n

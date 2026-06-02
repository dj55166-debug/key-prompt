import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.split('-')[0] || 'en'

  return (
    <div className="flex items-center gap-0.5">
      {LANGUAGES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            current === code
              ? 'bg-violet-600 text-white'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span className="text-sm leading-none">{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

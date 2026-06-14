import { createContext, useContext, useState } from 'react'
import translations from '../lib/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('ttm_lang') || null)

  function setLang(l) {
    localStorage.setItem('ttm_lang', l)
    setLangState(l)
  }

  const t = translations[lang || 'en']

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

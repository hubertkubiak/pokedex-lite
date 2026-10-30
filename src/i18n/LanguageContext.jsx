import { createContext, useContext, useEffect, useState } from 'react';
import { detectLanguage, messages, saveLanguage } from './index.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    saveLanguage(lang);
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t: messages[lang] }}>{children}</LanguageContext.Provider>;
}

/** Returns `{ lang, setLang, t }`, where `t` is the message dictionary for the current language. */
export function useI18n() {
  return useContext(LanguageContext);
}

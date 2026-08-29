import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageMode = "si" | "en";

interface LanguageContextType {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  isSi: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "si",
  setLang: () => {},
  isSi: true,
});

const STORAGE_KEY = "apparelbank_lang_mode";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageMode>("si");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageMode;
      if (saved === "si" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: LanguageMode) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isSi: lang === "si" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

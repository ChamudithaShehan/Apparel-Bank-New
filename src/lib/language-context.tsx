import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageMode = "both" | "si" | "en";

interface LanguageContextType {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "both",
  setLang: () => {},
});

const STORAGE_KEY = "factorypass_lang_mode";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageMode>("both");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageMode;
      if (saved === "both" || saved === "si" || saved === "en") {
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
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

"use client";

import { useLanguage } from "../lib/language-context";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`flex items-center rounded-full bg-[#18203E] p-1 ring-1 ring-white/10 ${className}`}
      role="group"
      aria-label="Language selection / භාෂාව තෝරන්න"
    >
      <button
        type="button"
        onClick={() => setLang("si")}
        className={`rounded-full px-3 py-1 text-xs sm:text-sm font-bold transition-all ${
          lang === "si"
            ? "bg-white text-[#080B1E] shadow-sm"
            : "text-white/70 hover:text-white"
        }`}
      >
        <span className="font-[family-name:var(--font-sinhala)]">සිං</span>
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 text-xs sm:text-sm font-bold transition-all ${
          lang === "en"
            ? "bg-white text-[#080B1E] shadow-sm"
            : "text-white/70 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useLanguage } from "../lib/language-context";

export function AppHeader() {
  const { lang, setLang } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080B1E] px-4 py-3 sm:px-6 shadow-md border-b border-white/5">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        {/* Left: App Logo + Titles */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-b from-[#2948FF] to-[#172ED6] shadow-md shadow-blue-950/50 ring-1 ring-white/15">
            <Home className="size-5.5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
              Apparel Bank
            </span>
            <span className="font-[family-name:var(--font-sinhala)] text-xs sm:text-sm font-semibold text-[#818CF8] leading-tight mt-0.5">
              {lang === "en" ? "Supplier Registration" : "සැපයුම්කරු ලියාපදිංචිය"}
            </span>
          </div>
        </Link>

        {/* Right: Language switch toggle pill */}
        <div className="flex items-center rounded-full bg-[#18203E] p-1 ring-1 ring-white/10">
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
      </div>
    </header>
  );
}

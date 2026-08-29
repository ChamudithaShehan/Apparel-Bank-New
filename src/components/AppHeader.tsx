"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../lib/language-context";

export function AppHeader() {
  const { lang, setLang } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#020326] px-4 py-3 sm:px-8 shadow-md border-b border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Left: App Logo + Titles */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          {/* Logo */}
          <div className="relative h-9 w-28 sm:h-11 sm:w-36 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Apparel Bank"
              fill
              priority
              className="object-contain object-left"
              sizes="(max-width: 640px) 112px, 144px"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block mx-3.5 sm:mx-4 h-6 sm:h-7 w-[1px] bg-white/25 shrink-0"></div>

          {/* Subtitle */}
          <span className="hidden sm:inline-block font-[family-name:var(--font-sinhala)] text-base sm:text-lg font-medium text-[#8B98FF] tracking-normal leading-tight whitespace-nowrap">
            {lang === "en" ? "Supplier Registration" : "සැපයුම්කරු ලියාපදිංචිය"}
          </span>
        </Link>

        {/* Right: Language switch toggle pill */}
        <div className="flex items-center rounded-full bg-[#12183a] p-1 ring-1 ring-white/15">
          <button
            type="button"
            onClick={() => setLang("si")}
            className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold transition-all ${
              lang === "si"
                ? "bg-white text-[#020326] shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            <span className="font-[family-name:var(--font-sinhala)]">සිං</span>
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-bold transition-all ${
              lang === "en"
                ? "bg-white text-[#020326] shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}

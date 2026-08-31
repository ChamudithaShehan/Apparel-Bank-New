"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, UserCheck, Tag } from "lucide-react";
import { useLanguage } from "../lib/language-context";

export function AppHeader() {
  const { lang, setLang, isSi } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#020326] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-md border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        {/* Left: App Logo + Titles */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
          {/* Logo */}
          <div className="relative h-8 w-26 sm:h-10 sm:w-34 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Apparel Bank"
              fill
              priority
              className="object-contain object-left"
              sizes="(max-width: 640px) 104px, 136px"
            />
          </div>

          {/* Divider */}
          <div className="hidden lg:block mx-3.5 h-6 w-[1px] bg-white/20 shrink-0"></div>

          {/* Subtitle */}
          <span className="hidden lg:inline-block font-[family-name:var(--font-sinhala)] text-sm font-medium text-[#8B98FF] tracking-normal leading-tight whitespace-nowrap">
            {lang === "en" ? "Supplier Registration" : "සැපයුම්කරු ලියාපදිංචිය"}
          </span>
        </Link>

        {/* Center / Right: Nav & Language switch */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Marketplace / Gigs Link */}
          <Link
            href="/marketplace"
            className="flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white transition-colors border border-white/15 shrink-0"
            title="Browse Manufacturing Gigs"
          >
            <span className="size-1.5 sm:size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden xs:inline">{isSi ? "සේවා (Gigs)" : "Marketplace"}</span>
            <span className="xs:hidden">{isSi ? "Gigs" : "Market"}</span>
          </Link>

          {/* Admin link */}
          <Link
            href="/admin"
            className="flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-white transition-colors border border-white/15 shrink-0"
            title="Admin Dashboard"
          >
            <ShieldCheck className="size-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">{isSi ? "පරිපාලක" : "Admin"}</span>
          </Link>

          {/* User Sign In link */}
          <Link
            href="/signin"
            className="flex items-center gap-1 rounded-xl bg-white/10 hover:bg-white/20 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-white transition-colors border border-white/15 shrink-0"
            title="User Portal"
          >
            <UserCheck className="size-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">{isSi ? "පිවිසෙන්න" : "Sign In"}</span>
          </Link>

          {/* Language switch toggle pill */}
          <div className="flex items-center rounded-full bg-[#12183a] p-0.5 sm:p-1 ring-1 ring-white/15 shrink-0">
            <button
              type="button"
              onClick={() => setLang("si")}
              className={`rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                lang === "si"
                  ? "bg-white text-[#020326] shadow-xs"
                  : "text-white/75 hover:text-white"
              }`}
            >
              <span className="font-[family-name:var(--font-sinhala)]">සිං</span>
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-white text-[#020326] shadow-xs"
                  : "text-white/75 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

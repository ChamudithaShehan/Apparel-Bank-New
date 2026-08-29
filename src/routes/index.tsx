import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Home, Clock, FileText, ShieldCheck, PhoneCall } from "lucide-react";
import { useLanguage } from "../lib/language-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apparel Bank — සැපයුම්කරු ලියාපදිංචිය | Supplier Registration" },
      {
        name: "description",
        content: "විනාඩි 2ක් විතරයි ගතවෙන්නේ. ලියන්න ඕන දේ ටිකයි — වැඩිය අකුරු ටයිප් කරන්න ඕන නෑ. සම්පූර්ණයෙන්ම නොමිලේ.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
      {/* Header bar matching exact provided mockup */}
      <header className="sticky top-0 z-50 w-full bg-[#080B1E] px-4 py-3 sm:px-6 shadow-md border-b border-white/5">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          {/* Left: App Logo + Titles */}
          <div className="flex items-center gap-3">
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
          </div>

          {/* Right: Language switch toggle pill */}
          <div className="flex items-center rounded-full bg-[#18203E] p-1 ring-1 ring-white/10">
            <button
              type="button"
              onClick={() => setLang("si")}
              className={`rounded-full px-3 py-1 text-xs sm:text-sm font-bold transition-all ${
                lang === "si" || lang === "both"
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

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Focused White Card */}
          <div className="rounded-[2.2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200/80">
            <div className="flex flex-col items-center">
              {/* Top Shield Icon Box */}
              <div className="grid size-22 place-items-center rounded-3xl bg-white shadow-[0_12px_36px_rgba(99,102,241,0.14)] ring-1 ring-slate-100">
                <svg viewBox="0 0 48 48" className="size-11" fill="none">
                  <path
                    d="M24 6L9 11.5V23C9 32.5 15.5 40.5 24 43C32.5 40.5 39 32.5 39 23V11.5L24 6Z"
                    stroke="#3B49DF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 24.5L21.5 29.5L31.5 19.5"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Heading */}
              {lang === "en" ? (
                <>
                  <h1 className="mt-6 text-center font-display text-2xl sm:text-3xl font-extrabold leading-snug text-[#0B122F] tracking-tight">
                    Welcome! 👋
                    <span className="block mt-0.5">Join with us</span>
                  </h1>
                  <p className="mt-2.5 text-center text-sm sm:text-base leading-relaxed text-slate-500">
                    Takes only 2 minutes. Very few details needed —
                    <span className="block">No long typing required.</span>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="mt-6 text-center font-[family-name:var(--font-sinhala)] text-2xl sm:text-3xl font-extrabold leading-snug text-[#0B122F] tracking-tight">
                    ආයුබෝවන්! 👋
                    <span className="block mt-0.5">අපි එක්ක එකතු වෙන්න</span>
                  </h1>
                  <p className="mt-2.5 text-center font-[family-name:var(--font-sinhala)] text-sm sm:text-base leading-relaxed text-slate-500">
                    විනාඩි 2ක් විතරයි ගතවෙන්නේ. ලියන්න ඕන දේ ටිකයි —
                    <span className="block">වැඩිය අකුරු ටයිප් කරන්න ඕන නෑ.</span>
                  </p>
                </>
              )}

              {/* 3 Simple Key Highlights for 60+ reassurance */}
              <div className="mt-6 grid w-full grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center border border-slate-100">
                <div className="flex flex-col items-center">
                  <Clock className="size-5 text-blue-600 mb-1" strokeWidth={2.2} />
                  <span className="text-xs font-bold text-slate-700">
                    {lang === "en" ? "2 Minutes" : "විනාඩි 2යි"}
                  </span>
                </div>
                <div className="flex flex-col items-center border-x border-slate-200">
                  <FileText className="size-5 text-indigo-600 mb-1" strokeWidth={2.2} />
                  <span className="text-xs font-bold text-slate-700">
                    {lang === "en" ? "4 Details" : "විස්තර 4යි"}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="size-5 text-emerald-600 mb-1" strokeWidth={2.2} />
                  <span className="text-xs font-bold text-slate-700">
                    {lang === "en" ? "100% Free" : "නොමිලේ"}
                  </span>
                </div>
              </div>

              {/* "සම්පූර්ණයෙන්ම නොමිලේ" Pill Card */}
              <div className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 py-3 px-5 shadow-xs">
                <div className="flex size-6 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500 bg-white">
                  <Check className="size-3.5 stroke-[3]" />
                </div>
                <span className="font-[family-name:var(--font-sinhala)] text-base sm:text-lg font-bold text-[#0B122F]">
                  {lang === "en" ? "Completely Free Registration" : "සම්පූර්ණයෙන්ම නොමිලේ ලියාපදිංචිය"}
                </span>
              </div>

              {/* Action Button */}
              <div className="mt-6 w-full">
                <Link
                  to="/signup"
                  className="flex h-13.5 sm:h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-6 text-white font-bold transition-all hover:bg-[#020333]/90 active:scale-[0.99] shadow-sm"
                >
                  <span className="font-display text-lg font-bold">Continue</span>
                  {lang !== "en" && (
                    <span
                      lang="si"
                      className="font-[family-name:var(--font-sinhala)] text-base font-semibold opacity-95"
                    >
                      (ඉදිරියට)
                    </span>
                  )}
                  <ArrowRight className="size-5 stroke-[2.5]" />
                </Link>

                {/* Already registered sign in link */}
                <div className="mt-5 text-center">
                  <p className="font-[family-name:var(--font-sinhala)] text-sm text-slate-500">
                    {lang === "en" ? (
                      <>
                        Already have an account?{" "}
                        <Link
                          to="/signin"
                          className="font-bold text-primary hover:underline"
                        >
                          Sign In
                        </Link>
                      </>
                    ) : (
                      <>
                        දැනටමත් ගිණුමක් තිබේද?{" "}
                        <Link
                          to="/signin"
                          className="font-bold text-primary hover:underline"
                        >
                          ඇතුල් වන්න / Sign In
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple assistance note for seniors */}
          <div className="mt-6 text-center">
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <PhoneCall className="size-3.5 text-slate-400" />
              {lang === "en"
                ? "Need help? Call our support team"
                : "ලියාපදිංචියේදී ගැටළුවක්ද? අප අමතන්න"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

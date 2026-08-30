"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { AppHeader } from "@/components/AppHeader";

const inputClass =
  "w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-lg font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function SignInPage() {
  const { isSi } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
      <AppHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-md">
          <div className="rounded-[2.2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200/80">
            {/* Back link */}
            <div className="border-b border-slate-100 pb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep hover:underline"
              >
                <span>‹</span>
                <span>{isSi ? "මුල් පිටුවට" : "Back to Home"}</span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mt-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {isSi ? "ඇතුල් වන්න" : "Sign In"}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {isSi
                  ? "පරිශීලක නාමය සහ දුරකථන අංකය ඇතුළත් කරන්න"
                  : "Enter your user name and mobile number to sign in"}
              </p>
            </div>

            {/* Form */}
            <form className="mt-6 flex flex-col gap-4.5" onSubmit={(e) => e.preventDefault()}>
              {/* Field 1: User Name */}
              <div>
                <label htmlFor="s-username" className="mb-1.5 block cursor-pointer">
                  <span className="font-display text-base font-bold text-foreground">
                    {isSi ? "පරිශීලක නාමය (User Name)" : "User Name"}
                  </span>
                </label>
                <input
                  id="s-username"
                  type="text"
                  placeholder={isSi ? "ඔබේ නම" : "Your name"}
                  autoComplete="username"
                  className={inputClass}
                />
              </div>

              {/* Field 2: Mobile Number */}
              <div>
                <label htmlFor="s-phone" className="mb-1.5 block cursor-pointer">
                  <span className="font-display text-base font-bold text-foreground">
                    {isSi ? "ජංගම දුරකථන අංකය (Mobile Number)" : "Mobile Number"}
                  </span>
                </label>
                <input
                  id="s-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder={isSi ? "උදා: 077 123 4567" : "e.g. 077 123 4567"}
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-5 text-white transition-all hover:bg-[#020333]/90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground shadow-sm font-bold"
              >
                <span className="font-display text-lg font-bold">Continue</span>
                {isSi && (
                  <span
                    lang="si"
                    className="font-[family-name:var(--font-sinhala)] text-base font-semibold opacity-95"
                  >
                    (ඉදිරියට)
                  </span>
                )}
                <ArrowRight className="size-5 stroke-[2.5]" />
              </button>
            </form>

            {/* Switch to Sign Up */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {isSi ? (
                  <>
                    ගිණුමක් නැද්ද?{" "}
                    <Link
                      href="/signup"
                      className="font-bold text-primary hover:underline"
                    >
                      නව ගිණුමක් සාදන්න
                    </Link>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-bold text-primary hover:underline"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

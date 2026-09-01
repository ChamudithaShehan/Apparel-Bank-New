"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { AppHeader } from "@/components/AppHeader";
import { findRegistration, setCurrentUser, getRegistrations } from "@/lib/registrations";

const inputClass =
  "w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-lg font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function SignInPage() {
  const { isSi } = useLanguage();
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = userName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedUser || !trimmedPhone) {
      setErrorMsg(
        isSi
          ? "කරුණාකර ඔබේ නම සහ දුරකථන අංකය ඇතුළත් කරන්න."
          : "Please enter both Your Name and Mobile Number."
      );
      return;
    }

    setIsLoading(true);

    const user = findRegistration(trimmedUser, trimmedPhone);

    if (user) {
      setCurrentUser(user);
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      setErrorMsg(
        isSi
          ? "ඇතුළත් කළ නම හෝ දුරකථන අංකය සොයාගත නොහැක. කරුණාකර නැවත පරීක්ෂා කරන්න හෝ නව ගිණුමක් සාදන්න."
          : "No registration found with this Name and Mobile Number. Please check your details or register first."
      );
    }
  };

  const fillSample = (sampleUser: string, samplePhone: string) => {
    setUserName(sampleUser);
    setPhone(samplePhone);
    setErrorMsg(null);
  };

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
              <p className="mt-1.5 text-base text-muted-foreground">
                {isSi
                  ? "ඔබේ නම සහ දුරකථන අංකය ඇතුළත් කරන්න"
                  : "Enter your name and mobile number to sign in"}
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-rose-800 border border-rose-200">
                <AlertCircle className="size-5 shrink-0 mt-0.5 text-rose-600" />
                <p className="text-sm font-semibold">{errorMsg}</p>
              </div>
            )}

            {/* Form */}
            <form className="mt-6 flex flex-col gap-4.5" onSubmit={handleSubmit}>
              {/* Field 1: Your Name */}
              <div>
                <label htmlFor="s-username" className="mb-1.5 block cursor-pointer">
                  <span className="font-display text-base font-bold text-foreground">
                    {isSi ? "ඔබේ නම (Your Name)" : "Your Name"}
                  </span>
                </label>
                <input
                  id="s-username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={isSi ? "උදා: Sunil Bandara" : "e.g. Sunil Bandara"}
                  autoComplete="name"
                  required
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isSi ? "උදා: 077 123 4567" : "e.g. 077 123 4567"}
                  autoComplete="tel"
                  required
                  className={inputClass}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-5 text-white transition-all hover:bg-[#020333]/90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground shadow-sm font-bold text-lg disabled:opacity-70 cursor-pointer"
              >
                <span className="font-display font-bold">
                  {isLoading
                    ? isSi
                      ? "පරීක්ෂා කරමින්..."
                      : "Verifying..."
                    : isSi
                    ? "ඇතුල් වන්න (Continue)"
                    : "Continue"}
                </span>
                {!isLoading && <ArrowRight className="size-5 stroke-[2.5]" />}
              </button>
            </form>

            {/* Quick Demo Fill For Convenience */}
            <div className="mt-6 rounded-2xl bg-blue-50/60 p-3.5 border border-blue-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
                <Sparkles className="size-3.5 text-blue-600" />
                <span>{isSi ? "පරීක්ෂා කිරීම සඳහා නිදසුන් ගිණුම්:" : "Sample accounts to test:"}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillSample("Sunil Bandara", "0771234567")}
                  className="rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  🟢 Sunil (Approved)
                </button>
                <button
                  type="button"
                  onClick={() => fillSample("Anula Silva", "0719876543")}
                  className="rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  🟡 Anula (Pending)
                </button>
                <button
                  type="button"
                  onClick={() => fillSample("Nimal Jayasinghe", "0765554321")}
                  className="rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  🔴 Nimal (Rejected)
                </button>
              </div>
            </div>

            {/* Switch to Sign Up */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <p className="text-base text-muted-foreground">
                {isSi ? (
                  <>
                    ගිණුමක් නැද්ද?{" "}
                    <Link
                      href="/signup"
                      className="font-bold text-primary hover:underline ml-1 text-primary-deep"
                    >
                      නව ගිණුමක් සාදන්න
                    </Link>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-bold text-primary hover:underline ml-1 text-primary-deep"
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Home, CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../lib/language-context";
import { AppHeader } from "../components/AppHeader";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Apparel Bank — සැපයුම්කරු ලියාපදිංචිය | Supplier Registration" },
      {
        name: "description",
        content: "Apparel Bank සැපයුම්කරු ලියාපදිංචිය. විනාඩි 2ක පහසු පියවර 2ක් පමණි.",
      },
    ],
  }),
  component: SignUpPage,
});

const inputClass =
  "w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-lg font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20";

const garmentCategories = [
  {
    id: "tshirt",
    nameEn: "T-Shirts",
    nameSi: "ටී-ෂර්ට් (T-Shirts)",
    descSi: "Casual & Polo ටී-ෂර්ට්",
    descEn: "Casual & Polo T-Shirts",
    image: "/images/categories/tshirt.jpg",
  },
  {
    id: "shirt",
    nameEn: "Shirts",
    nameSi: "කමිස (Shirts)",
    descSi: "Formal & Casual කමිස",
    descEn: "Formal & Casual Button-up Shirts",
    image: "/images/categories/shirt.jpg",
  },
  {
    id: "trousers",
    nameEn: "Trousers & Pants",
    nameSi: "කලිසම් (Trousers)",
    descSi: "කලිසම් සහ චිනෝස්",
    descEn: "Formal Pants & Chinos",
    image: "/images/categories/trousers.jpg",
  },
  {
    id: "dresses",
    nameEn: "Dresses & Frocks",
    nameSi: "ගවුම් (Dresses)",
    descSi: "කාන්තා ඇඳුම් සහ ගවුම්",
    descEn: "Ladies Dresses & Frocks",
    image: "/images/categories/dresses.jpg",
  },
];

function SignUpPage() {
  const { isSi } = useLanguage();

  // Multi-step form state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "tshirt",
  ]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
      <AppHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-xl">
          {/* ================= STEP 1: Basic Information ================= */}
          {step === 1 && (
            <div className="rounded-[2.2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200/80">
              {/* Back to Home & Step indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep hover:underline"
                >
                  <span>‹</span>
                  <span>{isSi ? "මුල් පිටුවට" : "Back to Home"}</span>
                </Link>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {isSi ? "පියවර 1 / 2" : "Step 1 of 2"}
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isSi ? "නව ගිණුමක් සාදන්න" : "Create Account"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSi
                    ? "ලියාපදිංචි වීමට පහත විස්තර 4 ඇතුළත් කරන්න"
                    : "Fill in the four fields below to continue"}
                </p>
              </div>

              {/* Step 1 Form */}
              <form className="mt-6 flex flex-col gap-4.5" onSubmit={handleStep1Submit}>
                {/* Field 1: Business Name */}
                <div>
                  <label htmlFor="f-name" className="mb-1.5 block cursor-pointer">
                    <span className="font-display text-base font-bold text-foreground">
                      {isSi ? "ව්‍යාපාරයේ නම (Business Name)" : "Business Name"}
                    </span>
                  </label>
                  <input
                    id="f-name"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={isSi ? "උදා: Sunbeam Apparels" : "e.g. Sunbeam Apparels"}
                    autoComplete="organization"
                    className={inputClass}
                  />
                </div>

                {/* Field 2: User Name */}
                <div>
                  <label htmlFor="f-person" className="mb-1.5 block cursor-pointer">
                    <span className="font-display text-base font-bold text-foreground">
                      {isSi ? "පරිශීලක නාමය (User Name)" : "User Name"}
                    </span>
                  </label>
                  <input
                    id="f-person"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={isSi ? "උදා: කේ. පෙරේරා" : "e.g. K. Perera"}
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                {/* Field 3: Mobile Number */}
                <div>
                  <label htmlFor="f-phone" className="mb-1.5 block cursor-pointer">
                    <span className="font-display text-base font-bold text-foreground">
                      {isSi ? "ජංගම දුරකථන අංකය (Mobile Number)" : "Mobile Number"}
                    </span>
                  </label>
                  <input
                    id="f-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="077 123 4567"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>

                {/* Field 4: Password */}
                <div>
                  <label htmlFor="f-pass" className="mb-1.5 block cursor-pointer">
                    <span className="font-display text-base font-bold text-foreground">
                      {isSi ? "මුරපදය (Password)" : "Password"}
                    </span>
                  </label>
                  <input
                    id="f-pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
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

              {/* Switch to Sign In */}
              <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {isSi ? (
                    <>
                      දැනටමත් ලියාපදිංචි වී තිබේද?{" "}
                      <Link
                        to="/signin"
                        className="font-bold text-primary hover:underline"
                      >
                        ඇතුල් වන්න
                      </Link>
                    </>
                  ) : (
                    <>
                      Already registered?{" "}
                      <Link
                        to="/signin"
                        className="font-bold text-primary hover:underline"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* ================= STEP 2: Garment Categories ================= */}
          {step === 2 && (
            <div className="rounded-[2.2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200/80">
              {/* Back to Step 1 & Step indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep hover:underline"
                >
                  <span>‹</span>
                  <span>{isSi ? "පෙර පියවර" : "Back to Step 1"}</span>
                </button>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {isSi ? "පියවර 2 / 2" : "Step 2 of 2"}
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isSi ? "නිෂ්පාදන විස්තර" : "Production Details"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSi
                    ? "ඔබේ ආයතනයෙන් නිෂ්පාදනය කරන ඇඳුම් වර්ග තෝරන්න"
                    : "Select the garment categories manufactured by your factory"}
                </p>
              </div>

              {/* Step 2 Form */}
              <form className="mt-6 flex flex-col gap-6" onSubmit={handleStep2Submit}>
                {/* Garment Categories with Real Photos */}
                <div>
                  <label className="mb-2 block">
                    <span className="font-display text-base font-bold text-foreground">
                      {isSi
                        ? "නිෂ්පාදනය කරන ඇඳුම් වර්ග (ඔබ නිපදවන වර්ග මත ක්ලික් කරන්න)"
                        : "Garment Categories Manufactured (Tap to select)"}
                    </span>
                  </label>

                  {/* 2x2 Grid of visual cards with real photos */}
                  <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mt-3">
                    {garmentCategories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98] ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-sm"
                              : "border-slate-200 bg-card hover:border-slate-300 hover:shadow-xs"
                          }`}
                        >
                          {/* Real Garment Photo */}
                          <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                            <img
                              src={cat.image}
                              alt={cat.nameEn}
                              className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                              loading="lazy"
                            />
                            {/* Selection badge overlay */}
                            <div
                              className={`absolute top-2 right-2 flex size-7 items-center justify-center rounded-full transition-all ${
                                isSelected
                                  ? "bg-primary text-white shadow-md scale-100"
                                  : "bg-black/35 text-white/80 scale-90 opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <Check className="size-4 stroke-[3]" />
                            </div>
                          </div>

                          {/* Category Title & Details */}
                          <div className="p-3">
                            <h3 className="font-[family-name:var(--font-sinhala)] text-base font-bold text-foreground leading-tight">
                              {isSi ? cat.nameSi : cat.nameEn}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {isSi ? cat.descSi : cat.descEn}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Final Submit Button */}
                <button
                  type="submit"
                  disabled={selectedCategories.length === 0}
                  className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-5 text-white transition-all hover:bg-[#020333]/90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground shadow-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-display text-lg font-bold">
                    {isSi ? "ලියාපදිංචිය අවසන් කරන්න" : "Complete Registration"}
                  </span>
                  {isSi && (
                    <span
                      lang="si"
                      className="font-[family-name:var(--font-sinhala)] text-base font-semibold opacity-95"
                    >
                      (Finish)
                    </span>
                  )}
                  <ArrowRight className="size-5 stroke-[2.5]" />
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 3: Success Confirmation ================= */}
          {step === 3 && (
            <div className="rounded-[2.2rem] bg-white p-7 sm:p-10 shadow-sm ring-1 ring-slate-200/80 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="size-12 stroke-[2.5]" />
              </div>

              <h1 className="mt-6 font-[family-name:var(--font-sinhala)] text-2xl sm:text-3xl font-extrabold text-[#0B122F]">
                {isSi ? "ලියාපදිංචිය සාර්ථකයි! 🎉" : "Registration Successful! 🎉"}
              </h1>
              <p className="mt-1 font-display text-base font-bold text-primary-deep">
                Welcome to Apparel Bank
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left border border-slate-100 space-y-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {isSi ? "ව්‍යාපාරයේ නම" : "Business Name"}
                  </span>
                  <p className="text-lg font-bold text-slate-800">
                    {businessName || "Sunbeam Apparels"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-2">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {isSi ? "පරිශීලක නාමය" : "User Name"}
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {userName || "K. Perera"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {isSi ? "දුරකථන අංකය" : "Mobile Number"}
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {phone || "077 123 4567"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {isSi ? "තෝරාගත් ඇඳුම් වර්ග" : "Selected Garment Categories"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedCategories.map((catId) => {
                      const item = garmentCategories.find((c) => c.id === catId);
                      return (
                        <span
                          key={catId}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-100/80 px-2.5 py-1 text-xs font-bold text-blue-900"
                        >
                          <Check className="size-3 stroke-[3]" />
                          {isSi ? item?.nameSi : item?.nameEn}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <Link
                  to="/"
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-6 text-white font-bold transition-all hover:bg-[#020333]/90 shadow-sm"
                >
                  <Home className="size-4.5" />
                  <span>{isSi ? "මුල් පිටුවට ආපසු" : "Back to Home"}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setBusinessName("");
                    setUserName("");
                    setPhone("");
                    setPassword("");
                    setSelectedCategories(["tshirt"]);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 py-2"
                >
                  <RotateCcw className="size-3.5" />
                  <span>{isSi ? "තවත් සැපයුම්කරුවෙක් ලියාපදිංචි කරන්න" : "Register another supplier"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

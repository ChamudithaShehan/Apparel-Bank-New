import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Home, CheckCircle2, RotateCcw, Calendar, Users, Package } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../lib/language-context";
import { AppHeader } from "../components/AppHeader";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Apparel Bank — සැපයුම්කරු ලියාපදිංචිය | Supplier Registration" },
      {
        name: "description",
        content: "Apparel Bank සැපයුම්කරු ලියාපදිංචිය. පහසු පියවර 3ක් පමණි.",
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

const yearsOptions = [
  { id: "under1", labelSi: "අවුරුදු 1ට අඩු", labelEn: "< 1 Year", subSi: "නව ආයතනයක්", subEn: "New Business" },
  { id: "1-5", labelSi: "අවුරුදු 1 - 5", labelEn: "1 - 5 Years", subSi: "අවුරුදු 1 සිට 5 දක්වා", subEn: "1 to 5 years" },
  { id: "5-10", labelSi: "අවුරුදු 5 - 10", labelEn: "5 - 10 Years", subSi: "අවුරුදු 5 සිට 10 දක්වා", subEn: "5 to 10 years" },
  { id: "10plus", labelSi: "අවුරුදු 10ට වැඩි", labelEn: "10+ Years", subSi: "පළපුරුදු ආයතනයක්", subEn: "Established Business" },
];

const workforceOptions = [
  { id: "1-10", labelSi: "සේවකයින් 1 - 10", labelEn: "1 - 10 Employees", subSi: "කුඩා පරිමාණ", subEn: "Small Scale" },
  { id: "11-50", labelSi: "සේවකයින් 11 - 50", labelEn: "11 - 50 Employees", subSi: "මධ්‍යම පරිමාණ", subEn: "Medium Scale" },
  { id: "51-200", labelSi: "සේවකයින් 51 - 200", labelEn: "51 - 200 Employees", subSi: "විශාල පරිමාණ", subEn: "Large Scale" },
  { id: "200plus", labelSi: "සේවකයින් 200ට වැඩි", labelEn: "200+ Employees", subSi: "මහා පරිමාණ", subEn: "Enterprise" },
];

const moqOptions = [
  { id: "1-50", labelSi: "කෑලි 1 - 50", labelEn: "1 - 50 Pieces", subSi: "කුඩා ඇණවුම්", subEn: "Small Orders" },
  { id: "51-200", labelSi: "කෑලි 51 - 200", labelEn: "51 - 200 Pieces", subSi: "මධ්‍යම ඇණවුම්", subEn: "Medium Orders" },
  { id: "201-500", labelSi: "කෑලි 201 - 500", labelEn: "201 - 500 Pieces", subSi: "විශාල ඇණවුම්", subEn: "Large Orders" },
  { id: "500plus", labelSi: "කෑලි 500ට වැඩි", labelEn: "500+ Pieces", subSi: "තොග ඇණවුම්", subEn: "Bulk Orders" },
];

function SignUpPage() {
  const { isSi } = useLanguage();

  // Multi-step form state: 1 (Basic Info), 2 (Garment Categories), 3 (Years in Operation), 4 (Workforce), 5 (MOQ), 6 (Success Screen)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [yearsInOperation, setYearsInOperation] = useState<string>("1-5");
  const [workforce, setWorkforce] = useState<string>("1-10");
  const [moq, setMoq] = useState<string>("51-200");
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

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(6);
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
                  {isSi ? "පියවර 1 / 5" : "Step 1 of 5"}
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isSi ? "නව ගිණුමක් සාදන්න" : "Create Account"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSi
                    ? "ලියාපදිංචි වීමට පහත විස්තර ඇතුළත් කරන්න"
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
                    placeholder={isSi ? "උදා: සන්බීම් ඇපරල්ස්" : "e.g. Sunbeam Apparels"}
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
                    placeholder={isSi ? "උදා: 077 123 4567" : "e.g. 077 123 4567"}
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
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {isSi ? "පියවර 2 / 3" : "Step 2 of 3"}
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isSi ? "නිෂ්පාදනය කරන ඇඳුම් වර්ග" : "Garment Categories Manufactured"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSi
                    ? "ඔබේ ආයතනයෙන් නිෂ්පාදනය කරන ඇඳුම් වර්ග තෝරන්න (එකකට වඩා තෝරාගත හැක)"
                    : "Select the garment categories manufactured by your factory"}
                </p>
              </div>

              {/* Step 2 Form */}
              <form className="mt-6 flex flex-col gap-6" onSubmit={handleStep2Submit}>
                {/* 2x2 Grid of visual cards with real photos */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
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

                {/* Continue to Step 3 Button */}
                <button
                  type="submit"
                  disabled={selectedCategories.length === 0}
                  className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-5 text-white transition-all hover:bg-[#020333]/90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground shadow-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          )}

          {/* ================= STEP 3: Years in Operation (Form 3) ================= */}
          {step === 3 && (
            <div className="rounded-[2.2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200/80">
              {/* Back to Step 2 & Step indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep hover:underline"
                >
                  <span>‹</span>
                  <span>{isSi ? "පෙර පියවර" : "Back to Step 2"}</span>
                </button>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {isSi ? "පියවර 3 / 5" : "Step 3 of 5"}
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <div className="flex items-center gap-2">
                  <Calendar className="size-6 text-primary" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {isSi ? "ආයතනයේ වයස" : "Years in Operation"}
                  </h1>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSi
                    ? "ඔබේ ආයතනය කොපමණ කාලයක් ක්‍රියාත්මක වී ඇත්දැයි තෝරන්න"
                    : "Select how long your business has been in operation"}
                </p>
              </div>

              {/* Step 3 Form */}
              <form className="mt-6 flex flex-col gap-6" onSubmit={handleStep3Submit}>
                {/* Selectable Cards for Years in Operation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {yearsOptions.map((opt) => {
                    const isSelected = yearsInOperation === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setYearsInOperation(opt.id)}
                        className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-150 active:scale-[0.98] ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-sm"
                            : "border-slate-200 bg-card hover:border-slate-300 hover:shadow-xs"
                        }`}
                      >
                        <div>
                          <span className="font-[family-name:var(--font-sinhala)] text-lg font-bold text-foreground block leading-tight">
                            {isSi ? opt.labelSi : opt.labelEn}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5 block">
                            {isSi ? opt.subSi : opt.subEn}
                          </span>
                        </div>
                        <div
                          className={`flex size-6 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Continue to Step 4 Button */}
                <button
                  type="submit"
                  className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-5 text-white transition-all hover:bg-[#020333]/90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground shadow-sm font-bold"
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
            </div>
          )}

          {/* ================= STEP 4: Workforce / Team Size (Form 4) ================= */}
          {step === 4 && (
            <div className="rounded-[2.2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200/80">
              {/* Back to Step 3 & Step indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep hover:underline"
                >
                  <span>‹</span>
                  <span>{isSi ? "පෙර පියවර" : "Back to Step 3"}</span>
                </button>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {isSi ? "පියවර 4 / 5" : "Step 4 of 5"}
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <div className="flex items-center gap-2">
                  <Users className="size-6 text-primary" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {isSi ? "සේවක සංඛ්‍යාව" : "Workforce / Team Size"}
                  </h1>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSi
                    ? "ඔබේ ආයතනයේ සේවක සංඛ්‍යාව තෝරන්න"
                    : "Select the number of employees in your factory"}
                </p>
              </div>

              {/* Step 4 Form */}
              <form className="mt-6 flex flex-col gap-6" onSubmit={handleStep4Submit}>
                {/* Selectable Cards for Workforce */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {workforceOptions.map((opt) => {
                    const isSelected = workforce === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setWorkforce(opt.id)}
                        className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-150 active:scale-[0.98] ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-sm"
                            : "border-slate-200 bg-card hover:border-slate-300 hover:shadow-xs"
                        }`}
                      >
                        <div>
                          <span className="font-[family-name:var(--font-sinhala)] text-lg font-bold text-foreground block leading-tight">
                            {isSi ? opt.labelSi : opt.labelEn}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5 block">
                            {isSi ? opt.subSi : opt.subEn}
                          </span>
                        </div>
                        <div
                          className={`flex size-6 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Continue to Step 5 Button */}
                <button
                  type="submit"
                  className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-5 text-white transition-all hover:bg-[#020333]/90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground shadow-sm font-bold"
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
            </div>
          )}

          {/* ================= STEP 5: Minimum Order Quantity (Form 5) ================= */}
          {step === 5 && (
            <div className="rounded-[2.2rem] bg-white p-7 sm:p-9 shadow-sm ring-1 ring-slate-200/80">
              {/* Back to Step 4 & Step indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep hover:underline"
                >
                  <span>‹</span>
                  <span>{isSi ? "පෙර පියවර" : "Back to Step 4"}</span>
                </button>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {isSi ? "පියවර 5 / 5" : "Step 5 of 5"}
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5">
                <div className="flex items-center gap-2">
                  <Package className="size-6 text-primary" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {isSi ? "අවම ඇණවුම් ප්‍රමාණය" : "Minimum Order Quantity"}
                  </h1>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSi
                    ? "ඔබ ලබාගන්නා අවම ඇණවුම් ප්‍රමාණය (MOQ) තෝරන්න"
                    : "Select your Minimum Order Quantity (MOQ)"}
                </p>
              </div>

              {/* Step 5 Form */}
              <form className="mt-6 flex flex-col gap-6" onSubmit={handleStep5Submit}>
                {/* Selectable Cards for MOQ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {moqOptions.map((opt) => {
                    const isSelected = moq === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setMoq(opt.id)}
                        className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-150 active:scale-[0.98] ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-sm"
                            : "border-slate-200 bg-card hover:border-slate-300 hover:shadow-xs"
                        }`}
                      >
                        <div>
                          <span className="font-[family-name:var(--font-sinhala)] text-lg font-bold text-foreground block leading-tight">
                            {isSi ? opt.labelSi : opt.labelEn}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5 block">
                            {isSi ? opt.subSi : opt.subEn}
                          </span>
                        </div>
                        <div
                          className={`flex size-6 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Final Complete Registration Button */}
                <button
                  type="submit"
                  className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#020333] px-5 text-white transition-all hover:bg-[#020333]/90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground shadow-sm font-bold"
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

          {/* ================= STEP 6: Success Confirmation ================= */}
          {step === 6 && (
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

                <div className="grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-2">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {isSi ? "ආයතනයේ වයස" : "Years in Operation"}
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {yearsOptions.find((y) => y.id === yearsInOperation)?.[isSi ? "labelSi" : "labelEn"]}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {isSi ? "සේවක සංඛ්‍යාව" : "Workforce"}
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {workforceOptions.find((w) => w.id === workforce)?.[isSi ? "labelSi" : "labelEn"]}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {isSi ? "අවම ඇණවුම" : "Minimum Order (MOQ)"}
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {moqOptions.find((m) => m.id === moq)?.[isSi ? "labelSi" : "labelEn"]}
                  </p>
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
                    setYearsInOperation("1-5");
                    setWorkforce("1-10");
                    setMoq("51-200");
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

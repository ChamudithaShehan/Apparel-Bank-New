import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "FactoryPass — Create Account | නව ගිණුමක් සාදන්න" },
      {
        name: "description",
        content: "Create your FactoryPass account in one simple step.",
      },
    ],
  }),
  component: SignUpPage,
});

const inputClass =
  "w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-lg font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20";

function SignUpPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-card p-7 sm:p-9 ring-1 ring-border shadow-sm">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-deep hover:underline"
          >
            <span>‹</span>
            <span>Back</span>
            <span lang="si" className="font-[family-name:var(--font-sinhala)]">
              / ආපසු
            </span>
          </Link>

          {/* Heading */}
          <div className="mt-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Create Account
              <span className="block font-[family-name:var(--font-sinhala)] text-xl sm:text-2xl font-semibold text-primary-deep mt-0.5">
                නව ගිණුමක් සාදන්න
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fill in the four fields below to register
            </p>
            <p
              lang="si"
              className="font-[family-name:var(--font-sinhala)] text-sm text-muted-foreground"
            >
              ලියාපදිංචි වීමට පහත විස්තර 4 ඇතුළත් කරන්න
            </p>
          </div>

          {/* Form */}
          <form className="mt-6 flex flex-col gap-4.5" onSubmit={(e) => e.preventDefault()}>
            {/* Field 1: Business Name */}
            <div>
              <label htmlFor="f-name" className="mb-1.5 block cursor-pointer">
                <span className="font-display text-base font-bold text-foreground">
                  Business Name
                </span>
                <span
                  lang="si"
                  className="ml-2 font-[family-name:var(--font-sinhala)] text-sm font-semibold text-primary-deep"
                >
                  / ව්‍යාපාරයේ නම
                </span>
              </label>
              <input
                id="f-name"
                type="text"
                placeholder="e.g. Sunbeam Textiles"
                autoComplete="organization"
                className={inputClass}
              />
            </div>

            {/* Field 2: Contact Person */}
            <div>
              <label htmlFor="f-person" className="mb-1.5 block cursor-pointer">
                <span className="font-display text-base font-bold text-foreground">
                  User Name /
                </span>
                <span
                  lang="si"
                  className="ml-2 font-[family-name:var(--font-sinhala)] text-sm font-semibold text-primary-deep"
                >
                  පරිශීලක නාමය
                </span>
              </label>
              <input
                id="f-person"
                type="text"
                placeholder="e.g. K. Perera"
                autoComplete="name"
                className={inputClass}
              />
            </div>

            {/* Field 3: Mobile Number */}
            <div>
              <label htmlFor="f-phone" className="mb-1.5 block cursor-pointer">
                <span className="font-display text-base font-bold text-foreground">
                  Mobile Number
                </span>
                <span
                  lang="si"
                  className="ml-2 font-[family-name:var(--font-sinhala)] text-sm font-semibold text-primary-deep"
                >
                  / ජංගම දුරකථන අංකය
                </span>
              </label>
              <input
                id="f-phone"
                type="tel"
                inputMode="tel"
                placeholder="077 123 4567"
                autoComplete="tel"
                className={inputClass}
              />
            </div>

            {/* Field 4: Password */}
            <div>
              <label htmlFor="f-pass" className="mb-1.5 block cursor-pointer">
                <span className="font-display text-base font-bold text-foreground">
                  Password
                </span>
                <span
                  lang="si"
                  className="ml-2 font-[family-name:var(--font-sinhala)] text-sm font-semibold text-primary-deep"
                >
                  / මුරපදය
                </span>
              </label>
              <input
                id="f-pass"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 flex h-13 sm:h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-cream transition-all hover:bg-primary-deep active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <span className="font-display text-lg font-bold">Continue</span>
              <span
                lang="si"
                className="font-[family-name:var(--font-sinhala)] text-base font-semibold opacity-95"
              >
                (ඉදිරියට)
              </span>
              <ArrowRight className="size-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already registered?{" "}
              <Link
                to="/signin"
                className="font-bold text-primary-deep hover:underline"
              >
                Sign in
              </Link>
            </p>
            <p
              lang="si"
              className="mt-0.5 font-[family-name:var(--font-sinhala)] text-sm text-muted-foreground"
            >
              දැනටමත් ලියාපදිංචි වී තිබේද?{" "}
              <Link
                to="/signin"
                className="font-bold text-primary-deep hover:underline"
              >
                ඇතුල් වන්න
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

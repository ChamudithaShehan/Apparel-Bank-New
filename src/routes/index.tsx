import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FactoryPass — Welcome | සාදරයෙන් පිළිගනිමු" },
      {
        name: "description",
        content: "Sign in to FactoryPass or create a new account.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Simple Card */}
        <div className="rounded-3xl bg-card p-7 sm:p-9 ring-1 ring-border shadow-sm">
          {/* Logo / Brand */}
          <div className="flex items-center justify-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary text-cream font-bold text-xl">
              FP
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              FactoryPass
            </span>
          </div>

          {/* Heading */}
          <div className="mt-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome
              <span className="block font-[family-name:var(--font-sinhala)] text-xl sm:text-2xl font-semibold text-primary-deep mt-1">
                සාදරයෙන් පිළිගනිමු
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Sign in or create an account to get started.
            </p>
            <p
              lang="si"
              className="font-[family-name:var(--font-sinhala)] text-sm sm:text-base text-muted-foreground"
            >
              ඉදිරියට යාමට පහතින් තෝරන්න.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col gap-3.5">
            <Link
              to="/signin"
              className="flex min-h-[58px] flex-col items-center justify-center rounded-2xl bg-foreground px-5 py-2.5 text-cream transition-colors hover:bg-foreground/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="font-display text-lg font-bold">Sign In</span>
              <span
                lang="si"
                className="font-[family-name:var(--font-sinhala)] text-sm font-semibold opacity-90"
              >
                ඇතුල් වන්න
              </span>
            </Link>

            <Link
              to="/signup"
              className="flex min-h-[58px] flex-col items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-cream transition-colors hover:bg-primary-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <span className="font-display text-lg font-bold">Create Account</span>
              <span
                lang="si"
                className="font-[family-name:var(--font-sinhala)] text-sm font-semibold opacity-90"
              >
                නව ගිණුමක් සාදන්න
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useLanguage, type LanguageMode } from "../lib/language-context";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  const options: { mode: LanguageMode; label: string; sub?: string }[] = [
    { mode: "si", label: "සිංහල" },
    { mode: "en", label: "English" },
    { mode: "both", label: "දෙකම", sub: "Both" },
  ];

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl bg-muted/60 p-1.5 ring-2 ring-border/40 ${className}`}
      role="group"
      aria-label="Language selection / භාෂාව තෝරන්න"
    >
      {options.map((opt) => {
        const isActive = lang === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            onClick={() => setLang(opt.mode)}
            className={`flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-sm font-bold transition-all duration-150 ${
              isActive
                ? "bg-primary text-cream shadow-sm"
                : "text-foreground/75 hover:bg-cream/70 hover:text-foreground"
            }`}
          >
            <span className={opt.mode === "si" || opt.mode === "both" ? "font-[family-name:var(--font-sinhala)]" : ""}>
              {opt.label}
            </span>
            {opt.sub && (
              <span className={`text-xs opacity-80 ${isActive ? "text-cream" : "text-muted-foreground"}`}>
                ({opt.sub})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

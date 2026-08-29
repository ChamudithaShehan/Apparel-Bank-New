import type { Metadata } from "next";
import { Quicksand, Nunito, Noto_Sans_Sinhala } from "next/font/google";
import "../styles.css";
import { LanguageProvider } from "@/lib/language-context";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apparel Bank — සැපයුම්කරු ලියාපදිංචිය | Supplier Registration",
  description:
    "A simple, large-type sign-in and supplier registration form for garment factories. Built for simplicity and accessibility.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="si"
      suppressHydrationWarning
      className={`${quicksand.variable} ${nunito.variable} ${notoSansSinhala.variable}`}
    >
      <body
        suppressHydrationWarning
        className="antialiased bg-[#F3F6FA] text-foreground min-h-screen"
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "../styles.css";
import { LanguageProvider } from "@/lib/language-context";

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
    <html lang="si" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@500;600;700;800;900&family=Nunito:wght@600;700;800;900&family=Quicksand:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased bg-[#F3F6FA] text-foreground min-h-screen font-body"
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

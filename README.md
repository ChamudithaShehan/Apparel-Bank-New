# Apparel Bank — Supplier Registration

A bilingual (Sinhala / English) multi-step supplier registration web application designed with high accessibility, simplicity, and clear visual cues for garment factory owners and suppliers.

---

## ✨ Features

- **🌐 Instant Bilingual Toggle**: Seamlessly switch between Sinhala (`සිං`) and English (`EN`) at any point. Language preference is persisted across pages and reloads.
- **👴 Senior & User-Friendly Design**: High-contrast elements, large typography (`Quicksand`, `Nunito`, `Noto Sans Sinhala`), large tap-friendly buttons, and visual cards.
- **📝 6-Step Registration Wizard**:
  1. **Step 1 — Contact / Account Information**: User Name, Primary Mobile Number, and Password.
  2. **Step 2 — Business / Factory Name**: Dedicated step for business name.
  3. **Step 3 — Garment Categories**: Visual cards with real photos to select manufactured garment types (T-Shirts, Shirts, Trousers, Dresses).
  4. **Step 4 — Years in Operation**: Single-tap options for business experience (<1, 1-5, 5-10, 10+ years).
  5. **Step 5 — Workforce / Team Size**: Selectable team tiers (1-10, 11-50, 51-200, 200+ employees).
  6. **Step 6 — Minimum Order Quantity (MOQ)**: Order thresholds (1-50, 51-200, 201-500, 500+ pieces).
  7. **Confirmation Summary**: Consolidated review card with quick options to register another supplier or return to home.
- **🔐 Simple Sign-In**: Clean sign-in page with localized helpers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: `next/font/google` (`Noto Sans Sinhala`, `Quicksand`, `Nunito`)

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.ico
│   └── images/categories/     # Real category photo assets
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & LanguageProvider
│   │   ├── page.tsx           # Home / Welcome page
│   │   ├── signin/
│   │   │   └── page.tsx       # Sign In page
│   │   └── signup/
│   │       └── page.tsx       # 5-step Supplier Registration wizard
│   ├── components/
│   │   ├── AppHeader.tsx      # Global navy header with branding & language toggle
│   │   ├── LanguageSelector.tsx # Pill-based language switch component
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── language-context.tsx # Global language state & localStorage persistence
│   │   └── utils.ts           # Class merging utilities (clsx / tailwind-merge)
│   └── styles.css             # Tailwind CSS v4 design tokens & theme
├── next.config.ts             # Next.js configuration
├── postcss.config.mjs         # PostCSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.17+ or v20+) installed.

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd simple-sign-up-main
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run the development server:
   ```sh
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To build and run the optimized production version:

```sh
npm run build
npm run start
```

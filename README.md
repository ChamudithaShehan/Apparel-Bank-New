# Apparel Bank — B2B Garment Manufacturing Marketplace & Supplier Ecosystem

A modern, bilingual (**Sinhala / English**) end-to-end B2B apparel marketplace and supplier governance platform built for Sri Lanka's garment industry. Apparel Bank bridges local apparel manufacturers, SME factories, and tailors with wholesale buyers, retailers, and export brands.

---

## 🌟 Ecosystem Overview

```
                                  ┌────────────────────────────────┐
                                  │   Public Homepage & Portal     │
                                  │             (/)                │
                                  └───────────────┬────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 │                                                                 │
                 ▼                                                                 ▼
┌─────────────────────────────────┐                             ┌─────────────────────────────────┐
│     Supplier Registration       │                             │    B2B Service Marketplace      │
│          (/signup)              │                             │        (/marketplace)           │
│  • 6-Step Accessible Wizard     │                             │  • Auto-Generated Fiverr Gigs   │
│  • Sinhala / English Toggle     │                             │  • Category & Search Filters    │
│  • Visual Garment Categories    │                             │  • 3-Tier Pricing Packages      │
└────────────────┬────────────────┘                             └────────────────┬────────────────┘
                 │                                                               │
                 ▼                                                               ▼
┌─────────────────────────────────┐                             ┌─────────────────────────────────┐
│     Supplier Dashboard          │                             │     Public Gig Dossier          │
│        (/dashboard)             │◄────────────────────────────┤       (/gig/[id])               │
│  • Mobile Responsive Side Panel │                             │  • Technical Specifications     │
│  • 100% Editable Gig & Catalog  │                             │  • Lead Times & MOQs            │
│  • 3-Step Profile Completion    │                             │  • Direct RFQ & WhatsApp Inquiry│
│  • Rejection Feedback Display   │                             └─────────────────────────────────┘
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       Enterprise Admin Governance Portal                        │
│                                  (/admin)                                       │
│  • Executive KPI Overview & Operational Intelligence                            │
│  • Supplier Directory with 1-Click WhatsApp & Phone Calling                     │
│  • Structured Rejection Modal with Auto WhatsApp Reason Delivery                │
│  • Wholesale Buyer RFQ & Leads Pipeline (Deal Value Tracker)                    │
│  • Dedicated Audit Logs & Administrative History with Live Search & CSV Export  │
│  • Factory Capacity Scale & Minimum Order Quantity (MOQ) Analytics             │
│  • Custom Role-Based Access Control (RBAC) & Team Invitations                   │
│  • Support Impersonation ("View Dashboard as Supplier")                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features & Modules

### 1. 🌐 Public Marketplace & Fiverr-Style Manufacturing Gigs ([`/marketplace`](file:///c:/Users/MSI/Downloads/simple-sign-up-main/simple-sign-up-main/src/app/marketplace/page.tsx) & `/gig/[id]`)
- **Auto-Generated Gigs**: Registration data automatically transforms into a professional manufacturing Gig with custom titles, turnaround times, and pricing.
- **3-Tier Pricing Packages**: Prototype / Sample Batches, Boutique Production Runs, and Commercial Export Orders.
- **Wholesale Inquiry Engine**: Buyers can request custom quotations or connect with factories over WhatsApp in 1 click.
- **Category Browsing**: Filter by T-Shirts & Polos, Formal & Casual Shirts, Trousers & Pants, and Dresses.

### 2. 📝 Senior & User-Friendly 6-Step Registration ([`/signup`](file:///c:/Users/MSI/Downloads/simple-sign-up-main/simple-sign-up-main/src/app/signup/page.tsx))
- **Instant Bilingual Toggle**: Switch between Sinhala (`සිං`) and English (`EN`) at any point with persistent state.
- **Accessible Design**: High-contrast elements, large typography (`Quicksand`, `Nunito`, `Noto Sans Sinhala`), large touch targets, and visual garment category selector cards.
- **Step-by-step Flow**: Contact info, business name, garment capabilities, years in operation, factory workforce, and MOQ thresholds.

### 3. 🏠 Supplier User Dashboard ([`/dashboard`](file:///c:/Users/MSI/Downloads/simple-sign-up-main/simple-sign-up-main/src/app/dashboard/page.tsx))
- **Navigation Side Panel**: Easily switch between Overview, Live Gig, Garment Samples, Factory Details, Buyer Inquiries, and Support.
- **Mobile Responsive Drawer & Bottom Tab Bar**: Optimized for Android and iOS mobile browsers with safe area padding.
- **100% Editable Gig Attributes**: Update title, logo, cover banner, description, products, MOQ, and contact info at any time.
- **Profile Completion Tracker**: 3-step onboarding wizard (Business & Location, Operations & Logistics, Factory Branding) to unlock the **100% Verified Supplier** badge.
- **Actionable Rejection Feedback**: If rejected, suppliers see the exact feedback note left by the admin with direct links to edit registration or chat with support.

### 4. 🛡️ Enterprise Admin Governance Portal ([`/admin`](file:///c:/Users/MSI/Downloads/simple-sign-up-main/simple-sign-up-main/src/app/admin/page.tsx))
- **Executive KPI Radar**: Live metrics tracking Total Registered Suppliers, Pending Verifications, Approved Factories, and Buyer RFQ volume.
- **Supplier Audit & WhatsApp Contact**:
  - Direct 1-click **WhatsApp Chat (`MessageCircle`)** and **Phone Call (`Phone`)** buttons.
  - **Structured Rejection Modal**: Pre-set reasons (e.g. *Invalid BRN*, *Factory site unverified*, *MOQ mismatch*) + custom feedback textarea.
  - **"Reject & Send Reason on WhatsApp 💬"**: Automatically logs rejection reason and delivers a formatted explanation to the supplier's WhatsApp.
  - **"Approve & WhatsApp Welcome 🎉"**: Delivers onboarding instructions to complete factory profile.
- **Wholesale Buyer RFQ & Leads Oversight**:
  - Track incoming bulk garment requests with requested quantities and estimated contract values (e.g. *LKR 1,250,000*).
  - Pipeline stages: `New Lead` ➔ `Sample Requested` ➔ `In Discussion` ➔ `Deal Won` ➔ `Closed`.
- **Dedicated Audit Logs & Administrative History**:
  - Immutable chronological feed of all admin actions (approvals, rejections, role policy edits, impersonations).
  - Live keyword search, action type filtering, admin filter, and CSV spreadsheet export.
- **Capacity Intelligence & Analytics**: Visual charts for factory workforce scales (Micro, Small, Medium, Enterprise) and MOQ distribution.
- **Role-Based Access Control (RBAC)**: Create custom security roles, assign granular permissions, and invite administrative team members.
- **One-Click Support Impersonation**: Open the supplier's exact dashboard view in 1 click to assist over telephone support (`011 234 5678`).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router with Turbopack)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: `next/font/google` (`Noto Sans Sinhala`, `Quicksand`, `Nunito`)
- **State & Storage**: Client-side resilient LocalStorage with automatic fallback and demo sync

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts & LanguageProvider
│   ├── page.tsx                # Homepage / Portal landing
│   ├── admin/
│   │   └── page.tsx            # Enterprise Admin Governance Portal
│   ├── dashboard/
│   │   └── page.tsx            # Supplier User Dashboard
│   ├── marketplace/
│   │   └── page.tsx            # B2B Garment Services Marketplace
│   ├── gig/[id]/
│   │   └── page.tsx            # Individual Factory Gig Dossier
│   ├── signin/
│   │   └── page.tsx            # Supplier & Admin Sign-In
│   └── signup/
│       └── page.tsx            # 6-Step Accessible Registration Wizard
├── components/
│   ├── AppHeader.tsx           # Global branded header with language toggle
│   ├── LanguageSelector.tsx    # Bilingual pill toggle (Sinhala / English)
│   ├── audit-logs/
│   │   └── AuditLogViewer.tsx  # Modular Audit Log viewer with search & export
│   └── ui/                     # UI primitives
├── lib/
│   ├── audit-logs/             # Dedicated Audit Logs & Administrative History
│   │   ├── types.ts            # Audit log types & action categories
│   │   ├── store.ts            # Audit persistence, search, & CSV exporter
│   │   └── index.ts            # Unified audit module exports
│   ├── admin-store.ts          # Roles, RBAC permissions, Admin users, & Buyer RFQs
│   ├── gigs.ts                 # Fiverr-style Gig generation & synchronization
│   ├── language-context.tsx    # Global language context & persistence
│   ├── registrations.ts        # Supplier registration store & profile models
│   └── utils.ts                # Class merging utilities (clsx / tailwind-merge)
└── styles.css                  # Tailwind CSS v4 design tokens & themes
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.17+ or v20+) and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChamudithaShehan/Apparel-Bank-New.git
   cd simple-sign-up-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Routes Reference

| Route | Description |
| :--- | :--- |
| **`/`** | Homepage with quick access to Supplier Portal, Marketplace, and Sign In |
| **`/signup`** | 6-step bilingual factory registration wizard |
| **`/signin`** | Quick login for registered suppliers |
| **`/dashboard`** | Supplier control panel (Gig management, samples catalog, profile completion) |
| **`/marketplace`** | Public B2B apparel manufacturing marketplace (Fiverr-style Gigs) |
| **`/gig/[id]`** | Dedicated factory service Gig page with packages and RFQ submission |
| **`/admin`** | Enterprise Admin Governance Portal (Reviews, WhatsApp rejection/approval, RFQs, Audit logs, RBAC) |

---

## 📦 Production Build

To build and validate the optimized production bundle:

```bash
npm run build
npm run start
```

---

## 📄 License

Proprietary — Developed for **Apparel Bank Sri Lanka**. All rights reserved.

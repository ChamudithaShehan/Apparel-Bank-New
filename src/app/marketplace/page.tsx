"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Star,
  ShieldCheck,
  Clock,
  Package,
  Users,
  Check,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
  Building2,
  MapPin,
  Truck,
  MessageSquare,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLanguage } from "@/lib/language-context";
import { getAllGigs, SupplierGig, getGigById } from "@/lib/gigs";

const categoryFilters = [
  { id: "all", labelEn: "All Manufacturing Gigs", labelSi: "සියලු සේවාවන්" },
  { id: "tshirt", labelEn: "T-Shirts & Polos", labelSi: "ටී-ෂර්ට් සහ පෝලෝ" },
  { id: "shirt", labelEn: "Formal & Casual Shirts", labelSi: "කමිස නිෂ්පාදනය" },
  { id: "trousers", labelEn: "Trousers & Pants", labelSi: "කලිසම් නිෂ්පාදනය" },
  { id: "dresses", labelEn: "Dresses & Frocks", labelSi: "ගවුම් සහ විලාසිතා" },
];

export default function MarketplaceGigsPage() {
  const { isSi } = useLanguage();
  const [gigs, setGigs] = useState<SupplierGig[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGig, setSelectedGig] = useState<SupplierGig | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("standard");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);

  useEffect(() => {
    setGigs(getAllGigs());
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    const matchCategory = activeCategory === "all" ? true : gig.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      gig.title.toLowerCase().includes(q) ||
      gig.seller.businessName.toLowerCase().includes(q) ||
      gig.seller.name.toLowerCase().includes(q) ||
      gig.supplierId.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSent(true);
    setTimeout(() => {
      setQuoteSent(false);
      setContactModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <AppHeader />

      {/* Hero Header */}
      <section className="bg-[#020333] text-white py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="mx-auto max-w-6xl relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-emerald-400 border border-white/10 backdrop-blur-xs">
            <Sparkles className="size-4" />
            <span>
              {isSi
                ? "ලියාපදිංචි වූ සැපයුම්කරුවන්ගේ සේවා වෙළඳපොළ"
                : "Apparel Bank Verified Supplier Marketplace"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            {isSi ? (
              <>
                ඇඳුම් නිෂ්පාදන සේවාවන් සොයාගන්න{" "}
                <span className="text-emerald-400">(Fiverr Style Gigs)</span>
              </>
            ) : (
              <>
                Find & Hire Verified Garment Factories{" "}
                <span className="text-emerald-400">on Demand</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            {isSi
              ? "සැපයුම්කරුවන් ලියාපදිංචි වූ වහාම ස්වයංක්‍රීයව නිර්මාණය වන සේවා දැන්වීම් (Gigs). MOQ, මිල ගණන් සහ නිෂ්පාදන ධාරිතාව සංසන්දනය කරන්න."
              : "Auto-generated manufacturing service Gigs from registered apparel suppliers. Compare Minimum Order Quantities, pricing, and factory lead times."}
          </p>

          {/* Search Input */}
          <div className="max-w-xl mx-auto pt-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isSi
                    ? "ටී-ෂර්ට්, කමිස, කර්මාන්තශාලා හෝ ID සොයන්න..."
                    : "Search by garment type, factory name, or ID..."
                }
                className="w-full rounded-2xl border border-white/20 bg-white/10 pl-12 pr-4 py-3.5 text-sm font-semibold text-white placeholder:text-slate-400 outline-none backdrop-blur-md focus:bg-white focus:text-slate-900 transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Category Filters Bar */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat.id
                    ? "bg-[#020333] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {isSi ? cat.labelSi : cat.labelEn}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 whitespace-nowrap">
            <span>{filteredGigs.length} Gigs Available</span>
          </div>
        </div>

        {/* Gigs Grid (Fiverr Style Responsive Cards) */}
        {filteredGigs.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
            <Package className="size-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No Manufacturing Gigs Found</h3>
            <p className="text-sm text-slate-400">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGigs.map((gig) => (
              <Link
                key={gig.id}
                href={`/gig/${gig.supplierId}`}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.99]"
              >
                <div>
                  {/* Gig Cover Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={gig.coverImage}
                      alt={gig.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Verified / Status Badge */}
                    <div className="absolute top-3 left-3">
                      {gig.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 shadow-sm">
                          <ShieldCheck className="size-3.5 stroke-[2.5]" />
                          <span>Verified Factory</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-xs text-white text-[11px] font-black px-2.5 py-1 shadow-sm">
                          <Clock className="size-3.5 stroke-[2.5]" />
                          <span>Pending Verification</span>
                        </span>
                      )}
                    </div>

                    {/* Reference ID Pill */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                      {gig.supplierId}
                    </div>
                  </div>

                  {/* Gig Content */}
                  <div className="p-4 space-y-3">
                    {/* Seller Header */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <Image
                          src={gig.seller.avatar}
                          alt={gig.seller.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {gig.seller.businessName}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400">
                          {gig.seller.level}
                        </p>
                      </div>
                    </div>

                    {/* Gig Title */}
                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {gig.title}
                    </h3>

                    {/* Star Rating & Reviews */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="flex items-center text-amber-500 font-black">
                        <Star className="size-3.5 fill-amber-500 mr-0.5" />
                        <span>{gig.seller.rating}</span>
                      </div>
                      <span className="text-slate-400 font-semibold">
                        ({gig.seller.reviewCount})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {gig.turnaroundTime}
                      </span>
                    </div>

                    {/* Capability Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5">
                        MOQ: {gig.moq}
                      </span>
                      <span className="rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5">
                        {gig.workforce}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gig Card Footer: Starting Price */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      STARTING AT
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {gig.startingPrice} <span className="text-xs text-slate-500 font-normal">/ unit</span>
                    </span>
                  </div>

                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    <span>View Gig</span>
                    <ChevronRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* FIVERR GIG DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                  <Image
                    src={selectedGig.seller.avatar}
                    alt={selectedGig.seller.businessName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {selectedGig.supplierId}
                    </span>
                    <span className="text-xs font-bold text-slate-400">•</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {selectedGig.seller.level}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedGig.seller.businessName}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGig(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Gig Title */}
            <div className="mt-4">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {selectedGig.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-2">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="size-4 fill-amber-500 mr-1" />
                  <span>{selectedGig.seller.rating}</span>
                </div>
                <span>({selectedGig.seller.reviewCount} Reviews)</span>
                <span>•</span>
                <span>Contact: {selectedGig.seller.name}</span>
                <span>•</span>
                <span>Response Time: {selectedGig.seller.responseTime}</span>
              </div>
            </div>

            {/* Gallery / Cover Image */}
            <div className="mt-4 relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <Image
                src={selectedGig.coverImage}
                alt={selectedGig.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Package Tabs (Fiverr Style Basic / Standard / Premium) */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2">
                {(["basic", "standard", "premium"] as const).map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide rounded-xl transition-all cursor-pointer ${selectedPackage === pkg
                        ? "bg-[#020333] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {pkg} Package
                  </button>
                ))}
              </div>

              {/* Package Details Box */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900">
                    {selectedGig.packages[selectedPackage].name}
                  </h4>
                  <span className="text-lg font-black text-emerald-700">
                    {selectedGig.packages[selectedPackage].pricePerUnit} <span className="text-xs text-slate-500 font-normal">/ pc</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {selectedGig.packages[selectedPackage].description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-blue-600" />
                    <span>Turnaround: {selectedGig.packages[selectedPackage].deliveryDays}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="size-4 text-indigo-600" />
                    <span>Batch Size: {selectedGig.packages[selectedPackage].moq}</span>
                  </div>
                </div>

                {/* Features Included */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1.5">
                    What&apos;s Included in this Package:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedGig.packages[selectedPackage].features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <Check className="size-3.5 text-emerald-600 stroke-[3]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Factory Overview & Capabilities */}
            <div className="mt-5 space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">Factory Overview</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {selectedGig.overview}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="flex h-12 w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl bg-[#020333] hover:bg-[#020333]/90 font-bold text-white shadow-sm cursor-pointer"
              >
                <MessageSquare className="size-4.5" />
                <span>Contact Manufacturer / Request Quote</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGig(null)}
                className="flex h-12 w-full sm:w-auto items-center justify-center rounded-2xl border border-slate-300 px-6 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIRECT INQUIRY / QUOTE MODAL */}
      {/* ========================================================================= */}
      {contactModalOpen && selectedGig && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Inquire with {selectedGig.seller.businessName}
                </h3>
                <p className="text-xs text-slate-400">Direct factory order inquiry</p>
              </div>
              <button
                onClick={() => setContactModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            {quoteSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Inquiry Dispatched!</h4>
                <p className="text-xs text-slate-500">
                  {selectedGig.seller.businessName} will respond to your contact details within {selectedGig.seller.responseTime}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Your Name / Clothing Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Apparel Colombo"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Contact Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Target Order Quantity & Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need 200 custom polo t-shirts with embroidered left chest logo..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#020333] hover:bg-[#020333]/90 py-3 text-sm font-bold text-white shadow-sm cursor-pointer"
                  >
                    Send In-Direct Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

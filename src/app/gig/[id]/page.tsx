"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Edit,
  Package,
  Clock,
  Briefcase,
  Users,
  Scissors,
  ShieldCheck,
  Building2,
  Camera,
  MessageCircle,
  Send,
  CheckCircle2,
  X,
  Layers,
  MapPin,
  Tag,
  Truck,
  Globe,
  ExternalLink,
  Star,
  Phone,
  Check,
  HelpCircle,
  Share2,
  Sliders,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Award,
  Zap,
  FileText,
  BadgeCheck,
  Heart,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useLanguage } from "@/lib/language-context";
import {
  SupplierRegistration,
  getRegistrations,
  getCurrentUser,
} from "@/lib/registrations";
import { generateGigFromSupplier, SupplierGig, GigPackage } from "@/lib/gigs";

const yearsTextMap: Record<string, { en: string; si: string }> = {
  under1: { en: "< 1 Year Experience", si: "අවුරුදු 1ට අඩු පළපුරුද්ද" },
  "1-5": { en: "1 - 5 Years Experience", si: "අවුරුදු 1 - 5 ක පළපුරුද්ද" },
  "5-10": { en: "5 - 10 Years Experience", si: "අවුරුදු 5 - 10 ක පළපුරුද්ද" },
  "10plus": { en: "10+ Years Established", si: "වසර 10කට වැඩි ප්‍රවීණත්වය" },
};

const workforceTextMap: Record<string, { en: string; si: string }> = {
  "1-10": { en: "Solo / 1-10 Tailors", si: "සේවකයින් 1 - 10" },
  "11-50": { en: "11 - 50 Employees", si: "සේවකයින් 11 - 50" },
  "51-200": { en: "51 - 200 Employees", si: "සේවකයින් 51 - 200" },
  "200plus": { en: "200+ Factory Staff", si: "සේවකයින් 200ට වැඩි" },
};

const moqTextMap: Record<string, { en: string; si: string }> = {
  "1-50": { en: "1 - 50 Pcs (Low MOQ)", si: "කෑලි 1 - 50 (අවම ඇණවුම්)" },
  "51-200": { en: "51 - 200 Pcs (Medium)", si: "කෑලි 51 - 200" },
  "201-500": { en: "201 - 500 Pcs (Bulk)", si: "කෑලි 201 - 500" },
  "500plus": { en: "500+ Pcs (Enterprise)", si: "කෑලි 500ට වැඩි" },
};

const categorySpecialistMap: Record<string, { en: string; si: string }> = {
  tshirt_shirt: {
    en: "Custom T-Shirts, Shirts & Knitwear Manufacturing Specialist",
    si: "ටී-ෂර්ට්, කමිස සහ නිට්වෙයාර් නිෂ්පාදන විශේෂඥ",
  },
  denim_trousers: {
    en: "Export-Grade Denim, Trousers & Pants Production Specialist",
    si: "ඩෙනිම් සහ කලිසම් නිෂ්පාදන විශේෂඥ",
  },
  frock_skirt_blouse: {
    en: "High-Fashion Frocks, Skirts, Blouses & Woven Garment Specialist",
    si: "ගවුම්, සාය, බ්ලවුස් සහ විලාසිතා ඇඳුම් නිෂ්පාදන විශේෂඥ",
  },
  other: {
    en: "Custom Apparel, Sportswear, Uniforms & Textile Specialist",
    si: "විවිධ ඇඳුම් සහ නිල ඇඳුම් නිෂ්පාදන විශේෂඥ",
  },
  // Backward compatibility aliases
  tshirt: {
    en: "Custom T-Shirts, Shirts & Knitwear Manufacturing Specialist",
    si: "ටී-ෂර්ට්, කමිස සහ නිට්වෙයාර් නිෂ්පාදන විශේෂඥ",
  },
  shirt: {
    en: "Export-Grade Formal & Casual Shirts Production Specialist",
    si: "කමිස නිෂ්පාදන විශේෂඥ",
  },
  trousers: {
    en: "Tailored Trousers, Chinos & Workwear Specialist",
    si: "කලිසම් නිෂ්පාදන විශේෂඥ",
  },
  dresses: {
    en: "High-Fashion Dresses, Frocks & Woven Garment Specialist",
    si: "ගවුම් සහ විලාසිතා ඇඳුම් නිෂ්පාදන විශේෂඥ",
  },
};

const categoryLabels: Record<string, { en: string; si: string }> = {
  tshirt_shirt: { en: "T-Shirts & Shirts (ටී-ෂර්ට් සහ කමිස)", si: "ටී-ෂර්ට් සහ කමිස (T-Shirts & Shirts)" },
  denim_trousers: { en: "Denim & Trousers (ඩෙනිම් සහ කලිසම්)", si: "ඩෙනිම් සහ කලිසම් (Denim & Trousers)" },
  frock_skirt_blouse: { en: "Frock & Skirt & Blouse (ගවුම්, සාය සහ බ්ලවුස්)", si: "ගවුම්, සාය සහ බ්ලවුස් (Frock & Skirt & Blouse)" },
  other: { en: "Other (වෙනත්)", si: "වෙනත් (Other)" },
  // Backward compatibility aliases
  tshirt: { en: "T-Shirts & Shirts (ටී-ෂර්ට් සහ කමිස)", si: "ටී-ෂර්ට් සහ කමිස (T-Shirts & Shirts)" },
  shirt: { en: "Shirts (කමිස)", si: "කමිස (Shirts)" },
  trousers: { en: "Denim & Trousers (ඩෙනිම් සහ කලිසම්)", si: "ඩෙනිම් සහ කලිසම් (Denim & Trousers)" },
  dresses: { en: "Frock & Skirt & Blouse (ගවුම්, සාය සහ බ්ලවුස්)", si: "ගවුම්, සාය සහ බ්ලවුස් (Frock & Skirt & Blouse)" },
};

export default function SupplierGigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isSi } = useLanguage();
  const [supplier, setSupplier] = useState<SupplierRegistration | null>(null);
  const [gig, setGig] = useState<SupplierGig | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activePackageTab, setActivePackageTab] = useState<"basic" | "standard" | "premium">("standard");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Estimator State
  const [estQuantity, setEstQuantity] = useState(250);
  const [estFabric, setEstFabric] = useState("Standard Cotton (180 GSM)");

  useEffect(() => {
    setMounted(true);
    const id = resolvedParams.id;
    const all = getRegistrations();
    let found = all.find(
      (r) =>
        r.id.toLowerCase() === id.toLowerCase() ||
        `gig-${r.id.toLowerCase()}` === id.toLowerCase() ||
        r.id.replace("REG-", "").toLowerCase() === id.toLowerCase()
    );

    if (!found) {
      const cur = getCurrentUser();
      found = cur || all[0];
    }

    if (found) {
      setSupplier(found);
      setGig(generateGigFromSupplier(found));
    }
  }, [resolvedParams.id]);

  if (!mounted || !supplier || !gig) return null;

  const isVerified = supplier.status === "approved";
  const primaryCat = supplier.selectedCategories?.[0] || "tshirt";
  const specialistTitle =
    categorySpecialistMap[primaryCat]?.[isSi ? "si" : "en"] ||
    categorySpecialistMap[primaryCat]?.en ||
    "Apparel Manufacturing Specialist";

  const locationDistrict =
    supplier.profileDetails?.businessAndLocation?.district || "Colombo";
  const factoryAddress =
    supplier.profileDetails?.businessAndLocation?.address ||
    "Industrial Zone, Colombo, Sri Lanka";
  const brnNumber =
    supplier.profileDetails?.businessAndLocation?.brn || "PV-89210 (Verified)";

  const leadTimeText =
    supplier.profileDetails?.operationsAndLogistics?.leadTime || "14 - 21 Days";
  const fabricSourcingText =
    supplier.profileDetails?.operationsAndLogistics?.fabricSourcing ||
    "Full Fabric & Trims In-House Sourcing";
  const samplePolicyText =
    supplier.profileDetails?.operationsAndLogistics?.sampleAvailability ||
    "Free with Bulk Orders (3-5 Days)";
  const deliveryText =
    supplier.profileDetails?.operationsAndLogistics?.deliveryCapability ||
    "Islandwide Doorstep Delivery";
  const paymentTermsText =
    supplier.profileDetails?.operationsAndLogistics?.paymentTerms ||
    "30% Advance, Balance on Delivery";

  const customProducts = supplier.profileDetails?.products || [];
  
  // Combine custom products with preset images for gallery
  const galleryList = [
    {
      src: supplier.profileDetails?.factoryBranding?.coverUrl || gig.coverImage,
      title: `${supplier.businessName} Manufacturing Unit`,
      sub: "Primary Stitching & Production Line",
    },
    ...customProducts.map((p) => ({
      src: p.image,
      title: p.name,
      sub: `${p.material || "Quality Fabric"} • MOQ: ${p.moq} • ${p.pricePerUnit}`,
    })),
    {
      src: "/images/categories/shirt.jpg",
      title: "Finishing & Label Tagging",
      sub: "Export Quality Inspection",
    },
  ];

  const currentGalleryItem = galleryList[selectedPhotoIndex] || galleryList[0];

  const handleWhatsAppClick = () => {
    const cleanPhone = supplier.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${supplier.userName}, I found ${supplier.businessName} on Apparel Bank Marketplace (Gig: ${gig.id}). I am interested in manufacturing custom apparel with an estimated order of ${estQuantity} pieces. Could you please share a quotation?`
    );
    window.open(`https://wa.me/94${cleanPhone.replace(/^0/, "")}?text=${msg}`, "_blank");
  };

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
    }, 2400);
  };

  const currentPkg: GigPackage = gig.packages[activePackageTab];

  // Estimator calculation
  const baseRate = primaryCat === "tshirt" ? 850 : primaryCat === "shirt" ? 1350 : 1600;
  const unitCostEst = estQuantity >= 500 ? Math.round(baseRate * 0.85) : estQuantity >= 200 ? Math.round(baseRate * 0.92) : baseRate;
  const totalEstCost = unitCostEst * estQuantity;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <AppHeader />

      {/* Breadcrumbs & Floating Top Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-13 sm:top-14 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-500 overflow-hidden truncate">
            <Link href="/marketplace" className="hover:text-slate-900 transition-colors shrink-0">
              {isSi ? "වෙළඳපොළ" : "Marketplace"}
            </Link>
            <span>/</span>
            <span className="text-slate-400 shrink-0 hidden xs:inline">
              {categoryLabels[primaryCat]?.[isSi ? "si" : "en"] || primaryCat}
            </span>
            <span className="hidden xs:inline">/</span>
            <span className="text-slate-900 font-extrabold truncate">{supplier.businessName}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShareClick}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] sm:text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Share2 className="size-3 sm:size-3.5" />
              <span>{shareCopied ? (isSi ? "පිටපත් විය!" : "Copied!") : isSi ? "බෙදාගන්න" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-colors shadow-2xs cursor-pointer ${
                isSaved
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart className={`size-3 sm:size-3.5 ${isSaved ? "fill-rose-600 text-rose-600" : ""}`} />
              <span className="hidden sm:inline">{isSaved ? (isSi ? "සුරකින ලදි" : "Saved") : isSi ? "සුරකින්න" : "Save"}</span>
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#020333] hover:bg-[#020333]/90 text-white text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Edit className="size-3 sm:size-3.5" />
              <span>{isSi ? "පාලක පුවරුව" : "Supplier Portal"}</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-28 lg:pb-8">
        {/* ========================================================================= */}
        {/* 1. GIG HEADER HERO */}
        {/* ========================================================================= */}
        <div className="space-y-3 sm:space-y-4">
          {/* Supplier Badges & Verification Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black text-blue-900 shadow-2xs">
                <Building2 className="size-3 sm:size-3.5 text-blue-700" />
                <span>ID: {gig.id}</span>
              </span>

              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black text-emerald-700 shadow-2xs">
                  <ShieldCheck className="size-3.5 sm:size-4 text-emerald-600" />
                  <span>{isSi ? "සත්‍යාපිත කර්මාන්තශාලාව" : "Verified Apparel Factory"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black text-amber-800 shadow-2xs">
                  <Clock className="size-3.5 sm:size-4 text-amber-600" />
                  <span>{isSi ? "තහවුරු කිරීමේ අදියරේ" : "Verification in Progress"}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-slate-700">
                <MapPin className="size-3 text-slate-500" />
                <span>{locationDistrict}, Sri Lanka</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1 text-amber-500 font-black">
                <Star className="size-3.5 sm:size-4 fill-amber-500 text-amber-500" />
                <span className="text-slate-900 text-xs sm:text-sm">4.9</span>
                <span className="text-slate-400 font-semibold text-[11px] sm:text-xs">({gig.seller.reviewCount} reviews)</span>
              </div>
              <span>•</span>
              <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                ⚡ Responds in 1 Hr
              </span>
            </div>
          </div>

          {/* Gig Headline */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B122F] tracking-tight leading-snug">
            {gig.title}
          </h1>

          {/* Seller Snippet */}
          <div className="flex items-center gap-3 pt-0.5">
            <div className="relative size-10 sm:size-12 rounded-2xl overflow-hidden bg-slate-900 border-2 border-white shadow-sm shrink-0">
              <Image
                src={supplier.profileDetails?.factoryBranding?.logoUrl || gig.seller.avatar}
                alt={supplier.businessName}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-[#0B122F] truncate">{supplier.businessName}</span>
                <BadgeCheck className="size-4 text-blue-600 fill-blue-100 shrink-0" />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate">
                By {supplier.userName} (Factory Manager) • {yearsTextMap[supplier.yearsInOperation]?.[isSi ? "si" : "en"] || supplier.yearsInOperation}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN 2-COLUMN LAYOUT: Showcase Gallery + Sticky Packages Box */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: Media Showcase & Deep Details (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            {/* Gallery Big Screen Card */}
            <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white border border-slate-200/90 shadow-sm p-3.5 sm:p-5 space-y-3 sm:space-y-4">
              {/* Primary Large Image Frame */}
              <div
                onClick={() => setActivePhoto(currentGalleryItem.src)}
                className="relative h-60 sm:h-80 md:h-[440px] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 group cursor-zoom-in shadow-inner"
              >
                <Image
                  src={currentGalleryItem.src}
                  alt={currentGalleryItem.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-between p-3.5 sm:p-5 pointer-events-none">
                  <div className="flex justify-between items-center">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-extrabold text-white border border-white/20">
                      📷 {selectedPhotoIndex + 1} / {galleryList.length}
                    </span>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white">
                      Enlarge ⤢
                    </span>
                  </div>

                  <div className="text-white space-y-0.5">
                    <h3 className="text-base sm:text-xl font-black text-white">{currentGalleryItem.title}</h3>
                    <p className="text-[11px] sm:text-sm text-slate-300 font-medium">{currentGalleryItem.sub}</p>
                  </div>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 pt-0.5 snap-x">
                {galleryList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative size-16 sm:size-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer snap-start ${
                      selectedPhotoIndex === idx
                        ? "border-[#020333] ring-2 sm:ring-3 ring-blue-500/20 scale-102"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={item.src} alt={item.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Factory Capacity Chips Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
              <div className="rounded-2xl bg-white p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-0.5 sm:space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Min Order (MOQ)</span>
                <p className="text-base sm:text-lg font-black text-[#0B122F] truncate">{supplier.moq}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Flexible Tier</p>
              </div>

              <div className="rounded-2xl bg-white p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-0.5 sm:space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Lead Time</span>
                <p className="text-base sm:text-lg font-black text-[#0B122F] truncate">{leadTimeText.split(" ")[0]} Days</p>
                <p className="text-[10px] text-emerald-600 font-semibold truncate">Standard Turnaround</p>
              </div>

              <div className="rounded-2xl bg-white p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-0.5 sm:space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Workforce</span>
                <p className="text-base sm:text-lg font-black text-[#0B122F] truncate">
                  {workforceTextMap[supplier.workforce]?.[isSi ? "si" : "en"] || supplier.workforce}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold truncate">In-house Tailors</p>
              </div>

              <div className="rounded-2xl bg-white p-3 sm:p-4 border border-slate-200/90 shadow-xs space-y-0.5 sm:space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Starting Price</span>
                <p className="text-base sm:text-lg font-black text-emerald-700 truncate">{gig.startingPrice}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate">Per Finished Pc</p>
              </div>
            </div>

            {/* About This Manufacturing Gig */}
            <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-6">
              <div className="border-b border-slate-100 pb-3 sm:pb-4">
                <h3 className="text-lg sm:text-2xl font-black text-[#0B122F]">
                  {isSi ? "සේවා විස්තරය (About This Manufacturing Gig)" : "About This Manufacturing Gig"}
                </h3>
                <p className="text-xs sm:text-base text-slate-600 font-medium mt-2 leading-relaxed">
                  {gig.overview}
                </p>
              </div>

              {/* Scope & Inclusions List */}
              <div className="space-y-2.5 sm:space-y-3">
                <h4 className="text-sm sm:text-base font-black text-[#0B122F]">
                  {isSi ? "නිෂ්පාදන සේවා සහ පහසුකම්" : "What is Included with This Manufacturing Gig"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1">
                  {gig.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Garment Samples & Active Catalog */}
            <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-6">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-b border-slate-100 pb-3 sm:pb-4">
                <div>
                  <h3 className="text-lg sm:text-2xl font-black text-[#0B122F]">
                    {isSi ? "ඇඳුම් සාම්පල එකතුව" : "Garment Samples & Active Catalog"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {isSi
                      ? "මෙම කර්මාන්තශාලාවෙන් නිපදවන ප්‍රධාන ඇඳුම් සාම්පල සහ මිල ගණන්."
                      : "Directly manufactured clothing samples available for bulk ordering."}
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 text-blue-900 border border-blue-200 px-3 py-0.5 text-xs font-black self-start xs:self-auto">
                  {customProducts.length > 0 ? `${customProducts.length} Styles` : "Standard Catalog"}
                </span>
              </div>

              {customProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {customProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => setActivePhoto(prod.image)}
                      className="rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-2.5 sm:space-y-3 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative size-18 sm:size-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1 flex-1 overflow-hidden">
                          <span className="text-[9px] sm:text-[10px] font-black uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                            {categoryLabels[prod.category]?.[isSi ? "si" : "en"] || prod.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{prod.name}</h4>
                          <p className="text-xs font-extrabold text-emerald-700">{prod.pricePerUnit} / Pc</p>
                          <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500">MOQ: {prod.moq}</p>
                        </div>
                      </div>
                      {prod.description && (
                        <p className="text-xs text-slate-600 font-medium line-clamp-2 border-t border-slate-200/60 pt-2">
                          {prod.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { name: "Crewneck Heavyweight Cotton T-Shirt", price: "LKR 850 / Pc", moq: "50 Pcs", img: "/images/categories/tshirt.jpg" },
                    { name: "Tailored Organic Linen Casual Shirt", price: "LKR 1,450 / Pc", moq: "50 Pcs", img: "/images/categories/shirt.jpg" },
                  ].map((p, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 p-3 sm:p-4 flex items-center gap-3 bg-slate-50/60">
                      <div className="relative size-16 sm:size-18 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <Image src={p.img} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{p.name}</h4>
                        <p className="text-xs font-bold text-emerald-700">{p.price}</p>
                        <p className="text-[10px] sm:text-[11px] text-slate-500">MOQ: {p.moq}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Production Capabilities Matrix */}
            <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-2xl font-black text-[#0B122F]">
                {isSi ? "කාර්මික සහ මෙහෙයුම් පිරිවිතර" : "Production & Factory Specifications"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Fabric & Material Sourcing</span>
                  <p className="text-xs sm:text-sm font-black text-[#0B122F]">{fabricSourcingText}</p>
                  <p className="text-[11px] text-slate-500">Supports in-house knitting mills and cut & make</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Sample Development Policy</span>
                  <p className="text-xs sm:text-sm font-black text-[#0B122F]">{samplePolicyText}</p>
                  <p className="text-[11px] text-slate-500">Fast physical prototype turn-around in 3-5 days</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Delivery & Logistics</span>
                  <p className="text-xs sm:text-sm font-black text-[#0B122F]">{deliveryText}</p>
                  <p className="text-[11px] text-slate-500">Islandwide doorstep courier & freight support</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Accepted Payment Terms</span>
                  <p className="text-xs sm:text-sm font-black text-[#0B122F]">{paymentTermsText}</p>
                  <p className="text-[11px] text-slate-500">Milestone bank transfer / Apparel Bank verified</p>
                </div>
              </div>
            </div>

            {/* Interactive Order Cost Estimator */}
            <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-gradient-to-br from-[#020333] to-[#0A1852] text-white p-5 sm:p-8 shadow-xl space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-white/15 pb-3 sm:pb-4">
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-300 border border-amber-400/30">
                    <Sliders className="size-3" />
                    <span>Instant Price Estimator</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white">
                    {isSi ? "ඇණවුම් වියදම් ගණනය කිරීම" : "Estimate Your Order Cost"}
                  </h3>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-300">Live Simulation</span>
              </div>

              <div className="space-y-4">
                {/* Quantity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                    <span>Target Batch:</span>
                    <span className="text-amber-400 text-base sm:text-lg font-black">{estQuantity} Pieces</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={25}
                    value={estQuantity}
                    onChange={(e) => setEstQuantity(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>50 Pcs (Pilot)</span>
                    <span>500 Pcs (Bulk)</span>
                    <span>2000+ Pcs</span>
                  </div>
                </div>

                {/* Fabric Option */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase text-slate-300">Select Fabric Tier:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      "Standard Cotton (180 GSM)",
                      "Organic Combed Cotton (220 GSM)",
                      "Premium French Terry / Linen",
                    ].map((f, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEstFabric(f)}
                        className={`p-2.5 rounded-xl text-[11px] sm:text-xs font-bold text-left border transition-all cursor-pointer ${
                          estFabric === f
                            ? "bg-white text-slate-900 border-white shadow-sm font-extrabold"
                            : "bg-white/10 text-white border-white/15 hover:bg-white/20"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimation Results Panel */}
                <div className="rounded-2xl bg-white/10 p-4 sm:p-5 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-300">Estimated Unit Cost:</span>
                    <p className="text-xl sm:text-3xl font-black text-amber-400">LKR {unitCostEst} <span className="text-xs text-slate-300 font-semibold">/ pc</span></p>
                    <p className="text-[11px] sm:text-xs text-slate-300">Est. Total: <strong>LKR {totalEstCost.toLocaleString()}</strong> ({leadTimeText})</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="w-full sm:w-auto h-11 sm:h-12 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-98 shrink-0"
                  >
                    <MessageCircle className="size-4" />
                    <span>WhatsApp this Estimate</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Factory Address & Location Map Card */}
            <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5 sm:gap-3 border-b border-slate-100 pb-3">
                <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#020333] text-white">
                  <MapPin className="size-4.5 sm:size-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-black text-[#0B122F]">
                    {isSi ? "කර්මාන්තශාලා පිහිටීම සහ ලියාපදිංචිය" : "Factory Location & Registration"}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">Verified official business presence</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-400 block mb-0.5 text-[10px]">Registration (BRN)</span>
                  <strong className="text-slate-800 text-xs sm:text-sm">{brnNumber}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-400 block mb-0.5 text-[10px]">Logistics Hub</span>
                  <strong className="text-slate-800 text-xs sm:text-sm">{locationDistrict} District</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-400 block mb-0.5 text-[10px]">Factory Address</span>
                  <strong className="text-slate-800 text-xs sm:text-sm truncate block">{factoryAddress}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Pricing & Sticky RFQ Card (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 space-y-5 sm:space-y-6">
            {/* 3-Tier Pricing Card */}
            <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white border-2 border-slate-200/90 shadow-xl overflow-hidden">
              {/* Package Selector Tabs */}
              <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 p-1 sm:p-1.5 gap-1">
                {(["basic", "standard", "premium"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActivePackageTab(tab)}
                    className={`py-2 sm:py-2.5 text-[11px] sm:text-xs font-black rounded-xl transition-all cursor-pointer capitalize ${
                      activePackageTab === tab
                        ? "bg-[#020333] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === "basic" ? "Sample" : tab === "standard" ? "Standard" : "Commercial"}
                  </button>
                ))}
              </div>

              {/* Package Details */}
              <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#0B122F]">{currentPkg.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{currentPkg.description}</p>
                </div>

                {/* Price Display */}
                <div className="rounded-2xl bg-blue-50/70 p-3.5 sm:p-4 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-blue-900">Estimated Unit Rate</span>
                    <p className="text-xl sm:text-3xl font-black text-[#020333]">{currentPkg.pricePerUnit}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500">Batch MOQ</span>
                    <p className="text-sm sm:text-base font-extrabold text-slate-800">{currentPkg.moq}</p>
                  </div>
                </div>

                {/* Features & Turnaround */}
                <div className="space-y-2.5 pt-0.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
                    <Clock className="size-4 text-blue-600" />
                    <span>{currentPkg.deliveryDays} Production Turnaround</span>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                    {currentPkg.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Check className="size-3.5 text-emerald-600 stroke-[3]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="w-full flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#10B981] hover:bg-[#10B981]/90 text-white text-sm sm:text-base font-black shadow-md transition-all cursor-pointer active:scale-98"
                  >
                    <MessageCircle className="size-4.5 sm:size-5 fill-white" />
                    <span>Chat Directly on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(true)}
                    className="w-full flex h-11 sm:h-13 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer active:scale-98"
                  >
                    <Send className="size-4" />
                    <span>Request Custom Quote (RFQ)</span>
                  </button>

                  <a
                    href={`tel:${supplier.phone}`}
                    className="w-full flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Phone className="size-3.5 sm:size-4 text-slate-500" />
                    <span>Call Factory: {supplier.phone}</span>
                  </a>
                </div>

                {/* Trust & Guarantee Badges */}
                <div className="pt-2 border-t border-slate-100 space-y-1 text-center text-[10px] sm:text-[11px] text-slate-400 font-semibold">
                  <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold">
                    <ShieldCheck className="size-3.5" />
                    <span>Apparel Bank Verified Direct Contract</span>
                  </div>
                  <p>100% Quality Assurance & Factory-Direct Pricing</p>
                </div>
              </div>
            </div>

            {/* Senior Supplier Support Contact Box */}
            <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <HelpCircle className="size-4.5 sm:size-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0B122F]">Need Buyer Assistance?</h4>
                  <p className="text-[11px] text-slate-400">Call Apparel Bank support team</p>
                </div>
              </div>
              <a
                href="tel:0112345678"
                className="flex h-9 sm:h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors"
              >
                <Phone className="size-3.5" />
                <span>011 234 5678 (Help Desk)</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER */}
        {/* ========================================================================= */}
        <footer className="pt-6 sm:pt-8 pb-4 text-center text-[11px] sm:text-xs font-semibold text-slate-400 border-t border-slate-200">
          <p>© 2026 Apparel Bank Ltd. All rights reserved. • Sri Lanka Garment Ecosystem</p>
        </footer>
      </main>

      {/* ========================================================================= */}
      {/* MOBILE FIXED BOTTOM ACTION BAR */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 sm:p-3 shadow-2xl flex items-center justify-between gap-2.5">
        <div>
          <span className="text-[9px] font-black uppercase text-slate-400 block">Starting At</span>
          <p className="text-base sm:text-lg font-black text-[#020333]">{gig.startingPrice}</p>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs justify-end">
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="flex-1 h-11 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md active:scale-98"
          >
            <MessageCircle className="size-3.5 fill-white" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setQuoteModalOpen(true)}
            className="flex-1 h-11 flex items-center justify-center gap-1 rounded-xl bg-[#020333] text-white text-xs font-black shadow-md active:scale-98"
          >
            <Send className="size-3" />
            <span>RFQ Quote</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHOTO LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full h-[60vh] sm:h-[520px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <Image src={activePhoto} alt="Enlarged Garment Sample" fill className="object-contain" />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 rounded-full bg-black/60 text-white p-2 hover:bg-black"
            >
              <X className="size-5 sm:size-6" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REQUEST A QUOTE (RFQ) MODAL */}
      {/* ========================================================================= */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#0B122F]">
                  Request a Formal Quotation (RFQ)
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Direct tech-pack submission to {supplier.businessName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {quoteSubmitted ? (
              <div className="py-8 sm:py-10 text-center space-y-3">
                <CheckCircle2 className="size-14 sm:size-16 text-emerald-600 mx-auto" />
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  Quote Request Dispatched! 🎉
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                  Your RFQ has been delivered to {supplier.userName} at {supplier.businessName}. You will be contacted via WhatsApp/phone shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Your Name / Apparel Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo Urban Clothing Ltd"
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold outline-none focus:border-[#020333]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Mobile / WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="077 123 4567"
                      className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold outline-none focus:border-[#020333]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Target Batch Quantity *
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={`${estQuantity} Pieces`}
                      className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold outline-none focus:border-[#020333]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Garment Style & Tech Pack Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe sizing, fabric GSM, screen printing colors, neck labels, and delivery deadline..."
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-[#020333]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md cursor-pointer active:scale-98"
                  >
                    Submit Quotation Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="rounded-xl sm:rounded-2xl border-2 border-slate-200 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
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

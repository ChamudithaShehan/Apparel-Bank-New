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
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import {
  SupplierRegistration,
  getRegistrations,
  getCurrentUser,
} from "@/lib/registrations";
import { generateGigFromSupplier, SupplierGig } from "@/lib/gigs";

const yearsTextMap: Record<string, string> = {
  under1: "Less than 1 year",
  "1-5": "1 - 5 Years",
  "5-10": "5 - 10 Years",
  "10plus": "10+ Years",
};

const workforceTextMap: Record<string, string> = {
  "1-10": "Solo / 1-10 Staff",
  "11-50": "11 - 50 Employees",
  "51-200": "51 - 200 Employees",
  "200plus": "200+ Employees",
};

const moqTextMap: Record<string, string> = {
  "1-50": "50 Pieces",
  "51-200": "100 - 200 Pieces",
  "201-500": "200 - 500 Pieces",
  "500plus": "500+ Pieces",
};

const categorySpecialistMap: Record<string, string> = {
  tshirt: "Custom T-Shirt Manufacturing Specialist",
  shirt: "Formal & Casual Shirt Production Specialist",
  trousers: "Tailored Trousers & Pants Specialist",
  dresses: "High-Fashion Dresses & Frocks Specialist",
};

const categoryNameMap: Record<string, string> = {
  tshirt: "T-Shirts",
  shirt: "Shirts",
  trousers: "Trousers",
  dresses: "Dresses",
};

export default function SupplierGigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [supplier, setSupplier] = useState<SupplierRegistration | null>(null);
  const [gig, setGig] = useState<SupplierGig | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

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
      // Fallback to currently logged in user or first supplier
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
    categorySpecialistMap[primaryCat] || "Apparel Manufacturing Specialist";

  const locationDistrict =
    supplier.profileDetails?.businessAndLocation?.district ||
    "Maharagama, Sri Lanka";
  const factoryAddress =
    supplier.profileDetails?.businessAndLocation?.address ||
    "Industrial Zone, Sri Lanka";
  const brnNumber =
    supplier.profileDetails?.businessAndLocation?.brn || "Registered Business";

  const leadTimeText =
    supplier.profileDetails?.operationsAndLogistics?.leadTime || "7 Days";
  const hasFabricSourcing =
    supplier.profileDetails?.operationsAndLogistics?.fabricSourcing?.includes(
      "In-House"
    ) ?? true;
  const hasDelivery =
    supplier.profileDetails?.operationsAndLogistics?.deliveryCapability?.includes(
      "Delivery"
    ) ?? true;

  const initials = supplier.businessName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase() || "CSG";

  const customProducts = supplier.profileDetails?.products || [];
  const portfolioPhotos =
    customProducts.length > 0
      ? customProducts.map((p, idx) => ({
          id: `#${idx + 1}`,
          title: p.name,
          file: p.material ? `${p.material} • ${p.pricePerUnit}` : `MOQ: ${p.moq} • ${p.pricePerUnit}`,
          src: p.image,
        }))
      : [
          {
            id: "#1",
            title: "Premium Linen Shirt Sample",
            file: "sample-linen-shirt.jpg",
            src: "/images/categories/shirt.jpg",
          },
          {
            id: "#2",
            title: "Floral Summer Dress Sample",
            file: "sample-cotton-dress.jpg",
            src: "/images/categories/dresses.jpg",
          },
          {
            id: "#3",
            title: "Workstation & Juki Stitching Line",
            file: "sample-factory-floor.jpg",
            src: "/images/categories/tshirt.jpg",
          },
        ];

  const handleWhatsAppClick = () => {
    const cleanPhone = supplier.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${supplier.userName}, I saw your Apparel Bank Manufacturing Gig for ${supplier.businessName}. I would like to inquire about production.`
    );
    window.open(`https://wa.me/94${cleanPhone.replace(/^0/, "")}?text=${msg}`, "_blank");
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteModalOpen(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA] text-slate-800 font-sans antialiased">
      <AppHeader />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto space-y-6">
        {/* ========================================================================= */}
        {/* TOP BAR: Navigation & Gig Status / Edit Profile */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-800 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="size-4 stroke-[2.5]" />
            <span>Back to Supplier Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Status Pill Badge */}
            {isVerified ? (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-4 py-1.5 text-xs font-black text-emerald-800 shadow-2xs">
                <Sparkles className="size-3.5 text-emerald-600 fill-emerald-600" />
                <span>Gig Status: verified</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-4 py-1.5 text-xs font-black text-amber-900 shadow-2xs">
                <Sparkles className="size-3.5 text-amber-600 fill-amber-600" />
                <span>Gig Status: unverified</span>
              </div>
            )}

            {/* Edit Profile Button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#020333] hover:bg-[#020333]/90 text-white text-xs sm:text-sm font-extrabold px-4 py-2 shadow-sm transition-all cursor-pointer"
            >
              <Edit className="size-3.5" />
              <span>Edit Supplier Profile</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO CARD: Dark Navy Profile Showcase */}
        {/* ========================================================================= */}
        <div className="rounded-[2.2rem] bg-[#020333] p-6 sm:p-9 text-white shadow-xl relative overflow-hidden min-h-[260px] flex flex-col justify-end">
          {/* Cover Photo Background if available */}
          {supplier.profileDetails?.factoryBranding?.coverUrl ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={supplier.profileDetails.factoryBranding.coverUrl}
                alt="Factory Cover Photo"
                fill
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020333] via-[#020333]/80 to-[#020333]/40"></div>
            </div>
          ) : (
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 pt-8 sm:pt-14 relative z-10">
            {/* Avatar / Logo Box */}
            <div className="size-24 sm:size-28 rounded-2xl bg-[#070b4a] border-2 border-white/20 flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-lg shrink-0 overflow-hidden relative">
              {supplier.profileDetails?.factoryBranding?.logoUrl ? (
                <Image
                  src={supplier.profileDetails.factoryBranding.logoUrl}
                  alt={supplier.businessName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="tracking-wider">{initials}</span>
              )}
            </div>

            {/* Header Details */}
            <div className="space-y-2 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-amber-300 border border-white/15">
                  <Building2 className="size-3" />
                  <span>Apparel Manufacturer Profile</span>
                </span>

                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                    <Sparkles className="size-3" />
                    <span>verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
                    <Sparkles className="size-3" />
                    <span>unverified</span>
                  </span>
                )}
              </div>

              {/* Business Name */}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {supplier.businessName}
              </h1>

              {/* Specialization Title */}
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-400">
                {specialistTitle}
              </h2>

              {/* Metadata Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-200">
                  <MapPin className="size-3 text-amber-400" />
                  <span>{locationDistrict}</span>
                </span>

                <span className="inline-flex items-center rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-200">
                  {yearsTextMap[supplier.yearsInOperation] ||
                    supplier.yearsInOperation}{" "}
                  Operating Experience
                </span>

                <span className="inline-flex items-center rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-200">
                  Team:{" "}
                  {workforceTextMap[supplier.workforce] || supplier.workforce}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 METRIC CARDS ROW */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {/* Card 1: MOQ */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
              <Package className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                MINIMUM ORDER QUANTITY
              </span>
              <p className="text-2xl font-black text-[#0B122F] mt-0.5">
                {moqTextMap[supplier.moq] || supplier.moq}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Per style/color batch
              </p>
            </div>
          </div>

          {/* Card 2: Production Lead Time */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                PRODUCTION LEAD TIME
              </span>
              <p className="text-2xl font-black text-[#0B122F] mt-0.5">
                {leadTimeText}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Average turnaround time
              </p>
            </div>
          </div>

          {/* Card 3: Industry Experience */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
              <Briefcase className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                INDUSTRY EXPERIENCE
              </span>
              <p className="text-2xl font-black text-[#0B122F] mt-0.5">
                {yearsTextMap[supplier.yearsInOperation] ||
                  supplier.yearsInOperation}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Garment manufacturing
              </p>
            </div>
          </div>

          {/* Card 4: Workforce Capacity */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
              <Users className="size-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                WORKFORCE CAPACITY
              </span>
              <p className="text-2xl font-black text-[#0B122F] mt-0.5">
                {supplier.workforce === "1-10"
                  ? "Solo"
                  : workforceTextMap[supplier.workforce] || supplier.workforce}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Tailors & operators
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TWO COLUMN SECTION: Garment Categories & Service Capabilities */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card: Garment Categories Manufactured */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
                <Scissors className="size-5" />
              </div>
              <h3 className="text-lg font-black text-[#0B122F]">
                Garment Categories Manufactured
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Active pattern making, cutting, and stitching capabilities
              available for bulk order execution:
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {supplier.selectedCategories?.map((catId) => (
                <span
                  key={catId}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-extrabold text-slate-900 border border-slate-200"
                >
                  <span className="size-1.5 rounded-full bg-black"></span>
                  <span>{categoryNameMap[catId] || catId}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Card: Supplier Service Capabilities */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-black text-[#0B122F]">
                Supplier Service Capabilities
              </h3>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                {
                  title: "Fabric & Raw Material Sourcing",
                  sub: "Self-sourcing & Full Package",
                  icon: Package,
                  offered: hasFabricSourcing,
                },
                {
                  title: "Custom Brand Tagging & Woven Labels",
                  sub: "Stitch buyer's custom brand tags",
                  icon: Tag,
                  offered: true,
                },
                {
                  title: "Doorstep Local Delivery (Sri Lanka)",
                  sub: "Warehouse delivery available",
                  icon: Truck,
                  offered: hasDelivery,
                },
                {
                  title: "International Export Ready (Air / Sea Freight)",
                  sub: "Global shipping capable",
                  icon: Globe,
                  offered: supplier.yearsInOperation === "10plus",
                },
              ].map((serv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200/70 text-slate-700">
                      <serv.icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">
                        {serv.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        {serv.sub}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                      serv.offered
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200/80 text-slate-500"
                    }`}
                  >
                    {serv.offered ? "Offered" : "Not Offered"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FACTORY PROFILE & LOCATION INFORMATION */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
              <Building2 className="size-5" />
            </div>
            <h3 className="text-lg font-black text-[#0B122F]">
              Factory Profile & Location Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[11px] block">
                Registration Status
              </span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {brnNumber}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[11px] block">
                Nearest Major Hub
              </span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {locationDistrict}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[11px] block">
                Factory Location
              </span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {factoryAddress}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CLOTHING PRODUCT PORTFOLIO & GALLERY */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#020333] text-white shadow-2xs">
                <Camera className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0B122F]">
                  Clothing Product Portfolio & Gallery
                </h3>
              </div>
            </div>

            <span className="rounded-full bg-blue-50 border border-blue-100 text-blue-900 text-xs font-bold px-3 py-1">
              {portfolioPhotos.length} Portfolio Items
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Genuine factory samples, finished garments, and production lines.
            Click any photo to enlarge.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {portfolioPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo.src)}
                className="group relative rounded-2xl bg-[#020333] text-white overflow-hidden p-3 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-200"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-800">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded">
                    {photo.id}
                  </div>
                </div>

                <div className="pt-2.5 text-center">
                  <p className="text-xs font-extrabold text-white truncate">
                    {photo.title}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">
                    {photo.file}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ACTION BANNER */}
        {/* ========================================================================= */}
        <div className="rounded-[2.2rem] bg-[#020333] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-black text-amber-400 border border-white/10">
              <Sparkles className="size-3.5 fill-amber-400" />
              <span>Verified Direct Supplier Connection</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Interested in Manufacturing with {supplier.businessName}?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
              Contact the factory manager directly via WhatsApp for instant
              sample approvals or submit a formal Quote Request (RFQ) with your
              tech pack details.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10B981] hover:bg-[#10B981]/90 text-white font-extrabold px-6 py-4 text-sm shadow-md transition-all cursor-pointer active:scale-98"
            >
              <MessageCircle className="size-5 fill-white" />
              <span>Contact on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-100 text-[#020333] font-extrabold px-6 py-4 text-sm shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Send className="size-4.5" />
              <span>Request a Quote</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER */}
        {/* ========================================================================= */}
        <footer className="pt-6 pb-4 text-center text-xs font-semibold text-slate-400">
          <p>© 2026 Apparel Bank Ltd. All rights reserved. • Sri Lanka</p>
        </footer>
      </main>

      {/* ========================================================================= */}
      {/* PHOTO ENLARGE MODAL */}
      {/* ========================================================================= */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="relative max-w-2xl w-full h-96 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
            <Image src={activePhoto} alt="Enlarged Photo" fill className="object-cover" />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 rounded-full bg-black/60 text-white p-2"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REQUEST A QUOTE MODAL */}
      {/* ========================================================================= */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Request a Quote (RFQ)
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Direct inquiry to {supplier.businessName}
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
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="size-14 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-extrabold text-slate-900">
                  Quote Request Dispatched!
                </h4>
                <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                  Your RFQ has been forwarded to {supplier.userName} at{" "}
                  {supplier.businessName}. You will receive a quotation shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Your Name / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Apparel Colombo"
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#020333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Mobile Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-[#020333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Target Order Quantity & Specifications
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Need 200 custom crewneck t-shirts (100% cotton, 180 GSM, screen printed front logo)..."
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#020333]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3.5 text-sm font-bold text-white shadow-sm cursor-pointer"
                  >
                    Submit Quote Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
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

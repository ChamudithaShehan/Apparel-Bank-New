"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  PhoneCall,
  RefreshCw,
  Building2,
  User,
  Phone,
  Calendar,
  Users,
  Package,
  Layers,
  HelpCircle,
  ArrowLeft,
  Check,
  MapPin,
  Truck,
  Sparkles,
  Edit2,
  X,
  Globe,
  Upload,
  FileCheck,
  CreditCard,
  ShieldCheck,
  Star,
  Eye,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { AppHeader } from "@/components/AppHeader";
import {
  getCurrentUser,
  clearCurrentUser,
  SupplierRegistration,
  getRegistrations,
  updateSupplierProfile,
  addSupplierProduct,
  deleteSupplierProduct,
  GigProduct,
} from "@/lib/registrations";
import { generateGigFromSupplier } from "@/lib/gigs";

const categoryLabels: Record<string, { en: string; si: string }> = {
  tshirt: { en: "T-Shirts (ටී-ෂර්ට්)", si: "ටී-ෂර්ට් (T-Shirts)" },
  shirt: { en: "Shirts (කමිස)", si: "කමිස (Shirts)" },
  trousers: { en: "Trousers (කලිසම්)", si: "කලිසම් (Trousers)" },
  dresses: { en: "Dresses (ගවුම්)", si: "ගවුම් (Dresses)" },
};

const yearsLabels: Record<string, { en: string; si: string }> = {
  under1: { en: "< 1 Year (අවුරුදු 1ට අඩු)", si: "අවුරුදු 1ට අඩු (< 1 Year)" },
  "1-5": { en: "1 - 5 Years (අවුරුදු 1 - 5)", si: "අවුරුදු 1 - 5 (1 - 5 Years)" },
  "5-10": { en: "5 - 10 Years (අවුරුදු 5 - 10)", si: "අවුරුදු 5 - 10 (5 - 10 Years)" },
  "10plus": { en: "10+ Years (අවුරුදු 10ට වැඩි)", si: "අවුරුදු 10ට වැඩි (10+ Years)" },
};

const workforceLabels: Record<string, { en: string; si: string }> = {
  "1-10": { en: "1 - 10 Employees (සේවකයින් 1 - 10)", si: "සේවකයින් 1 - 10 (1 - 10 Employees)" },
  "11-50": { en: "11 - 50 Employees (සේවකයින් 11 - 50)", si: "සේවකයින් 11 - 50 (11 - 50 Employees)" },
  "51-200": { en: "51 - 200 Employees (සේවකයින් 51 - 200)", si: "සේවකයින් 51 - 200 (51 - 200 Employees)" },
  "200plus": { en: "200+ Employees (සේවකයින් 200ට වැඩි)", si: "සේවකයින් 200ට වැඩි (200+ Employees)" },
};

const moqLabels: Record<string, { en: string; si: string }> = {
  "1-50": { en: "1 - 50 Pieces (කෑලි 1 - 50)", si: "කෑලි 1 - 50 (1 - 50 Pieces)" },
  "51-200": { en: "51 - 200 Pieces (කෑලි 51 - 200)", si: "කෑලි 51 - 200 (51 - 200 Pieces)" },
  "201-500": { en: "201 - 500 Pieces (කෑලි 201 - 500)", si: "කෑලි 201 - 500 (201 - 500 Pieces)" },
  "500plus": { en: "500+ Pieces (කෑලි 500ට වැඩි)", si: "කෑලි 500ට වැඩි (500+ Pieces)" },
};

type ActiveModal = "location" | "logistics" | "branding" | "addProduct" | null;

export default function UserDashboardPage() {
  const { isSi } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<SupplierRegistration | null>(null);
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states for Location
  const [brn, setBrn] = useState("");
  const [businessType, setBusinessType] = useState("Private Limited");
  const [district, setDistrict] = useState("Colombo");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Form states for Logistics
  const [leadTime, setLeadTime] = useState("14 - 21 Days");
  const [fabricSourcing, setFabricSourcing] = useState("Full Fabric & Trims In-House Sourcing");
  const [sampleAvailability, setSampleAvailability] = useState("Free with Bulk Orders (3-5 Days)");
  const [deliveryCapability, setDeliveryCapability] = useState("Islandwide Doorstep Delivery");
  const [paymentTerms, setPaymentTerms] = useState("30% Advance, Balance on Delivery");

  // Form states for Branding
  const [logoUrl, setLogoUrl] = useState("/images/categories/shirt.jpg");
  const [coverUrl, setCoverUrl] = useState("/images/categories/tshirt.jpg");
  const [tagline, setTagline] = useState("");
  const [websiteOrSocial, setWebsiteOrSocial] = useState("");

  // Form states for Add Product
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("tshirt");
  const [productImage, setProductImage] = useState("/images/categories/tshirt.jpg");
  const [productPrice, setProductPrice] = useState("LKR 850");
  const [productMoq, setProductMoq] = useState("50 Pcs");
  const [productMaterial, setProductMaterial] = useState("100% Cotton");
  const [productDescription, setProductDescription] = useState("");

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.profileDetails) {
      const { businessAndLocation, operationsAndLogistics, factoryBranding } =
        currentUser.profileDetails;
      if (businessAndLocation) {
        setBrn(businessAndLocation.brn || "");
        setBusinessType(businessAndLocation.businessType || "Private Limited");
        setDistrict(businessAndLocation.district || "Colombo");
        setAddress(businessAndLocation.address || "");
        setPostalCode(businessAndLocation.postalCode || "");
      }
      if (operationsAndLogistics) {
        setLeadTime(operationsAndLogistics.leadTime || "14 - 21 Days");
        setFabricSourcing(operationsAndLogistics.fabricSourcing || "Full Fabric & Trims In-House Sourcing");
        setSampleAvailability(operationsAndLogistics.sampleAvailability || "Free with Bulk Orders (3-5 Days)");
        setDeliveryCapability(operationsAndLogistics.deliveryCapability || "Islandwide Doorstep Delivery");
        setPaymentTerms(operationsAndLogistics.paymentTerms || "30% Advance, Balance on Delivery");
      }
      if (factoryBranding) {
        setLogoUrl(factoryBranding.logoUrl || "/images/categories/shirt.jpg");
        setCoverUrl(factoryBranding.coverUrl || "/images/categories/tshirt.jpg");
        setTagline(factoryBranding.tagline || "");
        setWebsiteOrSocial(factoryBranding.websiteOrSocial || "");
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3800);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const all = getRegistrations();
      if (user) {
        const latest = all.find((r) => r.id === user.id);
        if (latest) {
          setUser(latest);
        }
      }
      setRefreshing(false);
    }, 400);
  };

  const handleSignOut = () => {
    clearCurrentUser();
    router.push("/signin");
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = updateSupplierProfile(user.id, {
      businessAndLocation: {
        brn: brn.trim(),
        businessType,
        district,
        address: address.trim(),
        postalCode: postalCode.trim(),
      },
    });
    if (updated) setUser(updated);
    setActiveModal(null);
    showToast(isSi ? "ව්‍යාපාර සහ ලිපින තොරතුරු සාර්ථකව සුරැකිණි! ✅" : "Business & Location details saved! ✅");
  };

  const handleSaveLogistics = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = updateSupplierProfile(user.id, {
      operationsAndLogistics: {
        leadTime,
        fabricSourcing,
        sampleAvailability,
        deliveryCapability,
        paymentTerms,
      },
    });
    if (updated) setUser(updated);
    setActiveModal(null);
    showToast(isSi ? "මෙහෙයුම් සහ සැපයුම් තොරතුරු සාර්ථකව සුරැකිණි! ✅" : "Operations & Logistics details saved! ✅");
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = updateSupplierProfile(user.id, {
      factoryBranding: {
        logoUrl,
        coverUrl,
        tagline: tagline.trim(),
        websiteOrSocial: websiteOrSocial.trim(),
      },
    });
    if (updated) setUser(updated);
    setActiveModal(null);
    showToast(isSi ? "ලාංඡනය සහ ආවරණ ඡායාරූපය සුරැකිණි! ✅" : "Factory Branding & Gig Cover saved! ✅");
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !productName.trim()) return;

    const updated = addSupplierProduct(user.id, {
      name: productName.trim(),
      category: productCategory,
      image: productImage,
      pricePerUnit: productPrice.trim(),
      moq: productMoq.trim(),
      material: productMaterial.trim(),
      description: productDescription.trim(),
    });

    if (updated) setUser(updated);
    setActiveModal(null);
    // Reset product form
    setProductName("");
    setProductDescription("");
    showToast(isSi ? "අලුත් ඇඳුම ඔබගේ Gig එකට සාර්ථකව එක් විය! 🎉" : "New product successfully added to your Gig! 🎉");
  };

  const handleDeleteProduct = (productId: string) => {
    if (!user) return;
    const updated = deleteSupplierProduct(user.id, productId);
    if (updated) setUser(updated);
    showToast(isSi ? "ඇඳුම සාර්ථකව ඉවත් කෙරිණි. 🗑️" : "Product removed from Gig. 🗑️");
  };

  if (!mounted) return null;

  // If user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F6FA]">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-[2.2rem] bg-white p-8 sm:p-10 shadow-sm ring-1 ring-slate-200/80 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/50 mb-5">
              <HelpCircle className="size-10 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B122F]">
              {isSi ? "පිවිසුමක් අවශ්‍යයි" : "Sign In Required"}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {isSi
                ? "ඔබගේ ලියාපදිංචි තොරතුරු සහ තත්ත්වය බැලීමට කරුණාකර පළමුව ඇතුල් වන්න."
                : "Please sign in to view your supplier registration details and status."}
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/signin"
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#020333] px-6 text-lg font-bold text-white shadow-sm hover:bg-[#020333]/90"
              >
                {isSi ? "ඇතුල් වන්න (Sign In)" : "Sign In"}
              </Link>
              <Link
                href="/"
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
              >
                {isSi ? "මුල් පිටුවට (Home)" : "Back to Home"}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hasLocation = Boolean(user.profileDetails?.businessAndLocation?.address);
  const hasLogistics = Boolean(user.profileDetails?.operationsAndLogistics?.leadTime);
  const hasBranding = Boolean(user.profileDetails?.factoryBranding?.coverUrl);
  const productsList = user.profileDetails?.products || [];
  const gigData = generateGigFromSupplier(user);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FA] text-slate-800 antialiased font-sans">
      <AppHeader />

      {/* Senior-Friendly Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="rounded-2xl bg-[#020333] text-white px-5 py-4 shadow-2xl border-2 border-emerald-400/80 text-base sm:text-lg font-extrabold flex items-center gap-3">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-4xl space-y-7">
          {/* ========================================================================= */}
          {/* 1. TOP HEADER: Welcoming Senior Supplier & Quick Actions */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[2.2rem] bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-black text-blue-900 border border-blue-200">
                <span>{isSi ? "සැපයුම්කරු ගිණුම" : "Supplier Portal"}</span>
                <span>•</span>
                <span>ID: {user.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B122F]">
                {isSi ? `ආයුබෝවන්, ${user.userName}! 👋` : `Hello, ${user.userName}! 👋`}
              </h1>
              <p className="text-base sm:text-lg font-bold text-slate-600">
                {user.businessName} • 📞 {user.phone}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                title="Refresh Status"
                className="flex h-12 items-center gap-2 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <RefreshCw className={`size-4.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
                <span>{isSi ? "යාවත්කාලීන" : "Refresh"}</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex h-12 items-center gap-2 rounded-2xl bg-rose-50 border-2 border-rose-200 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100 cursor-pointer transition-colors"
              >
                <LogOut className="size-4.5" />
                <span>{isSi ? "ඉවත් වන්න" : "Sign Out"}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. REGISTRATION STATUS CARD */}
          {/* ========================================================================= */}
          {user.status === "approved" && (
            <div className="rounded-[2.2rem] bg-emerald-50 border-2 border-emerald-500 p-6 sm:p-8 text-emerald-950 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                  <CheckCircle2 className="size-12 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-200 px-3.5 py-0.5 text-xs font-black uppercase text-emerald-950 mb-1">
                    🟢 {isSi ? "සාර්ථකව අනුමත විය" : "Application Approved"}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
                    {isSi ? "ලියාපදිංචිය සාර්ථකයි! 🎉" : "Registration Approved! 🎉"}
                  </h2>
                  <p className="text-base sm:text-lg font-semibold text-emerald-900 leading-relaxed">
                    {isSi
                      ? "ඔබගේ සැපයුම්කරු ගිණුම සාර්ථකව අනුමත කර ඇත. ඔබගේ නිෂ්පාදන සේවා දැන්වීම (Gig) ඇපරල් බෑන්ක් වෙළඳපොළේ සක්‍රීයව පවතී."
                      : "Your supplier account is approved. Your manufacturing Gig is live and verified on Apparel Bank Marketplace."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {user.status === "pending" && (
            <div className="rounded-[2.2rem] bg-amber-50 border-2 border-amber-400 p-6 sm:p-8 text-amber-950 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                  <Clock className="size-12 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-200 px-3.5 py-0.5 text-xs font-black uppercase text-amber-950 mb-1">
                    🟡 {isSi ? "සමාලෝචනය වෙමින් පවතී" : "Under Review / Pending"}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
                    {isSi ? "අයදුම්පත පරීක්ෂා කෙරේ ⏳" : "Application Under Review ⏳"}
                  </h2>
                  <p className="text-base sm:text-lg font-semibold text-amber-900 leading-relaxed">
                    {isSi
                      ? "ඔබගේ ලියාපදිංචි තොරතුරු අපගේ කණ්ඩායම විසින් පරීක්ෂා කරමින් පවතී. අනුමත වූ වහාම දැනුම් දෙනු ලැබේ."
                      : "Your registration details are currently being reviewed by the Apparel Bank team."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {user.status === "rejected" && (
            <div className="rounded-[2.2rem] bg-rose-50 border-2 border-rose-500 p-6 sm:p-8 text-rose-950 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
                  <XCircle className="size-12 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-200 px-3.5 py-0.5 text-xs font-black uppercase text-rose-950 mb-1">
                    🔴 {isSi ? "ප්‍රතික්ෂේප විය" : "Application Rejected"}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-rose-950">
                    {isSi ? "ලියාපදිංචිය ප්‍රතික්ෂේප විය ❌" : "Application Not Approved ❌"}
                  </h2>
                  <p className="text-base sm:text-lg font-semibold text-rose-900 leading-relaxed">
                    {isSi
                      ? "කණගාටුයි, ඔබගේ අයදුම්පත අනුමත කර නොමැත. කරුණාකර අපගේ සහාය අංකය (011 234 5678) අමතන්න."
                      : "Your application was not approved. Please call our support line at 011 234 5678."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. COMPLETE YOUR PROFILE CARDS (Business, Logistics, Branding) - TOP PRIORITY */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B122F] flex items-center gap-2">
                <Sparkles className="size-7 text-amber-500 fill-amber-500" />
                <span>
                  {isSi ? "ගිණුම සම්පූර්ණ කරන්න (Complete Your Profile)" : "Complete Your Profile (ගිණුම සම්පූර්ණ කරන්න)"}
                </span>
              </h2>
              <p className="text-base text-slate-600 font-semibold mt-0.5">
                {isSi
                  ? "ඇඳුම් ගැනුම්කරුවන්ට ඔබගේ කර්මාන්තශාලාව පූර්ණ ලෙස ප්‍රදර්ශනය කිරීමට පහත විස්තර ඇතුළත් කරන්න."
                  : "Add the missing details below to fully showcase your factory to clothing buyers."}
              </p>
            </div>

            {/* 3 Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-1">
              {/* 1. Business & Location Card */}
              <div className="rounded-[1.8rem] bg-white p-6 border-2 border-slate-200/90 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <MapPin className="size-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B122F]">
                      Business & Location
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    Registration status, BRN, and physical address.
                  </p>

                  {hasLocation ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Check className="size-3.5 stroke-[3]" />
                      <span>Completed (සම්පූර්ණයි)</span>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-rose-600 leading-snug">
                      Pending setup (තොරතුරු ඇතුළත් කිරීම අපේක්ෂාවෙන්)
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("location")}
                  className="w-full rounded-2xl bg-[#020333] hover:bg-[#020333]/90 text-white font-bold py-3.5 px-4 text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{hasLocation ? "Edit Business & Location" : "+ Add Business & Location"}</span>
                </button>
              </div>

              {/* 2. Operations & Logistics Card */}
              <div className="rounded-[1.8rem] bg-white p-6 border-2 border-slate-200/90 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Truck className="size-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B122F]">
                      Operations & Logistics
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    Production lead times, fabric sourcing, and delivery capabilities.
                  </p>

                  {hasLogistics ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Check className="size-3.5 stroke-[3]" />
                      <span>Completed (සම්පූර්ණයි)</span>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-rose-600 leading-snug">
                      Pending setup (තොරතුරු ඇතුළත් කිරීම අපේක්ෂාවෙන්)
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("logistics")}
                  className="w-full rounded-2xl bg-[#020333] hover:bg-[#020333]/90 text-white font-bold py-3.5 px-4 text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{hasLogistics ? "Edit Logistics" : "+ Add Logistics"}</span>
                </button>
              </div>

              {/* 3. Factory Branding Card */}
              <div className="rounded-[1.8rem] bg-white p-6 border-2 border-slate-200/90 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <Building2 className="size-5" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#0B122F]">
                      Factory Branding
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    Upload business logo avatar and a widescreen factory cover image.
                  </p>

                  {hasBranding ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Check className="size-3.5 stroke-[3]" />
                      <span>Completed (සම්පූර්ණයි)</span>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-rose-600 leading-snug">
                      Pending setup (තොරතුරු ඇතුළත් කිරීම අපේක්ෂාවෙන්)
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("branding")}
                  className="w-full rounded-2xl bg-[#020333] hover:bg-[#020333]/90 text-white font-bold py-3.5 px-4 text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{hasBranding ? "Edit Logo & Cover" : "+ Upload Logo & Cover Photo"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. UNIFIED: YOUR MANUFACTURING GIG & PRODUCTS SHOWCASE */}
          {/* ========================================================================= */}
          <div className="rounded-[2.2rem] bg-[#020333] text-white p-6 sm:p-8 shadow-xl space-y-7">
            {/* Header: Title, Description & Big View Live Gig Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-black text-emerald-300 mb-1.5 border border-emerald-500/30">
                  <Sparkles className="size-4" />
                  <span>{isSi ? "සජීවී සේවා දැන්වීම සහ ඇඳුම්" : "Your Live Manufacturing Gig & Products"}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {isSi ? "ඔබගේ සේවා දැන්වීම සහ ඇඳුම් සාම්පල" : "Your Live Manufacturing Gig & Products"}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-medium mt-0.5">
                  {isSi
                    ? "ගැනුම්කරුවන්ට පෙනෙන සේවා දැන්වීම සහ ඔබ නිපදවන ඇඳුම් සාම්පල මෙතැනින් කළමනාකරණය කරන්න."
                    : "How wholesale buyers see your factory. Manage your branding and manufactured clothing samples."}
                </p>
              </div>

              {/* Big Prominent Preview Button */}
              <Link
                href={`/gig/${user.id}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-base font-black px-7 shadow-lg transition-all cursor-pointer active:scale-98 shrink-0"
              >
                <Eye className="size-5" />
                <span>{isSi ? "සේවා පිටුව බලන්න (View Gig)" : "View Live Gig Page ↗"}</span>
              </Link>
            </div>

            {/* Top Row: The Gig Card Snapshot + Actions & Pulse Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* The Live Gig Preview Card */}
              <Link
                href={`/gig/${user.id}`}
                className="md:col-span-2 rounded-2xl bg-white text-slate-900 overflow-hidden shadow-lg border-2 border-white/20 block hover:scale-[1.01] transition-transform"
              >
                <div className="relative h-48 w-full bg-slate-100">
                  <Image
                    src={user.profileDetails?.factoryBranding?.coverUrl || gigData.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {user.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-xs font-black px-3 py-1 shadow-sm">
                        <ShieldCheck className="size-3.5" />
                        <span>Verified Factory</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white text-xs font-black px-3 py-1 shadow-sm">
                        <Clock className="size-3.5" />
                        <span>Pending Sign-off</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                      <Image
                        src={user.profileDetails?.factoryBranding?.logoUrl || gigData.seller.avatar}
                        alt="Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{user.businessName}</p>
                      <p className="text-xs font-bold text-slate-400">
                        {user.profileDetails?.businessAndLocation?.district || "Maharagama, Sri Lanka"}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {gigData.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500 pt-1">
                    <div className="flex items-center text-amber-500 font-black text-sm">
                      <Star className="size-4 fill-amber-500 mr-1" />
                      <span>4.9</span>
                    </div>
                    <span>•</span>
                    <span>MOQ: {user.moq}</span>
                    <span>•</span>
                    <span>{leadTime}</span>
                  </div>
                </div>
              </Link>

              {/* Action Button & Quick Pulse Stats */}
              <div className="space-y-3 flex flex-col justify-between h-full">
                {/* Big Add Product Button */}
                <button
                  type="button"
                  onClick={() => setActiveModal("addProduct")}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-100 text-[#020333] text-base font-black px-4 shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <Plus className="size-5 stroke-[3] text-indigo-600" />
                  <span>{isSi ? "අලුත් ඇඳුමක් එක් කරන්න" : "+ Add Product to Gig"}</span>
                </button>

                <div className="rounded-2xl bg-white/10 p-4 border border-white/15 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    {isSi ? "දැන්වීමේ ඇති ඇඳුම්" : "Active Products in Gig"}
                  </span>
                  <p className="text-3xl font-black text-white">{productsList.length} Items</p>
                  <p className="text-xs text-emerald-400 font-semibold">Active in Portfolio Gallery</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 border border-white/15 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    {isSi ? "ගැණුම්කරු විමසීම්" : "Factory Inquiries"}
                  </span>
                  <p className="text-3xl font-black text-emerald-400">14</p>
                  <p className="text-xs text-slate-400 font-semibold">Via WhatsApp & Quote Requests</p>
                </div>
              </div>
            </div>

            {/* Bottom Section: Active Garment Products & Samples Grid */}
            <div className="border-t border-white/15 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-5 text-amber-400" />
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {isSi ? "දැන්වීමේ ඇති ඇඳුම් සාම්පල" : "Garment Samples in Your Gig"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("addProduct")}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
                >
                  <Plus className="size-4 stroke-[3]" />
                  <span>{isSi ? "තව ඇඳුම් එක් කරන්න" : "Add More"}</span>
                </button>
              </div>

              {productsList.length === 0 ? (
                <div className="rounded-2xl bg-white/5 border-2 border-dashed border-white/20 p-6 sm:p-8 text-center space-y-3">
                  <ShoppingBag className="size-10 text-slate-400 mx-auto" />
                  <p className="text-sm sm:text-base font-semibold text-slate-300">
                    {isSi
                      ? "තවම ඇඳුම් සාම්පල ඇතුළත් කර නැත. ගැනුම්කරුවන්ට පෙන්වීමට පළමු ඇඳුම එක් කරන්න."
                      : "No product samples added yet. Add your first clothing style to display on your Gig."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModal("addProduct")}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-5 cursor-pointer shadow-sm"
                  >
                    <Plus className="size-4 stroke-[3]" />
                    <span>{isSi ? "පළමු ඇඳුම එක් කරන්න" : "Add First Product"}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productsList.map((prod) => (
                    <div
                      key={prod.id}
                      className="rounded-2xl bg-white text-slate-900 p-4 border border-white/20 shadow-md flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="relative size-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>

                        <div className="space-y-1 flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-blue-100 text-blue-900 text-[11px] font-black px-2 py-0.5 uppercase">
                              {categoryLabels[prod.category]?.[isSi ? "si" : "en"] || prod.category}
                            </span>
                            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              {prod.pricePerUnit}
                            </span>
                          </div>

                          <h4 className="text-base font-extrabold text-slate-900 truncate">
                            {prod.name}
                          </h4>

                          {prod.material && (
                            <p className="text-xs font-bold text-slate-500 truncate">
                              🧵 {prod.material}
                            </p>
                          )}
                          <p className="text-xs font-semibold text-slate-400">
                            📦 MOQ: {prod.moq}
                          </p>
                        </div>
                      </div>

                      {prod.description && (
                        <p className="text-xs font-medium text-slate-600 line-clamp-2 border-t border-slate-100 pt-2">
                          {prod.description}
                        </p>
                      )}

                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400">ID: {prod.id}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          title="Remove Product"
                        >
                          <Trash2 className="size-4" />
                          <span>{isSi ? "ඉවත් කරන්න" : "Delete"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. REGISTERED PROFILE DETAILS */}
          {/* ========================================================================= */}
          <div className="rounded-[2.2rem] bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 space-y-5">
            <h3 className="text-xl sm:text-2xl font-black text-[#0B122F] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="size-6 text-primary-deep" />
              <span>{isSi ? "ලියාපදිංචි විස්තර" : "Registered Profile Details"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400">
                  {isSi ? "ව්‍යාපාරයේ නම" : "Business Name"}
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{user.businessName}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400">
                  {isSi ? "පරිශීලක නාමය" : "User Name"}
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{user.userName}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400">
                  {isSi ? "ජංගම දුරකථන අංකය" : "Mobile Number"}
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{user.phone}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400">
                  {isSi ? "යොමු අංකය" : "Reference ID"}
                </span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{user.id}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400">
                  {isSi ? "ආයතනයේ වයස" : "Years in Operation"}
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {yearsLabels[user.yearsInOperation]?.[isSi ? "si" : "en"] || user.yearsInOperation}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400">
                  {isSi ? "සේවක සංඛ්‍යාව" : "Workforce"}
                </span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {workforceLabels[user.workforce]?.[isSi ? "si" : "en"] || user.workforce}
                </p>
              </div>
            </div>

            {/* Selected Garment Categories */}
            <div className="rounded-2xl bg-slate-50 p-4.5 border border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
                {isSi ? "තෝරාගත් ඇඳුම් වර්ග" : "Selected Garment Categories"}
              </span>
              <div className="flex flex-wrap gap-2">
                {user.selectedCategories?.map((catId) => (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-100/90 px-3.5 py-1.5 text-sm font-bold text-blue-950 border border-blue-200"
                  >
                    <Check className="size-4 stroke-[3] text-blue-700" />
                    {categoryLabels[catId]?.[isSi ? "si" : "en"] || catId}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 7. HELP & SUPPORT HOTLINE BANNER (Large for 60+ Users) */}
          {/* ========================================================================= */}
          <div className="rounded-[2.2rem] bg-indigo-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                <PhoneCall className="size-8" />
              </div>
              <div>
                <h4 className="text-xl font-black">
                  {isSi ? "උපකාර සහ සහාය අවශ්‍යද? අප අමතන්න" : "Need Assistance? Call Support"}
                </h4>
                <p className="text-sm sm:text-base text-indigo-200 font-semibold">
                  {isSi ? "සඳුදා - සිකුරාදා (පෙ.ව. 8.30 - ප.ව. 5.00)" : "Monday - Friday (8:30 AM - 5:00 PM)"}
                </p>
              </div>
            </div>

            <a
              href="tel:0112345678"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 font-black text-lg text-indigo-950 hover:bg-white/95 active:scale-98 shadow-md transition-all shrink-0"
            >
              <Phone className="size-5" />
              <span>011 234 5678</span>
            </a>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-base font-bold text-primary-deep hover:underline"
            >
              <ArrowLeft className="size-4" />
              <span>{isSi ? "මුල් පිටුවට ආපසු යන්න" : "Back to Home Page"}</span>
            </Link>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD PRODUCT / SAMPLE TO GIG (Simple for 60+ users) */}
      {/* ========================================================================= */}
      {activeModal === "addProduct" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <ShoppingBag className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0B122F]">
                    {isSi ? "අලුත් ඇඳුම් සාම්පලයක් එක් කරන්න" : "Add Product / Sample to Gig"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {isSi ? "පාරිභෝගිකයින්ට පෙන්වීම සඳහා සාම්පලයක් ඇතුළත් කරන්න" : "Add garment style & photo to your public Gig"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-6" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="mt-5 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  {isSi ? "ඇඳුමේ නම (Garment Name) *" : "Product / Garment Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Cotton Crewneck T-Shirt / Formal Linen Shirt"
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-[#020333]"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "ඇඳුම් වර්ගය (Category) *" : "Category *"}
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => {
                      setProductCategory(e.target.value);
                      if (e.target.value === "tshirt") setProductImage("/images/categories/tshirt.jpg");
                      else if (e.target.value === "shirt") setProductImage("/images/categories/shirt.jpg");
                      else if (e.target.value === "dresses") setProductImage("/images/categories/dresses.jpg");
                      else if (e.target.value === "trousers") setProductImage("/images/categories/trousers.jpg");
                    }}
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-[#020333] cursor-pointer bg-white"
                  >
                    <option value="tshirt">T-Shirts (ටී-ෂර්ට්)</option>
                    <option value="shirt">Shirts (කමිස)</option>
                    <option value="trousers">Trousers (කලිසම්)</option>
                    <option value="dresses">Dresses (ගවුම්)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "කෑල්ලක මිල (Price / Pc) *" : "Estimated Price / Piece *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="e.g. LKR 850"
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-[#020333]"
                  />
                </div>
              </div>

              {/* MOQ & Fabric Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "අවම ඇණවුම (MOQ) *" : "Minimum Order (MOQ) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={productMoq}
                    onChange={(e) => setProductMoq(e.target.value)}
                    placeholder="e.g. 50 Pcs"
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-[#020333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "රෙදි වර්ගය (Fabric Material)" : "Fabric Material"}
                  </label>
                  <input
                    type="text"
                    value={productMaterial}
                    onChange={(e) => setProductMaterial(e.target.value)}
                    placeholder="e.g. 100% Cotton / Linen"
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-[#020333]"
                  />
                </div>
              </div>

              {/* Sample Photo Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  {isSi ? "සාම්පල ඡායාරූපය (Sample Photo) *" : "Sample Photo *"}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative size-16 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                    <Image src={productImage} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      placeholder="/images/categories/tshirt.jpg"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-[#020333]"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "T-Shirt", src: "/images/categories/tshirt.jpg" },
                        { label: "Shirt", src: "/images/categories/shirt.jpg" },
                        { label: "Dress", src: "/images/categories/dresses.jpg" },
                        { label: "Trousers", src: "/images/categories/trousers.jpg" },
                      ].map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProductImage(p.src)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                            productImage === p.src
                              ? "bg-[#020333] text-white border-[#020333]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  {isSi ? "කෙටි විස්තරය (Description)" : "Short Description"}
                </label>
                <textarea
                  rows={2}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="e.g. Export finish, double needle stitch, customizable collar and tag."
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#020333]"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-4 text-base font-extrabold text-white shadow-md cursor-pointer active:scale-98"
                >
                  {isSi ? "ඇඳුම සුරකින්න (Save Product)" : "Save Product to Gig"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-2xl border-2 border-slate-200 px-6 py-4 text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. BUSINESS & LOCATION MODAL FORM */}
      {/* ========================================================================= */}
      {activeModal === "location" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0B122F]">
                    {isSi ? "ව්‍යාපාර සහ ලිපින තොරතුරු" : "Business & Location"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {isSi ? "ලියාපදිංචි අංකය සහ කර්මාන්තශාලාවේ ලිපිනය" : "Registration status, BRN, and physical address"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "ව්‍යාපාර ලියාපදිංචි අංකය (BRN) *" : "Business Registration Number (BRN) *"}
                </label>
                <input
                  type="text"
                  required
                  value={brn}
                  onChange={(e) => setBrn(e.target.value)}
                  placeholder="e.g. PV-89210 / W-1289"
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "ව්‍යාපාර වර්ගය *" : "Business Legal Type *"}
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary cursor-pointer bg-white"
                >
                  <option value="Sole Proprietorship">තනි පුද්ගල ව්‍යාපාර (Sole Proprietorship)</option>
                  <option value="Partnership">හවුල් ව්‍යාපාර (Partnership)</option>
                  <option value="Private Limited">පුද්ගලික සමාගම (Private Limited - Pvt Ltd)</option>
                  <option value="Public Limited">පොදු සමාගම (Public Limited)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "දිස්ත්‍රික්කය *" : "District *"}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary cursor-pointer bg-white"
                >
                  <option value="Colombo">Colombo (කොළඹ)</option>
                  <option value="Gampaha">Gampaha (ගම්පහ)</option>
                  <option value="Kalutara">Kalutara (කළුතර)</option>
                  <option value="Kandy">Kandy (මහනුවර)</option>
                  <option value="Kurunegala">Kurunegala (කුරුණෑගල)</option>
                  <option value="Galle">Galle (ගාල්ල)</option>
                  <option value="Matara">Matara (මාතර)</option>
                  <option value="Ratnapura">Ratnapura (රත්නපුර)</option>
                  <option value="Other">Other District (වෙනත්)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "කර්මාන්තශාලාවේ සම්පූර්ණ ලිපිනය *" : "Physical Factory Street Address *"}
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. No. 45, Industrial Zone Road, Moratuwa"
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-2.5 text-base font-semibold outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "තැපැල් අංකය (Postal Code)" : "Postal Code"}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 10400"
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3.5 text-base font-bold text-white shadow-sm cursor-pointer"
                >
                  {isSi ? "සුරකින්න (Save Location)" : "Save Business & Location"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-2xl border border-slate-200 px-5 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OPERATIONS & LOGISTICS MODAL FORM */}
      {/* ========================================================================= */}
      {activeModal === "logistics" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Truck className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0B122F]">
                    {isSi ? "මෙහෙයුම් සහ සැපයුම් තොරතුරු" : "Operations & Logistics"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {isSi ? "නිෂ්පාදන කාලය, රෙදිපිළි සහ ප්‍රවාහන පහසුකම්" : "Lead times, fabric sourcing, and delivery"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLogistics} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "සාමාන්‍ය නිෂ්පාදන කාලය (Lead Time) *" : "Production Lead Time *"}
                </label>
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary cursor-pointer bg-white"
                >
                  <option value="7 - 14 Days">7 - 14 Days (දින 7 - 14 ක් ඇතුළත)</option>
                  <option value="14 - 21 Days">14 - 21 Days (දින 14 - 21 ක් ඇතුළත)</option>
                  <option value="21 - 30 Days">21 - 30 Days (දින 21 - 30 ක් ඇතුළත)</option>
                  <option value="30+ Days">30+ Days (මාස 1කට වැඩි)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "රෙදිපිළි සැපයීම (Fabric Sourcing) *" : "Fabric Sourcing Support *"}
                </label>
                <select
                  value={fabricSourcing}
                  onChange={(e) => setFabricSourcing(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary cursor-pointer bg-white"
                >
                  <option value="Full Fabric & Trims In-House Sourcing">
                    {isSi ? "අප විසින්ම රෙදිපිළි සහ අමුද්‍රව්‍ය සපයනු ලැබේ (In-House)" : "Full Fabric & Trims In-House Sourcing"}
                  </option>
                  <option value="Buyer Must Provide Fabric">
                    {isSi ? "ගැනුම්කරු විසින් රෙදි සැපයිය යුතුය (Cut & Make Only)" : "Buyer Must Provide Fabric"}
                  </option>
                  <option value="Both Options Supported">
                    {isSi ? "ක්‍රම දෙකටම සහය දක්වයි (Both Options Supported)" : "Both Options Supported"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "සාම්පල් සෑදීම (Sample Development) *" : "Sample Development *"}
                </label>
                <select
                  value={sampleAvailability}
                  onChange={(e) => setSampleAvailability(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary cursor-pointer bg-white"
                >
                  <option value="Free with Bulk Orders (3-5 Days)">
                    {isSi ? "තොග ඇණවුම් සමඟ නොමිලේ (Free with Orders)" : "Free with Bulk Orders (3-5 Days)"}
                  </option>
                  <option value="Paid Prototype Samples Available">
                    {isSi ? "ගෙවීම් සහිත සාම්පල් ලබා ගත හැක (Paid Samples)" : "Paid Prototype Samples Available"}
                  </option>
                  <option value="No Samples Provided">
                    {isSi ? "සාම්පල් සපයන්නේ නැත (Direct Production Only)" : "No Samples Provided"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "ප්‍රවාහන / බෙදාහැරීමේ හැකියාව *" : "Delivery Capabilities *"}
                </label>
                <select
                  value={deliveryCapability}
                  onChange={(e) => setDeliveryCapability(e.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary cursor-pointer bg-white"
                >
                  <option value="Islandwide Doorstep Delivery">
                    {isSi ? "දිවයින පුරා බෙදාහැරීම (Islandwide Delivery)" : "Islandwide Doorstep Delivery"}
                  </option>
                  <option value="Factory Pick-up Only">
                    {isSi ? "කර්මාන්තශාලාවෙන් ලබා ගැනීම පමණි (Pick-up Only)" : "Factory Pick-up Only"}
                  </option>
                  <option value="Third-Party Courier Partner">
                    {isSi ? "කුරියර් සේවා මඟින් (Courier Service)" : "Third-Party Courier Partner"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "ගෙවීම් කොන්දේසි (Payment Terms)" : "Payment Terms Accepted"}
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. 30% Advance, Balance on Delivery"
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3.5 text-base font-bold text-white shadow-sm cursor-pointer"
                >
                  {isSi ? "සුරකින්න (Save Logistics)" : "Save Logistics Details"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-2xl border border-slate-200 px-5 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FACTORY BRANDING MODAL FORM */}
      {/* ========================================================================= */}
      {activeModal === "branding" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#0B122F]">
                    {isSi ? "කර්මාන්තශාලා සන්නාමය" : "Factory Branding"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {isSi ? "ලාංඡනය සහ ආවරණ ඡායාරූපය ඇතුළත් කරන්න" : "Upload logo avatar and widescreen cover image"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranding} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "ව්‍යාපාර ලාංඡනය (Logo Avatar) *" : "Business Logo Avatar *"}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                    <Image src={logoUrl} alt="Logo Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="/images/categories/shirt.jpg"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                    />
                    <div className="flex gap-1.5">
                      {["/images/categories/shirt.jpg", "/images/categories/tshirt.jpg", "/images/categories/dresses.jpg"].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLogoUrl(preset)}
                          className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 cursor-pointer"
                        >
                          Preset {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "කර්මාන්තශාලා ආවරණ ඡායාරූපය (Widescreen Gig Cover Photo) *" : "Widescreen Gig Cover Photo *"}
                </label>
                <div className="space-y-2">
                  <div className="relative h-28 w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs">
                    <Image src={coverUrl} alt="Cover Preview" fill className="object-cover" />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded">
                      Gig Banner Preview
                    </div>
                  </div>
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="/images/categories/tshirt.jpg"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[
                      { name: "Stitching Floor", url: "/images/categories/tshirt.jpg" },
                      { name: "Apparel Line", url: "/images/categories/shirt.jpg" },
                      { name: "Fashion Studio", url: "/images/categories/dresses.jpg" },
                      { name: "Finishing Unit", url: "/images/categories/trousers.jpg" },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverUrl(preset.url)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          coverUrl === preset.url
                            ? "bg-[#020333] text-white border-[#020333]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "කර්මාන්තශාලාවේ කෙටි හැඳින්වීම (Bio / Tagline) *" : "Factory Tagline / Bio *"}
                </label>
                <textarea
                  rows={2}
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Export-quality knitwear & polo shirts manufacturer specialized in custom orders."
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-2.5 text-base font-semibold outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "වෙබ් අඩවිය හෝ සමාජ මාධ්‍ය සබැඳිය" : "Website / Social Media Link"}
                </label>
                <input
                  type="text"
                  value={websiteOrSocial}
                  onChange={(e) => setWebsiteOrSocial(e.target.value)}
                  placeholder="https://facebook.com/yourfactory or https://yourfactory.lk"
                  className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3.5 text-base font-bold text-white shadow-sm cursor-pointer"
                >
                  {isSi ? "සුරකින්න (Save Branding)" : "Save Factory Branding"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-2xl border border-slate-200 px-5 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

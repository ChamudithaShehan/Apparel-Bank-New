"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  Building2,
  PhoneCall,
  Sparkles,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  RefreshCw,
  Eye,
  Plus,
  Trash2,
  ShieldCheck,
  Star,
  Check,
  X,
  Menu,
  ChevronRight,
  Phone,
  MessageSquare,
  Globe,
  ExternalLink,
  Package,
  Calendar,
  Users,
  FileCheck,
  Tag,
  Layers,
  HelpCircle,
  Send,
  AlertCircle,
  HelpCircle as QuestionIcon,
  Search,
  SlidersHorizontal,
  Edit2,
  User,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { BrandLogo } from "@/components/BrandLogo";
import {
  getCurrentUser,
  clearCurrentUser,
  SupplierRegistration,
  getRegistrations,
  updateSupplierProfile,
  updateSupplierBasicInfo,
  addSupplierProduct,
  deleteSupplierProduct,
  GigProduct,
} from "@/lib/registrations";
import { generateGigFromSupplier } from "@/lib/gigs";

type DashboardTab = "overview" | "gig" | "products" | "factory" | "inquiries" | "support";

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

type ActiveModal = "location" | "logistics" | "branding" | "addProduct" | "basicInfo" | null;

interface MockInquiry {
  id: string;
  buyerName: string;
  buyerCompany: string;
  date: string;
  category: string;
  quantity: string;
  status: "new" | "sample_requested" | "discussion" | "completed";
  message: string;
  phone: string;
}

const INITIAL_INQUIRIES: MockInquiry[] = [
  {
    id: "INQ-4091",
    buyerName: "Kasun Jayawardena",
    buyerCompany: "Ceylon Urban Wear Ltd",
    date: "Today, 10:30 AM",
    category: "T-Shirts & Polos",
    quantity: "500 Pcs",
    status: "new",
    message: "We need custom embroidered crewneck t-shirts (180 GSM combed cotton) with our brand woven label.",
    phone: "0778901234",
  },
  {
    id: "INQ-4088",
    buyerName: "Dharshani Perera",
    buyerCompany: "Colombo Style Hub",
    date: "Yesterday",
    category: "Linen Shirts",
    quantity: "150 Pcs",
    status: "sample_requested",
    message: "Could you send a fabric swatch and 1 pre-production prototype sample to our Rajagiriya office?",
    phone: "0712349876",
  },
  {
    id: "INQ-4074",
    buyerName: "Mahesh Ranasinghe",
    buyerCompany: "Apex Uniforms & Corporate",
    date: "3 days ago",
    category: "Formal Shirts",
    quantity: "1,000 Pcs",
    status: "discussion",
    message: "Looking for a monthly regular contract for corporate hospitality staff uniforms. Please provide quotation.",
    phone: "0763456789",
  },
];

export default function UserDashboardPage() {
  const { isSi, lang, setLang } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<SupplierRegistration | null>(null);
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState<string>("all");
  const [inquiries, setInquiries] = useState<MockInquiry[]>(INITIAL_INQUIRIES);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Form states for Basic Info
  const [editBusinessName, setEditBusinessName] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editYears, setEditYears] = useState("5-10");
  const [editWorkforce, setEditWorkforce] = useState("11-50");
  const [editMoq, setEditMoq] = useState("51-200");
  const [editCategories, setEditCategories] = useState<string[]>(["tshirt"]);

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
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get("tab") as DashboardTab | null;
      if (
        tabParam &&
        ["overview", "gig", "products", "factory", "inquiries", "support"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
      const actionParam = searchParams.get("action");
      if (actionParam === "addProduct") {
        setActiveModal("addProduct");
      }
    }
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setEditBusinessName(currentUser.businessName || "");
      setEditUserName(currentUser.userName || "");
      setEditPhone(currentUser.phone || "");
      setEditYears(currentUser.yearsInOperation || "5-10");
      setEditWorkforce(currentUser.workforce || "11-50");
      setEditMoq(currentUser.moq || "51-200");
      setEditCategories(currentUser.selectedCategories || ["tshirt"]);

      if (currentUser.profileDetails) {
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
      showToast(isSi ? "දත්ත සාර්ථකව යාවත්කාලීන විය! 🔄" : "Dashboard data refreshed! 🔄");
    }, 450);
  };

  const handleSignOut = () => {
    clearCurrentUser();
    router.push("/signin");
  };

  const handleSaveBasicInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editBusinessName.trim() || !editUserName.trim() || !editPhone.trim()) return;
    if (editCategories.length === 0) {
      showToast(isSi ? "කරුණාකර අවම වශයෙන් එක් ඇඳුම් වර්ගයක් තෝරන්න!" : "Please select at least one garment category!");
      return;
    }

    const updated = updateSupplierBasicInfo(user.id, {
      businessName: editBusinessName.trim(),
      userName: editUserName.trim(),
      phone: editPhone.trim(),
      yearsInOperation: editYears,
      workforce: editWorkforce,
      moq: editMoq,
      selectedCategories: editCategories,
    });

    if (updated) setUser(updated);
    setActiveModal(null);
    showToast(isSi ? "මූලික තොරතුරු සාර්ථකව සුරැකිණි! ✅" : "Basic registration details updated! ✅");
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
        <header className="sticky top-0 z-50 w-full bg-[#020326] px-4 py-3 sm:px-8 shadow-md border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="relative h-9 w-28 sm:h-11 sm:w-36">
                <Image src="/images/logo.png" alt="Apparel Bank" fill priority className="object-contain object-left" />
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-[2.2rem] bg-white p-6 sm:p-10 shadow-sm ring-1 ring-slate-200/80 text-center">
            <div className="mx-auto flex size-18 sm:size-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/50 mb-5">
              <HelpCircle className="size-9 sm:size-10 stroke-[2.5]" />
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0B122F]">
              {isSi ? "පිවිසුමක් අවශ්‍යයි" : "Sign In Required"}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              {isSi
                ? "ඔබගේ ලියාපදිංචි තොරතුරු සහ උපකරණ පුවරුව (Dashboard) බැලීමට කරුණාකර පළමුව ඇතුල් වන්න."
                : "Please sign in to access your supplier dashboard and manage your manufacturing Gig."}
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <Link
                href="/signin"
                className="flex h-13 sm:h-14 w-full items-center justify-center rounded-2xl bg-[#020333] px-6 text-base sm:text-lg font-bold text-white shadow-sm hover:bg-[#020333]/90"
              >
                {isSi ? "ඇතුල් වන්න (Sign In)" : "Sign In"}
              </Link>
              <Link
                href="/"
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-sm sm:text-base"
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

  // Calculate completeness percentage
  let completenessScore = 25; // base registration
  if (hasLocation) completenessScore += 25;
  if (hasLogistics) completenessScore += 25;
  if (hasBranding) completenessScore += 25;

  const filteredProducts = productsList.filter((p) => {
    if (productFilter === "all") return true;
    return p.category === productFilter;
  });

  const navItems = [
    {
      id: "overview" as DashboardTab,
      labelEn: "Overview",
      labelSi: "සාරාංශය",
      icon: LayoutGrid,
      badge: user.status === "approved" ? "Active" : "Review",
      badgeColor: user.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
    },
    {
      id: "gig" as DashboardTab,
      labelEn: "My Live Gig",
      labelSi: "සේවා දැන්වීම",
      icon: Sparkles,
      badge: "Public",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "products" as DashboardTab,
      labelEn: "Garments & Samples",
      labelSi: "ඇඳුම් සාම්පල",
      icon: ShoppingBag,
      badge: `${productsList.length}`,
      badgeColor: "bg-slate-100 text-slate-700",
    },
    {
      id: "factory" as DashboardTab,
      labelEn: "Factory & Operations",
      labelSi: "කර්මාන්තශාලා තොරතුරු",
      icon: Building2,
      badge: completenessScore === 100 ? "100%" : `${completenessScore}%`,
      badgeColor: completenessScore === 100 ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800",
    },
    {
      id: "inquiries" as DashboardTab,
      labelEn: "Buyer Inquiries",
      labelSi: "ගැනුම්කරු විමසීම්",
      icon: MessageSquare,
      badge: `${inquiries.length}`,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "support" as DashboardTab,
      labelEn: "Help & Support",
      labelSi: "උපකාරක සේවය",
      icon: PhoneCall,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F6F8FC] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white w-full overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 lg:hidden backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. SIDE PANEL / SIDEBAR (Responsive, Sticky Desktop, Slide Drawer on Mobile) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[84vw] max-w-xs sm:w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 sm:p-5 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 shadow-xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-5 overflow-y-auto pr-0.5">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between pt-0.5">
            <Link href="/" className="flex items-center gap-2 group">
              <BrandLogo variant="light" size="md" />
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Supplier Mini Profile Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#02032B] to-[#0A1145] p-3.5 sm:p-4 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative size-11 rounded-xl overflow-hidden bg-slate-800 border-2 border-white/20 shrink-0">
                <Image
                  src={user.profileDetails?.factoryBranding?.logoUrl || "/images/categories/shirt.jpg"}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">
                    {user.status === "approved" ? "Verified Supplier" : user.status === "pending" ? "Pending Review" : "Rejected"}
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-black text-white truncate">{user.businessName}</h2>
                <p className="text-[11px] text-slate-300 font-medium truncate">ID: {user.id}</p>
              </div>
            </div>

            {/* Profile Completeness Bar */}
            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-300">
                <span>{isSi ? "ගිණුමේ සම්පූර්ණත්වය" : "Profile Setup"}</span>
                <span className={completenessScore === 100 ? "text-emerald-300" : "text-amber-300"}>
                  {completenessScore}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    completenessScore === 100 ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                  style={{ width: `${completenessScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black tracking-wider uppercase text-slate-400">
              {isSi ? "ප්‍රධාන මෙනුව" : "Main Navigation"}
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 sm:py-3 rounded-2xl text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#020333] text-white shadow-md shadow-[#020333]/15 translate-x-1"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Icon className={`size-4 sm:size-4.5 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                    <span className="truncate">{isSi ? item.labelSi : item.labelEn}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <p className="px-3 text-[10px] font-black tracking-wider uppercase text-slate-400">
              {isSi ? "කෙටි මාර්ග" : "Quick Shortcuts"}
            </p>

            <Link
              href={`/gig/${user.id}`}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="size-3.5" />
                <span>{isSi ? "සේවා දැන්වීම බලන්න" : "View Live Gig"}</span>
              </div>
              <ChevronRight className="size-3" />
            </Link>

            <Link
              href="/marketplace"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              <div className="flex items-center gap-2">
                <Tag className="size-3.5" />
                <span>{isSi ? "වෙළඳපොළට යන්න" : "Marketplace"}</span>
              </div>
              <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-3 border-t border-slate-200/80 space-y-2">
          {/* Language Switcher Pill */}
          <div className="flex items-center justify-between rounded-xl bg-slate-100 p-1">
            <span className="text-xs font-bold text-slate-500 pl-2">
              <Globe className="size-3.5 inline mr-1 text-slate-400" />
              {isSi ? "භාෂාව" : "Lang"}
            </span>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setLang("si")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  lang === "si" ? "bg-white text-[#020333] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                සිං
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  lang === "en" ? "bg-white text-[#020333] shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Refresh & Sign Out */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              <span>{isSi ? "යාවත්කාලීන" : "Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer transition-colors border border-rose-100"
            >
              <LogOut className="size-3.5" />
              <span>{isSi ? "ඉවත් වන්න" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile Hamburger Drawer Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 truncate">
                <span>{isSi ? "සැපයුම්කරු පුවරුව" : "Supplier Portal"}</span>
                <span>/</span>
                <span className="text-slate-700 capitalize truncate">
                  {isSi
                    ? navItems.find((n) => n.id === activeTab)?.labelSi
                    : navItems.find((n) => n.id === activeTab)?.labelEn}
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-[#0B122F] leading-tight truncate">
                {isSi
                  ? navItems.find((n) => n.id === activeTab)?.labelSi
                  : navItems.find((n) => n.id === activeTab)?.labelEn}
              </h1>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <Link
              href={`/gig/${user.id}`}
              className="hidden sm:inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 text-xs font-black transition-colors shadow-2xs"
            >
              <Eye className="size-3.5" />
              <span>{isSi ? "සජීවී සේවා පිටුව (Gig)" : "View Public Gig ↗"}</span>
            </Link>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh"
              className="flex size-9 sm:size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className={`size-3.5 sm:size-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="flex size-9 sm:size-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-14 sm:top-18 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-4 max-w-[90vw]">
            <div className="rounded-2xl bg-[#020333] text-white px-4 sm:px-5 py-3 shadow-2xl border-2 border-emerald-400 text-xs sm:text-sm font-bold flex items-center gap-2.5">
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

        {/* Tab Views Container - Added bottom padding pb-28 for mobile bottom bar */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-5 sm:space-y-6 pb-28 lg:pb-8">
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Top Welcome Hero Banner */}
              <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-gradient-to-r from-[#020333] to-[#121E5C] text-white p-5 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
                <div className="space-y-1.5 sm:space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-extrabold text-amber-300 border border-white/15">
                    <Sparkles className="size-3 sm:size-3.5" />
                    <span>{isSi ? "සැපයුම්කරු කළමනාකරණ පුවරුව" : "Garment Supplier Portal"}</span>
                    <span>•</span>
                    <span>ID: {user.id}</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white">
                    {isSi ? `ආයුබෝවන්, ${user.userName}! 👋` : `Welcome back, ${user.userName}! 👋`}
                  </h2>
                  <p className="text-xs sm:text-base text-slate-300 font-medium max-w-xl">
                    {user.businessName} • 📞 {user.phone} • {district}, Sri Lanka
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2.5 sm:gap-3 relative z-10 pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveModal("addProduct")}
                    className="flex-1 sm:flex-none flex h-11 sm:h-12 items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 text-xs sm:text-sm cursor-pointer shadow-md transition-transform active:scale-98"
                  >
                    <Plus className="size-4 stroke-[3]" />
                    <span>{isSi ? "+ ඇඳුමක් එක් කරන්න" : "+ Add Garment"}</span>
                  </button>

                  <Link
                    href={`/gig/${user.id}`}
                    className="flex-1 sm:flex-none flex h-11 sm:h-12 items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold px-4 sm:px-5 text-xs sm:text-sm cursor-pointer transition-colors border border-white/20"
                  >
                    <Eye className="size-4" />
                    <span>{isSi ? "සේවා දැන්වීම (Gig)" : "View Live Gig"}</span>
                  </Link>
                </div>
              </div>

              {/* Status Banner */}
              {user.status === "approved" && (
                <div className="rounded-[1.6rem] sm:rounded-[1.8rem] bg-emerald-50 border-2 border-emerald-400/90 p-4 sm:p-6 text-emerald-950 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                      <CheckCircle2 className="size-7 sm:size-8 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full mb-1">
                        Verified & Approved
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-emerald-950">
                        {isSi ? "ලියාපදිංචිය සාර්ථකව අනුමත කර ඇත! 🎉" : "Factory Registration Approved! 🎉"}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                        {isSi
                          ? "ඔබගේ සේවා දැන්වීම (Gig) ඇපරල් බෑන්ක් වෙළඳපොළේ සක්‍රීයව පවතී."
                          : "Your manufacturing gig is live and verified on Apparel Bank Marketplace."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("gig")}
                    className="w-full sm:w-auto h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shrink-0"
                  >
                    {isSi ? "දැන්වීම පරීක්ෂා කරන්න" : "Manage Gig"}
                  </button>
                </div>
              )}

              {user.status === "pending" && (
                <div className="rounded-[1.6rem] sm:rounded-[1.8rem] bg-amber-50 border-2 border-amber-400 p-4 sm:p-6 text-amber-950 shadow-2xs flex items-center gap-3 sm:gap-4">
                  <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                    <Clock className="size-7 sm:size-8 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full mb-1">
                      Under Review
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-amber-950">
                      {isSi ? "අයදුම්පත පරීක්ෂා කෙරෙමින් පවතී ⏳" : "Application Under Review ⏳"}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-amber-900">
                      {isSi
                        ? "අපගේ කණ්ඩායම විසින් ඔබගේ තොරතුරු තහවුරු කරමින් පවතී."
                        : "Our team is currently verifying your profile and production capacity."}
                    </p>
                  </div>
                </div>
              )}

              {user.status === "rejected" && (
                <div className="rounded-[1.6rem] sm:rounded-[1.8rem] bg-rose-50 border-2 border-rose-400 p-4 sm:p-6 text-rose-950 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-sm">
                        <XCircle className="size-7 sm:size-8 stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase text-rose-900 bg-rose-200 px-2.5 py-0.5 rounded-full mb-1">
                          Action Required
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-rose-950">
                          {isSi ? "ලියාපදිංචිය තහවුරු කර නැත ❌" : "Application Not Approved ❌"}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-rose-900">
                          {isSi
                            ? "පරිපාලක කණ්ඩායම විසින් ඔබගේ අයදුම්පත සඳහා පහත හේතුව දක්වා ඇත."
                            : "Our admin team reviewed your application and noted the feedback below."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModal("basicInfo")}
                        className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        {isSi ? "තොරතුරු සංස්කරණය" : "Edit Registration"}
                      </button>
                      <a
                        href={`https://wa.me/94112345678?text=${encodeURIComponent(
                          `Hello Apparel Bank Support, I am inquiring about my registration review for "${user.businessName}" (ID: ${user.id}).`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <MessageSquare className="size-3.5" />
                        <span>{isSi ? "WhatsApp සහාය" : "WhatsApp Support"}</span>
                      </a>
                    </div>
                  </div>

                  {user.reviewNotes && (
                    <div className="rounded-2xl bg-white p-3.5 sm:p-4 border border-rose-200 space-y-1">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase text-rose-800 flex items-center gap-1">
                        <AlertCircle className="size-3.5 text-rose-600" />
                        {isSi ? "පරිපාලකගේ සටහන / ප්‍රතික්ෂේප කිරීමට හේතුව:" : "Admin Feedback / Reason for Rejection:"}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-rose-950 leading-relaxed bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                        &ldquo;{user.reviewNotes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Incomplete Profile Alert Prompt (When approved or pending and < 100%) */}
              {completenessScore < 100 && (
                <div className="rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-950">
                        {isSi ? "කර්මාන්තශාලා ගිණුම සම්පූර්ණ කරන්න" : "Action Required: Complete Your Factory Profile"}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-amber-800 font-semibold">
                        {isSi
                          ? "වෙළඳපොළේ Verified Factory ලාංඡනය සක්‍රීය කිරීමට පහත පියවර 3 සම්පූර්ණ කරන්න."
                          : "Fill in the 3 sections below (Business & Location, Operations, Factory Branding) to unlock your Verified Supplier badge."}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
                    {completenessScore}% Completed
                  </span>
                </div>
              )}

              {/* 4 Pulse Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-2xl bg-white p-3.5 sm:p-5 border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400">
                    {isSi ? "ඇඳුම් සාම්පල" : "Active Products"}
                  </span>
                  <p className="text-xl sm:text-3xl font-black text-[#0B122F]">{productsList.length}</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold truncate">In Gig Portfolio</p>
                </div>

                <div className="rounded-2xl bg-white p-3.5 sm:p-5 border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400">
                    {isSi ? "ගැණුම්කරු විමසීම්" : "Buyer Inquiries"}
                  </span>
                  <p className="text-xl sm:text-3xl font-black text-emerald-600">{inquiries.length}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold truncate">RFQ & WhatsApp Leads</p>
                </div>

                <div className="rounded-2xl bg-white p-3.5 sm:p-5 border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400">
                    {isSi ? "අවම ඇණවුම (MOQ)" : "Min Order Qty"}
                  </span>
                  <p className="text-xl sm:text-3xl font-black text-[#0B122F] truncate">{user.moq}</p>
                  <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold truncate">Flexible Tier</p>
                </div>

                <div className="rounded-2xl bg-white p-3.5 sm:p-5 border border-slate-200/90 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400">
                    {isSi ? "නිෂ්පාදන කාලය" : "Lead Time"}
                  </span>
                  <p className="text-xl sm:text-3xl font-black text-[#0B122F] truncate">
                    {leadTime.split(" ")[0]} <span className="text-xs font-bold text-slate-400">Days</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold truncate">Standard Turnaround</p>
                </div>
              </div>

              {/* Complete Your Profile Cards */}
              <div className="space-y-3 sm:space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#0B122F] flex items-center gap-1.5 sm:gap-2">
                      <Sparkles className="size-4 sm:size-5 text-amber-500 fill-amber-500" />
                      <span>{isSi ? "ගිණුම සම්පූර්ණ කරන්න" : "Complete Factory Profile"}</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      {isSi
                        ? "ගැනුම්කරුවන්ට ඔබගේ කර්මාන්තශාලාව පූර්ණ ලෙස ප්‍රදර්ශනය කිරීමට පහත විස්තර ඇතුළත් කරන්න."
                        : "Complete all sections to receive a Verified Supplier badge."}
                    </p>
                  </div>
                  <span className="text-[11px] sm:text-xs font-extrabold text-slate-600 bg-slate-100 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
                    {completenessScore}% {isSi ? "සම්පූර්ණයි" : "Done"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                  {/* Card 1 */}
                  <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <MapPin className="size-4 sm:size-4.5" />
                        </div>
                        {hasLocation ? (
                          <span className="text-[10px] sm:text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Done
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#0B122F]">
                        {isSi ? "ව්‍යාපාර සහ ලිපිනය" : "Business & Location"}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        {isSi ? "BRN අංකය, සමාගම් වර්ගය සහ භෞතික ලිපිනය." : "Registration BRN, legal type & factory street address."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("location")}
                      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 text-xs cursor-pointer transition-colors"
                    >
                      {hasLocation ? (isSi ? "සංස්කරණය" : "Edit Details") : isSi ? "+ තොරතුරු එක් කරන්න" : "+ Add Location"}
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <Truck className="size-4 sm:size-4.5" />
                        </div>
                        {hasLogistics ? (
                          <span className="text-[10px] sm:text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Done
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#0B122F]">
                        {isSi ? "මෙහෙයුම් සහ සැපයුම්" : "Operations & Logistics"}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        {isSi ? "නිෂ්පාදන කාලය, රෙදිපිළි සැපයුම සහ බෙදාහැරීම." : "Lead time, fabric sourcing support & delivery mode."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("logistics")}
                      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 text-xs cursor-pointer transition-colors"
                    >
                      {hasLogistics ? (isSi ? "සංස්කරණය" : "Edit Logistics") : isSi ? "+ තොරතුරු එක් කරන්න" : "+ Add Logistics"}
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          <Building2 className="size-4 sm:size-4.5" />
                        </div>
                        {hasBranding ? (
                          <span className="text-[10px] sm:text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Done
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#0B122F]">
                        {isSi ? "කර්මාන්තශාලා සන්නාමය" : "Factory Branding"}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        {isSi ? "ලාංඡනය (Logo), Gig ආවරණ ඡායාරූපය සහ කෙටි විස්තරය." : "Logo avatar, wide cover banner & factory tagline."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("branding")}
                      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 text-xs cursor-pointer transition-colors"
                    >
                      {hasBranding ? (isSi ? "සංස්කරණය" : "Edit Branding") : isSi ? "+ ඡායාරූප එක් කරන්න" : "+ Upload Branding"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Gig Preview Spotlight */}
              <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-[#020333] text-white p-4 sm:p-7 shadow-md space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-emerald-400 uppercase">
                      <Sparkles className="size-3 sm:size-3.5" />
                      Live Gig Spotlight
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                      {isSi ? "වෙළඳපොළ සේවා පිටුව" : "Public Marketplace Gig"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal("addProduct")}
                      className="flex-1 sm:flex-none h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white text-[#020333] text-xs font-black hover:bg-slate-100 cursor-pointer"
                    >
                      {isSi ? "+ ඇඳුමක් එක් කරන්න" : "+ Add Product"}
                    </button>
                    <Link
                      href={`/gig/${user.id}`}
                      className="flex-1 sm:flex-none h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="size-3.5" />
                      <span>{isSi ? "පිටුව බලන්න ↗" : "View Live ↗"}</span>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-center">
                  <div className="relative h-36 sm:h-44 md:h-48 rounded-2xl overflow-hidden bg-slate-800 border border-white/20">
                    <Image
                      src={user.profileDetails?.factoryBranding?.coverUrl || gigData.coverImage}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                        <ShieldCheck className="size-3" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2.5 sm:space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-9 sm:size-10 rounded-xl overflow-hidden bg-slate-700 border border-white/20 shrink-0">
                        <Image
                          src={user.profileDetails?.factoryBranding?.logoUrl || gigData.seller.avatar}
                          alt="Logo"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm sm:text-base font-black text-white truncate">{user.businessName}</h4>
                        <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                          {district}, Sri Lanka • ⭐ 4.9 Rating
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-2">
                      {gigData.title}
                    </p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-300 pt-0.5">
                      <span className="bg-white/10 px-2.5 py-0.5 sm:py-1 rounded-lg border border-white/10">
                        📦 MOQ: {user.moq}
                      </span>
                      <span className="bg-white/10 px-2.5 py-0.5 sm:py-1 rounded-lg border border-white/10">
                        ⏱️ {leadTime}
                      </span>
                      <span className="bg-white/10 px-2.5 py-0.5 sm:py-1 rounded-lg border border-white/10">
                        👕 {productsList.length} Styles
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MY LIVE GIG */}
          {/* ========================================================================= */}
          {activeTab === "gig" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B122F]">
                    {isSi ? "සජීවී සේවා දැන්වීම (My Live Gig)" : "My Live Manufacturing Gig"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {isSi
                      ? "ගැණුම්කරුවන්ට ඔබගේ කර්මාන්තශාලාව වෙළඳපොළේ දිස්වන ආකාරය මෙතැනින් කළමනාකරණය කරන්න."
                      : "Preview and manage how wholesale clothing buyers see your manufacturing gig."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal("branding")}
                    className="flex-1 sm:flex-none h-10 px-3 sm:px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer shadow-2xs"
                  >
                    {isSi ? "කවරය / ලාංඡනය" : "Edit Cover & Logo"}
                  </button>
                  <Link
                    href={`/gig/${user.id}`}
                    className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="size-3.5" />
                    <span>{isSi ? "ප්‍රසිද්ධ පිටුව ↗" : "View Live ↗"}</span>
                  </Link>
                </div>
              </div>

              {/* Live Gig Preview Card */}
              <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-5 p-4 sm:p-7">
                {/* Widescreen Banner */}
                <div className="relative h-48 sm:h-64 md:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <Image
                    src={user.profileDetails?.factoryBranding?.coverUrl || gigData.coverImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 shadow-md">
                        <ShieldCheck className="size-3.5" />
                        Verified Apparel Manufacturer
                      </span>

                      <button
                        type="button"
                        onClick={() => setActiveModal("branding")}
                        className="bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/30 cursor-pointer"
                      >
                        {isSi ? "වෙනස් කරන්න" : "Change Cover"}
                      </button>
                    </div>

                    <div className="text-white space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="relative size-10 sm:size-12 rounded-xl overflow-hidden border-2 border-white bg-slate-800 shrink-0 shadow-md">
                          <Image
                            src={user.profileDetails?.factoryBranding?.logoUrl || gigData.seller.avatar}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-base sm:text-xl font-black text-white truncate">{user.businessName}</h3>
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {district}, Sri Lanka • 📞 {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gig Title & Overview */}
                <div className="space-y-3">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-lg sm:text-2xl font-black text-[#0B122F]">
                      {gigData.title}
                    </h3>
                    <p className="text-xs sm:text-base text-slate-600 font-medium mt-1.5 leading-relaxed">
                      {gigData.overview}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Starting Price</span>
                      <p className="text-sm sm:text-base font-black text-[#0B122F]">{gigData.startingPrice} / pc</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Minimum MOQ</span>
                      <p className="text-sm sm:text-base font-black text-[#0B122F]">{user.moq}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Lead Time</span>
                      <p className="text-sm sm:text-base font-black text-[#0B122F]">{leadTime}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Workforce</span>
                      <p className="text-sm sm:text-base font-black text-[#0B122F]">{user.workforce} Staff</p>
                    </div>
                  </div>
                </div>

                {/* Packages Breakdown */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-sm sm:text-base font-black text-[#0B122F]">
                    {isSi ? "සේවා පැකේජ (Gig Packages)" : "Configured Gig Packages"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {/* Basic */}
                    <div className="rounded-2xl border border-slate-200 p-3.5 sm:p-4 space-y-2.5 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm text-[#0B122F]">Basic / Pilot Run</span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Sample Tier
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Initial fit sample + 50 pieces batch production for validation.
                      </p>
                      <div className="text-xs font-bold text-slate-700 space-y-1 pt-1 border-t border-slate-100">
                        <p>✓ 1 Prototype Sample</p>
                        <p>✓ Standard Sizing</p>
                        <p>✓ Lead time: 7-10 Days</p>
                      </div>
                    </div>

                    {/* Standard */}
                    <div className="rounded-2xl border-2 border-[#020333] p-3.5 sm:p-4 space-y-2.5 bg-blue-50/30 relative">
                      <div className="absolute -top-2.5 right-3 bg-[#020333] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        POPULAR
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm text-[#0B122F]">Standard Bulk</span>
                        <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          Commercial
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        100 - 500 pieces bulk cut & sew with custom branding & labels.
                      </p>
                      <div className="text-xs font-bold text-slate-700 space-y-1 pt-1 border-t border-slate-200/60">
                        <p>✓ Custom Neck Labels</p>
                        <p>✓ Fabric Sourcing Support</p>
                        <p>✓ Lead time: 14-21 Days</p>
                      </div>
                    </div>

                    {/* Premium */}
                    <div className="rounded-2xl border border-slate-200 p-3.5 sm:p-4 space-y-2.5 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm text-[#0B122F]">Enterprise Export</span>
                        <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          Enterprise
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        500+ pieces full turnkey production, individual polybagging and door delivery.
                      </p>
                      <div className="text-xs font-bold text-slate-700 space-y-1 pt-1 border-t border-slate-100">
                        <p>✓ Full In-House Sourcing</p>
                        <p>✓ Custom Hangtags & Barcoding</p>
                        <p>✓ Doorstep Delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: GARMENTS & SAMPLES */}
          {/* ========================================================================= */}
          {activeTab === "products" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B122F]">
                    {isSi ? "ඇඳුම් සාම්පල කළමනාකරණය" : "Garment Catalog & Samples"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {isSi
                      ? "ඔබ නිපදවන ඇඳුම් සාම්පල, මිල ගණන් සහ ඡායාරූප මෙතැනින් එකතු කරන්න හෝ ඉවත් කරන්න."
                      : "Add clothing styles, fabric specifications, MOQ, and photos to showcase in your Gig."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal("addProduct")}
                  className="flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 text-white font-black px-5 sm:px-6 text-xs sm:text-sm cursor-pointer shadow-md transition-all active:scale-98"
                >
                  <Plus className="size-4 stroke-[3]" />
                  <span>{isSi ? "+ අලුත් ඇඳුමක් එක් කරන්න" : "+ Add Garment Sample"}</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">
                  <SlidersHorizontal className="size-3.5 inline mr-1" />
                  Filter:
                </span>
                {[
                  { id: "all", label: "All Products (සියල්ල)" },
                  { id: "tshirt", label: "T-Shirts (ටී-ෂර්ට්)" },
                  { id: "shirt", label: "Shirts (කමිස)" },
                  { id: "trousers", label: "Trousers (කලිසම්)" },
                  { id: "dresses", label: "Dresses (ගවුම්)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProductFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      productFilter === tab.id
                        ? "bg-[#020333] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white border-2 border-dashed border-slate-200 p-6 sm:p-12 text-center space-y-3 sm:space-y-4 shadow-2xs">
                  <ShoppingBag className="size-12 sm:size-14 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-[#0B122F]">
                      {isSi ? "ඇඳුම් සාම්පල කිසිවක් හමු නොවීය" : "No Garment Samples Found"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                      {isSi
                        ? "ගැනුම්කරුවන්ට පෙන්වීමට ඔබ නිපදවන පළමු ඇඳුම මෙතැනින් එකතු කරන්න."
                        : "Add your manufactured apparel samples to showcase stitch quality, fabric, and pricing."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal("addProduct")}
                    className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 sm:px-6 text-xs sm:text-sm cursor-pointer shadow-sm"
                  >
                    <Plus className="size-4 stroke-[3]" />
                    <span>{isSi ? "පළමු ඇඳුම එක් කරන්න" : "Add Garment Sample"}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Product Image */}
                        <div className="relative h-40 sm:h-44 w-full bg-slate-100">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="rounded-lg bg-[#020333]/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 uppercase">
                              {categoryLabels[prod.category]?.[isSi ? "si" : "en"] || prod.category}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className="rounded-lg bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 shadow-sm">
                              {prod.pricePerUnit}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-3.5 sm:p-4 space-y-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-[#0B122F] line-clamp-1">
                            {prod.name}
                          </h4>

                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <span>📦 MOQ: <strong className="text-slate-800">{prod.moq}</strong></span>
                            {prod.material && (
                              <>
                                <span>•</span>
                                <span className="truncate">🧵 {prod.material}</span>
                              </>
                            )}
                          </div>

                          {prod.description && (
                            <p className="text-xs text-slate-500 font-medium line-clamp-2 pt-1 border-t border-slate-100">
                              {prod.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between border-t border-slate-100 pt-2.5">
                        <span className="text-[10px] font-bold text-slate-400">ID: {prod.id}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                          <span>{isSi ? "ඉවත් කරන්න" : "Delete"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: FACTORY & OPERATIONS */}
          {/* ========================================================================= */}
          {activeTab === "factory" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B122F]">
                  {isSi ? "කර්මාන්තශාලා සහ මෙහෙයුම් තොරතුරු" : "Factory & Operations Profile"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {isSi
                    ? "ව්‍යාපාර ලියාපදිංචිය, ලිපිනය, නිෂ්පාදන ධාරිතාව සහ ප්‍රවාහන පහසුකම්."
                    : "Manage official business registration, factory premises address, and production capacities."}
                </p>
              </div>

              {/* 4 Detail Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Business & Legal Details */}
                <div className="rounded-[1.8rem] sm:rounded-[2rem] bg-white p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <MapPin className="size-4.5 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-[#0B122F]">
                        {isSi ? "ව්‍යාපාර සහ ලිපිනය" : "Business & Location"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("location")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {isSi ? "සංස්කරණය" : "Edit Details"}
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">BRN Number</span>
                      <span className="font-extrabold text-slate-800">{brn || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Legal Type</span>
                      <span className="font-extrabold text-slate-800">{businessType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">District</span>
                      <span className="font-extrabold text-slate-800">{district}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Factory Address</span>
                      <span className="font-extrabold text-slate-800 text-right max-w-[200px] truncate">{address || "Pending setup"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400 font-bold">Postal Code</span>
                      <span className="font-extrabold text-slate-800">{postalCode || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Operations & Logistics Details */}
                <div className="rounded-[1.8rem] sm:rounded-[2rem] bg-white p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Truck className="size-4.5 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-[#0B122F]">
                        {isSi ? "මෙහෙයුම් සහ සැපයුම්" : "Operations & Logistics"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("logistics")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {isSi ? "සංස්කරණය" : "Edit Details"}
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Lead Time</span>
                      <span className="font-extrabold text-slate-800">{leadTime}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Fabric Sourcing</span>
                      <span className="font-extrabold text-slate-800 text-right max-w-[200px] truncate">{fabricSourcing}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Sample Policy</span>
                      <span className="font-extrabold text-slate-800 text-right max-w-[200px] truncate">{sampleAvailability}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Delivery Mode</span>
                      <span className="font-extrabold text-slate-800 text-right max-w-[200px] truncate">{deliveryCapability}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400 font-bold">Payment Terms</span>
                      <span className="font-extrabold text-slate-800 text-right max-w-[200px] truncate">{paymentTerms}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Factory Branding */}
                <div className="rounded-[1.8rem] sm:rounded-[2rem] bg-white p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Building2 className="size-4.5 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-[#0B122F]">
                        {isSi ? "සන්නාමය සහ මාධ්‍ය" : "Factory Branding & Media"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("branding")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {isSi ? "සංස්කරණය" : "Edit Media"}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative size-12 sm:size-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image src={logoUrl} alt="Logo" fill className="object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-400 uppercase">Logo Avatar</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{logoUrl}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-400 uppercase">Tagline / Bio</span>
                    <p className="font-semibold text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {tagline || "Export-ready quality garment manufacturer specialized in knit & woven apparel."}
                    </p>
                  </div>
                </div>

                {/* 4. Registration Summary with Direct Edit Button */}
                <div className="rounded-[1.8rem] sm:rounded-[2rem] bg-white p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <FileCheck className="size-4.5 sm:size-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-[#0B122F]">
                        {isSi ? "ලියාපදිංචි මූලික තොරතුරු" : "Basic Registration & Capacity"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal("basicInfo")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="size-3" />
                      <span>{isSi ? "සංස්කරණය" : "Edit Details"}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Business / Factory Name</span>
                      <span className="font-extrabold text-slate-800">{user.businessName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Contact Name & Phone</span>
                      <span className="font-extrabold text-slate-800">{user.userName} • {user.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Operational Experience</span>
                      <span className="font-extrabold text-slate-800">
                        {yearsLabels[user.yearsInOperation]?.[isSi ? "si" : "en"] || user.yearsInOperation}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Workforce Size</span>
                      <span className="font-extrabold text-slate-800">
                        {workforceLabels[user.workforce]?.[isSi ? "si" : "en"] || user.workforce}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400 font-bold">Min Order Qty (MOQ)</span>
                      <span className="font-extrabold text-slate-800">
                        {moqLabels[user.moq]?.[isSi ? "si" : "en"] || user.moq}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block mb-1.5">Registered Categories</span>
                      <div className="flex flex-wrap gap-1.5">
                        {user.selectedCategories?.map((catId) => (
                          <span
                            key={catId}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900 border border-blue-200"
                          >
                            <Check className="size-3 text-blue-600" />
                            {categoryLabels[catId]?.[isSi ? "si" : "en"] || catId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: BUYER INQUIRIES */}
          {/* ========================================================================= */}
          {activeTab === "inquiries" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B122F]">
                    {isSi ? "ගැනුම්කරු විමසීම් සහ ඇණවුම්" : "Buyer Inquiries & Quote Requests (RFQ)"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {isSi
                      ? "ඇපරල් බෑන්ක් වෙළඳපොළෙන් ඔබගේ කර්මාන්තශාලාවට ලැබුණු ඇඳුම් තොග ඇණවුම් විමසීම්."
                      : "Wholesale garment buyers interested in your factory production capacity."}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-900 px-3.5 py-1 text-xs font-black self-start sm:self-auto">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                  {inquiries.length} Active Leads
                </span>
              </div>

              {/* Inquiries List */}
              <div className="space-y-3.5 sm:space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-2xl bg-white p-4 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-3 sm:space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-[#0B122F]">{inq.buyerName}</span>
                          <span className="text-xs font-semibold text-slate-400 truncate">• {inq.buyerCompany}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">{inq.date}</p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {inq.status === "new" && (
                          <span className="rounded-full bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 border border-amber-200">
                            🔥 New Inquiry
                          </span>
                        )}
                        {inq.status === "sample_requested" && (
                          <span className="rounded-full bg-blue-100 text-blue-900 text-[11px] font-black px-2.5 py-0.5 border border-blue-200">
                            📦 Sample Requested
                          </span>
                        )}
                        {inq.status === "discussion" && (
                          <span className="rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black px-2.5 py-0.5 border border-emerald-200">
                            💬 In Discussion
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Garment Style</span>
                        <strong className="text-slate-800">{inq.category}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Order Quantity</span>
                        <strong className="text-slate-800">{inq.quantity}</strong>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-slate-400 font-bold block text-[10px]">Direct Phone</span>
                        <strong className="text-slate-800">{inq.phone}</strong>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      &quot;{inq.message}&quot;
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                      <span className="text-[11px] text-slate-400 font-bold">RFQ ID: {inq.id}</span>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={`https://wa.me/94${inq.phone.replace(/^0/, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          <Send className="size-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${inq.phone}`}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          <Phone className="size-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: HELP & SUPPORT */}
          {/* ========================================================================= */}
          {activeTab === "support" && (
            <div className="space-y-5 sm:space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B122F]">
                  {isSi ? "උපකාර සහ පාරිභෝගික සහාය" : "Help & Supplier Assistance"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {isSi
                    ? "ඔබගේ ගිණුම හෝ වෙළඳපොළ සම්බන්ධ ඕනෑම ගැටළුවක් සඳහා අපගේ කණ්ඩායම අමතන්න."
                    : "Direct hotline and step-by-step guidance for garment factory owners and suppliers."}
                </p>
              </div>

              {/* Big Hotline Card */}
              <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-gradient-to-br from-indigo-900 to-[#020333] p-5 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-md">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex size-12 sm:size-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                    <PhoneCall className="size-6 sm:size-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black">
                      {isSi ? "සැපයුම්කරු උපකාරක දුරකථන අංකය" : "Supplier Support Hotline"}
                    </h3>
                    <p className="text-xs sm:text-sm text-indigo-200 font-semibold mt-0.5">
                      {isSi ? "සඳුදා - සිකුරාදා (පෙ.ව. 8.30 - ප.ව. 5.00)" : "Monday - Friday (8:30 AM - 5:00 PM)"}
                    </p>
                  </div>
                </div>

                <a
                  href="tel:0112345678"
                  className="w-full sm:w-auto flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-white px-6 sm:px-8 font-black text-base sm:text-lg text-indigo-950 hover:bg-white/95 active:scale-98 shadow-md transition-all shrink-0"
                >
                  <Phone className="size-4 sm:size-5" />
                  <span>011 234 5678</span>
                </a>
              </div>

              {/* FAQ Accordion */}
              <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-white p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-black text-[#0B122F] flex items-center gap-2">
                  <QuestionIcon className="size-4.5 sm:size-5 text-blue-600" />
                  <span>{isSi ? "නිතර අසන ප්‍රශ්න (FAQ)" : "Frequently Asked Questions"}</span>
                </h3>

                <div className="space-y-2.5 sm:space-y-3 pt-1">
                  {[
                    {
                      qEn: "How does a buyer contact my garment factory?",
                      qSi: "ගැණුම්කරුවෙකු මාගේ කර්මාන්තශාලාව සම්බන්ධ කරගන්නේ කෙසේද?",
                      aEn: "Wholesale buyers browse verified gigs on Apparel Bank Marketplace. They can send an instant Quote Request (RFQ) or message you directly via WhatsApp.",
                      aSi: "ඇපරල් බෑන්ක් වෙළඳපොළේ සජීවී සේවා දැන්වීම (Gig) හරහා ගැනුම්කරුවන් ඔබගේ දුරකථන අංකය හෝ WhatsApp මඟින් සෘජුවම සම්බන්ධ වේ.",
                    },
                    {
                      qEn: "How do I get the 'Verified Supplier' badge?",
                      qSi: "'Verified Supplier' ලාංඡනය ලබා ගන්නේ කෙසේද?",
                      aEn: "Complete your Business & Location (BRN) details, operations data, and upload at least one garment sample photo.",
                      aSi: "ඔබගේ ව්‍යාපාර ලියාපදිංචි අංකය (BRN), ලිපිනය සහ අවම වශයෙන් එක් ඇඳුම් සාම්පලයක් ඇතුළත් කළ පසු අප කණ්ඩායම විසින් පරීක්ෂා කර අනුමත කරනු ලැබේ.",
                    },
                    {
                      qEn: "Can I change my MOQ (Minimum Order Quantity) later?",
                      qSi: "මාගේ අවම ඇණවුම් ප්‍රමාණය (MOQ) පසුව වෙනස් කළ හැකිද?",
                      aEn: "Yes, you can edit product samples anytime from the 'Garments & Samples' tab to reflect your updated production line capacity.",
                      aSi: "ඔව්, 'ඇඳුම් සාම්පල' මෙනුවෙන් ඔබට අවශ්‍ය ඕනෑම වේලාවක සාම්පල සහ MOQ වෙනස් කළ හැක.",
                    },
                  ].map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                        className="w-full p-3.5 sm:p-4 text-left font-extrabold text-xs sm:text-base text-[#0B122F] flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="pr-2">{isSi ? faq.qSi : faq.qEn}</span>
                        <ChevronRight
                          className={`size-4 text-slate-400 shrink-0 transition-transform ${
                            faqOpen === idx ? "rotate-90 text-blue-600" : ""
                          }`}
                        />
                      </button>
                      {faqOpen === idx && (
                        <div className="p-3.5 sm:p-4 pt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-white border-t border-slate-100">
                          {isSi ? faq.aSi : faq.aEn}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Instant 1-Tap Tab Switching on Phones) */}
      {/* ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        {[
          { id: "overview" as DashboardTab, icon: LayoutGrid, labelEn: "Overview", labelSi: "සාරාංශය" },
          { id: "gig" as DashboardTab, icon: Sparkles, labelEn: "Gig", labelSi: "Gig" },
          { id: "products" as DashboardTab, icon: ShoppingBag, labelEn: "Samples", labelSi: "සාම්පල" },
          { id: "factory" as DashboardTab, icon: Building2, labelEn: "Factory", labelSi: "විස්තර" },
          { id: "inquiries" as DashboardTab, icon: MessageSquare, labelEn: "Leads", labelSi: "විමසීම්", badge: inquiries.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
                isActive ? "text-[#020333] font-black" : "text-slate-400 hover:text-slate-700 font-bold"
              }`}
            >
              <div className="relative">
                <Icon className={`size-5 ${isActive ? "text-[#020333] stroke-[2.5]" : "text-slate-400"}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 size-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{isSi ? tab.labelSi : tab.labelEn}</span>
              {isActive && <span className="size-1 rounded-full bg-[#020333] mt-0.5" />}
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* MODAL 0: BASIC REGISTRATION INFO EDIT */}
      {/* ========================================================================= */}
      {activeModal === "basicInfo" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <FileCheck className="size-4.5 sm:size-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black text-[#0B122F]">
                    {isSi ? "මූලික ලියාපදිංචි තොරතුරු සංස්කරණය" : "Edit Basic Registration Info"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isSi ? "ව්‍යාපාරයේ නම, දුරකථනය, MOQ සහ ඇඳුම් වර්ග" : "Update factory name, contact, MOQ and categories"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5 sm:size-6" />
              </button>
            </div>

            <form onSubmit={handleSaveBasicInfo} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  {isSi ? "ව්‍යාපාරයේ / කර්මාන්තශාලාවේ නම *" : "Business / Factory Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={editBusinessName}
                  onChange={(e) => setEditBusinessName(e.target.value)}
                  placeholder="e.g. Lanka Weave Handlooms"
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "අයිතිකරු / කළමනාකරුගේ නම *" : "Contact Person Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    placeholder="e.g. Sunil Bandara"
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "ජංගම දුරකථන අංකය *" : "Mobile Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. 0771234567"
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "ආයතනයේ වයස *" : "Years in Operation *"}
                  </label>
                  <select
                    value={editYears}
                    onChange={(e) => setEditYears(e.target.value)}
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm font-semibold outline-none focus:border-[#020333] bg-white cursor-pointer"
                  >
                    <option value="under1">&lt; 1 Year (අවුරුදු 1ට අඩු)</option>
                    <option value="1-5">1 - 5 Years (අවුරුදු 1 - 5)</option>
                    <option value="5-10">5 - 10 Years (අවුරුදු 5 - 10)</option>
                    <option value="10plus">10+ Years (අවුරුදු 10ට වැඩි)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    {isSi ? "සේවක සංඛ්‍යාව *" : "Workforce Size *"}
                  </label>
                  <select
                    value={editWorkforce}
                    onChange={(e) => setEditWorkforce(e.target.value)}
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm font-semibold outline-none focus:border-[#020333] bg-white cursor-pointer"
                  >
                    <option value="1-10">1 - 10 Employees (1 - 10)</option>
                    <option value="11-50">11 - 50 Employees (11 - 50)</option>
                    <option value="51-200">51 - 200 Employees (51 - 200)</option>
                    <option value="200plus">200+ Employees (200+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  {isSi ? "අවම ඇණවුම් ප්‍රමාණය (MOQ) *" : "Minimum Order Quantity (MOQ) *"}
                </label>
                <select
                  value={editMoq}
                  onChange={(e) => setEditMoq(e.target.value)}
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm font-semibold outline-none focus:border-[#020333] bg-white cursor-pointer"
                >
                  <option value="1-50">1 - 50 Pieces (කෑලි 1 - 50)</option>
                  <option value="51-200">51 - 200 Pieces (කෑලි 51 - 200)</option>
                  <option value="201-500">201 - 500 Pieces (කෑලි 201 - 500)</option>
                  <option value="500plus">500+ Pieces (කෑලි 500ට වැඩි)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  {isSi ? "නිෂ්පාදනය කරන ඇඳුම් වර්ග (තෝරන්න) *" : "Garment Categories Manufactured *"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "tshirt", label: "T-Shirts (ටී-ෂර්ට්)" },
                    { id: "shirt", label: "Shirts (කමිස)" },
                    { id: "trousers", label: "Trousers (කලිසම්)" },
                    { id: "dresses", label: "Dresses (ගවුම්)" },
                  ].map((cat) => {
                    const isChecked = editCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            if (editCategories.length > 1) {
                              setEditCategories(editCategories.filter((c) => c !== cat.id));
                            }
                          } else {
                            setEditCategories([...editCategories, cat.id]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-50 border-blue-500 text-blue-900 shadow-2xs font-extrabold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isChecked && <Check className="size-4 text-blue-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3 sm:py-3.5 text-sm sm:text-base font-extrabold text-white shadow-md cursor-pointer active:scale-98"
                >
                  {isSi ? "තොරතුරු සුරකින්න" : "Save Registration Details"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl sm:rounded-2xl border-2 border-slate-200 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD PRODUCT / SAMPLE TO GIG */}
      {/* ========================================================================= */}
      {activeModal === "addProduct" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <ShoppingBag className="size-5 sm:size-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black text-[#0B122F]">
                    {isSi ? "අලුත් ඇඳුම් සාම්පලයක් එක් කරන්න" : "Add Product / Sample to Gig"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isSi ? "පාරිභෝගිකයින්ට පෙන්වීම සඳහා සාම්පලයක් ඇතුළත් කරන්න" : "Add garment style & photo to your public Gig"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5 sm:size-6" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3.5">
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333]"
                />
              </div>

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
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333] cursor-pointer bg-white"
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
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333]"
                  />
                </div>
              </div>

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
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333]"
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
                    className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-[#020333]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  {isSi ? "සාම්පල ඡායාරූපය (Sample Photo) *" : "Sample Photo *"}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                    <Image src={productImage} alt="Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      placeholder="/images/categories/tshirt.jpg"
                      className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold outline-none focus:border-[#020333]"
                    />
                    <div className="flex flex-wrap gap-1">
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

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  {isSi ? "කෙටි විස්තරය (Description)" : "Short Description"}
                </label>
                <textarea
                  rows={2}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="e.g. Export finish, double needle stitch, customizable collar and tag."
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-[#020333]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3 sm:py-3.5 text-sm sm:text-base font-extrabold text-white shadow-md cursor-pointer active:scale-98"
                >
                  {isSi ? "ඇඳුම සුරකින්න (Save Product)" : "Save Product to Gig"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl sm:rounded-2xl border-2 border-slate-200 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BUSINESS & LOCATION FORM */}
      {/* ========================================================================= */}
      {activeModal === "location" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <MapPin className="size-4.5 sm:size-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#0B122F]">
                    {isSi ? "ව්‍යාපාර සහ ලිපින තොරතුරු" : "Business & Location"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
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

            <form onSubmit={handleSaveLocation} className="mt-4 space-y-3.5">
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "ව්‍යාපාර වර්ගය *" : "Business Legal Type *"}
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600 cursor-pointer bg-white"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600 cursor-pointer bg-white"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2 text-xs sm:text-base font-semibold outline-none focus:border-blue-600"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-sm cursor-pointer"
                >
                  {isSi ? "සුරකින්න (Save Location)" : "Save Business & Location"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: OPERATIONS & LOGISTICS FORM */}
      {/* ========================================================================= */}
      {activeModal === "logistics" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Truck className="size-4.5 sm:size-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#0B122F]">
                    {isSi ? "මෙහෙයුම් සහ සැපයුම් තොරතුරු" : "Operations & Logistics"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
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

            <form onSubmit={handleSaveLogistics} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "සාමාන්‍ය නිෂ්පාදන කාලය (Lead Time) *" : "Production Lead Time *"}
                </label>
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600 cursor-pointer bg-white"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600 cursor-pointer bg-white"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600 cursor-pointer bg-white"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600 cursor-pointer bg-white"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-sm cursor-pointer"
                >
                  {isSi ? "සුරකින්න (Save Logistics)" : "Save Logistics Details"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isSi ? "අවලංගු කරන්න" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FACTORY BRANDING FORM */}
      {/* ========================================================================= */}
      {activeModal === "branding" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Building2 className="size-4.5 sm:size-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#0B122F]">
                    {isSi ? "කර්මාන්තශාලා සන්නාමය" : "Factory Branding"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
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

            <form onSubmit={handleSaveBranding} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  {isSi ? "ව්‍යාපාර ලාංඡනය (Logo Avatar) *" : "Business Logo Avatar *"}
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative size-12 sm:size-14 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                    <Image src={logoUrl} alt="Logo Preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="/images/categories/shirt.jpg"
                      className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold outline-none focus:border-blue-600"
                    />
                    <div className="flex gap-1">
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
                <div className="space-y-1.5">
                  <div className="relative h-24 sm:h-28 w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs">
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
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold outline-none focus:border-blue-600"
                  />
                  <div className="flex flex-wrap gap-1 pt-0.5">
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
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2 text-xs sm:text-base font-semibold outline-none focus:border-blue-600"
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
                  className="w-full rounded-xl sm:rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl sm:rounded-2xl bg-[#020333] hover:bg-[#020333]/90 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-sm cursor-pointer"
                >
                  {isSi ? "සුරකින්න (Save Branding)" : "Save Factory Branding"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl sm:rounded-2xl border border-slate-200 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-base font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
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

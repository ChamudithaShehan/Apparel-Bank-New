import { SupplierRegistration, getRegistrations } from "./registrations";

export interface GigPackage {
  name: string;
  description: string;
  moq: string;
  pricePerUnit: string;
  deliveryDays: string;
  features: string[];
}

export interface SupplierGig {
  id: string;
  supplierId: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  galleryImages: string[];
  seller: {
    name: string;
    businessName: string;
    avatar: string;
    level: "Verified Manufacturer" | "Top Rated Supplier" | "Rising Talent";
    rating: number;
    reviewCount: number;
    responseTime: string;
    location: string;
  };
  startingPrice: string;
  moq: string;
  turnaroundTime: string;
  workforce: string;
  yearsInOperation: string;
  overview: string;
  features: string[];
  packages: {
    basic: GigPackage;
    standard: GigPackage;
    premium: GigPackage;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const GIG_STORAGE_KEY = "apparel_bank_supplier_gigs";

const categoryImageMap: Record<string, string> = {
  tshirt: "/images/categories/tshirt.jpg",
  shirt: "/images/categories/shirt.jpg",
  trousers: "/images/categories/trousers.jpg",
  dresses: "/images/categories/dresses.jpg",
};

const categoryTitleMap: Record<string, string> = {
  tshirt: "Custom T-Shirts, Polos & Knitwear Manufacturing",
  shirt: "Export-Quality Formal & Casual Shirts Production",
  trousers: "Tailored Trousers, Chinos & Pants Manufacturing",
  dresses: "High-Fashion Dresses, Frocks & Woven Garments",
};

// Generate a Fiverr-style Gig object from a supplier registration record
export function generateGigFromSupplier(supplier: SupplierRegistration): SupplierGig {
  const primaryCat = supplier.selectedCategories?.[0] || "tshirt";
  const catNames = supplier.selectedCategories?.map((c) => categoryTitleMap[c] || c).join(" & ") || "Apparel";

  const coverImg = categoryImageMap[primaryCat] || "/images/categories/tshirt.jpg";
  const gallery = supplier.selectedCategories?.map((c) => categoryImageMap[c]).filter(Boolean) || [coverImg];

  const moqText = supplier.moq === "1-50" ? "50 pcs" : supplier.moq === "51-200" ? "100 pcs" : "500 pcs";

  return {
    id: `GIG-${supplier.id.replace("REG-", "")}`,
    supplierId: supplier.id,
    title: `I will manufacture custom ${catNames} for your clothing brand`,
    slug: `gig-${supplier.id.toLowerCase()}`,
    category: primaryCat,
    coverImage: supplier.profileDetails?.factoryBranding?.coverUrl || coverImg,
    galleryImages: gallery.length > 0 ? gallery : [coverImg],
    seller: {
      name: supplier.userName,
      businessName: supplier.businessName,
      avatar: supplier.profileDetails?.factoryBranding?.logoUrl || coverImg,
      level: supplier.yearsInOperation === "10plus" ? "Top Rated Supplier" : "Verified Manufacturer",
      rating: 4.9,
      reviewCount: Math.floor(12 + Math.random() * 45),
      responseTime: "1 Hour",
      location: supplier.profileDetails?.businessAndLocation?.district || "Sri Lanka",
    },
    startingPrice: primaryCat === "tshirt" ? "LKR 750" : primaryCat === "shirt" ? "LKR 1,200" : "LKR 1,500",
    moq: supplier.moq,
    turnaroundTime: supplier.profileDetails?.operationsAndLogistics?.leadTime || "14 - 21 Days",
    workforce: supplier.workforce,
    yearsInOperation: supplier.yearsInOperation,
    overview:
      supplier.profileDetails?.factoryBranding?.tagline ||
      `Professional garment manufacturing service by ${supplier.businessName}. We specialize in high-precision cut & sew, fabric sourcing, customized tech-pack execution, and bulk apparel production.`,
    features: [
      "Custom Pattern Making & Tech-Pack Review",
      "Fabric & Trims In-House Sourcing",
      "High-Density Screen Printing & Embroidery",
      "Custom Brand Labeling & Tagging",
      "AQL 2.5 Quality Control Inspection",
      "Islandwide Doorstep Delivery / Export Packing",
    ],
    packages: {
      basic: {
        name: "Prototype & Sample Batch",
        description: "1 to 5 prototype sample pieces with custom grading and fabric test",
        moq: "1 - 5 Pcs",
        pricePerUnit: "LKR 2,500",
        deliveryDays: "5 Days",
        features: ["1 Sample Fit", "Pattern Grading", "Fabric Swatches", "Tech Pack Consultation"],
      },
      standard: {
        name: "Boutique Production Run",
        description: `Small-to-medium batch (${moqText}) with custom brand labels and screen print`,
        moq: supplier.moq,
        pricePerUnit: primaryCat === "tshirt" ? "LKR 950" : "LKR 1,450",
        deliveryDays: "14 Days",
        features: ["Full Batch Production", "Custom Labels & Tags", "Standard Packaging", "QC Check"],
      },
      premium: {
        name: "Commercial Export Run",
        description: "Bulk volume order (500+ pcs) with dedicated production line and priority shipping",
        moq: "500+ Pcs",
        pricePerUnit: primaryCat === "tshirt" ? "LKR 750" : "LKR 1,150",
        deliveryDays: "21 Days",
        features: ["Full Commercial Run", "Custom Trim & Accessories", "Export Barcode Packing", "Dedicated Account Manager"],
      },
    },
    status: supplier.status,
    createdAt: supplier.submittedAt,
  };
}

// Get all active Gigs synchronized with the latest supplier registrations
export function getAllGigs(): SupplierGig[] {
  const suppliers = getRegistrations();
  return suppliers.map((supplier) => generateGigFromSupplier(supplier));
}

// Find a single Gig by supplier ID or Gig ID
export function getGigById(id: string): SupplierGig | null {
  const allGigs = getAllGigs();
  return (
    allGigs.find((g) => g.id === id || g.supplierId === id || g.slug === id) || null
  );
}

export interface BusinessAndLocation {
  brn?: string;
  businessType?: string;
  district?: string;
  address?: string;
  postalCode?: string;
}

export interface OperationsAndLogistics {
  leadTime?: string;
  fabricSourcing?: string;
  sampleAvailability?: string;
  deliveryCapability?: string;
  paymentTerms?: string;
}

export interface FactoryBranding {
  logoUrl?: string;
  coverUrl?: string;
  tagline?: string;
  websiteOrSocial?: string;
}

export interface GigProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  pricePerUnit: string;
  moq: string;
  material?: string;
  description?: string;
}

export interface SupplierProfileDetails {
  businessAndLocation?: BusinessAndLocation;
  operationsAndLogistics?: OperationsAndLogistics;
  factoryBranding?: FactoryBranding;
  products?: GigProduct[];
}

export interface SupplierRegistration {
  id: string;
  businessName: string;
  userName: string;
  phone: string;
  yearsInOperation: string;
  workforce: string;
  moq: string;
  selectedCategories: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewNotes?: string;
  profileDetails?: SupplierProfileDetails;
}

const STORAGE_KEY = "apparel_bank_registrations";
const CURRENT_USER_KEY = "apparel_bank_current_user";

export const INITIAL_REGISTRATIONS: SupplierRegistration[] = [
  {
    id: "REG-8012",
    businessName: "Lanka Weave Handlooms",
    userName: "Sunil Bandara",
    phone: "0771234567",
    yearsInOperation: "5-10",
    workforce: "11-50",
    moq: "51-200",
    selectedCategories: ["shirt", "tshirt"],
    status: "approved",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reviewNotes: "All documents verified.",
    profileDetails: {
      businessAndLocation: {
        brn: "PV-89210",
        businessType: "Private Limited",
        district: "Colombo",
        address: "No. 45, Industrial Zone, Moratuwa",
        postalCode: "10400",
      },
      operationsAndLogistics: {
        leadTime: "14 - 21 Days",
        fabricSourcing: "Full Fabric & Trims In-House Sourcing",
        sampleAvailability: "Free with Bulk Orders (3-5 Days)",
        deliveryCapability: "Islandwide Doorstep Delivery",
        paymentTerms: "30% Advance, Balance on Delivery",
      },
      factoryBranding: {
        logoUrl: "/images/categories/shirt.jpg",
        coverUrl: "/images/categories/tshirt.jpg",
        tagline: "Premier handloom and casual woven garment manufacturers since 2017.",
        websiteOrSocial: "https://lankaweave.lk",
      },
      products: [
        {
          id: "PROD-01",
          name: "Premium Linen Long Sleeve Shirt",
          category: "shirt",
          image: "/images/categories/shirt.jpg",
          pricePerUnit: "LKR 1,450",
          moq: "50 Pcs",
          material: "100% Organic Linen",
          description: "Export finish with coconut shell buttons and tailored cuffs.",
        },
        {
          id: "PROD-02",
          name: "Casual Crewneck Cotton T-Shirt",
          category: "tshirt",
          image: "/images/categories/tshirt.jpg",
          pricePerUnit: "LKR 850",
          moq: "100 Pcs",
          material: "180 GSM Single Jersey",
          description: "Pre-shrunk, bio-washed combed cotton with double needle hem.",
        },
      ],
    },
  },
  {
    id: "REG-8013",
    businessName: "Kandy Garments Co.",
    userName: "Anula Silva",
    phone: "0719876543",
    yearsInOperation: "1-5",
    workforce: "1-10",
    moq: "1-50",
    selectedCategories: ["dresses"],
    status: "pending",
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    profileDetails: {
      products: [
        {
          id: "PROD-03",
          name: "Floral Cotton Summer Dress",
          category: "dresses",
          image: "/images/categories/dresses.jpg",
          pricePerUnit: "LKR 1,650",
          moq: "30 Pcs",
          material: "100% Breathable Rayon/Cotton",
          description: "Comfort fit with flared hem and high-definition floral print.",
        },
      ],
    },
  },
  {
    id: "REG-8014",
    businessName: "Rajarata Textiles",
    userName: "Nimal Jayasinghe",
    phone: "0765554321",
    yearsInOperation: "under1",
    workforce: "1-10",
    moq: "1-50",
    selectedCategories: ["trousers"],
    status: "rejected",
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reviewNotes: "Incomplete contact verification.",
  },
];

// Helper to normalize phone numbers for matching
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\+]/g, "").trim();
}

// Get all registrations from localStorage
export function getRegistrations(): SupplierRegistration[] {
  if (typeof window === "undefined") return INITIAL_REGISTRATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse registrations from localStorage", e);
    return INITIAL_REGISTRATIONS;
  }
}

// Add a new registration
export function addRegistration(
  data: Omit<SupplierRegistration, "id" | "status" | "submittedAt">
): SupplierRegistration {
  const registrations = getRegistrations();
  const newReg: SupplierRegistration = {
    ...data,
    id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  const updated = [newReg, ...registrations];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newReg;
}

// Update status of a registration
export function updateRegistrationStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
  reviewNotes?: string
): SupplierRegistration[] {
  const registrations = getRegistrations();
  const updated = registrations.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status,
        reviewNotes: reviewNotes !== undefined ? reviewNotes : item.reviewNotes,
      };
    }
    return item;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === id) {
      const updatedUser = updated.find((u) => u.id === id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  }

  return updated;
}

// Update extended profile details (Business & Location, Operations, Branding)
export function updateSupplierProfile(
  id: string,
  profile: SupplierProfileDetails
): SupplierRegistration | null {
  const registrations = getRegistrations();
  let updatedSupplier: SupplierRegistration | null = null;

  const updated = registrations.map((item) => {
    if (item.id === id) {
      const merged: SupplierRegistration = {
        ...item,
        profileDetails: {
          ...item.profileDetails,
          ...profile,
          businessAndLocation: {
            ...item.profileDetails?.businessAndLocation,
            ...profile.businessAndLocation,
          },
          operationsAndLogistics: {
            ...item.profileDetails?.operationsAndLogistics,
            ...profile.operationsAndLogistics,
          },
          factoryBranding: {
            ...item.profileDetails?.factoryBranding,
            ...profile.factoryBranding,
          },
          products: profile.products || item.profileDetails?.products || [],
        },
      };
      updatedSupplier = merged;
      return merged;
    }
    return item;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === id && updatedSupplier) {
      setCurrentUser(updatedSupplier);
    }
  }

  return updatedSupplier;
}

// Add a product to a supplier's Gig
export function addSupplierProduct(
  supplierId: string,
  product: Omit<GigProduct, "id">
): SupplierRegistration | null {
  const registrations = getRegistrations();
  const supplier = registrations.find((r) => r.id === supplierId);
  if (!supplier) return null;

  const currentProducts = supplier.profileDetails?.products || [];
  const newProduct: GigProduct = {
    ...product,
    id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
  };

  const updatedProducts = [newProduct, ...currentProducts];
  return updateSupplierProfile(supplierId, {
    products: updatedProducts,
  });
}

// Delete a product from a supplier's Gig
export function deleteSupplierProduct(
  supplierId: string,
  productId: string
): SupplierRegistration | null {
  const registrations = getRegistrations();
  const supplier = registrations.find((r) => r.id === supplierId);
  if (!supplier) return null;

  const currentProducts = supplier.profileDetails?.products || [];
  const updatedProducts = currentProducts.filter((p) => p.id !== productId);

  return updateSupplierProfile(supplierId, {
    products: updatedProducts,
  });
}

// Find registration by username and phone
export function findRegistration(
  userName: string,
  phone: string
): SupplierRegistration | null {
  const registrations = getRegistrations();
  const normalizedInputPhone = normalizePhone(phone);
  const cleanUserName = userName.trim().toLowerCase();

  return (
    registrations.find((r) => {
      const matchName = r.userName.trim().toLowerCase() === cleanUserName;
      const matchPhone = normalizePhone(r.phone) === normalizedInputPhone;
      return matchName && matchPhone;
    }) || null
  );
}

// Get logged-in user
export function getCurrentUser(): SupplierRegistration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const all = getRegistrations();
    const latest = all.find((r) => r.id === session.id);
    return latest || session;
  } catch {
    return null;
  }
}

// Set logged-in user
export function setCurrentUser(user: SupplierRegistration): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

// Clear logged-in user
export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

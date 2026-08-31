export * from "./audit-logs";

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: {
    viewApplications: boolean;
    approveReject: boolean;
    exportData: boolean;
    manageRoles: boolean;
    manageAdmins: boolean;
    manageSettings: boolean;
  };
  isSystem?: boolean; // System roles cannot be deleted
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  avatar: string;
  lastActive: string;
  status: "active" | "inactive";
  joinedAt: string;
}

export interface BuyerRFQLead {
  id: string;
  supplierId: string;
  supplierBusinessName: string;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  garmentCategory: string;
  quantity: string;
  estimatedValue: string;
  status: "new" | "sample_requested" | "in_discussion" | "deal_won" | "closed";
  notes: string;
  date: string;
}

const ROLES_STORAGE_KEY = "apparel_bank_roles";
const ADMINS_STORAGE_KEY = "apparel_bank_admins";
const BUYER_RFQS_STORAGE_KEY = "apparel_bank_buyer_rfqs";

export const INITIAL_ROLES: RolePermission[] = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    description: "Full administrative governance, system parameters, and unrestricted security control.",
    permissions: {
      viewApplications: true,
      approveReject: true,
      exportData: true,
      manageRoles: true,
      manageAdmins: true,
      manageSettings: true,
    },
    isSystem: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "role-verification-officer",
    name: "Verification Officer",
    description: "Evaluates factory compliance documents and signs off on supplier applications.",
    permissions: {
      viewApplications: true,
      approveReject: true,
      exportData: true,
      manageRoles: false,
      manageAdmins: false,
      manageSettings: false,
    },
    isSystem: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "role-compliance-auditor",
    name: "Compliance Auditor",
    description: "Reviews supplier audit trails, logs, and exports regulatory compliance reports.",
    permissions: {
      viewApplications: true,
      approveReject: false,
      exportData: true,
      manageRoles: false,
      manageAdmins: false,
      manageSettings: false,
    },
    isSystem: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "role-support-agent",
    name: "Support Agent",
    description: "Assists prospective suppliers with registration queries and profile assistance.",
    permissions: {
      viewApplications: true,
      approveReject: false,
      exportData: false,
      manageRoles: false,
      manageAdmins: false,
      manageSettings: false,
    },
    isSystem: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: "ADM-01",
    name: "Chamuditha Shehan",
    email: "chamuditha@apparelbank.lk",
    roleId: "role-super-admin",
    roleName: "Super Admin",
    avatar: "CS",
    lastActive: "Just now",
    status: "active",
    joinedAt: "Jan 10, 2026",
  },
  {
    id: "ADM-02",
    name: "Dilini Senanayake",
    email: "dilini.s@apparelbank.lk",
    roleId: "role-verification-officer",
    roleName: "Verification Officer",
    avatar: "DS",
    lastActive: "14 mins ago",
    status: "active",
    joinedAt: "Jan 18, 2026",
  },
  {
    id: "ADM-03",
    name: "Roshana Jayasinghe",
    email: "roshana@apparelbank.lk",
    roleId: "role-compliance-auditor",
    roleName: "Compliance Auditor",
    avatar: "RJ",
    lastActive: "2 hours ago",
    status: "active",
    joinedAt: "Feb 02, 2026",
  },
  {
    id: "ADM-04",
    name: "Nuwan Pradeep",
    email: "nuwan.p@apparelbank.lk",
    roleId: "role-support-agent",
    roleName: "Support Agent",
    avatar: "NP",
    lastActive: "Yesterday",
    status: "inactive",
    joinedAt: "Feb 14, 2026",
  },
];

export const INITIAL_BUYER_RFQS: BuyerRFQLead[] = [
  {
    id: "RFQ-701",
    supplierId: "REG-8012",
    supplierBusinessName: "Lanka Weave Handlooms",
    buyerName: "Kasun Jayawardena",
    buyerCompany: "Ceylon Urban Wear Ltd",
    buyerPhone: "0778901234",
    garmentCategory: "T-Shirts & Polos",
    quantity: "500 Pcs",
    estimatedValue: "LKR 425,000",
    status: "new",
    notes: "Custom embroidered crewneck t-shirts (180 GSM combed cotton) with brand woven label.",
    date: "Today, 10:30 AM",
  },
  {
    id: "RFQ-700",
    supplierId: "REG-8012",
    supplierBusinessName: "Lanka Weave Handlooms",
    buyerName: "Dharshani Perera",
    buyerCompany: "Colombo Style Hub",
    buyerPhone: "0712349876",
    garmentCategory: "Formal & Casual Shirts",
    quantity: "150 Pcs",
    estimatedValue: "LKR 217,500",
    status: "sample_requested",
    notes: "Fabric swatch and 1 pre-production prototype sample requested to Rajagiriya showroom.",
    date: "Yesterday",
  },
  {
    id: "RFQ-699",
    supplierId: "REG-8014",
    supplierBusinessName: "Southern Stitchers Ltd",
    buyerName: "Mahesh Ranasinghe",
    buyerCompany: "Apex Uniforms & Corporate",
    buyerPhone: "0763456789",
    garmentCategory: "Trousers & Pants",
    quantity: "1,000 Pcs",
    estimatedValue: "LKR 1,250,000",
    status: "in_discussion",
    notes: "Monthly regular contract for corporate hospitality staff trousers. Sample approved.",
    date: "3 days ago",
  },
  {
    id: "RFQ-698",
    supplierId: "REG-8013",
    supplierBusinessName: "Kandy Garments Co.",
    buyerName: "Sonali Wickramasinghe",
    buyerCompany: "Lotus Boutique Retail",
    buyerPhone: "0724567890",
    garmentCategory: "Dresses & Frocks",
    quantity: "200 Pcs",
    estimatedValue: "LKR 330,000",
    status: "deal_won",
    notes: "Turnkey cotton sundresses with custom brand hangtags. Production scheduled.",
    date: "5 days ago",
  },
];

// Get all roles
export function getStoredRoles(): RolePermission[] {
  if (typeof window === "undefined") return INITIAL_ROLES;
  try {
    const raw = localStorage.getItem(ROLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(INITIAL_ROLES));
      return INITIAL_ROLES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ROLES;
  }
}

// Add a new role
export function addStoredRole(
  name: string,
  description: string,
  permissions: RolePermission["permissions"]
): RolePermission {
  const roles = getStoredRoles();
  const newRole: RolePermission = {
    id: `role-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`,
    name: name.trim(),
    description: description.trim() || "Custom administrative security role.",
    permissions,
    isSystem: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [...roles, newRole];
  if (typeof window !== "undefined") {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
  }
  return newRole;
}

// Update role permissions
export function updateStoredRole(
  id: string,
  updates: Partial<Omit<RolePermission, "id" | "isSystem">>
): RolePermission[] {
  const roles = getStoredRoles();
  const updated = roles.map((r) => (r.id === id ? { ...r, ...updates } : r));
  if (typeof window !== "undefined") {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

// Delete role
export function deleteStoredRole(id: string): { success: boolean; error?: string } {
  const roles = getStoredRoles();
  const target = roles.find((r) => r.id === id);
  if (!target) return { success: false, error: "Role not found" };
  if (target.isSystem) return { success: false, error: "System roles cannot be deleted" };

  const admins = getStoredAdmins();
  const isAssigned = admins.some((a) => a.roleId === id);
  if (isAssigned) {
    return {
      success: false,
      error: "Cannot delete this role because it is currently assigned to one or more admin users. Please reassign those users first.",
    };
  }

  const updated = roles.filter((r) => r.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updated));
  }
  return { success: true };
}

// Get all admin users
export function getStoredAdmins(): AdminUser[] {
  if (typeof window === "undefined") return INITIAL_ADMINS;
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMINS;
  }
}

// Add a new admin
export function addStoredAdmin(
  name: string,
  email: string,
  roleId: string,
  roleName: string
): AdminUser {
  const admins = getStoredAdmins();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const newAdmin: AdminUser = {
    id: `ADM-0${admins.length + 1}`,
    name: name.trim(),
    email: email.trim(),
    roleId,
    roleName,
    avatar: initials || "AD",
    lastActive: "Just invited",
    status: "active",
    joinedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };

  const updated = [...admins, newAdmin];
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(updated));
  }
  return newAdmin;
}

// Update admin role or status
export function updateStoredAdmin(
  id: string,
  updates: Partial<AdminUser>
): AdminUser[] {
  const admins = getStoredAdmins();
  const updated = admins.map((a) => (a.id === id ? { ...a, ...updates } : a));
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

// Delete admin
export function deleteStoredAdmin(id: string): AdminUser[] {
  const admins = getStoredAdmins();
  const updated = admins.filter((a) => a.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

// Buyer RFQs Store
export function getStoredBuyerRFQs(): BuyerRFQLead[] {
  if (typeof window === "undefined") return INITIAL_BUYER_RFQS;
  try {
    const raw = localStorage.getItem(BUYER_RFQS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BUYER_RFQS_STORAGE_KEY, JSON.stringify(INITIAL_BUYER_RFQS));
      return INITIAL_BUYER_RFQS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BUYER_RFQS;
  }
}

export function updateStoredBuyerRFQStatus(
  id: string,
  status: BuyerRFQLead["status"]
): BuyerRFQLead[] {
  const rfqs = getStoredBuyerRFQs();
  const updated = rfqs.map((r) => (r.id === id ? { ...r, status } : r));
  if (typeof window !== "undefined") {
    localStorage.setItem(BUYER_RFQS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

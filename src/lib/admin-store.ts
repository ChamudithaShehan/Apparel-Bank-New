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

const ROLES_STORAGE_KEY = "apparel_bank_roles";
const ADMINS_STORAGE_KEY = "apparel_bank_admins";

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
    lastActive: "Active now",
    status: "active",
    joinedAt: "Jan 12, 2026",
  },
  {
    id: "ADM-02",
    name: "Sandun Wickramasinghe",
    email: "sandun.w@apparelbank.lk",
    roleId: "role-verification-officer",
    roleName: "Verification Officer",
    avatar: "SW",
    lastActive: "12 mins ago",
    status: "active",
    joinedAt: "Feb 01, 2026",
  },
  {
    id: "ADM-03",
    name: "Dinithi Fernando",
    email: "dinithi.f@apparelbank.lk",
    roleId: "role-compliance-auditor",
    roleName: "Compliance Auditor",
    avatar: "DF",
    lastActive: "1 hour ago",
    status: "active",
    joinedAt: "Feb 15, 2026",
  },
  {
    id: "ADM-04",
    name: "Kasun Jayawardena",
    email: "kasun.j@apparelbank.lk",
    roleId: "role-support-agent",
    roleName: "Support Agent",
    avatar: "KJ",
    lastActive: "Yesterday",
    status: "inactive",
    joinedAt: "Mar 02, 2026",
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

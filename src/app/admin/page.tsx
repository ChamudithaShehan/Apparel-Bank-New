"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutGrid,
  Users,
  BarChart2,
  Shield,
  UserCheck,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Plus,
  Check,
  X,
  Eye,
  RefreshCw,
  Bell,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Edit2,
  Trash2,
  UserPlus,
  Menu,
  FileCheck2,
  Activity,
  Award,
  Zap,
  ShieldCheck,
} from "lucide-react";
import {
  SupplierRegistration,
  getRegistrations,
  updateRegistrationStatus,
  INITIAL_REGISTRATIONS,
} from "@/lib/registrations";
import {
  RolePermission,
  AdminUser,
  getStoredRoles,
  addStoredRole,
  updateStoredRole,
  deleteStoredRole,
  getStoredAdmins,
  addStoredAdmin,
  updateStoredAdmin,
  deleteStoredAdmin,
  INITIAL_ROLES,
  INITIAL_ADMINS,
} from "@/lib/admin-store";

type AdminTab = "dashboard" | "suppliers" | "analytics" | "roles" | "access" | "settings";

const categoryLabels: Record<string, string> = {
  tshirt: "T-Shirts & Polos",
  shirt: "Formal & Casual Shirts",
  trousers: "Trousers & Pants",
  dresses: "Dresses & Frocks",
};

const yearsLabels: Record<string, string> = {
  under1: "< 1 Year (New Business)",
  "1-5": "1 - 5 Years",
  "5-10": "5 - 10 Years",
  "10plus": "10+ Years (Established)",
};

const workforceLabels: Record<string, string> = {
  "1-10": "1 - 10 Employees",
  "11-50": "11 - 50 Employees",
  "51-200": "51 - 200 Employees",
  "200plus": "200+ Employees",
};

const moqLabels: Record<string, string> = {
  "1-50": "1 - 50 Pieces (Low MOQ)",
  "51-200": "51 - 200 Pieces (Medium)",
  "201-500": "201 - 500 Pieces (Large)",
  "500plus": "500+ Pieces (Enterprise Bulk)",
};

export default function ProfessionalAdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [registrations, setRegistrations] = useState<SupplierRegistration[]>([]);
  const [roles, setRoles] = useState<RolePermission[]>([]);
  const [adminTeam, setAdminTeam] = useState<AdminUser[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRegistration | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Create / Edit Role Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [rolePermissions, setRolePermissions] = useState<RolePermission["permissions"]>({
    viewApplications: true,
    approveReject: false,
    exportData: false,
    manageRoles: false,
    manageAdmins: false,
    manageSettings: false,
  });

  // Invite Admin Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRoleId, setNewAdminRoleId] = useState("");

  useEffect(() => {
    setMounted(true);
    setRegistrations(getRegistrations());
    const storedRoles = getStoredRoles();
    setRoles(storedRoles);
    setAdminTeam(getStoredAdmins());
    if (storedRoles.length > 0) {
      setNewAdminRoleId(storedRoles[0].id);
    }
  }, []);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: "approved" | "rejected",
    notes?: string
  ) => {
    const updated = updateRegistrationStatus(id, newStatus, notes);
    setRegistrations(updated);

    if (selectedSupplier && selectedSupplier.id === id) {
      const refreshed = updated.find((r) => r.id === id);
      if (refreshed) setSelectedSupplier(refreshed);
    }

    const supplier = updated.find((r) => r.id === id);
    const name = supplier ? supplier.userName : "Supplier";

    if (newStatus === "approved") {
      showToast(`Supplier registration for ${name} (${supplier?.businessName}) has been APPROVED.`, "success");
    } else {
      showToast(`Supplier application for ${name} (${supplier?.businessName}) was REJECTED.`, "error");
    }
  };

  const handleBulkStatusChange = (newStatus: "approved" | "rejected") => {
    if (selectedIds.length === 0) return;
    let currentRegs = registrations;
    selectedIds.forEach((id) => {
      currentRegs = updateRegistrationStatus(id, newStatus);
    });
    setRegistrations(currentRegs);
    setSelectedIds([]);
    showToast(
      `Successfully updated ${selectedIds.length} supplier registrations to ${newStatus.toUpperCase()}.`,
      "success"
    );
  };

  const handleExportCSV = () => {
    const headers = "ID,Business Name,User Name,Phone,Years in Operation,Workforce,MOQ,Status,Submitted At\n";
    const rows = registrations
      .map(
        (r) =>
          `"${r.id}","${r.businessName}","${r.userName}","${r.phone}","${r.yearsInOperation}","${r.workforce}","${r.moq}","${r.status}","${r.submittedAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `apparel_bank_suppliers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Supplier directory exported to CSV successfully.");
  };

  const handleResetData = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("apparel_bank_registrations", JSON.stringify(INITIAL_REGISTRATIONS));
      localStorage.setItem("apparel_bank_roles", JSON.stringify(INITIAL_ROLES));
      localStorage.setItem("apparel_bank_admins", JSON.stringify(INITIAL_ADMINS));
      setRegistrations(INITIAL_REGISTRATIONS);
      setRoles(INITIAL_ROLES);
      setAdminTeam(INITIAL_ADMINS);
      setSelectedSupplier(null);
      showToast("Enterprise demo data restored to default.", "info");
    }
  };

  // Role Management Handlers
  const handleOpenCreateRole = () => {
    setEditingRoleId(null);
    setRoleName("");
    setRoleDescription("");
    setRolePermissions({
      viewApplications: true,
      approveReject: false,
      exportData: false,
      manageRoles: false,
      manageAdmins: false,
      manageSettings: false,
    });
    setShowRoleModal(true);
  };

  const handleOpenEditRole = (role: RolePermission) => {
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setRolePermissions(role.permissions);
    setShowRoleModal(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    if (editingRoleId) {
      const updated = updateStoredRole(editingRoleId, {
        name: roleName.trim(),
        description: roleDescription.trim(),
        permissions: rolePermissions,
      });
      setRoles(updated);
      const updatedAdmins = adminTeam.map((a) =>
        a.roleId === editingRoleId ? { ...a, roleName: roleName.trim() } : a
      );
      setAdminTeam(updatedAdmins);
      showToast(`Role "${roleName}" updated successfully.`, "success");
    } else {
      const newRole = addStoredRole(roleName.trim(), roleDescription.trim(), rolePermissions);
      setRoles(getStoredRoles());
      showToast(`New role "${newRole.name}" created successfully.`, "success");
    }
    setShowRoleModal(false);
  };

  const handleDeleteRole = (id: string) => {
    const res = deleteStoredRole(id);
    if (res.success) {
      setRoles(getStoredRoles());
      showToast("Role deleted successfully.", "success");
    } else {
      showToast(res.error || "Cannot delete role", "error");
    }
  };

  // Admin Management Handlers
  const handleInviteAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;
    const selectedRole = roles.find((r) => r.id === newAdminRoleId) || roles[0];
    const newAdmin = addStoredAdmin(
      newAdminName.trim(),
      newAdminEmail.trim(),
      selectedRole.id,
      selectedRole.name
    );
    setAdminTeam(getStoredAdmins());
    setShowInviteModal(false);
    setNewAdminName("");
    setNewAdminEmail("");
    showToast(`Administrator ${newAdmin.name} added as ${selectedRole.name}.`, "success");
  };

  const handleAdminRoleChange = (adminId: string, targetRoleId: string) => {
    const selectedRole = roles.find((r) => r.id === targetRoleId);
    if (!selectedRole) return;
    const updated = updateStoredAdmin(adminId, {
      roleId: selectedRole.id,
      roleName: selectedRole.name,
    });
    setAdminTeam(updated);
    showToast(`Updated role to ${selectedRole.name}.`, "success");
  };

  const handleDeleteAdmin = (adminId: string) => {
    const updated = deleteStoredAdmin(adminId);
    setAdminTeam(updated);
    showToast("Administrator removed.", "info");
  };

  if (!mounted) return null;

  // Filtered suppliers
  const filteredSuppliers = registrations.filter((item) => {
    const matchStatus = statusFilter === "all" ? true : item.status === statusFilter;
    const matchCategory =
      categoryFilter === "all" ? true : item.selectedCategories?.includes(categoryFilter);
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.userName.toLowerCase().includes(q) ||
      item.businessName.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q);
    return matchStatus && matchCategory && matchSearch;
  });

  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const rejectedCount = registrations.filter((r) => r.status === "rejected").length;
  const approvalRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSuppliers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSuppliers.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white w-full">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Responsive & Fixed on Desktop) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-7">
          {/* Brand Header */}
          <div className="px-2 pt-1 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-32 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Apparel Bank"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="px-2 -mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-100/80">
              <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Admin Portal
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Enterprise</span>
          </div>

          {/* Navigation Items (Exact structure & styling) */}
          <nav className="space-y-1">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#EDF3FA] text-[#0A1A3A] font-bold shadow-xs border border-blue-100/60"
                  : "text-[#556987] hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
            >
              <LayoutGrid
                className={`size-5 shrink-0 ${
                  activeTab === "dashboard" ? "text-[#0A1A3A] stroke-[2.4]" : "text-[#708099]"
                }`}
              />
              <span>Dashboard</span>
            </button>

            {/* 2. Suppliers */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("suppliers");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] transition-all cursor-pointer ${
                activeTab === "suppliers"
                  ? "bg-[#EDF3FA] text-[#0A1A3A] font-bold shadow-xs border border-blue-100/60"
                  : "text-[#556987] hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Users
                  className={`size-5 shrink-0 ${
                    activeTab === "suppliers" ? "text-[#0A1A3A] stroke-[2.4]" : "text-[#708099]"
                  }`}
                />
                <span>Suppliers</span>
              </div>
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 shadow-2xs">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* 3. Analytics */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("analytics");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-[#EDF3FA] text-[#0A1A3A] font-bold shadow-xs border border-blue-100/60"
                  : "text-[#556987] hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
            >
              <BarChart2
                className={`size-5 shrink-0 ${
                  activeTab === "analytics" ? "text-[#0A1A3A] stroke-[2.4]" : "text-[#708099]"
                }`}
              />
              <span>Analytics</span>
            </button>

            {/* 4. Roles */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("roles");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] transition-all cursor-pointer ${
                activeTab === "roles"
                  ? "bg-[#EDF3FA] text-[#0A1A3A] font-bold shadow-xs border border-blue-100/60"
                  : "text-[#556987] hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Shield
                  className={`size-5 shrink-0 ${
                    activeTab === "roles" ? "text-[#0A1A3A] stroke-[2.4]" : "text-[#708099]"
                  }`}
                />
                <span>Roles</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {roles.length}
              </span>
            </button>

            {/* 5. Admin Access */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("access");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] transition-all cursor-pointer ${
                activeTab === "access"
                  ? "bg-[#EDF3FA] text-[#0A1A3A] font-bold shadow-xs border border-blue-100/60"
                  : "text-[#556987] hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <UserCheck
                  className={`size-5 shrink-0 ${
                    activeTab === "access" ? "text-[#0A1A3A] stroke-[2.4]" : "text-[#708099]"
                  }`}
                />
                <span>Admin Access</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {adminTeam.length}
              </span>
            </button>

            {/* 6. Settings */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("settings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#EDF3FA] text-[#0A1A3A] font-bold shadow-xs border border-blue-100/60"
                  : "text-[#556987] hover:bg-slate-50 hover:text-slate-900 font-semibold"
              }`}
            >
              <Settings
                className={`size-5 shrink-0 ${
                  activeTab === "settings" ? "text-[#0A1A3A] stroke-[2.4]" : "text-[#708099]"
                }`}
              />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar: Admin Profile */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#020333] text-xs font-black text-white shadow-2xs">
              CS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-extrabold text-slate-900 truncate">Chamuditha Shehan</p>
              <p className="text-[11px] font-semibold text-slate-400 truncate">Super Admin</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold px-1 text-slate-500">
            <Link
              href="/"
              className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="size-3" />
              <span>Public Portal</span>
            </Link>

            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              User Login
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN FLUID CONTENT CONTAINER (100% Width, zero awkward right side gap) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Top App Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs w-full">
          {/* Section Breadcrumb & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="size-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 hidden sm:inline">Portal</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h2 className="text-sm font-extrabold text-slate-900 capitalize">
                {activeTab}
              </h2>
            </div>

            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suppliers, phone, ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3.5 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="size-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("suppliers");
                setStatusFilter("pending");
              }}
              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 relative cursor-pointer"
              title="Pending Reviews"
            >
              <Bell className="size-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4">
            <div
              className={`rounded-2xl p-4 shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-bold ${
                toast.type === "success"
                  ? "bg-slate-900 text-emerald-300 border-emerald-500/50"
                  : toast.type === "error"
                  ? "bg-slate-900 text-rose-300 border-rose-500/50"
                  : "bg-slate-900 text-blue-300 border-blue-500/50"
              }`}
            >
              <span>{toast.msg}</span>
              <button onClick={() => setToast(null)} className="opacity-70 hover:opacity-100 p-0.5">
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE DASHBOARD (Full Fluid Responsive Width) */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            {/* Title banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Operations Overview
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Real-time supplier verification pipeline, manufacturing intelligence, and SLA tracking
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="size-3.5 text-slate-500" />
                  <span>Sync Records</span>
                </button>
              </div>
            </div>

            {/* 4 Executive KPI Cards (Fluid Grid across 100% width) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
              {/* Total Suppliers */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">Total Suppliers</span>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Users className="size-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-3xl font-black text-slate-900">{totalCount}</p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp className="size-3 mr-1" /> +18.4%
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Active manufacturing partners</p>
              </div>

              {/* Pending Verifications */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-700">Pending Review</span>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="size-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
                  <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Action Required
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Average review SLA: 4 hours</p>
              </div>

              {/* Verified & Approved */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-700">Approved Suppliers</span>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="size-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-3xl font-black text-emerald-600">{approvedCount}</p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {approvalRate}% Rate
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Passed quality standards</p>
              </div>

              {/* Rejected */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-rose-700">Rejected Applications</span>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <XCircle className="size-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-3xl font-black text-rose-600">{rejectedCount}</p>
                  <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    Audit Logged
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Incomplete factory credentials</p>
              </div>
            </div>

            {/* Middle: Priority Queue & Capability Matrix (Expanding full width) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
              {/* Priority Action Queue (2 cols on xl) */}
              <div className="xl:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Priority Verification Queue
                    </h3>
                    <p className="text-xs font-medium text-slate-400">
                      Recent applications awaiting compliance sign-off
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("suppliers");
                      setStatusFilter("pending");
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {registrations.filter((r) => r.status === "pending").length === 0 ? (
                    <div className="py-12 text-center text-slate-400 font-medium text-sm">
                      ✨ Verification queue is clear. All incoming suppliers have been audited.
                    </div>
                  ) : (
                    registrations
                      .filter((r) => r.status === "pending")
                      .slice(0, 4)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-blue-50/20 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                                {item.id}
                              </span>
                              <h4 className="text-sm font-extrabold text-slate-900">
                                {item.businessName}
                              </h4>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                              Contact: {item.userName} • Tel: {item.phone}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedSupplier(item)}
                              className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                              className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "rejected")}
                              className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow-2xs cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Manufacturing Category Breakdown */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Category Distribution
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    Supplier production line capabilities
                  </p>
                </div>

                <div className="space-y-3.5 pt-1">
                  {[
                    { id: "tshirt", label: "T-Shirts & Polos", color: "bg-blue-600", count: registrations.filter((r) => r.selectedCategories?.includes("tshirt")).length },
                    { id: "shirt", label: "Formal & Casual Shirts", color: "bg-indigo-600", count: registrations.filter((r) => r.selectedCategories?.includes("shirt")).length },
                    { id: "trousers", label: "Trousers & Pants", color: "bg-emerald-600", count: registrations.filter((r) => r.selectedCategories?.includes("trousers")).length },
                    { id: "dresses", label: "Dresses & Frocks", color: "bg-violet-600", count: registrations.filter((r) => r.selectedCategories?.includes("dresses")).length },
                  ].map((cat) => {
                    const pct = totalCount > 0 ? Math.round((cat.count / totalCount) * 100) : 0;
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700">{cat.label}</span>
                          <span className="text-slate-400 font-semibold">{cat.count} suppliers ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.color}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SUPPLIERS MASTER DIRECTORY (Full Fluid Width Table) */}
        {/* ========================================================================= */}
        {activeTab === "suppliers" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-5 w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Supplier Directory
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Audit, filter, inspect dossiers, and batch approve registered manufacturing partners
                </p>
              </div>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-slate-900 text-white shadow-lg animate-in fade-in">
                  <span className="text-xs font-bold mr-1">
                    {selectedIds.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkStatusChange("approved")}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-xs font-bold cursor-pointer"
                  >
                    Bulk Approve
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange("rejected")}
                    className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-1 text-xs font-bold cursor-pointer"
                  >
                    Bulk Reject
                  </button>
                </div>
              )}
            </div>

            {/* Filter Bar (Fluid Full Width) */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 w-full">
              {/* Status Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All", count: totalCount },
                  { id: "pending", label: "Pending Review", count: pendingCount },
                  { id: "approved", label: "Approved", count: approvedCount },
                  { id: "rejected", label: "Rejected", count: rejectedCount },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setStatusFilter(pill.id as any)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === pill.id
                        ? "bg-[#020333] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{pill.label}</span>{" "}
                    <span className="opacity-70 font-medium">({pill.count})</span>
                  </button>
                ))}
              </div>

              {/* Category Dropdown & Mobile Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative md:hidden w-44">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-2.5 py-1.5 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Garment Type:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="all">All Garment Types</option>
                    <option value="tshirt">T-Shirts</option>
                    <option value="shirt">Shirts</option>
                    <option value="trousers">Trousers</option>
                    <option value="dresses">Dresses</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Table (Stretches 100% to fill full screen) */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm min-w-[760px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.length > 0 &&
                            selectedIds.length === filteredSuppliers.length
                          }
                          onChange={toggleSelectAll}
                          className="size-4 rounded accent-[#020333] cursor-pointer"
                        />
                      </th>
                      <th className="p-4 w-32">Reference ID</th>
                      <th className="p-4">Business & Contact</th>
                      <th className="p-4 w-44">Mobile Phone</th>
                      <th className="p-4 w-52">Capacity / MOQ</th>
                      <th className="p-4 w-40">Status</th>
                      <th className="p-4 text-right w-36">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredSuppliers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-16 text-center text-slate-400 font-semibold">
                          No matching supplier records found.
                        </td>
                      </tr>
                    ) : (
                      filteredSuppliers.map((supplier) => {
                        const isSelected = selectedIds.includes(supplier.id);
                        return (
                          <tr
                            key={supplier.id}
                            className={`hover:bg-blue-50/20 transition-colors ${
                              isSelected ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOne(supplier.id)}
                                className="size-4 rounded accent-[#020333] cursor-pointer"
                              />
                            </td>
                            <td className="p-4">
                              <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                                {supplier.id}
                              </span>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-extrabold text-slate-900 text-sm">
                                  {supplier.businessName}
                                </p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                  Contact: {supplier.userName}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                                {supplier.phone}
                              </span>
                            </td>
                            <td className="p-4 text-xs font-semibold">
                              <p className="text-slate-800 font-bold">
                                MOQ: {moqLabels[supplier.moq] || supplier.moq}
                              </p>
                              <p className="text-slate-400 text-[11px]">
                                {workforceLabels[supplier.workforce] || supplier.workforce}
                              </p>
                            </td>
                            <td className="p-4">
                              {supplier.status === "approved" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                                  <span className="size-1.5 rounded-full bg-emerald-600"></span>
                                  Approved
                                </span>
                              )}
                              {supplier.status === "pending" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                                  <span className="size-1.5 rounded-full bg-amber-500"></span>
                                  Pending Review
                                </span>
                              )}
                              {supplier.status === "rejected" && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-800">
                                  <span className="size-1.5 rounded-full bg-rose-600"></span>
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedSupplier(supplier)}
                                  className="rounded-xl bg-slate-100 hover:bg-slate-200 p-2 text-slate-700 cursor-pointer"
                                  title="View Dossier"
                                >
                                  <Eye className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(supplier.id, "approved")}
                                  disabled={supplier.status === "approved"}
                                  className={`rounded-xl p-2 transition-all cursor-pointer ${
                                    supplier.status === "approved"
                                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200"
                                  }`}
                                  title="Approve"
                                >
                                  <Check className="size-4 stroke-[2.5]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(supplier.id, "rejected")}
                                  disabled={supplier.status === "rejected"}
                                  className={`rounded-xl p-2 transition-all cursor-pointer ${
                                    supplier.status === "rejected"
                                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                      : "bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200"
                                  }`}
                                  title="Reject"
                                >
                                  <X className="size-4 stroke-[2.5]" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>
                  Showing {filteredSuppliers.length} of {totalCount} total suppliers
                </span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANALYTICS & INTELLIGENCE (Full Width Grid) */}
        {/* ========================================================================= */}
        {activeTab === "analytics" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Capacity Intelligence & Analytics
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Workforce scale distribution, Minimum Order Quantity (MOQ) capabilities, and garment market share
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Workforce Distribution */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  Factory Workforce Scale
                </h3>
                <div className="space-y-3 pt-2">
                  {[
                    { id: "1-10", label: "1 - 10 Employees (Micro)", count: registrations.filter((r) => r.workforce === "1-10").length, color: "bg-blue-500" },
                    { id: "11-50", label: "11 - 50 Employees (Small)", count: registrations.filter((r) => r.workforce === "11-50").length, color: "bg-indigo-500" },
                    { id: "51-200", label: "51 - 200 Employees (Medium)", count: registrations.filter((r) => r.workforce === "51-200").length, color: "bg-emerald-500" },
                    { id: "200plus", label: "200+ Employees (Enterprise)", count: registrations.filter((r) => r.workforce === "200plus").length, color: "bg-amber-500" },
                  ].map((w) => {
                    const pct = totalCount > 0 ? Math.round((w.count / totalCount) * 100) : 0;
                    return (
                      <div key={w.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{w.label}</span>
                          <span>{w.count} ({pct}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full ${w.color}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Minimum Order Quantity (MOQ) Profile */}
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  Minimum Order Quantity (MOQ) Mix
                </h3>
                <div className="space-y-3 pt-2">
                  {[
                    { id: "1-50", label: "1 - 50 Pieces (Sample Batches)", count: registrations.filter((r) => r.moq === "1-50").length, color: "bg-teal-500" },
                    { id: "51-200", label: "51 - 200 Pieces (Boutique Orders)", count: registrations.filter((r) => r.moq === "51-200").length, color: "bg-blue-500" },
                    { id: "201-500", label: "201 - 500 Pieces (Commercial)", count: registrations.filter((r) => r.moq === "201-500").length, color: "bg-indigo-500" },
                    { id: "500plus", label: "500+ Pieces (Export Bulk)", count: registrations.filter((r) => r.moq === "500plus").length, color: "bg-purple-500" },
                  ].map((m) => {
                    const pct = totalCount > 0 ? Math.round((m.count / totalCount) * 100) : 0;
                    return (
                      <div key={m.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>{m.label}</span>
                          <span>{m.count} ({pct}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full ${m.color}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ROLES & PERMISSIONS (Full Width Table) */}
        {/* ========================================================================= */}
        {activeTab === "roles" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Roles & Permission Policies
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Create custom administrative roles, configure granular permissions, and assign to team members
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateRole}
                className="inline-flex items-center gap-2 rounded-xl bg-[#020333] hover:bg-[#020333]/90 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Create New Role</span>
              </button>
            </div>

            {/* Roles Table */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black uppercase text-slate-400">
                    <tr>
                      <th className="p-4">Role Title & Description</th>
                      <th className="p-4 text-center">Assigned Admins</th>
                      <th className="p-4 text-center">Approve / Reject</th>
                      <th className="p-4 text-center">Export Data</th>
                      <th className="p-4 text-center">Manage Roles</th>
                      <th className="p-4 text-center">System Settings</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {roles.map((r) => {
                      const assignedMembers = adminTeam.filter((a) => a.roleId === r.id);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4 max-w-sm">
                            <div className="flex items-center gap-2">
                              <p className="font-extrabold text-slate-900">{r.name}</p>
                              {r.isSystem && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase">
                                  System
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 font-normal mt-0.5">{r.description}</p>
                          </td>

                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                              <Users className="size-3" />
                              {assignedMembers.length} {assignedMembers.length === 1 ? "member" : "members"}
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            {r.permissions.approveReject ? (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-center">
                            {r.permissions.exportData ? (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-center">
                            {r.permissions.manageRoles ? (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-center">
                            {r.permissions.manageSettings ? (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditRole(r)}
                                className="rounded-xl bg-slate-100 hover:bg-slate-200 p-2 text-slate-700 cursor-pointer"
                                title="Edit Role Permissions"
                              >
                                <Edit2 className="size-4" />
                              </button>

                              {!r.isSystem && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRole(r.id)}
                                  className="rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white p-2 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                                  title="Delete Role"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ADMIN ACCESS (Full Width Table) */}
        {/* ========================================================================= */}
        {activeTab === "access" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Admin Team & Access Management
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Manage administrator accounts, assign custom roles, and monitor team activity
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#020333] hover:bg-[#020333]/90 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm cursor-pointer"
              >
                <UserPlus className="size-4" />
                <span>Invite Admin</span>
              </button>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-black uppercase text-slate-400">
                    <tr>
                      <th className="p-4">Administrator</th>
                      <th className="p-4">Assigned Role (Editable)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined / Last Active</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {adminTeam.map((admin) => (
                      <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#020333] text-xs font-bold text-white">
                              {admin.avatar}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900">{admin.name}</p>
                              <p className="text-xs text-slate-400 font-normal">{admin.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Live Role Assignment Dropdown */}
                        <td className="p-4">
                          <select
                            value={admin.roleId}
                            onChange={(e) => handleAdminRoleChange(admin.id, e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-blue-900 outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              admin.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                admin.status === "active" ? "bg-emerald-600" : "bg-slate-400"
                              }`}
                            ></span>
                            {admin.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="p-4 text-slate-500 text-xs">
                          <p className="font-bold text-slate-800">{admin.lastActive}</p>
                          <p className="text-[11px] text-slate-400">Joined {admin.joinedAt}</p>
                        </td>

                        <td className="p-4 text-right">
                          {admin.id !== "ADM-01" ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 p-2 text-slate-400 cursor-pointer transition-colors"
                              title="Remove Admin"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400 italic">Primary Admin</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SYSTEM SETTINGS (Full Width Layout) */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                System & Compliance Settings
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Configure automated communications, audit retention policies, and data management
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-6 w-full">
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                  Automated Communications
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      SMS Notification on Status Change
                    </p>
                    <p className="text-xs text-slate-400">
                      Instantly dispatch SMS confirmation to supplier mobile when application is approved or rejected
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="size-5 rounded accent-[#020333] cursor-pointer" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      Daily Compliance Digest
                    </p>
                    <p className="text-xs text-slate-400">
                      Send daily summary of pending supplier applications to Verification Officers at 09:00 AM
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="size-5 rounded accent-[#020333] cursor-pointer" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                  Data Operations
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      Reset Demo Data
                    </p>
                    <p className="text-xs text-slate-400">
                      Restore default initial supplier applications and roles for demo and presentation purposes
                    </p>
                  </div>
                  <button
                    onClick={handleResetData}
                    className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
                  >
                    Reset Records
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CREATE / EDIT ROLE MODAL */}
      {/* ========================================================================= */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingRoleId ? "Edit Role & Permissions" : "Create New Role"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define security parameters and authorization access for this role
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Quality Assurance Auditor"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Briefly describe the operational responsibility of this role..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              {/* Permissions Checklist */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                  Role Permissions Matrix
                </label>
                <div className="space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
                  {[
                    { key: "viewApplications", label: "View Supplier Applications", desc: "Browse full supplier catalog and dossiers" },
                    { key: "approveReject", label: "Approve / Reject Supplier Registrations", desc: "Sign off or decline incoming applications" },
                    { key: "exportData", label: "Export Data to CSV", desc: "Download supplier and audit data exports" },
                    { key: "manageRoles", label: "Manage Roles & Permissions", desc: "Create, edit, and delete system security roles" },
                    { key: "manageAdmins", label: "Manage Admin Users", desc: "Invite team members and reassign their roles" },
                    { key: "manageSettings", label: "System & Compliance Settings", desc: "Configure global parameters and notification triggers" },
                  ].map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={rolePermissions[perm.key as keyof RolePermission["permissions"]]}
                        onChange={(e) =>
                          setRolePermissions({
                            ...rolePermissions,
                            [perm.key]: e.target.checked,
                          })
                        }
                        className="size-4 mt-0.5 rounded accent-[#020333] cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">{perm.label}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{perm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#020333] hover:bg-[#020333]/90 py-3 text-sm font-bold text-white shadow-sm cursor-pointer"
                >
                  {editingRoleId ? "Save Changes" : "Create Role"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INVITE ADMIN MODAL */}
      {/* ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900">
                Invite Administrator
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Priyantha Kumara"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="priyantha@apparelbank.lk"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Assign Role *
                </label>
                <select
                  value={newAdminRoleId}
                  onChange={(e) => setNewAdminRoleId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#020333] hover:bg-[#020333]/90 py-3 text-sm font-bold text-white shadow-sm cursor-pointer"
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUPPLIER DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {selectedSupplier.id}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {selectedSupplier.businessName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Current Status */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
              {selectedSupplier.status === "approved" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800">
                  🟢 Approved
                </span>
              )}
              {selectedSupplier.status === "pending" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-black text-amber-900">
                  🟡 Pending Review
                </span>
              )}
              {selectedSupplier.status === "rejected" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-black text-rose-900">
                  🔴 Rejected
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400">Contact Person</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedSupplier.userName}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400">Mobile Phone</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedSupplier.phone}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400">Years in Operation</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {yearsLabels[selectedSupplier.yearsInOperation] || selectedSupplier.yearsInOperation}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400">Factory Workforce</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {workforceLabels[selectedSupplier.workforce] || selectedSupplier.workforce}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400">Minimum Order (MOQ)</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {moqLabels[selectedSupplier.moq] || selectedSupplier.moq}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400">Submission Timestamp</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {new Date(selectedSupplier.submittedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Garment Categories */}
            <div className="mt-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                Garment Manufacturing Capabilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSupplier.selectedCategories?.map((catId) => (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-100/80 px-2.5 py-1 text-xs font-bold text-blue-900"
                  >
                    <Check className="size-3 stroke-[3]" />
                    {categoryLabels[catId] || catId}
                  </span>
                ))}
              </div>
            </div>

            {/* Extended Profile Details (If Completed by Supplier) */}
            {selectedSupplier.profileDetails && (
              <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Post-Approval Completed Profile</span>
                </h4>

                {/* Business & Location */}
                {selectedSupplier.profileDetails.businessAndLocation?.address && (
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      📍 Verified Business & Location
                    </span>
                    <p className="text-xs font-extrabold text-slate-800">
                      BRN: {selectedSupplier.profileDetails.businessAndLocation.brn || "N/A"} •{" "}
                      {selectedSupplier.profileDetails.businessAndLocation.businessType}
                    </p>
                    <p className="text-xs font-medium text-slate-600">
                      {selectedSupplier.profileDetails.businessAndLocation.address},{" "}
                      {selectedSupplier.profileDetails.businessAndLocation.district}{" "}
                      {selectedSupplier.profileDetails.businessAndLocation.postalCode &&
                        `(${selectedSupplier.profileDetails.businessAndLocation.postalCode})`}
                    </p>
                  </div>
                )}

                {/* Operations & Logistics */}
                {selectedSupplier.profileDetails.operationsAndLogistics?.leadTime && (
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      🚚 Operations & Supply Chain Protocol
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold">Lead Time: </span>
                        <span className="font-bold text-slate-800">
                          {selectedSupplier.profileDetails.operationsAndLogistics.leadTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Delivery: </span>
                        <span className="font-bold text-slate-800">
                          {selectedSupplier.profileDetails.operationsAndLogistics.deliveryCapability}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 font-semibold">Fabric Sourcing: </span>
                        <span className="font-bold text-slate-800">
                          {selectedSupplier.profileDetails.operationsAndLogistics.fabricSourcing}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 font-semibold">Payment Terms: </span>
                        <span className="font-bold text-slate-800">
                          {selectedSupplier.profileDetails.operationsAndLogistics.paymentTerms}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Factory Branding */}
                {selectedSupplier.profileDetails.factoryBranding?.tagline && (
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      🏢 Factory Branding & Bio
                    </span>
                    <p className="text-xs font-semibold text-slate-700 italic">
                      &ldquo;{selectedSupplier.profileDetails.factoryBranding.tagline}&rdquo;
                    </p>
                    {selectedSupplier.profileDetails.factoryBranding.websiteOrSocial && (
                      <p className="text-xs font-bold text-blue-600">
                        Link: {selectedSupplier.profileDetails.factoryBranding.websiteOrSocial}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => {
                  handleUpdateStatus(selectedSupplier.id, "approved");
                }}
                className="flex h-12 w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 font-bold text-white shadow-sm hover:bg-emerald-700 cursor-pointer"
              >
                <Check className="size-4.5 stroke-[2.5]" />
                <span>Approve Application</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleUpdateStatus(selectedSupplier.id, "rejected");
                }}
                className="flex h-12 w-full sm:flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 font-bold text-white shadow-sm hover:bg-rose-700 cursor-pointer"
              >
                <X className="size-4.5 stroke-[2.5]" />
                <span>Reject Application</span>
              </button>

              <Link
                href="/marketplace"
                target="_blank"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 px-4 font-bold hover:bg-blue-100 cursor-pointer"
                title="Preview Fiverr Gig on Public Marketplace"
              >
                <ExternalLink className="size-4" />
                <span>Preview Gig</span>
              </Link>

              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-slate-300 px-5 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

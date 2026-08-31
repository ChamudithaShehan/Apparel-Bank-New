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
  MessageCircle,
  Phone,
  Send,
  AlertTriangle,
  History,
  ShoppingBag,
  Radio,
  Star,
  LogIn,
  Sparkles,
} from "lucide-react";
import {
  SupplierRegistration,
  getRegistrations,
  updateRegistrationStatus,
  setCurrentUser,
  INITIAL_REGISTRATIONS,
} from "@/lib/registrations";
import {
  RolePermission,
  AdminUser,
  BuyerRFQLead,
  getStoredRoles,
  addStoredRole,
  updateStoredRole,
  deleteStoredRole,
  getStoredAdmins,
  addStoredAdmin,
  updateStoredAdmin,
  deleteStoredAdmin,
  getStoredBuyerRFQs,
  updateStoredBuyerRFQStatus,
  INITIAL_ROLES,
  INITIAL_ADMINS,
  INITIAL_BUYER_RFQS,
} from "@/lib/admin-store";
import {
  AdminAuditLog,
  getStoredAuditLogs,
  addStoredAuditLog,
  INITIAL_AUDIT_LOGS,
} from "@/lib/audit-logs";
import { AuditLogViewer } from "@/components/audit-logs/AuditLogViewer";
import { BrandLogo } from "@/components/BrandLogo";

type AdminTab =
  | "dashboard"
  | "suppliers"
  | "rfqs"
  | "audit"
  | "analytics"
  | "roles"
  | "access"
  | "settings";

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

const REJECTION_PRESETS = [
  "Invalid or unverified Business Registration (BRN) number",
  "Factory premises address requires physical site verification",
  "Garment manufacturing capacity does not meet minimum quality guidelines",
  "Minimum Order Quantity (MOQ) and workforce capacity mismatch",
  "Contact phone number was unreachable during admin verification call",
];

export default function ProfessionalAdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [registrations, setRegistrations] = useState<SupplierRegistration[]>([]);
  const [roles, setRoles] = useState<RolePermission[]>([]);
  const [adminTeam, setAdminTeam] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [buyerRFQs, setBuyerRFQs] = useState<BuyerRFQLead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [rfqStatusFilter, setRfqStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRegistration | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Rejection Reason Modal State
  const [rejectModalSupplier, setRejectModalSupplier] = useState<SupplierRegistration | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");

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
    setRoles(getStoredRoles());
    setAdminTeam(getStoredAdmins());
    setAuditLogs(getStoredAuditLogs());
    setBuyerRFQs(getStoredBuyerRFQs());
    const storedRoles = getStoredRoles();
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
    const bName = supplier ? supplier.businessName : "Factory";

    // Log action to audit trail
    addStoredAuditLog({
      adminName: "Chamuditha Shehan",
      adminEmail: "chamuditha@apparelbank.lk",
      action: newStatus === "approved" ? "Approved Supplier Registration" : "Rejected Supplier Application",
      targetId: id,
      targetName: bName,
      details: notes || (newStatus === "approved" ? "Verified factory credentials" : "Rejection recorded"),
      type: newStatus === "approved" ? "approval" : "rejection",
      severity: newStatus === "approved" ? "success" : "warning",
    });
    setAuditLogs(getStoredAuditLogs());

    if (newStatus === "approved") {
      showToast(`Supplier registration for ${name} (${bName}) has been APPROVED.`, "success");
    } else {
      showToast(`Supplier application for ${name} (${bName}) was REJECTED.`, "error");
    }
  };

  const handleLoginAsSupplier = (supplier: SupplierRegistration) => {
    setCurrentUser(supplier);
    addStoredAuditLog({
      adminName: "Chamuditha Shehan",
      adminEmail: "chamuditha@apparelbank.lk",
      action: "Support Impersonation Login",
      targetId: supplier.id,
      targetName: supplier.businessName,
      details: `Admin viewed dashboard as ${supplier.userName} for technical support.`,
      type: "user_impersonation",
      severity: "info",
    });
    setAuditLogs(getStoredAuditLogs());
    showToast(`Logging in as ${supplier.userName} (${supplier.businessName})...`, "info");
    setTimeout(() => {
      window.open("/dashboard", "_blank");
    }, 400);
  };

  const handleDirectWhatsApp = (supplier: SupplierRegistration, customMsg?: string) => {
    const cleanPhone = supplier.phone.replace(/[^0-9]/g, "");
    const defaultText = `Hello ${supplier.userName}, this is the Apparel Bank Administration regarding your supplier registration for "${supplier.businessName}" (Ref ID: ${supplier.id}).`;
    const text = encodeURIComponent(customMsg || defaultText);
    window.open(`https://wa.me/94${cleanPhone.replace(/^0/, "")}?text=${text}`, "_blank");
  };

  const handleOpenRejectModal = (supplier: SupplierRegistration) => {
    setRejectModalSupplier(supplier);
    setRejectionReason(supplier.reviewNotes || "");
    setSelectedPreset("");
  };

  const handleConfirmReject = (sendWhatsApp: boolean) => {
    if (!rejectModalSupplier) return;
    const finalReason =
      rejectionReason.trim() ||
      selectedPreset ||
      "Application requirements not met during verification review.";

    handleUpdateStatus(rejectModalSupplier.id, "rejected", finalReason);

    if (sendWhatsApp) {
      const cleanPhone = rejectModalSupplier.phone.replace(/[^0-9]/g, "");
      const msg = `Hello ${rejectModalSupplier.userName},\n\nThis is the Apparel Bank Administration regarding your supplier registration for "${rejectModalSupplier.businessName}" (Ref ID: ${rejectModalSupplier.id}).\n\nYour application was not approved for the following reason:\n📌 "${finalReason}"\n\nIf you have updated your information or need assistance to rectify this, please reply here or contact our support desk at 011 234 5678.\n\nThank you,\nApparel Bank Verification Team`;
      window.open(`https://wa.me/94${cleanPhone.replace(/^0/, "")}?text=${encodeURIComponent(msg)}`, "_blank");
    }

    setRejectModalSupplier(null);
    setRejectionReason("");
    setSelectedPreset("");
  };

  const handleApproveWithWhatsApp = (supplier: SupplierRegistration) => {
    handleUpdateStatus(supplier.id, "approved");
    const cleanPhone = supplier.phone.replace(/[^0-9]/g, "");
    const msg = `🎉 Congratulations ${supplier.userName}!\n\nYour supplier registration for "${supplier.businessName}" (Ref ID: ${supplier.id}) has been APPROVED on Apparel Bank.\n\nTo activate your Verified Factory Badge and start receiving wholesale buyer orders, please sign in to your dashboard and complete your Factory Profile (Business & Location, Operations & Logistics, and Factory Branding):\n👉 https://apparelbank.lk/dashboard\n\nWelcome to Sri Lanka's leading garment marketplace!`;
    window.open(`https://wa.me/94${cleanPhone.replace(/^0/, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleUpdateRFQStatus = (rfqId: string, newStatus: BuyerRFQLead["status"]) => {
    const updated = updateStoredBuyerRFQStatus(rfqId, newStatus);
    setBuyerRFQs(updated);
    showToast(`RFQ lead ${rfqId} updated to ${newStatus.replace("_", " ").toUpperCase()}`, "success");
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
      localStorage.setItem("apparel_bank_audit_logs", JSON.stringify(INITIAL_AUDIT_LOGS));
      localStorage.setItem("apparel_bank_buyer_rfqs", JSON.stringify(INITIAL_BUYER_RFQS));
      setRegistrations(INITIAL_REGISTRATIONS);
      setRoles(INITIAL_ROLES);
      setAdminTeam(INITIAL_ADMINS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setBuyerRFQs(INITIAL_BUYER_RFQS);
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
    if (!res.success) {
      showToast(res.error || "Cannot delete role", "error");
    } else {
      setRoles(getStoredRoles());
      showToast("Role removed successfully.", "info");
    }
  };

  // Admin User Management Handlers
  const handleInviteAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminRoleId) return;

    const assignedRole = roles.find((r) => r.id === newAdminRoleId);
    addStoredAdmin(newAdminName, newAdminEmail, newAdminRoleId, assignedRole?.name || "Admin Member");
    setAdminTeam(getStoredAdmins());
    setShowInviteModal(false);
    setNewAdminName("");
    setNewAdminEmail("");
    showToast(`Invitation sent to ${newAdminEmail}.`, "success");
  };

  const handleToggleAdminStatus = (admin: AdminUser) => {
    const newStatus = admin.status === "active" ? "inactive" : "active";
    const updated = updateStoredAdmin(admin.id, { status: newStatus });
    setAdminTeam(updated);
    showToast(`${admin.name} is now ${newStatus.toUpperCase()}.`, "info");
  };

  const handleDeleteAdmin = (id: string) => {
    const updated = deleteStoredAdmin(id);
    setAdminTeam(updated);
    showToast("Administrator removed.", "info");
  };

  if (!mounted) return null;

  // Filtered Suppliers
  const filteredSuppliers = registrations.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || r.selectedCategories.includes(categoryFilter);
    const matchesSearch =
      r.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const filteredRFQs = buyerRFQs.filter((rfq) => {
    if (rfqStatusFilter === "all") return true;
    return rfq.status === rfqStatusFilter;
  });

  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const rejectedCount = registrations.filter((r) => r.status === "rejected").length;

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
    <div className="min-h-screen flex bg-[#F4F7FB] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white w-full overflow-x-hidden">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL ENTERPRISE SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:h-screen lg:sticky lg:top-0 shadow-lg lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link href="/" className="flex items-center gap-2 group">
              <BrandLogo variant="light" size="md" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black tracking-wider uppercase text-slate-400 mb-2">
              Control Panel
            </p>

            {/* 1. Dashboard Overview */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="size-4 shrink-0" />
                <span>Executive Overview</span>
              </div>
            </button>

            {/* 2. Suppliers Directory */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("suppliers");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "suppliers"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="size-4 shrink-0" />
                <span>Suppliers & Gigs</span>
              </div>
              {pendingCount > 0 && (
                <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* 3. Wholesale Buyer RFQ Pipeline */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("rfqs");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "rfqs"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="size-4 shrink-0" />
                <span>Buyer RFQs & Orders</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {buyerRFQs.length}
              </span>
            </button>

            {/* 4. Capacity Intelligence */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("analytics");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart2 className="size-4 shrink-0" />
                <span>Capacity Analytics</span>
              </div>
            </button>

            <p className="px-3 text-[10px] font-black tracking-wider uppercase text-slate-400 pt-3 mb-2">
              Security & Access
            </p>

            {/* 5. Roles & Permissions */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("roles");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "roles"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="size-4 shrink-0" />
                <span>Roles & Policies</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {roles.length}
              </span>
            </button>

            {/* 6. Admin Access */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("access");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "access"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="size-4 shrink-0" />
                <span>Admin Team</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                {adminTeam.length}
              </span>
            </button>

            {/* 7. Audit Logs & Administrative History */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("audit");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="size-4 shrink-0" />
                <span>Audit Logs & History</span>
              </div>
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {auditLogs.length}
              </span>
            </button>

            {/* 9. Settings */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("settings");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#020333] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Settings className="size-4 shrink-0" />
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar: Admin Profile */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#020333] text-xs font-black text-white">
              CS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-extrabold text-slate-900 truncate">Chamuditha Shehan</p>
              <p className="text-[10px] font-semibold text-slate-400 truncate">Super Admin</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold px-1 text-slate-500">
            <Link href="/" className="hover:text-slate-900 inline-flex items-center gap-1">
              <ExternalLink className="size-3" />
              <span>Public Portal</span>
            </Link>
            <Link href="/signin" className="text-blue-600 hover:text-blue-700">
              Supplier Login
            </Link>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN FLUID CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Top App Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs w-full">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="size-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-400 hidden sm:inline">Admin</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <h2 className="text-sm font-extrabold text-slate-900 capitalize">
                {activeTab.replace("_", " ")}
              </h2>
            </div>

            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suppliers, phone, ID, buyers..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3.5 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="size-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

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

        {/* Global Toast */}
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
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Operations Overview
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Real-time supplier verification pipeline, wholesale order flow, and compliance intelligence
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="size-3.5 text-slate-500" />
                  <span>Sync Demo Records</span>
                </button>
              </div>
            </div>

            {/* 4 Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
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
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Registered manufacturing partners</p>
              </div>

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
                    Requires Action
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Awaiting BRN & factory verification</p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-700">Verified Factories</span>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="size-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-3xl font-black text-emerald-600">{approvedCount}</p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Active on Marketplace
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">B2B verified production status</p>
              </div>

              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-purple-700">Buyer RFQ Pipeline</span>
                  <span className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <ShoppingBag className="size-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-3xl font-black text-purple-700">{buyerRFQs.length}</p>
                  <span className="inline-flex items-center text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    LKR 2.2M est.
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">Wholesale quotes in negotiation</p>
              </div>
            </div>

            {/* Quick Action Banner & Recent Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Action Center */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-[#020333] to-[#0A1852] p-6 text-white space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                        <Sparkles className="size-3" />
                        Verification Quick Actions
                      </span>
                      <h3 className="text-xl font-black text-white">
                        {pendingCount > 0 ? `${pendingCount} Applications Awaiting Review` : "All Applications Audited"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("suppliers");
                        setStatusFilter("pending");
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-[#020333] text-xs font-black hover:bg-slate-100 cursor-pointer transition-transform active:scale-98"
                    >
                      Audit Applications ↗
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Review incoming tailors, examine BRN documents, inspect machinery capacity, and approve suppliers or send direct WhatsApp feedback notes with one click.
                  </p>
                </div>

                {/* Recent Buyer Leads Spotlight */}
                <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <ShoppingBag className="size-4 text-emerald-600" />
                      <span>Latest Wholesale Buyer RFQs</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("rfqs")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      View All RFQs →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {buyerRFQs.slice(0, 3).map((rfq) => (
                      <div
                        key={rfq.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <p className="font-extrabold text-slate-900">
                            {rfq.buyerCompany} • <span className="text-blue-700">{rfq.quantity} {rfq.garmentCategory}</span>
                          </p>
                          <p className="text-slate-500 text-[11px]">
                            Target Factory: <strong>{rfq.supplierBusinessName}</strong> • {rfq.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {rfq.estimatedValue}
                          </span>
                          <a
                            href={`https://wa.me/94${rfq.buyerPhone.replace(/^0/, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                            title="Chat Buyer"
                          >
                            <MessageCircle className="size-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Live Audit Log Activity */}
              <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Activity className="size-4 text-blue-600" />
                    <span>Live Audit Activity</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("audit")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="text-xs space-y-1 pb-2 border-b border-slate-50">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800 truncate">{log.adminName}</span>
                        <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600 font-medium">
                        {log.action} on <strong>{log.targetName}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SUPPLIERS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === "suppliers" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Supplier Directory & Verification
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Audit factory applications, manage verified badges, broadcast updates, and dispatch rejection WhatsApp notes
                </p>
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBulkStatusChange("approved")}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold cursor-pointer"
                  >
                    <Check className="size-3.5" />
                    <span>Approve ({selectedIds.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkStatusChange("rejected")}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 text-xs font-bold cursor-pointer"
                  >
                    <X className="size-3.5" />
                    <span>Reject ({selectedIds.length})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: `All (${totalCount})` },
                  { id: "pending", label: `Pending (${pendingCount})` },
                  { id: "approved", label: `Approved (${approvedCount})` },
                  { id: "rejected", label: `Rejected (${rejectedCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === tab.id
                        ? "bg-[#020333] text-white shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none bg-slate-50 cursor-pointer"
                >
                  <option value="all">All Garment Categories</option>
                  <option value="tshirt">T-Shirts</option>
                  <option value="shirt">Shirts</option>
                  <option value="trousers">Trousers</option>
                  <option value="dresses">Dresses</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm min-w-[840px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.length > 0 && selectedIds.length === filteredSuppliers.length}
                          onChange={toggleSelectAll}
                          className="size-4 rounded accent-[#020333] cursor-pointer"
                        />
                      </th>
                      <th className="p-4 w-32">Reference ID</th>
                      <th className="p-4">Business & Contact</th>
                      <th className="p-4 w-36">Phone Number</th>
                      <th className="p-4 w-44">Capacity / MOQ</th>
                      <th className="p-4 w-36">Status</th>
                      <th className="p-4 text-right w-48">Actions</th>
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
                            className={`hover:bg-blue-50/20 transition-colors ${isSelected ? "bg-blue-50/40" : ""}`}
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
                              <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                                {supplier.id}
                              </span>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-extrabold text-slate-900 text-sm">{supplier.businessName}</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Contact: {supplier.userName}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                                {supplier.phone}
                              </span>
                            </td>
                            <td className="p-4 text-xs font-semibold">
                              <p className="text-slate-800 font-bold">MOQ: {moqLabels[supplier.moq] || supplier.moq}</p>
                              <p className="text-slate-400 text-[11px]">{workforceLabels[supplier.workforce] || supplier.workforce}</p>
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
                                  className="rounded-xl bg-slate-100 hover:bg-slate-200 p-2 text-slate-700 cursor-pointer transition-colors"
                                  title="View Full Supplier Dossier & Compliance"
                                >
                                  <Eye className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDirectWhatsApp(supplier)}
                                  className="rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white p-2 text-emerald-700 transition-colors border border-emerald-200 cursor-pointer"
                                  title="Direct WhatsApp Chat"
                                >
                                  <MessageCircle className="size-4" />
                                </button>
                                <a
                                  href={`tel:${supplier.phone}`}
                                  className="rounded-xl bg-slate-100 hover:bg-slate-200 p-2 text-slate-700 transition-colors cursor-pointer"
                                  title="Direct Phone Call"
                                >
                                  <Phone className="size-4" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(supplier.id, "approved")}
                                  disabled={supplier.status === "approved"}
                                  className={`rounded-xl p-2 transition-all cursor-pointer ${
                                    supplier.status === "approved"
                                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200"
                                  }`}
                                  title="Approve Supplier"
                                >
                                  <Check className="size-4 stroke-[2.5]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenRejectModal(supplier)}
                                  disabled={supplier.status === "rejected"}
                                  className={`rounded-xl p-2 transition-all cursor-pointer ${
                                    supplier.status === "rejected"
                                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                      : "bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200"
                                  }`}
                                  title="Reject with Custom Reason"
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

              <div className="p-4 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Showing {filteredSuppliers.length} of {totalCount} total suppliers</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BUYER RFQS & WHOLESALE LEADS OVERSIGHT */}
        {/* ========================================================================= */}
        {activeTab === "rfqs" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Wholesale Buyer RFQ & Leads Oversight
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Track incoming bulk apparel orders, facilitate negotiation between buyers and verified garment factories
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  Total Active RFQs: {buyerRFQs.length}
                </span>
              </div>
            </div>

            {/* RFQ Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
              {[
                { id: "all", label: `All RFQs (${buyerRFQs.length})` },
                { id: "new", label: `New (${buyerRFQs.filter((r) => r.status === "new").length})` },
                { id: "sample_requested", label: `Sample Requested (${buyerRFQs.filter((r) => r.status === "sample_requested").length})` },
                { id: "in_discussion", label: `In Discussion (${buyerRFQs.filter((r) => r.status === "in_discussion").length})` },
                { id: "deal_won", label: `Deal Won (${buyerRFQs.filter((r) => r.status === "deal_won").length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRfqStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    rfqStatusFilter === f.id ? "bg-[#020333] text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* RFQs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRFQs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {rfq.id}
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-1">{rfq.buyerCompany}</h3>
                        <p className="text-xs text-slate-500 font-semibold">Buyer: {rfq.buyerName} • 📞 {rfq.buyerPhone}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg block">
                          {rfq.estimatedValue}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block">{rfq.date}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Target Factory:</span>
                        <strong className="text-slate-800">{rfq.supplierBusinessName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Requested Volume:</span>
                        <strong className="text-slate-800">{rfq.quantity} ({rfq.garmentCategory})</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium italic bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                      &ldquo;{rfq.notes}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/94${rfq.buyerPhone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                      >
                        <MessageCircle className="size-3" />
                        <span>Chat Buyer</span>
                      </a>
                      <a
                        href={`tel:${rfq.buyerPhone}`}
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                        title="Call Buyer"
                      >
                        <Phone className="size-3.5" />
                      </a>
                    </div>

                    <select
                      value={rfq.status}
                      onChange={(e) => handleUpdateRFQStatus(rfq.id, e.target.value as any)}
                      className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 bg-white cursor-pointer"
                    >
                      <option value="new">New Lead</option>
                      <option value="sample_requested">Sample Requested</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="deal_won">Deal Won (Contract)</option>
                      <option value="closed">Closed / Inactive</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AUDIT LOGS & ADMINISTRATIVE HISTORY */}
        {/* ========================================================================= */}
        {activeTab === "audit" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Audit Logs & Administrative History
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Immutable chronological log of all supplier approvals, rejections, role policy adjustments, and broadcasts
                </p>
              </div>
            </div>

            {/* Modular AuditLogViewer Component */}
            <AuditLogViewer logs={auditLogs} />
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CAPACITY ANALYTICS */}
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
              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Factory Workforce Scale</h3>
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

              <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Minimum Order Quantity (MOQ) Mix</h3>
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
        {/* TAB 7: ROLES & POLICIES */}
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
                              <Check className="size-4 text-emerald-600 mx-auto stroke-[2.5]" />
                            ) : (
                              <X className="size-4 text-slate-300 mx-auto stroke-[2.5]" />
                            )}
                          </td>

                          <td className="p-4 text-center">
                            {r.permissions.exportData ? (
                              <Check className="size-4 text-emerald-600 mx-auto stroke-[2.5]" />
                            ) : (
                              <X className="size-4 text-slate-300 mx-auto stroke-[2.5]" />
                            )}
                          </td>

                          <td className="p-4 text-center">
                            {r.permissions.manageRoles ? (
                              <Check className="size-4 text-emerald-600 mx-auto stroke-[2.5]" />
                            ) : (
                              <X className="size-4 text-slate-300 mx-auto stroke-[2.5]" />
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditRole(r)}
                                className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                title="Edit Role"
                              >
                                <Edit2 className="size-3.5" />
                              </button>
                              {!r.isSystem && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRole(r.id)}
                                  className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 cursor-pointer"
                                  title="Delete Role"
                                >
                                  <Trash2 className="size-3.5" />
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
        {/* TAB 8: ADMIN ACCESS & TEAM */}
        {/* ========================================================================= */}
        {activeTab === "access" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Admin Team & Governance Access
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  Manage staff accounts, assign roles, and revoke administrative access
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#020333] hover:bg-[#020333]/90 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm cursor-pointer"
              >
                <UserPlus className="size-4" />
                <span>Invite New Administrator</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {adminTeam.map((admin) => (
                <div
                  key={admin.id}
                  className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[#020333] text-white text-xs font-black">
                        {admin.avatar}
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        admin.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      }`}>
                        {admin.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{admin.name}</h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{admin.email}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 font-bold block text-[10px]">Assigned Role:</span>
                      <p className="font-extrabold text-blue-950 mt-0.5">{admin.roleName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleAdminStatus(admin)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {admin.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    {admin.id !== "ADM-01" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full flex-1">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Configure verification thresholds, automated notification rules, and database policies
              </p>
            </div>

            <div className="max-w-2xl rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Verification SLA Timeout
                </label>
                <select className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold">
                  <option>24 Hours (Standard Review)</option>
                  <option>48 Hours (Extended Audit)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Automated Rejection WhatsApp Dispatch
                </label>
                <select className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold">
                  <option>Enabled with Pre-filled Confirmation Dialog</option>
                  <option>Disabled (Manual Dispatch Only)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => showToast("Settings updated successfully.", "success")}
                className="rounded-xl bg-[#020333] text-white px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                Save System Settings
              </button>
            </div>
          </main>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUPPLIER DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {selectedSupplier.id}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{selectedSupplier.businessName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSupplier(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Current Status & Admin Rejection Notes */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
                {selectedSupplier.status === "approved" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800">
                    🟢 Approved & Verified
                  </span>
                )}
                {selectedSupplier.status === "pending" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-black text-amber-900">
                    🟡 Pending Verification Review
                  </span>
                )}
                {selectedSupplier.status === "rejected" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-black text-rose-900">
                    🔴 Rejected
                  </span>
                )}
              </div>

              {selectedSupplier.status === "rejected" && selectedSupplier.reviewNotes && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 space-y-1">
                  <span className="text-[11px] font-black uppercase text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="size-3.5 text-rose-600" />
                    Admin Rejection Reason Logged:
                  </span>
                  <p className="text-xs font-semibold text-rose-900 leading-relaxed">
                    &ldquo;{selectedSupplier.reviewNotes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Direct Contact & Impersonation Ribbon */}
            <div className="mt-4 rounded-2xl bg-blue-50/70 border border-blue-100 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-900 block">Direct Factory Actions</span>
                <p className="text-xs font-bold text-slate-700">
                  {selectedSupplier.userName} ({selectedSupplier.phone})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDirectWhatsApp(selectedSupplier)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  <MessageCircle className="size-3.5" />
                  <span>WhatsApp</span>
                </button>
                <a
                  href={`tel:${selectedSupplier.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold"
                >
                  <Phone className="size-3.5" />
                  <span>Call</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleLoginAsSupplier(selectedSupplier)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#020333] hover:bg-[#020333]/90 text-white text-xs font-bold cursor-pointer shadow-2xs"
                  title="Impersonate & Open Supplier Dashboard"
                >
                  <LogIn className="size-3.5" />
                  <span>View Dashboard as Supplier ↗</span>
                </button>
              </div>
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
                <span className="text-[11px] font-bold uppercase text-slate-400">Submission Date</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {new Date(selectedSupplier.submittedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Compliance & Verification Documents Audit */}
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck2 className="size-4 text-blue-600" />
                <span>Compliance & Document Verification Checklist</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">BRN Certificate Status:</span>
                    <strong className="text-slate-800">
                      {selectedSupplier.profileDetails?.businessAndLocation?.brn || "PV-89210 (Verified)"}
                    </strong>
                  </div>
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Quality Standard:</span>
                    <strong className="text-slate-800">OEKO-TEX & AQL 2.5</strong>
                  </div>
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleApproveWithWhatsApp(selectedSupplier)}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm cursor-pointer"
                >
                  <Send className="size-4" />
                  <span>Approve & WhatsApp Welcome 🎉</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenRejectModal(selectedSupplier)}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <X className="size-4 stroke-[2.5]" />
                  <span>Reject with Reason (WhatsApp) 💬</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Link
                  href="/marketplace"
                  target="_blank"
                  className="flex-1 h-10 flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Preview Marketplace Gig</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedSupplier(null)}
                  className="px-5 h-10 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REJECTION REASON & WHATSAPP DISAPPROVAL MODAL */}
      {/* ========================================================================= */}
      {rejectModalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <XCircle className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Reject Supplier Application
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {rejectModalSupplier.businessName} ({rejectModalSupplier.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalSupplier(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Quick Rejection Presets (Click to Auto-fill):
                </label>
                <div className="space-y-1.5">
                  {REJECTION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset);
                        setRejectionReason(preset);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        rejectionReason === preset
                          ? "bg-rose-50 border-rose-300 text-rose-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      • {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Rejection Reason / Review Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the application cannot be approved and what the supplier needs to update..."
                  className="w-full rounded-xl border-2 border-slate-200 p-3 text-xs sm:text-sm font-semibold outline-none focus:border-rose-500"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-700 block mb-0.5">Supplier Contact:</span>
                <p>👤 {rejectModalSupplier.userName} • 📞 {rejectModalSupplier.phone}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleConfirmReject(true)}
                  className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-colors active:scale-98"
                >
                  <MessageCircle className="size-4" />
                  <span>Reject & Send Reason on WhatsApp 💬</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmReject(false)}
                    className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer transition-colors"
                  >
                    Reject Application Only
                  </button>

                  <button
                    type="button"
                    onClick={() => setRejectModalSupplier(null)}
                    className="px-4 h-11 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROLE MODAL */}
      {/* ========================================================================= */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingRoleId ? "Edit Role & Policies" : "Create Security Role"}
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-500">Permissions</label>
                <div className="space-y-2">
                  {[
                    { id: "approveReject", label: "Approve & Reject Supplier Applications" },
                    { id: "exportData", label: "Export CSV and Registry Data" },
                    { id: "manageRoles", label: "Manage Roles & Permissions" },
                  ].map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer text-xs font-bold"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(rolePermissions[perm.id as keyof typeof rolePermissions])}
                        onChange={(e) =>
                          setRolePermissions({
                            ...rolePermissions,
                            [perm.id]: e.target.checked,
                          })
                        }
                        className="size-4 rounded accent-[#020333]"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#020333] hover:bg-[#020333]/90 py-3 text-sm font-bold text-white shadow-sm cursor-pointer"
                >
                  Save Role
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
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
      {/* INVITE ADMIN MODAL */}
      {/* ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900">Invite Administrator</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name *</label>
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
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address *</label>
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
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Assign Role *</label>
                <select
                  value={newAdminRoleId}
                  onChange={(e) => setNewAdminRoleId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-blue-500 cursor-pointer bg-white"
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
    </div>
  );
}

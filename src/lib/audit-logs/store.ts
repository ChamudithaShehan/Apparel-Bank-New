import { AdminAuditLog, AuditLogFilter, AuditLogStats } from "./types";

export const AUDIT_LOGS_STORAGE_KEY = "apparel_bank_audit_logs";

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: "LOG-905",
    adminName: "Chamuditha Shehan",
    adminEmail: "chamuditha@apparelbank.lk",
    action: "Approved Supplier Registration & Granted Verified Factory Badge",
    targetId: "REG-8012",
    targetName: "Lanka Weave Handlooms",
    details: "All business documents, BRN (PV-89210), and in-house sample portfolio verified.",
    timestamp: "10 mins ago",
    isoDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: "approval",
    severity: "success",
    ipAddress: "192.168.1.104",
  },
  {
    id: "LOG-904",
    adminName: "Dilini Senanayake",
    adminEmail: "dilini.s@apparelbank.lk",
    action: "Dispatched Rejection WhatsApp Notice with Reason",
    targetId: "REG-8015",
    targetName: "TexLine Apparel",
    details: "Reason: Invalid or unverified Business Registration (BRN) number.",
    timestamp: "45 mins ago",
    isoDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: "rejection",
    severity: "warning",
    ipAddress: "192.168.1.112",
  },
  {
    id: "LOG-903",
    adminName: "Chamuditha Shehan",
    adminEmail: "chamuditha@apparelbank.lk",
    action: "Tagged Supplier as Featured Marketplace Spotlight",
    targetId: "REG-8012",
    targetName: "Lanka Weave Handlooms",
    details: "Promoted to Top 1 Marketplace spotlight ranking with gold badge.",
    timestamp: "2 hours ago",
    isoDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: "featured",
    severity: "info",
    ipAddress: "192.168.1.104",
  },
  {
    id: "LOG-902",
    adminName: "Roshana Jayasinghe",
    adminEmail: "roshana@apparelbank.lk",
    action: "Dispatched WhatsApp Broadcast Reminder",
    targetId: "ALL-PENDING",
    targetName: "5 Pending Suppliers",
    details: "Broadcast: Reminder to upload clothing samples & complete factory profile.",
    timestamp: "Yesterday, 04:15 PM",
    isoDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: "broadcast",
    severity: "info",
    ipAddress: "192.168.1.108",
  },
  {
    id: "LOG-901",
    adminName: "Chamuditha Shehan",
    adminEmail: "chamuditha@apparelbank.lk",
    action: "Created New Security Policy Role",
    targetId: "ROLE-VERIFY",
    targetName: "Verification Officer",
    details: "Granted approve/reject and export registry permissions.",
    timestamp: "2 days ago",
    isoDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: "role",
    severity: "info",
    ipAddress: "192.168.1.104",
  },
  {
    id: "LOG-900",
    adminName: "Dilini Senanayake",
    adminEmail: "dilini.s@apparelbank.lk",
    action: "Support Impersonation Login",
    targetId: "REG-8012",
    targetName: "Lanka Weave Handlooms",
    details: "Assisted supplier with factory branding banner setup over support call.",
    timestamp: "3 days ago",
    isoDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: "user_impersonation",
    severity: "info",
    ipAddress: "192.168.1.112",
  },
];

// Get all audit logs from localStorage or fallback to defaults
export function getStoredAuditLogs(): AdminAuditLog[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

// Add a new audit log entry
export function addStoredAuditLog(
  log: Omit<AdminAuditLog, "id" | "timestamp" | "isoDate">
): AdminAuditLog {
  const logs = getStoredAuditLogs();
  const newLog: AdminAuditLog = {
    ...log,
    id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: "Just now",
    isoDate: new Date().toISOString(),
  };

  const updated = [newLog, ...logs];
  if (typeof window !== "undefined") {
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(updated));
  }
  return newLog;
}

// Clear all audit logs
export function clearAuditLogs(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify([]));
  }
}

// Export Audit Logs to CSV string
export function exportAuditLogsToCSV(logs: AdminAuditLog[]): void {
  const headers = "ID,Timestamp,Admin Name,Action,Target ID,Target Name,Details,Type,Severity\n";
  const rows = logs
    .map(
      (l) =>
        `"${l.id}","${l.timestamp}","${l.adminName}","${l.action}","${l.targetId}","${l.targetName}","${l.details || ""}","${l.type}","${l.severity || "info"}"`
    )
    .join("\n");

  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `apparel_bank_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Filter audit logs
export function filterAuditLogs(
  logs: AdminAuditLog[],
  filter: AuditLogFilter
): AdminAuditLog[] {
  return logs.filter((log) => {
    if (filter.type && filter.type !== "all" && log.type !== filter.type) {
      return false;
    }
    if (filter.adminName && filter.adminName !== "all" && log.adminName !== filter.adminName) {
      return false;
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      const match =
        log.adminName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetName.toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

// Calculate audit summary statistics
export function getAuditStats(logs: AdminAuditLog[]): AuditLogStats {
  return {
    totalLogs: logs.length,
    approvalsCount: logs.filter((l) => l.type === "approval").length,
    rejectionsCount: logs.filter((l) => l.type === "rejection").length,
    broadcastsCount: logs.filter((l) => l.type === "broadcast").length,
    securityEventsCount: logs.filter((l) => l.type === "role" || l.type === "security").length,
  };
}

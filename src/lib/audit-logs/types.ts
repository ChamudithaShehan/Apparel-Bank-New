export type AuditActionType =
  | "approval"
  | "rejection"
  | "broadcast"
  | "role"
  | "featured"
  | "system"
  | "security"
  | "export"
  | "user_impersonation";

export type AuditSeverity = "info" | "warning" | "critical" | "success";

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail?: string;
  action: string;
  targetId: string;
  targetName: string;
  details?: string;
  timestamp: string;
  isoDate?: string;
  type: AuditActionType;
  severity?: AuditSeverity;
  ipAddress?: string;
}

export interface AuditLogFilter {
  searchQuery?: string;
  type?: AuditActionType | "all";
  adminName?: string | "all";
  dateRange?: "all" | "today" | "week" | "month";
}

export interface AuditLogStats {
  totalLogs: number;
  approvalsCount: number;
  rejectionsCount: number;
  broadcastsCount: number;
  securityEventsCount: number;
}

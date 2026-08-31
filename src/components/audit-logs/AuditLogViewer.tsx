"use client";

import { useState } from "react";
import {
  Activity,
  Check,
  X,
  Radio,
  Shield,
  Star,
  Search,
  Download,
  Filter,
  User,
  Clock,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { AdminAuditLog, AuditActionType } from "@/lib/audit-logs/types";
import { exportAuditLogsToCSV, filterAuditLogs } from "@/lib/audit-logs/store";

interface AuditLogViewerProps {
  logs: AdminAuditLog[];
  onRefresh?: () => void;
}

export function AuditLogViewer({ logs, onRefresh }: AuditLogViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<AuditActionType | "all">("all");
  const [selectedAdmin, setSelectedAdmin] = useState<string>("all");
  const [activeLogDetail, setActiveLogDetail] = useState<AdminAuditLog | null>(null);

  const adminList = Array.from(new Set(logs.map((l) => l.adminName)));

  const filtered = filterAuditLogs(logs, {
    searchQuery,
    type: selectedType,
    adminName: selectedAdmin,
  });

  const getActionBadge = (type: AuditActionType) => {
    switch (type) {
      case "approval":
        return {
          icon: Check,
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          label: "Approved",
        };
      case "rejection":
        return {
          icon: X,
          bg: "bg-rose-100 text-rose-800 border-rose-200",
          label: "Rejected",
        };
      case "featured":
        return {
          icon: Star,
          bg: "bg-amber-100 text-amber-900 border-amber-200",
          label: "Spotlight",
        };
      case "broadcast":
        return {
          icon: Radio,
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Broadcast",
        };
      case "role":
        return {
          icon: Shield,
          bg: "bg-purple-100 text-purple-800 border-purple-200",
          label: "Policy Role",
        };
      case "user_impersonation":
        return {
          icon: User,
          bg: "bg-indigo-100 text-indigo-800 border-indigo-200",
          label: "Impersonation",
        };
      default:
        return {
          icon: Activity,
          bg: "bg-slate-100 text-slate-800 border-slate-200",
          label: "System",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Search, Type Filter, Admin Filter, CSV Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, admin name, target ID, details..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-[#020333] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 cursor-pointer"
          >
            <option value="all">All Action Types</option>
            <option value="approval">Approvals</option>
            <option value="rejection">Rejections</option>
            <option value="featured">Featured Spotlights</option>
            <option value="broadcast">Broadcasts</option>
            <option value="role">Roles & Policies</option>
            <option value="user_impersonation">Impersonation</option>
          </select>

          <select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 cursor-pointer"
          >
            <option value="all">All Admins</option>
            {adminList.map((adm) => (
              <option key={adm} value={adm}>
                {adm}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => exportAuditLogsToCSV(filtered)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
            title="Download CSV report"
          >
            <Download className="size-3.5 text-slate-500" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table / Timeline List */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-semibold text-xs">
              No matching audit entries found.
            </div>
          ) : (
            filtered.map((log) => {
              const badge = getActionBadge(log.type);
              const Icon = badge.icon;
              return (
                <div
                  key={log.id}
                  onClick={() => setActiveLogDetail(log)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`flex size-9 rounded-xl items-center justify-center shrink-0 border ${badge.bg}`}
                    >
                      <Icon className="size-4 stroke-[2.5]" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          {log.adminName}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {log.targetId}
                        </span>
                      </div>

                      <p className="font-extrabold text-slate-800 leading-snug">
                        {log.action} on{" "}
                        <span className="text-blue-900 underline decoration-dotted">
                          {log.targetName}
                        </span>
                      </p>

                      {log.details && (
                        <p className="text-slate-500 font-medium text-[11px] line-clamp-1">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-slate-400 text-[11px] font-bold">
                    <Clock className="size-3" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Log Detail Modal */}
      {activeLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {activeLogDetail.id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Audit Log Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLogDetail(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">
                  Action Executed
                </span>
                <p className="font-extrabold text-slate-900">
                  {activeLogDetail.action}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Admin Officer
                  </span>
                  <p className="font-extrabold text-slate-800">
                    {activeLogDetail.adminName}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Timestamp
                  </span>
                  <p className="font-extrabold text-slate-800">
                    {activeLogDetail.timestamp}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">
                  Target Entity
                </span>
                <p className="font-extrabold text-slate-800">
                  {activeLogDetail.targetName} ({activeLogDetail.targetId})
                </p>
              </div>

              {activeLogDetail.details && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Notes & Details
                  </span>
                  <p className="font-medium text-slate-700 leading-relaxed">
                    {activeLogDetail.details}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveLogDetail(null)}
              className="w-full h-11 rounded-xl bg-[#020333] hover:bg-[#020333]/90 text-white text-xs font-bold cursor-pointer"
            >
              Close Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

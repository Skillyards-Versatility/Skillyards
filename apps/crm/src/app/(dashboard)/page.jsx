"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  CalendarClock,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Loader2,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await crmApi.getLeads({ limit: 8 });
        setLeads(res.items || []);
        setTotalLeads(res.pagination?.total || 0);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="crm-page-title text-2xl font-bold">Sales Command Center</h1>
        <p className="crm-page-subtitle text-sm mt-1">
          High-velocity prospect tracking, automated follow-ups & conversion analytics.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/leads"
          className="crm-card p-5 block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-platinum-400 group-hover:text-dark-teal-300 transition-colors">
              Total Leads
            </span>
            <div className="p-2 rounded-lg bg-dark-teal-900/60 text-dark-teal-300 border border-dark-teal-700/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-platinum-50">{totalLeads}</span>
            <span className="text-xs text-deep-ocean-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
        </Link>

        <Link
          href="/queue"
          className="crm-card p-5 block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-platinum-400 group-hover:text-dark-teal-300 transition-colors">
              Active Queue
            </span>
            <div className="p-2 rounded-lg bg-dark-teal-900/60 text-dark-teal-300 border border-dark-teal-700/40">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-platinum-50">
              {leads.filter((l) => l.status === "new").length}
            </span>
            <span className="text-xs text-platinum-400 font-medium">Pending calls</span>
          </div>
        </Link>

        <Link
          href="/follow-ups"
          className="crm-card p-5 block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-platinum-400 group-hover:text-deep-ocean-300 transition-colors">
              Follow-ups Due
            </span>
            <div className="p-2 rounded-lg bg-deep-ocean-900/60 text-deep-ocean-300 border border-deep-ocean-700/40">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-platinum-50">
              {leads.filter((l) => l.status === "follow_up").length}
            </span>
            <span className="text-xs text-deep-ocean-400 font-semibold">Scheduled</span>
          </div>
        </Link>

        <Link
          href="/counselling"
          className="crm-card p-5 block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-platinum-400 group-hover:text-pale-oak-300 transition-colors">
              Counselling
            </span>
            <div className="p-2 rounded-lg bg-pale-oak-900/60 text-pale-oak-300 border border-pale-oak-700/40">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-platinum-50">
              {leads.filter((l) => l.status === "counselling_scheduled" || l.status === "counselled").length}
            </span>
            <span className="text-xs text-pale-oak-300 font-semibold">Active & Booked</span>
          </div>
        </Link>
      </div>

      {/* EOD Quick Action Banner */}
      <div className="crm-panel p-4 bg-gradient-to-r from-dark-teal-950/70 via-platinum-950 to-deep-ocean-950/40 border border-dark-teal-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-dark-teal-900/60 border border-dark-teal-700/60 flex items-center justify-center shrink-0 text-deep-ocean-300">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-platinum-100">
              End-of-Day Attainment & Submission Engine
            </h2>
            <p className="text-[11px] text-platinum-400 mt-0.5">
              Live server target calculation with automatic completed counselling relief.
            </p>
          </div>
        </div>

        <Link href="/eod" className="crm-btn-primary shrink-0 text-xs">
          <span>Open EOD Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Leads Table */}
      <div className="crm-panel overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-platinum-800">
          <div>
            <h2 className="text-sm font-bold text-platinum-50">Recent Prospects</h2>
            <p className="text-xs text-platinum-400">Latest leads registered across website & campaigns</p>
          </div>
          <Link
            href="/leads"
            className="flex items-center gap-1.5 text-xs font-semibold text-dark-teal-400 hover:text-dark-teal-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-platinum-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-dark-teal-400" />
            <span className="text-xs">Loading leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center text-platinum-500 text-xs">
            No leads found. Create your first lead using the New Lead button above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead className="crm-thead">
                <tr>
                  <th className="crm-th">Lead Name</th>
                  <th className="crm-th">Contact</th>
                  <th className="crm-th">Status</th>
                  <th className="crm-th">Assigned To</th>
                  <th className="crm-th">Created</th>
                  <th className="crm-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="crm-tbody">
                {leads.map((lead) => (
                  <tr key={lead.id} className="crm-tr group">
                    <td className="crm-td">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="crm-lead-link"
                      >
                        {lead.fullName || lead.name || "Unnamed"}
                      </Link>
                    </td>
                    <td className="crm-td text-platinum-300">
                      <div className="text-platinum-200">{lead.normalizedPhone || lead.phone || "-"}</div>
                      <div className="text-[11px] text-platinum-400">{lead.normalizedEmail || lead.email || ""}</div>
                    </td>
                    <td className="crm-td">
                      <span className={getStatusBadgeClass(lead.status)}>
                        {formatStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="crm-td text-platinum-300">
                      {lead.assignedToUserName || <span className="text-platinum-500 italic">Unassigned</span>}
                    </td>
                    <td className="crm-td text-platinum-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="crm-td text-right">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="crm-btn-secondary !py-1 !px-2.5 text-[11px]"
                      >
                        <span>Open</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

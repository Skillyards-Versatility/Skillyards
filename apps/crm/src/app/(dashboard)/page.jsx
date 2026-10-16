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
} from "lucide-react";
import { crmApi } from "@/lib/api";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  follow_up: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  counselling_scheduled: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  counselled: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  converted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  cold: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  lost: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

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
        <h1 className="text-2xl font-bold tracking-tight text-white">Sales Command Center</h1>
        <p className="text-sm text-slate-400 mt-1">
          High-velocity prospect tracking, automated follow-ups & conversion analytics.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Leads</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalLeads}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Queue</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {leads.filter((l) => l.status === "new").length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Pending calls</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Follow-ups Due</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {leads.filter((l) => l.status === "follow_up").length}
            </span>
            <span className="text-xs text-purple-400 font-medium">Scheduled</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Counselling</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {leads.filter((l) => l.status === "counselling_scheduled" || l.status === "counselled").length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Booked</span>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Prospects</h2>
            <p className="text-xs text-slate-400">Latest leads registered across website & campaigns</p>
          </div>
          <Link
            href="/leads"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            <span className="text-xs">Loading leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No leads found. Create your first lead using the New Lead button above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Lead Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Assigned To</th>
                  <th className="px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-white">
                      {lead.fullName || lead.name || "Unnamed"}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      <div>{lead.normalizedPhone || lead.phone || "-"}</div>
                      <div className="text-[11px] text-slate-500">{lead.normalizedEmail || lead.email || ""}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
                          STATUS_COLORS[lead.status] || "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {lead.assignedToUserName || "Unassigned"}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
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

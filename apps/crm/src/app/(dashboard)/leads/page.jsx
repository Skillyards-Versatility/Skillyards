"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Loader2, Phone, Mail, CheckCircle, RefreshCw, ArrowUpRight } from "lucide-react";
import { crmApi } from "@/lib/api";

const STATUS_TABS = [
  { label: "All Leads", value: "" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Follow-up", value: "follow_up" },
  { label: "Counselling", value: "counselling_scheduled" },
  { label: "Qualified", value: "qualified" },
  { label: "Converted", value: "converted" },
  { label: "Lost", value: "lost" },
];

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

export default function LeadsDirectoryPage() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getLeads({
        status: statusFilter || undefined,
        search: search || undefined,
        limit: 50,
      });
      setLeads(res.items || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Leads Pipeline</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {leads.length} of {total} registered prospects
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
        >
          Search
        </button>
      </form>

      {/* Leads Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            <span className="text-xs">Fetching leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No leads match current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Lead Details</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Lifecycle Status</th>
                  <th className="px-6 py-3">Assigned Rep</th>
                  <th className="px-6 py-3">Registered At</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-3.5 font-semibold text-white">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>{lead.fullName || lead.name || "Unnamed"}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lead.normalizedPhone || lead.phone || "-"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lead.normalizedEmail || lead.email || "-"}</span>
                      </div>
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
                    <td className="px-6 py-3.5 text-slate-400 font-medium">
                      {lead.assignedToUserName || (
                        <span className="text-slate-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white font-medium text-[11px] transition-colors"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
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

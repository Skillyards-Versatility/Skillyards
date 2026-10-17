"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, Phone, Mail, RefreshCw, ArrowUpRight } from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";

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
      console.warn("Could not load leads from backend:", err.message);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="crm-page-title">Leads Pipeline</h1>
          <p className="crm-page-subtitle">
            Showing {leads.length} of {total} registered prospects
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="crm-btn-secondary self-start"
          title="Refresh leads"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="crm-tab-bar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={statusFilter === tab.value ? "crm-tab-active" : "crm-tab-inactive"}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-platinum-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="crm-input pl-9"
          />
        </div>
        <button type="submit" className="crm-btn-primary">
          Search
        </button>
      </form>

      {/* Leads Table */}
      <div className="crm-panel overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center text-platinum-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-dark-teal-400" />
            <span className="text-xs">Fetching leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-platinum-500 text-xs">
            No leads match current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead className="crm-thead">
                <tr>
                  <th className="crm-th">Lead Details</th>
                  <th className="crm-th">Phone</th>
                  <th className="crm-th">Email</th>
                  <th className="crm-th">Lifecycle Status</th>
                  <th className="crm-th">Assigned Rep</th>
                  <th className="crm-th">Registered At</th>
                  <th className="crm-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="crm-tbody">
                {leads.map((lead) => (
                  <tr key={lead.id} className="crm-tr group">
                    <td className="crm-td">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="crm-lead-link flex items-center gap-1.5"
                      >
                        <span>{lead.fullName || lead.name || "Unnamed"}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-deep-ocean-400" />
                      </Link>
                    </td>
                    <td className="crm-td text-platinum-200">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-platinum-500" />
                        <span>{lead.normalizedPhone || lead.phone || "-"}</span>
                      </div>
                    </td>
                    <td className="crm-td text-platinum-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-platinum-500" />
                        <span>{lead.normalizedEmail || lead.email || "-"}</span>
                      </div>
                    </td>
                    <td className="crm-td">
                      <span className={getStatusBadgeClass(lead.status)}>
                        {formatStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="crm-td text-platinum-300 font-medium">
                      {lead.assignedToUserName || (
                        <span className="text-platinum-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="crm-td text-platinum-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="crm-td text-right">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="crm-btn-secondary !py-1 !px-2.5 text-[11px]"
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

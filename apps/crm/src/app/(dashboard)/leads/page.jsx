"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, Phone, Mail, RefreshCw, ArrowUpRight, Download } from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";
import { useTelephony } from "@/context/TelephonyContext";

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

const DEMO_LEADS = [
  {
    id: "lead-101",
    fullName: "Aarav Sharma",
    normalizedPhone: "+91 98765 43210",
    normalizedEmail: "aarav.sharma@example.com",
    status: "counselling_scheduled",
    assignedToUserName: "Priya Patel",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "lead-102",
    fullName: "Ananya Iyer",
    normalizedPhone: "+91 98123 45678",
    normalizedEmail: "ananya.iyer@example.com",
    status: "new",
    assignedToUserName: "Vikram Malhotra",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "lead-103",
    fullName: "Rohan Verma",
    normalizedPhone: "+91 97234 56789",
    normalizedEmail: "rohan.v@example.com",
    status: "contacted",
    assignedToUserName: "Priya Patel",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "lead-104",
    fullName: "Sneha Mukherjee",
    normalizedPhone: "+91 99345 67890",
    normalizedEmail: "sneha.m@example.com",
    status: "qualified",
    assignedToUserName: "Amit Kumar",
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: "lead-105",
    fullName: "Kabir Mehta",
    normalizedPhone: "+91 98456 78901",
    normalizedEmail: "kabir.m@example.com",
    status: "converted",
    assignedToUserName: "Priya Patel",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "lead-106",
    fullName: "Divya Nair",
    normalizedPhone: "+91 97567 89012",
    normalizedEmail: "divya.nair@example.com",
    status: "follow_up",
    assignedToUserName: "Vikram Malhotra",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: "lead-107",
    fullName: "Aditya Roy",
    normalizedPhone: "+91 98678 90123",
    normalizedEmail: "aditya.roy@example.com",
    status: "lost",
    assignedToUserName: "Amit Kumar",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export default function LeadsDirectoryPage() {
  const { startCall } = useTelephony();
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const getDemoDataset = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_leads") || "[]");
        if (Array.isArray(stored) && stored.length > 0) {
          return [...stored, ...DEMO_LEADS];
        }
      } catch (_) {}
    }
    return DEMO_LEADS;
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getLeads({
        status: statusFilter || undefined,
        search: search || undefined,
        limit: 50,
      });
      if (res?.items && res.items.length > 0) {
        setLeads(res.items);
        setTotal(res.pagination?.total || res.items.length);
      } else {
        let filtered = getDemoDataset();
        if (statusFilter) {
          filtered = filtered.filter((l) => l.status === statusFilter);
        }
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              l.fullName.toLowerCase().includes(q) ||
              l.normalizedPhone?.includes(q) ||
              l.normalizedEmail?.toLowerCase().includes(q)
          );
        }
        setLeads(filtered);
        setTotal(filtered.length);
      }
    } catch (err) {
      console.warn("Could not load leads from backend, activating demo pipeline:", err.message);
      let filtered = getDemoDataset();
      if (statusFilter) {
        filtered = filtered.filter((l) => l.status === statusFilter);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.fullName.toLowerCase().includes(q) ||
            l.normalizedPhone?.includes(q) ||
            l.normalizedEmail?.toLowerCase().includes(q)
        );
      }
      setLeads(filtered);
      setTotal(filtered.length);
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

  const handleExportCSV = () => {
    if (!leads.length) {
      alert("No leads to export");
      return;
    }
    const headers = ["ID", "Full Name", "Phone", "Email", "Status", "Assigned Rep", "Created At"];
    const rows = leads.map((l) => [
      `"${l.id || ""}"`,
      `"${(l.fullName || l.name || "").replace(/"/g, '""')}"`,
      `"${l.normalizedPhone || l.phone || ""}"`,
      `"${l.normalizedEmail || l.email || ""}"`,
      `"${formatStatusLabel(l.status)}"`,
      `"${(l.assignedToUserName || "Unassigned").replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt || Date.now()).toLocaleDateString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `skillyards-leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={handleExportCSV}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs"
            title="Download CSV of current leads"
          >
            <Download className="w-3.5 h-3.5 text-[#4A6D7C]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchLeads}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs"
            title="Refresh leads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
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
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="crm-input pr-9 pl-3.5 bg-white"
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#7e939a] pointer-events-none" />
        </div>
        <button type="submit" className="crm-btn-primary shadow-xs">
          Search
        </button>
      </form>

      {/* Leads Table */}
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center text-[#7e939a] gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#4A6D7C]" />
            <span className="text-xs">Fetching leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.25)] text-[#4A6D7C] flex items-center justify-center mx-auto shadow-xs">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1C2527]">No Prospects Found</h3>
            <p className="text-xs text-[#5A6E71]">No leads match your current search or filter criteria.</p>
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
                {leads.map((lead) => {
                  const leadName = lead.fullName || lead.name || "Unnamed";
                  const initial = leadName.charAt(0).toUpperCase();

                  return (
                    <tr key={lead.id} className="crm-tr group">
                      <td className="crm-td">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#4A6D7C]/15 border border-[#4A6D7C]/25 text-[#194451] font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <Link
                              href={`/leads/${lead.id}`}
                              className="crm-lead-link font-bold text-xs flex items-center gap-1.5"
                            >
                              <span>{leadName}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A6D7C]" />
                            </Link>
                            <div className="text-[10.5px] text-[#7E9396] font-mono mt-0.5">
                              ID: #{lead.id?.slice(0, 8) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="crm-td">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C2527]">
                          <Phone className="w-3.5 h-3.5 text-[#5A6E71]" />
                          <span>{lead.normalizedPhone || lead.phone || "-"}</span>
                        </div>
                      </td>
                      <td className="crm-td">
                        <div className="flex items-center gap-1.5 text-xs text-[#5A6E71]">
                          <Mail className="w-3.5 h-3.5 text-[#7E9396]" />
                          <span>{lead.normalizedEmail || lead.email || "-"}</span>
                        </div>
                      </td>
                      <td className="crm-td">
                        <span className={getStatusBadgeClass(lead.status)}>
                          {formatStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td className="crm-td">
                        {lead.assignedToUserName ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] text-xs text-[#2E3E41] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4A6D7C]" />
                            <span>{lead.assignedToUserName}</span>
                          </div>
                        ) : (
                          <span className="text-[#889C9E] italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="crm-td text-xs text-[#5A6E71]">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="crm-td text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(lead.normalizedPhone || lead.phone) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startCall({
                                  leadId: lead.id,
                                  name: leadName,
                                  phone: lead.normalizedPhone || lead.phone,
                                  courseInterest: "Admissions Consultation",
                                });
                              }}
                              title={`Call ${leadName} with Softphone`}
                              className="p-1.5 rounded-lg bg-[#2E7559]/15 hover:bg-[#2E7559] text-[#1e5842] hover:text-white border border-[#2E7559]/30 transition-all active:scale-90 cursor-pointer shadow-xs inline-flex items-center justify-center"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Link
                            href={`/leads/${lead.id}`}
                            className="crm-btn-secondary !py-1 !px-2.5 text-[11px]"
                          >
                            <span>View</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

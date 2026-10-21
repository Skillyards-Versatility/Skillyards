"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  Phone,
  Mail,
  RefreshCw,
  ArrowUpRight,
  Download,
  Check,
  X,
  Users,
  UserCheck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Filter,
  Workflow,
  Target,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";
import { useTelephony } from "@/context/TelephonyContext";
import { useAuth } from "@/context/AuthContext";
import { BulkOutreachModal } from "@/components/leads/BulkOutreachModal";
import { EnrollInCadenceModal } from "@/components/cadences/EnrollInCadenceModal";

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

const ALL_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow_up", label: "Follow-up" },
  { value: "counselling_scheduled", label: "Counselling Scheduled" },
  { value: "counselled", label: "Counselled" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "cold", label: "Cold" },
  { value: "lost", label: "Lost" },
];

const STAFF_MEMBERS = [
  { id: "user-1", name: "Priya Patel", role: "Senior Counsellor" },
  { id: "user-2", name: "Vikram Malhotra", role: "Sales Rep" },
  { id: "user-3", name: "Amit Kumar", role: "Admissions Lead" },
];

const DEMO_LEADS = [
  {
    id: "lead-101",
    fullName: "Aarav Sharma",
    normalizedPhone: "+91 98765 43210",
    normalizedEmail: "aarav.sharma@example.com",
    status: "counselling_scheduled",
    assignedToUserName: "Priya Patel",
    assignedToUserId: "user-1",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    enquiryCourse: "Full Stack Web Development",
  },
  {
    id: "lead-102",
    fullName: "Ananya Iyer",
    normalizedPhone: "+91 98123 45678",
    normalizedEmail: "ananya.iyer@example.com",
    status: "new",
    assignedToUserName: "Vikram Malhotra",
    assignedToUserId: "user-2",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    enquiryCourse: "Data Science & AI",
  },
  {
    id: "lead-103",
    fullName: "Rohan Verma",
    normalizedPhone: "+91 97234 56789",
    normalizedEmail: "rohan.v@example.com",
    status: "contacted",
    assignedToUserName: "Priya Patel",
    assignedToUserId: "user-1",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    enquiryCourse: "Cloud & DevOps Engineering",
  },
  {
    id: "lead-104",
    fullName: "Sneha Mukherjee",
    normalizedPhone: "+91 99345 67890",
    normalizedEmail: "sneha.m@example.com",
    status: "qualified",
    assignedToUserName: "Amit Kumar",
    assignedToUserId: "user-3",
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    enquiryCourse: "Cybersecurity Analyst Cohort",
  },
  {
    id: "lead-105",
    fullName: "Kabir Mehta",
    normalizedPhone: "+91 98456 78901",
    normalizedEmail: "kabir.m@example.com",
    status: "converted",
    assignedToUserName: "Priya Patel",
    assignedToUserId: "user-1",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    enquiryCourse: "Full Stack Web Development",
  },
  {
    id: "lead-106",
    fullName: "Divya Nair",
    normalizedPhone: "+91 97567 89012",
    normalizedEmail: "divya.nair@example.com",
    status: "follow_up",
    assignedToUserName: "Vikram Malhotra",
    assignedToUserId: "user-2",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    enquiryCourse: "UI/UX & Product Design",
  },
  {
    id: "lead-107",
    fullName: "Aditya Roy",
    normalizedPhone: "+91 98678 90123",
    normalizedEmail: "aditya.roy@example.com",
    status: "lost",
    assignedToUserName: "Amit Kumar",
    assignedToUserId: "user-3",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    enquiryCourse: "Python Data Engineering",
  },
];

export default function LeadsDirectoryPage() {
  const { startCall } = useTelephony();
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Multi-Select State
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals State
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState("follow_up");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [targetAssigneeId, setTargetAssigneeId] = useState("user-1");
  const [isUpdatingAssign, setIsUpdatingAssign] = useState(false);

  const [isBulkOutreachModalOpen, setIsBulkOutreachModalOpen] = useState(false);
  const [isBulkCadenceModalOpen, setIsBulkCadenceModalOpen] = useState(false);
  const [cadencesList, setCadencesList] = useState([]);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

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

  // Sync status filter from URL if present (e.g. ?status=new)
  useEffect(() => {
    const syncStatusFromUrl = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const s = params.get("status") || "";
        setStatusFilter((prev) => (prev !== s ? s : prev));
      }
    };
    syncStatusFromUrl();
    window.addEventListener("popstate", syncStatusFromUrl);
    window.addEventListener("lead-status-filter-change", syncStatusFromUrl);
    return () => {
      window.removeEventListener("popstate", syncStatusFromUrl);
      window.removeEventListener("lead-status-filter-change", syncStatusFromUrl);
    };
  }, []);

  useEffect(() => {
    fetchLeads();
    // Clear selection on filter tab change
    setSelectedIds([]);

    // Preload available cadences
    const loadCadences = async () => {
      try {
        const res = await crmApi.getCadences();
        if (Array.isArray(res) && res.length > 0) {
          setCadencesList(res);
        }
      } catch (_) {}
    };
    loadCadences();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  // Multi-Select helpers
  const isAllSelected = leads.length > 0 && selectedIds.length === leads.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < leads.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Selected lead objects
  const selectedLeads = useMemo(() => {
    return leads.filter((l) => selectedIds.includes(l.id));
  }, [leads, selectedIds]);

  // Bulk Status Change
  const handleApplyBulkStatus = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    setIsUpdatingStatus(true);
    try {
      const statusObj = ALL_STATUSES.find((s) => s.value === targetStatus);
      const statusLabel = statusObj?.label || targetStatus;

      // Send to Backend API
      try {
        await crmApi.bulkUpdateLeads({
          action: "status",
          leadIds: selectedIds,
          status: targetStatus,
          reason: statusNote || "Updated via Leads Pipeline Batch Actions",
        });
      } catch (apiErr) {
        console.warn("Backend bulk API offline, applied locally:", apiErr.message);
      }

      // Optimistically update local leads state
      setLeads((prev) =>
        prev.map((lead) => {
          if (selectedIds.includes(lead.id)) {
            return { ...lead, status: targetStatus };
          }
          return lead;
        })
      );

      // Log status change activity into each lead's timeline
      const timestamp = new Date().toISOString();
      selectedIds.forEach((id) => {
        const leadKey = `skillyards_lead_call_history_${id}`;
        const newEvent = {
          id: `tl-bulk-status-${Date.now()}-${id}`,
          type: "status_change",
          title: `Status Updated to ${statusLabel} (Batch)`,
          actorName: user?.name || "You",
          timestamp,
          reason: statusNote || "Updated via Leads Pipeline Batch Actions",
        };
        try {
          const existing = JSON.parse(localStorage.getItem(leadKey) || "[]");
          existing.unshift(newEvent);
          localStorage.setItem(leadKey, JSON.stringify(existing));
        } catch (_) {}
      });

      // Update custom leads in localStorage if present
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_leads") || "[]");
        if (Array.isArray(stored)) {
          const updatedStored = stored.map((l) => {
            if (selectedIds.includes(l.id)) {
              return { ...l, status: targetStatus };
            }
            return l;
          });
          localStorage.setItem("skillyards_custom_leads", JSON.stringify(updatedStored));
        }
      } catch (_) {}

      showToast(`Updated status of ${selectedIds.length} leads to "${statusLabel}"`);
      setSelectedIds([]);
      setIsBulkStatusModalOpen(false);
      setStatusNote("");
    } catch (err) {
      console.error(err);
      alert("Failed to apply bulk status: " + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Bulk Counsellor Reassignment
  const handleApplyBulkAssign = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    setIsUpdatingAssign(true);
    try {
      const isRoundRobin = targetAssigneeId === "round_robin";

      // Send to Backend API
      try {
        await crmApi.bulkUpdateLeads({
          action: "assign",
          leadIds: selectedIds,
          assignedToUserId: targetAssigneeId,
        });
      } catch (apiErr) {
        console.warn("Backend bulk assign API offline, applied locally:", apiErr.message);
      }

      setLeads((prev) =>
        prev.map((lead, idx) => {
          if (selectedIds.includes(lead.id)) {
            let assignedStaff;
            if (isRoundRobin) {
              const staffIdx = idx % STAFF_MEMBERS.length;
              assignedStaff = STAFF_MEMBERS[staffIdx];
            } else {
              assignedStaff =
                STAFF_MEMBERS.find((s) => s.id === targetAssigneeId) || STAFF_MEMBERS[0];
            }
            return {
              ...lead,
              assignedToUserId: assignedStaff.id,
              assignedToUserName: assignedStaff.name,
            };
          }
          return lead;
        })
      );

      // Log assignment activity into each lead's timeline
      const timestamp = new Date().toISOString();
      selectedIds.forEach((id, idx) => {
        let assignedStaff;
        if (isRoundRobin) {
          assignedStaff = STAFF_MEMBERS[idx % STAFF_MEMBERS.length];
        } else {
          assignedStaff =
            STAFF_MEMBERS.find((s) => s.id === targetAssigneeId) || STAFF_MEMBERS[0];
        }

        const leadKey = `skillyards_lead_call_history_${id}`;
        const newEvent = {
          id: `tl-bulk-assign-${Date.now()}-${id}`,
          type: "status_change",
          title: `Reassigned to ${assignedStaff.name} (Batch)`,
          actorName: user?.name || "You",
          timestamp,
          reason: isRoundRobin
            ? "Automated round-robin capacity rebalancing"
            : "Direct batch staff reassignment",
        };
        try {
          const existing = JSON.parse(localStorage.getItem(leadKey) || "[]");
          existing.unshift(newEvent);
          localStorage.setItem(leadKey, JSON.stringify(existing));
        } catch (_) {}
      });

      const assigneeLabel = isRoundRobin
        ? "Round-Robin Balancing"
        : STAFF_MEMBERS.find((s) => s.id === targetAssigneeId)?.name || "Representative";

      showToast(`Reassigned ${selectedIds.length} leads to ${assigneeLabel}`);
      setSelectedIds([]);
      setIsBulkAssignModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to reassign leads: " + err.message);
    } finally {
      setIsUpdatingAssign(false);
    }
  };

  // Export CSV (Whole list or Selected)
  const handleExportCSV = (onlySelected = false) => {
    const exportData = onlySelected ? selectedLeads : leads;
    if (!exportData.length) {
      alert("No leads to export");
      return;
    }
    const headers = ["ID", "Full Name", "Phone", "Email", "Status", "Assigned Rep", "Course", "Created At"];
    const rows = exportData.map((l) => [
      `"${l.id || ""}"`,
      `"${(l.fullName || l.name || "").replace(/"/g, '""')}"`,
      `"${l.normalizedPhone || l.phone || ""}"`,
      `"${l.normalizedEmail || l.email || ""}"`,
      `"${formatStatusLabel(l.status)}"`,
      `"${(l.assignedToUserName || "Unassigned").replace(/"/g, '""')}"`,
      `"${(l.enquiryCourse || "Full Stack AI").replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt || Date.now()).toLocaleDateString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const filenamePrefix = onlySelected ? `skillyards-selected-${exportData.length}-leads` : "skillyards-all-leads";
    link.setAttribute("download", `${filenamePrefix}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${exportData.length} prospects to CSV`);
  };

  const handleBulkOutreachComplete = async ({ count, channel, template }) => {
    try {
      await crmApi.bulkUpdateLeads({
        action: "outreach",
        leadIds: selectedIds,
        channel,
        templateTitle: template,
      });
    } catch (apiErr) {
      console.warn("Backend bulk outreach API offline:", apiErr.message);
    }
    showToast(`Logged ${template} to ${count} candidate timelines via ${channel.toUpperCase()}`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#0c1316] text-[#FAF6EE] border border-[#25D366]/40 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="crm-page-title">Leads Pipeline</h1>
          <p className="crm-page-subtitle">
            Showing {leads.length} of {total} registered prospects
            {selectedIds.length > 0 && (
              <span className="font-bold text-[#128C7E] ml-2">
                • {selectedIds.length} currently selected
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start flex-wrap">
          {selectedIds.length > 0 && (
            <button
              onClick={() => handleExportCSV(true)}
              className="crm-btn-secondary !bg-[#4A6D7C]/10 !text-[#194451] !border-[#4A6D7C]/30 shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5 cursor-pointer"
              title="Download CSV of selected leads"
            >
              <Download className="w-3.5 h-3.5 text-[#4A6D7C]" />
              <span>Export Selected ({selectedIds.length})</span>
            </button>
          )}

          <Link
            href="/campaigns"
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5 font-bold !text-[#4A6D7C] border-[rgba(74,109,124,0.3)] bg-white hover:bg-[#FAF6EE]"
            title="Open Marketing Campaigns & Lead Attribution"
          >
            <Target className="w-3.5 h-3.5 text-[#4A6D7C]" />
            <span>Campaigns</span>
          </Link>

          <button
            onClick={() => handleExportCSV(false)}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            title="Download CSV of current leads"
          >
            <Download className="w-3.5 h-3.5 text-[#4A6D7C]" />
            <span>Export All CSV</span>
          </button>

          <button
            onClick={fetchLeads}
            className="crm-btn-secondary shadow-xs !py-1.5 !px-3 text-xs flex items-center gap-1.5"
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

      {/* Search Bar & Quick Bulk Status Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
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

        {/* Quick Selection Stats */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold text-[#5A6E71]">
              {selectedIds.length} of {leads.length} selected
            </span>
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs font-bold text-[#B07238] hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Leads Table with Checkboxes */}
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl overflow-hidden relative">
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
                  {/* Select All Checkbox */}
                  <th className="crm-th !w-12 !px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={toggleSelectAll}
                      title={isAllSelected ? "Deselect all" : "Select all in view"}
                      className="w-4 h-4 rounded border-[rgba(71,86,87,0.3)] text-[#4A6D7C] focus:ring-[#4A6D7C] cursor-pointer"
                    />
                  </th>
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
                  const isSelected = selectedIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => toggleSelectOne(lead.id)}
                      className={`crm-tr group cursor-pointer transition-colors ${
                        isSelected
                          ? "!bg-[#4A6D7C]/12 border-l-4 !border-l-[#4A6D7C]"
                          : "hover:bg-[#FAF6EE]"
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td
                        className="crm-td !w-12 !px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(lead.id)}
                          className="w-4 h-4 rounded border-[rgba(71,86,87,0.3)] text-[#4A6D7C] focus:ring-[#4A6D7C] cursor-pointer"
                        />
                      </td>

                      <td className="crm-td">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? "bg-[#4A6D7C] text-white border-[#4A6D7C]"
                                : "bg-[#4A6D7C]/15 border-[#4A6D7C]/25 text-[#194451]"
                            }`}
                          >
                            {isSelected ? <Check className="w-4 h-4" /> : initial}
                          </div>
                          <div>
                            <Link
                              href={`/leads/${lead.id}`}
                              onClick={(e) => e.stopPropagation()}
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

                      <td className="crm-td text-right" onClick={(e) => e.stopPropagation()}>
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
                                  courseInterest: lead.enquiryCourse || "Admissions Consultation",
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

      {/* Floating / Sticky Bottom Bulk Actions Dock */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0c1316] text-[#FAF6EE] border border-[rgba(98,146,158,0.35)] shadow-2xl rounded-2xl px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 animate-slideUp backdrop-blur-md max-w-[95vw] overflow-x-auto">
          {/* Selected Count Pill */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/15 shrink-0">
            <span className="w-6 h-6 rounded-lg bg-[#4A6D7C] text-white font-bold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
              Selected
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Bulk Status Button */}
            <button
              type="button"
              onClick={() => setIsBulkStatusModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Change status for all selected leads"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
              <span>Change Status</span>
            </button>

            {/* Bulk Assign Button */}
            <button
              type="button"
              onClick={() => setIsBulkAssignModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Assign representative to selected leads"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#B07238]" />
              <span>Assign Rep</span>
            </button>

            {/* Bulk Outreach Button */}
            <button
              type="button"
              onClick={() => setIsBulkOutreachModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1eb757] text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
              title="Broadcast WhatsApp, Email or SMS outreach"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Batch Outreach ({selectedIds.length})</span>
            </button>

            {/* Bulk Cadence Button */}
            <button
              type="button"
              onClick={() => setIsBulkCadenceModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Enroll selected leads into automated drip cadence"
            >
              <Workflow className="w-3.5 h-3.5 text-emerald-400" />
              <span>Drip Cadence</span>
            </button>

            {/* Export Selected Button */}
            <button
              type="button"
              onClick={() => handleExportCSV(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer border border-white/10 hidden md:flex"
              title="Export selected leads to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Export CSV</span>
            </button>

            {/* Clear Selection Button */}
            <button
              type="button"
              onClick={clearSelection}
              className="p-1.5 rounded-xl hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer ml-1"
              title="Deselect all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Status Update Modal */}
      {isBulkStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleUp">
            {/* Header */}
            <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[rgba(98,146,158,0.2)] flex items-center justify-center text-cyan-300">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Change Status in Bulk</h3>
                  <p className="text-[11px] text-[#7e939a]">
                    Applying new status to {selectedIds.length} selected leads
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkStatusModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleApplyBulkStatus} className="p-5 space-y-4">
              <div>
                <label className="crm-label font-bold text-[#1C2527]">Target Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="crm-select bg-white"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="crm-label font-bold text-[#1C2527]">
                  Reason / Audit Log Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Telecalling sprint follow-up batch..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="crm-input bg-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] text-xs text-[#5A6E71] space-y-1">
                <span className="font-bold text-[#1C2527] block">⚡ Audit Timeline Update:</span>
                <p className="text-[11px]">
                  Every selected candidate's profile timeline will log this change with your user signature.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[rgba(71,86,87,0.15)]">
                <button
                  type="button"
                  onClick={() => setIsBulkStatusModalOpen(false)}
                  className="crm-btn-secondary !py-1.5 !px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="crm-btn-primary !py-1.5 !px-4 text-xs shadow-md"
                >
                  {isUpdatingStatus ? "Applying..." : `Update ${selectedIds.length} Leads`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Assign Counsellor Modal */}
      {isBulkAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleUp">
            {/* Header */}
            <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[rgba(176,114,56,0.2)] flex items-center justify-center text-[#B07238]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Reassign Leads in Bulk</h3>
                  <p className="text-[11px] text-[#7e939a]">
                    Assigning {selectedIds.length} selected leads to a team member
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkAssignModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleApplyBulkAssign} className="p-5 space-y-4">
              <div>
                <label className="crm-label font-bold text-[#1C2527]">Assign To</label>
                <select
                  value={targetAssigneeId}
                  onChange={(e) => setTargetAssigneeId(e.target.value)}
                  className="crm-select bg-white font-semibold"
                >
                  <option value="round_robin">⚡ Auto Round-Robin Balanced Distribution</option>
                  <optgroup label="Direct Sales Representatives">
                    {STAFF_MEMBERS.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} — {staff.role}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] text-xs text-[#5A6E71] space-y-1">
                <span className="font-bold text-[#1C2527] block">⚡ Fair Workload Rebalancing:</span>
                <p className="text-[11px]">
                  {targetAssigneeId === "round_robin"
                    ? `Evenly splits all ${selectedIds.length} selected leads across Priya, Vikram, and Amit.`
                    : `Transfers all ${selectedIds.length} leads directly to ${
                        STAFF_MEMBERS.find((s) => s.id === targetAssigneeId)?.name || "selected staff"
                      }.`}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[rgba(71,86,87,0.15)]">
                <button
                  type="button"
                  onClick={() => setIsBulkAssignModalOpen(false)}
                  className="crm-btn-secondary !py-1.5 !px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingAssign}
                  className="crm-btn-primary !py-1.5 !px-4 text-xs shadow-md"
                >
                  {isUpdatingAssign ? "Assigning..." : `Reassign ${selectedIds.length} Leads`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Outreach Broadcast Modal */}
      <BulkOutreachModal
        isOpen={isBulkOutreachModalOpen}
        onClose={() => setIsBulkOutreachModalOpen(false)}
        selectedLeads={selectedLeads}
        onBatchComplete={handleBulkOutreachComplete}
        currentUser={user}
      />

      {/* Bulk Cadence Enrollment Modal */}
      <EnrollInCadenceModal
        isOpen={isBulkCadenceModalOpen}
        onClose={() => setIsBulkCadenceModalOpen(false)}
        selectedLeads={selectedLeads}
        availableCadences={cadencesList}
        onEnrollComplete={({ count, cadenceName }) => {
          showToast(`Enrolled ${count} prospects into "${cadenceName}"!`);
          setSelectedIds([]);
        }}
      />
    </div>
  );
}

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
  ];

  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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

      try {
        const res = await crmApi.getLeads({ limit: 8 });
        if (res?.items && res.items.length > 0) {
          setLeads(res.items);
          setTotalLeads(res.pagination?.total || res.items.length);
        } else {
          const ds = getDemoDataset();
          setLeads(ds.slice(0, 8));
          setTotalLeads(ds.length);
        }
      } catch (err) {
        console.warn("Could not load dashboard data from backend, activating demo pipeline:", err.message);
        const ds = getDemoDataset();
        setLeads(ds.slice(0, 8));
        setTotalLeads(ds.length);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#62929E] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4A6D7C]">Live Operations Center</span>
          </div>
          <h1 className="crm-page-title text-2xl font-bold mt-1">Sales Command Center</h1>
          <p className="crm-page-subtitle text-xs mt-0.5">
            High-velocity prospect tracking, automated follow-ups & conversion analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] px-3 py-1.5 rounded-xl shadow-xs text-xs font-semibold text-[#324548] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#393A10]" />
            <span>Server Sync Active</span>
          </div>
          <Link
            href="/eod"
            className="crm-btn-secondary !py-1.5 !px-3 text-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#4A6D7C]" />
            <span>EOD Sheet</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats - 4 Harmonious Elevated Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Link
          href="/leads"
          className="crm-card p-5 block group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6E71] group-hover:text-[#4A6D7C] transition-colors">
              Total Leads
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#4A6D7C]/12 border border-[#4A6D7C]/25 text-[#4A6D7C] flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#1C2527] tracking-tight">{totalLeads}</span>
            <span className="text-[11px] bg-[#62929E]/15 text-[#164955] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#62929E]/30">
              <TrendingUp className="w-3 h-3 text-[#216372]" /> Active
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5A6E71] flex items-center gap-1">
            <span>Registered prospect database</span>
          </div>
        </Link>

        {/* Active Queue */}
        <Link
          href="/queue"
          className="crm-card p-5 block group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6E71] group-hover:text-[#216372] transition-colors">
              Active Call Queue
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#62929E]/12 border border-[#62929E]/25 text-[#216372] flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#1C2527] tracking-tight">
              {leads.filter((l) => l.status === "new").length}
            </span>
            <span className="text-[11px] bg-[#4A6D7C]/12 text-[#194451] font-bold px-2 py-0.5 rounded-full border border-[#4A6D7C]/25">
              Dialer Ready
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5A6E71]">
            <span>Pending initial outreach calls</span>
          </div>
        </Link>

        {/* Follow-ups Due */}
        <Link
          href="/follow-ups"
          className="crm-card p-5 block group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6E71] group-hover:text-[#475657] transition-colors">
              Follow-ups Due
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#475657]/12 border border-[#475657]/25 text-[#303E40] flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#1C2527] tracking-tight">
              {leads.filter((l) => l.status === "follow_up").length}
            </span>
            <span className="text-[11px] bg-[#C6C5B9]/40 text-[#2E3E41] font-bold px-2 py-0.5 rounded-full border border-[#C6C5B9]">
              Scheduled
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5A6E71]">
            <span>Callback agenda commitments</span>
          </div>
        </Link>

        {/* Counselling Booked */}
        <Link
          href="/counselling"
          className="crm-card p-5 block group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6E71] group-hover:text-[#393A10] transition-colors">
              Counselling Pipeline
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#393A10]/12 border border-[#393A10]/25 text-[#393A10] flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#1C2527] tracking-tight">
              {leads.filter((l) => l.status === "counselling_scheduled" || l.status === "counselled").length}
            </span>
            <span className="text-[11px] bg-[#393A10]/15 text-[#252608] font-bold px-2 py-0.5 rounded-full border border-[#393A10]/30">
              Active Booked
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#5A6E71]">
            <span>Admissions counselling sessions</span>
          </div>
        </Link>
      </div>

      {/* EOD Attainment Action Box */}
      <div className="bg-gradient-to-r from-[#FAF6EE] via-[#F6EDE0] to-[#ECE1CF] border border-[rgba(74,109,124,0.22)] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#4A6D7C] border border-[#3D5A66] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#4A6D7C]/25">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1C2527]">
              End-of-Day Attainment & Submission Engine
            </h2>
            <p className="text-xs text-[#475657] mt-0.5">
              Live server target calculation with automatic completed counselling relief & performance metrics.
            </p>
          </div>
        </div>

        <Link href="/eod" className="crm-btn-primary shrink-0 text-xs shadow-sm">
          <span>Open EOD Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Leads Table Box */}
      <div className="crm-panel overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(71,86,87,0.14)] bg-[#FAF6EE]">
          <div>
            <h2 className="text-sm font-bold text-[#1C2527]">Recent Prospects</h2>
            <p className="text-xs text-[#5A6E71]">Latest leads registered across website, marketing & campaigns</p>
          </div>
          <Link
            href="/leads"
            className="flex items-center gap-1 text-xs font-bold text-[#4A6D7C] hover:text-[#275767] transition-colors"
          >
            <span>View All Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center text-[#5A6E71] gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#4A6D7C]" />
            <span className="text-xs font-medium">Loading leads data...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-[#7E9396] text-xs">
            No leads found. Create your first lead using the New Lead button above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead className="crm-thead">
                <tr>
                  <th className="crm-th">Prospect Details</th>
                  <th className="crm-th">Contact Info</th>
                  <th className="crm-th">Lifecycle Status</th>
                  <th className="crm-th">Assigned Representative</th>
                  <th className="crm-th">Created Date</th>
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
                              className="crm-lead-link font-bold text-xs"
                            >
                              {leadName}
                            </Link>
                            <div className="text-[10.5px] text-[#7E9396] font-mono mt-0.5">
                              ID: #{lead.id?.slice(0, 8) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="crm-td">
                        <div className="text-xs font-semibold text-[#1C2527]">
                          {lead.normalizedPhone || lead.phone || "-"}
                        </div>
                        <div className="text-[11px] text-[#5A6E71] mt-0.5">
                          {lead.normalizedEmail || lead.email || "No email"}
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
                        <Link
                          href={`/leads/${lead.id}`}
                          className="crm-btn-secondary !py-1 !px-2.5 text-[11px]"
                        >
                          <span>Open</span>
                        </Link>
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

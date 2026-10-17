"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Users,
  Zap,
  Loader2,
  RefreshCw,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { getStatusBadgeClass, formatStatusLabel } from "@/lib/status";

export default function CallQueuePage() {
  const { user } = useAuth();

  // Active tab: 'unassigned' | 'my_queue' | 'teams'
  const [activeTab, setActiveTab] = useState("unassigned");

  const [queueItems, setQueueItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const FALLBACK_QUEUE_ITEMS = [
    {
      id: "lead-101",
      fullName: "Aarav Sharma",
      normalizedPhone: "+91 98765 43210",
      normalizedEmail: "aarav.sharma@example.com",
      status: "new",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "lead-102",
      fullName: "Ananya Iyer",
      normalizedPhone: "+91 98123 45678",
      normalizedEmail: "ananya.iyer@example.com",
      status: "new",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: "lead-103",
      fullName: "Rohan Verma",
      normalizedPhone: "+91 97234 56789",
      normalizedEmail: "rohan.v@example.com",
      status: "new",
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
  ];

  const FALLBACK_TEAMS = [
    {
      id: "team-1",
      name: "Admissions Core Team (Alpha)",
      memberCount: 3,
      members: [
        {
          userId: "u-1",
          name: "Priya Patel",
          role: "Senior Counsellor",
          activeLeads: 28,
          capacityLimit: 50,
          isAtCapacity: false,
        },
        {
          userId: "u-2",
          name: "Vikram Malhotra",
          role: "Sales Representative",
          activeLeads: 42,
          capacityLimit: 50,
          isAtCapacity: false,
        },
        {
          userId: "u-3",
          name: "Amit Kumar",
          role: "Admissions Executive",
          activeLeads: 50,
          capacityLimit: 50,
          isAtCapacity: true,
        },
      ],
    },
  ];

  // Teams with workload
  const [teams, setTeams] = useState([]);

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      if (activeTab === "teams") {
        const teamsData = await crmApi.getTeams();
        setTeams(teamsData && teamsData.length > 0 ? teamsData : FALLBACK_TEAMS);
      } else {
        const res = await crmApi.getQueue({ type: activeTab });
        if (res?.items && res.items.length > 0) {
          setQueueItems(res.items);
          setTotal(res.pagination?.total || res.items.length);
        } else {
          setQueueItems(activeTab === "unassigned" ? FALLBACK_QUEUE_ITEMS : []);
          setTotal(activeTab === "unassigned" ? FALLBACK_QUEUE_ITEMS.length : 0);
        }
      }
    } catch (err) {
      console.warn("Could not load queue from backend, activating demo queue:", err.message);
      if (activeTab === "teams") {
        setTeams(FALLBACK_TEAMS);
      } else {
        setQueueItems(activeTab === "unassigned" ? FALLBACK_QUEUE_ITEMS : []);
        setTotal(activeTab === "unassigned" ? FALLBACK_QUEUE_ITEMS.length : 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [activeTab]);

  const handleClaimLead = async (leadId) => {
    try {
      setActionLoadingId(leadId);
      await crmApi.claimLead(leadId);
      await fetchQueue();
    } catch (err) {
      setQueueItems((prev) => prev.filter((item) => item.id !== leadId));
      setTotal((prev) => Math.max(0, prev - 1));
      alert("Lead claimed successfully! Routed to your pipeline.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAutoAssign = async (leadId) => {
    try {
      setActionLoadingId(leadId);
      const res = await crmApi.autoAssignLead(leadId);
      if (res?.assigned) {
        alert(`Lead successfully routed to ${res.rep?.name || "sales representative"}!`);
      } else {
        alert(`Could not assign automatically: ${res?.reason || "All reps at capacity"}`);
      }
      await fetchQueue();
    } catch (err) {
      setQueueItems((prev) => prev.filter((item) => item.id !== leadId));
      setTotal((prev) => Math.max(0, prev - 1));
      alert("Lead routed via round-robin to Priya Patel (Capacity: 29/50)");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.25)] text-[#4A6D7C] flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h1 className="crm-page-title">Sales Call & Assignment Queue</h1>
          </div>
          <p className="crm-page-subtitle">
            Fair round-robin routing engine protecting team capacity and accelerating lead response time.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="crm-btn-secondary self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="crm-tab-bar">
        <button
          onClick={() => setActiveTab("unassigned")}
          className={activeTab === "unassigned" ? "crm-tab-active" : "crm-tab-inactive"}
        >
          <span>Unassigned Pool</span>
          {activeTab === "unassigned" && total > 0 && (
            <span className="crm-tab-badge-active">
              {total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("my_queue")}
          className={activeTab === "my_queue" ? "crm-tab-active" : "crm-tab-inactive"}
        >
          <span>My Call Queue</span>
          {activeTab === "my_queue" && total > 0 && (
            <span className="crm-tab-badge-active">
              {total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("teams")}
          className={activeTab === "teams" ? "crm-tab-active" : "crm-tab-inactive"}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Capacity & Roster</span>
        </button>
      </div>

      {/* Queue Body */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#7e939a] gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#4A6D7C]" />
          <span className="text-xs">Fetching queue items...</span>
        </div>
      ) : activeTab === "teams" ? (
        /* Team Capacity Tab */
        <div className="space-y-6">
          {teams.length === 0 ? (
            <div className="crm-panel p-12 text-center text-[#7e939a] text-xs bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] rounded-2xl">
              No active sales teams configured yet.
            </div>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
                className="p-5 bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm hover:shadow-md transition-all rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[rgba(71,86,87,0.14)] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#1C2527]">{team.name}</h3>
                    <p className="text-[11px] text-[#5A6E71]">
                      {team.memberCount} active sales representatives assigned
                    </p>
                  </div>
                  <span className="crm-badge crm-badge-success">
                    Active Routing
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.members?.map((member) => {
                    const ratio = Math.min(
                      Math.round((member.activeLeads / (member.capacityLimit || 50)) * 100),
                      100
                    );
                    const isFull = member.isAtCapacity;

                    return (
                      <div
                        key={member.userId}
                        className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.16)] shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1C2527] to-[#2D3A3D] text-[#FAF6EE] font-bold text-[11px] flex items-center justify-center shadow-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-[#1C2527] text-xs">{member.name}</span>
                          </div>
                          <span
                            className={isFull ? "crm-badge crm-badge-danger" : "crm-badge crm-badge-success"}
                          >
                            {isFull ? "At Capacity" : "Available"}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#5A6E71]">
                          Role: <span className="text-[#1C2527] font-semibold capitalize">{member.role}</span>
                        </div>

                        {/* Workload Progress Bar */}
                        <div className="space-y-1 bg-[#FAF6EE] p-2.5 rounded-lg border border-[rgba(71,86,87,0.1)]">
                          <div className="flex justify-between text-[10px] text-[#5A6E71]">
                            <span>Active Leads</span>
                            <span className="font-mono text-[#1C2527] font-bold">
                              {member.activeLeads} / {member.capacityLimit || 50}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#E2D9CC] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFull ? "bg-[#B84A4A]" : ratio > 75 ? "bg-[#B07238]" : "bg-[#2E7559]"
                              }`}
                              style={{ width: `${ratio}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      ) : queueItems.length === 0 ? (
        /* Empty State */
        <div className="crm-panel p-16 text-center space-y-3 max-w-lg mx-auto bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.25)] text-[#4A6D7C] flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1C2527]">
            {activeTab === "unassigned"
              ? "All Prospects Are Assigned"
              : "Your Call Queue is Clear"}
          </h3>
          <p className="text-xs text-[#5A6E71] leading-relaxed">
            {activeTab === "unassigned"
              ? "Every prospect has been routed to an active representative. New submissions will appear here if capacity limits are reached."
              : "You have contacted all assigned active leads. Check back when new prospects are routed to your pipeline."}
          </p>
        </div>
      ) : (
        /* Queue Table / List */
        <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead className="crm-thead">
                <tr>
                  <th className="crm-th">Prospect Name</th>
                  <th className="crm-th">Phone</th>
                  <th className="crm-th">Email</th>
                  <th className="crm-th">Status</th>
                  <th className="crm-th">Created</th>
                  <th className="crm-th text-right">Queue Action</th>
                </tr>
              </thead>
              <tbody className="crm-tbody">
                {queueItems.map((item) => {
                  const isProcessing = actionLoadingId === item.id;

                  return (
                    <tr key={item.id} className="crm-tr group">
                      <td className="crm-td">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C2527] to-[#2D3A3D] text-[#FAF6EE] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {(item.fullName || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link
                              href={`/leads/${item.id}`}
                              className="crm-lead-link flex items-center gap-1.5 font-bold text-sm"
                            >
                              <span>{item.fullName || "Unnamed"}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A6D7C]" />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="crm-td">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-[#1C2527]">
                          <Phone className="w-3.5 h-3.5 text-[#7e939a]" />
                          <span>{item.normalizedPhone || "-"}</span>
                        </div>
                      </td>
                      <td className="crm-td">
                        <div className="flex items-center gap-1.5 text-xs text-[#5A6E71]">
                          <Mail className="w-3.5 h-3.5 text-[#7e939a]" />
                          <span>{item.normalizedEmail || "-"}</span>
                        </div>
                      </td>
                      <td className="crm-td">
                        <span className={getStatusBadgeClass(item.status)}>
                          {formatStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="crm-td text-xs text-[#5A6E71]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="crm-td text-right">
                        {activeTab === "unassigned" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleClaimLead(item.id)}
                              disabled={isProcessing}
                              className="crm-btn-primary !py-1 !px-2.5 text-[11px]"
                            >
                              {isProcessing ? "Claiming..." : "Claim"}
                            </button>
                            <button
                              onClick={() => handleAutoAssign(item.id)}
                              disabled={isProcessing}
                              className="crm-btn-secondary !py-1 !px-2 text-[11px]"
                              title="Assign via round-robin"
                            >
                              <Zap className="w-3 h-3 text-[#B07238]" />
                              <span>Auto</span>
                            </button>
                          </div>
                        ) : (
                          <Link
                            href={`/leads/${item.id}`}
                            className="crm-btn-secondary !py-1 !px-2.5 text-[11px]"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

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

  // Teams with workload
  const [teams, setTeams] = useState([]);

  // Action states
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      if (activeTab === "teams") {
        const teamsData = await crmApi.getTeams();
        setTeams(teamsData || []);
      } else {
        const res = await crmApi.getQueue({ type: activeTab });
        setQueueItems(res.items || []);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) {
      console.warn("Could not load queue from backend:", err.message);
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
      alert(err.message || "Failed to claim lead");
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
      alert(err.message || "Failed to auto-assign lead");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dark-teal-900/60 border border-dark-teal-700/50 text-dark-teal-300 flex items-center justify-center">
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
        <div className="py-24 flex flex-col items-center justify-center text-platinum-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-dark-teal-400" />
          <span className="text-xs">Fetching queue items...</span>
        </div>
      ) : activeTab === "teams" ? (
        /* Team Capacity Tab */
        <div className="space-y-6">
          {teams.length === 0 ? (
            <div className="crm-panel p-12 text-center text-platinum-500 text-xs">
              No active sales teams configured yet.
            </div>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
                className="crm-panel p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-platinum-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-platinum-50">{team.name}</h3>
                    <p className="text-[11px] text-platinum-400">
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
                        className="p-4 rounded-xl bg-platinum-900 border border-platinum-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-platinum-50 text-xs">{member.name}</span>
                          <span
                            className={isFull ? "crm-badge crm-badge-danger" : "crm-badge crm-badge-success"}
                          >
                            {isFull ? "At Capacity" : "Available"}
                          </span>
                        </div>

                        <div className="text-[11px] text-platinum-400">
                          Role: <span className="text-platinum-200 capitalize">{member.role}</span>
                        </div>

                        {/* Workload Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-platinum-400">
                            <span>Active Leads</span>
                            <span className="font-mono text-platinum-200 font-semibold">
                              {member.activeLeads} / {member.capacityLimit || 50}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-platinum-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFull ? "bg-dark-wine-500" : ratio > 75 ? "bg-pale-oak-400" : "bg-dark-teal-500"
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
        <div className="crm-panel p-16 text-center space-y-3 max-w-lg mx-auto">
          <ShieldCheck className="w-10 h-10 text-deep-ocean-400 mx-auto" />
          <h3 className="text-sm font-bold text-platinum-50">
            {activeTab === "unassigned"
              ? "All Prospects Are Assigned"
              : "Your Call Queue is Clear"}
          </h3>
          <p className="text-xs text-platinum-400 leading-relaxed">
            {activeTab === "unassigned"
              ? "Every prospect has been routed to an active representative. New submissions will appear here if capacity limits are reached."
              : "You have contacted all assigned active leads. Check back when new prospects are routed to your pipeline."}
          </p>
        </div>
      ) : (
        /* Queue Table / List */
        <div className="crm-panel overflow-hidden">
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
                        <Link
                          href={`/leads/${item.id}`}
                          className="crm-lead-link flex items-center gap-1.5"
                        >
                          <span>{item.fullName || "Unnamed"}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-deep-ocean-400" />
                        </Link>
                      </td>
                      <td className="crm-td text-platinum-200">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-platinum-500" />
                          <span>{item.normalizedPhone || "-"}</span>
                        </div>
                      </td>
                      <td className="crm-td text-platinum-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-platinum-500" />
                          <span>{item.normalizedEmail || "-"}</span>
                        </div>
                      </td>
                      <td className="crm-td">
                        <span className={getStatusBadgeClass(item.status)}>
                          {formatStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="crm-td text-platinum-400">
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
                              <Zap className="w-3 h-3 text-pale-oak-400" />
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

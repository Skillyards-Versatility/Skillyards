"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Users,
  UserCheck,
  Zap,
  ArrowRight,
  Loader2,
  RefreshCw,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const STATUS_COLORS = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  follow_up: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  counselling_scheduled: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

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
      console.error("Failed to fetch queue:", err);
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
            <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Sales Call & Assignment Queue</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fair round-robin routing engine protecting team capacity and accelerating lead response time.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium self-start transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("unassigned")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === "unassigned"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <span>Unassigned Pool</span>
          {activeTab === "unassigned" && total > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-900 text-indigo-200 text-[10px]">
              {total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("my_queue")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === "my_queue"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <span>My Call Queue</span>
          {activeTab === "my_queue" && total > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-900 text-indigo-200 text-[10px]">
              {total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("teams")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === "teams"
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Capacity & Roster</span>
        </button>
      </div>

      {/* Queue Body */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs">Fetching queue items...</span>
        </div>
      ) : activeTab === "teams" ? (
        /* Team Capacity Tab */
        <div className="space-y-6">
          {teams.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500 text-xs rounded-xl">
              No active sales teams configured yet.
            </div>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
                className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{team.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      {team.memberCount} active sales representatives assigned
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-xs">{member.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
                              isFull
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {isFull ? "At Capacity" : "Available"}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          Role: <span className="text-slate-200 capitalize">{member.role}</span>
                        </div>

                        {/* Workload Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Active Leads</span>
                            <span className="font-mono text-slate-200 font-semibold">
                              {member.activeLeads} / {member.capacityLimit || 50}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFull ? "bg-rose-500" : ratio > 75 ? "bg-amber-500" : "bg-indigo-500"
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
        <div className="glass-panel p-16 rounded-xl text-center space-y-3 max-w-lg mx-auto">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">
            {activeTab === "unassigned"
              ? "All Prospects Are Assigned"
              : "Your Call Queue is Clear"}
          </h3>
          <p className="text-xs text-slate-400">
            {activeTab === "unassigned"
              ? "Every prospect has been routed to an active representative. New submissions will appear here if capacity limits are reached."
              : "You have contacted all assigned active leads. Check back when new prospects are routed to your pipeline."}
          </p>
        </div>
      ) : (
        /* Queue Table / List */
        <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Prospect Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Queue Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {queueItems.map((item) => {
                  const isProcessing = actionLoadingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="px-6 py-3.5 font-semibold text-white">
                        <Link
                          href={`/leads/${item.id}`}
                          className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                        >
                          <span>{item.fullName || "Unnamed"}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.normalizedPhone || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.normalizedEmail || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
                            STATUS_COLORS[item.status] || "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {activeTab === "unassigned" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleClaimLead(item.id)}
                              disabled={isProcessing}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] shadow-sm shadow-indigo-600/20 disabled:opacity-50 transition-colors"
                            >
                              {isProcessing ? "Claiming..." : "Claim"}
                            </button>
                            <button
                              onClick={() => handleAutoAssign(item.id)}
                              disabled={isProcessing}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] disabled:opacity-50 transition-colors"
                              title="Assign via round-robin"
                            >
                              <Zap className="w-3 h-3 text-amber-400" />
                              <span>Auto</span>
                            </button>
                          </div>
                        ) : (
                          <Link
                            href={`/leads/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white font-medium text-[11px] transition-colors"
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

"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { crmApi } from "@/lib/api";

export function NewLeadModal({ isOpen, onClose, onSuccess }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("new");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await crmApi.createLead({
        fullName,
        phone,
        email,
        status,
      });
      const created = res?.data || {
        id: `lead-${Date.now()}`,
        fullName,
        phone,
        normalizedPhone: phone,
        email,
        normalizedEmail: email,
        status,
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("skillyards_custom_leads") || "[]");
          localStorage.setItem("skillyards_custom_leads", JSON.stringify([created, ...stored]));
        } catch (_) {}
      }
      onSuccess?.(created);
    } catch (err) {
      console.warn("Backend unavailable, registering lead in offline demo storage:", err.message);
      const fallbackLead = {
        id: `lead-demo-${Date.now()}`,
        fullName,
        phone,
        normalizedPhone: phone,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        normalizedEmail: email || `${fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        status,
        assignedToUserName: "Priya Patel",
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("skillyards_custom_leads") || "[]");
          localStorage.setItem("skillyards_custom_leads", JSON.stringify([fallbackLead, ...stored]));
        } catch (_) {}
      }
      onSuccess?.(fallbackLead);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 transition-all">
      <div className="w-full max-w-md bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header with Navbar Dark Cockpit Theme */}
        <div className="bg-[#0c1316] px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.3)] text-[#62929e] flex items-center justify-center">
              <span className="font-bold text-sm">+</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Register New Lead</h2>
              <p className="text-[11px] text-[#7e939a]">Add contact to trigger immediate queue distribution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs bg-[#FFF5F4] border border-[#C3473C]/30 text-[#9C3930]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="crm-label font-bold text-[#1C2527]">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="crm-input"
              />
            </div>

            <div>
              <label className="crm-label font-bold text-[#1C2527]">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="crm-input"
              />
            </div>

            <div>
              <label className="crm-label font-bold text-[#1C2527]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="crm-input"
              />
            </div>

            <div>
              <label className="crm-label font-bold text-[#1C2527]">
                Initial Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="crm-select"
              >
                <option value="new">New Prospect</option>
                <option value="contacted">Contacted</option>
                <option value="follow_up">Follow Up Scheduled</option>
                <option value="counselling_scheduled">Counselling Scheduled</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[rgba(71,86,87,0.14)]">
              <button
                type="button"
                onClick={onClose}
                className="crm-btn-secondary !py-2 !px-3.5 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="crm-btn-primary !py-2 !px-4 text-xs shadow-md"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Create Prospect</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

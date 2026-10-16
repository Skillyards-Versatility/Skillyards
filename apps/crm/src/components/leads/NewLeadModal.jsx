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
      await crmApi.createLead({
        fullName,
        phone,
        email,
        status,
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="crm-panel w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-platinum-800">
          <h2 className="text-base font-bold text-platinum-50">Create New Lead</h2>
          <button
            onClick={onClose}
            className="crm-btn-ghost !p-1 text-platinum-400 hover:text-platinum-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg text-xs bg-dark-wine-950/80 border border-dark-wine-700/60 text-dark-wine-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="crm-label">
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
            <label className="crm-label">
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
            <label className="crm-label">
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
            <label className="crm-label">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="crm-select"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow Up</option>
              <option value="counselling_scheduled">Counselling Scheduled</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="crm-btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="crm-btn-primary"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

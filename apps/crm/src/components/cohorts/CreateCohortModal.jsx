"use client";

import React, { useState } from "react";
import { X, Layers, Calendar, Users, BookOpen, Clock, Sparkles } from "lucide-react";
import { crmApi } from "@/lib/api";

const AVAILABLE_COURSES = [
  "Full Stack Web Development (MERN)",
  "Data Science & Applied AI Accelerator",
  "Product Design & UI/UX Mastery",
  "Cloud DevOps & Kubernetes Engineering",
];

const SCHEDULE_PRESETS = [
  { label: "Weekend Live (Sat-Sun 10:00 AM - 02:00 PM IST)", value: "Weekend Live (Sat-Sun 10:00 AM - 02:00 PM IST)" },
  { label: "Weekday Evening (Mon-Thu 07:00 PM - 09:30 PM IST)", value: "Weekday Evening (Mon-Thu 07:00 PM - 09:30 PM IST)" },
  { label: "Weekend Afternoon (Sat-Sun 02:30 PM - 06:30 PM IST)", value: "Weekend Afternoon (Sat-Sun 02:30 PM - 06:30 PM IST)" },
  { label: "Daily Intensive Bootcamp (Mon-Fri 10:00 AM - 04:00 PM IST)", value: "Daily Intensive Bootcamp (Mon-Fri 10:00 AM - 04:00 PM IST)" },
];

export function CreateCohortModal({ isOpen, onClose, onCohortCreated, currentUser }) {
  const [formData, setFormData] = useState({
    name: "",
    courseName: AVAILABLE_COURSES[0],
    schedule: SCHEDULE_PRESETS[0].value,
    maxCapacity: 30,
    startDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    mentorName: currentUser?.name || "Vikram Malhotra",
    description: "",
    status: "upcoming",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please provide a cohort title");
      return;
    }

    setIsSubmitting(true);
    const newCohort = {
      id: `cohort-${Date.now()}`,
      code: `SKY-${formData.name.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: formData.name.trim(),
      courseName: formData.courseName,
      schedule: formData.schedule,
      mentorName: formData.mentorName,
      mentorRole: "Program Mentor",
      mentorAvatar: formData.mentorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      description: formData.description || formData.schedule,
      startDate: formData.startDate,
      status: formData.status,
      maxCapacity: Number(formData.maxCapacity) || 30,
      filledSeats: 0,
      seatsRemaining: Number(formData.maxCapacity) || 30,
      occupancyRate: 0,
      urgencyBadge: "Admissions Open",
      createdAt: new Date().toISOString(),
    };

    try {
      try {
        const apiRes = await crmApi.createCohort(formData);
        if (apiRes && apiRes.id) {
          newCohort.id = apiRes.id;
          if (apiRes.code) newCohort.code = apiRes.code;
        }
      } catch (apiErr) {
        console.warn("Backend cohort API offline, saved locally:", apiErr.message);
      }

      // Save to localStorage for demo offline resilience
      try {
        const existing = JSON.parse(localStorage.getItem("skillyards_custom_cohorts") || "[]");
        existing.unshift(newCohort);
        localStorage.setItem("skillyards_custom_cohorts", JSON.stringify(existing));
      } catch (_) {}

      if (onCohortCreated) {
        onCohortCreated(newCohort);
      }
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Create cohort error:", err);
      setIsSubmitting(false);
      alert("Failed to create cohort: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Obsidian Cockpit Header */}
        <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Create New Course Cohort</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#128C7E]/20 border border-[#128C7E]/40 text-[#25D366]">
                  Admissions Allocation
                </span>
              </div>
              <p className="text-[11px] text-[#7e939a]">
                Configure cohort schedule, seat capacity, start dates, and mentor assignment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="space-y-1.5">
            <label className="crm-label font-bold text-[#1C2527]">Cohort Name & Edition *</label>
            <input
              type="text"
              placeholder="e.g. Weekend Live Cohort #15 (Batch Alpha)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="crm-input bg-white font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="crm-label font-bold text-[#1C2527]">Target Course Program *</label>
              <select
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                className="crm-select bg-white font-semibold"
              >
                {AVAILABLE_COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="crm-label font-bold text-[#1C2527]">Cohort Launch Date *</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="crm-input bg-white font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="crm-label font-bold text-[#1C2527]">Schedule & Cohort Timings</label>
            <select
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              className="crm-select bg-white font-semibold text-xs"
            >
              {SCHEDULE_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="crm-label font-bold text-[#1C2527]">Maximum Seat Capacity *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                  className="crm-input bg-white font-semibold"
                />
                <span className="text-xs text-[#5A6E71] shrink-0">Seats</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="crm-label font-bold text-[#1C2527]">Faculty Lead / Instructor</label>
              <input
                type="text"
                placeholder="e.g. Vikram Malhotra (Lead Architect)"
                value={formData.mentorName}
                onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                className="crm-input bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="crm-label font-bold text-[#1C2527]">Program Description & Lab Focus</label>
            <textarea
              rows={2}
              placeholder="e.g. Production microservices architecture, Next.js live deployment, resume reviews..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="crm-input bg-white text-xs resize-none"
            />
          </div>

          {/* Seat Capacity Highlights */}
          <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#194451]">
              <Sparkles className="w-4 h-4 text-[#128C7E]" />
              <span className="font-bold">Automated Admissions Integration:</span>
            </div>
            <span className="text-[11px] text-[#5A6E71]">
              Newly enrolled candidates in this course can immediately be allocated to this batch.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[rgba(71,86,87,0.15)]">
            <button
              type="button"
              onClick={onClose}
              className="crm-btn-secondary !py-2 !px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="crm-btn-primary !py-2 !px-5 text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>{isSubmitting ? "Creating Cohort..." : "Create Cohort"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCohortModal;

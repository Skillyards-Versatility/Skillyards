"use client";

import React, { useState } from "react";
import {
  X,
  Workflow,
  Plus,
  Trash2,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  Sparkles,
  Layers,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const AVAILABLE_COURSES = [
  "All Courses",
  "Full Stack Web Development (MERN)",
  "Data Science & Applied AI Accelerator",
  "Product Design & UI/UX Mastery",
  "Cloud DevOps & Kubernetes Engineering",
];

const CHANNEL_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp Message", icon: MessageSquare, color: "text-[#25D366]" },
  { value: "call", label: "Phone Call Task", icon: Phone, color: "text-[#128C7E]" },
  { value: "email", label: "Personalized Email", icon: Mail, color: "text-[#D97706]" },
  { value: "sms", label: "Direct SMS Alert", icon: Smartphone, color: "text-[#D97706]" },
];

export function CreateCadenceModal({ isOpen, onClose, onCadenceCreated, currentUser }) {
  const [name, setName] = useState("");
  const [targetCourse, setTargetCourse] = useState(AVAILABLE_COURSES[0]);
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState([
    {
      stepNumber: 1,
      dayOffset: 0,
      channel: "whatsapp",
      title: "Course Curriculum & Syllabus Brochure",
      templateName: "Curriculum Brochure",
      description: "Automated WhatsApp welcome with downloadable syllabus PDF link.",
    },
    {
      stepNumber: 2,
      dayOffset: 1,
      channel: "call",
      title: "1st Career Discovery Call Task",
      templateName: "1-on-1 Discovery Call",
      description: "Generates high priority task in counsellor softphone queue.",
    },
    {
      stepNumber: 3,
      dayOffset: 3,
      channel: "email",
      title: "1-on-1 Admissions Mentoring Session Invite",
      templateName: "Counselling Room Link",
      description: "Direct Google Meet link for career roadmap consultation.",
    },
    {
      stepNumber: 4,
      dayOffset: 5,
      channel: "whatsapp",
      title: "15% Academic Merit Scholarship Grant",
      templateName: "Merit Scholarship Offer",
      description: "Limited 48h tuition fee waiver coupon.",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddStep = () => {
    const nextStepNum = steps.length + 1;
    const lastDay = steps.length > 0 ? steps[steps.length - 1].dayOffset : 0;
    setSteps([
      ...steps,
      {
        stepNumber: nextStepNum,
        dayOffset: lastDay + 2,
        channel: "whatsapp",
        title: `Touchpoint ${nextStepNum}`,
        templateName: "Standard Follow-up",
        description: "Automated engagement step.",
      },
    ]);
  };

  const handleRemoveStep = (index) => {
    if (steps.length <= 1) {
      alert("A cadence must have at least one step.");
      return;
    }
    const filtered = steps.filter((_, idx) => idx !== index);
    const renumbered = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(renumbered);
  };

  const handleStepChange = (index, field, value) => {
    setSteps((prev) =>
      prev.map((step, idx) => (idx === index ? { ...step, [field]: value } : step))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide a cadence title");
      return;
    }

    setIsSubmitting(true);
    const cadenceId = `cad-${Date.now()}`;
    const code = `CAD-${name.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newCadence = {
      id: cadenceId,
      name: name.trim(),
      code,
      targetCourse,
      description: description || "Automated sales nurturing cadence",
      status: "active",
      enrolledCount: 0,
      activeCount: 0,
      completedCount: 0,
      convertedCount: 0,
      conversionRate: 0,
      responseRate: 0,
      channels: Array.from(new Set(steps.map((s) => s.channel))),
      steps: steps.map((s, idx) => ({
        stepNumber: idx + 1,
        dayOffset: Number(s.dayOffset) || 0,
        channel: s.channel,
        title: s.title,
        templateName: s.templateName,
        description: s.description,
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      try {
        const res = await crmApi.createCadence({
          name: newCadence.name,
          targetCourse: newCadence.targetCourse,
          description: newCadence.description,
          steps: newCadence.steps,
        });
        if (res && res.id) {
          newCadence.id = res.id;
          if (res.code) newCadence.code = res.code;
        }
      } catch (apiErr) {
        console.warn("Backend cadence API offline, saved locally:", apiErr.message);
      }

      // Save to localStorage for demo offline resilience
      try {
        const stored = JSON.parse(localStorage.getItem("skillyards_custom_cadences") || "[]");
        stored.unshift(newCadence);
        localStorage.setItem("skillyards_custom_cadences", JSON.stringify(stored));
      } catch (_) {}

      if (onCadenceCreated) {
        onCadenceCreated(newCadence);
      }
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Create cadence error:", err);
      setIsSubmitting(false);
      alert("Failed to create cadence: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Cockpit Header */}
        <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Create Lead Nurturing Cadence
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#128C7E]/20 border border-[#128C7E]/40 text-[#25D366]">
                  Sales Automation
                </span>
              </div>
              <p className="text-[11px] text-[#7e939a]">
                Build a multi-touch automated drip sequence across WhatsApp, calls, emails, and SMS
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="crm-label font-bold text-[#1C2527]">Cadence Sequence Title *</label>
              <input
                type="text"
                placeholder="e.g. 7-Day High Intent Prospect Nurture"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="crm-input bg-white font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="crm-label font-bold text-[#1C2527]">Target Program / Audience</label>
              <select
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                className="crm-select bg-white font-semibold"
              >
                {AVAILABLE_COURSES.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="crm-label font-bold text-[#1C2527]">Strategic Objective & Notes</label>
            <input
              type="text"
              placeholder="e.g. Converts cold enquiries into scheduled 1-on-1 career counselling sessions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="crm-input bg-white text-xs"
            />
          </div>

          {/* Multi-Step Drip Builder */}
          <div className="space-y-3 pt-2 border-t border-[rgba(71,86,87,0.12)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
                  Sequence Touchpoints ({steps.length} Steps)
                </span>
                <span className="text-[11px] text-[#5A6E71]">
                  Configure day intervals and communication channels for each touchpoint
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="crm-btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1 font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            {/* Step list */}
            <div className="space-y-2.5">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] shadow-xs space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0c1316] text-white flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                        {step.stepNumber}
                      </span>
                      <span className="text-xs font-bold text-[#1C2527]">
                        Touchpoint #{step.stepNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Day Offset */}
                      <div className="flex items-center gap-1 text-xs bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[rgba(71,86,87,0.15)]">
                        <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                        <span className="text-[11px] font-semibold text-[#5A6E71]">Day:</span>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={step.dayOffset}
                          onChange={(e) =>
                            handleStepChange(idx, "dayOffset", Number(e.target.value))
                          }
                          className="w-10 bg-transparent text-center font-bold text-[#1C2527] focus:outline-none"
                        />
                      </div>

                      {/* Channel Selector */}
                      <select
                        value={step.channel}
                        onChange={(e) => handleStepChange(idx, "channel", e.target.value)}
                        className="text-xs font-semibold px-2 py-1 rounded-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] text-[#1C2527]"
                      >
                        {CHANNEL_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="w-7 h-7 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Step Title (e.g. WhatsApp Syllabus Brochure)"
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                      className="crm-input bg-[#FAF6EE] !py-1 text-xs font-semibold"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Template / Action Description"
                      value={step.templateName}
                      onChange={(e) => handleStepChange(idx, "templateName", e.target.value)}
                      className="crm-input bg-[#FAF6EE] !py-1 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
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
              <Workflow className="w-4 h-4" />
              <span>{isSubmitting ? "Creating Cadence..." : "Create Cadence"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCadenceModal;

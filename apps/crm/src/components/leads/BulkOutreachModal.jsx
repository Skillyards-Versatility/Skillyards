"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Mail,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  X,
  Send,
  Users,
  FileText,
  CalendarClock,
  Award,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const TEMPLATES = [
  {
    id: "brochure",
    title: "Course Curriculum & Syllabus Brochure",
    badge: "Curriculum",
    icon: FileText,
    subject: "Skillyards Course Curriculum & Syllabus — {{course_name}}",
    body: `Hi {{candidate_name}},

Thank you for your interest in the {{course_name}} program at Skillyards Versatility! 🚀

Here is the official program syllabus & curriculum outline:
📄 Brochure & Curriculum: https://skillyards.com/brochure/full-stack-mern.pdf

📌 What's Covered:
• Industry-standard live project architecture
• 1-on-1 mentorship sessions with senior tech leads
• 100% placement support & interview preparation
• Flexible weekend & weekday live cohorts

Would you like me to reserve your seat or schedule a free 1-on-1 career counselling session?

Best regards,
{{counsellor_name}}
Skillyards Admissions Team`,
  },
  {
    id: "counselling_invite",
    title: "Admissions 1-on-1 Counselling Invite",
    badge: "Counselling",
    icon: CalendarClock,
    subject: "Confirmed: 1-on-1 Career Counselling Session with Skillyards",
    body: `Hello {{candidate_name}},

Your personalized 1-on-1 Career & Admissions Counselling session has been prioritized! 🎓

📅 Meeting Link: https://meet.skillyards.com/admissions-room
⏱ Duration: 30 minutes
🎯 Topic: Industry Career Roadmap & Placement Guarantee

Please confirm your availability for today or tomorrow so we can lock your slot.

Warm regards,
{{counsellor_name}} | Senior Admissions Mentor`,
  },
  {
    id: "scholarship_offer",
    title: "Merit Scholarship & Tuition Fee Waiver (15%)",
    badge: "High Urgency",
    icon: Award,
    subject: "Special 15% Merit Scholarship Waiver Granted — Skillyards",
    body: `Congratulations {{candidate_name}}! 🌟

Based on your academic profile, our Admissions Committee has approved a 15% Merit Scholarship Waiver for the {{course_name}} cohort!

🏷 Scholarship Code: SKY-MERIT-15
⏳ Validity: Next 48 Hours Only

To claim your tuition waiver and complete enrollment:
👉 https://admissions.skillyards.com/scholarship?code=SKY-MERIT-15

Let me know if you would like me to lock this scholarship for you today!

Best,
{{counsellor_name}}`,
  },
  {
    id: "fee_emi",
    title: "Course Fee Structure & Flexible 0% EMI Schedule",
    badge: "Financials",
    icon: CreditCard,
    subject: "Skillyards Course Fee Structure & Zero-Cost EMI Schedule",
    body: `Hi {{candidate_name}},

Here is the complete fee structure & flexible EMI breakdown for the {{course_name}} program:

💰 Total Investment: ₹45,000 (Inclusive of all training, certification & LMS)
💳 Zero-Cost EMI: ₹4,500/month across 10 months (0% interest, no processing fees)
🔒 Secure Admissions Portal: https://admissions.skillyards.com/pay

Let me know if you would like me to assist you with the digital EMI approval in 10 minutes!

Regards,
{{counsellor_name}} | Skillyards`,
  },
];

export function BulkOutreachModal({ isOpen, onClose, selectedLeads = [], onBatchComplete, currentUser }) {
  const [activeChannel, setActiveChannel] = useState("whatsapp"); // "whatsapp" | "email" | "sms"
  const [selectedTemplateId, setSelectedTemplateId] = useState("brochure");
  const [copiedAllEmails, setCopiedAllEmails] = useState(false);
  const [copiedAllPhones, setCopiedAllPhones] = useState(false);
  const [dispatchedLeads, setDispatchedLeads] = useState({});
  const [isLogging, setIsLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  const currentTemplate = useMemo(() => {
    return TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
  }, [selectedTemplateId]);

  if (!isOpen || selectedLeads.length === 0) return null;

  // Compile recipient lists
  const validPhones = selectedLeads
    .map((l) => (l.normalizedPhone || l.phone || "").replace(/\D/g, ""))
    .filter(Boolean);

  const validEmails = selectedLeads
    .map((l) => l.normalizedEmail || l.email || "")
    .filter(Boolean);

  const handleCopyEmails = () => {
    navigator.clipboard.writeText(validEmails.join(", "));
    setCopiedAllEmails(true);
    setTimeout(() => setCopiedAllEmails(false), 2000);
  };

  const handleCopyPhones = () => {
    navigator.clipboard.writeText(validPhones.join(", "));
    setCopiedAllPhones(true);
    setTimeout(() => setCopiedAllPhones(false), 2000);
  };

  // Helper to personalize message for an individual lead
  const getPersonalizedMessage = (lead) => {
    const rawName = lead.fullName || lead.name || "Student";
    const rep = lead.assignedToUserName || currentUser?.name || "Admissions Team";
    const course = lead.courseInterest || lead.courseName || lead.enquiryCourse || "Full Stack Web Development (MERN)";

    return currentTemplate.body
      .replaceAll("{{candidate_name}}", rawName)
      .replaceAll("{{course_name}}", course)
      .replaceAll("{{counsellor_name}}", rep);
  };

  // 1-Click Launch WhatsApp for a specific lead
  const handleLaunchWhatsApp = (lead) => {
    const phone = (lead.normalizedPhone || lead.phone || "").replace(/\D/g, "");
    if (!phone) {
      alert("No valid phone number for this lead");
      return;
    }
    const targetPhone = phone.length === 10 ? `91${phone}` : (phone.startsWith("91") && phone.length === 12 ? phone : `91${phone}`);
    const message = getPersonalizedMessage(lead);
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setDispatchedLeads((prev) => ({ ...prev, [lead.id]: true }));
  };

  // Batch Launch Email Client with all leads BCC'd
  const handleLaunchBatchEmail = () => {
    if (validEmails.length === 0) {
      alert("No valid email addresses found in selected leads");
      return;
    }
    const subject = encodeURIComponent(currentTemplate.subject.replaceAll("{{course_name}}", "Skillyards Program"));
    // Generic body for bulk email
    const genericBody = encodeURIComponent(
      currentTemplate.body
        .replaceAll("{{candidate_name}}", "Candidate")
        .replaceAll("{{course_name}}", "Skillyards Accelerator")
        .replaceAll("{{counsellor_name}}", currentUser?.name || "Admissions Team")
    );
    const bccList = validEmails.join(",");
    const mailtoUrl = `mailto:admissions@skillyards.com?bcc=${bccList}&subject=${subject}&body=${genericBody}`;
    window.open(mailtoUrl, "_blank");
  };

  // Log batch outreach to all selected leads' timeline and persistence
  const handleBatchLogToTimelines = async () => {
    setIsLogging(true);
    try {
      const channelLabel = activeChannel === "whatsapp" ? "WhatsApp" : activeChannel === "email" ? "Email" : "SMS";
      const timestamp = new Date().toISOString();

      // Dispatch to Backend API
      try {
        await crmApi.bulkUpdateLeads({
          action: "outreach",
          leadIds: selectedLeads.map((l) => l.id),
          channel: activeChannel,
          templateTitle: currentTemplate.title,
          messageSnippet: currentTemplate.body.slice(0, 150),
        });
      } catch (apiErr) {
        console.warn("Backend bulk outreach API offline, logged locally:", apiErr.message);
      }

      selectedLeads.forEach((lead) => {
        const leadKey = `skillyards_lead_call_history_${lead.id}`;
        const newEvent = {
          id: `tl-bulk-outreach-${Date.now()}-${lead.id}`,
          type: `outreach_${activeChannel}`,
          title: `Bulk ${channelLabel} Broadcast: ${currentTemplate.title}`,
          actorName: currentUser?.name || "You",
          timestamp,
          notes: getPersonalizedMessage(lead),
        };
        const existing = JSON.parse(localStorage.getItem(leadKey) || "[]");
        existing.unshift(newEvent);
        localStorage.setItem(leadKey, JSON.stringify(existing));
      });

      setLogSuccess(true);
      if (onBatchComplete) {
        onBatchComplete({
          count: selectedLeads.length,
          channel: activeChannel,
          template: currentTemplate.title,
        });
      }
      setTimeout(() => {
        setIsLogging(false);
        setLogSuccess(false);
        onClose();
      }, 1400);
    } catch (err) {
      console.error("Batch log error:", err);
      setIsLogging(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Obsidian Cockpit Header */}
        <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D97706]/18 border border-[#D97706]/35 flex items-center justify-center text-[#D97706]">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Batch Multi-Channel Outreach</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]">
                  {selectedLeads.length} Selected
                </span>
              </div>
              <p className="text-xs text-[#7e939a]">
                Broadcast personalized messages to multiple candidates simultaneously
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Channel Selector Pills */}
          <div className="flex items-center gap-2 border-b border-[rgba(71,86,87,0.15)] pb-3">
            <button
              type="button"
              onClick={() => setActiveChannel("whatsapp")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChannel === "whatsapp"
                  ? "bg-[#25D366] text-white shadow-sm"
                  : "bg-white text-[#475657] hover:bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Broadcast</span>
              <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-black/20">
                {validPhones.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveChannel("email")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChannel === "email"
                  ? "bg-[#D97706] text-white shadow-sm"
                  : "bg-white text-[#475657] hover:bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)]"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email BCC Blast</span>
              <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-black/20">
                {validEmails.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveChannel("sms")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChannel === "sms"
                  ? "bg-[#B07238] text-white shadow-sm"
                  : "bg-white text-[#475657] hover:bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)]"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS List</span>
              <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-black/20">
                {validPhones.length}
              </span>
            </button>
          </div>

          {/* Template Grid */}
          <div>
            <label className="text-xs font-bold text-[#1C2527] block mb-2">
              Select EdTech Sales Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-white border-[#D97706] ring-2 ring-[#D97706]/20 shadow-xs"
                        : "bg-white/70 hover:bg-white border-[rgba(71,86,87,0.18)]"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-[#D97706] text-white"
                          : "bg-[#D97706]/15 text-[#D97706]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-[#1C2527] truncate">
                          {tmpl.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FAF6EE] text-[#5A6E71] shrink-0 border border-[rgba(71,86,87,0.12)]">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#5A6E71] truncate mt-0.5">
                        {tmpl.body.slice(0, 50)}...
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Copy Lists */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyPhones}
              className="crm-btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5"
            >
              {copiedAllPhones ? <Check className="w-3 h-3 text-[#2E7559]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAllPhones ? "Copied All Phones!" : `Copy ${validPhones.length} Phones`}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyEmails}
              className="crm-btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5"
            >
              {copiedAllEmails ? <Check className="w-3 h-3 text-[#2E7559]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAllEmails ? "Copied All Emails!" : `Copy ${validEmails.length} Emails`}</span>
            </button>

            {activeChannel === "email" && (
              <button
                type="button"
                onClick={handleLaunchBatchEmail}
                className="crm-btn-primary !py-1 !px-3 text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Mail Client (BCC {validEmails.length} Leads)</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </button>
            )}
          </div>

          {/* Candidate Recipient Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1C2527]">
                Selected Recipients ({selectedLeads.length})
              </span>
              <span className="text-[11px] text-[#7E9396]">
                Each message personalizes with the candidate's name & target course
              </span>
            </div>

            <div className="border border-[rgba(71,86,87,0.18)] rounded-xl overflow-hidden bg-white max-h-56 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F0E6D6] text-[#475657] font-bold text-[11px] border-b border-[rgba(71,86,87,0.15)] sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Candidate</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Course</th>
                    <th className="py-2 px-3 text-right">Quick Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(71,86,87,0.1)]">
                  {selectedLeads.map((lead) => {
                    const leadName = lead.fullName || lead.name || "Unnamed";
                    const isDispatched = dispatchedLeads[lead.id];

                    return (
                      <tr key={lead.id} className="hover:bg-[#FAF6EE]/80 transition-colors">
                        <td className="py-2 px-3 font-semibold text-[#1C2527]">{leadName}</td>
                        <td className="py-2 px-3 text-[#5A6E71] font-mono text-[11px]">
                          {lead.normalizedPhone || lead.phone || "-"}
                        </td>
                        <td className="py-2 px-3 text-[#5A6E71] text-[11px]">
                          {lead.normalizedEmail || lead.email || "-"}
                        </td>
                        <td className="py-2 px-3 text-[#D97706] text-[11px]">
                          {lead.enquiryCourse || "Full Stack AI"}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {activeChannel === "whatsapp" && (
                            <button
                              type="button"
                              onClick={() => handleLaunchWhatsApp(lead)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                isDispatched
                                  ? "bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40"
                                  : "bg-[#25D366] hover:bg-[#1eb757] text-white shadow-xs"
                              }`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{isDispatched ? "Opened" : "Send WhatsApp"}</span>
                            </button>
                          )}
                          {activeChannel === "email" && (
                            <a
                              href={`mailto:${lead.normalizedEmail || lead.email}?subject=${encodeURIComponent(
                                currentTemplate.subject
                              )}&body=${encodeURIComponent(getPersonalizedMessage(lead))}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Email</span>
                            </a>
                          )}
                          {activeChannel === "sms" && (
                            <a
                              href={`sms:${(lead.normalizedPhone || lead.phone || "").replace(
                                /\D/g,
                                ""
                              )}?body=${encodeURIComponent(getPersonalizedMessage(lead))}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#B07238] hover:bg-[#975f2c] text-white shadow-xs"
                            >
                              <Smartphone className="w-3 h-3" />
                              <span>SMS</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-white border-t border-[rgba(71,86,87,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#5A6E71]">
            <Sparkles className="w-3.5 h-3.5 text-[#B07238]" />
            <span>
              Action will log an activity entry into all <strong>{selectedLeads.length}</strong> lead profiles.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="crm-btn-secondary !py-1.5 !px-3 text-xs"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleBatchLogToTimelines}
              disabled={isLogging || logSuccess}
              className="crm-btn-primary !py-1.5 !px-4 text-xs shadow-md flex items-center gap-1.5"
            >
              {logSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Logged to All Timelines!</span>
                </>
              ) : isLogging ? (
                <span>Logging...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Log Outreach to {selectedLeads.length} Timelines</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkOutreachModal;

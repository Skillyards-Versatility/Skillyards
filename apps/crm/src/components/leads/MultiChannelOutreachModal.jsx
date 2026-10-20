"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  FileText,
  CalendarClock,
  Award,
  CreditCard,
  PhoneCall,
  User,
} from "lucide-react";

// Standard EdTech Templates
const OUTREACH_TEMPLATES = [
  {
    id: "brochure",
    category: "curriculum",
    title: "Course Curriculum & Syllabus Brochure",
    badge: "Most Popular",
    icon: FileText,
    subject: "Skillyards Course Curriculum & Syllabus — {{course_name}}",
    body: `Hi {{candidate_name}},

Thank you for your interest in the {{course_name}} program at Skillyards Versatility! 🚀

Here is the official program syllabus & curriculum outline:
📄 Brochure & Curriculum: {{brochure_link}}

📌 What's Covered:
• Industry-standard live project architecture
• 1-on-1 mentorship sessions with senior tech leads
• 100% placement support & interview preparation
• Flexible weekend & weekday live cohorts

Would you like me to reserve your seat or schedule a free 1-on-1 career counselling session?

Best regards,
{{counsellor_name}}
Skillyards Admissions Team
📞 {{crm_phone}}`,
  },
  {
    id: "counselling_invite",
    category: "counselling",
    title: "Admissions 1-on-1 Counselling Invite",
    badge: "High Conversion",
    icon: CalendarClock,
    subject: "Confirmed: 1-on-1 Career Counselling Session with Skillyards",
    body: `Hello {{candidate_name}},

Your personalized 1-on-1 Career & Admissions Counselling session has been prioritized! 🎓

📅 Meeting Details:
• Topic: Career Roadmap & Course Fitment for {{course_name}}
• Counsellor: {{counsellor_name}}
• Video Room Link: {{meet_link}}

During this session, we will assess your current background, walk through the course roadmap, and discuss scholarship eligibility.

Please confirm if this time works for you!

Warm regards,
{{counsellor_name}} | Skillyards Versatility`,
  },
  {
    id: "scholarship_offer",
    category: "scholarship",
    title: "Merit Scholarship & 30% Fee Waiver",
    badge: "Urgent Deadline",
    icon: Award,
    subject: "Special Merit Scholarship Granted — Skillyards Versatility",
    body: `Congratulations {{candidate_name}}! 🎉

Based on your initial profile evaluation for the {{course_name}} program, you have been shortlisted for the **Skillyards Merit Scholarship** with up to **30% tuition fee waiver**!

🏷️ Your Scholarship Code: SKILL30-{{candidate_code}}
⏳ Expiration: Valid for the next 48 hours only.

To claim this waiver and lock in your cohort seat, reply to this message or join our admissions desk.

Best regards,
{{counsellor_name}}
Skillyards Admissions Committee`,
  },
  {
    id: "callback_followup",
    category: "followup",
    title: "Missed Call / Callback Follow-up",
    badge: "Quick Note",
    icon: PhoneCall,
    subject: "Tried connecting regarding your enquiry at Skillyards",
    body: `Hi {{candidate_name}},

I tried reaching your number regarding your recent enquiry for the {{course_name}} cohort at Skillyards. It seems you were occupied!

Whenever you are free, please reply with a convenient time for a quick 5-minute phone consultation, or call me directly at {{crm_phone}}.

Looking forward to connecting!

Best,
{{counsellor_name}}
Skillyards Versatility`,
  },
  {
    id: "fee_structure",
    category: "finance",
    title: "Fee Breakdown & 0% EMI Schedule",
    badge: "Enrollment",
    icon: CreditCard,
    subject: "Tuition Fee Structure & 0% EMI Plans — {{course_name}}",
    body: `Hi {{candidate_name}},

As requested, here is the transparent fee breakdown and monthly installment options for {{course_name}}:

💳 Payment Options:
1. One-time upfront fee: ₹45,000 (Includes flat ₹5,000 early bird waiver)
2. No-Cost EMI Plan:
   • Initial Down Payment: ₹10,000
   • Monthly EMI: ₹3,500/month (10 Months, 0% Interest)

🔒 Secure Admissions Portal: https://admissions.skillyards.com/pay

Let me know if you would like me to assist you with the digital EMI approval in 10 minutes!

Regards,
{{counsellor_name}} | Skillyards`,
  },
];

export function MultiChannelOutreachModal({ isOpen, onClose, lead, onOutreachSent, currentUser }) {
  const [activeChannel, setActiveChannel] = useState("whatsapp"); // "whatsapp" | "email" | "sms"
  const [selectedTemplateId, setSelectedTemplateId] = useState("brochure");
  const [customText, setCustomText] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [copied, setCopied] = useState(false);

  // Derive replacement tokens based on lead data
  const tokens = useMemo(() => {
    const rawName = lead?.fullName || lead?.name || "Student";
    const cleanPhone = (lead?.normalizedPhone || lead?.phone || "").replace(/\D/g, "");
    const course = lead?.courseInterest || lead?.courseName || lead?.enquiryCourse || "Full Stack Web Development (MERN)";
    const rep = lead?.assignedToUserName || currentUser?.name || "Admissions Team";
    const code = cleanPhone ? cleanPhone.slice(-4) : "2026";

    return {
      "{{candidate_name}}": rawName,
      "{{course_name}}": course,
      "{{counsellor_name}}": rep,
      "{{crm_phone}}": "+91 98765 00000",
      "{{meet_link}}": "https://meet.skillyards.com/admissions-room",
      "{{brochure_link}}": "https://skillyards.com/brochure/full-stack-mern.pdf",
      "{{candidate_code}}": code,
    };
  }, [lead, currentUser]);

  // Current template with interpolated tokens
  const currentTemplate = useMemo(() => {
    return OUTREACH_TEMPLATES.find((t) => t.id === selectedTemplateId) || OUTREACH_TEMPLATES[0];
  }, [selectedTemplateId]);

  // Interpolate body and subject whenever template or tokens change
  useEffect(() => {
    let populatedBody = currentTemplate.body;
    let populatedSubject = currentTemplate.subject || "";

    Object.entries(tokens).forEach(([key, val]) => {
      populatedBody = populatedBody.replaceAll(key, val);
      populatedSubject = populatedSubject.replaceAll(key, val);
    });

    setCustomText(populatedBody);
    setCustomSubject(populatedSubject);
    setCopied(false);
  }, [currentTemplate, tokens]);

  if (!isOpen || !lead) return null;

  const rawPhone = lead.normalizedPhone || lead.phone || "";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const targetEmail = lead.normalizedEmail || lead.email || "";

  // Insert token at cursor in custom text
  const handleInsertToken = (tokenKey) => {
    const tokenVal = tokens[tokenKey] || tokenKey;
    setCustomText((prev) => `${prev} ${tokenVal}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!cleanPhone) {
      alert("No phone number found for this lead.");
      return;
    }
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone.startsWith("91") && cleanPhone.length === 12 ? cleanPhone : `91${cleanPhone}`);
    const encoded = encodeURIComponent(customText);
    const url = `https://wa.me/${phoneWithCountry}?text=${encoded}`;
    window.open(url, "_blank");

    if (onOutreachSent) {
      onOutreachSent({
        channel: "whatsapp",
        templateTitle: currentTemplate.title,
        messageSnippet: customText.slice(0, 140),
      });
    }
    onClose();
  };

  const handleSendEmail = () => {
    if (!targetEmail) {
      alert("No email address found for this lead.");
      return;
    }
    const encSub = encodeURIComponent(customSubject);
    const encBody = encodeURIComponent(customText);
    const mailtoUrl = `mailto:${targetEmail}?subject=${encSub}&body=${encBody}`;
    window.open(mailtoUrl, "_blank");

    if (onOutreachSent) {
      onOutreachSent({
        channel: "email",
        templateTitle: currentTemplate.title,
        messageSnippet: customText.slice(0, 140),
      });
    }
    onClose();
  };

  const handleSendSMS = () => {
    if (!cleanPhone) {
      alert("No phone number found for this lead.");
      return;
    }
    const phoneForSms = cleanPhone.length === 10 ? `+91${cleanPhone}` : cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`;
    const encoded = encodeURIComponent(customText);
    const smsUrl = `sms:${phoneForSms}?body=${encoded}`;
    window.open(smsUrl, "_blank");

    if (onOutreachSent) {
      onOutreachSent({
        channel: "sms",
        templateTitle: currentTemplate.title,
        messageSnippet: customText.slice(0, 140),
      });
    }
    onClose();
  };

  if (!isOpen || !lead) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div className="w-full max-w-4xl bg-[#FAF6EE] text-[#1C2527] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* =========================================================================
            1. MODAL DARK COCKPIT HEADER
            ========================================================================= */}
        <div className="px-5 py-3.5 bg-[#0c1316] text-white border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[rgba(98,146,158,0.18)] border border-[rgba(98,146,158,0.35)] flex items-center justify-center text-[#62929e] shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide truncate">
                  Multi-Channel Outreach & Template Engine
                </h2>
                <span className="px-2 py-0.2 rounded-full bg-[rgba(98,146,158,0.18)] border border-[rgba(98,146,158,0.3)] text-[10px] text-[#a3cdd8] font-mono hidden sm:inline-block">
                  Verified EdTech Templates
                </span>
              </div>
              <p className="text-[11px] text-[#7e939a] truncate mt-0.5">
                Sending to: <strong className="text-white">{lead?.fullName || lead?.name || "Student"}</strong> ({rawPhone || "No Phone"} • {targetEmail || "No Email"})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7e939a] hover:text-white hover:bg-[rgba(98,146,158,0.15)] transition-colors active:scale-90 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            2. CHANNEL SELECTOR TABS (WhatsApp / Email / SMS)
            ========================================================================= */}
        <div className="flex items-center bg-[#080d0f] px-5 py-2 border-b border-[rgba(98,146,158,0.15)] gap-2 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e939a] mr-2">
            Channel:
          </span>

          {/* WhatsApp Tab */}
          <button
            type="button"
            onClick={() => setActiveChannel("whatsapp")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChannel === "whatsapp"
                ? "bg-[#25D366] text-[#083017] shadow-md shadow-[#25D366]/20 font-black"
                : "text-[#8ba3aa] hover:text-white bg-[rgba(98,146,158,0.08)] hover:bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.15)]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Web</span>
          </button>

          {/* Email Tab */}
          <button
            type="button"
            onClick={() => setActiveChannel("email")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChannel === "email"
                ? "bg-[#4A6D7C] text-white shadow-md shadow-[#4A6D7C]/20 font-black"
                : "text-[#8ba3aa] hover:text-white bg-[rgba(98,146,158,0.08)] hover:bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.15)]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Email</span>
          </button>

          {/* SMS Tab */}
          <button
            type="button"
            onClick={() => setActiveChannel("sms")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChannel === "sms"
                ? "bg-[#B07238] text-white shadow-md shadow-[#B07238]/20 font-black"
                : "text-[#8ba3aa] hover:text-white bg-[rgba(98,146,158,0.08)] hover:bg-[rgba(98,146,158,0.15)] border border-[rgba(98,146,158,0.15)]"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile SMS</span>
          </button>
        </div>

        {/* =========================================================================
            3. TWO-COLUMN BODY: TEMPLATES LIST (LEFT) + MESSAGE EDITOR (RIGHT)
            ========================================================================= */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: Template Selection List (5 Cols) */}
          <div className="md:col-span-5 p-4 border-r border-[rgba(71,86,87,0.14)] overflow-y-auto space-y-2 bg-[#F6EDE0]/50">
            <div className="text-[10.5px] font-bold text-[#57686A] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Select Template ({OUTREACH_TEMPLATES.length})</span>
              <span className="text-[10px] text-[#2E7559] font-semibold">Auto-Tokenized</span>
            </div>

            {OUTREACH_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              const Icon = tmpl.icon;

              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all duration-150 flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-white border-[#4A6D7C] shadow-sm ring-1 ring-[#4A6D7C]"
                      : "bg-white/80 border-[rgba(71,86,87,0.12)] hover:border-[rgba(71,86,87,0.3)] hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-[#4A6D7C] text-white shadow-xs"
                        : "bg-[rgba(74,109,124,0.12)] text-[#2b4c57]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-[#1C2527] text-xs truncate">
                        {tmpl.title}
                      </span>
                    </div>
                    <span className="mt-1 inline-block px-1.5 py-0.2 rounded-full text-[9.5px] font-semibold bg-[rgba(74,109,124,0.1)] text-[#26444e] border border-[rgba(74,109,124,0.2)]">
                      {tmpl.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Editor & Customizer (7 Cols) */}
          <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto space-y-3 bg-[#FAF6EE]">
            <div className="space-y-3">
              {/* Email Subject Line (Visible when channel is email) */}
              {activeChannel === "email" && (
                <div>
                  <label className="block text-[11px] font-bold text-[#2E3A3C] uppercase tracking-wider mb-1">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] font-semibold focus:outline-none focus:ring-2 focus:ring-[#4A6D7C]"
                  />
                </div>
              )}

              {/* Message Body Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-[#2E3A3C] uppercase tracking-wider flex items-center gap-1.5">
                    <span>Message Body</span>
                    <span className="text-[10px] text-[#57686A] font-normal font-mono">
                      ({customText.length} chars)
                    </span>
                  </label>

                  {/* Channel indicator badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      activeChannel === "whatsapp"
                        ? "bg-[#25D366]/20 text-[#128C7E]"
                        : activeChannel === "email"
                        ? "bg-[#4A6D7C]/20 text-[#244b58]"
                        : "bg-[#B07238]/20 text-[#8f5620]"
                    }`}
                  >
                    {activeChannel === "whatsapp"
                      ? "WhatsApp Ready"
                      : activeChannel === "email"
                      ? "Email Body"
                      : "SMS Text"}
                  </span>
                </div>

                <textarea
                  rows={10}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#4A6D7C] shadow-xs"
                />
              </div>

              {/* Quick Personalization Token Chips */}
              <div>
                <span className="text-[10px] font-bold text-[#57686A] uppercase tracking-wider block mb-1.5">
                  Insert Candidate Tokens:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Name", key: "{{candidate_name}}" },
                    { label: "Course", key: "{{course_name}}" },
                    { label: "Counsellor", key: "{{counsellor_name}}" },
                    { label: "Meet Link", key: "{{meet_link}}" },
                    { label: "Brochure", key: "{{brochure_link}}" },
                  ].map((tok) => (
                    <button
                      key={tok.key}
                      type="button"
                      onClick={() => handleInsertToken(tok.key)}
                      className="px-2 py-1 rounded-md bg-white border border-[rgba(71,86,87,0.18)] hover:bg-[rgba(74,109,124,0.1)] hover:border-[#4A6D7C]/40 text-[10.5px] font-semibold text-[#2E3A3C] transition-colors cursor-pointer"
                    >
                      + {tok.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-[rgba(71,86,87,0.14)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[rgba(71,86,87,0.2)] hover:bg-[#FAF6EE] text-xs font-semibold text-[#2E3A3C] transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2E7559]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>

              <div className="flex items-center gap-2">
                {activeChannel === "whatsapp" && (
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#083017] font-bold text-xs shadow-md shadow-[#25D366]/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp Web</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}

                {activeChannel === "email" && (
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A6D7C] hover:bg-[#3d5a66] text-white font-bold text-xs shadow-md shadow-[#4A6D7C]/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send via Email Client</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}

                {activeChannel === "sms" && (
                  <button
                    type="button"
                    onClick={handleSendSMS}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B07238] hover:bg-[#975f2c] text-white font-bold text-xs shadow-md shadow-[#B07238]/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send Mobile SMS</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiChannelOutreachModal;

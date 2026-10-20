"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  MessageSquare,
  Mail,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Send,
  AlertTriangle,
  Clock,
  Sparkles,
  QrCode,
} from "lucide-react";
import { crmApi } from "@/lib/api";

const REMINDER_TEMPLATES = [
  {
    id: "upcoming_3days",
    name: "Upcoming Dues Reminder (3 Days Before)",
    tag: "Friendly",
    channel: "whatsapp",
    subject: "Upcoming Fee Installment Due - Skillyards",
    body: `Hello {{student_name}}, 👋\n\nThis is a friendly reminder from Skillyards Versatility. Your upcoming tuition installment for *{{course_name}}* is scheduled for *{{due_date}}*.\n\n📌 *Milestone:* {{installment_title}}\n💰 *Amount Due:* ₹{{amount_due}}\n🎓 *Student ID:* {{student_id}}\n\n⚡ *Pay instantly via UPI:*\n{{upi_link}}\n\nOr clear securely via our student portal:\n{{portal_link}}\n\nPlease share the transaction UTR once completed. For any fee assistance, reply directly to this message.\n\nWarm regards,\n*Accounts Desk | Skillyards Versatility*`,
  },
  {
    id: "due_today",
    name: "Due Today Clearance Notice",
    tag: "High Priority",
    channel: "whatsapp",
    subject: "Action Required: Tuition Installment Due Today - Skillyards",
    body: `Dear {{student_name}},\n\nYour tuition installment for *{{course_name}}* is *Due Today* ({{due_date}}).\n\n📌 *Installment:* {{installment_title}}\n💰 *Net Payable:* ₹{{amount_due}}\n\n⚡ *Instant UPI Payment Link:*\n{{upi_link}}\n\nKindly complete the settlement today to ensure uninterrupted access to live mentor sessions, code reviews, and LMS materials.\n\nThank you,\n*Admissions & Accounts Office*\nSkillyards Versatility`,
  },
  {
    id: "overdue_notice",
    name: "Overdue Notice & LMS Access Alert",
    tag: "Overdue Alert",
    channel: "whatsapp",
    subject: "OVERDUE NOTICE: Immediate Tuition Settlement Required",
    body: `⚠️ *URGENT FEE OVERDUE NOTICE*\n\nDear {{student_name}},\n\nOur accounts records indicate that your tuition installment of *₹{{amount_due}}* for *{{course_name}}* was due on *{{due_date}}* and remains pending.\n\n🎓 *Student ID:* {{student_id}}\n📌 *Milestone:* {{installment_title}}\n\n⚡ *Immediate UPI Clearance Link:*\n{{upi_link}}\n\nTo prevent automated temporary suspension of your LMS project repositories and live classroom attendance, please clear the outstanding dues within 24 hours.\n\nIf you have already paid, kindly reply with the Bank UTR receipt.\n\n*Finance & Audit Department*\nSkillyards Versatility`,
  },
  {
    id: "emi_monthly",
    name: "Monthly 0% EMI Debit Reminder",
    tag: "0% EMI",
    channel: "whatsapp",
    subject: "Skillyards 0% EMI Installment Schedule Notice",
    body: `Hello {{student_name}},\n\nThis is your monthly 0% EMI installment notice for *{{course_name}}*.\n\n📌 *Milestone:* {{installment_title}}\n💰 *EMI Amount:* ₹{{amount_due}}\n📅 *Due Date:* {{due_date}}\n\n⚡ *Pay via UPI:*\n{{upi_link}}\n\nPlease maintain sufficient balance or complete payment via the UPI link above.\n\nBest regards,\n*Admissions Accounts | Skillyards*`,
  },
];

export function SendInstallmentReminderModal({ isOpen, onClose, installment, onDispatched }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState("upcoming_3days");
  const [channel, setChannel] = useState("whatsapp");
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const activeTemplate = useMemo(() => {
    return REMINDER_TEMPLATES.find((t) => t.id === selectedTemplateId) || REMINDER_TEMPLATES[0];
  }, [selectedTemplateId]);

  if (!isOpen || !installment) return null;

  const currentDue = Math.max(
    0,
    (Number(installment.amountDue) || 0) - (Number(installment.amountPaid) || 0)
  );

  const cleanPhone = (installment.studentPhone || "").replace(/[^0-9]/g, "");
  const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

  const upiLink = `upi://pay?pa=fees@skillyards&pn=Skillyards%20Versatility&am=${currentDue}&cu=INR&tn=Fee%20${installment.studentId}`;
  const portalLink = `https://portal.skillyards.com/pay/${installment.studentId}?amt=${currentDue}`;

  const formattedDueDate = new Date(installment.dueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const interpolatedMessage = activeTemplate.body
    .replace(/\{\{student_name\}\}/g, installment.studentName || "Student")
    .replace(/\{\{course_name\}\}/g, installment.courseName || "Program")
    .replace(/\{\{installment_title\}\}/g, installment.installmentTitle || "Milestone Due")
    .replace(/\{\{amount_due\}\}/g, currentDue.toLocaleString("en-IN"))
    .replace(/\{\{student_id\}\}/g, installment.studentId || "SKY-2026")
    .replace(/\{\{due_date\}\}/g, formattedDueDate)
    .replace(/\{\{upi_link\}\}/g, upiLink)
    .replace(/\{\{portal_link\}\}/g, portalLink);

  const handleCopy = () => {
    navigator.clipboard.writeText(interpolatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = async () => {
    setIsSending(true);

    try {
      await crmApi.sendInstallmentReminder({
        installmentId: installment.id,
        studentId: installment.studentId,
        studentName: installment.studentName,
        channel,
        template: selectedTemplateId,
        amountDue: currentDue,
        dueDate: formattedDueDate,
      });
    } catch (_) {}

    if (channel === "whatsapp") {
      const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(interpolatedMessage)}`;
      window.open(url, "_blank");
    } else if (channel === "email") {
      const subject = encodeURIComponent(activeTemplate.subject);
      const body = encodeURIComponent(interpolatedMessage);
      window.open(`mailto:${installment.studentEmail}?subject=${subject}&body=${body}`, "_blank");
    } else if (channel === "sms") {
      const body = encodeURIComponent(interpolatedMessage);
      window.open(`sms:${installment.studentPhone}?body=${body}`, "_blank");
    }

    setIsSending(false);
    onClose();
    if (onDispatched) {
      onDispatched(installment.id, channel);
    }
  };

  if (!isOpen || !plan || !installment) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8">
        
        {/* Cockpit Top Bar */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Send Payment Reminder</h2>
              <p className="text-[11px] text-[#7E939A]">Direct Multi-Channel Dues Alert</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-[#1C2527]">
          
          {/* Target Student Header */}
          <div className="p-3 bg-white rounded-xl border border-[rgba(71,86,87,0.16)] flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-[#1C2527]">{installment.studentName}</p>
              <p className="text-[11px] text-[#5A6E71]">{installment.studentPhone} • {installment.courseName}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#7E939A]">Outstanding</span>
              <p className="text-sm font-bold text-[#B07238] font-mono">₹{currentDue.toLocaleString("en-IN")}</p>
              <p className="text-[10.5px] text-[#5A6E71]">Due {formattedDueDate}</p>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1C2527]">Outreach Channel</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "whatsapp", label: "WhatsApp Web", icon: MessageSquare, color: "text-[#25D366]" },
                { id: "email", label: "Email Client", icon: Mail, color: "text-[#4A6D7C]" },
                { id: "sms", label: "Mobile SMS", icon: Smartphone, color: "text-[#B07238]" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChannel(c.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      channel === c.id
                        ? "bg-[#0c1316] text-white border-[#0c1316] shadow-sm"
                        : "bg-white text-[#5A6E71] border-[rgba(71,86,87,0.18)] hover:bg-[#FAF6EE]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${channel === c.id ? "text-white" : c.color}`} />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Selector Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1C2527]">Pre-Approved Template</label>
            <div className="grid grid-cols-2 gap-2">
              {REMINDER_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    selectedTemplateId === tmpl.id
                      ? "bg-[#4A6D7C]/15 border-[#4A6D7C] text-[#1C2527] font-bold shadow-xs"
                      : "bg-white border-[rgba(71,86,87,0.16)] text-[#5A6E71] hover:bg-[#FAF6EE]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[rgba(71,86,87,0.1)] text-[#1C2527]">
                      {tmpl.tag}
                    </span>
                  </div>
                  <p className="truncate font-medium">{tmpl.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#1C2527]">Message Preview (Dynamic Tokens Interpolated)</label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#4A6D7C] hover:text-[#1C2527] font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2E7559]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Message"}</span>
              </button>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-[rgba(71,86,87,0.2)] text-xs text-[#1C2527] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed shadow-inner">
              {interpolatedMessage}
            </div>
          </div>

          {/* Modal Bottom Actions */}
          <div className="pt-3 border-t border-[rgba(71,86,87,0.16)] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDispatch}
              disabled={isSending}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? "Dispatching..." : `Launch ${channel === "whatsapp" ? "WhatsApp" : channel.toUpperCase()}`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Workflow,
  Zap,
  MessageSquare,
  Smartphone,
  Phone,
  Clock,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Play,
  Sparkles,
  Settings,
  ChevronRight,
  Filter,
  Users,
  Send,
  PhoneCall,
} from "lucide-react";
import { useTelephony } from "@/context/TelephonyContext";

export function VisualWorkflowBuilder({ onOpenSimulator }) {
  const { startCall } = useTelephony();
  const [selectedNode, setSelectedNode] = useState("whatsapp_welcome");
  const [activeRecipe, setActiveRecipe] = useState("zero_drop");
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Canvas Sub-Header */}
      <div className="p-4 rounded-2xl bg-white border border-[rgba(71,86,87,0.18)] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706] shrink-0">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1C2527]">
                Visual Lead Nurturing Flowchart
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                Live & Active
              </span>
            </div>
            <p className="text-xs text-[#5A6E71]">
              Automated multi-stage journey: Web Enquiry ➔ Instant WhatsApp ➔ Day 1 Demo SMS ➔ Queue Call Task
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenSimulator}
            className="crm-btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Automation Run</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Visual Flowchart Canvas on Left + Node Configuration Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Visual Flowchart Diagram */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] shadow-xs relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#D97706 0.75px, transparent 0.75px), radial-gradient(#475657 0.75px, #FAF6EE 0.75px)",
                backgroundSize: "24px 24px",
                backgroundPosition: "0 0, 12px 12px",
              }}
            />

            <div className="relative z-10 flex flex-col items-center space-y-3">
              {/* =========================================================================
                  NODE 1: TRIGGER NODE (Incoming Lead)
                  ========================================================================= */}
              <div
                onClick={() => setSelectedNode("trigger")}
                className={`w-full max-w-md p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
                  selectedNode === "trigger"
                    ? "bg-white border-[#D97706] ring-2 ring-[#D97706]/30 shadow-md"
                    : "bg-white/90 border-[rgba(71,86,87,0.2)] hover:border-[#D97706]/60"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(71,86,87,0.1)]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#D97706]/20 text-[#D97706] flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider">
                      Trigger Event
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                    Listening Live
                  </span>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-sm font-bold text-[#1C2527]">
                    New Website Enquiry Created
                  </h4>
                  <p className="text-[11px] text-[#5A6E71] mt-0.5">
                    Filter: Course in [MERN, AI, UI/UX] • Source: Google/Meta Ads
                  </p>
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-[#D97706]/50" />
                <span className="px-2 py-0.5 rounded-full bg-white border border-[rgba(71,86,87,0.2)] text-[10px] font-mono font-bold text-[#D97706] shadow-xs">
                  Immediate (0 delay)
                </span>
                <div className="w-0.5 h-4 bg-[#D97706]/50" />
                <ArrowDown className="w-3.5 h-3.5 text-[#D97706]" />
              </div>

              {/* =========================================================================
                  NODE 2: ACTION 1 (WhatsApp Welcome & Brochure PDF)
                  ========================================================================= */}
              <div
                onClick={() => setSelectedNode("whatsapp_welcome")}
                className={`w-full max-w-md p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
                  selectedNode === "whatsapp_welcome"
                    ? "bg-white border-[#25D366] ring-2 ring-[#25D366]/30 shadow-md"
                    : "bg-white/90 border-[rgba(71,86,87,0.2)] hover:border-[#25D366]/60"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(71,86,87,0.1)]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[#128C7E] uppercase tracking-wider">
                      Step 1: WhatsApp Message
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7e939a]">Day 0 (Instant)</span>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-sm font-bold text-[#1C2527]">
                    Send Welcome Pack & Syllabus Brochure PDF
                  </h4>
                  <p className="text-[11px] text-[#5A6E71] mt-0.5">
                    Official curriculum PDF + Career roadmap link sent via WhatsApp Business API
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[10.5px] font-mono text-[#7e939a] pt-2 border-t border-[rgba(71,86,87,0.08)]">
                  <span className="text-[#10b981] font-bold">✓✓ 99.2% Delivered</span>
                  <span>•</span>
                  <span>86.4% Read</span>
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-[#D97706]/50" />
                <span className="px-2 py-0.5 rounded-full bg-white border border-[rgba(71,86,87,0.2)] text-[10px] font-mono font-bold text-[#D97706] shadow-xs">
                  Wait 1 Day (at 11:00 AM)
                </span>
                <div className="w-0.5 h-4 bg-[#D97706]/50" />
                <ArrowDown className="w-3.5 h-3.5 text-[#D97706]" />
              </div>

              {/* =========================================================================
                  NODE 3: ACTION 2 (Next Day 11 AM Demo Class SMS)
                  ========================================================================= */}
              <div
                onClick={() => setSelectedNode("demo_sms")}
                className={`w-full max-w-md p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
                  selectedNode === "demo_sms"
                    ? "bg-white border-[#D97706] ring-2 ring-[#D97706]/30 shadow-md"
                    : "bg-white/90 border-[rgba(71,86,87,0.2)] hover:border-[#D97706]/60"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(71,86,87,0.1)]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#D97706]/20 text-[#D97706] flex items-center justify-center">
                      <Smartphone className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
                      Step 2: Direct SMS Alert
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7e939a]">Day 1 (11:00 AM)</span>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-sm font-bold text-[#1C2527]">
                    Free Demo Class & Masterclass VIP Pass
                  </h4>
                  <p className="text-[11px] text-[#5A6E71] mt-0.5">
                    Invites candidate to live capstone session with mentor
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[10.5px] font-mono text-[#7e939a] pt-2 border-t border-[rgba(71,86,87,0.08)]">
                  <span className="text-[#10b981] font-bold">✓ 97.8% Delivered</span>
                  <span>•</span>
                  <span>41.5% Click-through</span>
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-[#D97706]/50" />
                <span className="px-2 py-0.5 rounded-full bg-white border border-[rgba(71,86,87,0.2)] text-[10px] font-mono font-bold text-[#D97706] shadow-xs">
                  Wait 2 Days (48 Hours)
                </span>
                <div className="w-0.5 h-4 bg-[#D97706]/50" />
                <ArrowDown className="w-3.5 h-3.5 text-[#D97706]" />
              </div>

              {/* =========================================================================
                  NODE 4: DECISION / IF-ELSE CONDITION BRANCH
                  ========================================================================= */}
              <div
                onClick={() => setSelectedNode("condition_check")}
                className={`w-full max-w-md p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
                  selectedNode === "condition_check"
                    ? "bg-white border-[#B45309] ring-2 ring-[#B45309]/30 shadow-md"
                    : "bg-white/90 border-[rgba(71,86,87,0.2)] hover:border-[#B45309]/60"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(71,86,87,0.1)]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#B45309]/20 text-[#B45309] flex items-center justify-center font-bold text-xs">
                      ?
                    </span>
                    <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
                      Decision Rule
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7e939a]">Day 3</span>
                </div>
                <div className="mt-2.5">
                  <h4 className="text-sm font-bold text-[#1C2527]">
                    Did Student Reply or Attend Demo?
                  </h4>
                  <p className="text-[11px] text-[#5A6E71] mt-0.5">
                    Checks WhatsApp conversation state, form submissions, and counseling bookings
                  </p>
                </div>
              </div>

              {/* Split Branches Display */}
              <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Branch YES */}
                <div
                  onClick={() => setSelectedNode("branch_yes")}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedNode === "branch_yes"
                      ? "bg-white border-[#10b981] ring-2 ring-[#10b981]/30 shadow-sm"
                      : "bg-white/80 border-[rgba(71,86,87,0.15)] hover:border-[#10b981]/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#10b981] mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>IF YES (Engaged)</span>
                  </div>
                  <h5 className="font-bold text-xs text-[#1C2527]">Schedule 1-on-1 Mentoring</h5>
                  <p className="text-[10.5px] text-[#5A6E71] mt-0.5">
                    Assign to Senior Counselor for closing
                  </p>
                </div>

                {/* Branch NO */}
                <div
                  onClick={() => setSelectedNode("branch_no")}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedNode === "branch_no"
                      ? "bg-white border-[#C3473C] ring-2 ring-[#C3473C]/30 shadow-sm"
                      : "bg-white/80 border-[rgba(71,86,87,0.15)] hover:border-[#C3473C]/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#C3473C] mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>IF NO (Unresponsive)</span>
                  </div>
                  <h5 className="font-bold text-xs text-[#1C2527]">Auto-Inject Call in Queue</h5>
                  <p className="text-[10.5px] text-[#5A6E71] mt-0.5">
                    Pushes urgent task into telecaller softphone queue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Node Configuration & Message Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[rgba(71,86,87,0.18)] shadow-xs space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(71,86,87,0.12)]">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-sm font-bold text-[#1C2527]">
                  Node Configuration & Preview
                </h3>
              </div>
              <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-[#FAF6EE] text-[#5A6E71] border border-[rgba(71,86,87,0.15)]">
                {selectedNode}
              </span>
            </div>

            {/* Content Inspector for WhatsApp Welcome */}
            {selectedNode === "whatsapp_welcome" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-[#128C7E]">
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Business API Template</span>
                </div>

                {/* WhatsApp Chat Bubble Mockup */}
                <div className="p-3.5 rounded-2xl bg-[#EFEAE2] border border-[#25D366]/30 shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#5A6E71] font-semibold border-b border-black/5 pb-1.5">
                    <span>Skillyards Official Business</span>
                    <span className="text-[10px] text-[#128C7E] font-bold">Verified ✅</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs text-xs text-[#1C2527] leading-relaxed space-y-2">
                    <p>
                      Hi <span className="font-bold text-[#D97706]">&#123;&#123;candidate_name&#125;&#125;</span>! 🚀
                    </p>
                    <p>
                      Thank you for your interest in the{" "}
                      <span className="font-semibold">&#123;&#123;course_name&#125;&#125;</span> at Skillyards.
                    </p>
                    <p>
                      Here is the complete syllabus & capstone project curriculum:
                    </p>
                    <div className="p-2 rounded-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] flex items-center justify-between text-[11px]">
                      <span className="font-medium text-[#1C2527]">📄 Curriculum-2026.pdf</span>
                      <span className="text-[#128C7E] font-bold">Download</span>
                    </div>
                    <p className="text-[10px] text-right text-[#7e939a]">10:32 AM ✓✓</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1C2527]">Available Dynamic Variables</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["{{candidate_name}}", "{{course_name}}", "{{counselor_name}}", "{{brochure_url}}"].map((v) => (
                      <span
                        key={v}
                        className="px-2 py-0.5 rounded-md bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] text-[10.5px] font-mono text-[#D97706]"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Content Inspector for Demo SMS */}
            {selectedNode === "demo_sms" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D97706]">
                  <Smartphone className="w-4 h-4" />
                  <span>Transactional SMS Gateway (DLT Approved)</span>
                </div>

                {/* SMS Bubble Mockup */}
                <div className="p-3.5 rounded-2xl bg-[#0c1316] text-white border border-white/10 shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#7e939a] border-b border-white/10 pb-1">
                    <span>Sender: VK-SKILLY</span>
                    <span className="text-[10px]">SMS</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/10 text-xs text-white leading-relaxed font-mono">
                    Hi &#123;&#123;candidate_name&#125;&#125;, your VIP seat for tomorrow's Live Demo Class is reserved!
                    Claim access: https://skillyards.com/demo. Reply STOP to opt out.
                  </div>
                </div>

                <p className="text-[11px] text-[#5A6E71]">
                  Dispatched precisely at 11:00 AM on Day 1 to maximize click-through and lunch-time browsing.
                </p>
              </div>
            )}

            {/* Content Inspector for Branch NO (Queue Task) */}
            {(selectedNode === "branch_no" || selectedNode === "condition_check") && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C3473C]">
                  <PhoneCall className="w-4 h-4" />
                  <span>Automated Telephony Task Injection</span>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">Task: Urgent Lead Callback</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 text-[9px] font-bold">
                      PRIORITY = HIGH
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    Lead did not respond to WhatsApp or SMS within 48 hours. Auto-routes to telecaller
                    queue for immediate human intervention.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.15)] text-xs space-y-1">
                  <span className="font-bold text-[#1C2527] block">Destination Queue:</span>
                  <p className="text-[11px] text-[#5A6E71]">
                    Direct Softphone Queue (Port 3003) ➔ 1-Click Call Dialing enabled.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Test Simulator Button in Inspector */}
            <div className="pt-3 border-t border-[rgba(71,86,87,0.12)]">
              <button
                type="button"
                onClick={onOpenSimulator}
                className="w-full crm-btn-primary !py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Simulate Execution on Real Prospect</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

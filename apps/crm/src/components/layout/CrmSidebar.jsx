"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  CalendarClock,
  GraduationCap,
  FileSpreadsheet,
  CopyCheck,
  ChevronDown,
  ArrowRight,
  X,
  Settings,
  Plus,
  Award,
  Layers,
  Workflow,
  Banknote,
  MessageSquare,
  Target,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTelephony } from "@/context/TelephonyContext";

// Primary Navigation Activity Items
const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users, badge: "9", hasSubmenu: true },
  { label: "Marketing Campaigns", href: "/campaigns", icon: Target, badge: "ROI", hasSubmenu: true },
  { label: "Duplicate Reviews", href: "/duplicates", icon: CopyCheck, badge: "1" },
  { label: "Call Queue", href: "/queue", icon: PhoneCall },
  { label: "Follow-ups", href: "/follow-ups", icon: CalendarClock },
  { label: "Omnichannel Inbox", href: "/inbox", icon: MessageSquare, badge: "3", hasSubmenu: true },
  { label: "Counselling", href: "/counselling", icon: GraduationCap, hasSubmenu: true },
  { label: "Admissions & Fees", href: "/admissions", icon: Award, badge: "New", hasSubmenu: true },
  { label: "Fee Installments", href: "/installments", icon: Banknote, badge: "Dues" },
  { label: "Sales Incentives", href: "/incentives", icon: Trophy, badge: "Bonus" },
  { label: "Academic Batches", href: "/cohorts", icon: Layers, badge: "Live", hasSubmenu: true },
  { label: "Drip Cadences", href: "/cadences", icon: Workflow, badge: "Drip", hasSubmenu: true },
  { label: "EOD Reports", href: "/eod", icon: FileSpreadsheet },
];

// Sub-Panel Operations Tree for each section
const SECTION_DETAILS = {
  "/": {
    title: "Command Center",
    category: "Workspace Overview",
    items: [
      { label: "Sales KPI Summary", href: "/" },
      { label: "Pipeline Overview", href: "/leads" },
      { label: "Dialer Queue", href: "/queue" },
      { label: "Follow-up Schedule", href: "/follow-ups" },
    ],
  },
  "/leads": {
    title: "Leads Pipeline",
    category: "Lead Operations",
    items: [
      { label: "All Registered Leads", href: "/leads" },
      { label: "New Prospects", href: "/leads", count: 9 },
      { label: "Contacted Leads", href: "/leads" },
      { label: "In Follow-up", href: "/leads" },
      { label: "Counselling Scheduled", href: "/leads" },
      { label: "Qualified Prospects", href: "/leads", count: 4 },
      { label: "Converted / Closed", href: "/leads" },
      { label: "Cold / Lost", href: "/leads" },
    ],
  },
  "/campaigns": {
    title: "Campaign Attribution",
    category: "Marketing & Growth",
    items: [
      { label: "Active Campaigns", href: "/campaigns" },
      { label: "Channel Performance", href: "/campaigns" },
      { label: "Launch Campaign & UTM", href: "/campaigns" },
      { label: "Leads Pipeline", href: "/leads" },
    ],
  },
  "/duplicates": {
    title: "Duplicate Reviews",
    category: "Data Hygiene",
    items: [
      { label: "Pending Resolution", href: "/duplicates", count: 1 },
      { label: "Merge History", href: "/duplicates" },
      { label: "Audit Logs", href: "/duplicates" },
    ],
  },
  "/queue": {
    title: "Call Queue",
    category: "Dialer Operations",
    items: [
      { label: "Active Lead Queue", href: "/queue" },
      { label: "Overdue Follow-up Calls", href: "/follow-ups" },
      { label: "High Priority Prospects", href: "/leads" },
    ],
  },
  "/follow-ups": {
    title: "Follow-up Agenda",
    category: "Schedule & Agenda",
    items: [
      { label: "Today's Agenda", href: "/follow-ups" },
      { label: "Overdue Reminders", href: "/follow-ups" },
      { label: "Next 7 Days", href: "/follow-ups" },
    ],
  },
  "/inbox": {
    title: "Omnichannel Communications",
    category: "Conversational Sales",
    items: [
      { label: "All Active Chats", href: "/inbox" },
      { label: "WhatsApp Direct", href: "/inbox" },
      { label: "Unread Messages", href: "/inbox", count: 3 },
      { label: "Cadence Drip Replies", href: "/inbox" },
    ],
  },
  "/counselling": {
    title: "Counselling Sessions",
    category: "Student Admissions",
    items: [
      { label: "Scheduled Today", href: "/counselling" },
      { label: "Session Outcomes", href: "/counselling" },
      { label: "Enrolled Students", href: "/counselling" },
    ],
  },
  "/admissions": {
    title: "Admissions & Fees",
    category: "Financials & Cohorts",
    items: [
      { label: "Enrolled Students", href: "/admissions" },
      { label: "Tuition Collections", href: "/admissions" },
      { label: "0% EMI Loan Approvals", href: "/admissions" },
      { label: "Pending Receivables", href: "/installments" },
    ],
  },
  "/installments": {
    title: "Fee Installments Desk",
    category: "Financials & Receivables",
    items: [
      { label: "Receivables Ledger", href: "/installments" },
      { label: "Overdue Alerts", href: "/installments" },
      { label: "Upcoming 30 Days", href: "/installments" },
      { label: "Admissions Hub", href: "/admissions" },
    ],
  },
  "/incentives": {
    title: "Incentives & Payouts",
    category: "Gamification & Payroll",
    items: [
      { label: "Sales Leaderboard", href: "/incentives" },
      { label: "Commission Calculator", href: "/incentives" },
      { label: "Manager Approval Ledger", href: "/incentives" },
      { label: "Admissions Hub", href: "/admissions" },
    ],
  },
  "/cohorts": {
    title: "Academic Batches",
    category: "EdTech Operations",
    items: [
      { label: "Active Live Cohorts", href: "/cohorts" },
      { label: "Capacity & Seat Ledger", href: "/cohorts" },
      { label: "Faculty Allocations", href: "/cohorts" },
      { label: "Admissions Pipeline", href: "/admissions" },
    ],
  },
  "/cadences": {
    title: "Drip Automation",
    category: "Lead Nurturing",
    items: [
      { label: "All Cadence Flows", href: "/cadences" },
      { label: "WhatsApp Sequences", href: "/cadences" },
      { label: "Email Auto-Drips", href: "/cadences" },
      { label: "Omnichannel Inbox", href: "/inbox" },
    ],
  },
  "/eod": {
    title: "Daily Actuals & Filing",
    category: "EOD Telecalling",
    items: [
      { label: "Daily Call Logs", href: "/eod" },
      { label: "Connect Targets", href: "/eod" },
      { label: "Supervisor Review", href: "/eod" },
    ],
  },
};

export function CrmSidebar({ isMobileOpen = false, onMobileClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, crmRoles } = useAuth();
  const { openSoftphone } = useTelephony();

  const [expandedSection, setExpandedSection] = useState(null);

  const audioRef = useRef(null);
  const lastSoundPlayedRef = useRef(0);

  // Auto-expand section that matches current URL
  useEffect(() => {
    const matching = NAV_ITEMS.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    );
    if (matching && matching.hasSubmenu) {
      setExpandedSection(matching.href);
    }
    // Auto-close mobile drawer on route change
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]);

  const playClickSound = () => {
    try {
      const now = Date.now();
      if (now - lastSoundPlayedRef.current < 200) return;
      lastSoundPlayedRef.current = now;

      if (!audioRef.current && typeof Audio !== "undefined") {
        audioRef.current = new Audio("/audio/button-click-sound.mp3");
        audioRef.current.volume = 0.35;
      }
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } catch {}
  };

  const handleItemClick = (item, isMobile = false) => {
    playClickSound();

    if (item.hasSubmenu) {
      // Toggle accordion expansion
      setExpandedSection((prev) => (prev === item.href ? null : item.href));
      if (pathname !== item.href) {
        router.push(item.href);
        if (isMobile && onMobileClose) onMobileClose();
      }
    } else {
      router.push(item.href);
      if (isMobile && onMobileClose) onMobileClose();
    }
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Header */}
      <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] shadow-[0_0_6px_rgba(124,58,237,0.5)]" />
          <span className="text-xs font-bold text-slate-800 tracking-wider uppercase truncate">
            CRM Workspace
          </span>
        </div>

        {isMobile && (
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer active:scale-95"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Buttons List (Styled matching reference design) */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const isExpanded = expandedSection === item.href;
          const subItems = SECTION_DETAILS[item.href]?.items || [];

          return (
            <div key={item.href} className="w-full">
              <button
                type="button"
                onClick={() => handleItemClick(item, isMobile)}
                className={`w-full flex items-center justify-between p-2 rounded-2xl transition-all duration-200 group text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#FAF5FF] border border-[#7C3AED]/20 shadow-xs"
                    : "hover:bg-slate-100/80 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Left Squircle Icon Container */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isSelected
                        ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30"
                        : "bg-[#F1F5F9] text-[#475569] group-hover:bg-[#E2E8F0] group-hover:text-[#1E293B]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Center Label */}
                  <span
                    className={`text-sm truncate transition-colors ${
                      isSelected
                        ? "font-bold text-[#7C3AED]"
                        : "font-semibold text-[#1E293B] group-hover:text-black"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Right Indicator (Badge or Arrow / Chevron) */}
                <div className="flex items-center gap-2 shrink-0 pr-1">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-[#7C3AED] text-white"
                          : "bg-[#7C3AED]/15 text-[#7C3AED]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.hasSubmenu ? (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      } ${isSelected ? "text-[#7C3AED]" : "text-[#94A3B8]"}`}
                    />
                  ) : (
                    <ArrowRight
                      className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
                        isSelected ? "text-[#7C3AED]" : "text-[#94A3B8]"
                      }`}
                    />
                  )}
                </div>
              </button>

              {/* Submenu Accordion */}
              {item.hasSubmenu && isExpanded && subItems.length > 0 && (
                <div className="ml-14 pl-2 pr-2 py-1 space-y-0.5 border-l-2 border-[#7C3AED]/25 animate-in slide-in-from-top-1 duration-150">
                  {subItems.map((sub, idx) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={idx}
                        href={sub.href}
                        onClick={() => {
                          playClickSound();
                          if (isMobile && onMobileClose) onMobileClose();
                        }}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors ${
                          isSubActive
                            ? "bg-[#7C3AED]/15 text-[#7C3AED] font-bold"
                            : "text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100/70 font-medium"
                        }`}
                      >
                        <span className="truncate">{sub.label}</span>
                        {sub.count !== undefined && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] font-bold">
                            {sub.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Profile & Quick Dialer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            title={`${user?.name || "User"} (${crmRoles?.[0] || "Staff"})`}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0"
          >
            {user?.name ? user.name[0] : "P"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{user?.name || "Priya Patel"}</p>
            <p className="text-[10.5px] text-slate-500 capitalize truncate">{crmRoles?.[0]?.replace(/_/g, " ") || "Senior Counsellor"}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            openSoftphone();
            if (isMobile && onMobileClose) onMobileClose();
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-colors cursor-pointer"
          title="Open Softphone Dialer"
        >
          <PhoneCall className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Docked Sidebar */}
      <aside className="hidden md:flex w-72 h-full shrink-0 select-none border-r border-[rgba(71,86,87,0.15)] shadow-xs">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile & Small Tablet Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onMobileClose}
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}

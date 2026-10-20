"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CrmSidebar } from "@/components/layout/CrmSidebar";
import { CrmHeader } from "@/components/layout/CrmHeader";
import { NewLeadModal } from "@/components/leads/NewLeadModal";
import { Keyboard, X } from "lucide-react";

import { TelephonyProvider, useTelephony } from "@/context/TelephonyContext";
import { SoftphoneDrawer } from "@/components/telephony/SoftphoneDrawer";

function DashboardLayoutContent({ children }) {
  const pathname = usePathname();
  const isFullBleedPage = pathname === "/inbox";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const { setIsSoftphoneOpen, isSoftphoneOpen, callState } = useTelephony();

  // Global hotkeys: 'N' for New Lead, 'D' for Dialer, '?' for shortcuts, 'Escape' to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      if (["INPUT", "TEXTAREA"].includes(activeTag)) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setIsModalOpen(true);
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setIsSoftphoneOpen((prev) => !prev);
      } else if (e.key === "?") {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsModalOpen(false);
        setShowShortcutsModal(false);
        if (callState === "IDLE") {
          setIsSoftphoneOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callState, setIsSoftphoneOpen]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F0E6D6] text-[#1C2527] selection:bg-[#4A6D7C]/30 selection:text-[#1C2527]">
      {/* Full-Width Top Header containing permanent Skillyards Logo, Search, Persona Switcher & Notifications */}
      <CrmHeader onNewLeadClick={() => setIsModalOpen(true)} />

      {/* Workspace Area: Collapsible Sidebar on Left + Content View on Right */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        <CrmSidebar />
        {isFullBleedPage ? (
          <main className="flex-1 h-full overflow-hidden flex flex-col min-h-0 min-w-0">{children}</main>
        ) : (
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
        )}
      </div>

      {/* Persistent Floating Softphone Widget & Disposition Runner */}
      <SoftphoneDrawer />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-all">
          <div className="w-full max-w-sm bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0c1316] px-5 py-3.5 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)]">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#62929e]" />
                <h3 className="text-sm font-bold text-white tracking-wide">Quick Hotkeys</h3>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 rounded text-[#7e939a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {[
                { key: "N", desc: "Open Register New Lead modal from anywhere" },
                { key: "D", desc: "Toggle Telecalling Softphone Dialer" },
                { key: "/", desc: "Focus Global Search in top navbar" },
                { key: "?", desc: "Toggle this Keyboard Shortcuts guide" },
                { key: "Esc", desc: "Close any open modal or dropdown" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[rgba(71,86,87,0.12)] text-xs shadow-xs"
                >
                  <span className="text-[#1C2527] font-medium">{item.desc}</span>
                  <kbd className="px-2 py-1 rounded bg-[#0c1316] text-white font-mono text-xs font-bold border border-[rgba(98,146,158,0.3)] shadow-xs">
                    {item.key}
                  </kbd>
                </div>
              ))}

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowShortcutsModal(false)}
                  className="crm-btn-primary !py-1.5 !px-4 text-xs mx-auto"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {isModalOpen && (
        <NewLeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <TelephonyProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </TelephonyProvider>
  );
}

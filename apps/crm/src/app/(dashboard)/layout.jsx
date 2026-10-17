"use client";

import React, { useState } from "react";
import { CrmSidebar } from "@/components/layout/CrmSidebar";
import { CrmHeader } from "@/components/layout/CrmHeader";
import { NewLeadModal } from "@/components/leads/NewLeadModal";

export default function DashboardLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F0E6D6] text-[#1C2527] selection:bg-[#4A6D7C]/30 selection:text-[#1C2527]">
      {/* Full-Width Top Header containing the permanent, large Skillyards Logo */}
      <CrmHeader onNewLeadClick={() => setIsModalOpen(true)} />

      {/* Workspace Area: Collapsible Sidebar on Left + Content View on Right */}
      <div className="flex-1 flex min-w-0">
        <CrmSidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>

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

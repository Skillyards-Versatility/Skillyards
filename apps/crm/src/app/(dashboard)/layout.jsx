"use client";

import React, { useState } from "react";
import { CrmSidebar } from "@/components/layout/CrmSidebar";
import { CrmHeader } from "@/components/layout/CrmHeader";
import { NewLeadModal } from "@/components/leads/NewLeadModal";

export default function DashboardLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#090d16]">
      <CrmSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <CrmHeader onNewLeadClick={() => setIsModalOpen(true)} />
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

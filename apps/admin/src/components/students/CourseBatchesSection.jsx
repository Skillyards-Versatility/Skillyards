"use client";

import { useState } from "react";
import { Plus, Users, Layers, Filter, CheckCircle2, Clock } from "lucide-react";
import { CreateBatchModal } from "./CreateBatchModal";

export function CourseBatchesSection({ batches = [], activeBatchId, onSelectBatch, onBatchCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseForNew, setSelectedCourseForNew] = useState("");

  const handleOpenCreateModal = (courseName = "") => {
    setSelectedCourseForNew(courseName);
    setIsModalOpen(true);
  };

  // Total metrics
  const totalBatches = batches.length;
  const totalStudentsInBatches = batches.reduce((sum, b) => sum + (Number(b.studentCount) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Course Batches
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalBatches} batches active across courses with {totalStudentsInBatches} assigned students.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateModal("")}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-primary" />
          Create New Batch
        </button>
      </div>

      {batches.length === 0 ? (
        <div className="card p-6 text-center text-muted-foreground text-sm">
          No course batches created yet. Click &quot;Create New Batch&quot; to set up your first cohort.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => {
            const isSelected = activeBatchId === batch.id;
            const count = Number(batch.studentCount) || 0;

            return (
              <div
                key={batch.id}
                onClick={() => onSelectBatch(isSelected ? "" : batch.id)}
                className={`card p-4 transition-all cursor-pointer relative overflow-hidden group hover:border-primary/50 ${
                  isSelected
                    ? "ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground mb-1.5 uppercase tracking-wide">
                      {batch.courseName}
                    </span>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {batch.name}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      batch.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                {batch.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                    {batch.description}
                  </p>
                )}

                <div className="pt-3 mt-1 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>{count} Student{count !== 1 ? "s" : ""}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                      isSelected
                        ? "text-primary font-bold"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    {isSelected ? "Filtering Active" : "Filter List"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateBatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          if (onBatchCreated) onBatchCreated();
        }}
        initialCourse={selectedCourseForNew}
      />
    </div>
  );
}

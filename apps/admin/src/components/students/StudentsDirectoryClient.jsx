"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseBatchesSection } from "./CourseBatchesSection";
import { StudentTable } from "./StudentTable";

export function StudentsDirectoryClient({ 
  initialStudents = [], 
  initialBatches = [], 
  canEdit = false,
  totalStudents = 0,
  limit = 100,
  offset = 0
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  
  const lastUpdated = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Course Batches Section with Cards and Create Batch button */}
      <CourseBatchesSection
        batches={initialBatches}
        activeBatchId={selectedBatchId}
        onSelectBatch={(batchId) => {
          setSelectedBatchId(batchId);
          if (batchId) {
            const matchedBatch = initialBatches.find((b) => b.id === batchId);
            if (matchedBatch) {
              setSelectedCourse(matchedBatch.courseName);
            }
          }
        }}
        onBatchCreated={handleRefresh}
      />

      {/* Student Table with Filters and Custom Assignment Actions */}
      <div className="card overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b border-border flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground">
            Total Students: {totalStudents}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            Last Updated: {lastUpdated}
          </span>
        </div>
        <StudentTable
          students={initialStudents}
          batches={initialBatches}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedBatchId={selectedBatchId}
          setSelectedBatchId={setSelectedBatchId}
          onStudentUpdated={handleRefresh}
          canEdit={canEdit}
          totalStudents={totalStudents}
          limit={Number(limit)}
          offset={Number(offset)}
        />
      </div>
    </div>
  );
}

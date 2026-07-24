"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseBatchesSection } from "./CourseBatchesSection";
import { StudentTable } from "./StudentTable";

export function StudentsDirectoryClient({ initialStudents = [], initialBatches = [] }) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");

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
        <StudentTable
          students={initialStudents}
          batches={initialBatches}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedBatchId={selectedBatchId}
          setSelectedBatchId={setSelectedBatchId}
          onStudentUpdated={handleRefresh}
        />
      </div>
    </div>
  );
}

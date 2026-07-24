"use client";

import { useEffect, useState } from "react";
import { UserPlus, Layers } from "lucide-react";
import { getBatches } from "@/actions/batch";

const COURSES = [
  "OJT (Full Stack Development)",
  "OJT (Advanced Digital Marketing)",
  "OJD (Bachelor of Computer Applications)",
  "OJD (Bachelor of Business Administration)",
];

export function IdentityForm({ formData, setFormData }) {
  const [batches, setBatches] = useState([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);

  useEffect(() => {
    async function loadBatches() {
      if (!formData.course) {
        setBatches([]);
        return;
      }
      setIsLoadingBatches(true);
      try {
        const res = await getBatches(formData.course);
        setBatches(res || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
      } finally {
        setIsLoadingBatches(false);
      }
    }

    loadBatches();
  }, [formData.course]);

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setFormData({
      ...formData,
      course: selectedCourse,
      batchId: "",
      batchName: "",
    });
  };

  const handleBatchChange = (e) => {
    const bId = e.target.value;
    const selectedBatch = batches.find((b) => b.id === bId);
    setFormData({
      ...formData,
      batchId: bId,
      batchName: selectedBatch ? selectedBatch.name : "",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold border-b border-border pb-2 text-foreground flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-primary" />
        Identity & Course Details
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="input"
            placeholder="e.g. Aditi Patil"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Course</label>
            <select
              value={formData.course}
              onChange={handleCourseChange}
              className="input"
            >
              <option value="">Select a course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Batch Assignment
            </label>
            <select
              value={formData.batchId || ""}
              onChange={handleBatchChange}
              disabled={!formData.course || isLoadingBatches}
              className="input disabled:opacity-50"
            >
              <option value="">
                {!formData.course
                  ? "Select a course first"
                  : isLoadingBatches
                  ? "Loading batches..."
                  : "-- Assign Later (Unassigned) --"}
              </option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
              placeholder="10-digit mobile number"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="student@example.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Search, Filter, Edit2, Layers, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteStudent } from "@/actions/student";
import { AssignBatchModal } from "./AssignBatchModal";
import { EditStudentModal } from "./EditStudentModal";

const COURSES = [
  "OJT (Full Stack Development)",
  "OJT (Advanced Digital Marketing)",
  "OJD (Bachelor of Computer Applications)",
  "OJD (Bachelor of Business Administration)",
];

export function StudentTable({
  students = [],
  batches = [],
  selectedCourse = "",
  setSelectedCourse,
  selectedBatchId = "",
  setSelectedBatchId,
  onStudentUpdated,
  canEdit = false,
}) {
  const [query, setQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingDetailsStudent, setEditingDetailsStudent] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  const handleDeleteStudent = async (student) => {
    if (!window.confirm(`Delete ${student.name}? This permanently removes their plan, installments and payment history. This cannot be undone.`)) return;
    setDeletingIds((prev) => [...prev, student.id]);
    try {
      await deleteStudent(student.id);
      toast.success("Student deleted");
      if (onStudentUpdated) onStudentUpdated();
    } catch (err) {
      toast.error(err.message || "Failed to delete student");
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== student.id));
    }
  };

  // Available batches for selected course dropdown
  const availableBatchesForFilter = selectedCourse
    ? batches.filter((b) => b.courseName === selectedCourse)
    : batches;

  // Filter students by Search, Course, and Batch
  const filtered = students.filter((s) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchSearch =
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q);
      if (!matchSearch) return false;
    }

    if (selectedCourse && s.courseName !== selectedCourse) {
      return false;
    }

    if (selectedBatchId) {
      if (selectedBatchId === "unassigned") {
        if (s.batchId) return false;
      } else if (s.batchId !== selectedBatchId) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      {/* Search and Filters Bar */}
      <div className="p-4 border-b border-border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student name, email or phone..."
            className="input pl-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Course Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground">
            <Filter className="w-3.5 h-3.5 text-primary" />
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedBatchId("");
              }}
              className="bg-transparent border-none outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="">All Courses</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="">All Batches</option>
              <option value="unassigned">Unassigned Batch</option>
              {availableBatchesForFilter.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {(selectedCourse || selectedBatchId || query) && (
            <button
              onClick={() => {
                setSelectedCourse("");
                setSelectedBatchId("");
                setQuery("");
              }}
              className="text-xs text-primary font-bold hover:underline px-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[640px]">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 sm:px-6 py-4 font-semibold">Student</th>
              <th className="px-4 sm:px-6 py-4 font-semibold">Course</th>
              <th className="px-4 sm:px-6 py-4 font-semibold">Batch</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-right">Net Payable</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-right">Balance</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No students match the selected filter criteria.
                </td>
              </tr>
            )}
            {Array.isArray(filtered) &&
              filtered.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30 transition-colors group">
                  {/* Name & Contact */}
                  <td className="px-4 sm:px-6 py-4 font-semibold text-foreground">
                    <Link
                      href={`/students/${student.id}`}
                      className="hover:text-primary transition-colors block"
                    >
                      {student.name}
                    </Link>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5">
                      {student.email || student.phone || "-"}
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-4 sm:px-6 py-4 text-xs font-medium text-muted-foreground max-w-[180px] truncate">
                    {student.courseName || "-"}
                  </td>

                  {/* Batch Badge */}
                  <td className="px-4 sm:px-6 py-4 text-xs">
                    {student.batchName ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {student.batchName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Net Payable */}
                  <td className="px-4 sm:px-6 py-4 text-right font-medium text-foreground" suppressHydrationWarning>
                    ₹{(student.finalFee || 0).toLocaleString()}
                  </td>

                  {/* Balance */}
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        Number(student.balance) > 0
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      }`}
                      suppressHydrationWarning
                    >
                      ₹{(Number(student.balance) || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Action - Custom Batch Assignment */}
                  <td className="px-4 sm:px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {canEdit && (
                        <button
                          onClick={() => setEditingDetailsStudent(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted border border-border rounded-lg transition-colors cursor-pointer"
                          title="Edit Student Details"
                        >
                          <Pencil className="w-3.5 h-3.5 text-primary" />
                          <span>Edit</span>
                        </button>
                      )}
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted border border-border rounded-lg transition-colors cursor-pointer"
                        title="Assign/Change Batch"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-primary" />
                        <span>Assign Batch</span>
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleDeleteStudent(student)}
                          disabled={deletingIds.includes(student.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Student"
                        >
                          {deletingIds.includes(student.id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Assign Batch Modal */}
      {editingStudent && (
        <AssignBatchModal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
          batches={batches}
          onSuccess={() => {
            if (onStudentUpdated) onStudentUpdated();
          }}
        />
      )}

      {/* Edit Student Details Modal */}
      {canEdit && (
        <EditStudentModal
          isOpen={!!editingDetailsStudent}
          onClose={() => setEditingDetailsStudent(null)}
          student={editingDetailsStudent}
          batches={batches}
          onSuccess={() => {
            if (onStudentUpdated) onStudentUpdated();
          }}
        />
      )}
    </div>
  );
}

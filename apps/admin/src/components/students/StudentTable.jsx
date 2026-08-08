"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Search, Filter, Edit2, Layers, Pencil, Trash2, Loader2, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteStudent } from "@/actions/student";
import { AssignBatchModal } from "./AssignBatchModal";
import { EditStudentModal } from "./EditStudentModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
  totalStudents = 0,
  limit = 100,
  offset = 0
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [laptopFilter, setLaptopFilter] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingDetailsStudent, setEditingDetailsStudent] = useState(null);
  const [deletingIds, setDeletingIds] = useState([]);

  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState(null);

  const handleDeleteStudent = (student) => {
    setConfirmDeleteStudent(student);
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

    if (laptopFilter) {
      if (laptopFilter === "opted" && !s.laptopOpted) return false;
      if (laptopFilter === "not_opted" && s.laptopOpted) return false;
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

          {/* Laptop Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground">
            <Laptop className="w-3.5 h-3.5 text-primary" />
            <select
              value={laptopFilter}
              onChange={(e) => setLaptopFilter(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer pr-2 font-medium"
            >
              <option value="">All Laptops</option>
              <option value="opted">Opted</option>
              <option value="not_opted">Not Opted</option>
            </select>
          </div>

          {(selectedCourse || selectedBatchId || laptopFilter || query) && (
            <button
              onClick={() => {
                setSelectedCourse("");
                setSelectedBatchId("");
                setLaptopFilter("");
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
              <th className="px-4 sm:px-6 py-4 font-semibold">Laptop</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-right">Net Payable</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-right">Balance</th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-muted-foreground">
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

                  {/* Laptop Badge */}
                  <td className="px-4 sm:px-6 py-4 text-xs">
                    {student.laptopOpted ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                        Opted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        Not Opted
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-t border-border">
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length > 0 ? offset + 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(offset + limit, totalStudents)}</span> of <span className="font-medium text-foreground">{totalStudents}</span> students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newOffset = Math.max(0, offset - limit);
              router.push(`?limit=${limit}&offset=${newOffset}`);
            }}
            disabled={offset === 0}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => {
              const newOffset = offset + limit;
              router.push(`?limit=${limit}&offset=${newOffset}`);
            }}
            disabled={offset + limit >= totalStudents}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
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
      {canEdit && editingDetailsStudent && (
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

      {/* Confirm Delete Dialog */}
      {confirmDeleteStudent && (
        <ConfirmDialog
          title="Delete Student"
          message={`Delete ${confirmDeleteStudent.name}? This permanently removes their plan, installments and payment history. This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={async () => {
            const student = confirmDeleteStudent;
            setConfirmDeleteStudent(null);
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
          }}
          onCancel={() => setConfirmDeleteStudent(null)}
        />
      )}
    </div>
  );
}

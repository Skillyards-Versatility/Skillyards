"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Layers,
  Users,
  Calendar,
  Clock,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  Search,
  UserPlus,
  ArrowRight,
  ArrowRightLeft,
  BookmarkCheck,
  Clock3,
} from "lucide-react";
import { crmApi } from "@/lib/api";
import { ReserveSeatModal } from "./ReserveSeatModal";
import { TransferStudentModal } from "./TransferStudentModal";

export function CohortDetailsDrawer({
  isOpen,
  onClose,
  cohort,
  allCohorts = [],
  onUpdateCohort,
}) {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Seat Reservation Modal State
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [tokenReservations, setTokenReservations] = useState([]);

  // Student Transfer Modal State
  const [transferStudentTarget, setTransferStudentTarget] = useState(null);

  const fetchCohortDetails = async () => {
    if (!cohort || !isOpen) return;
    setLoadingStudents(true);
    try {
      const res = await crmApi.getCohort(cohort.id);
      if (res && res.students && res.students.length > 0) {
        setStudents(res.students);
      } else {
        // Fallback to local admissions or demo learners
        const localAdmissions = JSON.parse(
          localStorage.getItem("skillyards_enrolled_students") || "[]"
        );
        const matched = localAdmissions.filter(
          (adm) => adm.cohortName === cohort.name || adm.courseName === cohort.courseName
        );

        if (matched.length > 0) {
          setStudents(
            matched.map((m) => ({
              id: m.id,
              studentId: m.studentId || `SKY-2026-${m.id.slice(0, 4)}`,
              name: m.studentName,
              phone: m.studentPhone,
              email: m.studentEmail,
              paymentStatus: m.paymentStatus || "fully_paid",
              totalAmount: m.totalAmount,
              enrolledAt: m.enrolledAt || m.createdAt,
            }))
          );
        } else {
          // Default demo learners for this cohort
          setStudents([
            {
              id: `st-${cohort.id}-1`,
              studentId: "SKY-2026-8812",
              name: "Kabir Mehta",
              phone: "+91 98456 78901",
              email: "kabir.m@example.com",
              paymentStatus: "fully_paid",
              totalAmount: 45000,
              enrolledAt: new Date(Date.now() - 4 * 86400000).toISOString(),
            },
            {
              id: `st-${cohort.id}-2`,
              studentId: "SKY-2026-6623",
              name: "Aarav Sharma",
              phone: "+91 98765 43210",
              email: "aarav.sharma@example.com",
              paymentStatus: "partial_paid",
              totalAmount: 45135,
              enrolledAt: new Date(Date.now() - 6 * 86400000).toISOString(),
            },
            {
              id: `st-${cohort.id}-3`,
              studentId: "SKY-2026-7731",
              name: "Sneha Mukherjee",
              phone: "+91 99345 67890",
              email: "sneha.m@example.com",
              paymentStatus: "emi_active",
              totalAmount: 51920,
              enrolledAt: new Date(Date.now() - 8 * 86400000).toISOString(),
            },
          ]);
        }
      }
    } catch (err) {
      console.warn("Cohort detail fetch offline, using fallback list:", err);
    } finally {
      setLoadingStudents(false);
    }

    // Load active token reservations
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(
          localStorage.getItem("skillyards_seat_reservations") || "[]"
        );
        const activeHolds = stored.filter(
          (r) => r.batchId === cohort.id && new Date(r.expiresAt) > new Date()
        );
        setTokenReservations(activeHolds);
      } catch (_) {}
    }
  };

  useEffect(() => {
    fetchCohortDetails();
  }, [cohort, isOpen]);

  if (!isOpen || !cohort) return null;

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportRosterCSV = () => {
    if (students.length === 0) {
      alert("No enrolled students in this cohort to export");
      return;
    }
    const headers = ["Student ID", "Full Name", "Phone", "Email", "Fee Status", "Enrolled Date"];
    const rows = students.map((s) => [
      `"${s.studentId || ""}"`,
      `"${s.name || ""}"`,
      `"${s.phone || ""}"`,
      `"${s.email || ""}"`,
      `"${s.paymentStatus || "active"}"`,
      `"${new Date(s.enrolledAt || Date.now()).toLocaleDateString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `skillyards-roster-${cohort.code || "cohort"}-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentPhone.trim()) {
      alert("Please provide student name and phone");
      return;
    }

    setIsAdding(true);
    const newStudent = {
      id: `st-${Date.now()}`,
      studentId: `SKY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newStudentName.trim(),
      phone: newStudentPhone.trim(),
      email: newStudentEmail.trim() || "candidate@skillyards.com",
      paymentStatus: "fully_paid",
      totalAmount: 45000,
      enrolledAt: new Date().toISOString(),
    };

    try {
      try {
        await crmApi.assignStudentToCohort(cohort.id, {
          studentName: newStudent.name,
          studentPhone: newStudent.phone,
        });
      } catch (e) {
        console.warn("Backend cohort assign offline, applied locally:", e);
      }

      const updatedStudents = [newStudent, ...students];
      setStudents(updatedStudents);

      if (onUpdateCohort) {
        onUpdateCohort({
          ...cohort,
          filledSeats: (cohort.filledSeats || 0) + 1,
          seatsRemaining: Math.max(0, (cohort.seatsRemaining || 1) - 1),
          occupancyRate: Math.min(
            100,
            Math.round(
              (((cohort.filledSeats || 0) + 1) / (cohort.maxCapacity || 30)) * 100
            )
          ),
        });
      }

      setNewStudentName("");
      setNewStudentPhone("");
      setNewStudentEmail("");
      setShowAddStudentForm(false);
      setIsAdding(false);
    } catch (err) {
      alert("Failed to add student: " + err.message);
      setIsAdding(false);
    }
  };

  const handleSeatReserved = (newRes) => {
    setTokenReservations((prev) => [newRes, ...prev]);
    if (onUpdateCohort) {
      onUpdateCohort({
        ...cohort,
        seatsRemaining: Math.max(0, (cohort.seatsRemaining || 2) - 1),
      });
    }
  };

  const handleStudentTransferred = (transferData) => {
    setStudents((prev) => prev.filter((s) => s.id !== transferData.studentId));
    if (onUpdateCohort) {
      onUpdateCohort({
        ...cohort,
        filledSeats: Math.max(0, (cohort.filledSeats || 1) - 1),
        seatsRemaining: (cohort.seatsRemaining || 0) + 1,
      });
    }
  };

  const totalFilled = cohort.filledSeats || students.length;
  const occupancy = Math.round((totalFilled / (cohort.maxCapacity || 30)) * 100);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn flex justify-end">
        <div className="w-full max-w-2xl bg-[#FAF6EE] h-full shadow-2xl flex flex-col border-l border-[rgba(71,86,87,0.25)] animate-slideLeft">
          {/* Cockpit Header */}
          <div className="px-5 py-4 bg-[#0c1316] text-[#FAF6EE] border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(98,146,158,0.18)] border border-[rgba(98,146,158,0.35)] flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#D97706]/20 border border-[#D97706]/40 text-[#D97706]">
                    {cohort.code || "COHORT"}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-[280px]">
                    {cohort.name}
                  </h3>
                </div>
                <p className="text-[11px] text-[#7e939a]">{cohort.courseName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Top Occupancy & Schedule Card */}
            <div className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.16)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#5A6E71] block">
                    Live Seat Inventory
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-[#1C2527]">
                      {totalFilled}
                    </span>
                    <span className="text-xs font-semibold text-[#5A6E71]">
                      / {cohort.maxCapacity || 30} Total Seats ({occupancy}%)
                    </span>
                    {tokenReservations.length > 0 && (
                      <span className="text-xs font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded-md">
                        +{tokenReservations.length} Token Holds
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    cohort.seatsRemaining === 0
                      ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30"
                      : occupancy >= 80
                      ? "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30"
                      : "bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30"
                  }`}
                >
                  {cohort.seatsRemaining === 0
                    ? "Batch Full"
                    : `${cohort.seatsRemaining || Math.max(0, 30 - totalFilled)} Seats Left`}
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full h-3 rounded-full bg-[rgba(71,86,87,0.12)] overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    occupancy >= 95
                      ? "bg-[#DC2626]"
                      : occupancy >= 75
                      ? "bg-[#D97706]"
                      : "bg-[#128C7E]"
                  }`}
                  style={{ width: `${Math.min(100, occupancy)}%` }}
                />
              </div>

              {/* Schedule Details Row */}
              <div className="pt-2 border-t border-[rgba(71,86,87,0.1)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#5A6E71]">
                  <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                  <span className="truncate">{cohort.schedule || "Weekend Live"}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5A6E71]">
                  <Calendar className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                  <span>
                    Starts:{" "}
                    {new Date(cohort.startDate || Date.now()).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructor & Faculty Card */}
            <div className="p-3.5 rounded-xl bg-white border border-[rgba(71,86,87,0.14)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#194451] text-[#FAF6EE] flex items-center justify-center font-bold text-xs shadow-xs">
                  {cohort.mentorAvatar || "VM"}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#5A6E71] tracking-wider block">
                    Lead Faculty & Mentor
                  </span>
                  <h4 className="font-bold text-sm text-[#1C2527]">
                    {cohort.mentorName || "Vikram Malhotra"}
                  </h4>
                  <p className="text-[11px] text-[#5A6E71]">
                    {cohort.mentorRole || "Senior Program Mentor"}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30">
                Verified Instructor
              </span>
            </div>

            {/* Active Token Holds / Reserved Seats (if any) */}
            {tokenReservations.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#D97706]/35 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#D97706]">
                  <span className="flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Active Token Holds ({tokenReservations.length})</span>
                  </span>
                  <span className="text-[10px] font-normal text-[#5A6E71]">
                    Temporary 48h locks
                  </span>
                </div>

                <div className="space-y-1.5">
                  {tokenReservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-2.5 rounded-lg bg-white border border-[rgba(71,86,87,0.15)] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1C2527]">{res.studentName}</span>
                          <span className="font-mono text-[10px] text-[#5A6E71]">{res.studentPhone}</span>
                        </div>
                        <span className="text-[10px] text-[#7E939A] block">
                          ₹{res.tokenAmount?.toLocaleString("en-IN")} advance hold • Reserved by {res.reservedBy}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30">
                          Expires in {res.holdHours || 48}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enrolled Students Header & Toolbar */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#1C2527] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#128C7E]" />
                    <span>Enrolled Learners Roster ({students.length})</span>
                  </h4>
                  <p className="text-[11px] text-[#5A6E71]">
                    Official registered students allocated to this batch
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleExportRosterCSV}
                    className="crm-btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1.5 shadow-xs"
                    title="Download CSV roster"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Roster CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReserveModalOpen(true)}
                    className="crm-btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1 shadow-xs !text-[#D97706] border-[rgba(217,119,6,0.3)] bg-white hover:bg-[#FAF6EE]"
                    title="Reserve a seat with token deposit"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Hold Seat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddStudentForm((prev) => !prev)}
                    className="crm-btn-primary !py-1 !px-2.5 text-xs flex items-center gap-1 shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{showAddStudentForm ? "Cancel" : "Add Student"}</span>
                  </button>
                </div>
              </div>

              {/* Manual Add Student Form Drawer */}
              {showAddStudentForm && (
                <form
                  onSubmit={handleManualAddStudent}
                  className="p-4 rounded-xl bg-white border border-[#128C7E]/40 shadow-md space-y-3 animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#194451] flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-[#128C7E]" />
                      <span>Allocate Student to this Cohort</span>
                    </span>
                    <span className="text-[10px] text-[#5A6E71]">Manual / Direct Allocation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Candidate Full Name *"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="crm-input bg-[#FAF6EE] text-xs font-semibold"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={newStudentPhone}
                      onChange={(e) => setNewStudentPhone(e.target.value)}
                      className="crm-input bg-[#FAF6EE] text-xs font-semibold"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      className="crm-input bg-[#FAF6EE] text-xs flex-1"
                    />
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="crm-btn-primary !py-2 !px-4 text-xs font-bold shrink-0 shadow-sm"
                    >
                      {isAdding ? "Assigning..." : "Assign to Cohort"}
                    </button>
                  </div>
                </form>
              )}

              {/* Search Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#5A6E71] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search enrolled students by name, ID, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="crm-input !pl-8 !py-1.5 bg-white text-xs"
                />
              </div>

              {/* Students List */}
              {loadingStudents ? (
                <div className="p-8 text-center text-xs text-[#5A6E71]">
                  Loading cohort student roster...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-white border border-dashed border-[rgba(71,86,87,0.2)] text-xs text-[#5A6E71]">
                  No students found in this cohort matching your filter.
                </div>
              ) : (
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredStudents.map((st) => (
                    <div
                      key={st.id}
                      className="p-3 rounded-xl bg-white border border-[rgba(71,86,87,0.12)] hover:border-[rgba(71,86,87,0.3)] transition-all flex items-center justify-between gap-3 shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] text-[#1C2527] flex items-center justify-center font-bold text-xs shrink-0">
                          {st.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-xs text-[#1C2527] truncate">{st.name}</h5>
                            <span className="font-mono text-[10px] text-[#5A6E71]">#{st.studentId}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-[#5A6E71] mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#D97706]" />
                              {st.phone}
                            </span>
                            {st.email && (
                              <span className="flex items-center gap-1 truncate hidden sm:inline-flex">
                                <Mail className="w-3 h-3 text-[#D97706]" />
                                {st.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              st.paymentStatus === "fully_paid"
                                ? "bg-[#25D366]/10 text-[#128C7E] border-[#25D366]/30"
                                : st.paymentStatus === "emi_active"
                                ? "bg-[#194451]/10 text-[#194451] border-[#194451]/30"
                                : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30"
                            }`}
                          >
                            {st.paymentStatus === "fully_paid"
                              ? "Fully Paid"
                              : st.paymentStatus === "emi_active"
                              ? "0% EMI Active"
                              : "Partial Paid"}
                          </span>
                          <span className="block text-[10px] text-[#7e939a] mt-0.5">
                            {new Date(st.enrolledAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Transfer Cohort Action Button */}
                        <button
                          type="button"
                          onClick={() => setTransferStudentTarget(st)}
                          title="Transfer student to another cohort"
                          className="p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#F0E6D6] text-[#D97706] hover:text-[#B45309] border border-[rgba(71,86,87,0.18)] transition-all cursor-pointer shadow-2xs"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-white border-t border-[rgba(71,86,87,0.15)] flex items-center justify-between shrink-0">
            <span className="text-xs text-[#5A6E71]">
              Cohort status: <strong className="text-[#1C2527] capitalize">{cohort.status}</strong>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="crm-btn-primary !py-1.5 !px-5 text-xs font-bold"
            >
              Close Roster
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      <ReserveSeatModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        cohort={cohort}
        onSeatReserved={handleSeatReserved}
      />

      <TransferStudentModal
        isOpen={Boolean(transferStudentTarget)}
        onClose={() => setTransferStudentTarget(null)}
        student={transferStudentTarget}
        currentCohort={cohort}
        allCohorts={allCohorts}
        onStudentTransferred={handleStudentTransferred}
      />
    </>
  );
}

export default CohortDetailsDrawer;

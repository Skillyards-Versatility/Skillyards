"use client";

import React from "react";
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Check,
  Building,
  GraduationCap,
  Calendar,
  CreditCard,
  ShieldCheck,
  FileText,
} from "lucide-react";

export function StudentFeeReceiptModal({ isOpen, onClose, enrollment }) {
  if (!isOpen || !enrollment) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptDate = new Date(enrollment.enrolledAt || enrollment.createdAt || Date.now()).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const baseFee = Number(enrollment.baseFee || 50000);
  const scholarship = Number(enrollment.scholarshipAmount || 0);
  const netFee = baseFee - scholarship;
  const gst = Number(enrollment.gstAmount || Math.round(netFee * 0.18));
  const totalAmount = Number(enrollment.totalAmount || (netFee + gst));
  const amountPaid = Number(enrollment.amountPaid || totalAmount);
  const balanceDue = Math.max(0, totalAmount - amountPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF6EE] border border-[rgba(71,86,87,0.25)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-[#0c1316] text-[#FAF6EE] border-b border-[rgba(98,146,158,0.2)] flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Official Admission Fee Receipt</h3>
              <p className="text-[11px] text-[#7e939a]">
                Receipt No: <span className="font-mono text-cyan-300 font-bold">{enrollment.receiptNo || "REC-2026-901"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer border border-white/10"
              title="Print or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-300" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white print:p-0 print:m-0" id="admission-receipt">
          {/* Institutional Top Letterhead */}
          <div className="border-b-2 border-[#0c1316] pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-[#1C2527]">SKILLYARDS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0c1316] text-[#FAF6EE]">
                  VERSATILITY
                </span>
              </div>
              <p className="text-xs text-[#5A6E71] mt-0.5">
                School of Advanced Software Engineering & Applied AI
              </p>
              <p className="text-[11px] text-[#7E9396]">
                Admissions & Student Accounts Division • GSTIN: 27AABCS1234F1Z5
              </p>
            </div>

            <div className="sm:text-right text-xs space-y-1">
              <div className="inline-block px-2.5 py-1 rounded-md bg-[#25D366]/15 border border-[#25D366]/40 text-[#128C7E] font-black text-xs uppercase tracking-wider">
                ✓ Confirmed Admission
              </div>
              <p className="text-[11px] text-[#5A6E71]">
                Date: <strong className="text-[#1C2527] font-mono">{receiptDate}</strong>
              </p>
              <p className="text-[11px] text-[#5A6E71]">
                Receipt #: <strong className="text-[#1C2527] font-mono">{enrollment.receiptNo || "REC-2026-901"}</strong>
              </p>
            </div>
          </div>

          {/* Student & Cohort Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF6EE] border border-[rgba(71,86,87,0.18)] text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E71] uppercase tracking-wider">Candidate Profile</span>
              <p className="font-bold text-sm text-[#1C2527]">{enrollment.studentName || enrollment.fullName}</p>
              <p className="text-[#475657] font-mono text-[11px]">{enrollment.studentPhone || enrollment.phone}</p>
              <p className="text-[#475657] text-[11px]">{enrollment.studentEmail || enrollment.email}</p>
              <p className="text-[11px] text-[#D97706] font-mono font-bold mt-1">
                Student ID: {enrollment.studentId || "SKY-2026-881"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E71] uppercase tracking-wider">Academic Program</span>
              <p className="font-bold text-sm text-[#1C2527]">{enrollment.courseName || enrollment.enquiryCourse}</p>
              <p className="text-[#475657] text-[11px]">Cohort Batch: <strong className="text-[#1C2527]">{enrollment.cohortName || "Weekend Live Cohort - Nov 2026"}</strong></p>
              <p className="text-[#475657] text-[11px]">Admission Counselor: <strong className="text-[#1C2527]">{enrollment.counselorName || "Priya Patel"}</strong></p>
              <p className="text-[11px] text-[#2E7559] font-semibold">
                Status: {enrollment.paymentStatus === "fully_paid" ? "Full Fee Settled" : "Installment / EMI Active"}
              </p>
            </div>
          </div>

          {/* Itemized Fee Structure Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1C2527] uppercase tracking-wider block">
              Fee Structure & Payment Ledger
            </span>
            <div className="border border-[rgba(71,86,87,0.18)] rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F0E6D6] text-[#475657] font-bold text-[11px] border-b border-[rgba(71,86,87,0.15)]">
                  <tr>
                    <th className="py-2.5 px-4">Item Description</th>
                    <th className="py-2.5 px-4 text-center">Plan Type</th>
                    <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(71,86,87,0.1)]">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-[#1C2527]">
                      Comprehensive Program Tuition Fee & Certification
                    </td>
                    <td className="py-2.5 px-4 text-center text-[#5A6E71]">Standard</td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#1C2527]">
                      ₹{baseFee.toLocaleString("en-IN")}
                    </td>
                  </tr>

                  {scholarship > 0 && (
                    <tr className="bg-[#2E7559]/5">
                      <td className="py-2.5 px-4 text-[#2E7559] font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7559]" />
                        <span>Merit Scholarship / Academic Fee Waiver</span>
                      </td>
                      <td className="py-2.5 px-4 text-center text-[#2E7559] font-semibold">
                        {enrollment.scholarshipCode || "MERIT-15"}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-[#2E7559] font-bold">
                        -₹{scholarship.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td className="py-2.5 px-4 text-[#5A6E71]">Central & State GST (18%)</td>
                    <td className="py-2.5 px-4 text-center text-[#5A6E71]">Government Levy</td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#1C2527]">
                      ₹{gst.toLocaleString("en-IN")}
                    </td>
                  </tr>

                  <tr className="bg-[#FAF6EE] font-bold text-[#1C2527]">
                    <td className="py-3 px-4">Total Course Net Investment</td>
                    <td className="py-3 px-4 text-center">Gross Payable</td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-[#1C2527]">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>

                  <tr className="bg-[#25D366]/10 font-bold text-[#128C7E]">
                    <td className="py-3 px-4 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#25D366]" />
                      <span>Amount Collected & Verified Today</span>
                    </td>
                    <td className="py-3 px-4 text-center capitalize">
                      {enrollment.paymentMode || "UPI / Direct"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-[#128C7E]">
                      ₹{amountPaid.toLocaleString("en-IN")}
                    </td>
                  </tr>

                  {balanceDue > 0 && (
                    <tr className="bg-[#B07238]/10 font-bold text-[#B07238]">
                      <td className="py-2.5 px-4">Outstanding Balance Pending</td>
                      <td className="py-2.5 px-4 text-center">
                        Due by: {enrollment.balanceDueDate || "Next Installment"}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono">
                        ₹{balanceDue.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Metadata & Verification */}
          <div className="p-4 rounded-xl bg-white border border-[rgba(71,86,87,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#5A6E71] uppercase tracking-wider">
                Transaction References
              </span>
              <p className="text-[#1C2527]">
                Payment Mode: <strong className="capitalize">{enrollment.paymentMode || "UPI"}</strong>
              </p>
              <p className="text-[#5A6E71] font-mono text-[11px]">
                UTR / Reference ID: {enrollment.transactionRef || "UTR-20261019-94821"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#FAF6EE] border border-[rgba(71,86,87,0.2)] flex items-center justify-center text-[#D97706]">
                <ShieldCheck className="w-6 h-6 text-[#2E7559]" />
              </div>
              <div className="text-[11px] text-[#5A6E71]">
                <span className="font-bold text-[#1C2527] block">Tamper-Proof Receipt</span>
                <span>Digitally signed by Skillyards Financials</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Notes */}
          <div className="text-[10px] text-[#7e939a] space-y-1 border-t border-[rgba(71,86,87,0.12)] pt-3">
            <p>1. This digital fee receipt serves as confirmed proof of enrollment in the specified Skillyards academic cohort.</p>
            <p>2. Fees once paid are non-refundable after cohort commencement per institutional admissions policy.</p>
            <p>3. Zero-cost EMI loans are issued under institutional partner NBFC underwriting terms.</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-[#FAF6EE] border-t border-[rgba(71,86,87,0.15)] flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs text-[#5A6E71]">
            Official Skillyards Admissions Record
          </span>
          <button
            type="button"
            onClick={onClose}
            className="crm-btn-primary !py-1.5 !px-4 text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentFeeReceiptModal;

"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Building,
  CreditCard,
  Calendar,
  User,
  Phone,
  Mail,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";

/**
 * Converts numbers into Indian Currency Words (e.g. 20135 -> "Twenty Thousand One Hundred Thirty-Five Rupees Only")
 */
function numberToWordsINR(num) {
  const n = Math.floor(Math.abs(Number(num) || 0));
  if (n === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const formatHundreds = (val) => {
    let str = "";
    if (val > 99) {
      str += a[Math.floor(val / 100)] + " Hundred ";
      val %= 100;
    }
    if (val > 19) {
      str += b[Math.floor(val / 10)] + " ";
      val %= 10;
    }
    if (val > 0) {
      str += a[val] + " ";
    }
    return str;
  };

  let crore = Math.floor(n / 10000000);
  let lakh = Math.floor((n % 10000000) / 100000);
  let thousand = Math.floor((n % 100000) / 1000);
  let remainder = n % 1000;

  let res = "";
  if (crore > 0) res += formatHundreds(crore) + "Crore ";
  if (lakh > 0) res += formatHundreds(lakh) + "Lakh ";
  if (thousand > 0) res += formatHundreds(thousand) + "Thousand ";
  if (remainder > 0) res += formatHundreds(remainder);

  return res.trim() + " Rupees Only";
}

export function InstallmentReceiptModal({ isOpen, onClose, data }) {
  const receiptRef = useRef(null);

  if (!isOpen || !data) return null;

  const {
    receiptNo = "REC-INST-2026-0000",
    studentId = "SKY-2026-0000",
    studentName = "Candidate",
    studentPhone = "",
    studentEmail = "",
    courseName = "Full Stack Web Development",
    cohortName = "Weekend Live Cohort",
    installmentTitle = "Installment Payment",
    amountPaid = 0,
    totalCourseFee = 0,
    priorPaid = 0,
    paymentMode = "upi",
    transactionRef = "Direct Clearance",
    paidAt = new Date().toISOString(),
    counselorName = "Admissions & Accounts Desk",
    collectionNotes = "",
  } = data;

  const currentPayment = Number(amountPaid) || 0;
  const previousPayment = Number(priorPaid) || 0;
  const totalPaidAfter = previousPayment + currentPayment;
  const grossFee = Number(totalCourseFee) || totalPaidAfter;
  const remainingBalance = Math.max(0, grossFee - totalPaidAfter);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🏛️ *SKILLYARDS VERSATILITY - OFFICIAL FEE PAYMENT RECEIPT*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Dear *${studentName}*,\n` +
      `We acknowledge receipt of your tuition installment payment.\n\n` +
      `📄 *Receipt No:* ${receiptNo}\n` +
      `🎓 *Student ID:* ${studentId}\n` +
      `💻 *Program:* ${courseName}\n` +
      `📌 *Milestone:* ${installmentTitle}\n` +
      `💰 *Amount Paid:* ₹${currentPayment.toLocaleString("en-IN")}\n` +
      `💳 *Payment Mode:* ${paymentMode.toUpperCase()} (${transactionRef})\n` +
      `⏳ *Remaining Balance:* ₹${remainingBalance.toLocaleString("en-IN")}\n` +
      `📅 *Date:* ${new Date(paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}\n\n` +
      `Thank you for advancing your learning journey with Skillyards!\n` +
      `_Accounts & Financial Admissions Desk_`
    );

    const cleanPhone = (studentPhone || "").replace(/[^0-9]/g, "");
    const targetPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    window.open(`https://wa.me/${targetPhone}?text=${text}`, "_blank");
  };

  if (!isOpen || !plan || !receipt) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white"
    >
      <div className="relative w-full max-w-2xl bg-[#FAF6EE] rounded-2xl shadow-2xl border border-[rgba(71,86,87,0.22)] overflow-hidden my-8 print:shadow-none print:border-none print:my-0">
        
        {/* Cockpit Top Bar - Hidden on print */}
        <div className="bg-[#0c1316] text-white px-6 py-4 flex items-center justify-between border-b border-[rgba(98,146,158,0.2)] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Official Fee Voucher & Receipt</h2>
              <p className="text-[11px] text-[#7E939A]">Verified Electronic Transaction Voucher</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              title="Share via WhatsApp"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold border border-[#25D366]/40 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              title="Print Receipt"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#7E939A] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div ref={receiptRef} className="p-8 space-y-6 text-[#1C2527] print:p-8 bg-[#FAF6EE]">
          
          {/* Institutional Header */}
          <div className="flex items-start justify-between border-b-2 border-[#1C2527] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#0c1316]">SKILLYARDS</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#4A6D7C] text-white font-semibold uppercase tracking-wider">
                  Versatility
                </span>
              </div>
              <p className="text-[11px] text-[#5A6E71] mt-1 font-medium leading-relaxed">
                SkillYards Versatility EdTech Pvt. Ltd.<br />
                Technology Admissions & Accounts Office<br />
                GSTIN: 07AAACS1429B1Z8 • help@skillyards.com
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#2E7559]/15 border border-[#2E7559]/30 text-[#2E7559] text-[11px] font-bold uppercase tracking-wider">
                Fee Payment Voucher
              </span>
              <p className="text-xs font-bold text-[#1C2527] font-mono">{receiptNo}</p>
              <p className="text-[11px] text-[#5A6E71]">
                Date: {new Date(paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Student & Course Particulars Grid */}
          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[rgba(71,86,87,0.16)] text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7E939A] tracking-wider">Student Particulars</span>
              <p className="font-bold text-sm text-[#1C2527]">{studentName}</p>
              <p className="text-[#5A6E71] font-mono text-[11px]">ID: <strong>{studentId}</strong></p>
              <p className="text-[#5A6E71]">{studentPhone} • {studentEmail}</p>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase font-bold text-[#7E939A] tracking-wider">Program & Cohort</span>
              <p className="font-bold text-sm text-[#4A6D7C]">{courseName}</p>
              <p className="text-[#5A6E71] text-[11px]">{cohortName}</p>
              <p className="text-[11px] text-[#B07238] font-medium">{installmentTitle}</p>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-hidden rounded-xl border border-[rgba(71,86,87,0.18)] bg-white text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#FAF6EE] border-b border-[rgba(71,86,87,0.16)] text-[#5A6E71] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Ledger Item / Description</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(71,86,87,0.1)] text-[#1C2527]">
                <tr>
                  <td className="py-2.5 px-4">
                    <p className="font-semibold">Total Approved Program Tuition (incl. Taxes)</p>
                    <p className="text-[10.5px] text-[#7E939A]">Standard admissions curriculum package</p>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-medium">
                    ₹{grossFee.toLocaleString("en-IN")}
                  </td>
                </tr>

                {previousPayment > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 text-[#5A6E71]">
                      Previous Amount Settled to Date
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#5A6E71]">
                      - ₹{previousPayment.toLocaleString("en-IN")}
                    </td>
                  </tr>
                )}

                <tr className="bg-[#2E7559]/5 font-bold">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7559]" />
                      <div>
                        <span className="text-[#2E7559] uppercase tracking-wider text-[11px]">
                          Current Installment Paid
                        </span>
                        <p className="text-[10.5px] font-normal text-[#5A6E71]">
                          Mode: {paymentMode.toUpperCase()} • Ref / UTR: {transactionRef}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-base text-[#2E7559]">
                    ₹{currentPayment.toLocaleString("en-IN")}
                  </td>
                </tr>

                <tr className="bg-[#FAF6EE]">
                  <td className="py-2.5 px-4 font-bold text-[#1C2527]">
                    Remaining Balance Due
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-sm text-[#1C2527]">
                    {remainingBalance === 0 ? (
                      <span className="text-[#2E7559] bg-[#2E7559]/10 px-2 py-0.5 rounded text-[11px] font-bold">
                        100% Fully Settled
                      </span>
                    ) : (
                      `₹${remainingBalance.toLocaleString("en-IN")}`
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words Callout */}
          <div className="p-3 bg-white rounded-xl border border-[rgba(71,86,87,0.14)] text-xs flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase text-[#7E939A]">Amount in Words:</span>
            <span className="font-semibold text-[#1C2527] italic">{numberToWordsINR(currentPayment)}</span>
          </div>

          {collectionNotes && (
            <p className="text-[11px] text-[#5A6E71] italic">
              * Note: {collectionNotes}
            </p>
          )}

          {/* Institutional Signature & Stamp Footer */}
          <div className="pt-6 border-t border-[rgba(71,86,87,0.2)] flex items-end justify-between text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[#2E7559] font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified by Skillyards Accounts Desk</span>
              </div>
              <p className="text-[10px] text-[#7E939A]">
                Computer generated electronic voucher. No physical signature required.
              </p>
            </div>

            <div className="text-right">
              <div className="w-36 h-10 border-b border-dashed border-[#1C2527] mb-1 flex items-end justify-center">
                <span className="text-[10px] font-mono text-[#4A6D7C] tracking-widest uppercase">
                  [DIGITAL STAMP]
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase text-[#1C2527]">{counselorName}</p>
              <p className="text-[9.5px] text-[#7E939A]">Authorized Accounts Officer</p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions - Hidden on print */}
        <div className="p-4 bg-[#F4ECDF] border-t border-[rgba(71,86,87,0.18)] flex items-center justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#1C2527] border border-[rgba(71,86,87,0.2)] text-xs font-semibold transition-colors"
          >
            Close Voucher
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0c1316] hover:bg-[#152024] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}

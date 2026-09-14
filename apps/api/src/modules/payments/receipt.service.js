import * as paymentRepository from "./payment.repository";
import * as studentRepository from "../students/student.repository";
import { installments } from "@repo/db";
import { getStudentLedger } from "./ledger.service";
import { eq, inArray } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, "assets");
const STAMP_PATH = path.join(ASSETS_DIR, "stamp.png");
const LOGO_PATH = path.join(ASSETS_DIR, "logo.png");
const FONT_PATH = path.join(ASSETS_DIR, "NotoSans-Regular.ttf");

let stampBase64 = "";
let logoBase64 = "";
let notoSansBase64 = "";

try {
  if (fs.existsSync(STAMP_PATH)) {
    const stampBuffer = fs.readFileSync(STAMP_PATH);
    stampBase64 = `data:image/png;base64,${stampBuffer.toString("base64")}`;
  }
  if (fs.existsSync(LOGO_PATH)) {
    const logoBuffer = fs.readFileSync(LOGO_PATH);
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  }
  if (fs.existsSync(FONT_PATH)) {
    const fontBuffer = fs.readFileSync(FONT_PATH);
    notoSansBase64 = fontBuffer.toString("base64");
  }
} catch (error) {
  console.error("Error loading receipt assets:", error);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  forcePathStyle: true,
});

export async function getReceiptStream(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  });

  const response = await r2.send(command);

  if (!response.Body) {
    throw new Error("Empty response from R2");
  }

  return response.Body;
}

export async function getPaymentReceipt(db, paymentId) {
  // 1. Fetch root payment record
  const paymentRecord = await paymentRepository.getPaymentById(db, paymentId);
  if (!paymentRecord) throw new Error("Payment not found");

  // 2. Fetch everything else in parallel (Ledger, Student, and Allocations)
  const [ledger, studentRecord, allocationRecords] = await Promise.all([
    getStudentLedger(db, paymentRecord.studentId),
    studentRepository.getStudentById(db, paymentRecord.studentId),
    paymentRepository.getAllocationsByPaymentId(db, paymentId),
  ]);

  // 3. Fetch installment details if needed
  const installmentIds = allocationRecords
    .map((a) => a.installmentId)
    .filter(Boolean);
  const installmentRecords =
    installmentIds.length > 0
      ? await db
          .select()
          .from(installments)
          .where(inArray(installments.id, installmentIds))
      : [];

  const installmentMap = new Map(installmentRecords.map((i) => [i.id, i]));

  const allocationDetails = allocationRecords.map((allocation) => {
    const inst = installmentMap.get(allocation.installmentId);
    return {
      installmentId: allocation.installmentId,
      allocatedAmount: allocation.amount,
      installmentDueDate: inst?.dueDate || null,
      installmentAmountDue: inst?.amountDue || null,
      installmentStatus: inst?.status || null,
    };
  });

  const totalAllocated = allocationRecords.reduce(
    (sum, a) => sum + a.amount,
    0,
  );
  const unallocatedAmount = paymentRecord.amount - totalAllocated;

  return {
    paymentId: paymentRecord.id,
    paymentAmount: paymentRecord.amount,
    paymentMethod: paymentRecord.method,
    paymentNote: paymentRecord.note,
    paymentDate: paymentRecord.createdAt,
    studentDetails: {
      studentId: studentRecord.id,
      studentName: studentRecord.name,
      studentEmail: studentRecord.email,
      studentPhone: studentRecord.phone,
      enrolledCourse: studentRecord.courseName || "General Course",
    },
    allocationBreakdown: allocationDetails,
    totalAllocated,
    unallocatedAmount,
    ledgerSnapshot: ledger,
    receiptKey: paymentRecord.receiptKey,
    receiptStatus: paymentRecord.receiptStatus,
    receiptVersion: paymentRecord.receiptVersion,
    receiptNumber: paymentRecord.receiptNumber,
  };
}

export function generateReceiptHTML(receiptData) {
  const {
    paymentId,
    paymentAmount,
    paymentMethod,
    paymentDate,
    studentDetails,
    allocationBreakdown,
    ledgerSnapshot,
    receiptNumber,
  } = receiptData;

  const formatCurrency = (amount) =>
    `&#8377;${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const isFullyPaid = ledgerSnapshot.pending === 0;
  const allocatedInstallments = allocationBreakdown.filter(
    (a) => a.installmentId,
  );
  const allAllocatedInstallmentsPaid =
    allocatedInstallments.length > 0 &&
    allocatedInstallments.every((a) => a.installmentStatus === "paid");

  let statusText, statusColor, statusBg;
  if (isFullyPaid) {
    statusText = "PAID IN FULL";
    statusColor = "#059669";
    statusBg = "#ecfdf5";
  } else if (allAllocatedInstallmentsPaid) {
    statusText = "INSTALLMENT PAID";
    statusColor = "#059669";
    statusBg = "#ecfdf5";
  } else {
    statusText = "PARTIAL PAYMENT";
    statusColor = "#d97706";
    statusBg = "#fffbeb";
  }

  const allocationRows = allocationBreakdown
    .map((alloc) => {
      const isInstallment = !!alloc.installmentDueDate;
      return `
        <tr class="table-row">
          <td>
            <p class="item-title">${isInstallment ? "Scheduled Installment" : "General Course Fees"}</p>
            <p class="item-desc">${isInstallment ? `Due: ${formatDate(alloc.installmentDueDate)}` : "Tuition &amp; Lab Access"}</p>
          </td>
          <td class="text-right item-value">${formatCurrency(isInstallment && alloc.installmentAmountDue ? alloc.installmentAmountDue : alloc.allocatedAmount)}</td>
        </tr>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt_${paymentId.slice(-8).toUpperCase()}</title>
        <style>
          ${
            notoSansBase64
              ? `@font-face {
            font-family: 'Noto Sans';
            src: url('data:font/truetype;base64,${notoSansBase64}') format('truetype');
            font-weight: 100 900;
            font-style: normal;
            unicode-range: U+20B9;
          }`
              : ""
          }

          :root {
            --blue-900: #1e3a8a;
            --blue-700: #1d4ed8;
            --blue-500: #3b82f6;
            --blue-300: #93c5fd;
            --blue-100: #dbeafe;
            --blue-50:  #eff6ff;
            --bg-canvas: #e8f0fe;
            --bg-paper:  #ffffff;
            --text-primary:   #0f172a;
            --text-secondary: #475569;
            --text-tertiary:  #94a3b8;
            --border-blue:    #bfdbfe;
            --border-dark:    #1d4ed8;
          }

          * { box-sizing: border-box; margin: 0; padding: 0; }

          body {
            font-family: 'Noto Sans', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: var(--bg-canvas);
            color: var(--text-primary);
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
          }

          .document-wrapper {
            width: 100%;
            max-width: 794px;
            min-height: 1123px;
            background: var(--bg-paper);
            box-shadow: 0 24px 48px -12px rgba(30,58,138,0.12), 0 0 0 1px var(--border-blue);
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          /* ── Blue top accent bar ── */
          .top-bar {
            background: linear-gradient(90deg, var(--blue-900) 0%, var(--blue-700) 60%, var(--blue-500) 100%);
            height: 6px;
            flex-shrink: 0;
          }

          .inner-wrapper {
            padding: 48px 60px 40px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          /* ── Header ── */
          .header-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 28px;
            margin-bottom: 28px;
            border-bottom: 2px solid var(--blue-100);
          }

          .brand-col img {
            height: 48px;
            margin-bottom: 14px;
            display: block;
          }

          .corp-details {
            font-size: 11px;
            color: var(--text-secondary);
            line-height: 1.7;
          }

          .corp-details strong {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 12px;
          }

          .meta-col { text-align: right; }

          .document-title {
            font-size: 30px;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: var(--blue-700);
            margin-bottom: 6px;
          }

          .receipt-id {
            font-family: ui-monospace, SFMono-Regular, monospace;
            font-size: 11px;
            letter-spacing: 0.06em;
            color: var(--text-tertiary);
            background: var(--blue-50);
            border: 1px solid var(--border-blue);
            border-radius: 4px;
            padding: 4px 10px;
            display: inline-block;
          }

          /* ── Status band ── */
          .verification-band {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--blue-50);
            border: 1px solid var(--border-blue);
            border-radius: 6px;
            padding: 14px 20px;
            margin-bottom: 28px;
          }

          .label-micro {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--blue-700);
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 5px 14px;
            background-color: ${statusBg};
            color: ${statusColor};
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.06em;
            border-radius: 20px;
            border: 1px solid ${statusColor}33;
          }

          /* ── Billing info cards ── */
          .billing-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 28px;
          }

          .info-card {
            background: var(--blue-50);
            border: 1px solid var(--border-blue);
            border-radius: 8px;
            padding: 18px 20px;
          }

          .info-card .card-label {
            font-size: 9.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: var(--blue-700);
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-blue);
            display: block;
          }

          .entity-name {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: -0.01em;
            margin-bottom: 6px;
            color: var(--text-primary);
          }

          .entity-data {
            font-size: 12.5px;
            color: var(--text-secondary);
            margin-bottom: 4px;
            line-height: 1.55;
          }

          .entity-data strong {
            color: var(--text-primary);
            font-weight: 600;
            margin-right: 4px;
          }

          /* ── Items table card ── */
          .table-card {
            border: 1px solid var(--border-blue);
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 20px;
          }

          .table-card-header {
            background: var(--blue-700);
            padding: 10px 18px;
            display: flex;
            justify-content: space-between;
          }

          .table-card-header span {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #bfdbfe;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          .text-right { text-align: right; }

          .table-row td {
            padding: 14px 18px;
            border-bottom: 1px solid var(--blue-100);
            vertical-align: top;
          }

          .table-row:last-child td { border-bottom: none; }

          .table-row:nth-child(even) td { background: var(--blue-50); }

          .item-title {
            font-size: 13.5px;
            font-weight: 500;
            margin-bottom: 3px;
            color: var(--text-primary);
          }

          .item-desc {
            font-size: 11.5px;
            color: var(--text-secondary);
          }

          .item-value {
            font-size: 14px;
            font-weight: 600;
            color: var(--blue-700);
          }

          /* ── Summary block ── */
          .summary-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 28px;
          }

          .summary-block {
            width: 300px;
            border: 1px solid var(--border-blue);
            border-radius: 8px;
            overflow: hidden;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 16px;
            font-size: 13px;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--blue-100);
          }

          .summary-row:last-child { border-bottom: none; }

          .summary-row.total-row {
            background: var(--blue-700);
            font-size: 15px;
            font-weight: 700;
            color: #ffffff;
          }

          .summary-row.total-row span:last-child { color: #bfdbfe; }

          /* ── Footer ── */
          .footer-section {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 28px;
          }

          .terms {
            font-size: 12px;
            color: var(--text-tertiary);
            max-width: 400px;
            line-height: 1.6;
          }

          .terms strong {
            color: var(--text-secondary);
            font-weight: 600;
            display: block;
            margin-bottom: 4px;
          }

          /* ── Signature + Stamp ── */
          .signature-container {
            position: relative;
            width: 300px;
            text-align: right;
          }

          .sig-stamp {
            position: absolute;
            bottom: -24px;
            right: 30px;
            width: 200px;
            opacity: 0.85;
            z-index: 10;
          }

          .signature-box {
            text-align: right;
          }

          .sig-line {
            height: 40px;
            border-bottom: 1.5px solid var(--blue-700);
            margin-bottom: 10px;
          }

          .sig-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 3px;
            color: var(--text-primary);
          }

          .sig-title {
            font-size: 12.5px;
            color: var(--text-secondary);
          }

          /* ── Print ── */
          @media print {
            @page { size: A4 portrait; margin: 0; }
            body { background: white; padding: 0; display: block; }
            .document-wrapper {
              box-shadow: none;
              border: none;
              border-radius: 0;
              width: 210mm;
              height: 297mm;
              min-height: auto;
              max-width: none;
              margin: 0;
              overflow: hidden;
            }
            .inner-wrapper { padding: 12mm 18mm; }
            * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
          }

          /* ── Mobile ── */
          @media (max-width: 768px) {
            body { padding: 12px; }
            .inner-wrapper { padding: 24px 18px; }
            .header-grid { flex-direction: column; gap: 18px; }
            .meta-col { text-align: left; }
            .billing-grid { grid-template-columns: 1fr; }
            .summary-wrapper { justify-content: flex-start; }
            .summary-block { width: 100%; }
            .footer-section { flex-direction: column; gap: 28px; align-items: flex-start; }
            .signature-container { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="document-wrapper">
          <div class="top-bar"></div>
          <div class="inner-wrapper">

            <!-- Header -->
            <div class="header-grid">
              <div class="brand-col">
                <img src="${logoBase64}" alt="Skillyards Versatility Pvt. Ltd.">
                <div class="corp-details">
                  <strong>Skillyards Versatility Pvt. Ltd.</strong><br>
                  A-3, New Agra Behind Manoj Dhaba<br>
                  Bhagwan Talkies Crossing, Indra Puri<br>
                  Agra, Uttar Pradesh - 282005<br>
                  GSTIN: 09ABMCS4605B1ZF<br>
                  support@skillyards.in &nbsp;|&nbsp; +91 70601 00561
                </div>
              </div>
              <div class="meta-col">
                <h1 class="document-title">RECEIPT</h1>
                <div class="receipt-id">Receipt No: ${receiptNumber || paymentId.slice(-8).toUpperCase()}</div>
              </div>
            </div>

            <!-- Status -->
            <div class="verification-band">
              <span class="label-micro">Payment Status</span>
              <div class="status-badge">${statusText}</div>
            </div>

            <!-- Billing cards -->
            <div class="billing-grid">
              <div class="info-card">
                <span class="card-label">Billed To Student</span>
                <p class="entity-data"><strong>Name:</strong> ${studentDetails.studentName}</p>
                <p class="entity-data"><strong>Email:</strong> ${studentDetails.studentEmail}</p>
                <p class="entity-data"><strong>Phone:</strong> ${studentDetails.studentPhone || "Unlisted"}</p>
              </div>
              <div class="info-card">
                <span class="card-label">Payment Details</span>
                <p class="entity-data"><strong>Date:</strong> ${formatDate(paymentDate)}</p>
                <p class="entity-data"><strong>Method:</strong> ${paymentMethod}</p>
                <p class="entity-data"><strong>Ref ID:</strong> <span style="font-size: 10px; opacity: 0.7;">${paymentId}</span></p>
                <p class="entity-data"><strong>Enrolled Course:</strong> ${studentDetails.enrolledCourse}</p>
              </div>
            </div>

            <!-- Items table -->
            <div class="table-card">
              <div class="table-card-header">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <table>
                <tbody>
                  ${allocationRows}
                </tbody>
              </table>
            </div>

            <!-- Summary -->
            <div class="summary-wrapper">
              <div class="summary-block">
                ${(() => {
                  const installmentTotal = allocationBreakdown.reduce(
                    (sum, a) =>
                      sum + (a.installmentAmountDue || a.allocatedAmount),
                    0,
                  );
                  const showInstallmentTotal =
                    installmentTotal !== receiptData.paymentAmount;
                  return `
                  ${
                    showInstallmentTotal
                      ? `<div class="summary-row">
                    <span>Installment Total</span>
                    <span>${formatCurrency(installmentTotal)}</span>
                  </div>`
                      : ""
                  }
                  ${
                    receiptData.unallocatedAmount > 0
                      ? `<div class="summary-row">
                    <span>Unallocated</span>
                    <span>${formatCurrency(receiptData.unallocatedAmount)}</span>
                  </div>`
                      : ""
                  }
                  <div class="summary-row total-row">
                    <span>Amount Paid</span>
                    <span>${formatCurrency(receiptData.paymentAmount)}</span>
                  </div>`;
                })()}
              </div>
            </div>

            <!-- Footer -->
            <div class="footer-section">
              <div class="terms">
                <strong>Terms &amp; Conditions</strong>
                Fees once paid are non-refundable. This is a system-generated receipt; for discrepancies contact the admin desk within 48 hours.
              </div>
              <div class="signature-container">
                ${stampBase64 ? `<img src="${stampBase64}" class="sig-stamp" alt="Company Stamp">` : ""}
                <div class="signature-box">
                  <div class="sig-line"></div>
                  <p class="sig-name">Chief Executive Officer</p>
                  <p class="sig-title">Skillyards Versatility Pvt. Ltd.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

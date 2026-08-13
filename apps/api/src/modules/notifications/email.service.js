import { getResend } from "./resend.client";
import { db, settings } from "@repo/db";
import { eq } from "drizzle-orm";
import {
  adminEnquiryTemplate,
  userConfirmationTemplate,
  receiptEmailTemplate,
  eodReportTemplate,
  eodAllTeamsTemplate,
  passwordResetTemplate,
  eodWarningTemplate,
  leaveNotificationTemplate,
  leaveStatusTemplate,
} from "./email.template.js";

export async function isEmailEnabled(key) {
  try {
    const [row] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return row ? row.value !== false : true;
  } catch (error) {
    console.error("Failed to read email feature flag:", error);
    return true;
  }
}

async function isFeatureEnabled(...keys) {
  for (const key of keys) {
    if (!(await isEmailEnabled(key))) return false;
  }
  return true;
}

function withResend(fn) {
  return async (...args) => {
    if (!(await isFeatureEnabled("emails_feature"))) {
      console.warn("Skipping email — emails_feature is disabled");
      return;
    }
    const resend = getResend();
    if (!resend) {
      console.warn("Skipping email — Resend not configured");
      return;
    }
    const result = await fn(resend, ...args);
    
    if (Array.isArray(result)) {
      const error = result.find(r => r?.error)?.error;
      if (error) throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    } else if (result?.error) {
      throw new Error(`Resend API error: ${JSON.stringify(result.error)}`);
    }
    
    return result;
  };
}

/**
 * Notify company staff about new enquiry
 */
export const sendAdminEnquiryNotification = withResend((resend, enquiry) => {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [process.env.ADMIN_EMAIL],
    reply_to: enquiry.email,
    subject: "New enquiry from Skillyards website",
    html: adminEnquiryTemplate(enquiry)
  });
});

/**
 * Send confirmation email to the user
 */
export const sendUserConfirmation = withResend((resend, enquiry) => {
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [enquiry.email],
    subject: "We received your enquiry",
    html: userConfirmationTemplate(enquiry)
  });
});

/**
 * Local test email
 */
export const sendTestEmail = withResend((resend) => {
  return resend.emails.send({
    from: "Skillyards <admin@skillyards.in>",
    to: ["staff@skillyards.in"],
    subject: "Skillyards Email Test",
    html: `
      <h2>Email system working</h2>
      <p>This confirms your production email setup is working.</p>
      <p>Time: ${new Date().toISOString()}</p>
    `
  });
});

/**
 * Send receipt email with PDF attachment
 */
export const sendReceiptEmail = withResend((resend, { to, studentName, receiptNumber, pdfBuffer }) => {
  const from = process.env.EMAIL_FROM || "Skillyards <admin@skillyards.in>";
  const subject = `Payment Receipt: ${receiptNumber || "Skillyards"}`;
  const attachments = [
    {
      filename: `receipt-${receiptNumber || "payment"}.pdf`,
      content: pdfBuffer,
    },
  ];

  // 1. Send to Student
  const studentEmailPromise = resend.emails.send({
    from,
    to: [to],
    subject,
    html: receiptEmailTemplate({ studentName, receiptNumber, isAdmin: false }),
    attachments,
  });

  // 2. Send to Admin (if configured)
  if (process.env.ADMIN_EMAIL) {
    const adminEmailPromise = resend.emails.send({
      from,
      to: [process.env.ADMIN_EMAIL],
      subject: `[Admin Copy] ${subject}`,
      html: receiptEmailTemplate({ studentName, receiptNumber, isAdmin: true }),
      attachments,
    });

    return Promise.all([studentEmailPromise, adminEmailPromise]);
  }

  return studentEmailPromise;
});

/**
 * Send EOD report email to a specific recipient
 */
export const sendEodReportEmail = withResend(async (resend, { to, bcc, team, date, reports, missingUsers, adminUrl }) => {
  if (!(await isFeatureEnabled("eod_emails_feature"))) {
    console.warn("Skipping EOD email — eod_emails_feature is disabled");
    return;
  }
  const from = process.env.EMAIL_FROM || "Skillyards <admin@skillyards.in>";
  const TEAM_LABELS = {
    sales: "Sales",
    tech: "Tech",
    hr: "HR",
    ceo_office: "CEO Office",
    admin_head: "Admin Head",
    marketing: "Marketing",
    outside_sales: "Outside Sales",
  };
  const subject = `EOD Report — ${TEAM_LABELS[team] || team} — ${date}`;

  const payload = {
    from,
    to: [to],
    subject,
    html: eodReportTemplate({ team, date, reports, missingUsers, adminUrl }),
  };
  if (bcc && bcc.length > 0) payload.bcc = bcc;

  return resend.emails.send(payload);
});

/**
 * Send EOD missing warning email to user
 */
export const sendEodWarningEmail = withResend(async (resend, { to, userName, date, adminUrl }) => {
  if (!(await isFeatureEnabled("eod_emails_feature"))) {
    console.warn("Skipping EOD email — eod_emails_feature is disabled");
    return;
  }
  const from = process.env.EMAIL_FROM || "Skillyards <admin@skillyards.in>";
  
  return resend.emails.send({
    from,
    to: [to],
    subject: `Action Required: Missing EOD Report — ${date}`,
    html: eodWarningTemplate({ userName, date, adminUrl }),
  });
});

/**
 * Send combined EOD report (all teams) to a single recipient
 */
export const sendEodAllTeamsEmail = withResend(async (resend, { to, date, teamSummaries, adminUrl }) => {
  if (!(await isFeatureEnabled("eod_emails_feature"))) {
    console.warn("Skipping EOD email — eod_emails_feature is disabled");
    return;
  }
  const from = process.env.EMAIL_FROM || "Skillyards <admin@skillyards.in>";
  const subject = `All Teams EOD Report — ${date}`;

  return resend.emails.send({
    from,
    to: [to],
    subject,
    html: eodAllTeamsTemplate({ date, teamSummaries, adminUrl }),
  });
});

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = withResend((resend, { to, resetLink }) => {
  const from = process.env.EMAIL_FROM || "Skillyards <admin@skillyards.in>";

  return resend.emails.send({
    from,
    to: [to],
    subject: "Reset Your Skillyards Password",
    html: passwordResetTemplate({ resetLink }),
  });
});

/**
 * Notify HR and Admin about a new leave application
 */
export const sendLeaveNotification = withResend((resend, { to, recipientName, leave }) => {
  const from = process.env.EMAIL_FROM || "Skillyards <admin@skillyards.in>";
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://admin.skillyards.in"}/leaves`;

  return resend.emails.send({
    from,
    to: [to],
    subject: `Leave request: ${leave.applicantName} — ${leave.type}`,
    html: leaveNotificationTemplate({ ...leave, adminUrl }),
  });
});

/**
 * Notify applicant that their leave was approved or rejected
 */
export const sendLeaveStatusNotification = withResend((resend, { to, applicantName, type, startDate, endDate, isHalfDay, halfDayPeriod, status, approvedByName, rejectionReason }) => {
  const from = process.env.EMAIL_FROM || "Skillyards <admin@skillyards.in>";
  const action = status === "APPROVED" ? "approved" : "rejected";

  return resend.emails.send({
    from,
    to: [to],
    subject: `Leave ${action}: ${applicantName} — ${type}`,
    html: leaveStatusTemplate({ applicantName, type, startDate, endDate, isHalfDay, halfDayPeriod, status, approvedByName, rejectionReason }),
  });
});
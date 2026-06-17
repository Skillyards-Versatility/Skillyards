import { getResend } from "./resend.client";
import {
  adminEnquiryTemplate,
  userConfirmationTemplate,
  receiptEmailTemplate
} from "./email.template";

function withResend(fn) {
  return async (...args) => {
    const resend = getResend();
    if (!resend) {
      console.warn("Skipping email — Resend not configured");
      return;
    }
    return fn(resend, ...args);
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
const LOGO_URL = "https://raw.githubusercontent.com/skillyards/.github/be315000f3f0e8efe5b2f92eb5cf2e00fdf22579/skillyards-dark.svg#gh-dark-mode-only";

const TEAM_LABELS = {
  sales: "Sales Team",
  tech: "Tech Team",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
  marketing: "Marketing",
  outside_sales: "Outside Sales",
};

const SALES_FIELDS = [
  { key: "dialedCalls", label: "Dialed Calls" },
  { key: "connectedCalls", label: "Connected Calls" },
  { key: "counsellingVirtual", label: "Counselling (Virtual)" },
  { key: "counsellingWalkin", label: "Counselling (Walk-in)" },
  { key: "sessionBooked", label: "Sessions Booked" },
  { key: "admissionRegistration", label: "Admissions / Registrations" },
  { key: "admissionProjection", label: "Admission Projection" },
];

const TECH_FIELDS = [
  { key: "classesTaken", label: "Classes Taken" },
  { key: "projectsWorkedOn", label: "Projects Worked On" },
  { key: "bugsFixed", label: "Bugs Fixed" },
  { key: "deploymentsDone", label: "Deployments Done" },
];

const HR_FIELDS = [
  { key: "interviewsConducted", label: "Interviews Conducted" },
  { key: "hires", label: "Hires" },
  { key: "attrition", label: "Attrition" },
  { key: "policiesNotes", label: "Policies / Notes" },
];

const CEO_FIELDS = [
  { key: "keyPriorities", label: "Key Priorities" },
  { key: "decisionsMade", label: "Decisions Made" },
  { key: "escalations", label: "Escalations" },
];

const ADMIN_FIELDS = [
  { key: "tasksCompleted", label: "Tasks Completed" },
  { key: "expenses", label: "Expenses" },
  { key: "vendorPayments", label: "Vendor Payments" },
  { key: "facilityIssues", label: "Facility Issues" },
];

const MARKETING_FIELDS = [
  { key: "leadsGenerated", label: "Leads Generated" },
  { key: "contentPieces", label: "Content Pieces" },
  { key: "campaignsActive", label: "Active Campaigns" },
  { key: "socialMediaPosts", label: "Social Media Posts" },
  { key: "websiteVisits", label: "Website Visits" },
];

const OUTSIDE_SALES_FIELDS = [
  { key: "dialedCalls", label: "Dialed Calls" },
  { key: "connectedCalls", label: "Connected Calls" },
  { key: "meetingsScheduled", label: "Meetings Scheduled" },
  { key: "meetingsDone", label: "Meetings Done" },
  { key: "siteVisits", label: "Site Visits" },
  { key: "leadsCollected", label: "Leads Collected" },
];

const TEAM_FIELDS = {
  sales: SALES_FIELDS,
  tech: TECH_FIELDS,
  hr: HR_FIELDS,
  ceo_office: CEO_FIELDS,
  admin_head: ADMIN_FIELDS,
  marketing: MARKETING_FIELDS,
  outside_sales: OUTSIDE_SALES_FIELDS,
};

function cellStyle(isHeader = false, isZebra = false) {
  const base = "padding:12px 16px;text-align:left;font-size:14px;border-bottom:1px solid #e2e8f0;";
  if (isHeader) {
    return base + "background:linear-gradient(to right, #f8fafc, #f1f5f9);color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;font-size:11px;";
  }
  const bg = isZebra ? "background:#fafafa;" : "background:#ffffff;";
  return base + bg + "color:#1e293b;";
}

function renderValue(val) {
  if (val === undefined || val === null || val === "") return "<span style='color:#cbd5e1;'>—</span>";
  if (!isNaN(val) && typeof val !== 'boolean') {
    return `<span style="display:inline-block;padding:2px 8px;background:#e0f2fe;color:#0369a1;border-radius:12px;font-size:12px;font-weight:600;border:1px solid #bae6fd;">${val}</span>`;
  }
  return val;
}

function renderReportTable(reports, team) {
  const fields = TEAM_FIELDS[team] || [];
  if (!reports.length || !fields.length) return "<p style='color:#94a3b8;font-size:13px;font-style:italic;'>No submissions today.</p>";

  let html = '<div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05);margin:20px 0;">';
  html += '<table style="width:100%;border-collapse:collapse;">';

  // Header
  html += "<thead><tr>";
  html += `<th style="${cellStyle(true)}">Name</th>`;
  for (const f of fields) {
    html += `<th style="${cellStyle(true)}">${f.label}</th>`;
  }
  html += "</tr></thead>";

  // Body
  html += "<tbody>";
  reports.forEach((report, index) => {
    const isZebra = index % 2 === 1;
    html += "<tr>";
    html += `<td style="${cellStyle(false, isZebra)}"><b style="color:#0f172a;">${report.userName}</b></td>`;
    for (const f of fields) {
      const val = report.data?.[f.key];
      html += `<td style="${cellStyle(false, isZebra)}">${renderValue(val)}</td>`;
    }
    html += "</tr>";
  });
  html += "</tbody></table></div>";

  // Notes
  const notesReports = reports.filter((r) => r.data?.notes);
  if (notesReports.length > 0) {
    html += '<div style="margin-top:24px;">';
    html += '<p style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;margin:0 0 12px;">Notes & Updates</p>';
    for (const r of notesReports) {
      html += `<div style="background:#ffffff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 2px 4px rgba(0,0,0,0.02);border:1px solid #e2e8f0;border-left:4px solid #0ea5e9;">`;
      html += `<p style="font-size:13px;color:#0f172a;margin:0 0 6px;font-weight:700;">
        <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:#e0f2fe;color:#0369a1;text-align:center;line-height:24px;font-size:10px;margin-right:8px;vertical-align:middle;">${r.userName.charAt(0)}</span>
        ${r.userName}
      </p>`;
      html += `<p style="font-size:14px;color:#475569;margin:0;line-height:1.6;padding-left:32px;">${r.data.notes}</p>`;
      html += "</div>";
    }
    html += "</div>";
  }

  return html;
}

export function adminEnquiryTemplate(enquiry) {
  const year = new Date().getFullYear();
  const fullName = `${enquiry.firstName} ${enquiry.lastName || ""}`.trim();
  const uniqueId = Date.now();

  return `
  <div style="background:#f1f5f9;padding:2rem;font-family:Arial,sans-serif;">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

      <div style="background:#0f172a;padding:24px;text-align:center;">
        <img src="${LOGO_URL}" style="max-width:180px; height:auto; display:block; margin:auto;" alt="Skillyards" />
      </div>

      <div style="padding:24px 28px 0;">
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin:0 0 12px;font-weight:600;">Contact details</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
          <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0;">
            <p style="font-size:11px;color:#94a3b8;margin:0 0 3px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Full name</p>
            <p style="font-size:14px;font-weight:600;color:#1e293b;margin:0;">${fullName}</p>
          </div>
          <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0;">
            <p style="font-size:11px;color:#94a3b8;margin:0 0 3px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Phone</p>
            <p style="font-size:14px;font-weight:600;color:#1e293b;margin:0;">${enquiry.phone || "Not provided"}</p>
          </div>
          <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0;grid-column:1/-1;">
            <p style="font-size:11px;color:#94a3b8;margin:0 0 3px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Email</p>
            <a href="mailto:${enquiry.email}" style="font-size:14px;font-weight:600;color:#635ee7;text-decoration:none;display:block;">${enquiry.email}</a>
          </div>
        </div>

        <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin:0 0 10px;font-weight:600;">Message</p>
        <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;border-left:3px solid #635ee7;margin-bottom:24px;">
          <p style="font-size:14px;color:#1e293b;line-height:1.7;margin:0;">${enquiry.message}</p>
        </div>

        <div style="margin-bottom:28px;">
          <a href="mailto:${enquiry.email}" style="display:block;text-align:center;padding:12px 0;background:#635ee7;color:#ffffff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">Reply to enquiry</a>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding:16px 28px;background:#f8fafc;">
        <p style="text-align:center;font-size:11px;color:#94a3b8;margin:0;">Automated alert from Skillyards · © ${year} · Ref: ${uniqueId}</p>
      </div>
    </div>
  </div>
  `;
}

export function receiptEmailTemplate({ studentName, receiptNumber, isAdmin = false }) {
  const year = new Date().getFullYear();

  const title = isAdmin ? "Receipt Copy (Admin)" : "Payment Receipt";
  const greeting = isAdmin ? "Hi Admin," : `Hi ${studentName},`;
  const body = isAdmin 
    ? `This is a copy of the payment receipt <b>${receiptNumber || ""}</b> sent to <b>${studentName}</b>.`
    : `Please find attached your payment receipt <b>${receiptNumber || ""}</b>. Thank you for your payment!`;

  return `
  <div style="background:#f1f5f9;padding:2rem;font-family:Arial,sans-serif;">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:#0f172a;padding:24px;text-align:center;">
        <img src="${LOGO_URL}" style="max-width:180px; height:auto; display:block; margin:auto;" alt="Skillyards" />
      </div>

      <div style="padding:28px 28px 24px;">
        <h1 style="font-size:20px;color:#1e293b;margin:0 0 12px;">${title}</h1>
        <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
          ${greeting}<br><br>
          ${body}
        </p>
        
        ${!isAdmin ? `
        <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;border-left:3px solid #635ee7;margin-bottom:28px;">
          <p style="font-size:13px;color:#1e293b;line-height:1.6;margin:0;">
            If you have any questions regarding this receipt, please contact us at <a href="mailto:support@skillyards.in" style="color:#635ee7;text-decoration:none;">support@skillyards.in</a>.
          </p>
        </div>
        ` : ""}
      </div>

      <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 28px;text-align:center;">
        <p style="font-size:11px;color:#94a3b8;margin:0;">© ${year} Skillyards. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
}

export function userConfirmationTemplate(enquiry) {
  const year = new Date().getFullYear();
  const uniqueId = Date.now();

  return `
  <div style="background:#f1f5f9;padding:2rem;font-family:Arial,sans-serif;">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

      <div style="background:#0f172a;padding:24px;text-align:center;">
        <img src="${LOGO_URL}" style="max-width:180px; height:auto; display:block; margin:auto;" alt="Skillyards" />
      </div>

      <div style="padding:28px 28px 0;">
        <h1 style="font-size:20px;color:#1e293b;margin:0 0 12px;">Hi ${enquiry.firstName} 👋</h1>
        <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
          Thanks for reaching out! We've received your enquiry and our team will get back to you within <b>24-48 hours</b>.
        </p>

        <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin:0 0 12px;font-weight:600;">Enquiry Summary</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">
          <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0;">
            <p style="font-size:11px;color:#94a3b8;margin:0 0 3px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Response Time</p>
            <p style="font-size:14px;font-weight:600;color:#1e293b;margin:0;">24-48 Hours</p>
          </div>
          <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0;">
             <p style="font-size:11px;color:#94a3b8;margin:0 0 3px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Status</p>
            <p style="font-size:14px;font-weight:600;color:#1e293b;margin:0;">Received</p>
          </div>
        </div>

        <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin:0 0 10px;font-weight:600;">Your Message</p>
        <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;border-left:3px solid #635ee7;margin-bottom:28px;">
          <p style="font-size:14px;color:#1e293b;line-height:1.7;margin:0;">${enquiry.message}</p>
        </div>
      </div>

      <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 28px;text-align:center;">
        <p style="font-size:12px;color:#94a3b8;margin:0 0 16px;">Stay connected with us</p>
        <div style="margin-bottom:20px;">
            <a href="https://linkedin.com/company/skillyards" style="display:inline-block;margin:0 5px;text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/32/145/145807.png" width="24" height="24" alt="LinkedIn">
            </a>
            <a href="https://instagram.com/skillyards_eduhub" style="display:inline-block;margin:0 5px;text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/32/174/174855.png" width="24" height="24" alt="Instagram">
            </a>
            <a href="https://facebook.com/skillyardss" style="display:inline-block;margin:0 5px;text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/32/5968/5968764.png" width="24" height="24" alt="Facebook">
            </a>
        </div>
        <p style="font-size:11px;color:#94a3b8;margin:0;">© ${year} Skillyards. All rights reserved. · Ref: ${uniqueId}</p>
      </div>
    </div>
  </div>
  `;
}

export function eodReportTemplate({ team, date, reports, missingUsers = [], adminUrl }) {
  const year = new Date().getFullYear();
  const teamLabel = TEAM_LABELS[team] || team;
  const submittedCount = reports.length;

  let missingHtml = "";
  if (missingUsers.length > 0) {
    missingHtml = `
      <div style="margin-top:32px;background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;">
        <h3 style="margin:0 0 12px;font-size:15px;color:#991b1b;display:flex;align-items:center;">
          <span style="margin-right:8px;font-size:18px;">⚠️</span> Missing Submissions (${missingUsers.length})
        </h3>
        <ul style="margin:0;padding-left:24px;color:#b91c1c;font-size:14px;line-height:1.6;">
          ${missingUsers.map(u => `<li><b>${u.name}</b> (${u.email})</li>`).join("")}
        </ul>
      </div>
    `;
  }

  return `
  <div style="background:#f8fafc;background-image:radial-gradient(#e2e8f0 1px, transparent 1px);background-size:20px 20px;padding:2rem;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:760px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">

      <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);padding:28px;text-align:center;border-bottom:1px solid #334155;">
        <img src="${LOGO_URL}" style="max-width:180px;height:auto;display:block;margin:auto;" alt="Skillyards" />
      </div>

      <div style="padding:32px 32px 0;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
          <div>
            <h1 style="font-size:22px;color:#0f172a;margin:0 0 6px;font-weight:800;">EOD Report</h1>
            <p style="font-size:14px;color:#64748b;margin:0;font-weight:500;">${teamLabel} — <span style="color:#0ea5e9;">${date}</span></p>
          </div>
          <div style="background:linear-gradient(to right, #0ea5e9, #0284c7);color:#ffffff;font-size:12px;font-weight:700;padding:8px 16px;border-radius:24px;box-shadow:0 4px 6px -1px rgba(14, 165, 233, 0.2);">
            ${submittedCount} submitted
          </div>
        </div>

        ${renderReportTable(reports, team)}
        
        ${missingHtml}

        <div style="margin:32px 0;">
          <a href="${adminUrl}/eod/history?date=${date}&team=${team}" style="display:block;text-align:center;padding:14px 0;background:linear-gradient(to right, #0ea5e9, #0284c7);color:#ffffff;font-size:15px;font-weight:600;border-radius:12px;text-decoration:none;box-shadow:0 4px 6px -1px rgba(14, 165, 233, 0.3);">
            View Full Report in Dashboard
          </a>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding:20px 32px;background:#f8fafc;">
        <p style="text-align:center;font-size:12px;color:#94a3b8;margin:0;font-weight:500;">Automated EOD Report · Skillyards · © ${year}</p>
      </div>
    </div>
  </div>
  `;
}

export function passwordResetTemplate({ resetLink }) {
  const year = new Date().getFullYear();

  return `
  <div style="background:#f1f5f9;padding:2rem;font-family:Arial,sans-serif;">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

      <div style="background:#0f172a;padding:24px;text-align:center;">
        <img src="${LOGO_URL}" style="max-width:180px;height:auto;display:block;margin:auto;" alt="Skillyards" />
      </div>

      <div style="padding:28px 28px 0;">
        <h1 style="font-size:20px;color:#1e293b;margin:0 0 12px;">Reset Your Password</h1>
        <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 24px;">
          We received a request to reset the password for your Skillyards account. Click the button below to set a new password.
        </p>

        <div style="margin:24px 0;">
          <a href="${resetLink}" style="display:block;text-align:center;padding:12px 0;background:#635ee7;color:#ffffff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">Reset Password</a>
        </div>

        <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;border-left:3px solid #f59e0b;margin-bottom:24px;">
          <p style="font-size:13px;color:#1e293b;line-height:1.6;margin:0;">
            This link expires in <b>1 hour</b>. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>

        <p style="font-size:12px;color:#94a3b8;margin:0 0 24px;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetLink}" style="color:#635ee7;text-decoration:none;word-break:break-all;">${resetLink}</a>
        </p>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding:16px 28px;background:#f8fafc;">
        <p style="text-align:center;font-size:11px;color:#94a3b8;margin:0;">Password reset request · Skillyards · © ${year}</p>
      </div>
    </div>
  </div>
  `;
}

export function eodAllTeamsTemplate({ date, teamSummaries, adminUrl }) {
  const year = new Date().getFullYear();

  let sectionsHtml = "";
  for (const { team, reports } of teamSummaries) {
    const teamLabel = TEAM_LABELS[team] || team;
    sectionsHtml += `
      <div style="margin-bottom:32px;">
        <h2 style="font-size:16px;color:#1e293b;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #00adb5;display:inline-block;">
          ${teamLabel}
        </h2>
        ${renderReportTable(reports, team)}
      </div>
    `;
  }

  return `
  <div style="background:#f1f5f9;padding:2rem;font-family:Arial,sans-serif;">
    <div style="max-width:720px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

      <div style="background:#0f172a;padding:24px;text-align:center;">
        <img src="${LOGO_URL}" style="max-width:180px;height:auto;display:block;margin:auto;" alt="Skillyards" />
      </div>

      <div style="padding:28px 28px 0;">
        <h1 style="font-size:20px;color:#1e293b;margin:0 0 4px;">All Teams EOD Report</h1>
        <p style="font-size:14px;color:#64748b;margin:0 0 24px;">${date}</p>

        ${sectionsHtml || '<p style="color:#94a3b8;font-size:14px;">No reports submitted today.</p>'}

        <div style="margin:24px 0;">
          <a href="${adminUrl}/eod/history?date=${date}" style="display:block;text-align:center;padding:12px 0;background:#00adb5;color:#ffffff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">View in Dashboard</a>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding:16px 28px;background:#f8fafc;">
        <p style="text-align:center;font-size:11px;color:#94a3b8;margin:0;">Automated EOD Report · Skillyards · © ${year}</p>
      </div>
    </div>
  </div>
  `;
}

export function eodWarningTemplate({ userName, date }) {
  const year = new Date().getFullYear();

  return `
  <div style="background:#f1f5f9;padding:2rem;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">

      <div style="background:#0f172a;padding:24px;text-align:center;">
        <img src="${LOGO_URL}" style="max-width:180px;height:auto;display:block;margin:auto;" alt="Skillyards" />
      </div>

      <div style="padding:28px 28px 0;">
        <h1 style="font-size:20px;color:#1e293b;margin:0 0 12px;display:flex;align-items:center;">
          <span style="margin-right:8px;font-size:24px;">⚠️</span> Action Required
        </h1>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Hi <b>${userName}</b>,<br><br>
          We noticed that you have not submitted your End-of-Day (EOD) report for today (<b>${date}</b>) before the 7:30 PM cutoff.
        </p>

        <div style="background:#fef2f2;border-radius:12px;padding:16px;border:1px solid #fecaca;border-left:4px solid #ef4444;margin-bottom:28px;">
          <p style="font-size:14px;color:#991b1b;line-height:1.6;margin:0;">
            Your Team Lead and the Admin team have been notified of this missing submission. Please ensure you submit your daily reports on time in the future.
          </p>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding:16px 28px;background:#f8fafc;">
        <p style="text-align:center;font-size:11px;color:#94a3b8;margin:0;">Automated Alert · Skillyards · © ${year}</p>
      </div>
    </div>
  </div>
  `;
}
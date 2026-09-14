const LOGO_URL = "https://www.skillyards.in/images/logo-dark.png";

/**
 * Generates a premium HTML certificate for the SkillYards Skill Test.
 *
 * @param {Object} data
 * @param {string} data.name        – Student name
 * @param {number} data.score       – Correct answers
 * @param {number} data.total       – Total questions
 * @param {number} data.percentage  – Score percentage
 * @param {string[]} data.topics    – Topics tested
 * @param {string} data.date        – Formatted completion date
 * @param {string} data.certificateId – Unique certificate ID (session UUID)
 * @returns {string} Full HTML page
 */
export function certificateTemplate({
  name,
  score,
  total,
  percentage,
  topics,
  date,
  certificateId,
}) {
  const topicBadges = topics
    .map(
      (t) =>
        `<span style="display:inline-block;padding:4px 14px;margin:3px 4px;background:#EDE9FF;color:#1B2A8A;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.5px;border:1px solid #C8BFF5;">${t}</span>`,
    )
    .join("");

  const grade =
    percentage >= 90
      ? "A+"
      : percentage >= 80
        ? "A"
        : percentage >= 70
          ? "B+"
          : "B";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=842, initial-scale=1.0" />
  <title>SkillYards Certificate – ${name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
  <style>
    /* ── Print / PDF page control ── */
    @page {
      size: 842px 595px;
      margin: 0;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 842px;
      height: 595px;
      max-width: 842px;
      max-height: 595px;
      font-family: 'Inter', sans-serif;
      background: #ffffff;
      overflow: hidden;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      position: relative;
      margin: 0 auto;
    }

    /* ── Decorative border frame ── */
    .border-frame {
      position: absolute;
      inset: 10px;
      border: 2px solid #1B2A8A;
      border-radius: 12px;
      pointer-events: none;
    }
    .border-frame-inner {
      position: absolute;
      inset: 16px;
      border: 1px solid #EDE9FF;
      border-radius: 8px;
      pointer-events: none;
    }

    /* ── Corner ornaments ── */
    .corner {
      position: absolute;
      width: 50px;
      height: 50px;
      pointer-events: none;
    }
    .corner svg { width: 100%; height: 100%; }
    .corner-tl { top: 18px; left: 18px; }
    .corner-tr { top: 18px; right: 18px; transform: scaleX(-1); }
    .corner-bl { bottom: 18px; left: 18px; transform: scaleY(-1); }
    .corner-br { bottom: 18px; right: 18px; transform: scale(-1, -1); }

    /* ── Background decorative circles ── */
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }
    .bg-circle-1 {
      width: 280px; height: 280px;
      top: -100px; right: -50px;
      background: radial-gradient(circle, rgba(200,191,245,0.15) 0%, transparent 70%);
    }
    .bg-circle-2 {
      width: 240px; height: 240px;
      bottom: -80px; left: -30px;
      background: radial-gradient(circle, rgba(27,42,138,0.06) 0%, transparent 70%);
    }

    /* ── Main content ── */
    .content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 842px;
      height: 595px;
      padding: 32px 60px;
      text-align: center;
    }

    .logo-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }
    .logo-bar img {
      height: 28px;
    }

    .subtitle {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #8E8AA3;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      font-weight: 800;
      color: #2D2B3D;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }

    .divider {
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, #1B2A8A, #C8BFF5);
      border-radius: 3px;
      margin: 8px auto 12px;
    }

    .awarded-to {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: #1B2A8A;
      font-weight: 600;
      margin-bottom: 3px;
    }

    .student-name {
      font-family: 'Playfair Display', serif;
      font-size: 30px;
      font-weight: 700;
      color: #1B2A8A;
      margin-bottom: 8px;
    }

    .description {
      font-size: 11px;
      color: #040309ff;
      line-height: 1.6;
      max-width: 500px;
      margin-bottom: 10px;
    }

    .topics-row {
      margin-bottom: 12px;
    }

    /* ── Score box ── */
    .stats-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-bottom: 14px;
    }
    .stat-box {
      text-align: center;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #2be472ff;
    }
    .stat-value.highlight {
      color: #1B2A8A;
    }
    .stat-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #1B2A8A;
      font-weight: 600;
      margin-top: 2px;
    }
    .stat-divider {
      width: 1px;
      height: 32px;
      background: #C8BFF5;
    }

    /* ── Footer ── */
    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
      max-width: 560px;
      margin-top: auto;
      padding-top: 6px;
    }
    .footer-col {
      text-align: center;
    }
    .footer-line {
      width: 120px;
      height: 1px;
      background: #1B2A8A;
      margin: 0 auto 4px;
    }
    .footer-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #2D2B3D;
      font-weight: 600;
    }
    .footer-value {
      font-size: 11px;
      color: #2D2B3D;
      font-weight: 600;
      margin-bottom: 3px;
    }

    .cert-id {
      position: absolute;
      bottom: 20px;
      right: 32px;
      font-size: 8px;
      color: #1B2A8A;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
  </style>
</head>
<body>

  <!-- Decorative elements -->
  <div class="border-frame"></div>
  <div class="border-frame-inner"></div>
  <div class="bg-circle bg-circle-1"></div>
  <div class="bg-circle bg-circle-2"></div>

  <!-- Corner ornaments -->
  <div class="corner corner-tl">
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 58V20C2 10.059 10.059 2 20 2H58" stroke="#C8BFF5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M2 58V30C2 14.536 14.536 2 30 2H58" stroke="#EDE9FF" stroke-width="1"/>
      <circle cx="6" cy="6" r="3" fill="#1B2A8A" opacity="0.2"/>
    </svg>
  </div>
  <div class="corner corner-tr">
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 58V20C2 10.059 10.059 2 20 2H58" stroke="#C8BFF5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M2 58V30C2 14.536 14.536 2 30 2H58" stroke="#EDE9FF" stroke-width="1"/>
      <circle cx="6" cy="6" r="3" fill="#1B2A8A" opacity="0.2"/>
    </svg>
  </div>
  <div class="corner corner-bl">
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 58V20C2 10.059 10.059 2 20 2H58" stroke="#C8BFF5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M2 58V30C2 14.536 14.536 2 30 2H58" stroke="#EDE9FF" stroke-width="1"/>
      <circle cx="6" cy="6" r="3" fill="#8E8AA3" opacity="0.25"/>
    </svg>
  </div>
  <div class="corner corner-br">
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 58V20C2 10.059 10.059 2 20 2H58" stroke="#C8BFF5" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M2 58V30C2 14.536 14.536 2 30 2H58" stroke="#EDE9FF" stroke-width="1"/>
      <circle cx="6" cy="6" r="3" fill="#8E8AA3" opacity="0.25"/>
    </svg>
  </div>

  <!-- Main content -->
  <div class="content">
    <div class="logo-bar">
      <img src="${LOGO_URL}" alt="SkillYards" />
    </div>
    <p class="subtitle">LEARN.GROW.ACHIEVE</p>

    <h1 class="title">Certificate of Achievement</h1>
    <div class="divider"></div>

    <p class="awarded-to">This is proudly awarded to</p>
    <h2 class="student-name">${name}</h2>

    <p class="description">
      For successfully completing the <strong>10-Minute Skill Assessment</strong>
      and demonstrating proficiency in the following technologies at SkillYards.
    </p>

    <div class="topics-row">${topicBadges}</div>

    <div class="stats-row">
      <div class="stat-box">
        <div class="stat-value highlight">${percentage}%</div>
        <div class="stat-label">Score</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-box">
        <div class="stat-value">${score}/${total}</div>
        <div class="stat-label">Correct Answers</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-box">
        <div class="stat-value">${grade}</div>
        <div class="stat-label">Grade</div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-col">
        <div class="footer-value">${date}</div>
        <div class="footer-line"></div>
        <div class="footer-label">Date of Completion</div>
      </div>
      <div class="footer-col">
        <div class="footer-value">SkillYards Versatilitty</div>
        <div class="footer-line"></div>
        <div class="footer-label">Issued By</div>
      </div>
    </div>
  </div>

  <div class="cert-id">Certificate ID: ${certificateId}</div>

</body>
</html>`;
}

/**
 * Email template wrapping the certificate delivery.
 */
export function certificateEmailTemplate({ name, percentage, score, total }) {
  const year = new Date().getFullYear();

  return `
  <div style="background:#f1f5f9;padding:2rem;font-family:Arial,sans-serif;">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

      <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px 24px;text-align:center;">
        <h1 style="color:#ffffff;font-size:22px;margin:0 0 6px;font-weight:700;">🏆 Congratulations, ${name}!</h1>
        <p style="color:#94a3b8;font-size:13px;margin:0;">You've earned your SkillYards Certificate</p>
      </div>

      <div style="padding:28px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
          <p style="font-size:36px;font-weight:800;color:#16a34a;margin:0;">${percentage}%</p>
          <p style="font-size:13px;color:#64748b;margin:4px 0 0;">You scored ${score} out of ${total} questions correctly</p>
        </div>

        <p style="font-size:14px;color:#334155;line-height:1.7;margin:0 0 20px;">
          Your official <strong>SkillYards Certificate of Achievement</strong> is attached to this email as a PDF.
          You can download, print, or share it on your professional profiles.
        </p>

        <div style="background:#f8fafc;border-radius:10px;padding:16px;border:1px solid #e2e8f0;margin-bottom:24px;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;margin:0 0 8px;font-weight:600;">What's next?</p>
          <ul style="font-size:13px;color:#475569;line-height:1.8;margin:0;padding-left:18px;">
            <li>Share your certificate on LinkedIn</li>
            <li>Explore our full-stack development programs</li>
            <li>Join our community of 500+ learners</li>
          </ul>
        </div>

        <a href="https://skillyards.in/programs" style="display:block;text-align:center;padding:14px 0;background:#635ee7;color:#ffffff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">
          Explore Programs →
        </a>
      </div>

      <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 28px;text-align:center;">
        <div style="margin-bottom:16px;">
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
        <p style="font-size:11px;color:#94a3b8;margin:0;">© ${year} SkillYards Academy. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
}

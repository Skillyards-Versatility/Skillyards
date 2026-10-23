/**
 * Skillyards Lead Intelligence & AI Scoring Engine
 */

export function calculateLeadPropensityScore(lead) {
  if (!lead) {
    return { score: 50, label: "Warm", category: "warm", reasons: [], recommendedAction: "Follow up" };
  }

  let score = 40;
  const reasons = [];

  // Status-based weighting
  const status = lead.status || "new";
  if (status === "converted") {
    score = 100;
    reasons.push("Fully enrolled & tuition paid");
  } else if (status === "qualified") {
    score += 35;
    reasons.push("Eligibility & fee qualification confirmed");
  } else if (status === "counselling_scheduled" || status === "counselled") {
    score += 30;
    reasons.push("Attended/scheduled 1-on-1 admissions counselling");
  } else if (status === "follow_up") {
    score += 15;
    reasons.push("Actively engaged in follow-up discussions");
  } else if (status === "contacted") {
    score += 10;
    reasons.push("First call contact established");
  } else if (status === "cold" || status === "lost") {
    score = Math.max(10, score - 25);
    reasons.push("Disengaged or timing constraint reported");
  }

  // Course interest boost
  const course = (lead.courseInterest || lead.enquiryCourse || lead.courseName || "").toLowerCase();
  if (course.includes("mern") || course.includes("full stack") || course.includes("data science")) {
    score += 10;
    reasons.push("High-demand tech cohort fit");
  }

  // Touchpoints & activity count
  const touchpoints = (lead.timeline?.length || 0);
  if (touchpoints >= 3) {
    score += 10;
    reasons.push(`${touchpoints} recorded engagements in CRM`);
  }

  // Clamp 0-100
  const finalScore = Math.min(99, Math.max(15, score));

  let category = "warm";
  let label = "Warm Prospect";
  let color = "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30";
  let emoji = "⚡";
  let recommendedAction = "Schedule 1-on-1 demo session";

  if (finalScore >= 80) {
    category = "hot";
    label = "Hot Intent Closer";
    color = "text-[#128C7E] bg-[#25D366]/15 border-[#25D366]/40";
    emoji = "🔥";
    recommendedAction = "Share ₹5,000 Token Hold link to reserve cohort seat";
  } else if (finalScore < 45) {
    category = "cold";
    label = "Nurture Lead";
    color = "text-[#5A6E71] bg-[#5A6E71]/10 border-[#5A6E71]/30";
    emoji = "❄️";
    recommendedAction = "Enroll in 7-Day automated multi-channel WhatsApp cadence";
  }

  return {
    score: finalScore,
    label,
    category,
    color,
    emoji,
    reasons,
    recommendedAction,
  };
}

/**
 * 1-Click AI Call Note Polish & Formatter
 * Formats unstructured bullet remarks into professional executive summaries
 */
export function generateAiCallSummary(rawNotes, lead, callOutcome) {
  const candidateName = lead?.fullName || "Candidate";
  const course = lead?.courseInterest || lead?.enquiryCourse || "Full Stack Web Development";

  if (!rawNotes || rawNotes.trim().length === 0) {
    return `🎯 Course Interest: ${course}\n• Discussion: Outbound admissions consultation regarding cohort syllabus and placement readiness.\n• Outcome: ${callOutcome === "reached" ? "Connected with candidate" : callOutcome}.\n💡 Next Step: Send official curriculum brochure and follow up.`;
  }

  const cleaned = rawNotes.trim();

  // Extract potential objections or specifics
  const hasFeeConcern = /fee|cost|emi|money|discount|price|expensive|scholarship/i.test(cleaned);
  const hasParentMention = /parent|father|mother|dad|mom|family/i.test(cleaned);
  const hasTimingMention = /exam|job|office|timing|weekend|weekday|shift|batch/i.test(cleaned);

  let keyPoints = [];
  if (hasFeeConcern) {
    keyPoints.push("Discussed tuition fee breakdown and 0% interest monthly installment options.");
  }
  if (hasParentMention) {
    keyPoints.push("Candidate consulting with parents regarding enrollment timeline.");
  }
  if (hasTimingMention) {
    keyPoints.push("Clarified weekend vs weekday batch timings and recorded lecture access.");
  }

  return `🎯 Focus: ${course}
• Candidate Summary: ${cleaned}
${keyPoints.length > 0 ? `• Key Insights:\n  - ${keyPoints.join("\n  - ")}` : ""}
💡 Recommended Action: ${
    hasFeeConcern
      ? "Send 0% EMI schedule and 15% Merit Scholarship voucher over WhatsApp."
      : "Confirm 1-on-1 counselling slot and dispatch syllabus brochure."
  }`;
}

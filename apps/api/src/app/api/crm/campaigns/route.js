import { db } from "@repo/db";
import { crmAuditEvents, leads } from "@repo/db/schema";
import { eq, desc } from "drizzle-orm";
import { createProtectedRoute } from "@/lib/middleware";
import { canAccessCrm } from "@/modules/crm/crm.permissions";
import { success, error } from "@/utils/response";

export const INITIAL_CAMPAIGNS = [
  {
    id: "camp-101",
    name: "Diwali Tech Fast-Track Ad Campaign",
    code: "CAMP-META-MERN-Q4",
    platform: "meta_ads", // Meta / Instagram / FB
    targetCourse: "Full Stack Web Development (MERN)",
    status: "active",
    budget: 85000,
    spend: 62400,
    impressions: 142500,
    clicks: 4820,
    leadsGenerated: 420,
    counsellingConducted: 88,
    admissionsConverted: 24,
    revenueRealized: 1083240,
    cpl: 148.57,
    cac: 2600.0,
    roas: 17.36,
    utmSource: "meta",
    utmMedium: "paid_social",
    utmCampaign: "diwali_fast_track",
    utmContent: "mern_video",
    trackingUrl:
      "https://skillyards.com/courses/mern?utm_source=meta&utm_medium=paid_social&utm_campaign=diwali_fast_track&utm_content=mern_video",
    startDate: "2026-10-01",
    endDate: "2026-10-31",
  },
  {
    id: "camp-102",
    name: "Google Search High-Intent AI Career Bootcamp",
    code: "CAMP-GOOG-AI-Q4",
    platform: "google_search", // Google Ads Search
    targetCourse: "Data Science & Applied AI Accelerator",
    status: "active",
    budget: 120000,
    spend: 94500,
    impressions: 48900,
    clicks: 3120,
    leadsGenerated: 310,
    counsellingConducted: 76,
    admissionsConverted: 21,
    revenueRealized: 1090320,
    cpl: 304.84,
    cac: 4500.0,
    roas: 11.54,
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "ai_career_bootcamp",
    utmContent: "search_kw_data_science",
    trackingUrl:
      "https://skillyards.com/courses/data-science?utm_source=google&utm_medium=cpc&utm_campaign=ai_career_bootcamp&utm_content=search_kw_data_science",
    startDate: "2026-10-05",
    endDate: "2026-11-15",
  },
  {
    id: "camp-103",
    name: "YouTube Tech Mentorship Case Studies",
    code: "CAMP-YT-UX-2026",
    platform: "youtube",
    targetCourse: "Product Design (UI/UX) Mastery",
    status: "active",
    budget: 50000,
    spend: 34200,
    impressions: 98000,
    clicks: 1420,
    leadsGenerated: 160,
    counsellingConducted: 32,
    admissionsConverted: 8,
    revenueRealized: 304000,
    cpl: 213.75,
    cac: 4275.0,
    roas: 8.89,
    utmSource: "youtube",
    utmMedium: "video_cpc",
    utmCampaign: "portfolio_case_study",
    utmContent: "mentor_interview",
    trackingUrl:
      "https://skillyards.com/courses/ui-ux?utm_source=youtube&utm_medium=video_cpc&utm_campaign=portfolio_case_study&utm_content=mentor_interview",
    startDate: "2026-10-12",
    endDate: "2026-11-10",
  },
  {
    id: "camp-104",
    name: "LinkedIn B2B Career Switchers (Working Devs)",
    code: "CAMP-LI-DEVOPS-2026",
    platform: "linkedin",
    targetCourse: "Cloud Computing & DevOps Engineering",
    status: "active",
    budget: 65000,
    spend: 48000,
    impressions: 32000,
    clicks: 890,
    leadsGenerated: 95,
    counsellingConducted: 24,
    admissionsConverted: 6,
    revenueRealized: 288000,
    cpl: 505.26,
    cac: 8000.0,
    roas: 6.0,
    utmSource: "linkedin",
    utmMedium: "sponsored_content",
    utmCampaign: "working_dev_switch",
    utmContent: "aws_kubernetes",
    trackingUrl:
      "https://skillyards.com/courses/devops?utm_source=linkedin&utm_medium=sponsored_content&utm_campaign=working_dev_switch&utm_content=aws_kubernetes",
    startDate: "2026-10-15",
    endDate: "2026-11-30",
  },
  {
    id: "camp-105",
    name: "Engineering College Campus Hackathon & Seminars",
    code: "CAMP-OFFLINE-COLLEGE-26",
    platform: "college_workshop",
    targetCourse: "Full Stack Web Development (MERN)",
    status: "completed",
    budget: 40000,
    spend: 39500,
    impressions: 12000,
    clicks: 2400,
    leadsGenerated: 280,
    counsellingConducted: 62,
    admissionsConverted: 18,
    revenueRealized: 812430,
    cpl: 141.07,
    cac: 2194.44,
    roas: 20.57,
    utmSource: "college_event",
    utmMedium: "offline_qr",
    utmCampaign: "hackathon_delhi_ncr",
    utmContent: "standee_qr",
    trackingUrl:
      "https://skillyards.com/courses/mern?utm_source=college_event&utm_medium=offline_qr&utm_campaign=hackathon_delhi_ncr&utm_content=standee_qr",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
  },
  {
    id: "camp-106",
    name: "Alumni & Learner Referral Circle (20% Reward)",
    code: "CAMP-REF-AMBASSADOR",
    platform: "organic_referral",
    targetCourse: "All Technical Cohorts",
    status: "active",
    budget: 30000,
    spend: 18000,
    impressions: 8500,
    clicks: 1950,
    leadsGenerated: 155,
    counsellingConducted: 48,
    admissionsConverted: 19,
    revenueRealized: 885000,
    cpl: 116.13,
    cac: 947.37,
    roas: 49.17,
    utmSource: "referral",
    utmMedium: "ambassador",
    utmCampaign: "alumni_circle",
    utmContent: "student_portal",
    trackingUrl:
      "https://skillyards.com/refer?utm_source=referral&utm_medium=ambassador&utm_campaign=alumni_circle&utm_content=student_portal",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
  },
];

// Runtime campaign cache
let runtimeCampaigns = [...INITIAL_CAMPAIGNS];

/**
 * GET /api/crm/campaigns
 * Returns all marketing campaigns, calculated CAC, RoAS, spend and channel distribution
 */
async function getCampaignsHandler(req, { ctx }) {
  try {
    const list = [...runtimeCampaigns];

    // Compute executive totals
    const totalBudget = list.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
    const totalSpend = list.reduce((sum, c) => sum + (Number(c.spend) || 0), 0);
    const totalLeads = list.reduce((sum, c) => sum + (Number(c.leadsGenerated) || 0), 0);
    const totalAdmissions = list.reduce((sum, c) => sum + (Number(c.admissionsConverted) || 0), 0);
    const totalRevenue = list.reduce((sum, c) => sum + (Number(c.revenueRealized) || 0), 0);

    const blendedCAC = totalAdmissions > 0 ? Math.round(totalSpend / totalAdmissions) : 0;
    const blendedRoAS = totalSpend > 0 ? Number((totalRevenue / totalSpend).toFixed(2)) : 0;
    const blendedConvRate = totalLeads > 0 ? Number(((totalAdmissions / totalLeads) * 100).toFixed(1)) : 0;

    // Platform channel breakdown
    const platformBreakdown = {};
    for (const c of list) {
      if (!platformBreakdown[c.platform]) {
        platformBreakdown[c.platform] = {
          spend: 0,
          leads: 0,
          admissions: 0,
          revenue: 0,
        };
      }
      platformBreakdown[c.platform].spend += Number(c.spend) || 0;
      platformBreakdown[c.platform].leads += Number(c.leadsGenerated) || 0;
      platformBreakdown[c.platform].admissions += Number(c.admissionsConverted) || 0;
      platformBreakdown[c.platform].revenue += Number(c.revenueRealized) || 0;
    }

    return Response.json(
      success(
        {
          campaigns: list,
          metrics: {
            totalBudget,
            totalSpend,
            totalLeads,
            totalAdmissions,
            totalRevenue,
            blendedCAC,
            blendedRoAS,
            blendedConvRate,
            activeCount: list.filter((c) => c.status === "active").length,
          },
          platformBreakdown,
        },
        "Marketing campaigns fetched successfully"
      )
    );
  } catch (err) {
    ctx.error?.("CRM_GET_CAMPAIGNS_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to load marketing campaigns"), { status: 500 });
  }
}

/**
 * POST /api/crm/campaigns
 * Creates a new marketing campaign and generates standard tracking links
 */
async function postCampaignHandler(req, { ctx }) {
  try {
    const body = await req.json();
    const {
      name,
      platform,
      targetCourse,
      budget,
      startDate,
      endDate,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
    } = body;

    if (!name || !platform || !budget) {
      return Response.json(error("name, platform, and budget are required"), { status: 400 });
    }

    const campaignId = `camp-${Date.now()}`;
    const code = `CAMP-${platform.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const src = utmSource || platform;
    const med = utmMedium || (platform === "google_search" ? "cpc" : "paid_social");
    const cmp = utmCampaign || name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const cnt = utmContent || "ad_creative_1";

    const trackingUrl = `https://skillyards.com/courses?utm_source=${encodeURIComponent(src)}&utm_medium=${encodeURIComponent(med)}&utm_campaign=${encodeURIComponent(cmp)}&utm_content=${encodeURIComponent(cnt)}`;

    const newCampaign = {
      id: campaignId,
      name,
      code,
      platform,
      targetCourse: targetCourse || "Full Stack Web Development",
      status: "active",
      budget: Number(budget),
      spend: 0,
      impressions: 0,
      clicks: 0,
      leadsGenerated: 0,
      counsellingConducted: 0,
      admissionsConverted: 0,
      revenueRealized: 0,
      cpl: 0,
      cac: 0,
      roas: 0,
      utmSource: src,
      utmMedium: med,
      utmCampaign: cmp,
      utmContent: cnt,
      trackingUrl,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    };

    runtimeCampaigns.unshift(newCampaign);

    // Audit log
    try {
      await db.insert(crmAuditEvents).values({
        actorId: ctx.user?.id || null,
        actorName: ctx.user?.name || "Marketing Team",
        action: "CAMPAIGN_CREATED",
        entityType: "campaign",
        entityId: campaignId,
        reason: `Created marketing campaign '${name}' on ${platform} with budget ₹${budget}`,
        afterSnapshot: newCampaign,
      });
    } catch (_) {}

    return Response.json(success(newCampaign, "Campaign created successfully"));
  } catch (err) {
    ctx.error?.("CRM_CREATE_CAMPAIGN_FAILED", { error: err.message });
    return Response.json(error(err.message || "Failed to create campaign"), { status: 500 });
  }
}

export const GET = createProtectedRoute(canAccessCrm, getCampaignsHandler);
export const POST = createProtectedRoute(canAccessCrm, postCampaignHandler);
export { runtimeCampaigns };

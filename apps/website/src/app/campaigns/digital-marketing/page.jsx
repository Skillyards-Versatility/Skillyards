import DigitalMarketingCampaignClient from "@/components/campaigns/Digital-Marketing/DigitalMarketingCampaignClient";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { getTeamMembersByGroup } from "@/lib/sanity/getTeamMembers";
import { getGoogleReviews } from "@/lib/reviews/getGoogleReviews";

export const revalidate = 3600;

export const metadata = {
  title: "Digital Marketing Course with Placement Guarantee | SkillYards",
  description:
    "Join SkillYards #1 AI-Integrated Digital Marketing Course with Placement. Learn SEO, Meta & Google Ads, AI tools, and work on 9+ live real-world projects.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function DigitalMarketingCampaignPage() {
  const [faqsResult, educatorsResult, reviewsResult] = await Promise.allSettled([
    getPageFaqs("digitalmarketing", 8).catch((e) => {
      console.error("Failed to load FAQs for digital marketing campaign:", e);
      return [];
    }),
    getTeamMembersByGroup("dgmEducators").catch((e) => {
      console.error("Failed to load educators for digital marketing campaign:", e);
      return [];
    }),
    getGoogleReviews().catch((e) => {
      console.error("Failed to load Google Reviews for digital marketing campaign:", e);
      return null;
    }),
  ]);

  const faqs = faqsResult.status === "fulfilled" ? faqsResult.value || [] : [];
  const educators =
    educatorsResult.status === "fulfilled" ? educatorsResult.value || [] : [];
  const reviewsData =
    reviewsResult.status === "fulfilled" ? reviewsResult.value || null : null;

  return (
    <main className="w-full min-h-screen">
      <DigitalMarketingCampaignClient
        faqs={faqs}
        educators={educators}
        reviewsData={reviewsData}
      />
    </main>
  );
}

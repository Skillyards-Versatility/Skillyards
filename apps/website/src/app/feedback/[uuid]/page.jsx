import { buildSEO } from "@/lib/seo/buildSEO";

export const revalidate = 86400;
import FeedbackContent from "./FeedbackContent";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";

export const metadata = buildSEO({
  title: "Give Your Feedback | SkillYards",
  description:
    "Help us improve SkillYards by sharing your learning experience. Your feedback matters.",
  path: "/feedback",
  noindex: true,
});

export default function FeedbackPage() {
  const webPageSchema = getWebPageSchema({
    url: "/feedback",
    name: "Give Your Feedback | SkillYards",
    description:
      "Help us improve SkillYards by sharing your learning experience.",
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Feedback", url: "/feedback" },
  ]);

  const combinedSchema = [webPageSchema, breadcrumbSchema].filter(Boolean);

  return (
    <>
      <JsonLd data={combinedSchema} id="feedback-schema" />
      <FeedbackContent />
    </>
  );
}

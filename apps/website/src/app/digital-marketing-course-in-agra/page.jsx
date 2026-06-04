import dynamic from "next/dynamic";
import { buildSEO } from "@/lib/seo/buildSEO";

export const revalidate = 86400;
const DGMLandingPage = dynamic(() => import("@/components/landingPageDGM/LandingPage").then(m => m.DGMLandingPage));
import JsonLd from "@/components/JsonLd";
import { getCourseSchema } from "@/lib/seo/schema/courseSchema";
import { courses } from "@/data/courses";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import { absoluteUrl } from "@/lib/seo/core/url";
import { getTeamMembersByGroup } from "@/lib/sanity/getTeamMembers";

export const metadata = buildSEO({
  ...courses.digitalmarketing.seo,
  path: "/digital-marketing-course-in-agra",
});

export default async function DigitalMarketingPage() {
  const course = courses.digitalmarketing;
  const courseSchema = getCourseSchema(course);
  const faqs = await getPageFaqs("digitalmarketing", 8);
  const faqSchema = getFAQSchema(faqs, absoluteUrl("/digital-marketing-course-in-agra"));
  const dgmEducators = await getTeamMembersByGroup("dgmEducators");

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs" },
    { name: "On-Job Training", url: "/programs/on-job-training" },
    { name: course.programName || course.title, url: "/digital-marketing-course-in-agra" },
  ]);

  const webPageSchema = getWebPageSchema({
    url: "/digital-marketing-course-in-agra",
    name: course.title,
    description: course.seo.description,
    keywords: course.seo.keywords,
  });

  const combinedSchema = [courseSchema, breadcrumbSchema, faqSchema, webPageSchema].filter(Boolean);

  return (
    <>
      <JsonLd data={combinedSchema} id="digital-marketing-schema" />
      <div className="w-full overflow-x-hidden">
        <DGMLandingPage faqs={faqs} dgmEducators={dgmEducators} />
      </div>
    </>
  );
}

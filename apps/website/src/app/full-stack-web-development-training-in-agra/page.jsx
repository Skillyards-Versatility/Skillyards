import dynamic from "next/dynamic";
import { buildSEO } from "@/lib/seo/buildSEO";

export const revalidate = 86400;
const FSDLandingPage = dynamic(() => import("@/components/landingPageFSD/LandingPage").then(m => m.FSDLandingPage));
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
  ...courses.fullstack.seo,
  path: "/full-stack-web-development-training-in-agra",
});

export default async function FullStackPage() {
  const course = courses.fullstack;
  const courseSchema = getCourseSchema(course);
  const faqs = await getPageFaqs("fullstack", 8);
  const faqSchema = getFAQSchema(faqs, absoluteUrl("/full-stack-web-development-training-in-agra"));
  const fsdEducators = await getTeamMembersByGroup("fsdEducators");

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs" },
    { name: "On-Job Training", url: "/programs/on-job-training" },
    { name: course.programName || course.title, url: "/full-stack-web-development-training-in-agra" },
  ]);

  const webPageSchema = getWebPageSchema({
    url: "/full-stack-web-development-training-in-agra",
    name: course.title,
    description: course.seo.description,
    keywords: course.seo.keywords,
  });

  const combinedSchema = [courseSchema, breadcrumbSchema, faqSchema, webPageSchema].filter(Boolean);

  return (
    <>
      <JsonLd data={combinedSchema} id="fullstack-schema" />
      <div className="w-full overflow-x-hidden">
        <FSDLandingPage faqs={faqs} fsdEducators={fsdEducators} />
      </div>
    </>
  );
}

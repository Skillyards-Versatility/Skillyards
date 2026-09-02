import dynamic from "next/dynamic";
import { buildSEO } from "@/lib/seo/buildSEO";

export const revalidate = 86400;
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
const BCALandingPage = dynamic(() => import("@/components/landingPageBCA/LandingPage").then(m => m.BCALandingPage));
import JsonLd from "@/components/JsonLd";
import { getCourseSchema } from "@/lib/seo/schema/courseSchema";
import { courses } from "@/data/courses";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";

const course = courses.bca;
const courseSchema = getCourseSchema(course);

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
  ...course.seo,
  path: "/bca-training-program-in-agra",
  ogImage: resolveOgImage(ogImages, "bca", course.seo.ogImage),
});
}

const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs" },
    { name: "On Job Degree", url: "/programs/on-job-degree" },
    { name: course.title, url: "/bca-training-program-in-agra" },
]);

const webPageSchema = getWebPageSchema({
  url: "/bca-training-program-in-agra",
  name: course.title,
  description: course.seo.description,
  keywords: course.seo.keywords
});

export default async function BCAPage() {
  const bcaFaqs = await getPageFaqs("bca", 999);

  const faqSchema = getFAQSchema(bcaFaqs, absoluteUrl("/bca-training-program-in-agra"));

  const combinedSchema = [courseSchema, breadcrumbSchema, webPageSchema, faqSchema].filter(Boolean);

  return (
    <>
      <JsonLd data={combinedSchema} id="course-schema" />

      <div className="w-full overflow-x-hidden">
        <BCALandingPage faqs={bcaFaqs} />
      </div>
    </>
  );
}

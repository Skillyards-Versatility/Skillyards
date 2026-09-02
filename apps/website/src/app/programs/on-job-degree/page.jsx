import dynamic from "next/dynamic";
import OnJobHero from "@/components/onJobDegreePage/OnJobHero";
import WhatIsOJD from "@/components/onJobDegreePage/WhatIsOJD";
import WhyOnJobDegree from "@/components/onJobDegreePage/WhyOnJobDegree";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";
import ProgramsFAQ from "@/components/programspage/ProgramsFAQ";

const OnJobProgramCards = dynamic(() => import("@/components/onJobDegreePage/OnJobProgramCards"));
const OJDEligibility = dynamic(() => import("@/components/onJobDegreePage/OJDEligibility"));
const PlacementOutcomes = dynamic(() => import("@/components/onJobDegreePage/PlacementOutcomes"));
const FinalCTA = dynamic(() => import("@/components/onJobDegreePage/FinalCTA"));

export const revalidate = 86400;

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
    title: "BCA & BBA Degree Programs in Agra with Practical Training | SkillYards",
    description:
      "Earn a recognised BCA or BBA degree in Agra while learning MERN stack development or Digital Marketing hands-on. 3 hrs practical + 2 hrs theory daily. Batch starts August. 35 seats.",
    path: "/programs/on-job-degree",
    keywords: [
      "BCA degree Agra",
      "BBA degree Agra",
      "BCA with practical training Agra",
      "BBA with digital marketing Agra",
      "on job degree Agra",
      "degree with skill training Agra",
    ],
    ogImage: resolveOgImage(ogImages, "programs", "/images/opengraph/programs-og.jpg"),
  });
}

const courseSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://www.skillyards.in/programs/on-job-degree#bca",
      "name": "BCA with Full-Stack Development",
      "description": "A 3-year university-affiliated Bachelor of Computer Applications degree with 3 hours of daily hands-on MERN stack development training at SkillYards, Agra.",
      "provider": {
        "@type": "Organization",
        "name": "SkillYards",
        "url": "https://www.skillyards.in",
      },
      "educationalCredentialAwarded": "Bachelor of Computer Applications (BCA)",
      "timeRequired": "P3Y",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "offline",
        "startDate": "2026-08-01",
        "location": {
          "@type": "Place",
          "name": "SkillYards, Agra",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Agra",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "IN",
          },
        },
      },
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "5000",
          "priceCurrency": "INR",
          "unitText": "month",
        },
      },
    },
    {
      "@type": "Course",
      "@id": "https://www.skillyards.in/programs/on-job-degree#bba",
      "name": "BBA with Digital Marketing",
      "description": "A 3-year university-affiliated Bachelor of Business Administration degree with 3 hours of daily hands-on Digital Marketing training at SkillYards, Agra.",
      "provider": {
        "@type": "Organization",
        "name": "SkillYards",
        "url": "https://www.skillyards.in",
      },
      "educationalCredentialAwarded": "Bachelor of Business Administration (BBA)",
      "timeRequired": "P3Y",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "offline",
        "startDate": "2026-08-01",
        "location": {
          "@type": "Place",
          "name": "SkillYards, Agra",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Agra",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "IN",
          },
        },
      },
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "5000",
          "priceCurrency": "INR",
          "unitText": "month",
        },
      },
    },
  ],
};

export default async function OnJobDegreePage() {
  const faqs = await getPageFaqs("degrees", 6);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs" },
    { name: "On Job Degree", url: "/programs/on-job-degree" },
  ]);

  const faqSchema = getFAQSchema(faqs, absoluteUrl("/programs/on-job-degree"));
  const combinedSchema = [breadcrumbSchema, faqSchema].filter(Boolean);

  return (
    <main>
      <JsonLd data={courseSchema} id="ojd-schema" />
      <JsonLd data={combinedSchema} id="on-job-degree-schema" />
      <OnJobHero />
      <WhatIsOJD />
      <OnJobProgramCards />
      <WhyOnJobDegree />
      <OJDEligibility />
      <PlacementOutcomes />
      {faqs.length > 0 && <ProgramsFAQ faqs={faqs} />}
      <FinalCTA />
    </main>
  );
}

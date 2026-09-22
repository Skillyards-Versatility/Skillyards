import HeroCarousel from "@/components/homepage/HeroCarousel";
import AboutSection from "@/components/homepage/AboutSection";
import BatchFeeInfo from "@/components/programspage/BatchFeeInfo";
import GoogleReviewsSection from "@/components/homepage/GoogleReviewsSection";
import dynamic from "next/dynamic";

const ProblemSection = dynamic(
  () => import("@/components/homepage/ProblemSection"),
);
const FeaturesSection = dynamic(
  () => import("@/components/homepage/FeaturesSection"),
);
const LeadersSection = dynamic(
  () => import("@/components/common/LeadersSection"),
);
const CTASection = dynamic(() => import("@/components/homepage/CTASection"));
const FAQSection = dynamic(() => import("@/components/common/FAQSection"));
const BlogSection = dynamic(() =>
  import("@/components/homepage/BlogSection").then((mod) => mod.BlogSection),
);
const PartnersSlider = dynamic(
  () => import("@/components/common/PartnersSlider"),
);
const ProgramsShowcase = dynamic(
  () => import("@/components/homepage/ProgrammeShowcase"),
);
const WhatStudentsBuild = dynamic(
  () => import("@/components/homepage/WhatStudentsBuild"),
);
const FeaturedRoles = dynamic(
  () => import("@/components/homepage/FeaturedRoles"),
);
const SkillTestSection = dynamic(
  () => import("@/components/homepage/SkillTestSection"),
);

import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import JsonLd from "@/components/JsonLd";

import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";
import { sanityClient } from "@/lib/sanity/client";
import { BATCHES_QUERY } from "@/lib/sanity/queries";
import { getGoogleReviews } from "@/lib/reviews/getGoogleReviews";

export const revalidate = 86400;

const homeKeywords = [
  "IT training institute in Agra",
  "SkillYards Agra",
  "coding institute in Agra",
  "full stack development course in Agra",
  "BCA with job training in Agra",
  "BBA with digital marketing in Agra",
  "digital marketing course in Agra",
  "computer training institute in Agra",
  "job oriented courses after 12th Agra",
  "on job degree program Agra",
];

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
    title: "SkillYards | IT Training With Degree & Placement in Agra",
    description:
      "Get BCA, BBA, full-stack & digital marketing training with DBRAU degree and 100% placement support. Book your free career counselling today!",
    path: "/",
    keywords: homeKeywords,
    ogImage: resolveOgImage(ogImages, "home", "/images/opengraph/home-og.jpg"),
  });
}

export default async function Home() {
  const [batches, homepageFaqs, reviewsData] = await Promise.all([
    sanityClient.fetch(BATCHES_QUERY),
    getPageFaqs("homepage", 4),
    getGoogleReviews(),
  ]);

  const faqSchema = getFAQSchema(homepageFaqs, absoluteUrl("/"));
  const webPageSchema = getWebPageSchema({
    url: "/",
    name: "SkillYards – IT Training Institute in Agra",
    description:
      "Get BCA, BBA, full-stack & digital marketing training with DBRAU degree and 100% placement support. Book your free career counselling today!",
    keywords: homeKeywords,
  });

  const reviewsSchema = reviewsData
    ? {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": "https://www.skillyards.in/#organization",
        name: "SkillYards",
        url: absoluteUrl("/"),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(reviewsData.rating),
          reviewCount: String(reviewsData.userRatingCount),
          bestRating: "5",
          worstRating: "1",
        },
      }
    : null;

  const combinedSchema = [faqSchema, webPageSchema, reviewsSchema].filter(
    Boolean,
  );

  return (
    <>
      <JsonLd data={combinedSchema} id="homepage-schema" />

      <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-500">
        <HeroCarousel />
        <AboutSection />
        <ProblemSection />
        <ProgramsShowcase />
        <FeaturesSection />
        <WhatStudentsBuild />
        <BatchFeeInfo batches={batches} variant="home" />
        <GoogleReviewsSection data={reviewsData} />
        <FeaturedRoles />
        <SkillTestSection />
        <LeadersSection />
        <BlogSection />
        <PartnersSlider />
        <CTASection />
        <FAQSection faqs={homepageFaqs} />
      </div>
    </>
  );
}

import dynamic from "next/dynamic";

import JsonLd from "@/components/JsonLd";
import AboutHero from "@/components/aboutpage/AboutHero";

export const revalidate = 86400;
const AboutMissionVision = dynamic(() => import("@/components/aboutpage/AboutMissionVision"));

const AboutWhyChoose = dynamic(() => import("@/components/aboutpage/AboutWhyChoose"));
const StudentWorkAbout = dynamic(() => import("@/components/aboutpage/StudentWorkAbout"));
const CTASection = dynamic(() => import("@/components/aboutpage/CTASection"));
const LifeAtSkillYards = dynamic(() => import("@/components/aboutpage/LifeAtSkillYards"));
const TechnologiesWeTeach = dynamic(() => import("@/components/aboutpage/TechnologiesWeTeach"));

const SkillYardsJourney = dynamic(() => import("@/components/aboutpage/SkillYardsJourney"));
const CtaBanner = dynamic(() => import("@/components/aboutpage/CtaBanner"));
const PartnersSlider = dynamic(() => import("@/components/common/PartnersSlider"));
const FAQSection = dynamic(() => import("@/components/common/FAQSection"));
const PlacementStats = dynamic(() => import("@/components/aboutpage/PlacementStats"));
const OtherTeam = dynamic(() => import("@/components/aboutpage/OtherTeam"));
const LeadersSection=dynamic(()=>import("@/components/common/LeadersSection"));
const AboutLocalSEO = dynamic(() => import("@/components/aboutpage/AboutLocalSEO"));

import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";
import { getTeamMembersByGroup } from "@/lib/sanity/getTeamMembers";
import { getGalleryImages } from "@/lib/sanity/getGalleryImages";

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
  title: "About SkillYards | AI-Integrated Career-Building Institute in Agra",
  description:
    "Learn about SkillYards - an AI-integrated career-building institute in Agra focused on practical learning, mentorship, industry-focused training, OJD degree pathways, OJT programs, and job-ready skill development for students after 12th and graduates.",
  path: "/about",
  keywords: [
    "About SkillYards",
    "SkillYards Agra",
    "AI-integrated training institute in Agra",
    "Career-focused institute in Agra",
    "Practical learning institute in Agra",
    "Skill development institute in Agra",
    "Full-Stack training institute in Agra",
    "Digital marketing institute in Agra",
    "Offline training institute in Agra",
  ],
  ogImage: resolveOgImage(ogImages, "about", "/images/opengraph/about-og.jpg"),
});
}

import { getAboutPageSchema } from "@/lib/seo/schema/webPageSchema";

export default async function AboutPage() {
  const aboutPageSchema = getAboutPageSchema({
    url: "/about",
    name: "About SkillYards",
    description:
      "SkillYards is an AI-integrated career-building institute in Agra focused on practical learning, mentorship, industry-focused training, OJD degree pathways, OJT programs, and job-ready skill development for students after 12th and graduates.",
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  const faqs = await getPageFaqs("about", 999);
  const faqSchema = getFAQSchema(faqs, absoluteUrl("/about"));
  const combinedSchema = [aboutPageSchema, breadcrumbSchema, faqSchema].filter(Boolean);
  const carouselTeam = await getTeamMembersByGroup("carousel");
  const galleryImages = await getGalleryImages();
  const domeImages = galleryImages.filter((img) => img.showInDome && !img.noindex);

  return (
    <>
      <div className="bg-background text-foreground transition-colors duration-500">
        <AboutHero />
        <AboutWhyChoose />
        <TechnologiesWeTeach />
        <LeadersSection />
        <OtherTeam members={carouselTeam} />
        <PartnersSlider />

        <CTASection />
        <LifeAtSkillYards images={domeImages} />
        <AboutLocalSEO />
        <StudentWorkAbout />
        <PlacementStats />
        <SkillYardsJourney />
        <CtaBanner />
        <FAQSection
          faqs={faqs}
          badge="About SkillYards"
          title="Frequently Asked Questions"
          description="Helpful answers about SkillYards, our learning model, OJD and OJT pathways, AI-integrated training, and our Agra campus."
        />
      </div>
      <JsonLd data={combinedSchema} id="about-page-schema-skillyards" />
    </>
  );
}

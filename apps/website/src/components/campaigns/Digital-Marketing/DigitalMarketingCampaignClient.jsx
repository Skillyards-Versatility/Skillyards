"use client";

import dynamic from "next/dynamic";
import MarketingHero from "./marketing-hero";
import KraftshalaSection from "./skillyards-section";

const PartnersSlider = dynamic(
  () => import("@/components/common/PartnersSlider")
);

const ProjectsSection = dynamic(() => import("./projects-section"));
const ExpertsSection = dynamic(() => import("./experts-section"));
const CertificationsSection = dynamic(() => import("./certifications-section"));
const ReviewsSection = dynamic(() => import("./reviews-section"));
const CampusPhotosSection = dynamic(() => import("./campus-photos-section"));
const CampaignFooter = dynamic(() => import("./CampaignFooter"));

const DGMFAQ = dynamic(() =>
  import("@/components/landingPageDGM/FAQ").then((m) => m.DGMFAQ)
);

export default function DigitalMarketingCampaignClient({ faqs = [], educators = [] }) {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi, I'm interested in the Digital Marketing Course at SkillYards. I'd like to know more about the scholarship and curriculum."
  )}`;

  return (
    <div className="relative min-h-screen w-full bg-white text-gray-900 selection:bg-[#1E7CBC]/20 selection:text-[#1E7CBC]">
      {/* 1. HERO SECTION */}
      <MarketingHero />

      {/* 2. COMPANIES WAITING FOR YOU */}
      <PartnersSlider />

      {/* 3. COMPARISON, STICKY NAVIGATION & BENEFITS SECTION */}
      <KraftshalaSection applyUrl="#application-form">
        {/* 1. STICKY-ON-SCROLL CARDS (LIVE PROJECTS & SKILLS SECTION) */}
        <ProjectsSection id="projects" />

        {/* EXPERTS / MENTORS SECTION */}
        <ExpertsSection id="experts" educators={educators} />

        {/* CERTIFICATIONS SECTION (BEFORE TESTIMONIALS/ALUMNI) */}
        <CertificationsSection id="certifications" />

        {/* REVIEWS / STUDENT TESTIMONIALS SECTION */}
        <div id="alumni" className="-scroll-mt-24" />
        <ReviewsSection id="reviews" />

        {/* REAL PHOTOS OF SKILLYARDS CAMPUS SECTION */}
        <CampusPhotosSection id="campus" />

        {/* FAQS SECTION */}
        <div id="faqs" className="w-full scroll-mt-20 lg:scroll-mt-24">
          <DGMFAQ faqs={faqs} />
        </div>
      </KraftshalaSection>

      {/* FOOTER */}
      <CampaignFooter />
    </div>
  );
}

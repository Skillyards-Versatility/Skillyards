"use client";

import dynamic from "next/dynamic";
import MarketingHero from "./marketing-hero";
import KraftshalaSection from "./kraftshala-section";
import ProjectsSection from "./projects-section";

const StickyCTABar = dynamic(
  () => import("@/components/campaigns/StickyCTABar").then((m) => m.StickyCTABar),
  { ssr: false }
);

const DGMCurriculum = dynamic(() =>
  import("@/components/landingPageDGM/Curriculum").then((m) => m.DGMCurriculum)
);
const DGMEducators = dynamic(() =>
  import("@/components/landingPageDGM/Educators").then((m) => m.DGMEducators)
);
const DGMAdmissionProcess = dynamic(() =>
  import("@/components/landingPageDGM/AdmissionProcess").then((m) => m.DGMAdmissionProcess)
);
const DGMFAQ = dynamic(() =>
  import("@/components/landingPageDGM/FAQ").then((m) => m.DGMFAQ)
);

export default function DigitalMarketingCampaignClient({ faqs = [], educators = [] }) {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi, I'm interested in the Digital Marketing Course at SkillYards. I'd like to know more about the scholarship and curriculum."
  )}`;

  const panels = {
    curriculum: (
      <div className="py-6">
        <DGMCurriculum />
      </div>
    ),
    experts: (
      <div className="py-6">
        <DGMEducators educators={educators} />
      </div>
    ),
    admissions: (
      <div className="py-6">
        <DGMAdmissionProcess />
      </div>
    ),
    faqs: faqs?.length > 0 ? (
      <div className="py-6">
        <DGMFAQ faqs={faqs} />
      </div>
    ) : null,
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      {/* 1. HERO SECTION */}
      <MarketingHero />

      {/* 2. MAIN KRAFTSHALA SECTION (Comparison, Sticky Navigation & Benefits) */}
      <KraftshalaSection applyUrl="#application-form" panels={panels} />

      {/* 3. LIVE PROJECTS & SKILLS SECTION */}
      <ProjectsSection id="projects" />

      {/* STICKY BOTTOM CONVERSION BAR */}
      <StickyCTABar whatsappHref={whatsappHref} />
    </div>
  );
}

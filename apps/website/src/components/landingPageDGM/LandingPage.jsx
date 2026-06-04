"use client";

import dynamic from 'next/dynamic';
import { DGMHero } from "./Hero";

const DGMProgramAtGlance = dynamic(() => import("./ProgramAtGlance").then(m => m.DGMProgramAtGlance));
const DGMWhyDigitalMarketing = dynamic(() => import("./WhyDigitalMarketing").then(m => m.DGMWhyDigitalMarketing));
const DGMOJTExplained = dynamic(() => import("./OJTExplained").then(m => m.DGMOJTExplained));
const DGMCurriculum = dynamic(() => import("./Curriculum").then(m => m.DGMCurriculum));
const DGMToolsAndCerts = dynamic(() => import("./ToolsAndCerts").then(m => m.DGMToolsAndCerts));
const DGMPortfolioResults = dynamic(() => import("./PortfolioResults").then(m => m.DGMPortfolioResults));
const DGMCareerPaths = dynamic(() => import("./CareerPaths").then(m => m.DGMCareerPaths));
const DGMWhoIsThisFor = dynamic(() => import("./WhoIsThisFor").then(m => m.DGMWhoIsThisFor));
const DGMEducators = dynamic(() => import("./Educators").then(m => m.DGMEducators));
const DGMPlacementOutcomes = dynamic(() => import("./PlacementOutcomes").then(m => m.DGMPlacementOutcomes));
const DGMComparisonTable = dynamic(() => import("./ComparisonTable").then(m => m.DGMComparisonTable));
const DGMAdmissionProcess = dynamic(() => import("./AdmissionProcess").then(m => m.DGMAdmissionProcess));
const DGMFAQ = dynamic(() => import("./FAQ").then(m => m.DGMFAQ));
const DGMFinalCTA = dynamic(() => import("./FinalCTA").then(m => m.DGMFinalCTA));
const PartnersSlider = dynamic(() => import("@/components/common/PartnersSlider"));

export function DGMLandingPage({ faqs, dgmEducators }) {
  return (
    <main className="w-full bg-background text-foreground">
      <DGMHero />
      <DGMProgramAtGlance />
      <DGMWhyDigitalMarketing />
      <DGMToolsAndCerts />
      <DGMCurriculum />
      <DGMOJTExplained />
      <DGMPortfolioResults />
      <DGMCareerPaths />
      <DGMWhoIsThisFor />
      <DGMEducators educators={dgmEducators} />
      <DGMPlacementOutcomes />
      <DGMComparisonTable />
      <PartnersSlider />
      <DGMAdmissionProcess />
      <DGMFAQ faqs={faqs} />
      <DGMFinalCTA />
    </main>
  );
}

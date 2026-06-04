"use client";

import dynamic from 'next/dynamic';
import { FSDHero } from "./Hero";

const FSDProgramAtGlance = dynamic(() => import("./ProgramAtGlance").then(m => m.FSDProgramAtGlance));
const FSDOJTExplained = dynamic(() => import("./OJTExplained").then(m => m.FSDOJTExplained));
const FSDCurriculum = dynamic(() => import("./Curriculum").then(m => m.FSDCurriculum));
const FSDTechStack = dynamic(() => import("./TechStack").then(m => m.FSDTechStack));
const FSDEducators = dynamic(() => import("./Educators").then(m => m.FSDEducators));
const FSDPortfolioProjects = dynamic(() => import("./PortfolioProjects").then(m => m.FSDPortfolioProjects));
const FSDWhoIsThisFor = dynamic(() => import("./WhoIsThisFor").then(m => m.FSDWhoIsThisFor));
const FSDComparisonTable = dynamic(() => import("./ComparisonTable").then(m => m.FSDComparisonTable));
const FSDDayInTheLife = dynamic(() => import("./DayInTheLife").then(m => m.FSDDayInTheLife));
const FSDPlacementOutcomes = dynamic(() => import("./PlacementOutcomes").then(m => m.FSDPlacementOutcomes));
const FSDAdmissionProcess = dynamic(() => import("./AdmissionProcess").then(m => m.FSDAdmissionProcess));
const FSDFAQ = dynamic(() => import("./FAQ").then(m => m.FSDFAQ));
const FSDFinalCTA = dynamic(() => import("./FinalCTA").then(m => m.FSDFinalCTA));
const PartnersSlider = dynamic(() => import("@/components/common/PartnersSlider"));

export function FSDLandingPage({ faqs, fsdEducators }) {
  return (
    <main className="w-full bg-background text-foreground">
      <FSDHero />
      <FSDProgramAtGlance />
      <FSDOJTExplained />
      <FSDCurriculum />
      <FSDTechStack />
      <FSDEducators educators={fsdEducators} />
      <FSDPortfolioProjects />
      <FSDComparisonTable />
      <FSDWhoIsThisFor />
      <FSDPlacementOutcomes />
      <PartnersSlider />
      <FSDDayInTheLife />
      <FSDAdmissionProcess />
      <FSDFAQ faqs={faqs} />
      <FSDFinalCTA />
    </main>
  );
}

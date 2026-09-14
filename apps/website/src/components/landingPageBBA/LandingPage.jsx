"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BBAHero } from "./Hero";

const WhoIsThisFor = dynamic(() =>
  import("./WhoIsThisFor").then((m) => m.WhoIsThisFor),
);
const WhyNotRegular = dynamic(() =>
  import("./WhyNotRegular").then((m) => m.WhyNotRegular),
);
const CareerPaths = dynamic(() =>
  import("./CareerPaths").then((m) => m.CareerPaths),
);
const Syllabus = dynamic(() => import("./Syllabus").then((m) => m.Syllabus));
const BbaPartners = dynamic(() =>
  import("./BbaPartners").then((m) => m.BbaPartners),
);
const EligibilityAndAdmission = dynamic(() =>
  import("./EligibilityAndAdmission").then((m) => m.EligibilityAndAdmission),
);
const BBAFAQ = dynamic(() => import("./FAQ").then((m) => m.BBAFAQ));
const FinalCTA = dynamic(() => import("./FinalCTA").then((m) => m.FinalCTA));

export const LandingPage = ({ faqs = [] }) => {
  return (
    <section className="landing-page bg-background text-foreground min-h-screen w-full">
      <div className="w-full bg-background">
        <main className="w-full">
          <BBAHero />
          <WhoIsThisFor />
          <Syllabus />
          <WhyNotRegular />
          <CareerPaths />
          <BbaPartners />
          <EligibilityAndAdmission />
          <BBAFAQ faqs={faqs} />
          <FinalCTA />
        </main>
      </div>
    </section>
  );
};

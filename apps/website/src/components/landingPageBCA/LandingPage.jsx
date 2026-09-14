"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BCAHero } from "./Hero";

const WhoIsThisFor = dynamic(() =>
  import("./WhoIsThisFor").then((m) => m.WhoIsThisFor),
);
const BCASyllabus = dynamic(() =>
  import("./Syllabus").then((m) => m.BCASyllabus),
);
const BCASkills = dynamic(() => import("./Skills").then((m) => m.BCASkills));
const WhyNotRegular = dynamic(() =>
  import("./WhyNotRegular").then((m) => m.WhyNotRegular),
);
const BCAJourneyTimeline = dynamic(() => import("./ProgramPhases"));
const Placement = dynamic(() => import("./Placement").then((m) => m.Placement));
const BcaPartners = dynamic(() =>
  import("./BcaPartners").then((m) => m.BcaPartners),
);
const EligibilityAndAdmission = dynamic(() =>
  import("./EligibilityAndAdmission").then((m) => m.EligibilityAndAdmission),
);
const BCAFAQ = dynamic(() => import("./FAQ").then((m) => m.BCAFAQ));
const FinalCTA = dynamic(() => import("./FinalCTA").then((m) => m.FinalCTA));

export const BCALandingPage = ({ faqs = [] }) => {
  return (
    <section className="landing-page bg-background text-foreground min-h-screen w-full">
      <div className="w-full bg-background">
        <main className="w-full">
          <BCAHero />
          <WhoIsThisFor />
          <BCASyllabus />
          <BCASkills />
          <WhyNotRegular />
          <BCAJourneyTimeline />
          <Placement />
          <BcaPartners />
          <EligibilityAndAdmission />
          <BCAFAQ faqs={faqs} />
          <FinalCTA />
        </main>
      </div>
    </section>
  );
};

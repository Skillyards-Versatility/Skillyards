"use client";

import React from "react";
import { Rocket, BookOpen, Briefcase, Award } from "lucide-react";
import Timeline from "@/components/common/Timeline";

const phases = [
  {
    icon: BookOpen,
    title: "Foundations",
    duration: "Start",
    description:
      "Build strong fundamentals with practical learning instead of theory-heavy education.",
  },
  {
    icon: Rocket,
    title: "Skill Building",
    duration: "Growth",
    description:
      "Develop real-world skills through projects, mentorship, and guided learning.",
  },
  {
    icon: Briefcase,
    title: "Real Experience",
    duration: "Execution",
    description:
      "Work on live projects and understand how real companies operate.",
  },
  {
    icon: Award,
    title: "Career Ready",
    duration: "Outcome",
    description:
      "Become confident, job-ready, and capable of starting your career early.",
  },
];

export default function JourneyTimeline() {
  return (
    <Timeline
      items={phases}
      title={
        <>
          Your <span className="text-primary italic">Journey</span>
        </>
      }
      subtitle="From confusion to confidence a structured transformation into a skilled professional in Agra."
    />
  );
}

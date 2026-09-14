import { ORGANIZATION_ID } from "./global.js";
import { absoluteUrl, withFragment } from "../core/url.js";

export const getQuizSchema = (quiz) => {
  if (!quiz) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": withFragment(absoluteUrl(quiz.url), "#quiz"),
    name: quiz.name,
    description: quiz.description,
    keywords: quiz.keywords || [
      "skill test",
      "quiz",
      "Agra",
      "IT training institute in Agra",
    ],
    learningResourceType: "Quiz",
    educationalLevel: "Beginner to Advanced",
    assesses: quiz.assesses || "HTML, CSS, JavaScript, SEO",
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
};

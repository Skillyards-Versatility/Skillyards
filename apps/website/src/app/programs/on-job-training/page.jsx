import dynamic from "next/dynamic";
import OnJobTrainingHero from "@/components/onJobTrainingPage/OnJobTrainingHero";
import WhyOnJobTraining from "@/components/onJobTrainingPage/WhyOnJobTraining";
import OJTPracticalLearning from "@/components/onJobTrainingPage/OJTPracticalLearning";
import OJTCareerSupport from "@/components/onJobTrainingPage/OJTCareerSupport";
import OJTLocalSEO from "@/components/onJobTrainingPage/OJTLocalSEO";
import OJTFinalCTA from "@/components/onJobTrainingPage/OJTFinalCTA";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import JsonLd from "@/components/JsonLd";
import { getCollectionPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";
import ProgramsFAQ from "@/components/programspage/ProgramsFAQ";

const OnJobTrainingProgramCards = dynamic(() => import("@/components/onJobTrainingPage/OnJobTrainingProgramCards"));
const OnJobTrainingComparisonTable = dynamic(() => import("@/components/onJobTrainingPage/OnJobTrainingComparisonTable"));

export const revalidate = 86400;

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
    title: "AI-Integrated On-Job Training Courses in Agra | SkillYards",
    description:
      "Explore SkillYards' AI-integrated On-Job Training (OJT) programs in Agra. Choose between Full-Stack Web Development and Digital Marketing with practical projects, offline classroom training, portfolio building, and placement assistance.",
    path: "/programs/on-job-training",
    keywords: [
      "On-Job Training Courses in Agra",
      "AI-Integrated OJT Courses in Agra",
      "Job-Oriented Courses in Agra",
      "Skill-Based Training in Agra",
      "Offline Job Training Programs in Agra",
      "Full-Stack Web Development Course in Agra",
      "Digital Marketing Course in Agra",
      "Coding Course in Agra",
      "MERN Stack Course in Agra",
      "SEO Course in Agra",
      "Google Ads Training in Agra",
    ],
    ogImage: resolveOgImage(ogImages, "programs", "/images/opengraph/programs-og.jpg"),
  });
}

export default async function OnJobTrainingPage() {
  const faqs = await getPageFaqs("ojt", 7);
  const collectionSchema = getCollectionPageSchema({
    url: "/programs/on-job-training",
    name: "AI-Integrated On-Job Training Courses in Agra | SkillYards",
    description:
      "Explore SkillYards' AI-integrated On-Job Training programs in Agra. Compare Full-Stack Web Development OJT and Digital Marketing OJT with practical projects, offline classroom learning, portfolio building, and placement assistance.",
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs" },
    { name: "On-Job Training", url: "/programs/on-job-training" },
  ]);

  const faqSchema = getFAQSchema(faqs, absoluteUrl("/programs/on-job-training"));
  const combinedSchema = [collectionSchema, breadcrumbSchema, faqSchema].filter(Boolean);

  return (
    <main>
      <JsonLd data={combinedSchema} id="on-job-training-schema" />
      <OnJobTrainingHero />
      <WhyOnJobTraining />
      <OnJobTrainingComparisonTable />
      <OnJobTrainingProgramCards />
      <OJTPracticalLearning />
      <OJTCareerSupport />
      <OJTLocalSEO />
      {faqs.length > 0 && <ProgramsFAQ faqs={faqs} />}
      <OJTFinalCTA />
    </main>
  );
}

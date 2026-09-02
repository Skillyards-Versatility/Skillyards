import ProgramsHero from "@/components/programspage/ProgramsHero";
import ComparisonTable from "@/components/programspage/ComparisonTable";
import GoogleTrustProof from "@/components/programspage/GoogleTrustProof";
import ProgramCards from "@/components/programspage/ProgramCards";
import AdmissionProcess from "@/components/programspage/AdmissionProcess";
import ProgramsFAQ from "@/components/programspage/ProgramsFAQ";
import FinalCTA from "@/components/programspage/FinalCTA";
import BatchFeeInfo from "@/components/programspage/BatchFeeInfo";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import JsonLd from "@/components/JsonLd";
import { getCollectionPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getBreadcrumbSchema } from "@/lib/seo/schema/breadcrumbSchema";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";
import { sanityClient } from "@/lib/sanity/client";
import { BATCHES_QUERY } from "@/lib/sanity/queries";

export const revalidate = 86400;

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
    title: "SkillYards Programs | OJD & OJT IT Training in Agra",
    description:
      "Explore SkillYards On Job Degree and On Job Training programs in Agra, including BCA, BBA, Full-Stack Development and Digital Marketing with practical projects and 100% placement assistance.",
    path: "/programs",
    keywords: [
      "IT training programs in Agra",
      "IT courses in Agra",
      "On Job Degree in Agra",
      "On Job Training in Agra",
      "Career courses after 12th in Agra",
      "SkillYards programs",
    ],
    ogImage: resolveOgImage(ogImages, "programs", "/images/opengraph/programs-og.jpg"),
  });
}

export default async function ProgramsPage() {
  const batches = await sanityClient.fetch(BATCHES_QUERY);
  const faqs = await getPageFaqs("general", 5);

  const collectionSchema = getCollectionPageSchema({
    url: "/programs",
    name: "SkillYards Programs | OJD & OJT IT Training in Agra",
    description:
      "Explore SkillYards On Job Degree and On Job Training programs in Agra, including BCA, BBA, Full-Stack Development and Digital Marketing with practical projects and 100% placement assistance."
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Programs", url: "/programs" },
  ]);

  const faqSchema = getFAQSchema(faqs, absoluteUrl("/programs"));

  const combinedSchema = [collectionSchema, breadcrumbSchema, faqSchema].filter(Boolean);

  return (
    <main>
      <JsonLd data={combinedSchema} id="programs-schema" />
      <ProgramsHero />
      <ComparisonTable />
      <GoogleTrustProof />
      <ProgramCards />
      <AdmissionProcess />
      <BatchFeeInfo batches={batches} />
      <ProgramsFAQ faqs={faqs} />
      <FinalCTA />
    </main>
  );
}

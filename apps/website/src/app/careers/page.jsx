import JsonLd from "@/components/JsonLd";

export const revalidate = 86400;
import CareersHero from "@/components/careerspage/CareersHero";
import WhyWorkAtSkillYards from "@/components/careerspage/WhyWorkAtSkillYards";
import LifeAtSkillYards from "@/components/careerspage/LifeAtSkillYards";
import OpenRoles from "@/components/careerspage/OpenRoles";
import HiringProcess from "@/components/careerspage/HiringProcess";
import CareersCTA from "@/components/careerspage/CareersCTA";
import PageHero from "@/components/PageHero";
import { getJobPostingSchema } from "@/lib/seo/schema/jobPostingSchema";
import { getCollectionPageSchema } from "@/lib/seo/schema/webPageSchema";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
    title: "Careers at SkillYards",
    description:
      "Explore career opportunities at SkillYards. Join our team of educators, engineers, and professionals shaping the future of skill-based learning in India.",
    path: "/careers",
    keywords: [
      "SkillYards careers",
      "Jobs at SkillYards",
      "EdTech jobs India",
      "Teaching jobs",
      "IT trainer jobs",
      "SkillYards hiring",
    ],
    ogImage: resolveOgImage(ogImages, "careers", "/images/opengraph/careers-og.jpg"),
  });
}

export default async function CareersPage() {
  const roles = [];

  const careersPageSchema = getCollectionPageSchema({
    url: "/careers",
    name: "Careers at SkillYards",
    description: "Explore career opportunities at SkillYards. Join our team of educators, engineers, and professionals shaping the future of skill-based learning in India."
  });

  return (
    <>
      <div className="bg-linear-to-b from-white via-zinc-50 to-zinc-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black text-neutral-900 dark:text-neutral-100 transition-colors duration-500">
        <CareersHero />
        <WhyWorkAtSkillYards />
        <LifeAtSkillYards />
        <OpenRoles roles={roles} />
        <HiringProcess />
        <CareersCTA />
      </div>

      <JsonLd
        data={careersPageSchema}
        id="careers-page-schema-skillyards"
      />

      {roles?.length > 0 &&
        roles.map((job) => (
          <JsonLd
            key={job.id}
            data={getJobPostingSchema(job)}
            id={`job-schema-${job.id}`}
          />
        ))}
    </>
  );
}
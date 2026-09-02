import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;
import PageHero from "@/components/PageHero";
import FAQsAccordion from "@/components/faqspage/FAQsAccordion";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getAllFaqCategories } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";
import JsonLd from "@/components/JsonLd";
const faqKeywords = [
    "SkillYards FAQs",
    "SkillYards questions",
    "IT training FAQs Agra",
    "full stack course questions",
    "digital marketing course FAQs",
    "BCA BBA admission questions",
    "SkillYards placement FAQ",
];

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
    title: "Frequently Asked Questions | SkillYards Agra",
    description:
        "Find clear answers to questions about SkillYards programs, admissions, fees, placement, BCA, BBA, Full-Stack Development, Digital Marketing, and more.",
    path: "/faqs",
    keywords: faqKeywords,
    ogImage: resolveOgImage(ogImages, "faqs", "/images/opengraph/faqs-og.jpg"),
  });
}

// Schema ownership map — each FAQ category gets FAQPage schema on exactly one page.
// Google's guidelines say if the same Q&A appears on multiple pages, mark up only one instance.
const FAQ_SCHEMA_OWNER = {
  bca: "/bca-training-program-in-agra",
  bba: "/bba-training-program-in-agra",
  fullstack: "/full-stack-web-development-training-in-agra",
  digitalmarketing: "/digital-marketing-course-in-agra",
  support: "/support",
  test: "/10-minutes-test",
  degrees: "/programs/on-job-degree",
  general: "/faqs",
  homepage: "/"
};

const CURRENT_PAGE = "/faqs";

export default async function FaqsPage() {
    const categories = await getAllFaqCategories();

    const categoriesMap = {};
    const schemaFaqs = [];
    for (const cat of categories) {
        categoriesMap[cat.slug] = { label: cat.title, description: cat.description, faqs: cat.faqs };
        // Only include in schema if this page is the designated owner for this category
        if (FAQ_SCHEMA_OWNER[cat.slug] === CURRENT_PAGE) {
            schemaFaqs.push(...cat.faqs);
        }
    }

    const faqSchema = getFAQSchema(schemaFaqs, absoluteUrl("/faqs"));
    const webPageSchema = getWebPageSchema({
        url: "/faqs",
        name: "Frequently Asked Questions | SkillYards Agra",
        description: "Find clear answers to questions about SkillYards programs, admissions, fees, placement, BCA, BBA, Full-Stack Development, Digital Marketing, and more.",
        keywords: faqKeywords
    });
    const combinedSchema = [faqSchema, webPageSchema].filter(Boolean);

    return (
        <>
            <JsonLd data={combinedSchema} id="faqs-page-schema" />
            <PageHero
                title="Frequently Asked Questions"
                subtitle="Everything you want to know about SkillYards — programs, admissions, fees, placement, and more. Organised by topic."
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "FAQs" },
                ]}
            />
            <FAQsAccordion categories={categoriesMap} />
        </>
    );
}

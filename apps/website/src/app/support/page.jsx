import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;
import SupportHero from "@/components/supportpage/SupportHero";
import SupportCategories from "@/components/supportpage/SupportCategories";
import SupportFAQ from "@/components/supportpage/SupportFAQ";
import SupportChannels from "@/components/supportpage/SupportChannels";
import JsonLd from "@/components/JsonLd";
import { getContactPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getPageFaqs, getAllFaqCategories } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";

export async function generateMetadata() {
    const ogImages = await getAllOgImages();
    return buildSEO({
        title: "Support Center | SkillYards Agra",
        description:
            "Get help with admissions, fees, placement, technical issues, and more. SkillYards support is available via WhatsApp, phone, and email.",
        path: "/support",
        keywords: [
            "SkillYards support",
            "SkillYards help center",
            "student support SkillYards",
            "IT training support Agra",
            "course enrollment assistance",
            "SkillYards contact support",
        ],
        ogImage: resolveOgImage(ogImages, "support", "/images/opengraph/support-og.jpg"),
    });
}

export default async function SupportPage() {
    const supportPageSchema = getContactPageSchema({
        url: "/support",
        name: "Support Center | SkillYards Agra",
        description: "Get help with admissions, fees, placement, technical issues, and more. SkillYards support is available via WhatsApp, phone, and email."
    });

    const categories = await getAllFaqCategories();
    const general = categories.find(c => c.slug === "general");
    const support = categories.find(c => c.slug === "support");

    const faqsByCategory = [
        { id: "admissions", label: "Admissions",    faqs: general?.faqs?.slice(0, 3) || [] },
        { id: "fees",       label: "Fees & Payments", faqs: general?.faqs?.slice(5, 8) || [] },
        { id: "placement",  label: "Placement",      faqs: general?.faqs?.slice(4, 6) || [] },
        { id: "technical",  label: "Technical",      faqs: support?.faqs?.slice(0, 2) || [] },
    ];

    const allSupportFaqs = faqsByCategory.flatMap(c => c.faqs);
    const faqSchema = getFAQSchema(allSupportFaqs, absoluteUrl("/support"));
    const combinedSchema = [supportPageSchema, faqSchema].filter(Boolean);

    return (
        <div className="w-full overflow-x-hidden">
            <JsonLd data={combinedSchema} id="support-page-schema" />
            <SupportHero />
            <SupportCategories />
            <SupportFAQ faqsByCategory={faqsByCategory} />
            <SupportChannels />
        </div>
    );
}

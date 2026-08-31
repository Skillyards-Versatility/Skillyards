import ComingSoon from "@/components/ComingSoon";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";

export async function generateMetadata() {
    const ogImages = await getAllOgImages();
    return buildSEO({
        title: "SkillYards Success Stories",
        description:
            "Discover real success stories from SkillYards students who transformed their careers through hands-on training, real projects, and industry-relevant skills.",
        path: "/success-stories",
        keywords: [
            "SkillYards success stories",
            "SkillYards student success",
            "Career transformation stories",
            "IT training success stories",
            "Skill-based learning outcomes",
            "Student career growth stories",
        ],
        ogImage: resolveOgImage(ogImages, "successStories", "/images/opengraph/success-stories-og.jpg"),
    });
}

export default function SuccessStoriesPage() {
    const webPageSchema = getWebPageSchema({
        url: "/success-stories",
        name: "SkillYards Success Stories",
        description: "Discover real success stories from SkillYards students who transformed their careers."
    });

    return (
        <>
            <JsonLd data={webPageSchema} id="success-stories-schema" />
            <ComingSoon
                title="Success Stories — Coming Soon"
                description="We’re collecting inspiring journeys of SkillYards students who turned learning into real career success. Stay tuned!"
            />
        </>
    );
}
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import TestimonialsHero from "@/components/testimonialspage/TestimonialsHero";
import TestimonialsGrid from "@/components/testimonialspage/TestimonialsGrid";
import VideoTestimonials from "@/components/testimonialspage/VideoTestimonials";
import TestimonialsCTA from "@/components/testimonialspage/TestimonialsCTA";

export async function generateMetadata() {
    const ogImages = await getAllOgImages();
    return buildSEO({
        title: "Student Testimonials & Reviews | SkillYards Agra",
        description:
            "Read authentic reviews from SkillYards students. Real stories on skill growth, on-job training, and career outcomes from our Full-Stack, Digital Marketing, BCA and BBA graduates.",
        path: "/testimonials",
        keywords: [
            "SkillYards testimonials",
            "SkillYards student reviews",
            "IT training reviews Agra",
            "SkillYards placement stories",
            "coding bootcamp reviews Agra",
            "SkillYards student feedback",
        ],
        ogImage: resolveOgImage(ogImages, "testimonials", "/images/opengraph/testimonials-og.jpg"),
    });
}

export default function TestimonialsPage() {
    const webPageSchema = getWebPageSchema({
        url: "/testimonials",
        name: "Student Testimonials & Reviews | SkillYards Agra",
        description: "Read authentic reviews from SkillYards students. Real stories on skill growth and career outcomes."
    });

    return (
        <div className="w-full overflow-x-hidden">
            <JsonLd data={webPageSchema} id="testimonials-schema" />
            <TestimonialsHero />
            <TestimonialsGrid />
            <VideoTestimonials />
            <TestimonialsCTA />
        </div>
    );
}

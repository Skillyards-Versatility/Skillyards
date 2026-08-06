import { buildSEO } from "@/lib/seo/buildSEO";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import { getQuizSchema } from "@/lib/seo/schema/serviceSchema";
import { getFAQSchema } from "@/lib/seo/schema/faqSchema";
import { getPageFaqs } from "@/lib/seo/getFaqs";
import { absoluteUrl } from "@/lib/seo/core/url";
import TestHero from "@/components/testpage/TestHero";
import TestTopics from "@/components/testpage/TestTopics";
import HowItWorks from "@/components/testpage/HowItWorks";
import CertificateSection from "@/components/testpage/CertificateSection";
import TestRegistrationForm from "@/components/testpage/TestRegistrationForm";
import TestFAQ from "@/components/testpage/TestFAQ";

export const revalidate = 3600;

export const metadata = buildSEO({
    title: "Free 10-Minute Skill Test | HTML, CSS, JS & SEO Certificate — SkillYards",
    description:
        "Take SkillYards' free 10-minute skill assessment in HTML, CSS, JavaScript, and SEO. Get an instant score, program recommendation, and a free certificate emailed to you.",
    path: "/10-minutes-test",
    keywords: [
        "free skill test",
        "HTML CSS JavaScript test",
        "SEO skill assessment",
        "free certificate online test",
        "web development quiz Agra",
        "SkillYards free test",
        "skill assessment with certificate",
    ],
});

export default async function TenMinuteTestPage() {
    const webPageSchema = getWebPageSchema({
        url: "/10-minutes-test",
        name: "Free 10-Minute Skill Test | SkillYards",
        description: "Take SkillYards' free 10-minute skill assessment in HTML, CSS, JavaScript, and SEO."
    });

    const quizSchema = getQuizSchema({
        url: "/10-minutes-test",
        name: "Skill assessment in HTML, CSS, JavaScript, and SEO",
        description: "Evaluate your core web development and digital marketing skills in just 10 minutes."
    });

    const faqs = await getPageFaqs("test", 999);
    const faqSchema = getFAQSchema(faqs, absoluteUrl("/10-minutes-test"));
    const combinedSchema = [webPageSchema, quizSchema, faqSchema].filter(Boolean);

    return (
        <div className="w-full overflow-x-hidden">
            <JsonLd data={combinedSchema} id="test-page-schema" />
            <TestHero />
            <TestTopics />
            <HowItWorks />
            <CertificateSection />
            <TestRegistrationForm />
            <TestFAQ faqs={faqs} />
        </div>
    );
}

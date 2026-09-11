import InfoCarouselSection from "@/app/landing/components/InforCarousalSection.js";
import FacilitiesSection from "@/app/landing/components/FacilitiesSection.js";
import PromoCards from "@/app/landing/components/Promocards.jsx";
import SkillyardsAdvantage from "@/app/landing/components/SkillyardsAdvantage.js";
import StatsStrip from "@/app/landing/components/Statsstrip.js";
import GoogleReviews from "@/app/landing/components/GoogleReviews.js";
import FaqAccordion from "@/app/landing/components/Faqaccordion.js";
import DigitalMarketingContent from "@/app/landing/components/DigitalMarketingContent.js";
import SuccessStories from "@/app/landing/components/Successstories.js";

export const revalidate = 86400;

export const metadata = {
    title: "SkillYards Agra Branch | IT & Digital Marketing Institute",
    description:
        "Learn IT & Digital Marketing skills at SkillYards Agra campus near Bhagwan Talkies. Hands-on training, UGC-certified degrees, and guaranteed placement support.",
};

export default function AgraBranchPage() {
    return (
        <main className="w-full overflow-x-hidden">
            <InfoCarouselSection />
            <FacilitiesSection />
            <PromoCards />
            <SkillyardsAdvantage />
            <StatsStrip />
            <GoogleReviews />
            <FaqAccordion />
            <DigitalMarketingContent />
            <SuccessStories />
        </main>
    );
}

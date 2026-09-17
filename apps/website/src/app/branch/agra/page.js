import InfoCarouselSection from "@/app/landing/components/InforCarousalSection.js";
import FacilitiesSection from "@/app/landing/components/FacilitiesSection.js";
import PromoCards from "@/app/landing/components/Promocards.jsx";
import SkillyardsAdvantage from "@/app/landing/components/SkillyardsAdvantage.js";
import StatsStrip from "@/app/landing/components/Statsstrip.js";
import GoogleReviews from "@/app/landing/components/GoogleReviews.js";
import FaqAccordion from "@/app/landing/components/Faqaccordion.js";
import DigitalMarketingContent from "@/app/landing/components/DigitalMarketingContent.js";
import SuccessStories from "@/app/landing/components/Successstories.js";

import JsonLd from "@/components/JsonLd.jsx";

export const revalidate = 86400;

export const metadata = {
  title: "SkillYards Agra Branch | IT & Digital Marketing Institute",
  description:
    "Learn IT & Digital Marketing skills at SkillYards Agra campus near Bhagwan Talkies. Hands-on training, UGC-certified degrees, and guaranteed placement support.",
  alternates: {
    canonical: "https://www.skillyards.in/branch/agra",
  },
};

const agraBranchSchema = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "LocalBusiness"],
  "@id": "https://www.skillyards.in/branch/agra#localbusiness",
  name: "Skillyards Versatility Pvt. Ltd.",
  alternateName: ["SkillYards Agra", "SkillYards"],
  url: "https://www.skillyards.in/branch/agra",
  telephone: "+91 70601 00562",
  email: "info@skillyards.in",
  priceRange: "₹₹",
  image: "https://www.skillyards.in/images/opengraph/home-og.jpg",
  logo: "https://www.skillyards.in/images/logo-square.png",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New Agra Colony",
    addressLocality: "Agra",
    addressRegion: "Uttar Pradesh",
    postalCode: "282005",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 27.211412,
    longitude: 78.0053434,
  },
  hasMap:
    "https://www.google.com/maps/place/Skillyards+Versatility+Pvt.+Ltd./@27.211412,78.0053434,17z/data=!3m1!4b1!4m6!3m5!1s0x3974776a3f3b61d9:0xc26cc82e5a39a7fc!8m2!3d27.211412!4d78.0053434!16s%2Fg%2F11y3ff92hf",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "00:00",
      closes: "00:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "212",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function AgraBranchPage() {
  return (
    <main className="w-full overflow-x-hidden">
      <JsonLd data={agraBranchSchema} id="agra-branch-schema" />
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

import WhatsAppCampaignClient from "@/components/campaigns/WhatsAppCampaignClient";

export const metadata = {
  title: "Contact SkillYards via WhatsApp",
  description: "Connect directly with SkillYards admissions and career advisors on WhatsApp.",
};

export default async function WhatsAppCampaignPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";

  return <WhatsAppCampaignClient whatsappNumber={whatsappNumber} />;
}

import { OJDCampaignPage } from "@/components/campaigns/OJDCampaignPage";
import { getAllTeamMembers } from "@/lib/sanity/getTeamMembers";

export default async function OJDCampaign() {
  const allMembers = await getAllTeamMembers();
  const mentorSlugs = ["neeraj-dang", "mrigesh-deshpande", "narendra-singh"];
  const mentorMembers = mentorSlugs
    .map((slug) => allMembers.find((m) => m.slug === slug))
    .filter(Boolean);

  return <OJDCampaignPage mentorMembers={mentorMembers} />;
}

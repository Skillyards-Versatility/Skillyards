import { OJDCampaignPage } from "@/components/campaigns/OJDCampaignPage";
import { getAllTeamMembers } from "@/lib/sanity/getTeamMembers";
import { TEAM_MEMBERS } from "@/data/teamData";

const MENTOR_FALLBACKS = {
  "neeraj-dang": {
    slug: "neeraj-dang",
    name: TEAM_MEMBERS.neerajDang.name,
    role: TEAM_MEMBERS.neerajDang.role,
    bio: TEAM_MEMBERS.neerajDang.bio,
    image: TEAM_MEMBERS.neerajDang.image,
  },
  "narendra-singh": {
    slug: "narendra-singh",
    name: TEAM_MEMBERS.narendraSingh.name,
    role: TEAM_MEMBERS.narendraSingh.role,
    bio: TEAM_MEMBERS.narendraSingh.bio,
    image: TEAM_MEMBERS.narendraSingh.image,
  },
};

export default async function OJDCampaign() {
  const allMembers = await getAllTeamMembers();
  const mentorSlugs = ["neeraj-dang", "narendra-singh"];
  const mentorMembers = mentorSlugs
    .map((slug) => {
      const sanityMember = allMembers.find((m) => m.slug === slug);
      return sanityMember || MENTOR_FALLBACKS[slug] || null;
    })
    .filter(Boolean);

  return <OJDCampaignPage mentorMembers={mentorMembers} />;
}


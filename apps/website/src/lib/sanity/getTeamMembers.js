import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { TEAM_MEMBERS_QUERY, TEAM_MEMBER_BY_SLUG_QUERY, TEAM_MEMBERS_SLUGS_QUERY } from "@/lib/sanity/queries";

function resolveImage(member) {
  if (!member) return member;
  return {
    ...member,
    id: member.slug,
    socials: member.socials || {},
    image: member.image ? urlFor(member.image).width(600).height(750).url() : "",
  };
}

export async function getAllTeamMembers() {
  try {
    const members = await sanityClient.fetch(TEAM_MEMBERS_QUERY, {}, { next: { revalidate: 3600 } });
    return (members || []).map(resolveImage);
  } catch (error) {
    console.error("Failed to fetch team members from Sanity:", error);
    return [];
  }
}

export async function getTeamMembersByGroup(group) {
  const members = await getAllTeamMembers();
  return members.filter((m) => m.groups?.includes(group)) || [];
}

export async function getTeamMemberBySlug(slug) {
  const member = await sanityClient.fetch(TEAM_MEMBER_BY_SLUG_QUERY, { slug }, { next: { revalidate: 3600 } });
  return resolveImage(member);
}

export async function getAllTeamSlugs() {
  const slugs = await sanityClient.fetch(TEAM_MEMBERS_SLUGS_QUERY, {}, { next: { revalidate: 3600 } });
  return slugs?.map((s) => s.slug).filter(Boolean) || [];
}

import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import TeamProfilePage from "@/components/teamprofile/TeamProfilePage";
import { TEAM_PROFILES } from "@/data/teamProfiles";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getPersonSchema } from "@/lib/seo/schema/personSchema";
import { getTeamMemberBySlug } from "@/lib/sanity/getTeamMembers";

export const revalidate = 86400;

export async function generateStaticParams() {
  return Object.keys(TEAM_PROFILES).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profile = TEAM_PROFILES[slug];

  if (!profile) return {};

  const sanityMember = await getTeamMemberBySlug(slug);

  return buildSEO({
    title: profile.seo.title,
    description: profile.seo.description,
    path: `/team/${profile.slug}`,
    keywords: profile.seo.keywords,
    ogImage: profile.seo.ogImage,
    noindex: sanityMember?.noindex || false,
  });
}

export default async function DynamicTeamPage({ params }) {
  const { slug } = await params;
  const profile = TEAM_PROFILES[slug];

  if (!profile) {
    notFound();
  }

  const schema = getPersonSchema({
    name: profile.name,
    role: profile.role,
    image: profile.image,
    url: `/team/${profile.slug}`,
    description: profile.bio,
  });

  return (
    <>
      <TeamProfilePage profile={profile} />
      <JsonLd data={schema} id={`${profile.slug}-schema`} />
    </>
  );
}

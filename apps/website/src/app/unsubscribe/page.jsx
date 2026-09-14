import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";
import { buildSEO } from "@/lib/seo/buildSEO";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";

export const metadata = buildSEO({
  title: "Unsubscribe from Emails",
  description:
    "Manage your email preferences on SkillYards. Unsubscribe from newsletters or promotional emails anytime.",
  path: "/unsubscribe",
  keywords: [
    "unsubscribe SkillYards",
    "email preferences",
    "newsletter unsubscribe",
    "SkillYards emails",
    "stop emails",
  ],
  // no ogImage → fallback will be used
});

export default function Page() {
  const webPageSchema = getWebPageSchema({
    url: "/unsubscribe",
    name: "Unsubscribe from Emails | SkillYards",
    description: "Manage your email preferences on SkillYards.",
  });

  return (
    <>
      <JsonLd data={webPageSchema} id="unsubscribe-webpage-schema" />
      <Suspense fallback={<Loading />}>
        <UnsubscribeClient />
      </Suspense>
    </>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-500">Loading unsubscribe page…</p>
    </div>
  );
}

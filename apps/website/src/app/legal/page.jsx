import PageHero from "@/components/PageHero";
import { buildSEO } from "@/lib/seo/buildSEO";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Shield,
  Wallet,
  Mail,
  Clock3,
} from "lucide-react";

export const revalidate = 86400;

export const metadata = buildSEO({
  title: "Legal Information | SkillYards",
  description:
    "Access SkillYards legal information including terms of service, privacy policy, refund policy, and other important guidelines for our website and training programs.",
  path: "/legal",
  keywords: [
    "SkillYards legal",
    "SkillYards policies",
    "SkillYards terms and conditions",
    "SkillYards privacy policy",
    "IT training institute in Agra policies",
    "SkillYards user policies",
  ],
  ogImage: "/images/opengraph/home-og.jpg",
});

const legalPages = [
  {
    title: "Privacy Policy",
    description:
      "Understand how SkillYards collects, uses, stores, and protects your personal information across our website and services.",
    href: "/legal/privacy-policy",
    icon: Shield,
  },
  {
    title: "Terms of Service",
    description:
      "Review the terms, responsibilities, and usage conditions that apply when you access SkillYards programs and website features.",
    href: "/legal/terms-of-service",
    icon: FileText,
  },
  {
    title: "Refund Policy",
    description:
      "Check the rules for cancellations, refund eligibility, processing timelines, and support for course-related payment issues.",
    href: "/legal/refund-policy",
    icon: Wallet,
  },
];

export default function LegalPage() {
  const webPageSchema = getWebPageSchema({
    url: "/legal",
    name: "Legal Information",
    description:
      "Access SkillYards legal information including terms of service, privacy policy, refund policy, and other important guidelines for our website and training programs.",
  });

  return (
    <>
      <JsonLd data={webPageSchema} id="legal-page-schema" />
      <PageHero
        title="Legal Information"
        description="Find the official policies that govern how SkillYards operates, how your data is handled, and how payments, access, and refunds are managed."
      />

      <div className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-12">
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary mb-4">
                Policy Overview
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                Clear access to the documents that matter before enrollment and
                while using our website.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                This section brings together the core SkillYards policy pages so
                learners, parents, and partners can quickly review our terms,
                privacy practices, and refund conditions.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-primary/[0.04] p-6 sm:p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                <Clock3 size={14} />
                Updated policy access in one place
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Need help understanding a policy?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    If you have questions about enrollment terms, refunds, or
                    how your information is used, contact our team directly.
                  </p>
                </div>
                <a
                  href="mailto:support@skillyards.in"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <Mail size={16} />
                  support@skillyards.in
                </a>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {legalPages.map((page) => {
              const Icon = page.icon;

              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={22} />
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">
                    {page.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {page.description}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-primary">
                    Read policy
                  </p>
                </Link>
              );
            })}
          </section>
        </div>
      </div>
    </>
  );
}

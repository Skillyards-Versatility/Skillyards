import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { HandshakeIcon, UserCheck, UserCog, BookOpen, CreditCard, Copyright, ShieldAlert, Ban, AlertTriangle, Scale, Globe, RefreshCw, Mail } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";

export async function generateMetadata() {
    const ogImages = await getAllOgImages();
    return buildSEO({
        title: "Terms of Service",
        description:
            "Read SkillYards' Terms of Service to understand the rules, responsibilities, and conditions for using our website, courses, and training programs.",
        path: "/terms-of-service",
        keywords: [
            "SkillYards Terms of Service",
            "SkillYards Terms and Conditions",
            "User agreement SkillYards",
            "Learning terms",
            "EdTech terms India",
            "Course usage policy",
        ],
        ogImage: resolveOgImage(ogImages, "terms", "/images/opengraph/terms-of-service-og.jpg"),
    });
}

const sections = [
    {
        id: "acceptance",
        number: "01",
        icon: HandshakeIcon,
        title: "Acceptance of Terms",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    By accessing or using SkillYards, you confirm that you have read, understood, and agreed to these Terms of Service, along with our Privacy Policy and Refund & Cancellation Policy.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    If you do not agree with any part of these terms, you should not use our website or services.
                </p>
            </div>
        ),
    },
    {
        id: "eligibility",
        number: "02",
        icon: UserCheck,
        title: "Eligibility",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                You must be at least 18 years old to create an account or enroll in paid programs on SkillYards. If you are under 18, you may use our services only with the involvement and consent of a parent or legal guardian.
            </p>
        ),
    },
    {
        id: "account",
        number: "03",
        icon: UserCog,
        title: "Account Registration",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    When creating an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    SkillYards reserves the right to suspend or terminate accounts found to be using false information or engaging in unauthorized activity.
                </p>
            </div>
        ),
    },
    {
        id: "access",
        number: "04",
        icon: BookOpen,
        title: "Course Access & Usage",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Upon successful payment, SkillYards grants you a limited, non-transferable, and non-exclusive license to access the enrolled course or program for personal learning purposes only.
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "Courses may include in-person classes, practical sessions, projects, and assessments",
                        "Access duration may vary depending on the program",
                        "Sharing login credentials or course content is strictly prohibited",
                    ].map((item) => (
                        <li key={item} className="flex gap-3">
                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: "payments",
        number: "05",
        icon: CreditCard,
        title: "Payments & Fees",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    All fees displayed on SkillYards are in Indian Rupees (INR), unless otherwise stated. Payments must be made in full at the time of enrollment.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Refunds, cancellations, and fee adjustments are governed by our{" "}
                    <Link href="/legal/refund-policy" className="text-primary font-medium hover:underline">Refund & Cancellation Policy</Link>.
                </p>
            </div>
        ),
    },
    {
        id: "ip",
        number: "06",
        icon: Copyright,
        title: "Intellectual Property",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    All content on SkillYards — including videos, text, graphics, logos, designs, course materials, and software — is the intellectual property of SkillYards or its content partners.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    You may not copy, reproduce, distribute, modify, or commercially exploit any content without prior written permission from SkillYards.
                </p>
            </div>
        ),
    },
    {
        id: "conduct",
        number: "07",
        icon: ShieldAlert,
        title: "User Conduct",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    You agree not to use SkillYards for any unlawful, harmful, or disruptive activities, including but not limited to:
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "Sharing offensive, abusive, or misleading content",
                        "Attempting to hack, disrupt, or reverse-engineer the website",
                        "Infringing on the rights or privacy of others",
                        "Misuse of certificates, credentials, or branding",
                    ].map((item) => (
                        <li key={item} className="flex gap-3">
                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: "termination",
        number: "08",
        icon: Ban,
        title: "Suspension & Termination",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                SkillYards reserves the right to suspend or terminate your access to the institute or website at its sole discretion, without prior notice, if you violate these terms or engage in activities that may harm SkillYards or its community.
            </p>
        ),
    },
    {
        id: "disclaimer",
        number: "09",
        icon: AlertTriangle,
        title: "Disclaimer of Warranties",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                SkillYards provides its services on an "as is" and "as available" basis. We do not guarantee uninterrupted access, error-free content, or specific learning or career outcomes.
            </p>
        ),
    },
    {
        id: "liability",
        number: "10",
        icon: Scale,
        title: "Limitation of Liability",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, SkillYards shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or services.
            </p>
        ),
    },
    {
        id: "law",
        number: "11",
        icon: Globe,
        title: "Governing Law",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of Indian courts.
            </p>
        ),
    },
    {
        id: "changes",
        number: "12",
        icon: RefreshCw,
        title: "Changes to These Terms",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                SkillYards may update these Terms of Service from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.
            </p>
        ),
    },
    {
        id: "contact",
        number: "13",
        icon: Mail,
        title: "Contact Information",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    If you have any questions regarding these Terms of Service, please contact us:
                </p>
                <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
                    <p className="font-bold text-sm text-foreground">SkillYards</p>
                    <p className="text-sm text-muted-foreground">
                        Email:{" "}
                        <a href="mailto:support@skillyards.in" className="text-primary hover:underline font-medium">
                            support@skillyards.in
                        </a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Website:{" "}
                        <a href="https://www.skillyards.in" className="text-primary hover:underline font-medium">
                            www.skillyards.in
                        </a>
                    </p>
                </div>
            </div>
        ),
    },
];

export default function TermsOfServicePage() {
    const lastUpdated = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const webPageSchema = getWebPageSchema({
        url: "/legal/terms-of-service",
        name: "Terms of Service",
        description: "Read SkillYards' Terms of Service to understand the rules, responsibilities, and conditions for using our website, courses, and training programs."
    });

    return (
        <>
            <JsonLd data={webPageSchema} id="terms-of-service-schema" />
            <PageHero
                title="Terms of Service"
                description="These Terms of Service outline the rules, responsibilities, and conditions that govern your use of our website, products, and services."
            />

            <div className="bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    {/* Last updated + note */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10 pb-6 border-b border-border">
                        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary/20">
                            <HandshakeIcon size={13} />
                            Governed by the laws of India
                        </div>
                    </div>

                    <div className="flex gap-12">
                        {/* Sticky TOC — desktop only */}
                        <aside className="hidden lg:block w-52 shrink-0">
                            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 shadow-sm">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Contents</p>
                                <nav className="space-y-1">
                                    {sections.map((s) => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-1 rounded"
                                        >
                                            <span className="text-[10px] font-bold text-primary/50">{s.number}</span>
                                            {s.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 space-y-6">
                            {sections.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div
                                        key={s.id}
                                        id={s.id}
                                        className="rounded-2xl border border-border bg-card p-6 shadow-sm scroll-mt-24"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary">
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-primary/60 tracking-widest">{s.number}</span>
                                                <h2 className="font-bold text-foreground text-base leading-tight">{s.title}</h2>
                                            </div>
                                        </div>
                                        {s.content}
                                    </div>
                                );
                            })}

                            {/* Footer note */}
                            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    By using SkillYards, you agree to these terms.{" "}
                                    <Link href="/legal/privacy-policy" className="text-primary font-semibold hover:underline">
                                        View Privacy Policy →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

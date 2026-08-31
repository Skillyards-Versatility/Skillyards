import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { Shield, Eye, Cookie, Share2, Lock, UserCheck, ExternalLink, RefreshCw, Mail } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";

export async function generateMetadata() {
    const ogImages = await getAllOgImages();
    return buildSEO({
        title: "Privacy Policy",
        description:
            "Read SkillYards' Privacy Policy to understand how we collect, use, protect, and manage your personal information when you use our website and services.",
        path: "/privacy-policy",
        keywords: [
            "SkillYards Privacy Policy",
            "Privacy Policy SkillYards",
            "Data protection policy",
            "User data privacy India",
            "EdTech privacy policy",
            "GDPR compliance India",
        ],
        ogImage: resolveOgImage(ogImages, "privacy", "/images/opengraph/privacy-policy-og.jpg"),
    });
}

const sections = [
    {
        id: "information",
        number: "01",
        icon: Eye,
        title: "Information We Collect",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    We collect information to provide better services and learning experiences. This includes:
                </p>
                <ul className="mt-4 space-y-3">
                    {[
                        { label: "Personal Information", desc: "Name, email address, phone number, educational background, and other details you provide during registration, enrollment, or communication." },
                        { label: "Usage Data", desc: "Pages visited, time spent on our website, interactions with content, and technical data such as browser type and device information." },
                        { label: "Payment Information", desc: "Payment-related details are processed securely by trusted third-party payment gateways. SkillYards does not store your card or banking information." },
                    ].map((item) => (
                        <li key={item.label} className="flex gap-3">
                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-semibold text-foreground">{item.label}: </span>
                                {item.desc}
                            </p>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        id: "usage",
        number: "02",
        icon: Shield,
        title: "How We Use Your Information",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    The information we collect is used for legitimate educational and operational purposes, including:
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "Providing access to courses, programs, and learning resources",
                        "Managing enrollments, certifications, and student support",
                        "Improving our platform, content, and user experience",
                        "Sending important updates, announcements, and learning-related communications",
                        "Ensuring platform security and preventing fraud or misuse",
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
        id: "cookies",
        number: "03",
        icon: Cookie,
        title: "Cookies & Tracking Technologies",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    SkillYards uses cookies and similar technologies to enhance your browsing experience. Cookies help us understand how users interact with our website, remember preferences, and improve performance.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    You can manage or disable cookies through your browser settings. However, disabling cookies may affect certain features of the website.
                </p>
            </div>
        ),
    },
    {
        id: "sharing",
        number: "04",
        icon: Share2,
        title: "Data Sharing & Disclosure",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    We respect your privacy and do not sell your personal data. Your information may be shared only in the following cases:
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "With trusted service providers who assist us in operating our website",
                        "When required by law, regulation, or legal process",
                        "To protect the rights, safety, and integrity of SkillYards and its users",
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
        id: "security",
        number: "05",
        icon: Lock,
        title: "Data Security",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to safeguard your personal information. While no system is completely secure, we continuously work to protect your data against unauthorized access, alteration, or disclosure.
            </p>
        ),
    },
    {
        id: "rights",
        number: "06",
        icon: UserCheck,
        title: "Your Rights & Choices",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    You have the right to access, update, or request deletion of your personal information. You may also opt out of non-essential communications at any time.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    To exercise these rights, please contact us using the details provided below.
                </p>
            </div>
        ),
    },
    {
        id: "third-party",
        number: "07",
        icon: ExternalLink,
        title: "Third-Party Links",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites or services. SkillYards is not responsible for the privacy practices or content of these external websites. We encourage you to review their privacy policies separately.
            </p>
        ),
    },
    {
        id: "updates",
        number: "08",
        icon: RefreshCw,
        title: "Updates to This Policy",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised "Last updated" date.
            </p>
        ),
    },
    {
        id: "contact",
        number: "09",
        icon: Mail,
        title: "Contact Us",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out to us:
                </p>
                <div className="mt-4 rounded-2xl border border-border bg-background p-4 space-y-2">
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

export default function PrivacyPolicyPage() {
    const lastUpdated = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const webPageSchema = getWebPageSchema({
        url: "/legal/privacy-policy",
        name: "Privacy Policy",
        description: "Read SkillYards' Privacy Policy to understand how we collect, use, protect, and manage your personal information when you use our website and services."
    });

    return (
        <>
            <JsonLd data={webPageSchema} id="privacy-policy-schema" />
            <PageHero
                title="Privacy Policy"
                description="This Privacy Policy explains how SkillYards collects, uses, protects, and shares your personal information when you use our website, services, and digital offerings."
            />

            <div className="bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    {/* Last updated + quick note */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10 pb-6 border-b border-border">
                        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary/20">
                            <Shield size={13} />
                            We do not sell your personal data
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
                                    By using SkillYards, you agree to the terms of this Privacy Policy.{" "}
                                    <Link href="/legal/terms-of-service" className="text-primary font-semibold hover:underline">
                                        View Terms of Service →
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

import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { FileText, BookOpen, CheckCircle, XCircle, AlertTriangle, Clock, MessageCircle, RefreshCw, Mail } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";

export async function generateMetadata() {
    const ogImages = await getAllOgImages();
    return buildSEO({
        title: "Refund Policy",
        description:
            "Review SkillYards' Refund Policy to understand eligibility, timelines, and conditions for refunds on courses, subscriptions, and training programs.",
        path: "/refund-policy",
        keywords: [
            "SkillYards Refund Policy",
            "Refund Policy SkillYards",
            "Course refund terms",
            "Training refunds",
            "EdTech refund policy India",
            "SkillYards cancellations",
        ],
        ogImage: resolveOgImage(ogImages, "refund", "/images/opengraph/refund-policy-og.jpg"),
    });
}

const sections = [
    {
        id: "general",
        number: "01",
        icon: FileText,
        title: "General Policy",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                SkillYards offers digital education programs, training services, and learning resources. By enrolling in any course or program, you acknowledge and agree to the terms outlined in this Refund & Cancellation Policy.
            </p>
        ),
    },
    {
        id: "enrollment",
        number: "02",
        icon: BookOpen,
        title: "Course Enrollment & Access",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Once payment is successfully completed and access to course materials, live sessions, or learning resources is provided, the enrollment is considered confirmed.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Due to the nature of digital content and limited-seat programs, refunds may not be available once access has been granted, except in specific cases mentioned below.
                </p>
            </div>
        ),
    },
    {
        id: "eligibility",
        number: "03",
        icon: CheckCircle,
        title: "Refund Eligibility",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Refunds may be considered under the following circumstances:
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "Duplicate payment made for the same course or program",
                        "Technical issues on our website that prevent access to the purchased content and cannot be resolved by our support team",
                        "Cancellation of a program or batch by SkillYards",
                    ].map((item) => (
                        <li key={item} className="flex gap-3">
                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                        </li>
                    ))}
                </ul>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Any approved refund will be processed after verification by our team.
                </p>
            </>
        ),
    },
    {
        id: "non-refundable",
        number: "04",
        icon: XCircle,
        title: "Non-Refundable Cases",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Refunds will <span className="font-semibold text-foreground">not</span> be provided in the following cases:
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "Change of mind after enrollment",
                        "Partial completion of a course or program",
                        "Failure to attend live sessions or use course materials",
                        "Delays caused by personal, academic, or professional reasons",
                        "Violation of SkillYards' Terms of Service or Code of Conduct",
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
        id: "cancellation",
        number: "05",
        icon: AlertTriangle,
        title: "Cancellation by SkillYards",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    SkillYards reserves the right to cancel or reschedule any course, batch, or training program due to unforeseen circumstances. In such cases, learners may be offered:
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "Enrollment in an alternative batch or program, or",
                        "A full or partial refund, as applicable",
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
        id: "processing",
        number: "06",
        icon: Clock,
        title: "Refund Processing Time",
        content: (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Approved refunds will be processed using the original payment method. Refund timelines may vary depending on the payment gateway or bank, typically ranging from{" "}
                    <span className="font-semibold text-foreground">7 to 10 business days</span>.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    SkillYards is not responsible for delays caused by banks or third-party payment providers.
                </p>
            </div>
        ),
    },
    {
        id: "request",
        number: "07",
        icon: MessageCircle,
        title: "How to Request a Refund",
        content: (
            <>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    To request a refund, please contact our support team with the following details:
                </p>
                <ul className="mt-4 space-y-2">
                    {[
                        "Registered name and email address",
                        "Course or program name",
                        "Payment reference or transaction ID",
                        "Reason for the refund request",
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
        id: "updates",
        number: "08",
        icon: RefreshCw,
        title: "Policy Updates",
        content: (
            <p className="text-sm text-muted-foreground leading-relaxed">
                SkillYards reserves the right to update or modify this Refund & Cancellation Policy at any time. Changes will be effective immediately upon posting on this page.
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
                    For any questions regarding refunds, cancellations, or this policy, please contact us:
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

export default function RefundPolicyPage() {
    const lastUpdated = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const webPageSchema = getWebPageSchema({
        url: "/legal/refund-policy",
        name: "Refund Policy",
        description: "Review SkillYards' Refund Policy to understand eligibility, timelines, and conditions for refunds on courses, subscriptions, and training programs."
    });

    return (
        <>
            <JsonLd data={webPageSchema} id="refund-policy-schema" />
            <PageHero
                title="Refund Policy"
                description="This Refund Policy explains the eligibility, process, and conditions under which refunds may be requested for our courses, services, or digital products."
            />

            <div className="bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    {/* Last updated + note */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-10 pb-6 border-b border-border">
                        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary/20">
                            <FileText size={13} />
                            Refunds processed within 7–10 business days
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
                                    Questions about a charge?{" "}
                                    <Link href="/support" className="text-primary font-semibold hover:underline">
                                        Contact our support team →
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

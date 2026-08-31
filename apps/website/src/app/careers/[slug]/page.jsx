import JsonLd from "@/components/JsonLd";

export const revalidate = 86400;
import ApplyForm from "@/components/careerspage/ApplyForm";
import Image from "next/image";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
import { getJobPostingSchema } from "@/lib/seo/schema/jobPostingSchema";


async function getJob(slug) {
  
    return {
        id: 1,
        title: "Sample Job Position",
        slug: slug,
        department: "Engineering",
        employment_type: "Full-Time",
        location: "Lucknow, India",
        experience_min: 0,
        experience_max: 2,
        description: "<p>This is a placeholder job description. Connect the API to see real job postings.</p>",
        responsibilities: "<ul><li>Collaborate with the team</li><li>Build amazing products</li></ul>",
        requirements: "<ul><li>Passion for learning</li><li>Strong communication skills</li></ul>",
        salary_min: null,
        salary_max: null,
        apply_deadline: null,
        created_at: new Date().toISOString(),
        qr_code: null,
    };
}

/* ----------------------------------------
   SEO Metadata (Dynamic – Single Job)
----------------------------------------- */
export async function generateMetadata({ params }) {
    const { slug } = params;

    const ogImages = await getAllOgImages();

    const job = await getJob(slug);

    if (!job) {
        return buildSEO({
            title: 'Job Not Found',
            description: 'The job you are looking for does not exist or has been closed.',
            path: '/careers',
            keywords: ['SkillYards careers', 'jobs at SkillYards'],
            ogImage: resolveOgImage(ogImages, 'careers', '/images/opengraph/careers-og.jpg'),
        });
    }

    const description =
        job.description
            ?.replace(/<[^>]+>/g, '')
            .slice(0, 160) ||
        `Apply for ${job.title} at SkillYards and grow your career with us.`;

    return buildSEO({
        title: `${job.title} | Careers at SkillYards`,
        description,
        path: `/careers/${job.slug}`,
        keywords: [
            job.title,
            job.department,
            job.location,
            'SkillYards jobs',
            'careers at SkillYards',
            'IT jobs India',
        ].filter(Boolean),

        // Separate OG images if you want
        ogImage: resolveOgImage(ogImages, 'careers', '/images/opengraph/careers-og.jpg'),
    });
}

/* ----------------------------------------
   Async server component
----------------------------------------- */
async function CareerJobPage({ params }) {
    const { slug } = await params;
    const job = await getJob(slug);

    const safeHtml = (html) => ({ __html: html || "" });

    if (!job) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-semibold">Job not found</h1>
                <p className="mt-2">This position may have been closed or removed.</p>
            </div>
        );
    }
    const isExpired =
        job.apply_deadline &&
        new Date(job.apply_deadline).getTime() < Date.now();
    return (
        <>
            <section className="bg-white dark:bg-neutral-950 py-20">
                <div className="mx-auto max-w-4xl px-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{job.title}</h1>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <span>{job.employment_type}</span>
                        {job.location && <span>• {job.location}</span>}
                        {job.experience_min !== null && <span>• {job.experience_min}–{job.experience_max ?? "+"} yrs experience</span>}
                    </div>

                    <div className="prose prose-neutral dark:prose-invert mt-10" dangerouslySetInnerHTML={safeHtml(job.description)} />

                    {job.responsibilities && (
                        <>
                            <h2 className="mt-10 text-xl font-semibold">Responsibilities</h2>
                            <div className="prose dark:prose-invert" dangerouslySetInnerHTML={safeHtml(job.responsibilities)} />
                        </>
                    )}

                    {job.requirements && (
                        <>
                            <h2 className="mt-10 text-xl font-semibold">Requirements</h2>
                            <div className="prose dark:prose-invert" dangerouslySetInnerHTML={safeHtml(job.requirements)} />
                        </>
                    )}
                </div>
            </section>

            {isExpired && (
                <section className="bg-red-50 dark:bg-red-950/30 border-y border-red-200 dark:border-red-900 py-10">
                    <div className="mx-auto max-w-3xl px-6 text-center">
                        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
                            Applications Closed
                        </h2>
                        <p className="mt-3 text-red-600 dark:text-red-400">
                            The application deadline for this role has passed.
                            You can still view the job details, but new applications are no longer accepted.
                        </p>
                    </div>
                </section>
            )}

            <section
                className={`py-20 transition ${
                    isExpired
                        ? "bg-neutral-100 dark:bg-neutral-900/60"
                        : "bg-neutral-50 dark:bg-neutral-900"
                }`}
            >
                <div
                    className={`mx-auto max-w-3xl px-6 ${
                        isExpired ? "opacity-50 pointer-events-none select-none" : ""
                    }`}
                >
                    <ApplyForm job={job} />
                </div>
            </section>

            {job.qr_code && (
                <section className="bg-white dark:bg-neutral-950 py-16 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="mx-auto max-w-sm px-6 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            Scan to apply instantly on your phone
                        </p>

                        <a
                            href={isExpired ? undefined : `https://admin.skillyards.in/qrcodes/${job.qr_code.uuid}`}
                            className={isExpired ? 'pointer-events-none' : ''}
                        >
                            <Image
                                src={`https://admin.skillyards.in/storage/qrcodes/${job.qr_code.uuid}.png`}
                                alt={`Apply for ${job.title}`}
                                width={192}
                                height={192}
                                unoptimized
                                className={`mx-auto rounded-lg border bg-white cursor-pointer transition ${
                                    isExpired
                                        ? "opacity-40 grayscale cursor-not-allowed"
                                        : "border-neutral-200 dark:border-neutral-800"
                                }`}
                            />
                        </a>


                        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-500">
                            Opens application form securely
                        </p>
                    </div>
                </section>
            )}
            <JsonLd data={getJobPostingSchema(job)} id={`job-schema-${job.id}`} />
        </>
    );
}

/* ----------------------------------------
   Default export wrapper
----------------------------------------- */
export default function CareerJobPageWrapper(props) {
    // Sync wrapper for Next.js App Router
    return <CareerJobPage {...props} />;
}

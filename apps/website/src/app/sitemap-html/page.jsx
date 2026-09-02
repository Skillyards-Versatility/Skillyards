import Link from "next/link";

export const revalidate = 86400;
import Breadcrumbs from "@/components/Breadcrumbs";
import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";
const BASE_URL = "https://www.skillyards.in";

const STATIC_SITEMAP_ROUTES = [
    { path: "/", label: "Home", section: "Company", priority: 1.0 },
    { path: "/about", label: "About Us", section: "Company" },
    { path: "/contact", label: "Contact", section: "Company" },

    { path: "/programs", label: "Programs", section: "Courses", priority: 0.9 },
    { path: "/programs/on-job-degree", label: "On-Job Degree Programs", section: "Courses", priority: 0.95 },
    { path: "/programs/on-job-training", label: "On-Job Training Programs", section: "Courses", priority: 0.95 },
    { path: "/bca-training-program-in-agra", label: "BCA Programs", section: "Courses", priority: 0.9 },
    { path: "/bba-training-program-in-agra", label: "BBA Programs", section: "Courses", priority: 0.9 },
    { path: "/full-stack-web-development-training-in-agra", label: "Full-Stack Development", section: "Courses", priority: 0.9 },
    { path: "/digital-marketing-course-in-agra", label: "Digital Marketing", section: "Courses", priority: 0.9 },

    { path: "/blog", label: "Blog", section: "Resources" },
    { path: "/faqs", label: "FAQs", section: "Resources" },
    { path: "/support", label: "Support", section: "Resources" },
    { path: "/10-minutes-test", label: "10-Minute Skill Test", section: "Resources" },

    { path: "/careers", label: "Careers", section: "Careers" },
    { path: "/team", label: "Our Team", section: "Company" },

    { path: "/testimonials", label: "Testimonials", section: "Students" },

    { path: "/legal/privacy-policy", label: "Privacy Policy", section: "Legal" },
    { path: "/legal/refund-policy", label: "Refund Policy", section: "Legal" },
    { path: "/legal/terms-of-service", label: "Terms of Service", section: "Legal" },
];

const LEADERS = [
    { path: "/suryanshupadhyay", name: "Suryansh Upadhyay" },
    { path: "/rahulsingh", name: "Rahul Singh" },
];

export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
    title: "HTML Sitemap | SkillYards",
    description:
      "Browse the complete HTML sitemap of SkillYards with quick access to all important pages.",
    path: "/sitemap",
    keywords: [
      "SkillYards sitemap",
      "HTML sitemap SkillYards",
      "website structure SkillYards",
      "all pages SkillYards",
    ],
    ogImage: resolveOgImage(ogImages, "sitemapHtml", "/images/opengraph/sitemap-og.jpg"),
  });
}

export default function SitemapPage() {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = groupBySection(STATIC_SITEMAP_ROUTES);

  return (
    <section className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 mt-10">
        <Breadcrumbs />

        <div className="mt-10 mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Site Structure</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">HTML Sitemap</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated on {lastUpdated}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(sections).map(([section, routes]) => (
            <div key={section} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 pb-2 border-b border-border">
                {section}
              </h2>
              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 pb-2 border-b border-border">
              Leadership
            </h2>
            <ul className="space-y-2">
              {LEADERS.map((leader) => (
                <li key={leader.path}>
                  <Link
                    href={leader.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                  >
                    {leader.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <SitemapSchema />
    </section>
  );
}

/* ---------------- Helpers ---------------- */

function groupBySection(routes) {
  return routes.reduce((acc, route) => {
    acc[route.section] ||= [];
    acc[route.section].push(route);
    return acc;
  }, {});
}

function SitemapSchema() {
  const items = STATIC_SITEMAP_ROUTES.map((route, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: route.label,
    url: `${BASE_URL}${route.path}`,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "SkillYards HTML Sitemap",
          itemListElement: items,
        }),
      }}
    />
  );
}

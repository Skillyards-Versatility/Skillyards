import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";

async function getFeaturedRoles() {
  return [];
}

export default async function FeaturedRoles() {
  const roles = await getFeaturedRoles();
  if (!roles.length) return null;
  return (
    <section className="relative py-24 bg-background" id="featured-roles">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
            Featured Opportunities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our team and make an impact. These are the roles we’re most
            excited about right now.
          </p>
        </div>

        {/* Featured Job Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={`/careers/${role.slug}`}
              className="relative flex h-full flex-col justify-between
                rounded-2xl border border-border
                bg-card p-6 md:p-8
                shadow-lg transition-all duration-300
                hover:-translate-y-2 hover:shadow-2xl"
            >
              <div>
                <h3 className="text-2xl font-bold text-primary">
                  {role.title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {role.department}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {role.employment_type}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {role.location}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/careers"
            className="inline-block rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}

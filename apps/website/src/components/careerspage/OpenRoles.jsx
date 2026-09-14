import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";

export default function OpenRoles({ roles = [] }) {
  // ⛔ Do not render section if no open roles
  if (!roles.length) return null;
  const isExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };
  return (
    <section
      className="relative py-24 bg-neutral-50 dark:bg-neutral-950"
      id="open-roles"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight">Open Roles</h2>
          <p className="mt-4 text-lg text-neutral-600">
            We’re growing thoughtfully. If you care about quality, learning, and
            real impact — you’ll feel at home here.
          </p>
        </div>

        {/* Roles */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const expired = isExpired(role.apply_deadline);
            return (
              <Link
                key={role.id}
                href={expired ? "#" : `/careers/${role.slug}`}
                className={`
                relative group flex flex-col justify-between
                rounded-2xl border
                bg-white p-7 shadow-sm transition
                ${expired ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-lg"}
                dark:border-neutral-800
                dark:bg-neutral-900
                dark:shadow-none
                ${!expired && "dark:hover:bg-neutral-800"}
            `}
                aria-disabled={expired}
              >
                {/* 🔴 Expired ribbon */}
                {expired && (
                  <span
                    className="
                    absolute -right-10 top-4
                    rotate-45
                    bg-red-600 text-white
                    text-xs font-bold
                    px-12 py-1
                    shadow-md
                "
                  >
                    EXPIRED
                  </span>
                )}

                <div>
                  <h3 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {role.title}
                  </h3>

                  <p className="mb-5 text-sm text-neutral-600 dark:text-neutral-400">
                    {role.department}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400">
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

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {expired ? "Applications Closed" : "View Role"}
                  {!expired && <ArrowRight className="h-4 w-4" />}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

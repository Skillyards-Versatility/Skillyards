"use client";

import Breadcrumbs from "@/components/Breadcrumbs";

export default function PageHero({
  title,
  description,
  className = "",
  showBreadcrumbs = true,
}) {
  return (
    <section
      className={`relative border-b
                bg-gray-50 dark:bg-gray-950
                border-gray-200 dark:border-gray-800
                mt-24
                ${className}
            `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        {showBreadcrumbs && <Breadcrumbs className="mb-4" />}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-3 max-w-3xl text-base text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";

export default function ComingSoon({
  title = "Coming Soon",
  description = "We’re working hard to bring this feature to life. Stay tuned for updates.",
  svgSrc = "/images/illustrations/coming-soon.svg",
  className = "",
}) {
  return (
    <section className={`mx-auto max-w-6xl px-6 py-24 ${className}`}>
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left: Illustration */}
        <div className="flex justify-center">
          <Image
            src={svgSrc}
            alt="Coming Soon"
            width={420}
            height={420}
            priority
            className="w-full max-w-md"
          />
        </div>

        {/* Right: Content */}
        <div className="text-center md:text-left space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
            {title}
          </h2>

          <p className="max-w-xl text-base text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

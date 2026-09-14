"use client";

import Link from "next/link";

export default function ServiceUnavailablePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-b from-white via-zinc-50 to-zinc-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black text-gray-900 dark:text-gray-100 px-4 text-center">
      <h1 className="text-7xl font-extrabold mb-4 text-yellow-500 dark:text-yellow-400">
        503
      </h1>
      <h2 className="text-3xl font-semibold mb-4">Service Unavailable</h2>
      <p className="mb-6 max-w-lg text-gray-700 dark:text-gray-400">
        Our servers are taking a short break ☕. Don’t worry, we’ll be back
        shortly. Please try again in a few minutes.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}

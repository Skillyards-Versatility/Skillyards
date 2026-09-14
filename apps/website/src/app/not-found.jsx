"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-b from-white via-zinc-50 to-zinc-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black text-gray-900 dark:text-gray-100 px-4">
      <h1 className="text-7xl font-extrabold mb-4 text-red-600 dark:text-red-500">
        404
      </h1>
      <h2 className="text-3xl font-semibold mb-4">Oops! Page Not Found</h2>
      <p className="text-center max-w-md mb-6 text-gray-700 dark:text-gray-400">
        We can&#39;t find the page you&#39;re looking for. Maybe it got lost in
        the cloud.
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

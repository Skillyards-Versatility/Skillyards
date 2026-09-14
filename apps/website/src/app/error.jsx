"use client";

import Link from "next/link";

export default function ServerErrorPage({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-b from-white via-zinc-50 to-zinc-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black text-gray-900 dark:text-gray-100 px-4">
      <h1 className="text-7xl font-extrabold mb-4 text-red-600 dark:text-red-500">
        500
      </h1>
      <h2 className="text-3xl font-semibold mb-4">
        Oops! Something Went Wrong
      </h2>
      <p className="text-center max-w-md mb-6 text-gray-700 dark:text-gray-400">
        We are really sorry, but it seems our servers tripped over something.
        Don’t worry, we are on it.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-lg transition"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

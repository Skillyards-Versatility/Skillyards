"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function StudentsError({ error, reset }) {
  useEffect(() => {
    console.error("[ADMIN] Students section error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Failed to load students</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">
        Could not load the students data. The backend might be unreachable.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function StudentDetailError({ error, reset }) {
  useEffect(() => {
    console.error("[ADMIN] Student detail error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Failed to load student</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">
        Could not load the student details. The backend might be temporarily unreachable.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
        <Link
          href="/students"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Students
        </Link>
      </div>
    </div>
  );
}

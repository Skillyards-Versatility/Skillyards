"use client";

import { useEffect } from "react";

export default function AuthenticatedError({ error, reset }) {
  useEffect(() => {
    console.error("[ADMIN] Authenticated section error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">
        Failed to load this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}

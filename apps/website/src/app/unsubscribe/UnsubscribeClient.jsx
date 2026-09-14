"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "idle" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Invalid or missing unsubscribe link.",
  );
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setLoading(true);
    setStatus("loading");

    // Demo mode
    setStatus("success");
    setMessage("You have been unsubscribed. (Demo mode)");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-neutral-950">
      <div className="max-w-md w-full rounded-xl bg-white dark:bg-neutral-900 p-6 shadow text-center">
        {/* INITIAL CONFIRMATION */}
        {status === "idle" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Unsubscribe from emails?
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              You’re about to stop receiving emails from SkillYards. We only
              send important updates — no spam.
            </p>

            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Yes, unsubscribe me"}
            </button>

            <p className="mt-4 text-xs text-gray-500">
              Changed your mind? Just close this page.
            </p>
          </>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <p className="text-sm text-gray-500">Processing your request…</p>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              You’ve been unsubscribed
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>

            <p className="mt-4 text-xs text-gray-500">
              You’re always welcome back
            </p>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Something went wrong
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

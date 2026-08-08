"use client";

import { Laptop } from "lucide-react";

export function LaptopOptedToggle({ value, onChange, id }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
        Laptop Opted
      </label>
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-border bg-background p-1 gap-1">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              value
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Opted
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              !value
                ? "bg-gray-100 text-gray-700 dark:bg-gray-850 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Not Opted
          </button>
        </div>
        <input type="hidden" id={id} value={value ? "true" : "false"} />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        {value
          ? "Student has opted for the institute-provided laptop."
          : "Student will arrange their own device."}
      </p>
    </div>
  );
}

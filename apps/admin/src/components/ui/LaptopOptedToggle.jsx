"use client";

import { Laptop } from "lucide-react";

export function LaptopOptedToggle({ value, onChange, id }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
        Laptop Opted
      </label>
      <div className="flex items-center gap-2">
        <div className="inline-flex w-full sm:w-auto rounded-lg border border-border bg-muted/40 p-1 gap-1">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              value
                ? "bg-emerald-600 text-white dark:bg-emerald-500 shadow-xs"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Opted
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              !value
                ? "bg-card text-foreground border border-border shadow-xs"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
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

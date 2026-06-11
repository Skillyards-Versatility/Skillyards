"use client"

import { cn } from "@/lib/utils"

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "border-primary/20 bg-primary/10 text-primary" },
  { value: "contacted", label: "Contacted", color: "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
  { value: "enrolled", label: "Enrolled", color: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
  { value: "closed", label: "Closed", color: "border-gray-200 bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" },
];

export function StatusBadge({ status, onClick, className }) {
  const option = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold uppercase transition-colors cursor-pointer",
        "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        option.color,
        className
      )}
    >
      {option.label}
    </button>
  );
}

export function StatusSelect({ value, onChange, onBlur, disabled, autoFocus, className }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      autoFocus={autoFocus}
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold uppercase transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer appearance-none",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
        STATUS_OPTIONS.find((o) => o.value === value)?.color || STATUS_OPTIONS[0].color,
        className
      )}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="normal-case">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export { STATUS_OPTIONS };

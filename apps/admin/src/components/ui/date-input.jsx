"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  parse,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  isValid,
} from "date-fns";

function isoToDisplay(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function displayToIso(display) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  const d = Number(dd),
    mo = Number(mm),
    y = Number(yyyy);
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1900) return "";
  const date = parse(display, "dd/MM/yyyy", new Date());
  if (!isValid(date)) return "";
  return `${yyyy}-${mm}-${dd}`;
}

function autoFormat(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length >= 5)
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function isoToDate(iso) {
  if (!iso) return null;
  const d = parse(iso, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : null;
}

function dateToIso(d) {
  return format(d, "yyyy-MM-dd");
}

export function DateInput({
  value,
  onChange,
  required,
  className = "input",
  disabled,
  ...rest
}) {
  const [display, setDisplay] = useState(() => isoToDisplay(value));
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(
    () => isoToDate(value) || new Date(),
  );
  const wrapRef = useRef(null);

  useEffect(() => {
    setDisplay(isoToDisplay(value));
    const d = isoToDate(value);
    if (d) setViewMonth(d);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleChange = (e) => {
    const formatted = autoFormat(e.target.value);
    setDisplay(formatted);
    const iso = displayToIso(formatted);
    onChange(iso);
    const d = isoToDate(iso);
    if (d) setViewMonth(d);
  };

  const pickDate = (d) => {
    const iso = dateToIso(d);
    onChange(iso);
    setDisplay(isoToDisplay(iso));
    setOpen(false);
  };

  const selected = isoToDate(value);
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="dd/mm/yyyy"
          maxLength={10}
          className={`${className} pr-10`}
          value={display}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          {...rest}
        />
        <button
          type="button"
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          aria-label="Open calendar"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-50"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-lg border border-border bg-background shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {format(viewMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div
                key={d}
                className="text-[10px] font-semibold text-muted-foreground text-center py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {days.map((d, i) => {
              const inMonth = isSameMonth(d, viewMonth);
              const isSelected = selected && isSameDay(d, selected);
              const today = isToday(d);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickDate(d)}
                  className={`text-xs h-8 rounded transition
                    ${isSelected ? "bg-primary text-primary-foreground font-semibold" : ""}
                    ${!isSelected && today ? "border border-primary text-primary font-semibold" : ""}
                    ${!isSelected && !today && inMonth ? "text-foreground hover:bg-muted" : ""}
                    ${!inMonth ? "text-muted-foreground/40 hover:bg-muted/50" : ""}
                  `}
                >
                  {format(d, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

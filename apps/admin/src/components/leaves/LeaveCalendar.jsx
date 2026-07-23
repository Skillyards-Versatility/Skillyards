"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, startOfDay, getDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LeaveCalendar({ leaves, isManagerOrAdmin }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;

  const dateFormat = "MMMM yyyy";

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Calculate empty days at the start to align with Sunday (0)
  const startingDayIndex = getDay(monthStart);
  const blanks = Array(startingDayIndex).fill(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Helper to get leaves for a specific day
  const getLeavesForDay = (day) => {
    return leaves.filter((leave) => {
      if (leave.status === "REJECTED") return false;
      const lStart = startOfDay(new Date(leave.startDate));
      const lEnd = startOfDay(new Date(leave.endDate || leave.startDate));
      const current = startOfDay(day);
      return current >= lStart && current <= lEnd;
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <h2 className="text-lg font-semibold text-foreground">
          {format(currentMonth, dateFormat)}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
            <div key={dayName} className="text-center text-xs font-semibold text-muted-foreground uppercase py-2">
              {dayName}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="min-h-[80px] sm:min-h-[100px] p-1 opacity-50 bg-muted/20 rounded-lg border border-transparent"></div>
          ))}

          {days.map((day) => {
            const dayLeaves = getLeavesForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toString()}
                className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 rounded-lg border flex flex-col gap-1 transition-colors ${
                  isToday ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card hover:bg-muted/10"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[60px] sm:max-h-[80px] custom-scrollbar">
                  {dayLeaves.map((leave, idx) => (
                    <div
                      key={`${leave.id}-${idx}`}
                      className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate font-medium ${
                        leave.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                      title={`${leave.userName || "Leave"} - ${leave.type} ${leave.isHalfDay ? `(${leave.halfDayPeriod})` : ""}`}
                    >
                      {isManagerOrAdmin ? leave.userName?.split(' ')[0] : leave.type}
                      {leave.isHalfDay && " (½)"}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

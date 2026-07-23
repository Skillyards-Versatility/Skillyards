"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, startOfDay, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function LeaveCalendar({ leaves, isManagerOrAdmin }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);

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
    if (getDay(day) === 0) return []; // Ignore Sundays completely
    
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
                onClick={() => {
                  if (dayLeaves.length > 0) {
                    setSelectedDateInfo({ date: day, leaves: dayLeaves });
                  }
                }}
                className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 rounded-lg border flex flex-col gap-1 transition-colors ${
                  dayLeaves.length > 0 ? "cursor-pointer" : ""
                } ${
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

      {selectedDateInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedDateInfo(null)}>
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Absentees</h3>
                <p className="text-sm text-muted-foreground">{format(selectedDateInfo.date, "EEEE, MMMM d, yyyy")}</p>
              </div>
              <button onClick={() => setSelectedDateInfo(null)} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              {selectedDateInfo.leaves.map((leave, idx) => (
                <div key={idx} className="flex flex-col p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{leave.userName || "You"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      leave.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{leave.type}</span>
                    {leave.isHalfDay && (
                      <>
                        <span>•</span>
                        <span>{leave.halfDayPeriod === "MORNING" ? "Morning Half-Day" : "Evening Half-Day"}</span>
                      </>
                    )}
                  </div>
                  {leave.reason && (
                    <p className="text-xs text-muted-foreground mt-2 bg-background p-2 rounded border border-border/50">{leave.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

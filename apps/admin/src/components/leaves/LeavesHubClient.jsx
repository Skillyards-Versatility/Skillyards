"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarRange, Check, X, Clock, Calendar as CalendarIcon, Info, LayoutList, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { applyLeave, getLeaves, updateLeaveStatus } from "@/actions/leaves";
import { LeaveCalendar } from "./LeaveCalendar";

export function LeavesHubClient({ userRole }) {
  const [leaves, setLeaves] = useState([]);
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(1.0);
  const [viewMode, setViewMode] = useState("list"); // list or calendar

  // Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("CASUAL");
  const [reason, setReason] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState("MORNING");

  const isManagerOrAdmin = userRole === "ADMIN" || userRole === "MANAGER";

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await getLeaves();
      if (res.success) {
        setLeaves(res.leaves || []);
        if (res.calendarLeaves) {
          setCalendarLeaves(res.calendarLeaves);
        }
        if (res.availableBalance !== undefined) {
          setAvailableBalance(res.availableBalance);
          if (res.availableBalance <= 0) {
            setType("UNPAID");
          }
        }
      }
    } catch (err) {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!startDate || (!isHalfDay && !endDate) || !reason) {
      toast.error("Please fill all fields");
      return;
    }

    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
      const confirmed = window.confirm(
        "Notice: You are applying for leave less than 2 days in advance. Standard policy requires at least 2 days notice.\n\nDo you want to proceed with submission?"
      );
      if (!confirmed) return;
    }
    
    try {
      setIsApplying(true);
      const res = await applyLeave({ 
        startDate, 
        endDate: isHalfDay ? startDate : endDate, 
        type, 
        reason, 
        isHalfDay, 
        halfDayPeriod: isHalfDay ? halfDayPeriod : null 
      });
      if (res.success) {
        toast.success("Leave applied successfully");
        setStartDate("");
        setEndDate("");
        setReason("");
        setIsHalfDay(false);
        setHalfDayPeriod("MORNING");
        fetchLeaves();
      } else {
        toast.error(res.message || "Failed to apply");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsApplying(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      let rejectionReason = undefined;
      
      if (status === "REJECTED") {
        const reason = window.prompt("Please provide a reason for rejection (optional):");
        if (reason === null) return; // User clicked Cancel
        rejectionReason = reason;
      }
      
      const res = await updateLeaveStatus(id, status, rejectionReason);
      if (res.success) {
        toast.success(`Leave ${status.toLowerCase()}`);
        setLeaves((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status } : l))
        );
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <CalendarRange className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Leave Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isManagerOrAdmin ? "Review team leave requests" : "Apply and manage your leaves"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border shadow-sm p-5 space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Apply for Leave
            </h2>
            <form onSubmit={handleApply} className="space-y-4 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="isHalfDay"
                  type="checkbox"
                  checked={isHalfDay}
                  onChange={(e) => setIsHalfDay(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="isHalfDay" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Request Half-Day
                </label>
              </div>

              <div className={`grid ${isHalfDay ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{isHalfDay ? "Date" : "Start Date"}</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                </div>
                {!isHalfDay && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      required={!isHalfDay}
                    />
                  </div>
                )}
              </div>

              {isHalfDay && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Half-Day Period</label>
                  <select
                    value={halfDayPeriod}
                    onChange={(e) => setHalfDayPeriod(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="MORNING">Morning</option>
                    <option value="EVENING">Evening</option>
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {availableBalance > 0 && (
                    <>
                      <option value="CASUAL">Casual Leave</option>
                      <option value="SICK">Sick Leave</option>
                    </>
                  )}
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  rows={3}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isApplying}
                className="w-full h-9 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>

        {/* Leaves List or Calendar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-primary" /> 
              {viewMode === "list" ? "Leave History" : "Leave Calendar"}
            </h2>
            <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md flex items-center justify-center transition-all ${
                  viewMode === "list" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-md flex items-center justify-center transition-all ${
                  viewMode === "calendar" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Calendar View"
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading...
            </div>
          ) : leaves.length === 0 ? (
            <div className="bg-card/50 rounded-xl border border-border border-dashed p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <CalendarRange className="w-8 h-8 opacity-50" />
              <p>No leaves found</p>
            </div>
          ) : viewMode === "calendar" ? (
            <LeaveCalendar leaves={[...leaves, ...calendarLeaves]} isManagerOrAdmin={isManagerOrAdmin} />
          ) : (
            leaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  {isManagerOrAdmin && (
                    <p className="font-medium text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {leave.userName}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="font-medium text-foreground">
                      {leave.type}
                      {leave.isHalfDay && (
                        <span className="ml-1 text-xs px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {leave.halfDayPeriod === "MORNING" ? "Morning Half-Day" : "Evening Half-Day"}
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {leave.isHalfDay ? (
                        format(new Date(leave.startDate), "MMM d, yyyy")
                      ) : (
                        `${format(new Date(leave.startDate), "MMM d, yyyy")} - ${format(new Date(leave.endDate), "MMM d, yyyy")}`
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{leave.reason}</p>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    leave.status === "PENDING" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                    leave.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}>
                    {leave.status}
                  </div>
                  
                  {isManagerOrAdmin && leave.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(leave.id, "APPROVED")}
                        className="p-1.5 rounded-md hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(leave.id, "REJECTED")}
                        className="p-1.5 rounded-md hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

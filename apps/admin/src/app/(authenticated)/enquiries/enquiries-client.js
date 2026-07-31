"use client";

import { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search, X, Download, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Mail, Phone, Inbox, Loader2, Check, RefreshCw, Pencil, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/Dialog";
import { StatusBadge, StatusSelect, STATUS_OPTIONS } from "@/components/ui/Select";
import { toast } from "sonner";

const SOURCE_OPTIONS = [
  { value: "website", label: "Website", color: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
  { value: "10_min_test", label: "10-min Test", color: "border-sky-200 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800" },
];

function SourceBadge({ source }) {
  const option = SOURCE_OPTIONS.find((o) => o.value === source) || SOURCE_OPTIONS[0];
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wider", option.color)}>
      {option.label}
    </span>
  );
}

const PAGE_SIZE = 10;

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function EnquiriesClient({
  enquiries,
  total,
  currentPage,
  totalPages,
  search: initialSearch,
  sort: initialSort,
  order: initialOrder,
  statusFilter: initialStatusFilter,
  sourceFilter: initialSourceFilter = "",
  isAdmin = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchInput, setSearchInput] = useState(initialSearch || "");
  const [detailEnquiry, setDetailEnquiry] = useState(null);
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [busy, setBusy] = useState(null);
  const tableRef = useRef(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  useEffect(() => {
    if (debouncedSearch !== (initialSearch || "")) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) params.set("search", debouncedSearch);
      else params.delete("search");
      params.set("page", "1");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    }
  }, [debouncedSearch]);

  const updateURL = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    });
    if (updates.page === undefined && !updates.search) params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }, [searchParams, pathname, router, startTransition]);

  const allSelected = enquiries.length > 0 && selectedIds.size === enquiries.length;
  const someSelected = selectedIds.size > 0;

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(enquiries.map((e) => e.id)));
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkStatus(status) {
    const ids = Array.from(selectedIds);
    const actionKey = `status:${status}`;
    const label = STATUS_OPTIONS.find((o) => o.value === status)?.label || status;
    const count = ids.length;
    setBusy(actionKey);
    const toastId = toast.loading(`Marking ${count} enquiry${count > 1 ? "ies" : "y"} as ${label.toLowerCase()}...`);
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(`${count} enquiry${count > 1 ? "ies" : "y"} marked as ${label.toLowerCase()}`, { id: toastId });
      setSelectedIds(new Set());
      router.refresh();
    } catch {
      toast.error(`Failed to mark as ${label.toLowerCase()}`, { id: toastId });
    } finally {
      setBusy(null);
    }
  }

  async function handleExportSelected() {
    const ids = Array.from(selectedIds);
    const count = ids.length;
    setBusy("export-selected");
    const toastId = toast.loading(`Exporting ${count} enquiry${count > 1 ? "ies" : "y"}...`);
    try {
      const res = await fetch("/enquiries/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skillyards-enquiries-selected-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${count} enquiry${count > 1 ? "ies" : "y"} exported`, { id: toastId });
    } catch {
      toast.error("Export failed", { id: toastId });
    } finally {
      setBusy(null);
    }
  }

  async function handleInlineStatus(enquiryId, newStatus) {
    const actionKey = `inline-status:${enquiryId}`;
    const label = STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus;
    setBusy(actionKey);
    const toastId = toast.loading(`Updating status to ${label.toLowerCase()}...`);
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [enquiryId], status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(`Status updated to ${label.toLowerCase()}`, { id: toastId });
      setEditingStatusId(null);
      router.refresh();
    } catch {
      toast.error("Failed to update status", { id: toastId });
    } finally {
      setBusy(null);
    }
  }

  function openEdit(enquiry) {
    setEditEnquiry(enquiry);
    setEditForm({
      firstName: enquiry.firstName || "",
      lastName: enquiry.lastName || "",
      email: enquiry.email || "",
      phone: enquiry.phone || "",
      message: enquiry.message || "",
    });
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editEnquiry || !editForm) return;
    setSavingEdit(true);
    const toastId = toast.loading("Updating enquiry...");
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editEnquiry.id, updates: editForm }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Enquiry updated", { id: toastId });
      setEditEnquiry(null);
      setEditForm(null);
      router.refresh();
    } catch {
      toast.error("Failed to update enquiry", { id: toastId });
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(enquiry) {
    if (!window.confirm(`Delete enquiry from ${enquiry.firstName || "this contact"}? This cannot be undone.`)) return;
    const toastId = toast.loading("Deleting enquiry...");
    try {
      const res = await fetch(`/api/enquiries?id=${enquiry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Enquiry deleted", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Failed to delete enquiry", { id: toastId });
    }
  }

  async function handleExportAll() {
    setBusy("export-all");
    const toastId = toast.loading("Exporting all enquiries...");
    try {
      const res = await fetch("/enquiries/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skillyards-enquiries-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("All enquiries exported", { id: toastId });
    } catch {
      toast.error("Export failed", { id: toastId });
    } finally {
      setBusy(null);
    }
  }

  async function handleSync() {
    setBusy("syncing");
    const toastId = toast.loading("Syncing enquiries...");
    try {
      const res = await fetch("/api/enquiries/refresh", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      const data = await res.json();
      toast.success(`${data.count} enquiries synced`, { id: toastId });
      router.refresh();
    } catch {
      toast.error("Sync failed", { id: toastId });
    } finally {
      setBusy(null);
    }
  }

  function toggleSort(column) {
    if (initialSort === column) {
      updateURL({ sort: column, order: initialOrder === "asc" ? "desc" : "asc" });
    } else {
      updateURL({ sort: column, order: "desc" });
    }
  }

  function SortHeader({ column, label, className }) {
    const isActive = initialSort === column;
    return (
      <th
        className={cn("px-5 py-3 font-semibold cursor-pointer select-none hover:text-foreground transition-colors", className)}
        onClick={() => toggleSort(column)}
      >
        <div className="flex items-center gap-1.5">
          {label}
          <span className="inline-flex flex-col -space-y-1.5 opacity-40">
            <ChevronUp className={cn("h-3 w-3", isActive && initialOrder === "asc" && "text-primary opacity-100")} />
            <ChevronDown className={cn("h-3 w-3", isActive && initialOrder === "desc" && "text-primary opacity-100")} />
          </span>
        </div>
      </th>
    );
  }

  const pageStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, total);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Enquiries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Website enquiries and 10-minute test registrations from prospective students.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSync}
            disabled={busy === "syncing"}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors",
              busy === "syncing"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted cursor-pointer",
            )}
          >
            <RefreshCw className={cn("h-4 w-4", busy === "syncing" && "animate-spin")} />
            Sync
          </button>
          <button
            type="button"
            onClick={handleExportAll}
            disabled={busy === "export-all"}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors",
              busy === "export-all"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted cursor-pointer",
            )}
          >
            {busy === "export-all" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {busy === "export-all" ? "Exporting..." : "Export All"}
          </button>
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
            <Inbox className="h-4 w-4 text-primary" />
            {total} total
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, phone or message..."
            className="input pl-10 pr-9 text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={initialStatusFilter || ""}
            onChange={(e) => updateURL({ status: e.target.value || null, page: "1" })}
            className="input w-auto text-sm py-2 pr-8"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            {[{ value: "", label: "All" }, ...SOURCE_OPTIONS].map((opt) => {
              const isActive = (initialSourceFilter || "") === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateURL({ source: opt.value || null, page: "1" })}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {(initialSearch || initialStatusFilter || initialSourceFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                const params = new URLSearchParams();
                startTransition(() => router.push(pathname));
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-sm font-semibold text-foreground mr-1">
            {selectedIds.size} selected
          </span>
          <div className="h-4 w-px bg-border mx-1" />
          <button
            type="button"
            onClick={handleExportSelected}
            disabled={busy === "export-selected"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-foreground bg-card border border-border transition-colors",
              busy === "export-selected"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted cursor-pointer",
            )}
          >
            {busy === "export-selected" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {busy === "export-selected" ? "Exporting..." : "Export"}
          </button>
          <div className="h-4 w-px bg-border mx-1" />
          <span className="text-xs text-muted-foreground">Mark as:</span>
          {STATUS_OPTIONS.map((opt) => {
            const actionKey = `status:${opt.value}`;
            const isBusy = busy === actionKey;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleBulkStatus(opt.value)}
                disabled={!!busy}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold uppercase transition-colors",
                  isBusy && "opacity-50 cursor-not-allowed",
                  !isBusy && busy && "opacity-40 cursor-not-allowed",
                  !busy && "hover:opacity-80 cursor-pointer",
                  opt.color,
                )}
              >
                {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                {isBusy ? "..." : opt.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            disabled={!!busy}
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              busy
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground cursor-pointer",
            )}
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}

      {/* Loading overlay */}
      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50 rounded-xl">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          {enquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <Inbox className="mb-4 h-10 w-10 text-muted-foreground/40" />
              <h2 className="text-base font-semibold text-foreground">No enquiries found</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {initialSearch || initialStatusFilter
                  ? "No enquiries match your current filters. Try adjusting your search."
                  : "New enquiries and test registrations will appear here as soon as they are submitted."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto" ref={tableRef}>
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                      />
                    </th>
                    <SortHeader column="firstName" label="Name" />
                    <SortHeader column="email" label="Contact" />
                    <th className="px-5 py-3 font-semibold">Message</th>
                    <SortHeader column="source" label="Source" className="text-center" />
                    <SortHeader column="status" label="Status" className="text-center" />
                    <SortHeader column="createdAt" label="Submitted" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enquiries.map((enquiry) => {
                    const fullName = [enquiry.firstName, enquiry.lastName].filter(Boolean).join(" ");
                    const isSelected = selectedIds.has(enquiry.id);
                    const isEditingStatus = editingStatusId === enquiry.id;

                    return (
                      <tr
                        key={enquiry.id}
                        className={cn(
                          "align-top transition-colors group",
                          isSelected ? "bg-primary/[0.03]" : "hover:bg-muted/30",
                        )}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(enquiry.id)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                          />
                        </td>

                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailEnquiry(enquiry)}
                              className="font-semibold text-foreground hover:text-primary transition-colors text-left"
                            >
                              {fullName || "—"}
                            </button>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => openEdit(enquiry)}
                                className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                                title="Edit enquiry"
                              >
                                <Pencil className="h-3 w-3 text-primary" />
                              </button>
                            )}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDelete(enquiry)}
                                className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 rounded-md border border-destructive/20 bg-destructive/5 px-1.5 py-1 text-[10px] font-semibold text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                                title="Delete enquiry"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <div className="space-y-1.5 text-muted-foreground">
                            <a
                              href={`mailto:${enquiry.email}`}
                              className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                            >
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate max-w-[180px]" title={enquiry.email}>{enquiry.email}</span>
                            </a>
                            {enquiry.phone && (
                              <a
                                href={`tel:${enquiry.phone}`}
                                className="flex items-center gap-2 transition-colors hover:text-primary"
                              >
                                <Phone className="h-3.5 w-3.5 shrink-0" />
                                {enquiry.phone}
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Message */}
                        <td className="max-w-sm px-5 py-4 text-foreground">
                          <p className="whitespace-pre-wrap break-words leading-relaxed line-clamp-2">
                            {enquiry.message}
                          </p>
                        </td>

                        {/* Source */}
                        <td className="px-5 py-4 text-center">
                          <SourceBadge source={enquiry.source || "website"} />
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center relative">
                          <div className="inline-block relative">
                            <StatusBadge
                              status={enquiry.status || "new"}
                              onClick={() => {
                                if (!busy) {
                                  setEditingStatusId(isEditingStatus ? null : enquiry.id);
                                }
                              }}
                            />

                            {isEditingStatus && (
                              <>
                                {/* Overlay to close on click outside */}
                                <div
                                  className="fixed inset-0 z-30 cursor-default"
                                  onClick={() => setEditingStatusId(null)}
                                />

                                {/* Dropdown Menu */}
                                <div className="absolute right-1/2 translate-x-1/2 mt-1.5 z-40 min-w-[125px] rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                                  <div className="flex flex-col gap-1">
                                    {STATUS_OPTIONS.map((opt) => {
                                      const isCurrent = (enquiry.status || "new") === opt.value;
                                      return (
                                        <button
                                          key={opt.value}
                                          type="button"
                                          onClick={() => {
                                            if (!isCurrent) {
                                              handleInlineStatus(enquiry.id, opt.value);
                                            } else {
                                              setEditingStatusId(null);
                                            }
                                          }}
                                          className={cn(
                                            "w-full text-left rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border",
                                            isCurrent
                                              ? "border-primary/20 bg-primary/10 text-primary font-bold cursor-default"
                                              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                                          )}
                                        >
                                          {opt.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {busy === `inline-status:${enquiry.id}` && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                            </span>
                          )}
                        </td>

                        {/* Submitted Date */}
                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                          <div>{formatDate(enquiry.createdAt)}</div>
                          <div className="text-xs">
                            {enquiry.createdAt
                              ? new Date(enquiry.createdAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {pageStart}-{pageEnd} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasPrevious}
              onClick={() => updateURL({ page: String(currentPage - 1) })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors",
                hasPrevious
                  ? "text-foreground hover:bg-muted cursor-pointer"
                  : "text-muted-foreground opacity-50 cursor-not-allowed",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={!hasNext}
              onClick={() => updateURL({ page: String(currentPage + 1) })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors",
                hasNext
                  ? "text-foreground hover:bg-muted cursor-pointer"
                  : "text-muted-foreground opacity-50 cursor-not-allowed",
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detailEnquiry} onOpenChange={(open) => { if (!open) setDetailEnquiry(null); }}>
        <DialogContent className="sm:max-w-lg">
          {detailEnquiry && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {[detailEnquiry.firstName, detailEnquiry.lastName].filter(Boolean).join(" ")}
                </DialogTitle>
                <DialogDescription>
                  Enquiry details and contact information
                </DialogDescription>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => { openEdit(detailEnquiry); setDetailEnquiry(null); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5 text-primary" />
                      Edit Details
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => { handleDelete(detailEnquiry); setDetailEnquiry(null); }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-5">
                {/* Status & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={detailEnquiry.status || "new"} />
                    <SourceBadge source={detailEnquiry.source || "website"} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(detailEnquiry.createdAt)}
                    {" • "}
                    {detailEnquiry.createdAt
                      ? new Date(detailEnquiry.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h4>
                  <div className="space-y-1.5">
                    <a
                      href={`mailto:${detailEnquiry.email}`}
                      className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {detailEnquiry.email}
                    </a>
                    {detailEnquiry.phone && (
                      <a
                        href={`tel:${detailEnquiry.phone}`}
                        className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {detailEnquiry.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</h4>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed text-foreground">
                      {detailEnquiry.message}
                    </p>
                  </div>
                </div>

                {/* Quick status change */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((opt) => {
                      const isBusy = busy === `inline-status:${detailEnquiry.id}`;
                      const isCurrent = (detailEnquiry.status || "new") === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            handleInlineStatus(detailEnquiry.id, opt.value);
                            setDetailEnquiry(null);
                          }}
                          disabled={isBusy}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold uppercase transition-all cursor-pointer",
                            isBusy && "opacity-50 cursor-not-allowed",
                            !isBusy && "hover:opacity-80",
                            isCurrent
                              ? "ring-2 ring-ring ring-offset-2 ring-offset-card font-bold"
                              : "",
                            opt.color,
                          )}
                        >
                          {isBusy ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : isCurrent ? (
                             <Check className="h-3 w-3" />
                          ) : null}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Enquiry Dialog */}
      <Dialog open={!!editEnquiry} onOpenChange={(open) => { if (!open) { setEditEnquiry(null); setEditForm(null); } }}>
        <DialogContent className="sm:max-w-lg">
          {editEnquiry && editForm && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Enquiry</DialogTitle>
                <DialogDescription>
                  Correct data-entry mistakes. This is restricted to admins.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="input text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="input text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="input text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="input text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={editForm.message}
                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                    className="input text-sm resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditEnquiry(null); setEditForm(null); }}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {savingEdit && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

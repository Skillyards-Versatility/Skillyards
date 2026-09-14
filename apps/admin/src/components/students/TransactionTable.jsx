"use client";

import { useState } from "react";
import { FileText, Download, Send, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/lib/api";
import { waitForReceiptReady } from "@/lib/receipt-utils";

export function TransactionsTable({ transactions = [] }) {
  const [loadingRows, setLoadingRows] = useState({});

  const setRowLoading = (id, action) =>
    setLoadingRows((prev) => ({ ...prev, [id]: action }));

  const clearRowLoading = (id) =>
    setLoadingRows((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleView = async (txn) => {
    setRowLoading(txn.id, "view");
    try {
      const result = await waitForReceiptReady(txn.id, API);
      if (result.status === "ready") window.open(result.url, "_blank");
    } catch (err) {
      toast.error(err?.message || "Failed to load receipt");
    } finally {
      clearRowLoading(txn.id);
    }
  };

  const handleDownload = async (txn) => {
    setRowLoading(txn.id, "download");
    try {
      const result = await waitForReceiptReady(txn.id, API);
      if (result.status !== "ready") return;

      const res = await fetch(result.url, { credentials: "include" });
      if (!res.ok) {
        toast.error(`Download failed (${res.status})`);
        return;
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/pdf")) {
        toast.error("Unexpected response — session may have expired");
        return;
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `receipt-${txn.id}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (err) {
      toast.error(err?.message || "Download failed");
    } finally {
      clearRowLoading(txn.id);
    }
  };

  const handleSend = async (txn) => {
    setRowLoading(txn.id, "send");
    try {
      const res = await fetch(`${API}/api/payments/${txn.id}/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Receipt sent successfully");
      } else {
        toast.error(data.message || "Failed to send receipt");
      }
    } catch (err) {
      toast.error("Failed to connect to email service");
    } finally {
      clearRowLoading(txn.id);
    }
  };

  if (!transactions.length) {
    return (
      <div className="card p-10 text-center text-sm text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-border space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Transactions</h3>
        <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 dark:bg-amber-950/30 dark:border-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-snug">
            Receipts are generated in the background. Allow up to{" "}
            <span className="font-semibold">1 minute</span> after recording a
            payment before <span className="font-semibold">Viewing</span> or{" "}
            <span className="font-semibold">Downloading</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Amount</th>
              <th className="px-5 py-3 text-left">Mode</th>
              <th className="px-5 py-3 text-left">Allocated To</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {transactions.map((txn) => {
              const loading = loadingRows[txn.id];
              return (
                <tr
                  key={txn.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4 text-muted-foreground">
                    {txn.date}
                  </td>

                  <td className="px-5 py-4 font-semibold text-foreground">
                    ₹{txn.amount.toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-muted text-foreground border border-border uppercase">
                      {txn.mode}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-foreground">
                    {txn.allocatedTo || "—"}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleView(txn)}
                        disabled={!!loading}
                        className="px-3 py-1.5 text-xs font-semibold border border-border rounded-md flex items-center gap-1.5 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading === "view" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                        {loading === "view" ? "Loading..." : "View"}
                      </button>

                      <button
                        onClick={() => handleDownload(txn)}
                        disabled={!!loading}
                        className="px-3 py-1.5 text-xs font-semibold border border-border rounded-md flex items-center gap-1.5 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading === "download" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        {loading === "download" ? "Downloading..." : "Download"}
                      </button>

                      <button
                        onClick={() => handleSend(txn)}
                        disabled={!!loading}
                        className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-md flex items-center gap-1.5 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading === "send" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        {loading === "send" ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

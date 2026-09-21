import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LedgerSection } from "./sections/LedgerSection";
import { StudentDataSection } from "./sections/StudentDataSection";
import { LedgerSkeleton, DetailsSkeleton } from "./sections/Skeletons";
import { getBatches } from "@/actions/batch";

export const dynamic = "force-dynamic";

import { API } from "@/lib/api";
import { getAuthHeaders, getSession } from "@/lib/auth";

async function getMegaData(id) {
  try {
    const res = await fetch(`${API}/api/students/${id}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] getMegaData:", err.message);
    return null;
  }
}

async function StudentDetailContent({ studentId }) {
  const [data, batches] = await Promise.all([
    getMegaData(studentId),
    getBatches(),
  ]);
  const session = await getSession();
  const canEdit = session?.role === "ADMIN";

  if (!data?.student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-xl font-bold text-foreground">Student Not Found</h1>
        <Link href="/students" className="mt-4 text-primary">
          ← Back to Students
        </Link>
      </div>
    );
  }

  const { student, ledger, plan, transactions } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3.5">
          <Link href="/students" className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-muted border border-border flex items-center justify-center text-primary font-bold text-base shrink-0 shadow-sm overflow-hidden">
            {student.photoKey ? (
              <img
                src={`/files/${student.photoKey}`}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>
                {(student.name || "S")
                  .trim()
                  .split(/\s+/)
                  .map((n) => n[0])
                  .filter(Boolean)
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {student.name}
              </h1>
              {student.courseName && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded border border-primary/20">
                  {student.courseName}
                </span>
              )}
            </div>
            {student.email && (
              <p className="text-muted-foreground text-sm mt-0.5">
                {student.email}
              </p>
            )}
          </div>
        </div>
      </div>

      <LedgerSection ledger={ledger} />
      <StudentDataSection
        student={student}
        plan={plan}
        payments={transactions}
        canEdit={canEdit}
        batches={batches}
      />
    </div>
  );
}

export default async function StudentDetailPage({ params }) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          <LedgerSkeleton />
          <DetailsSkeleton />
        </div>
      }
    >
      <StudentDetailContent studentId={id} />
    </Suspense>
  );
}

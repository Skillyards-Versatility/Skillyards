import { redirect } from "next/navigation";
import { getSettings } from "@/actions/settings";
import Link from "next/link";
import { API } from "@/lib/api";
import { getAuthHeaders, getSession } from "@/lib/auth";
import { StudentsDirectoryClient } from "@/components/students/StudentsDirectoryClient";

async function getStudents(limit = 100, offset = 0) {
  try {
    const res = await fetch(`${API}/api/students?limit=${limit}&offset=${offset}`, {
      headers: await getAuthHeaders(),
      next: {
        revalidate: 60,
        tags: ['students']
      }
    });

    if (!res.ok) {
      console.error(`[ADMIN][ERROR] Failed to fetch students: ${res.status} ${res.statusText}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] Network error fetching students:", err.message);
    return [];
  }
}

async function getBatches() {
  try {
    const res = await fetch(`${API}/api/batches`, {
      headers: await getAuthHeaders(),
      next: {
        revalidate: 60,
        tags: ['batches']
      }
    });

    if (!res.ok) {
      console.error(`[ADMIN][ERROR] Failed to fetch batches: ${res.status} ${res.statusText}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] Network error fetching batches:", err.message);
    return [];
  }
}

export default async function StudentsListPage({ searchParams }) {
  const settings = await getSettings();
  if (settings.students_feature === false) redirect("/dashboard");

  const { limit = 100, offset = 0 } = await searchParams;
  const [students, batches] = await Promise.all([
    getStudents(limit, offset),
    getBatches()
  ]);
  const session = await getSession();
  const canEdit = session?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Students Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student records, batches, and track financial ledgers.
          </p>
        </div>
        <Link
          href="/students/enroll"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-opacity shrink-0"
        >
          <span className="text-lg leading-none">+</span> Add Student
        </Link>
      </div>

      <StudentsDirectoryClient initialStudents={students} initialBatches={batches} canEdit={canEdit} />
    </div>
  );
}

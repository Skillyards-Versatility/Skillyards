"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { API } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth";

export async function getBatches(courseName = "") {
  try {
    const url = courseName
      ? `${API}/api/batches?courseName=${encodeURIComponent(courseName)}`
      : `${API}/api/batches`;
    const res = await fetch(url, {
      headers: await getAuthHeaders(),
      next: {
        revalidate: 60,
        tags: ["batches"],
      },
    });

    if (!res.ok) {
      console.error(`[ADMIN][ERROR] Failed to fetch batches: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("[ADMIN][ERROR] Network error fetching batches:", err.message);
    return [];
  }
}

export async function createBatch(batchData) {
  const res = await fetch(`${API}/api/batches`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(batchData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error?.fieldErrors
        ? Object.values(data.error.fieldErrors).flat().join(", ")
        : data?.error || "Failed to create batch"
    );
  }

  revalidateTag("batches");
  revalidatePath("/students");
  return data;
}

export async function assignStudentBatch(studentId, batchId, batchName) {
  const res = await fetch(`${API}/api/students/${studentId}/batch`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ batchId, batchName }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to assign batch to student");
  }

  revalidateTag("batches");
  revalidateTag("students");
  revalidateTag(`student-${studentId}`);
  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);
  return data;
}

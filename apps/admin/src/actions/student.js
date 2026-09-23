"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { API } from "@/lib/api";
import { getAuthHeaders, getSession, getRawToken } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || !["ADMIN", "MANAGER"].includes(session.role)) {
    throw new Error("Unauthorized: admin or manager access required");
  }
  return session;
}

export async function updateStudent(studentId, studentData) {
  try {
    await requireAdmin();

    const res = await fetch(`${API}/api/students/${studentId}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(studentData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.error?.fieldErrors
          ? Object.values(data.error.fieldErrors).flat().join(", ")
          : data?.error || "Failed to update student",
      );
    }

    revalidateTag("students");
    revalidateTag(`student-${studentId}`);
    revalidatePath(`/students/${studentId}`);
    return data;
  } catch (err) {
    console.error("[ADMIN][ERROR] updateStudent:", err.message);
    throw err;
  }
}

export async function deleteStudent(studentId) {
  try {
    await requireAdmin();

    const res = await fetch(`${API}/api/students/${studentId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to delete student");
    }

    revalidateTag("students");
    revalidatePath("/students");
    return data;
  } catch (err) {
    console.error("[ADMIN][ERROR] deleteStudent:", err.message);
    throw err;
  }
}

export async function updateStudentPlan(studentId, planData) {
  try {
    await requireAdmin();

    const res = await fetch(`${API}/api/students/${studentId}/plan`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(planData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update plan");
    }

    revalidateTag(`student-${studentId}`);
    revalidateTag("students");
    revalidatePath(`/students/${studentId}`);
    return data;
  } catch (err) {
    console.error("[ADMIN][ERROR] updateStudentPlan:", err.message);
    throw err;
  }
}

export async function updateInstallment(
  studentId,
  installmentId,
  installmentData,
) {
  try {
    await requireAdmin();

    const res = await fetch(
      `${API}/api/students/${studentId}/plan/installments/${installmentId}`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify(installmentData),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update installment");
    }

    revalidateTag(`student-${studentId}`);
    revalidatePath(`/students/${studentId}`);
    return data;
  } catch (err) {
    console.error("[ADMIN][ERROR] updateInstallment:", err.message);
    throw err;
  }
}

export async function createStudent(studentData) {
  try {
    const res = await fetch(`${API}/api/students`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(studentData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data?.error?.fieldErrors
          ? Object.values(data.error.fieldErrors).flat().join(", ")
          : data?.error || "Something went wrong",
      );
    }

    revalidateTag("students");
    return data;
  } catch (err) {
    console.error("[ADMIN][ERROR] createStudent:", err.message);
    throw err;
  }
}

export async function createStudentPlan(studentId, planData) {
  try {
    const res = await fetch(`${API}/api/students/${studentId}/plan`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(planData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create plan");
    }

    revalidateTag(`student-${studentId}`);
    revalidateTag("students");
    revalidatePath(`/students/${studentId}`);
    return data;
  } catch (err) {
    console.error("[ADMIN][ERROR] createStudentPlan:", err.message);
    throw err;
  }
}

export async function addFlexibleInstallment(studentId, installmentData) {
  try {
    const res = await fetch(
      `${API}/api/students/${studentId}/plan/installments`,
      {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(installmentData),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add installment");
    }

    revalidatePath(`/students/${studentId}`);
    return data.data;
  } catch (err) {
    console.error("[ADMIN][ERROR] addFlexibleInstallment:", err.message);
    throw err;
  }
}

export async function addStudentPayment(studentId, paymentData) {
  try {
    const res = await fetch(`${API}/api/students/${studentId}/payments`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg =
        typeof data.error === "string"
          ? data.error
          : data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat().join(", ")
            : data.error?.formErrors?.join(", ") ||
              data.message ||
              "Failed to record payment";
      throw new Error(errMsg);
    }

    revalidateTag(`student-${studentId}`);
    revalidateTag("students");
    revalidatePath(`/students/${studentId}`);
    return data;
  } catch (err) {
    console.error("[ADMIN][ERROR] addStudentPayment:", err.message);
    throw err;
  }
}

export async function uploadStudentPhoto(formData) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const file = formData.get("file");
  if (!file) return { error: "No file provided" };

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File must be under 5MB" };
  }

  try {
    const rawType = (file.type || "").split(";")[0].trim().toLowerCase();
    const nameExt = (file.name || "").split(".").pop()?.toLowerCase().trim() || "";

    let resolvedType = rawType;
    if (!resolvedType || resolvedType === "application/octet-stream") {
      const extMime = {
        png: "image/png",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        webp: "image/webp",
        jfif: "image/jpeg",
        avif: "image/avif",
        heic: "image/heic",
        heif: "image/heif",
      };
      resolvedType = extMime[nameExt] || "image/jpeg";
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([buffer], { type: resolvedType });
    const uploadFormData = new FormData();
    const safeExt = nameExt || (resolvedType === "image/png" ? "png" : "jpeg");
    uploadFormData.append("file", blob, `photo_${Date.now()}.${safeExt}`);

    const token = await getRawToken();
    const res = await fetch(`${API}/api/students/photo`, {
      method: "POST",
      headers: token ? { Cookie: `session=${token}` } : {},
      body: uploadFormData,
    });

    const result = await res.json();
    if (!result.success) {
      return { error: result.message || "Upload failed" };
    }

    return { success: true, photoKey: result.photoKey };
  } catch (err) {
    console.error("[ADMIN][ERROR] uploadStudentPhoto:", err);
    return { error: "Upload failed" };
  }
}

export async function updateStudentPhoto(studentId, photoKey) {
  try {
    await requireAdmin();
    return await updateStudent(studentId, { photoKey });
  } catch (err) {
    console.error("[ADMIN][ERROR] updateStudentPhoto:", err.message);
    throw err;
  }
}


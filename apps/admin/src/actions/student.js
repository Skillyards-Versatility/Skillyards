"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { API } from "@/lib/api";
import { getAuthHeaders, getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    throw new Error("Unauthorized: admin access required");
  }
  return session;
}

export async function updateStudent(studentId, studentData) {
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
        : data?.error || "Failed to update student"
    );
  }

  revalidateTag("students");
  revalidateTag(`student-${studentId}`);
  revalidatePath(`/students/${studentId}`);
  return data;
}

export async function updateStudentPlan(studentId, planData) {
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
}

export async function updateInstallment(studentId, installmentId, installmentData) {
  await requireAdmin();

  const res = await fetch(`${API}/api/students/${studentId}/plan/installments/${installmentId}`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify(installmentData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update installment");
  }

  revalidateTag(`student-${studentId}`);
  revalidatePath(`/students/${studentId}`);
  return data;
}

export async function createStudent(studentData) {
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
        : data?.error || "Something went wrong"
    );
  }

  revalidateTag("students");
  return data;
}

export async function createStudentPlan(studentId, planData) {
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
}

export async function addFlexibleInstallment(studentId, installmentData) {
  const res = await fetch(`${API}/api/students/${studentId}/plan/installments`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(installmentData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add installment");
  }

  revalidatePath(`/students/${studentId}`);
  return data.data;
}

export async function addStudentPayment(studentId, paymentData) {
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
          : data.error?.formErrors?.join(", ")
          || data.message
          || "Failed to record payment";
    throw new Error(errMsg);
  }

  revalidateTag(`student-${studentId}`);
  revalidateTag("students");
  revalidatePath(`/students/${studentId}`);
  return data;
}

import { desc } from "drizzle-orm";

import { db, enquiries as enquiriesTable } from "@repo/db";
import { getSession } from "@/lib/auth";
import { shouldFetch, getCachedEnquiries, setCachedEnquiries } from "@/lib/enquiries-cache";
import { EnquiriesClient } from "./enquiries-client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const VALID_SORT_COLUMNS = ["firstName", "email", "status", "createdAt"];

async function getAllEnquiries() {
  const session = await getSession();
  if (!["ADMIN", "MANAGER"].includes(session?.role)) {
    return [];
  }

  if (shouldFetch()) {
    const rows = await db
      .select()
      .from(enquiriesTable)
      .orderBy(desc(enquiriesTable.createdAt));
    setCachedEnquiries(rows);
  }

  return getCachedEnquiries() || [];
}

function matchesSearch(enquiry, q) {
  const s = q.toLowerCase();
  return (
    (enquiry.firstName || "").toLowerCase().includes(s) ||
    (enquiry.lastName || "").toLowerCase().includes(s) ||
    (enquiry.email || "").toLowerCase().includes(s) ||
    (enquiry.phone || "").includes(s) ||
    (enquiry.message || "").toLowerCase().includes(s)
  );
}

export default async function EnquiriesPage({ searchParams }) {
  const params = await searchParams;
  const requestedPage = Number(params?.page || 1);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.floor(requestedPage)
    : 1;
  const search = typeof params?.search === "string" ? params.search : "";
  const sort = typeof params?.sort === "string" ? params.sort : "createdAt";
  const order = typeof params?.order === "string" ? params.order : "desc";
  const statusFilter = typeof params?.status === "string" && params.status ? params.status : "";

  const allEnquiries = await getAllEnquiries();

  let filtered = allEnquiries;

  if (search) {
    const q = search;
    filtered = filtered.filter((e) => matchesSearch(e, q));
  }

  if (statusFilter) {
    filtered = filtered.filter((e) => e.status === statusFilter);
  }

  const sortColumn = VALID_SORT_COLUMNS.includes(sort) ? sort : "createdAt";
  const sortAsc = order === "asc";

  filtered.sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    if (sortColumn === "firstName") {
      aVal = `${a.firstName || ""} ${a.lastName || ""}`.trim();
      bVal = `${b.firstName || ""} ${b.lastName || ""}`.trim();
    }
    if (sortColumn === "createdAt") {
      const aTime = aVal ? new Date(aVal).getTime() : 0;
      const bTime = bVal ? new Date(bVal).getTime() : 0;
      return sortAsc ? aTime - bTime : bTime - aTime;
    }
    aVal = String(aVal || "").toLowerCase();
    bVal = String(bVal || "").toLowerCase();
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const offset = (currentPage - 1) * PAGE_SIZE;
  const enquiries = filtered.slice(offset, offset + PAGE_SIZE);

  return (
    <EnquiriesClient
      enquiries={enquiries}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      search={search}
      sort={sort}
      order={order}
      statusFilter={statusFilter}
    />
  );
}

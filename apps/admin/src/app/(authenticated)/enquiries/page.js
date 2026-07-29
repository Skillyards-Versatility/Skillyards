import { desc, eq } from "drizzle-orm";

import { db, enquiries as enquiriesTable, testLeads as testLeadsTable, testSessions as testSessionsTable } from "@repo/db";
import { getSession } from "@/lib/auth";
import { shouldFetch, getCachedEnquiries, setCachedEnquiries } from "@/lib/enquiries-cache";
import { EnquiriesClient } from "./enquiries-client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const VALID_SORT_COLUMNS = ["firstName", "email", "status", "createdAt", "source"];

function mapTestLead(lead, session) {
  const total = session?.questionsSnapshot?.length || 30;
  const rawScore = session?.score;
  const cappedScore = rawScore != null ? Math.min(rawScore, Math.round(total * 0.6)) : null;
  return {
    id: lead.id,
    firstName: lead.name,
    lastName: "",
    email: lead.email,
    phone: lead.phone,
    message: cappedScore != null ? `Score: ${cappedScore}` : "\u2014",
    status: lead.status === "registered" ? "new" : (lead.status || "new"),
    createdAt: lead.createdAt,
    source: lead.source || "10_min_test",
  };
}

function mapEnquiry(enquiry) {
  return {
    ...enquiry,
    lastName: enquiry.lastName || "",
    source: "website",
  };
}

async function getAllMerged() {
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

  const enquiries = (getCachedEnquiries() || []).map(mapEnquiry);

  const [leads, allSessions] = await Promise.all([
    db.select().from(testLeadsTable).orderBy(desc(testLeadsTable.createdAt)),
    db.select().from(testSessionsTable),
  ]);

  const sessionByLeadId = {};
  for (const s of allSessions) {
    const existing = sessionByLeadId[s.leadId];
    if (!existing || (s.completedAt && (!existing.completedAt || s.completedAt > existing.completedAt))) {
      sessionByLeadId[s.leadId] = s;
    }
  }

  const testLeads = leads.map((lead) => mapTestLead(lead, sessionByLeadId[lead.id]));

  return [...enquiries, ...testLeads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
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
  const sourceFilter = typeof params?.source === "string" && params.source ? params.source : "";

  const allEnquiries = await getAllMerged();

  let filtered = allEnquiries;

  if (search) {
    const q = search;
    filtered = filtered.filter((e) => matchesSearch(e, q));
  }

  if (statusFilter) {
    filtered = filtered.filter((e) => (e.status || "new") === statusFilter);
  }

  if (sourceFilter) {
    filtered = filtered.filter((e) => e.source === sourceFilter);
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
      sourceFilter={sourceFilter}
    />
  );
}

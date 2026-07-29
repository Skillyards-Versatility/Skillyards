import { desc, inArray } from "drizzle-orm";

import { db, enquiries as enquiriesTable, testLeads as testLeadsTable, testSessions as testSessionsTable } from "@repo/db";
import { getSession } from "@/lib/auth";

function normalizeRow(row, score) {
  if (row.name) {
    return {
      firstName: row.name,
      lastName: "",
      email: row.email,
      phone: row.phone,
      message: score != null ? `Score: ${score}` : "\u2014",
      status: row.status === "registered" ? "new" : (row.status || "new"),
      createdAt: row.createdAt,
      source: row.source || "10_min_test",
    };
  }
  return {
    firstName: row.firstName,
    lastName: row.lastName || "",
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status || "new",
    createdAt: row.createdAt,
    source: "website",
  };
}

export const dynamic = "force-dynamic";

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cellRef(rowIndex, columnIndex) {
  let column = "";
  let index = columnIndex;
  while (index > 0) {
    const remainder = (index - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    index = Math.floor((index - 1) / 26);
  }
  return `${column}${rowIndex}`;
}

function sheetXml(rows) {
  const xmlRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => {
          const ref = cellRef(rowIndex + 1, columnIndex + 1);
          return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${xmlRows}</sheetData>
</worksheet>`;
}

const encoder = new TextEncoder();
let crcTable;

function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[i] = c >>> 0;
  }
  return crcTable;
}

function crc32(bytes) {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUInt16(buffer, offset, value) {
  buffer[offset] = value & 0xff;
  buffer[offset + 1] = (value >>> 8) & 0xff;
}

function writeUInt32(buffer, offset, value) {
  buffer[offset] = value & 0xff;
  buffer[offset + 1] = (value >>> 8) & 0xff;
  buffer[offset + 2] = (value >>> 16) & 0xff;
  buffer[offset + 3] = (value >>> 24) & 0xff;
}

function zipDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = Math.max(date.getFullYear() - 1980, 0);
  return { date: (year << 9) | (month << 5) | day, time };
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function createZip(files) {
  const now = zipDateTime();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.content);
    const crc = crc32(dataBytes);

    const local = new Uint8Array(30 + nameBytes.length);
    writeUInt32(local, 0, 0x04034b50);
    writeUInt16(local, 4, 20);
    writeUInt16(local, 6, 0);
    writeUInt16(local, 8, 0);
    writeUInt16(local, 10, now.time);
    writeUInt16(local, 12, now.date);
    writeUInt32(local, 14, crc);
    writeUInt32(local, 18, dataBytes.length);
    writeUInt32(local, 22, dataBytes.length);
    writeUInt16(local, 26, nameBytes.length);
    writeUInt16(local, 28, 0);
    local.set(nameBytes, 30);

    localParts.push(local, dataBytes);

    const central = new Uint8Array(46 + nameBytes.length);
    writeUInt32(central, 0, 0x02014b50);
    writeUInt16(central, 4, 20);
    writeUInt16(central, 6, 20);
    writeUInt16(central, 8, 0);
    writeUInt16(central, 10, 0);
    writeUInt16(central, 12, now.time);
    writeUInt16(central, 14, now.date);
    writeUInt32(central, 16, crc);
    writeUInt32(central, 20, dataBytes.length);
    writeUInt32(central, 24, dataBytes.length);
    writeUInt16(central, 28, nameBytes.length);
    writeUInt16(central, 30, 0);
    writeUInt16(central, 32, 0);
    writeUInt16(central, 34, 0);
    writeUInt16(central, 36, 0);
    writeUInt32(central, 38, 0);
    writeUInt32(central, 42, offset);
    central.set(nameBytes, 46);
    centralParts.push(central);

    offset += local.length + dataBytes.length;
  }

  const centralDirectory = concatBytes(centralParts);
  const end = new Uint8Array(22);
  writeUInt32(end, 0, 0x06054b50);
  writeUInt16(end, 8, files.length);
  writeUInt16(end, 10, files.length);
  writeUInt32(end, 12, centralDirectory.length);
  writeUInt32(end, 16, offset);

  return concatBytes([...localParts, centralDirectory, end]);
}

function workbookBytes(enquiries) {
  const rows = [
    ["First Name", "Last Name", "Email", "Phone", "Message", "Source", "Status", "Submitted At"],
    ...enquiries.map((enquiry) => [
      enquiry.firstName,
      enquiry.lastName,
      enquiry.email,
      enquiry.phone,
      enquiry.message,
      enquiry.source || "website",
      enquiry.status || "new",
      enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString("en-IN") : "",
    ]),
  ];

  return createZip([
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Enquiries" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: sheetXml(rows),
    },
  ]);
}

export async function GET() {
  const session = await getSession();
  if (!["ADMIN", "MANAGER"].includes(session?.role)) {
    return new Response("Forbidden", { status: 403 });
  }

  const [enquiryRows, leadRows, allSessions] = await Promise.all([
    db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt)),
    db.select().from(testLeadsTable).orderBy(desc(testLeadsTable.createdAt)),
    db.select().from(testSessionsTable),
  ]);

  const scoreByLeadId = {};
  for (const s of allSessions) {
    const existing = scoreByLeadId[s.leadId];
    if (!existing || (s.completedAt && (!existing.completedAt || s.completedAt > existing.completedAt))) {
      scoreByLeadId[s.leadId] = s;
    }
  }

  const all = [
    ...enquiryRows.map(normalizeRow),
    ...leadRows.map((lead) => normalizeRow(lead, scoreByLeadId[lead.id]?.score)),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const bytes = workbookBytes(all);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="skillyards-enquiries-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request) {
  const session = await getSession();
  if (!["ADMIN", "MANAGER"].includes(session?.role)) {
    return new Response("Forbidden", { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { ids } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return Response.json({ error: "ids must be a non-empty array" }, { status: 400 });
  }

  const [enquiryRows, leadRows, allSessions] = await Promise.all([
    db.select().from(enquiriesTable).where(inArray(enquiriesTable.id, ids)).orderBy(desc(enquiriesTable.createdAt)),
    db.select().from(testLeadsTable).where(inArray(testLeadsTable.id, ids)).orderBy(desc(testLeadsTable.createdAt)),
    db.select().from(testSessionsTable),
  ]);

  const scoreByLeadId = {};
  for (const s of allSessions) {
    const existing = scoreByLeadId[s.leadId];
    if (!existing || (s.completedAt && (!existing.completedAt || s.completedAt > existing.completedAt))) {
      scoreByLeadId[s.leadId] = s;
    }
  }

  const all = [
    ...enquiryRows.map(normalizeRow),
    ...leadRows.map((lead) => normalizeRow(lead, scoreByLeadId[lead.id]?.score)),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const bytes = workbookBytes(all);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="skillyards-enquiries-selected-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

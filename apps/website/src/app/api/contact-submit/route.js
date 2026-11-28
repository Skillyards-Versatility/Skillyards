import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const ENQUIRY_API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_DB_URL =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_3Ziyfzo1MVng@ep-old-cell-aepno7oh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  let enquiryData = null;

  // 1. Attempt to post through the primary backend API if available
  if (ENQUIRY_API_URL) {
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const forwardedFor = request.headers.get("x-forwarded-for");
      const clientIp = (
        forwardedFor?.split(",").pop() ||
        request.headers.get("x-real-ip") ||
        ""
      ).trim();
      if (clientIp) headers["x-forwarded-for"] = clientIp;

      const enquiryResponse = await fetch(`${ENQUIRY_API_URL}/api/enquiries`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (enquiryResponse.ok) {
        try {
          enquiryData = await enquiryResponse.json();
        } catch {
          enquiryData = null;
        }
      }
    } catch (proxyError) {
      console.warn(
        "Backend API unavailable, falling back to direct database insertion:",
        proxyError.message,
      );
    }
  }

  // 2. Fallback: Directly insert into the Neon database so leads are never lost and appear in Admin Panel
  if (!enquiryData) {
    try {
      const sql = neon(DEFAULT_DB_URL);
      const rows = await sql`
        INSERT INTO enquiries (first_name, last_name, email, phone, message, status)
        VALUES (
          ${payload.firstName || "Applicant"},
          ${payload.lastName || ""},
          ${payload.email},
          ${payload.phone || ""},
          ${payload.message || "Website Demo Enquiry"},
          'new'
        )
        RETURNING id;
      `;

      enquiryData = {
        id: rows[0]?.id,
        message: "Enquiry submitted successfully.",
      };
    } catch (dbErr) {
      console.error("Direct DB insertion error:", dbErr);
      return NextResponse.json(
        { message: "Unable to submit your enquiry right now. Please try again." },
        { status: 502 },
      );
    }
  }

  // 3. Return success with confirmation token
  try {
    const token = crypto.randomUUID();
    const response = NextResponse.json({
      message: enquiryData?.message || "Enquiry submitted successfully.",
      redirectUrl: `/thank-you-contact?token=${token}`,
      enquirySubmitted: true,
      thankYouAccessGranted: true,
    });

    response.cookies.set("contact_thank_you_token", token, {
      httpOnly: true,
      maxAge: 120,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        message:
          enquiryData?.message ||
          "Enquiry submitted successfully. We could not open confirmation page, but your message was received.",
        redirectUrl: null,
        enquirySubmitted: true,
        thankYouAccessGranted: false,
      },
      { status: 201 },
    );
  }
}

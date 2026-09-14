import { NextResponse } from "next/server";
console.log(
  NextResponse.json(
    { error: "Invalid input" },
    { status: 400, headers: { "Access-Control-Allow-Origin": "*" } },
  ).headers.get("Access-Control-Allow-Origin"),
);

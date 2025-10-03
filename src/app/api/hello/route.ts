import { NextResponse } from "next/server";

export async function GET() {
  console.log("ESTAT_APP_ID at runtime:", process.env.ESTAT_APP_ID);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  return NextResponse.json({ message: "Hello from Next.js API!" });
}

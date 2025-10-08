/**
 * API endpoint to return a friendly greeting.
 * Useful for simple connectivity tests.
 */
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from Next.js API!" });
}

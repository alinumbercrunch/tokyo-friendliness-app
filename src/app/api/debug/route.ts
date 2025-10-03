import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }
  
  return NextResponse.json({
    message: "Debug info",
    estatAppId: process.env.ESTAT_APP_ID ? "✅ Set" : "❌ Missing",
    estatAppIdLength: process.env.ESTAT_APP_ID?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
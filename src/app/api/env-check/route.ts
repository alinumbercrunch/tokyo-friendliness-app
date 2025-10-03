import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    hasEstatAppId: !!process.env.ESTAT_APP_ID,
    estatAppIdLength: process.env.ESTAT_APP_ID?.length || 0,
    estatAppIdFirst5: process.env.ESTAT_APP_ID?.substring(0, 5) || "none",
    allEnvKeys: Object.keys(process.env).filter(key => key.includes("ESTAT")),
    timestamp: new Date().toISOString(),
  });
}
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { pingDb } from "@/lib/db-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const connected = await pingDb(4000);
  return NextResponse.json({ connected });
}

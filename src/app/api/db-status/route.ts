import { NextRequest, NextResponse } from "next/server";
import { staffGuard } from "@/lib/api-auth";
import { pingDb } from "@/lib/db-store";

export const dynamic = "force-dynamic";

/**
 * Admin-only database health check. Previously public, which leaked whether
 * the database was reachable/configured to anonymous visitors.
 */
export async function GET(req: NextRequest) {
  const guard = staffGuard(req);
  if ("response" in guard) return guard.response;

  const connected = await pingDb(4000);
  return NextResponse.json({ connected });
}

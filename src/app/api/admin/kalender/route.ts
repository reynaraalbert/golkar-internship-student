import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/api-auth";
import {
  deleteCalendarEvent,
  getAllCalendarEvents,
  normalizeCalendarEvent,
  saveCalendarEvent,
} from "@/lib/calendar-store";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();
  return NextResponse.json({ events: getAllCalendarEvents() });
}

/** Create an event, or update one when `id` matches an existing event. */
export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = (body as any)?.id;
  const existing = id ? getAllCalendarEvents().find((e) => e.id === id) : undefined;
  const result = normalizeCalendarEvent(body, existing);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  saveCalendarEvent(result.event);
  try {
    revalidatePath("/user/dashboard");
  } catch {
    // ignore
  }
  return NextResponse.json({ event: result.event, events: getAllCalendarEvents() });
}

export async function DELETE(req: NextRequest) {
  if (!requireAuth(req)) return unauthorized();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
  if (!deleteCalendarEvent(id)) {
    return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ events: getAllCalendarEvents() });
}

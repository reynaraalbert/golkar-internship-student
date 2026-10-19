import { NextResponse } from "next/server";
import { getCalendarEventsForUser } from "@/lib/calendar-store";
import { getSessionUser } from "@/lib/user-session";

export const dynamic = "force-dynamic";

/** Calendar events visible to the signed-in participant (scope "all" + those targeted at them). */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = getCalendarEventsForUser(user.id).map(({ userIds: _u, ...e }) => e);
  return NextResponse.json({ events });
}

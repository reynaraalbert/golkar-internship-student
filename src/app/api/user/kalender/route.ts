import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSessionToken, USER_AUTH_COOKIE } from "@/lib/user-auth";
import { getCalendarEventsForUser } from "@/lib/calendar-store";

export const dynamic = "force-dynamic";

/** Calendar events visible to the signed-in participant (scope "all" + those targeted at them). */
export async function GET() {
  const token = cookies().get(USER_AUTH_COOKIE)?.value;
  const session = verifyUserSessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = getCalendarEventsForUser(session.id).map(({ userIds: _u, ...e }) => e);
  return NextResponse.json({ events });
}

import { NextResponse } from "next/server";
import { getAllStudentUsers } from "@/lib/user-store";

export async function GET() {
  try {
    const users = getAllStudentUsers();
    // Strip passwords before returning
    const safeUsers = users.map(({ passwordHash: _pw, ...u }) => u);
    return NextResponse.json({ users: safeUsers });
  } catch {
    return NextResponse.json({ users: [] });
  }
}

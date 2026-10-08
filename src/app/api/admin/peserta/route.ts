import { NextResponse } from "next/server";
import { getAllStudentUsers, findStudentUserById, saveStudentUser } from "@/lib/user-store";

export async function GET() {
  try {
    const users = await getAllStudentUsers();
    // Strip passwords before returning
    const safeUsers = users.map(({ passwordHash: _pw, ...u }) => u);
    return NextResponse.json({ users: safeUsers });
  } catch {
    return NextResponse.json({ users: [] });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, statusMagang, bio } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
    const user = await findStudentUserById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const updated = await saveStudentUser({ ...user, id, statusMagang, ...(bio !== undefined ? { bio } : {}) });
    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


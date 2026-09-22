import { NextResponse } from "next/server";
import { USER_AUTH_COOKIE } from "@/lib/user-auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Berhasil keluar" });
  response.cookies.delete(USER_AUTH_COOKIE);
  return response;
}

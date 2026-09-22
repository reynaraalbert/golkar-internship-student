import crypto from "crypto";

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  expires: number;
}

function getSecret(): string {
  return process.env.USER_JWT_SECRET || "golkar-internship-user-secret-key-2026";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export const USER_AUTH_COOKIE = "golkar_user_token";

export function createUserSessionToken(user: { id: string; email: string; name: string }): string {
  const expires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payloadStr = JSON.stringify({ id: user.id, email: user.email, name: user.name, expires });
  const sig = sign(payloadStr);
  return Buffer.from(`${payloadStr}||${sig}`).toString("base64url");
}

export function verifyUserSessionToken(token: string | undefined): UserSessionPayload | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [payloadStr, sig] = decoded.split("||");
    if (!payloadStr || !sig) return null;

    const expectedSig = sign(payloadStr);
    if (sig !== expectedSig) return null;

    const data: UserSessionPayload = JSON.parse(payloadStr);
    if (Date.now() > data.expires) return null;

    return data;
  } catch {
    return null;
  }
}

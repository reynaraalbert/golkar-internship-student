import crypto from "crypto";

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  expires: number;
  /** Fingerprint of the password hash — lets us invalidate sessions on reset. */
  pv: string;
}

function getSecret(): string {
  const secret = process.env.USER_JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("USER_JWT_SECRET is not configured");
  }
  return "dev-only-insecure-user-secret";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export const USER_AUTH_COOKIE = "golkar_user_token";

/** Short, non-reversible fingerprint used to bind a session to a password. */
export function passwordFingerprint(passwordHash: string): string {
  return crypto.createHash("sha256").update(passwordHash).digest("hex").slice(0, 24);
}

export function createUserSessionToken(user: {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}): string {
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payloadStr = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    expires,
    pv: passwordFingerprint(user.passwordHash),
  });
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
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const data: UserSessionPayload = JSON.parse(payloadStr);
    if (Date.now() > data.expires) return null;
    if (!data.pv) return null; // Sessions issued before password binding are invalid.

    return data;
  } catch {
    return null;
  }
}

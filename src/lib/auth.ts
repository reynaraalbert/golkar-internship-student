/**
 * Lightweight admin authentication using HMAC-signed tokens.
 *
 * Tokens are signed with ADMIN_JWT_SECRET using SHA-256, making them
 * stateless — no in-memory session store needed. This survives server
 * hot-reloads and serverless function cold starts.
 */
import crypto from "crypto";

export interface AdminCredentials {
  username: string;
  password: string;
}

export function getAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

function getSecret(): string {
  return process.env.ADMIN_JWT_SECRET || "komisi-xiii-dpr-ri-super-secret-key-2024";
}

function signPayload(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  // payload = username + timestamp (valid for 7 days)
  const creds = getAdminCredentials();
  const username = creds?.username || "admin";
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${username}:${expires}`;
  const sig = signPayload(payload);
  // encode as base64url for safe cookie transport
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return false;
    // last part is sig, second-to-last is expires, rest is username
    const sig = parts[parts.length - 1];
    const expires = parseInt(parts[parts.length - 2], 10);
    if (isNaN(expires) || Date.now() > expires) return false;
    const payload = parts.slice(0, -1).join(":");
    const expectedSig = signPayload(payload);
    // Constant-time comparison
    if (sig.length !== expectedSig.length) return false;
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

// Legacy no-op (kept for backward compat — no longer needed with stateless tokens)
export function registerSession(_token: string): void {}
export function revokeSession(_token: string): void {}

export function verifyCredentials(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  if (!creds) return false;
  const a = Buffer.from(username);
  const b = Buffer.from(creds.username);
  const c = Buffer.from(password);
  const d = Buffer.from(creds.password);
  return (
    a.length === b.length && c.length === d.length &&
    crypto.timingSafeEqual(a, b) && crypto.timingSafeEqual(c, d)
  );
}

export const AUTH_COOKIE = "komisi_xiii_admin_token";

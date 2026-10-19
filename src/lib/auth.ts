/**
 * Admin authentication using HMAC-signed stateless tokens.
 *
 * Token payload (base64url): `<username>:<role>:<expires>:<hmac-sha256>`
 * The role is signed server-side so a client cannot elevate itself by editing
 * localStorage or the request body.
 */
import crypto from "crypto";
import { resolveSecret } from "@/lib/secrets";

export type AdminRole = "admin" | "seleksi";

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminSession {
  username: string;
  role: AdminRole;
  expires: number;
}

export const AUTH_COOKIE = "golkar_internship_admin_token";

export function getAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

function getSecret(): string {
  return resolveSecret(process.env.ADMIN_JWT_SECRET, "ADMIN_JWT_SECRET");
}

function signPayload(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(role: AdminRole = "admin"): string {
  const creds = getAdminCredentials();
  const username = creds?.username || "admin";
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${username}:${role}:${expires}`;
  const sig = signPayload(payload);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function getSessionFromToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return null;

    const sig = parts[parts.length - 1];
    const expires = Number.parseInt(parts[parts.length - 2], 10);
    if (!Number.isFinite(expires) || Date.now() > expires) return null;

    const payload = parts.slice(0, -1).join(":");
    const expectedSig = signPayload(payload);
    if (sig.length !== expectedSig.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

    // Legacy tokens were `<username>:<expires>:<sig>` and always belonged to
    // the full admin role.
    const role: AdminRole = parts.length >= 4 && parts[parts.length - 3] === "seleksi" ? "seleksi" : "admin";
    const username = parts.slice(0, -2).join(":");

    return { username, role, expires };
  } catch {
    return null;
  }
}

export function isValidToken(token: string | undefined): boolean {
  return getSessionFromToken(token) !== null;
}

// Legacy no-op (kept for backward compat — tokens are stateless)
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

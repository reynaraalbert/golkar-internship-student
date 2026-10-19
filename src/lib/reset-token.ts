import crypto from "crypto";

/**
 * Reset tokens are generated as 32 random bytes (64 hex chars). Only the
 * SHA-256 hash is stored in the database; the raw token is sent by email.
 */
export const RESET_TOKEN_LENGTH = 64;

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function isValidResetTokenShape(token: unknown): token is string {
  return typeof token === "string" && /^[a-f0-9]{64}$/i.test(token);
}

import crypto from "crypto";

/**
 * Resolves a signing secret without ever breaking authentication at runtime.
 *
 * Priority:
 *  1. The explicit env var (e.g. USER_JWT_SECRET) when present.
 *  2. A key derived from another server-only secret (ADMIN_JWT_SECRET, then
 *     DATABASE_URL) with domain separation, so each purpose still gets a
 *     distinct key.
 *  3. A development-only constant.
 *
 * Deriving keeps existing deployments working when a new env var has not been
 * added yet. Set the dedicated env var in production for full isolation.
 */
export function resolveSecret(explicit: string | undefined, label: string): string {
  if (explicit && explicit.trim().length > 0) return explicit;

  const base = process.env.ADMIN_JWT_SECRET || process.env.DATABASE_URL;
  if (base && base.length >= 16) {
    console.warn(
      `[auth] ${label} belum diset. Memakai kunci turunan; set env ${label} di production.`
    );
    return crypto.createHmac("sha256", base).update(`gis:${label}`).digest("hex");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `${label} tidak dikonfigurasi dan tidak ada secret dasar (ADMIN_JWT_SECRET/DATABASE_URL).`
    );
  }

  return `dev-only-${label}`;
}

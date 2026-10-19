import { describe, it, expect, afterEach } from "vitest";
import { resolveSecret } from "@/lib/secrets";

const ORIGINAL = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("resolveSecret", () => {
  it("memakai env var eksplisit bila tersedia", () => {
    process.env.USER_JWT_SECRET = "explicit-secret-value";
    expect(resolveSecret(process.env.USER_JWT_SECRET, "USER_JWT_SECRET")).toBe("explicit-secret-value");
  });

  it("menurunkan kunci stabil bila env khusus belum diset (production)", () => {
    Object.defineProperty(process.env, "NODE_ENV", { value: "production", configurable: true, writable: true });
    delete process.env.USER_JWT_SECRET;
    process.env.ADMIN_JWT_SECRET = "base-secret-abcdefghijklmnop";
    const a = resolveSecret(undefined, "USER_JWT_SECRET");
    const b = resolveSecret(undefined, "USER_JWT_SECRET");
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
    // Domain separation: secret admin != secret peserta.
    expect(a).not.toBe(resolveSecret(undefined, "ADMIN_JWT_SECRET"));
  });

  it("tidak melempar error saat production selama ada secret dasar", () => {
    Object.defineProperty(process.env, "NODE_ENV", { value: "production", configurable: true, writable: true });
    delete process.env.USER_JWT_SECRET;
    delete process.env.ADMIN_JWT_SECRET;
    process.env.DATABASE_URL = "postgresql://user:pass@host:5432/db";
    expect(() => resolveSecret(undefined, "USER_JWT_SECRET")).not.toThrow();
  });
});

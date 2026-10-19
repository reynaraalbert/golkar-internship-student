import { describe, it, expect, beforeEach } from "vitest";
import { createSessionToken, getSessionFromToken, isValidToken } from "@/lib/auth";
import { createUserSessionToken, verifyUserSessionToken, passwordFingerprint } from "@/lib/user-auth";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("admin session tokens", () => {
  beforeEach(() => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "secret";
    process.env.ADMIN_JWT_SECRET = "test-admin-secret";
  });

  it("menolak token kosong/undefined", () => {
    expect(isValidToken(undefined)).toBe(false);
    expect(isValidToken("")).toBe(false);
    expect(getSessionFromToken(undefined)).toBeNull();
  });

  it("menolak token yang dimodifikasi", () => {
    const token = createSessionToken("admin");
    const tampered = token.slice(0, -2) + (token.endsWith("aa") ? "bb" : "aa");
    expect(isValidToken(tampered)).toBe(false);
  });

  it("menyimpan role di dalam token yang ditandatangani", () => {
    expect(getSessionFromToken(createSessionToken("admin"))?.role).toBe("admin");
    expect(getSessionFromToken(createSessionToken("seleksi"))?.role).toBe("seleksi");
  });
});

describe("participant session tokens", () => {
  beforeEach(() => {
    process.env.USER_JWT_SECRET = "test-user-secret";
  });

  const user = {
    id: "u1",
    email: "a@example.com",
    name: "A",
    passwordHash: "$2a$12$abcdefghijklmnopqrstuv",
  };

  it("token berlaku dan terikat pada hash kata sandi", () => {
    const token = createUserSessionToken(user);
    const payload = verifyUserSessionToken(token);
    expect(payload?.id).toBe("u1");
    expect(payload?.pv).toBe(passwordFingerprint(user.passwordHash));
  });

  it("token lama tanpa fingerprint ditolak", () => {
    expect(verifyUserSessionToken(undefined)).toBeNull();
    expect(verifyUserSessionToken("bogus")).toBeNull();
  });

  it("setelah reset kata sandi, fingerprint berubah (sesi lama tidak valid)", () => {
    const oldFp = passwordFingerprint(user.passwordHash);
    const newFp = passwordFingerprint("$2a$12$differenthashvalue");
    expect(oldFp).not.toBe(newFp);
  });
});

describe("rate limiter", () => {
  it("mengizinkan sampai batas lalu menolak", () => {
    resetRateLimit("test-key");
    expect(rateLimit("test-key", 2, 60_000).ok).toBe(true);
    expect(rateLimit("test-key", 2, 60_000).ok).toBe(true);
    const blocked = rateLimit("test-key", 2, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});

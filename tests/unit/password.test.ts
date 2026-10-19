import { describe, it, expect } from "vitest";
import {
  validateStrongPassword,
  hashPassword,
  verifyPassword,
  isBcryptHash,
} from "@/lib/password-utils";

describe("validateStrongPassword", () => {
  it("menolak kata sandi pendek", () => {
    expect(validateStrongPassword("Ab1!")).toMatch(/minimal 8/);
  });

  it("menolak tanpa huruf kapital", () => {
    expect(validateStrongPassword("abcdef1!")).toMatch(/kapital/);
  });

  it("menolak tanpa angka", () => {
    expect(validateStrongPassword("Abcdefg!")).toMatch(/angka/);
  });

  it("menolak tanpa simbol", () => {
    expect(validateStrongPassword("Abcdefg1")).toMatch(/simbol/);
  });

  it("menolak kata sandi umum", () => {
    expect(validateStrongPassword("Password123")).toMatch(/umum/);
    expect(validateStrongPassword("password123")).toMatch(/umum/);
    expect(validateStrongPassword("admin123")).toMatch(/umum/);
  });

  it("menerima kata sandi kuat", () => {
    expect(validateStrongPassword("RahasiaKuat#2026")).toBeNull();
  });
});

describe("hashing", () => {
  it("menghasilkan hash bcrypt, bukan teks asli", async () => {
    const hash = await hashPassword("RahasiaKuat#2026");
    expect(hash).not.toBe("RahasiaKuat#2026");
    expect(isBcryptHash(hash)).toBe(true);
  });

  it("memverifikasi kata sandi yang benar", async () => {
    const hash = await hashPassword("RahasiaKuat#2026");
    await expect(verifyPassword("RahasiaKuat#2026", hash)).resolves.toEqual({
      ok: true,
      needsRehash: false,
    });
  });

  it("menolak kata sandi yang salah", async () => {
    const hash = await hashPassword("RahasiaKuat#2026");
    await expect(verifyPassword("SalahSekali#1", hash)).resolves.toEqual({
      ok: false,
      needsRehash: false,
    });
  });

  it("menerima password lama (plaintext) sekali dan menandai perlu rehash", async () => {
    await expect(verifyPassword("legacy-pass", "legacy-pass")).resolves.toEqual({
      ok: true,
      needsRehash: true,
    });
  });
});

import { describe, it, expect } from "vitest";
import {
  generateResetToken,
  hashResetToken,
  isValidResetTokenShape,
  RESET_TOKEN_LENGTH,
} from "@/lib/reset-token";

describe("reset token", () => {
  it("menghasilkan token 64 hex karakter", () => {
    const token = generateResetToken();
    expect(token).toHaveLength(RESET_TOKEN_LENGTH);
    expect(/^[a-f0-9]{64}$/.test(token)).toBe(true);
  });

  it("menolak token undefined/kosong/pendek", () => {
    expect(isValidResetTokenShape(undefined)).toBe(false);
    expect(isValidResetTokenShape("")).toBe(false);
    expect(isValidResetTokenShape("abc")).toBe(false);
    expect(isValidResetTokenShape(null)).toBe(false);
    expect(isValidResetTokenShape(123)).toBe(false);
  });

  it("menerima token yang valid", () => {
    expect(isValidResetTokenShape(generateResetToken())).toBe(true);
  });

  it("hash token deterministik dan tidak sama dengan token asli", () => {
    const token = generateResetToken();
    const hash = hashResetToken(token);
    expect(hash).toBe(hashResetToken(token));
    expect(hash).not.toBe(token);
    expect(hash).toHaveLength(64);
  });

  it("token berbeda menghasilkan hash berbeda", () => {
    expect(hashResetToken(generateResetToken())).not.toBe(hashResetToken(generateResetToken()));
  });
});

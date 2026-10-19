import { describe, it, expect } from "vitest";
import { sanitizeText, stripHtml, isSafeHttpUrl } from "@/lib/sanitize";
import {
  matchesMagicBytes,
  extensionForMime,
  sanitizeFileName,
} from "@/lib/upload-validation";
import { toSafeUser, toSafeUsers } from "@/lib/safe-user";
import { adminUpdateParticipantSchema, participantUpdateSchema } from "@/lib/validation";

describe("sanitize", () => {
  it("menghapus tag script beserta isinya", () => {
    expect(stripHtml("<script>alert(1)</script>Halo")).toBe("Halo");
  });

  it("menghapus tag HTML lain", () => {
    expect(stripHtml("<b>Halo</b> <i>dunia</i>")).toBe("Halo dunia");
  });

  it("menetralkan javascript: dan membatasi panjang", () => {
    expect(sanitizeText("javascript:alert(1)", 100)).toBe("alert(1)");
    expect(sanitizeText("abcdef", 3)).toBe("abc");
    expect(sanitizeText(undefined, 10)).toBe("");
  });

  it("validasi URL hanya http/https", () => {
    expect(isSafeHttpUrl("https://example.com")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("ftp://example.com")).toBe(false);
    expect(isSafeHttpUrl("")).toBe(false);
  });
});

describe("upload validation", () => {
  it("mendeteksi PDF dari magic bytes", () => {
    const pdf = Buffer.from("%PDF-1.7");
    expect(matchesMagicBytes(pdf, "application/pdf")).toBe(true);
  });

  it("menolak PDF palsu", () => {
    expect(matchesMagicBytes(Buffer.from("<html>"), "application/pdf")).toBe(false);
  });

  it("mendeteksi PNG", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(matchesMagicBytes(png, "image/png")).toBe(true);
  });

  it("memetakan ekstensi dan membersihkan nama file", () => {
    expect(extensionForMime("application/pdf")).toBe("pdf");
    expect(extensionForMime("application/x-unknown")).toBeNull();
    expect(sanitizeFileName("../../etc/passwd")).not.toContain("..");
    expect(sanitizeFileName("../../etc/passwd")).not.toContain("/");
  });
});

describe("toSafeUser", () => {
  it("membuang passwordHash, resetToken, resetTokenExpiry", () => {
    const safe = toSafeUser({
      id: "1",
      name: "A",
      passwordHash: "hash",
      resetToken: "tok",
      resetTokenExpiry: new Date(),
    });
    expect(safe).not.toHaveProperty("passwordHash");
    expect(safe).not.toHaveProperty("resetToken");
    expect(safe).not.toHaveProperty("resetTokenExpiry");
    expect(safe.name).toBe("A");
    expect(toSafeUsers([{ passwordHash: "x" }])[0]).not.toHaveProperty("passwordHash");
  });
});

describe("validation schemas", () => {
  it("menolak status di luar enum", () => {
    const result = adminUpdateParticipantSchema.safeParse({
      id: "user-1",
      statusMagang: "ADMIN",
    });
    expect(result.success).toBe(false);
  });

  it("menerima status yang valid", () => {
    const result = adminUpdateParticipantSchema.safeParse({
      id: "user-1",
      statusMagang: "LOLOS_BERKAS",
      bio: "catatan",
    });
    expect(result.success).toBe(true);
  });

  it("menolak id kosong", () => {
    expect(adminUpdateParticipantSchema.safeParse({ id: "" }).success).toBe(false);
  });

  it("participantUpdateSchema tidak memiliki field sensitif", () => {
    const parsed = participantUpdateSchema.parse({
      name: "Nama",
      // Fields below are not in the schema and must be dropped.
      passwordHash: "hack",
      statusMagang: "Aktif",
      email: "other@example.com",
    } as never);
    expect(parsed).not.toHaveProperty("passwordHash");
    expect(parsed).not.toHaveProperty("statusMagang");
    expect(parsed).not.toHaveProperty("email");
  });
});

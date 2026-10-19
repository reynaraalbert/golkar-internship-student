import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;

/** A short blocklist of very common passwords (lowercase comparison). */
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "passw0rd", "12345678", "123456789",
  "1234567890", "qwerty123", "qwertyuiop", "iloveyou", "admin123", "administrator",
  "letmein123", "welcome123", "abc12345", "golkar123", "indonesia1", "rahasia123",
]);

/** Password must have: min 8 chars, uppercase, lowercase, digit, special char */
export function validateStrongPassword(password: string): string | null {
  if (password.length < 8) return "Kata sandi minimal 8 karakter.";
  if (password.length > 128) return "Kata sandi maksimal 128 karakter.";
  if (!/[A-Z]/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kapital (A-Z).";
  if (!/[a-z]/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kecil (a-z).";
  if (!/[0-9]/.test(password)) return "Kata sandi harus mengandung minimal satu angka (0-9).";
  if (!/[^A-Za-z0-9]/.test(password)) return "Kata sandi harus mengandung minimal satu simbol (mis. @, #, !, _).";
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "Kata sandi terlalu umum. Gunakan kombinasi yang lebih unik.";
  }
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$/.test(value);
}

/**
 * Verifies a password against a stored value.
 *
 * Legacy rows in this project stored the raw password. Those are still
 * accepted once so existing participants can log in, and `needsRehash` tells
 * the caller to transparently upgrade the row to a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (!stored) return { ok: false, needsRehash: false };

  if (isBcryptHash(stored)) {
    const ok = await bcrypt.compare(password, stored);
    return { ok, needsRehash: false };
  }

  // Legacy plaintext comparison (constant-ish time via hashing both sides).
  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  const ok = a.length === b.length && a.equals(b);
  return { ok, needsRehash: ok };
}

/** Password must have: min 8 chars, uppercase, lowercase, digit, special char */
export function validateStrongPassword(password: string): string | null {
  if (password.length < 8) return "Kata sandi minimal 8 karakter.";
  if (!/[A-Z]/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kapital (A-Z).";
  if (!/[a-z]/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kecil (a-z).";
  if (!/[0-9]/.test(password)) return "Kata sandi harus mengandung minimal satu angka (0-9).";
  if (!/[^A-Za-z0-9]/.test(password)) return "Kata sandi harus mengandung minimal satu simbol (mis. @, #, !, _).";
  return null;
}

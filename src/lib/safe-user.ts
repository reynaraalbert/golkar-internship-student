/**
 * Central helper to strip sensitive fields from any user-shaped object before
 * it is serialized to a client response.
 *
 * Never return `passwordHash`, `resetToken`, or `resetTokenExpiry` to any
 * caller (public, participant, or admin).
 */
const SENSITIVE_USER_FIELDS = ["passwordHash", "resetToken", "resetTokenExpiry"] as const;

export function toSafeUser<T extends object>(user: T): Record<string, unknown> {
  const safe: Record<string, unknown> = { ...(user as Record<string, unknown>) };
  for (const field of SENSITIVE_USER_FIELDS) {
    delete safe[field];
  }
  return safe;
}

export function toSafeUsers<T extends object>(users: T[]): Record<string, unknown>[] {
  return users.map(toSafeUser);
}

"use client";

import { useEffect, useState } from "react";

export type AdminRole = "admin" | "seleksi";

/**
 * Verifies the admin session by calling the verify endpoint.
 * The role is returned by the server (signed inside the session token) so the
 * UI never has to trust a client-stored value.
 */
export function useAdminAuth() {
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [role, setRole] = useState<AdminRole>("admin");

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/auth/verify", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          setRole(data?.role === "seleksi" ? "seleksi" : "admin");
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } catch {
        if (!cancelled) setStatus("unauthenticated");
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, role };
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}

/** Generic CRUD helpers used by the admin pages. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store", credentials: "include" });
  if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`);
  return res.json();
}

export async function apiPut(path: string, body: unknown): Promise<void> {
  const res = await fetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = `PUT ${path} failed (${res.status})`;
    try {
      const err = await res.json();
      if (err?.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
}

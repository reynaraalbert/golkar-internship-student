"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet, apiPut } from "@/lib/admin-client";

/**
 * Fast & responsive CMS collection hook with zero race-conditions.
 *
 * 1. `loaded` defaults to `true` for 0ms instant form render.
 * 2. `isEditedRef` prevents background `apiGet` from overwriting local user typing!
 * 3. `BroadcastChannel` instantly pushes updates across tabs in 0ms.
 * 4. Auto-saves changes debounced 500ms on every edit.
 * 5. Listens for global `cms-manual-save` event from header button.
 */
export function useCollection<T>(collection: string, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<T>(data);
  const isEditedRef = useRef(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Background fetch from API — ONLY apply if user hasn't edited locally
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (!cancelled) setLoaded(true);
    }, 2000);

    apiGet<T>(`/api/data/${collection}`)
      .then((d) => {
        if (!cancelled && d !== null && d !== undefined && !isEditedRef.current) {
          setData(d);
          dataRef.current = d;
        }
      })
      .catch(() => {
        // Fall back gracefully to default value
      })
      .finally(() => {
        clearTimeout(timer);
        if (!cancelled) setLoaded(true);
      });

    // Track real database connectivity so the admin can tell whether the form
    // is showing live DB data or a static-default fallback.
    fetch("/api/db-status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setDbConnected(!!d.connected); })
      .catch(() => { if (!cancelled) setDbConnected(false); });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [collection]);

  // Broadcast update instantly to user tabs
  const broadcastSync = (updatedData: T) => {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("cms_sync_channel");
        bc.postMessage({ collection, data: updatedData });
        bc.close();
      }
    } catch {
      // ignore channel errors
    }
  };

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      const payload = dataRef.current;
      broadcastSync(payload);
      await apiPut(`/api/data/${collection}`, payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err?.message || "Pastikan server berjalan."}`);
    } finally {
      setSaving(false);
    }
  }, [collection]);

  // Handle header "Simpan Perubahan" click
  useEffect(() => {
    const handleManualSave = () => {
      save();
    };
    window.addEventListener("cms-manual-save", handleManualSave);
    return () => window.removeEventListener("cms-manual-save", handleManualSave);
  }, [save]);

  // Auto-save with 500ms debounce
  const updateData = useCallback(
    (valOrFn: T | ((prev: T) => T)) => {
      isEditedRef.current = true; // Mark as locally edited so apiGet won't overwrite it
      setData((prev) => {
        const next = typeof valOrFn === "function" ? (valOrFn as (prev: T) => T)(prev) : valOrFn;
        dataRef.current = next;

        // Instant broadcast to user tab
        broadcastSync(next);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          setSaving(true);
          try {
            await apiPut(`/api/data/${collection}`, next);
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          } catch {
            // silent auto-save error catch
          } finally {
            setSaving(false);
          }
        }, 500);

        return next;
      });
    },
    [collection]
  );

  return { data, setData: updateData, save, saving, saved, loaded, dbConnected };
}

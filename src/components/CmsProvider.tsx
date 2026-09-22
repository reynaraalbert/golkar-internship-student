"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import type { SiteContent, Member, NewsArticle, AgendaItem, MitraKerja, PageContent } from "@/lib/data";
import { EMPTY_STATS, EMPTY_SITECONTENT } from "@/lib/defaults";

import { defaultCollection } from "@/lib/cms-store";

export interface CmsContent {
  stats: { totalMembers: number; totalPimpinan: number; mitraKerjaCount: number; activeBills: number; completedHearings: number; aspirationsProcessed: number };
  anggota: Member[];
  pimpinan: Member[];
  mitraKerja: MitraKerja[];
  berita: NewsArticle[];
  agenda: AgendaItem[];
  siteContent: SiteContent;
  pages: PageContent[];
}

const INITIAL_CONTENT: CmsContent = {
  stats: defaultCollection("stats"),
  anggota: defaultCollection("anggota"),
  pimpinan: defaultCollection("pimpinan"),
  mitraKerja: defaultCollection("mitraKerja"),
  berita: defaultCollection("berita"),
  agenda: defaultCollection("agenda"),
  siteContent: defaultCollection("siteContent"),
  pages: defaultCollection("pages"),
};

interface CmsContextValue {
  content: CmsContent;
  loaded: boolean;
}

const CmsContext = createContext<CmsContextValue>({ content: INITIAL_CONTENT, loaded: false });

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(INITIAL_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setContent((prev) => {
          const merged = { ...prev, ...data } as unknown as Record<keyof CmsContent, unknown>;
          // Never overwrite defaults with null/undefined (DB might be empty)
          (Object.keys(merged) as (keyof CmsContent)[]).forEach((k) => {
            if (merged[k] === null || merged[k] === undefined) {
              merged[k] = prev[k];
            }
          });
          return merged as unknown as CmsContent;
        });
      }
    } catch {
      // DB might be temporarily unavailable
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const isAdminPage = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
    fetchContent();

    // Poll for changes every 15 seconds (public pages; admin uses live BroadcastChannel sync)
    if (!isAdminPage) {
      intervalRef.current = setInterval(fetchContent, 15000);
    }

    // BroadcastChannel for instant admin→user sync across tabs
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("cms_sync_channel");
      bc.onmessage = (event) => {
        if (event.data?.collection && event.data?.data) {
          const { collection, data } = event.data;
          setContent((prev) => ({ ...prev, [collection]: data }));
        }
      };
    } catch {
      // ignore
    }

    const onFocus = () => fetchContent();
    window.addEventListener("focus", onFocus);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("focus", onFocus);
      if (bc) bc.close();
    };
  }, [fetchContent]);

  return <CmsContext.Provider value={{ content, loaded }}>{children}</CmsContext.Provider>;
}

export function useCmsContent(): CmsContent {
  return useContext(CmsContext).content;
}
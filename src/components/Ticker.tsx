"use client";

import React from "react";
import Link from "next/link";
import { useCmsContent } from "@/components/CmsProvider";
import { ChevronRight } from "lucide-react";

export default function Ticker() {
  const { siteContent } = useCmsContent();
  const announcement = siteContent?.announcement;

  if (!announcement || !announcement.text) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2 text-xs font-bold w-full relative z-[60] overflow-hidden flex items-center justify-between gap-4">
      <div className="flex-1 flex items-center gap-3 overflow-hidden">
        <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black shrink-0 tracking-wider">
          {announcement.badge || "INFO"}
        </span>
        <div className="overflow-hidden flex-1 relative h-4">
          <div className="whitespace-nowrap flex space-x-12 animate-marquee items-center absolute w-[200%] top-0">
            <span className="flex-1">✦ {announcement.text}</span>
            <span className="flex-1">✦ {announcement.text}</span>
          </div>
        </div>
      </div>
      {announcement.ctaHref && (
        <Link
          href={announcement.ctaHref}
          className="shrink-0 flex items-center gap-1 hover:underline whitespace-nowrap"
        >
          {announcement.ctaLabel || "Selengkapnya"}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

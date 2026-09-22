"use client";

import React from "react";
import { Megaphone, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Ticker() {
  const announcements = [
    "🔴 LIVE NOW: Rapat Kerja Komisi XIII DPR RI bersama Kementerian Hukum RI & Kementerian HAM RI di Gedung Nusantara II Senayan",
    "⚖️ RUU Perlindungan Saksi dan Korban Resmi Masuk Prolegnas Prioritas 2026",
    "🛂 Sidak Komisi XIII: Apresiasi Penerapan 100 Autogate Biometrik Baru Kemenimipas",
    "📢 Portal Aspirasi Rakyat Komisi XIII DPR RI Terbuka Bagi Aduan Dugaan Pelanggaran HAM & Masalah Lapas",
  ];

  return (
    <div className="bg-slate-900 dark:bg-red-600 border-b border-slate-800 dark:border-white/10 text-xs py-2 px-3 sm:px-4 overflow-hidden relative z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Badge — never shrinks */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-dpr-emerald dark:bg-dpr-red text-white font-bold px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] tracking-wider uppercase shrink-0 shadow-sm">
          <Megaphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce shrink-0" />
          <span className="hidden xs:inline">SIARAN PARLEMEN</span>
          <span className="xs:hidden">LIVE</span>
        </div>

        {/* Ticker text — takes remaining space, clips overflow */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-ticker">
              {announcements.map((text, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 mx-4 sm:mx-6 text-slate-200 dark:text-slate-300 font-medium">
                  <span>{text}</span>
                  <span className="text-dpr-gold/40">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/agenda"
          className="hidden md:inline-flex items-center gap-1 text-dpr-gold hover:text-white transition-colors text-[11px] font-semibold shrink-0"
        >
          <span>Jadwal Lengkap</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

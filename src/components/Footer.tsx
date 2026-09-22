/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink, Globe, Scale } from "lucide-react";
import { useCmsContent } from "@/components/CmsProvider";

export default function Footer() {
  const { siteContent } = useCmsContent();
  const footer = siteContent.footer;

  return (
    <footer className="bg-slate-900 dark:bg-[#050A14] text-slate-300 dark:text-slate-400 border-t border-slate-700 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-dpr-emerald dark:via-dpr-gold to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

          {/* Brand & Address — full width on mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-auto shrink-0 flex items-center justify-center">
                <img
                  src="/images/logo-dpr.svg"
                  alt="Lambang DPR RI"
                  className="h-14 w-auto object-contain drop-shadow-md"
                />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base leading-tight">Dewan Perwakilan Rakyat</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-300 font-bold">Republik Indonesia</p>
                  <span className="bg-dpr-emerald dark:bg-dpr-red text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    KOMISI XIII
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              {footer.brandDescription}
            </p>

            {/* Contact info for desktop only (Column 1) */}
            <div className="hidden lg:block space-y-2 text-xs pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-dpr-gold shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-dpr-gold shrink-0" />
                <span>{footer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-dpr-gold shrink-0" />
                <span>{footer.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation — col 1 on mobile */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-slate-700 dark:border-white/10 flex items-center gap-2">
              <Scale className="w-4 h-4 text-dpr-gold" />
              <span>Navigasi Portal</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/anggota" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Daftar Pimpinan & Anggota
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Berita & Siaran Pers Parlemen
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Tugas, Fungsi & Ruang Lingkup
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-dpr-gold transition-colors flex items-center gap-2">
                  <span className="text-dpr-gold">›</span> Jadwal Rapat & Siaran Live
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Partners — col 2 on mobile */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-slate-700 dark:border-white/10 flex items-center gap-2">
              <Globe className="w-4 h-4 text-dpr-gold" />
              <span>Mitra Kerja Komisi XIII</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Kementerian Hukum RI</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Kementerian HAM RI</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Kementerian Imigrasi & Pemasyarakatan</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Komisi Pemberantasan Korupsi (KPK)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• Komnas HAM & LPSK</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center justify-between hover:text-white transition-colors">
                <span>• BNPT & BKN</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
            </ul>
          </div>

          {/* Public Transparency Statement & Contact Info — full width on mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <h4 className="text-white font-semibold text-sm pb-2 border-b border-slate-700 dark:border-white/10">
              Keterbukaan Informasi
            </h4>
            <p className="text-xs leading-relaxed text-slate-300 dark:text-slate-400">
              {footer.transparencyText}
            </p>
            <div className="p-3 rounded-xl bg-slate-800 dark:bg-dpr-navy-card border border-dpr-gold/20 text-[11px] text-slate-300">
              <span className="font-semibold text-dpr-gold block mb-0.5">Layanan Informasi PPID:</span>
              {footer.ppidText}
            </div>

            {/* Kontak & Sekretariat — Placed BELOW Keterbukaan Informasi on Mobile only */}
            <div className="block lg:hidden space-y-2 text-xs pt-3 border-t border-slate-700/80 dark:border-white/10 mt-3">
              <h5 className="text-white font-bold text-xs mb-1">Kontak & Sekretariat</h5>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-dpr-gold shrink-0 mt-0.5" />
                <span>{footer.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-dpr-gold shrink-0" />
                <span>{footer.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-dpr-gold shrink-0" />
                <span>{footer.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-slate-800 dark:border-white/10 flex flex-row items-center justify-between gap-3 flex-wrap text-xs text-slate-400 dark:text-slate-500">
          <p>{footer.copyrightText}</p>
          <div className="flex items-center gap-6">
            <Link href="/kebijakan-privasi" className="hover:text-dpr-gold transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-penggunaan" className="hover:text-dpr-gold transition-colors">Syarat Penggunaan</Link>
            <Link href="/peta-situs" className="hover:text-dpr-gold transition-colors">Peta Situs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

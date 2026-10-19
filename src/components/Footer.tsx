/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink, Globe, Scale } from "lucide-react";
import { useCmsContent } from "@/components/CmsProvider";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const { siteContent } = useCmsContent();
  const footer = siteContent.footer;

  // CMS values win when present; siteConfig is the fallback single source.
  const address = footer.address || siteConfig.secretariat.address;
  const phone = footer.phone || siteConfig.secretariat.phone;
  const email = footer.email || siteConfig.secretariat.email;

  const programLinks = [
    { label: "DPP Partai Golkar", href: "https://golkar.or.id" },
    { label: "Golkar Institute", href: "https://fraksigolkar.com" },
    { label: "Fraksi Partai Golkar DPR RI", href: "https://fraksigolkar.com" },
    { label: "Golkar Muda", href: "https://golkar.or.id" },
    { label: "Program Beasiswa Golkar", href: "https://golkar.or.id" },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-[#050A14] text-slate-300 dark:text-slate-400 border-t border-slate-700 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-amber-400 dark:via-dpr-gold to-transparent opacity-40" />

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
                <h3 className="text-white font-extrabold text-base leading-tight">Golkar Internship Student</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-300 font-bold">{siteConfig.organizer}</p>
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">
              {footer.brandDescription || siteConfig.description}
            </p>

            {/* Contact info for desktop only (Column 1) */}
            <div className="hidden lg:block space-y-2 text-xs pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-dpr-gold shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-dpr-gold shrink-0" />
                <a href={siteConfig.secretariat.phoneHref} className="hover:text-dpr-gold transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-dpr-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-dpr-gold transition-colors break-all">
                  {email}
                </a>
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
                <Link href="/" className="hover:text-dpr-gold transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link href="/anggota" className="hover:text-dpr-gold transition-colors">
                  Daftar Peserta Magang
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-dpr-gold transition-colors">
                  Berita & Siaran Pers
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-dpr-gold transition-colors">
                  Profil Program
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-dpr-gold transition-colors">
                  Agenda Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="hover:text-dpr-gold transition-colors">
                  Timeline Pendaftaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Programme Links — col 2 on mobile */}
          <div className="col-span-1">
            <h4 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-slate-700 dark:border-white/10 flex items-center gap-2">
              <Globe className="w-4 h-4 text-dpr-gold" />
              <span>Tautan Program</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {programLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between hover:text-dpr-gold transition-colors"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-dpr-gold transition-colors"
                >
                  <span>fraksigolkar.com</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
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
              <span className="font-semibold text-dpr-gold block mb-0.5">Layanan Informasi:</span>
              {footer.ppidText}
            </div>

            {/* Kontak & Sekretariat — mobile only */}
            <div className="block lg:hidden space-y-2 text-xs pt-3 border-t border-slate-700/80 dark:border-white/10 mt-3">
              <h5 className="text-white font-bold text-xs mb-1">Kontak & Sekretariat</h5>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-dpr-gold shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-dpr-gold shrink-0" />
                <a href={siteConfig.secretariat.phoneHref} className="hover:text-dpr-gold transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-dpr-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-dpr-gold transition-colors break-all">
                  {email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-slate-800 dark:border-white/10 flex flex-row items-center justify-between gap-3 flex-wrap text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Golkar Internship Student. Hak Cipta Dilindungi.</p>
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

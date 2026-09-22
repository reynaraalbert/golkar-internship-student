"use client";

import React from "react";
import Link from "next/link";
import { Map, Home, Users, Newspaper, Info, Calendar, MessageSquare, FileText, Lock } from "lucide-react";

const siteMap = [
  {
    title: "Halaman Utama",
    icon: Home,
    links: [
      { name: "Beranda", href: "/", desc: "Halaman utama portal" },
    ]
  },
  {
    title: "Anggota DPR",
    icon: Users,
    links: [
      { name: "Daftar Anggota", href: "/anggota", desc: "Seluruh anggota Fraksi Golkar di Komisi XIII" },
    ]
  },
  {
    title: "Berita & Informasi",
    icon: Newspaper,
    links: [
      { name: "Baca Berita", href: "/berita", desc: "Berita dan siaran pers terkini" },
      { name: "Tulis Berita", href: "/berita/tulis", desc: "Kirimkan berita atau artikel Anda" },
    ]
  },
  {
    title: "Profil Komisi",
    icon: Info,
    links: [
      { name: "Sejarah Komisi XIII", href: "/profil#sejarah", desc: "Latar belakang dan sejarah pembentukan" },
      { name: "Visi & Misi", href: "/profil#visi-misi", desc: "Visi dan misi kerja Komisi XIII" },
      { name: "Pimpinan & Anggota", href: "/anggota", desc: "Struktur pimpinan Fraksi Golkar" },
      { name: "Daftar Mitra Kerja", href: "/profil#mitra-kerja", desc: "Kementerian dan lembaga mitra" },
    ]
  },
  {
    title: "Agenda Rapat",
    icon: Calendar,
    links: [
      { name: "Jadwal Rapat", href: "/agenda", desc: "Jadwal rapat dan siaran langsung" },
    ]
  },
  {
    title: "Aspirasi Rakyat",
    icon: MessageSquare,
    links: [
      { name: "Kirim Aspirasi", href: "/aspirasi", desc: "Sampaikan aspirasi kepada komisi" },
    ]
  },
  {
    title: "Informasi Legal",
    icon: FileText,
    links: [
      { name: "Kebijakan Privasi", href: "/kebijakan-privasi", desc: "Kebijakan penggunaan data pribadi" },
      { name: "Syarat Penggunaan", href: "/syarat-penggunaan", desc: "Syarat dan ketentuan penggunaan portal" },
      { name: "Peta Situs", href: "/peta-situs", desc: "Peta navigasi portal ini" },
    ]
  }
];

export default function PetaSitusPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Map className="w-4 h-4" />
          <span>NAVIGASI PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Peta <span className="text-dpr-emerald dark:text-dpr-gold">Situs</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Temukan semua halaman dan fitur yang tersedia di Portal Resmi Komisi XIII DPR RI.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteMap.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.title} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
              <h2 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Icon className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                {category.title}
              </h2>
              <ul className="space-y-3">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group block">
                      <span className="text-sm font-semibold text-dpr-emerald-dark dark:text-dpr-gold group-hover:underline">
                        {link.name}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{link.desc}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

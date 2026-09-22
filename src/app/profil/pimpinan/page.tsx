"use client";

import React from "react";
import { Users, Award, ChevronRight, ChevronLeft, MapPin, Mail, GraduationCap, Briefcase, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCmsContent } from "@/components/CmsProvider";

export default function PimpinanPage() {
  const { pimpinan, anggota, pages } = useCmsContent();
  const page = pages.find((p) => p.slug === "profil/pimpinan");
  const headerSub = page?.sections.find((s) => s.title === "Header Halaman Pimpinan")?.subsections[0]?.fields || {};

  const badge = headerSub.badge || "PROFIL KOMISI XIII — PIMPINAN & ANGGOTA";
  const judul = headerSub.judul || "Pimpinan & Anggota Fraksi Golkar";
  const deskripsi = headerSub.deskripsi || "Daftar lengkap Pimpinan dan Anggota Komisi XIII DPR RI dari Fraksi Partai Golkar periode 2024–2029 beserta profil dan rekam jejak legislasinya.";

  const anggotaSaja = anggota.filter((m) => m.role === "Anggota Komisi");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Users className="w-4 h-4" />
          <span>{badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          <span className="text-dpr-emerald dark:text-dpr-gold">{judul}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {deskripsi}
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Anggota Golkar", value: anggota.length, unit: "Orang" },
          { label: "Pimpinan Komisi", value: pimpinan.length, unit: "Jabatan" },
          { label: "Dapil Terwakili", value: new Set(anggota.map(m => m.dapil)).size, unit: "Dapil" },
          { label: "Masa Jabatan", value: "2024", unit: "– 2029" },
        ].map(stat => (
          <div key={stat.label} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 text-center space-y-1">
            <p className="text-2xl font-extrabold text-dpr-emerald dark:text-dpr-gold">{stat.value}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.unit}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pimpinan Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-xl border-b-2 border-dpr-emerald dark:border-dpr-gold pb-3">
          <Award className="w-6 h-6 text-dpr-emerald dark:text-dpr-gold" />
          <span>Pimpinan Komisi XIII DPR RI</span>
        </div>

        {/* Ketua */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl border-2 border-dpr-emerald/40 dark:border-dpr-gold/40 bg-gradient-to-br from-emerald-50 to-white dark:from-dpr-navy-card dark:to-dpr-navy shadow-xl"
        >
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <img
                src={pimpinan[0].photoUrl}
                alt={pimpinan[0].name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-dpr-emerald dark:border-dpr-gold shadow-lg"
              />
              <span className="absolute -top-2 -right-2 bg-dpr-emerald dark:bg-dpr-gold text-white dark:text-dpr-navy text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Ketua
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{pimpinan[0].name}</h2>
                <p className="text-sm text-dpr-emerald-dark dark:text-dpr-gold font-semibold">{pimpinan[0].role} — Komisi XIII DPR RI</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <BadgeCheck className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold shrink-0" />
                  <span>No. Anggota: <strong className="text-slate-900 dark:text-white">{pimpinan[0].nomorAnggota}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold shrink-0" />
                  <span>Dapil: <strong className="text-slate-900 dark:text-white">{pimpinan[0].dapil}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold shrink-0" />
                  <span>{pimpinan[0].email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold shrink-0" />
                  <span>{pimpinan[0].pendidikan}</span>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">{pimpinan[0].bio}</p>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Agenda Legislasi yang Dipimpin:</p>
                {pimpinan[0].billsLed.map((bill, bi) => (
                  <div key={bi} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-dpr-emerald dark:bg-dpr-gold shrink-0" />
                    {bill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Wakil Ketua */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pimpinan.slice(1).map((wakil, idx) => (
            <motion.div
              key={wakil.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className="glass-panel p-6 rounded-2xl border border-dpr-emerald/20 dark:border-dpr-gold/20 space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img src={wakil.photoUrl} alt={wakil.name} className="w-20 h-20 rounded-xl object-cover border-2 border-dpr-emerald/40 dark:border-dpr-gold/40" />
                  <span className="absolute -top-1 -right-1 bg-slate-700 dark:bg-dpr-gold/80 text-white dark:text-dpr-navy text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    Wakil Ketua
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{wakil.name}</h3>
                  <p className="text-xs text-dpr-emerald-dark dark:text-dpr-gold">{wakil.fraksi}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3" /> {wakil.dapil}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <BadgeCheck className="w-3 h-3" /> {wakil.nomorAnggota}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{wakil.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Anggota Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-xl border-b-2 border-dpr-emerald dark:border-dpr-gold pb-3">
          <Users className="w-6 h-6 text-dpr-emerald dark:text-dpr-gold" />
          <span>Anggota Komisi XIII — Fraksi Partai Golkar ({anggotaSaja.length} Anggota)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {anggotaSaja.map((anggota, i) => (
            <motion.div
              key={anggota.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 hover:border-dpr-emerald/40 dark:hover:border-dpr-gold/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3">
                <img src={anggota.photoUrl} alt={anggota.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{anggota.name}</h3>
                  <p className="text-xs text-dpr-emerald dark:text-dpr-gold font-semibold">{anggota.fraksi}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5"><BadgeCheck className="w-3 h-3 shrink-0 text-dpr-emerald dark:text-dpr-gold" /> No. {anggota.nomorAnggota}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0 text-dpr-emerald dark:text-dpr-gold" /> {anggota.dapil}</div>
                <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 shrink-0 text-dpr-emerald dark:text-dpr-gold" /> {anggota.email}</div>
                {anggota.pendidikan && (
                  <div className="flex items-start gap-1.5"><GraduationCap className="w-3 h-3 shrink-0 text-dpr-emerald dark:text-dpr-gold mt-0.5" /> {anggota.pendidikan}</div>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{anggota.bio}</p>
              <div className="space-y-1">
                {anggota.billsLed.slice(0, 2).map((bill, bi) => (
                  <div key={bi} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <Briefcase className="w-3 h-3 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{bill}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation — 2 Buttons side-by-side */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Link
            href="/profil/visi-misi"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold transition-all text-center group min-w-0"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform text-dpr-emerald dark:text-dpr-gold" />
            <span className="truncate">Visi & Misi</span>
          </Link>

          <Link
            href="/profil/mitra-kerja"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all text-center group min-w-0"
          >
            <span className="truncate">Daftar Mitra Kerja</span>
            <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

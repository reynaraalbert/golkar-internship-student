"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Newspaper, CalendarDays, Users, Handshake, Home,
  TrendingUp, FileText, Activity, ArrowRight, RefreshCw, CheckCircle2,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useCmsContent } from "@/components/CmsProvider";
import { EMPTY_STATS } from "@/lib/defaults";
import { useCollection } from "@/lib/admin-collection";
import { Field, Grid, Input } from "@/components/admin/ui";

export default function AdminDashboardPage() {
  const { stats, berita, agenda, anggota, mitraKerja } = useCmsContent();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const statsColl = useCollection<typeof EMPTY_STATS>("stats", EMPTY_STATS);
  const setStat = (key: keyof typeof EMPTY_STATS, val: string) =>
    statsColl.setData((prev) => ({ ...prev, [key]: Number(val) || 0 }));

  const statCards = [
    { label: "Total Anggota Aktif", value: `${stats.totalMembers}+`, icon: Users, color: "text-blue-600 dark:text-blue-400", href: "/admin/anggota" },
    { label: "Rapat & Agenda", value: agenda.length, icon: CalendarDays, color: "text-emerald-600 dark:text-emerald-400", href: "/admin/agenda" },
    { label: "Berita & Siaran Pers", value: berita.length, icon: Newspaper, color: "text-purple-600 dark:text-purple-400", href: "/admin/berita" },
    { label: "Mitra Kerja Kemitraan", value: mitraKerja.length, icon: Handshake, color: "text-amber-600 dark:text-amber-400", href: "/admin/mitra" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner (matching BEMPRKK style) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-white/10"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CMS Panel Control</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-medium">
              Anda memiliki <strong className="text-dpr-gold">{stats.activeBills} RUU prioritas</strong> aktif dan <strong className="text-dpr-gold">{stats.totalMembers} anggota aktif</strong> bulan ini. Seluruh perubahan langsung tersinkronisasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/beranda"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-5 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span>Edit Beranda</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-2xl border border-white/20 transition-all"
            >
              <span>Lihat Situs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-3.5 sm:p-5 space-y-2 sm:space-y-3 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-dpr-navy flex items-center justify-center">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-bold">Ringkasan</span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{card.value}</p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1">{card.label}</p>
              </div>
              <Link href={card.href} className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-dpr-emerald dark:text-dpr-gold hover:underline pt-1 sm:pt-2">
                Kelola <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Stats & overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats details */}
        <div className="lg:col-span-7 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Angka Statistik Situs</h2>
            </div>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">Editable</span>
          </div>
          <Grid cols={2}>
            <Field label="Anggota Parlemen">
              <Input type="number" value={String(statsColl.data.totalMembers)} onChange={(e) => setStat("totalMembers", e.target.value)} className="w-full" />
            </Field>
            <Field label="Pimpinan Komisi">
              <Input type="number" value={String(statsColl.data.totalPimpinan)} onChange={(e) => setStat("totalPimpinan", e.target.value)} className="w-full" />
            </Field>
            <Field label="Mitra Kerja">
              <Input type="number" value={String(statsColl.data.mitraKerjaCount)} onChange={(e) => setStat("mitraKerjaCount", e.target.value)} className="w-full" />
            </Field>
            <Field label="RUU Prioritas">
              <Input type="number" value={String(statsColl.data.activeBills)} onChange={(e) => setStat("activeBills", e.target.value)} className="w-full" />
            </Field>
            <Field label="Rapat Selesai">
              <Input type="number" value={String(statsColl.data.completedHearings)} onChange={(e) => setStat("completedHearings", e.target.value)} className="w-full" />
            </Field>
            <Field label="Aspirasi Diproses">
              <Input type="number" value={String(statsColl.data.aspirationsProcessed)} onChange={(e) => setStat("aspirationsProcessed", e.target.value)} className="w-full" />
            </Field>
          </Grid>
          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Nilai ini ditampilkan pada counter halaman beranda.</p>
            <button
              onClick={statsColl.save}
              disabled={statsColl.saving}
              className="inline-flex items-center gap-1.5 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-4 py-2 rounded-full shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {statsColl.saving ? "Menyimpan..." : "Simpan Statistik"}
            </button>
          </div>
        </div>

        {/* Content size overview */}
        <div className="lg:col-span-5 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Activity className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Konten Aktif</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Berita & Artikel", count: berita.length, icon: Newspaper, bar: Math.min(100, (berita.length / 8) * 100) },
              { label: "Agenda Rapat", count: agenda.length, icon: CalendarDays, bar: Math.min(100, (agenda.length / 8) * 100) },
              { label: "Anggota Parlemen", count: anggota.length, icon: Users, bar: Math.min(100, (anggota.length / 46) * 100) },
              { label: "Mitra Kerja Lembaga", count: mitraKerja.length, icon: Handshake, bar: Math.min(100, (mitraKerja.length / 8) * 100) },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <Icon className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold" />
                      {row.label}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{row.count}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-dpr-emerald dark:bg-gold-gradient h-full rounded-full" style={{ width: `${row.bar}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent items */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Konten Terbaru</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent berita */}
          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Berita Terbaru</h3>
              <Link href="/admin/berita" className="text-[11px] font-semibold text-dpr-emerald dark:text-dpr-gold hover:underline">Kelola</Link>
            </div>
            <div className="space-y-2.5">
              {berita.slice(0, 3).map((b) => (
                <Link key={b.id} href="/admin/berita" className="block p-3 rounded-xl bg-slate-50 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/5 hover:border-dpr-emerald/40 dark:hover:border-dpr-gold/40 transition-all">
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{b.title}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{b.category} • {b.date}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent agenda */}
          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Agenda Terbaru</h3>
              <Link href="/admin/agenda" className="text-[11px] font-semibold text-dpr-emerald dark:text-dpr-gold hover:underline">Kelola</Link>
            </div>
            <div className="space-y-2.5">
              {agenda.slice(0, 3).map((a) => (
                <Link key={a.id} href="/admin/agenda" className="block p-3 rounded-xl bg-slate-50 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/5 hover:border-dpr-emerald/40 dark:hover:border-dpr-gold/40 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{a.title}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{a.date} • {a.status}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 p-4 rounded-2xl bg-slate-100/70 dark:bg-dpr-navy-card/60 border border-slate-200 dark:border-white/10">
        {mounted ? (
          <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0" />
        ) : (
          <RefreshCw className="w-4 h-4 animate-spin text-dpr-emerald dark:text-dpr-gold shrink-0" />
        )}
        <span>
          Sistem CMS terhubung. Seluruh perubahan data tersimpan langsung ke database PostgreSQL (Supabase) dan otomatis tampil di mode user secara realtime.
        </span>
      </div>
    </div>
  );
}

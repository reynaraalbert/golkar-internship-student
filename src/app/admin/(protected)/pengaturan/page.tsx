"use client";

import React, { useState } from "react";
import { Settings, ShieldCheck, Database, Sliders, Moon, Sun, CheckCircle2, Download, RefreshCw } from "lucide-react";
import { SectionCard, Grid, Field, Input, PageHeader, Badge } from "@/components/admin/ui";
import { useTheme } from "@/components/ThemeProvider";
import { useCmsContent } from "@/components/CmsProvider";

export default function AdminPengaturanPage() {
  const { theme, toggleTheme } = useTheme();
  const cmsContent = useCmsContent();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExportData = () => {
    setDownloading(true);
    const jsonStr = JSON.stringify(cmsContent, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `komisi13_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Settings}
        title="Pengaturan Website & CMS"
        subtitle="Kelola konfigurasikan sistem CMS, mode tampilan, sinkronisasi data, serta cadangan (backup) data situs Komisi XIII."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Tampilan & Tema */}
          <SectionCard
            icon={Sliders}
            title="Pengaturan Tampilan & Tema UI"
            description="Sesuaikan tema tampilan panel admin dan preferensi antarmuka."
            badge={<Badge variant="blue">Sistem</Badge>}
          >
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-dpr-navy border border-slate-200 dark:border-white/10">
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Mode Gelap / Terang (Dark/Light)</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ubah mode warna antarmuka Admin Control Panel. Mode aktif saat ini: <strong className="capitalize">{theme}</strong>
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4" /> Mode Terang
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" /> Mode Gelap
                  </>
                )}
              </button>
            </div>
          </SectionCard>

          {/* Backup & Export Data */}
          <SectionCard
            icon={Database}
            title="Backup & Cadangan Data CMS"
            description="Ekspor seluruh basis data JSON situs (berita, agenda, anggota, mitra, siteContent) ke berkas lokal."
            badge={<Badge variant="gold">Backup</Badge>}
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-dpr-navy border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Download Backup JSON</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Unduh file arsip data lengkap untuk cadangan atau pemulihan data.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={downloading}
                  className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-opacity shrink-0"
                >
                  {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Unduh Data JSON</span>
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Keamanan & Sesi */}
          <SectionCard
            icon={ShieldCheck}
            title="Informasi Keamanan & Hak Akses"
            description="Status autentikasi dan peran akun admin yang terhubung."
            badge={<Badge variant="emerald">Super Admin</Badge>}
          >
            <Grid cols={2}>
              <Field label="Peran Pengguna (Role)">
                <Input value="Administrator (Super Admin)" readOnly className="w-full opacity-80 cursor-not-allowed" />
              </Field>
              <Field label="Status Autentikasi">
                <Input value="Terverifikasi (Session Active)" readOnly className="w-full opacity-80 cursor-not-allowed" />
              </Field>
              <Field label="Tipe Penyimpanan Data">
                <Input value="Database PostgreSQL (Supabase)" readOnly className="w-full opacity-80 cursor-not-allowed" />
              </Field>
              <Field label="Sinkronisasi Live">
                <Input value="Aktif (Realtime Broadcast ke User)" readOnly className="w-full opacity-80 cursor-not-allowed" />
              </Field>
            </Grid>
          </SectionCard>
        </div>

        {/* System Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <ShieldCheck className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
              <span>Status Sistem CMS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500">Versi CMS</span>
                <span className="font-bold text-slate-900 dark:text-white">v2.4.0 (2026 Edition)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500">Framework</span>
                <span className="font-bold text-slate-900 dark:text-white">Next.js 14 App Router</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500">Total Berita</span>
                <span className="font-bold text-slate-900 dark:text-white">{cmsContent.berita.length} Artikel</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500">Total Agenda</span>
                <span className="font-bold text-slate-900 dark:text-white">{cmsContent.agenda.length} Acara</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                <span className="text-slate-500">Anggota Komisi</span>
                <span className="font-bold text-slate-900 dark:text-white">{cmsContent.anggota.length} Orang</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Mitra Kerja</span>
                <span className="font-bold text-slate-900 dark:text-white">{cmsContent.mitraKerja.length} Lembaga</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Seluruh fungsi admin berstatus normal & aktif.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

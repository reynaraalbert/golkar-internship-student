"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function UserPosisiPage() {
  const POSISI_LIST = [
    {
      id: "1",
      title: "Program Magang Analisis Kebijakan & Riset Legislatif",
      komisi: "Sekretariat Jenderal & Fraksi Partai Golkar DPR RI",
      kuota: "15 Peserta",
      status: "TERVERIFIKASI & TERDAFTAR",
      isApplied: true,
      deskripsi: "Riset rancangan undang-undang, penyusunan naskah akademik, dan analisis isu strategis kelembagaan DPR RI.",
    },
    {
      id: "2",
      title: "Program Magang Komunikasi Publik & Media Kebijakan",
      komisi: "Humas & Pemberitaan Fraksi DPR RI",
      kuota: "10 Peserta",
      status: "TERBUKA",
      isApplied: false,
      deskripsi: "Pengelolaan publikasi kegiatan legislatif, liputan rapat kerja komisi, dan produksi konten edukasi politik bagi generasi muda.",
    },
    {
      id: "3",
      title: "Program Magang Hubungan Antar Lembaga & Administrasi Legislatif",
      komisi: "Sekretariat Komisi & Badan Legislasi",
      kuota: "8 Peserta",
      status: "TERBUKA",
      isApplied: false,
      deskripsi: "Administrasi kelengkapan rapat komisi, pengelolaan data penyaluran aspirasi, dan tata kelola kearsipan resmi.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/user/dashboard"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-full shadow-xs hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <span className="text-xs font-extrabold px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded-full border border-blue-300">
            Batch Magang Semester 2026/2027
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" /> Posisi Magang & Status Seleksi
          </h1>
          <p className="text-sm text-slate-500">
            Daftar posisi magang yang tersedia serta status lamaran aktif Anda.
          </p>
        </div>

        <div className="space-y-4">
          {POSISI_LIST.map((pos) => (
            <div
              key={pos.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-sm transition-all space-y-3 ${
                pos.isApplied
                  ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  {pos.komisi}
                </span>
                <span
                  className={`text-[11px] font-black px-3 py-1 rounded-full self-start sm:self-auto ${
                    pos.isApplied
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {pos.status}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{pos.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pos.deskripsi}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 font-medium">Kuota Pendaftaran: <strong>{pos.kuota}</strong></span>
                {pos.isApplied ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Berkas Terverifikasi
                  </span>
                ) : (
                  <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors">
                    Daftar Posisi Ini
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

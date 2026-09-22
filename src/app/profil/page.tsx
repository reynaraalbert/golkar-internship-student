"use client";

import React from "react";
import Link from "next/link";
import { useCmsContent } from "@/components/CmsProvider";
import { Shield, Scale, Gavel, FileCheck, CheckCircle2, Users, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilPage() {
  const { mitraKerja, pimpinan, pages } = useCmsContent();
  const profil = pages.find((p) => p.slug === "profil");
  const getSub = (sectionTitle: string) =>
    profil?.sections.find((s) => s.title === sectionTitle)?.subsections[0]?.fields || {};
  const header = getSub("Header Halaman Profil");
  const sejarah = getSub("Sejarah Komisi");
  const visi = getSub("Visi & Misi");
  const fungsi = profil?.sections.find((s) => s.title === "Tiga Fungsi Utama Parlemen")?.subsections || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Shield className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
          <span>{header.badge || "PORTAL PROFIL PERLENGKAPAN DPR RI"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          <span className="text-dpr-emerald dark:text-dpr-gold">{header.judul || "Tentang Komisi XIII DPR RI"}</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {header.deskripsi || "Komisi XIII merupakan alat kelengkapan DPR RI yang dibentuk berdasarkan Keputusan Rapat Paripurna DPR RI untuk mengawal Reformasi Hukum, HAM, Keimigrasian, Pemasyarakatan, dan Antikorupsi."}
        </p>
      </div>

      {/* Sejarah Komisi */}
      <div id="sejarah" className="scroll-mt-32 space-y-6 bg-slate-50 dark:bg-dpr-navy-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white border-b-2 border-dpr-emerald dark:border-dpr-gold inline-block pb-2">
          Sejarah Komisi XIII
        </h2>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
          <p>
            {sejarah.intro || "Komisi XIII dibentuk sebagai respons atas kebutuhan reformasi struktural di bidang penegakan hukum dan hak asasi manusia. Seiring dengan kompleksitas tantangan hukum nasional, keimigrasian, dan kapasitas pemasyarakatan, DPR RI melalui Rapat Paripurna menyepakati pembentukan komisi khusus ini untuk memperkuat fungsi pengawasan."}
          </p>
          <p>
            {sejarah.body || "Secara historis, tugas dan wewenang Komisi XIII sebelumnya tersebar di beberapa komisi lain. Pembentukan komisi yang berdiri sendiri ini menjadi tonggak sejarah penting (milestone) dalam upaya parlemen memberikan perhatian penuh pada isu-isu perlindungan HAM, pemberantasan korupsi, dan modernisasi sistem hukum Indonesia."}
          </p>
        </div>
      </div>

      {/* Vision & Mission Banner Card */}
      <div id="visi-misi" className="scroll-mt-32 glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-dpr-gold/30 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/40 to-white dark:from-dpr-navy-card dark:via-dpr-navy dark:to-[#18080C]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-4">
            <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">VISI UTAMA PARLEMEN</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              {visi.visi || "Terwujudnya Penegakan Hukum yang Adil, Humanis, dan Bebas Korupsi"}
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
              {visi.deskripsi || "Komisi XIII berkomitmen menjaga independensi kelembagaan penegak hukum, memastikan pemenuhan hak asasi warga negara, serta mendorong otomatisasi layanan imigrasi dan perbaikan kondisi lembaga pemasyarakatan secara berkelanjutan."}
            </p>
          </div>

          <div className="space-y-3 bg-white dark:bg-dpr-navy/90 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
              <span>4 Pilar Misi Kerja Komisi XIII</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Mempercepat kodifikasi dan harmonisasi perundang-undangan nasional bidang hukum pidana & perdata.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Memastikan pengalokasian anggaran berbasis kinerja bagi penguatan institusi KPK, Komnas HAM & LPSK.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Mengawasi penataan tata kelola keimigrasian di seluruh gerbang batas negara NKRI.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Mendorong sistem pembinaan pemasyarakatan humanis yang berorientasi pada reintegrasi sosial.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3 Core Functions Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">TUGAS POKOK KONSTITUSIONAL</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Tiga Fungsi Utama Parlemen</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 text-center hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-dpr-red/20 border border-dpr-emerald/40 dark:border-dpr-red/40 flex items-center justify-center mx-auto">
              <Gavel className="w-7 h-7 text-dpr-emerald-dark dark:text-dpr-gold" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">{fungsi[0]?.fields.judul || "1. Fungsi Legislasi"}</h3>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {fungsi[0]?.fields.isi || "Menyusun dan membahas Rancangan Undang-Undang (RUU) prioritas Prolegnas di bidang hukum, HAM, keimigrasian, dan pemasyarakatan."}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 text-center hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-dpr-gold/20 border border-amber-300 dark:border-dpr-gold/40 flex items-center justify-center mx-auto">
              <Scale className="w-7 h-7 text-dpr-emerald-dark dark:text-dpr-gold" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">{fungsi[1]?.fields.judul || "2. Fungsi Anggaran"}</h3>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {fungsi[1]?.fields.isi || "Membahas dan memberikan persetujuan terhadap alokasi Rencana Kerja & Anggaran Kementerian/Lembaga (RKA-K/L) mitra kerja Komisi XIII."}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 text-center hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-dpr-red/20 border border-dpr-emerald/40 dark:border-dpr-red/40 flex items-center justify-center mx-auto">
              <FileCheck className="w-7 h-7 text-dpr-emerald-dark dark:text-dpr-gold" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">{fungsi[2]?.fields.judul || "3. Fungsi Pengawasan"}</h3>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {fungsi[2]?.fields.isi || "Melakukan Rapat Dengar Pendapat (RDP), Kunjungan Kerja Spesifik, dan penyerapan aspirasi masyarakat atas pelaksanaan undang-undang."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Leadership Hierarchy Visual Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">STRUKTUR KEPEMIMPINAN</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Pimpinan Komisi XIII DPR RI 2024-2029</h2>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8">
          
          {/* Chairman Spotlight */}
          <div className="max-w-md mx-auto text-center space-y-3 p-6 rounded-2xl bg-gradient-to-b from-emerald-100 to-white dark:from-dpr-red/30 dark:to-dpr-navy border border-dpr-emerald/40 dark:border-dpr-gold/40 shadow-lg dark:shadow-gold-glow">
            <span className="bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-extrabold text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
              KETUA KOMISI XIII
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pimpinan[0].name}</h3>
            <p className="text-xs text-dpr-emerald-dark dark:text-dpr-gold font-semibold">{pimpinan[0].fraksi} — {pimpinan[0].dapil}</p>
          </div>

          {/* Vice Chairmen Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pimpinan.slice(1).map((wakil, idx) => (
              <div key={wakil.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-dpr-navy border border-slate-200 dark:border-white/10 space-y-2 text-center">
                <span className="text-[10px] text-dpr-emerald-dark dark:text-dpr-gold font-bold uppercase tracking-wider block">WAKIL KETUA {idx + 1}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{wakil.name}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{wakil.fraksi}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/anggota"
              className="inline-flex items-center gap-2 bg-slate-100 dark:bg-dpr-navy hover:bg-slate-200 dark:hover:bg-white/5 text-dpr-emerald-dark dark:text-dpr-gold font-bold text-xs px-6 py-3 rounded-full border border-slate-300 dark:border-dpr-gold/30 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Lihat Seluruh 46 Anggota Komisi XIII</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>

      {/* Daftar Mitra Kerja */}
      <div id="mitra-kerja" className="scroll-mt-32 space-y-8 pt-8 border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">KOLABORASI INSTITUSIONAL</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Daftar Mitra Kerja Komisi XIII</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Kementerian dan Lembaga Negara yang menjadi mitra strategis dalam pelaksanaan tugas komisi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mitraKerja.map((mitra) => (
            <div key={mitra.id} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 hover:shadow-lg transition-all bg-white/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={mitra.logoUrl} alt={`Logo ${mitra.acronym}`} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{mitra.name}</h3>
                  <span className="text-xs font-semibold text-dpr-emerald dark:text-dpr-gold">{mitra.acronym}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                {mitra.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

"use client";

import React from "react";
import { Handshake, ChevronRight, ChevronLeft, Building2, ExternalLink, Phone, Globe, Users, Tag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCmsContent } from "@/components/CmsProvider";

const mitraDetail = [
  { id: "mitra-1", phone: "(021) 526-4091", website: "kemenkumham.go.id", programUtama: ["Harmonisasi Regulasi Nasional", "Pelayanan Kekayaan Intelektual Online", "Administrasi Hukum Umum (AHU)"], keterangan: "Kementerian Hukum merupakan mitra kerja utama Komisi XIII dalam proses legislasi dan harmonisasi regulasi. Komisi XIII secara rutin menggelar Raker bulanan untuk mengawasi progres pembentukan RUU dan program kerja Kemenkum." },
  { id: "mitra-2", phone: "(021) 355-0180", website: "kemenham.go.id", programUtama: ["Kabupaten/Kota Peduli HAM", "Desk Penanganan Aduan HAM", "Program Pendidikan HAM Nasional"], keterangan: "Sebagai kementerian termuda yang berdiri sendiri mengurusi HAM, KemenHAM menjadi sorotan utama pengawasan Komisi XIII dalam memastikan efektivitas program-program perlindungan HAM di seluruh wilayah NKRI." },
  { id: "mitra-3", phone: "(021) 526-5533", website: "imigrasi.go.id", programUtama: ["Autogate & Smart Border Management", "E-Paspor & Visa On Arrival Digital", "Pembinaan WBP Berbasis Reintegrasi Sosial"], keterangan: "Kemenimipas mengelola dua isu strategis: keimigrasian (gerbang masuk-keluar NKRI) dan pemasyarakatan (Lapas & Rutan). Komisi XIII melakukan kunjungan kerja berkala ke Lapas & Rutan untuk memastikan standar pelayanan sesuai regulasi." },
  { id: "mitra-4", phone: "(021) 2557-8300", website: "kpk.go.id", programUtama: ["Pemberantasan Korupsi (OTT)", "Program Monitoring Center for Prevention (MCP)", "Pendidikan Antikorupsi di Sekolah"], keterangan: "KPK sebagai lembaga superbodi antikorupsi mendapat perhatian sangat khusus dari Komisi XIII. Komisi memastikan KPK tetap beroperasi secara independen dan anggarannya memadai untuk menjalankan fungsi penindakan dan pencegahan." },
  { id: "mitra-5", phone: "(021) 392-5230", website: "komnasham.go.id", programUtama: ["Pemantauan Situasi HAM Nasional", "Penyelidikan Kasus Pelanggaran HAM Berat", "Mediasi Sengketa Berbasis HAM"], keterangan: "Komnas HAM adalah lembaga independen pemantau HAM yang laporan tahunannya menjadi bahan utama rapat pengawasan Komisi XIII. Komisi mendorong penguatan kapasitas kelembagaan dan kewenangan penyelidikan Komnas HAM." },
  { id: "mitra-6", phone: "(021) 8259-3215", website: "lpsk.go.id", programUtama: ["Perlindungan Saksi & Korban Tipikor", "Rumah Aman bagi Saksi Terancam", "Kompensasi bagi Korban Terorisme"], keterangan: "LPSK menjamin keselamatan saksi dan korban dalam proses peradilan pidana. Komisi XIII mengawal anggaran dan regulasi LPSK agar perlindungan yang diberikan semakin luas dan efektif, termasuk bagi saksi kasus korupsi besar." },
  { id: "mitra-7", phone: "(021) 7884-0300", website: "bnpt.go.id", programUtama: ["Pencegahan Radikalisasi Online", "Deradikalisasi WBP Teroris di Lapas", "Sinergi Penanganan Terorisme Lintas Negara"], keterangan: "BNPT bertugas mencegah dan menanggulangi terorisme, termasuk deradikalisasi narapidana teroris di Lapas. Koordinasinya dengan Kemenimipas menjadi fokus pengawasan Komisi XIII untuk mencegah residivis terorisme." },
  { id: "mitra-8", phone: "(021) 374-3087", website: "bkn.go.id", programUtama: ["Seleksi CPNS & PPPK Nasional", "Sistem Informasi ASN (SIASN)", "Penilaian Kinerja ASN Berbasis SKP"], keterangan: "BKN mengelola data dan karier seluruh ASN Indonesia. Komisi XIII mengawasi BKN dalam konteks rekrutmen, pembinaan, dan penindakan disiplin pegawai di lingkungan Kemenkum, KemenHAM, dan Kemenimipas." },
];

export default function MitraKerjaPage() {
  const { mitraKerja, pages } = useCmsContent();
  const page = pages.find((p) => p.slug === "profil/mitra-kerja");
  const headerSub = page?.sections.find((s) => s.title === "Header Halaman Mitra Kerja")?.subsections[0]?.fields || {};

  const badge = headerSub.badge || "PROFIL KOMISI XIII — MITRA KERJA";
  const judul = headerSub.judul || "Daftar Mitra Kerja Komisi XIII";
  const deskripsi = headerSub.deskripsi || "8 Kementerian dan Lembaga Negara yang menjadi mitra strategis Komisi XIII DPR RI dalam pelaksanaan fungsi legislasi, anggaran, dan pengawasan.";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Handshake className="w-4 h-4" />
          <span>{badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          <span className="text-dpr-emerald dark:text-dpr-gold">{judul}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {deskripsi}
        </p>
      </div>

      {/* Summary Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { label: "Kementerian", value: "3" },
          { label: "Lembaga Negara", value: "5" },
          { label: "Total Mitra Kerja", value: "8" },
          { label: "RDP per Tahun", value: "±48" },
        ].map(s => (
          <div key={s.label} className="space-y-1">
            <p className="text-2xl font-extrabold text-dpr-emerald dark:text-dpr-gold">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mitra Cards */}
      <div className="space-y-6">
        {mitraKerja.map((mitra, i) => {
          const detail = mitraDetail.find(d => d.id === mitra.id);
          return (
            <motion.div
              key={mitra.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-dpr-emerald/30 dark:hover:border-dpr-gold/30 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Logo & Basic Info */}
                <div className="flex items-start gap-4 lg:w-64 shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                    <img src={mitra.logoUrl} alt={mitra.acronym} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-white bg-dpr-emerald dark:bg-dpr-gold dark:text-dpr-navy px-2 py-0.5 rounded-full">{mitra.acronym}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{mitra.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{mitra.ministerOrHead}</p>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Bidang Fokus
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{mitra.focusArea}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deskripsi Mitra</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">{mitra.description}</p>
                  </div>

                  {detail && (
                    <>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Catatan Pengawasan Komisi XIII
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">{detail.keterangan}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3" /> Program Unggulan yang Diawasi
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {detail.programUtama.map((prog, pi) => (
                            <span key={pi} className="px-3 py-1 rounded-full text-xs font-semibold bg-dpr-emerald/10 dark:bg-dpr-gold/10 text-dpr-emerald-dark dark:text-dpr-gold border border-dpr-emerald/20 dark:border-dpr-gold/20">
                              {prog}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold" />
                          <span>{detail.phone}</span>
                        </div>
                        <a href={`https://${detail.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-dpr-emerald dark:hover:text-dpr-gold transition-colors">
                          <Globe className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold" />
                          <span>{detail.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation — 2 Buttons side-by-side */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Link
            href="/profil/pimpinan"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold transition-all text-center group min-w-0"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform text-dpr-emerald dark:text-dpr-gold" />
            <span className="truncate">Pimpinan & Anggota</span>
          </Link>

          <Link
            href="/profil/sejarah"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all text-center group min-w-0"
          >
            <span className="truncate">Sejarah Komisi</span>
            <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

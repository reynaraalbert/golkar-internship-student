"use client";

import React from "react";
import { Target, Eye, CheckCircle2, Star, ChevronRight, ChevronLeft, Gavel, Scale, FileCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCmsContent } from "@/components/CmsProvider";

const MISI_ICONS = [Gavel, Scale, FileCheck, ShieldCheck];

const DEFAULT_NILAI = [
  { judul: "Integritas", deskripsi: "Setiap tindakan dan keputusan dilandasi kejujuran, konsistensi, dan tanggung jawab penuh kepada rakyat." },
  { judul: "Profesionalisme", deskripsi: "Mengedepankan kompetensi, keahlian, dan standar kerja tertinggi dalam setiap proses legislasi dan pengawasan." },
  { judul: "Keadilan", deskripsi: "Memastikan setiap regulasi yang dihasilkan memberikan keadilan yang setara bagi seluruh lapisan masyarakat tanpa diskriminasi." },
  { judul: "Humanisme", deskripsi: "Menempatkan harkat dan martabat manusia sebagai pusat dari setiap kebijakan hukum yang dihasilkan." },
  { judul: "Akuntabilitas", deskripsi: "Transparan dan bertanggung jawab kepada publik atas setiap keputusan anggaran, legislasi, dan hasil pengawasan." },
  { judul: "Kolaborasi", deskripsi: "Bekerja secara sinergis dengan Pemerintah, masyarakat sipil, akademisi, dan lembaga internasional untuk menghasilkan hukum yang berkualitas." },
];

const DEFAULT_MISI = [
  {
    no: 1, icon: Gavel,
    judul: "Pengembangan Kapasitas Kepemimpinan",
    isi: "Membentuk karakter kepemimpinan mahasiswa melalui pendampingan intensif, pembekalan materi politik kebangsaan, dan praktik kerja langsung di lingkungan parlemen.",
    targets: ["Pelatihan kepemimpinan dan komunikasi politik", "Mentoring eksklusif dengan Anggota DPR RI", "Simulasi persidangan dan rapat dengar pendapat"],
  },
  {
    no: 2, icon: Scale,
    judul: "Praktik Kebijakan Publik & Legislasi",
    isi: "Memberikan pengalaman nyata dalam proses penyusunan naskah akademik, perumusan regulasi, dan analisis kebijakan publik untuk memecahkan masalah strategis nasional.",
    targets: ["Penyusunan minimal 2 policy brief per peserta", "Keterlibatan dalam perancangan draft RUU", "Analisis data dan riset legislatif secara komprehensif"],
  },
  {
    no: 3, icon: FileCheck,
    judul: "Penguatan Wawasan Kebangsaan",
    isi: "Menanamkan nilai-nilai luhur Pancasila, konstitusi, dan semangat kebangsaan untuk melahirkan generasi muda yang peduli terhadap kemajuan dan keutuhan Negara Kesatuan Republik Indonesia.",
    targets: ["Dialog interaktif mengenai wawasan kebangsaan", "Kajian sejarah dan dinamika politik Indonesia", "Pembekalan nilai-nilai demokrasi Pancasila"],
  },
  {
    no: 4, icon: ShieldCheck,
    judul: "Pemberdayaan dan Pengabdian Masyarakat",
    isi: "Mengintegrasikan program magang dengan kegiatan turun lapang ke daerah pemilihan (Dapil) guna memahami dan menyerap aspirasi masyarakat secara langsung.",
    targets: ["Kegiatan serap aspirasi bersama Anggota Fraksi", "Pengembangan program pengabdian berbasis komunitas", "Pemecahan studi kasus sosial di berbagai daerah"],
  },
];

export default function VisiMisiPage() {
  const { pages } = useCmsContent();
  const page = pages.find((p) => p.slug === "profil/visi-misi");

  const getSection = (title: string) => page?.sections.find((s) => s.title === title);

  // Header
  const headerFields = getSection("Header Halaman Visi & Misi")?.subsections[0]?.fields || {};
  const badge = headerFields.badge || "PROFIL Golkar Internship — VISI & MISI";
  const judul = headerFields.judul || "Visi & Misi GOLKAR INTERNSHIP STUDENT";
  const deskripsi = headerFields.deskripsi || "Arah dan tujuan strategis Golkar Internship dalam membentuk pemimpin masa depan Indonesia yang inovatif, berintegritas, dan profesional melalui pendidikan politik terpadu.";

  // Visi
  const visiFields = getSection("Visi Utama Program")?.subsections[0]?.fields || {};
  const visiText = visiFields.visi || "Menjadi pusat inkubasi kepemimpinan kaum muda yang melahirkan agen perubahan profesional, berkarakter kebangsaan, dan siap berkontribusi dalam pembangunan politik nasional.";
  const visiPenjelasan = visiFields.penjelasan || "Visi ini menjadi kompas dan tolok ukur seluruh kegiatan pembelajaran dan penugasan Golkar Internship bagi peserta magang di lingkungan parlemen.";
  const visiJudulSub = visiFields.judul || "GOLKAR INTERNSHIP STUDENT";

  // Misi
  const misiSubs = getSection("Misi Kerja Program (4 Pilar Strategis)")?.subsections || [];
  const misi = misiSubs.length > 0
    ? misiSubs.map((sub, i) => ({
        no: Number(sub.fields.nomorMisi) || i + 1,
        icon: MISI_ICONS[i] || Gavel,
        judul: sub.fields.judul || DEFAULT_MISI[i]?.judul || "–",
        isi: sub.fields.isi || DEFAULT_MISI[i]?.isi || "–",
        targets: [
          sub.fields.target1 || DEFAULT_MISI[i]?.targets[0] || "",
          sub.fields.target2 || DEFAULT_MISI[i]?.targets[1] || "",
          sub.fields.target3 || DEFAULT_MISI[i]?.targets[2] || "",
        ].filter(Boolean),
      }))
    : DEFAULT_MISI;

  // Nilai-Nilai
  const nilaiSubs = getSection("Nilai-Nilai Utama Program")?.subsections || [];
  const nilaiNilai = nilaiSubs.length > 0
    ? nilaiSubs.map((sub) => ({
        judul: sub.fields.judul || "–",
        deskripsi: sub.fields.deskripsi || "–",
      }))
    : DEFAULT_NILAI;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Target className="w-4 h-4" />
          <span>{badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          <span className="text-dpr-emerald dark:text-dpr-gold">{judul}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {deskripsi}
        </p>
      </div>

      {/* VISI */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-dpr-emerald/40 dark:border-dpr-gold/40 bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-dpr-navy-card dark:via-dpr-navy dark:to-[#18080C] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-dpr-emerald/5 dark:bg-dpr-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-dpr-emerald dark:bg-dpr-gold flex items-center justify-center shadow-lg">
              <Eye className="w-6 h-6 text-white dark:text-dpr-navy" />
            </div>
            <div>
              <p className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">Visi Utama</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{visiJudulSub}</h2>
            </div>
          </div>
          <blockquote className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug italic border-l-4 border-dpr-emerald dark:border-dpr-gold pl-6">
            &ldquo;{visiText}&rdquo;
          </blockquote>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
            {visiPenjelasan}
          </p>
        </div>
      </div>

      {/* MISI */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">4 PILAR STRATEGIS</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Misi Kerja Golkar Internship</h2>
        </div>
        <div className="space-y-6">
          {misi.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 space-y-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/20 dark:border-dpr-gold/20 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-dpr-emerald dark:text-dpr-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-wider mb-1">Misi {item.no}</p>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.judul}</h3>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-16 text-justify">{item.isi}</p>
                <div className="pl-16 space-y-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Capaian:</p>
                  {item.targets.map((t, ti) => (
                    <div key={ti} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 dark:text-slate-300">{t}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Nilai-Nilai */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">LANDASAN KERJA</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Nilai Utama Golkar Internship</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nilaiNilai.map((nilai, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{nilai.judul}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{nilai.deskripsi}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation — 2 Buttons side-by-side */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Link
            href="/profil/sejarah"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold transition-all text-center group min-w-0"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform text-dpr-emerald dark:text-dpr-gold" />
            <span className="truncate">Sejarah Program</span>
          </Link>

          <Link
            href="/profil/pimpinan"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all text-center group min-w-0"
          >
            <span className="truncate">Pimpinan & Anggota</span>
            <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

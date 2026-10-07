"use client";

import React from "react";
import { Clock, ChevronRight, ChevronLeft, BookOpen, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCmsContent } from "@/components/CmsProvider";

const DEFAULT_FACTS = [
  { label: "Tahun Berdiri", value: "2024", icon: Calendar },
  { label: "Periode Aktif", value: "2024–2029", icon: Clock },
  { label: "Total Anggota", value: "46 Orang", icon: Star },
  { label: "Mitra Kerja", value: "8 K/L", icon: BookOpen },
];

const DEFAULT_MILESTONES = [
  {
    year: "Oktober 2024",
    title: "Pembentukan GOLKAR INTERNSHIP STUDENT Periode 2024–2029",
    description: "Peluncuran Golkar Internship Student sebagai platform kaderisasi dan pembinaan politik bagi mahasiswa untuk mempelajari praktik legislasi secara langsung.",
    highlight: true,
  },
  {
    year: "2019–2024",
    title: "Era Komisi III – Cikal Bakal Golkar Internship",
    description: "Sebelum terbentuk sebagai program magang mandiri, fungsi-fungsi pembinaan politik mahasiswa dilakukan secara sporadis oleh berbagai elemen internal.",
    highlight: false,
  },
  {
    year: "2014",
    title: "Reformasi Hukum Nasional & Revisi UU Keimigrasian",
    description: "Pengesahan UU Keimigrasian No. 6 Tahun 2011 menjadi tonggak reformasi hukum keimigrasian. Komisi yang membidangi hukum kala itu aktif terlibat dalam harmonisasi regulasi imigrasi dengan standar UNHCR dan IOM.",
    highlight: false,
  },
  {
    year: "2003",
    title: "Pembentukan KPK – Awal Babak Antikorupsi",
    description: "Komisi Pemberantasan Korupsi (KPK) lahir lewat UU No. 30 Tahun 2002. Sejak saat itu, pengawasan legislatif terhadap lembaga antikorupsi menjadi salah satu agenda utama komisi yang membidangi hukum di DPR RI.",
    highlight: false,
  },
  {
    year: "1999",
    title: "Era Reformasi – Momentum HAM Nasional",
    description: "Pasca reformasi 1998, UU No. 39 Tahun 1999 tentang Hak Asasi Manusia dan UU No. 26 Tahun 2000 tentang Pengadilan HAM lahir. Komisi DPR yang membidangi hukum berperan kunci dalam proses legislasi ini, meletakkan fondasi hukum HAM modern Indonesia.",
    highlight: false,
  },
  {
    year: "1945",
    title: "Fondasi Konstitusional – DPR RI Berdiri",
    description: "Sejak dibentuk, Partai Golkar terus berkomitmen untuk memberikan pendidikan politik yang berkelanjutan. Fungsi legislasi dan pengawasan menjadi bagian penting dari DNA pelatihan kader.",
    highlight: false,
  },
];

const DEFAULT_NARASI = [
  "Golkar Internship Student merupakan inisiatif strategis yang dibentuk pada awal periode untuk memberikan wadah pembinaan kepemimpinan mahasiswa di era modern.",
  "Sebelum terbentuk sebagai platform magang terstruktur, pendidikan politik mahasiswa dilakukan melalui berbagai organisasi sayap partai. Seiring tingginya antusiasme generasi muda, dirancanglah program magang intensif di parlemen.",
  "Golkar Internship hadir untuk menjembatani mahasiswa unggul dengan praktik kerja nyata di lingkungan dewan, memberikan pengalaman langsung dalam proses perumusan kebijakan yang transparan dan humanis.",
  "Fraksi Partai Golkar, sebagai salah satu fraksi terbesar di DPR RI, menempatkan beberapa kader terbaiknya di Golkar Internship. Para anggota Fraksi Golkar di Golkar Internship membawa rekam jejak dan keahlian yang beragam — dari pakar hukum, advokat senior, dokter, hingga teknolog — untuk memastikan bahwa agenda reformasi hukum dijalankan dengan pendekatan yang komprehensif, berbasis data, dan berpihak pada kepentingan rakyat.",
];

export default function SejarahPage() {
  const { pages } = useCmsContent();
  const page = pages.find((p) => p.slug === "profil/sejarah");

  const getSection = (title: string) =>
    page?.sections.find((s) => s.title === title);

  // Header
  const headerSub = getSection("Header Halaman Sejarah")?.subsections[0]?.fields || {};
  const badge = headerSub.badge || "PROFIL Golkar Internship — SEJARAH";
  const judul = headerSub.judul || "Sejarah GOLKAR INTERNSHIP STUDENT";
  const deskripsi = headerSub.deskripsi || "Perjalanan panjang pembentukan GOLKAR INTERNSHIP STUDENT sebagai garda terdepan pembinaan pemimpin bangsa.";

  // Facts
  const factSubs = getSection("Statistik & Fakta Komisi")?.subsections || [];
  const facts = factSubs.length > 0
    ? factSubs.map((sub, i) => ({
        label: sub.fields.label || DEFAULT_FACTS[i]?.label || "Label",
        value: sub.fields.value || DEFAULT_FACTS[i]?.value || "–",
        icon: DEFAULT_FACTS[i]?.icon || Calendar,
      }))
    : DEFAULT_FACTS;

  // Narasi
  const narasiSubs = getSection("Narasi Latar Belakang Pembentukan")?.subsections || [];
  const narasi = narasiSubs.length > 0
    ? narasiSubs.map((sub) => sub.fields.teks || "")
    : DEFAULT_NARASI;

  // Timeline
  const timelineSubs = getSection("Linimasa Sejarah Penting")?.subsections || [];
  const milestones = timelineSubs.length > 0
    ? timelineSubs.map((sub) => ({
        year: sub.fields.tahun || "–",
        title: sub.fields.judul || "–",
        description: sub.fields.deskripsi || "–",
        highlight: sub.fields.highlight === "true",
      }))
    : DEFAULT_MILESTONES;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Clock className="w-4 h-4" />
          <span>{badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          <span className="text-dpr-emerald dark:text-dpr-gold">{judul}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {deskripsi}
        </p>
      </div>

      {/* Fact Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div key={fact.label} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-white/10 text-center space-y-2">
              <Icon className="w-6 h-6 text-dpr-emerald dark:text-dpr-gold mx-auto" />
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{fact.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{fact.label}</p>
            </div>
          );
        })}
      </div>

      {/* Narrative Section */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-dpr-gold/20 space-y-6 bg-gradient-to-br from-slate-50 to-white dark:from-dpr-navy-card dark:to-dpr-navy">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b-2 border-dpr-emerald dark:border-dpr-gold pb-3 inline-block">
          Latar Belakang Pembentukan
        </h2>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
          {narasi.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center">
          Linimasa Sejarah Penting
        </h2>
        <div className="relative pl-8 border-l-2 border-dpr-emerald dark:border-dpr-gold space-y-10">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative space-y-2 ${m.highlight ? "glass-panel p-6 rounded-2xl border border-dpr-emerald/40 dark:border-dpr-gold/40 bg-dpr-emerald/5 dark:bg-dpr-gold/5 shadow-lg" : ""}`}
            >
              <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-dpr-emerald dark:bg-dpr-gold border-2 border-white dark:border-slate-900 shadow" />
              <span className={`text-xs font-bold uppercase tracking-wider ${m.highlight ? "text-dpr-emerald dark:text-dpr-gold" : "text-slate-500 dark:text-slate-400"}`}>{m.year}</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{m.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">{m.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation — 2 Buttons side-by-side */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <Link
            href="/profil"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold transition-all text-center group min-w-0"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform text-dpr-emerald dark:text-dpr-gold" />
            <span className="truncate">Profil Utama</span>
          </Link>

          <Link
            href="/profil/visi-misi"
            className="flex items-center justify-center gap-1 sm:gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs sm:text-sm px-2.5 sm:px-5 py-3 rounded-2xl shadow-md hover:opacity-90 transition-all text-center group min-w-0"
          >
            <span className="truncate">Visi & Misi</span>
            <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

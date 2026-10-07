"use client";

import React from "react";
import Link from "next/link";
import { useCmsContent } from "@/components/CmsProvider";
import { Shield, Scale, Gavel, FileCheck, CheckCircle2, Users, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, StaggerList, FadeCard, SlideIn } from "@/components/ui/AnimationWrapper";

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
      <Reveal className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Shield className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
          <span>{header.badge || "PROFIL PROGRAM MAGANG"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          <span className="text-dpr-emerald dark:text-dpr-gold">{header.judul || "Tentang GOLKAR INTERNSHIP STUDENT"}</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {header.deskripsi || "Golkar Internship Student (GIS) adalah wadah pembinaan kepemimpinan dan pendidikan politik bagi mahasiswa unggul untuk berkontribusi nyata dalam proses legislasi dan kebijakan publik."}
        </p>
      </Reveal>

      {/* Sejarah Komisi */}
      <Reveal>
      <div id="sejarah" className="scroll-mt-32 space-y-6 bg-slate-50 dark:bg-dpr-navy-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white border-b-2 border-dpr-emerald dark:border-dpr-gold inline-block pb-2">
          Sejarah Golkar Internship
        </h2>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
          <p>
            {sejarah.intro || "Golkar Internship Student dibentuk sebagai platform strategis untuk menjembatani kesenjangan antara teori akademik dan praktik nyata di dunia politik dan pemerintahan. Program ini memberikan ruang bagi generasi muda untuk memahami dinamika legislasi."}
          </p>
          <p>
            {sejarah.body || "Sebagai program magang resmi Partai Golkar di DPR RI, inisiatif ini menjadi komitmen partai dalam mencetak kader pemimpin bangsa yang berintegritas, kritis, dan siap menghadapi tantangan kebijakan nasional."}
          </p>
        </div>
      </div>
      </Reveal>

      {/* Vision & Mission Banner Card */}
      <div id="visi-misi" className="scroll-mt-32 glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-dpr-gold/30 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/40 to-white dark:from-dpr-navy-card dark:via-dpr-navy dark:to-[#18080C]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <SlideIn direction="left">
          <div className="space-y-4">
            <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">VISI PROGRAM</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              {visi.visi || "Mencetak Pemimpin Masa Depan yang Kritis, Inovatif, dan Berintegritas"}
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed text-justify">
              {visi.deskripsi || "Golkar Internship Student (GIS) berkomitmen untuk menciptakan ekosistem pembelajaran yang kolaboratif, membekali peserta dengan keterampilan praktis di bidang legislasi, dan menanamkan nilai-nilai kebangsaan yang luhur."}
            </p>
          </div>
          </SlideIn>

          <SlideIn direction="right">
          <div className="space-y-3 bg-white dark:bg-dpr-navy/90 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
              <span>4 Pilar Misi Kerja Golkar Internship</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Pendidikan politik terapan yang mendalam melalui mentorship ahli.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Pengembangan kompetensi teknis dalam analisis kebijakan dan perumusan undang-undang.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Pembentukan karakter kepemimpinan yang etis dan berwawasan kebangsaan.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <span>Membangun jejaring profesional berskala nasional di lingkungan parlemen dan pemerintahan.</span>
              </div>
            </div>
          </div>
          </SlideIn>

        </div>
      </div>

      {/* 3 Core Functions Section */}
      <div className="space-y-8">
        <Reveal className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">TUGAS POKOK KONSTITUSIONAL</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Tiga Fungsi Utama Parlemen</h2>
        </Reveal>

        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Gavel, title: fungsi[0]?.fields.judul || "1. Praktik Legislasi", desc: fungsi[0]?.fields.isi || "Mempelajari dan terlibat langsung dalam proses analisis, penyusunan, dan harmonisasi draf RUU.", bg: "bg-emerald-100 dark:bg-dpr-red/20 border-dpr-emerald/40 dark:border-dpr-red/40" },
            { icon: Scale, title: fungsi[1]?.fields.judul || "2. Kajian Kebijakan", desc: fungsi[1]?.fields.isi || "Menyusun policy brief dan analisis kebijakan publik berbasis data untuk mendukung pengambilan keputusan.", bg: "bg-amber-100 dark:bg-dpr-gold/20 border-amber-300 dark:border-dpr-gold/40" },
            { icon: FileCheck, title: fungsi[2]?.fields.judul || "3. Keterlibatan Publik", desc: fungsi[2]?.fields.isi || "Mendampingi proses penyerapan aspirasi masyarakat dan pengelolaan komunikasi strategis partai.", bg: "bg-emerald-100 dark:bg-dpr-red/20 border-dpr-emerald/40 dark:border-dpr-red/40" },
          ].map((fn, i) => {
            const Icon = fn.icon;
            return (
              <FadeCard key={i} index={i} className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 text-center hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all">
                <div className={`w-14 h-14 rounded-2xl ${fn.bg} border flex items-center justify-center mx-auto`}>
                  <Icon className="w-7 h-7 text-dpr-emerald-dark dark:text-dpr-gold" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg">{fn.title}</h3>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{fn.desc}</p>
              </FadeCard>
            );
          })}
        </StaggerList>
      </div>

      {/* Leadership Hierarchy Visual Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest">STRUKTUR KEPEMIMPINAN</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Pimpinan GOLKAR INTERNSHIP STUDENT 2024-2029</h2>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8">
          
          {/* Chairman Spotlight */}
          {pimpinan && pimpinan.length > 0 && (
            <div className="max-w-md mx-auto text-center space-y-3 p-6 rounded-2xl bg-gradient-to-b from-amber-100 to-white dark:from-amber-900/30 dark:to-slate-900 border border-amber-300 dark:border-amber-400/40 shadow-lg">
              <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                KETUA Golkar Internship
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pimpinan[0]?.name || "Ketua GIS"}</h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{pimpinan[0]?.fraksi} — {pimpinan[0]?.dapil}</p>
            </div>
          )}

          {/* Vice Chairmen Row */}
          {pimpinan && pimpinan.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pimpinan.slice(1).map((wakil, idx) => (
                <div key={wakil.id || idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2 text-center">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider block">WAKIL KETUA {idx + 1}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{wakil.name}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{wakil.fraksi}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/anggota"
              className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-white/5 text-amber-700 dark:text-amber-300 font-bold text-xs px-6 py-3 rounded-full border border-slate-300 dark:border-amber-400/30 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Lihat Seluruh Jajaran Pengurus GIS</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>



    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsArticle, AgendaItem } from "@/lib/data";
import { useCmsContent } from "@/components/CmsProvider";
import NewsModal from "@/components/NewsModal";
import AgendaModal from "@/components/AgendaModal";
import {
  Users,
  Calendar,
  ArrowRight,
  Play,
  CheckCircle2,
  Building2,
  Gavel,
  MapPin,
  Clock,
  Mail,
  Instagram,
  ExternalLink,
  Youtube,
  Twitter,
  Globe,
  Share2,
  Award,
  BookOpen,
  Briefcase,
  FileCheck,
  UserCheck,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Laptop,
  Scale,
  Send,
  HelpCircle,
  TrendingUp,
  FileText,
  UserPlus
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Animation Variants ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Scroll section wrapper
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function HomePage() {
  const { stats, mitraKerja, berita, agenda, siteContent, posisi_magang, steps: cmsSteps, requirements: cmsReqs, faqs: cmsFaqs } = useCmsContent();
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [selectedAgenda, setSelectedAgenda] = useState<AgendaItem | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTrack, setActiveTrack] = useState<string>("");

  const hero = siteContent.hero;
  const statBar = siteContent.statBar;
  const mitraSection = siteContent.mitraSection;
  const kontak = siteContent.kontak;
  const maps = siteContent.maps;
  const liveAgenda = agenda.find((a) => a.status === "LIVE NOW") || null;

  // Track data mapped directly from posisi_magang collection
  const tracks = (posisi_magang && posisi_magang.length > 0) ? posisi_magang.map((p: any, i: number) => {
    const icons = [LucideIcons.Gavel, LucideIcons.Laptop, LucideIcons.Globe, LucideIcons.TrendingUp, LucideIcons.Building2];
    return {
      id: p.id || String(i),
      title: p.namaKomisi,
      category: p.bidangKerja || "Legislatif",
      icon: icons[i % icons.length],
      desc: p.deskripsiTugas || "Fokus pada analisis kebijakan dan pengawasan regulasi.",
      skills: p.persyaratan ? p.persyaratan.split(",").map((s: string) => s.trim()) : ["Analisis", "Riset"]
    };
  }) : [];

  // Automatically select the first track when loaded
  React.useEffect(() => {
    if (tracks.length > 0 && !activeTrack) {
      setActiveTrack(tracks[0].id);
    }
  }, [tracks, activeTrack]);

  // Selection process steps
  const steps = (cmsSteps && cmsSteps.length > 0) ? cmsSteps.map((s: any, i: number) => {
    const icons = [UserPlus, FileCheck, UserCheck, GraduationCap];
    return { ...s, icon: icons[i % icons.length] };
  }) : [
    {
      step: "01",
      title: "Registrasi Akun",
      subtitle: "Buat Akun Portal GIS",
      desc: "Daftar dan buat akun peserta di portal resmi Golkar Internship Student secara gratis.",
      icon: UserPlus
    },
    {
      step: "02",
      title: "Lengkapi Berkas",
      subtitle: "Unggah Dokumen Syarat",
      desc: "Isi biodata diri, pilih divisi magang pilihan, serta unggah CV, Transkrip & Surat Kampus.",
      icon: FileCheck
    },
    {
      step: "03",
      title: "Seleksi & Wawancara",
      subtitle: "Verifikasi & Interview",
      desc: "Tim verifikator melakukan seleksi administrasi serta wawancara kualifikasi secara daring/luring.",
      icon: UserCheck
    },
    {
      step: "04",
      title: "Pengumuman & Onboarding",
      subtitle: "Penerimaan & Pembekalan",
      desc: "Pengumuman kelulusan peserta, pembagian mentor fraksi, dan orientasi magang.",
      icon: GraduationCap
    }
  ];

  // Requirements checklist
  const requirements = (cmsReqs && cmsReqs.length > 0) ? cmsReqs.map((r: any) => r.text) : [
    "Mahasiswa aktif S1/D4 (min. Semester 5) atau D3 (min. Semester 4)",
    "IPK minimal 3.00 dari skala 4.00 dari Perguruan Tinggi terakreditasi",
    "Surat Pengantar / Rekomendasi Resmi dari Dekan Fakultas / Perguruan Tinggi",
    "Curriculum Vitae (CV) terbaru & Portofolio pendukung (jika ada)",
    "Transkrip Nilai Akademik Terbaru yang telah terverifikasi",
    "Pasfoto Berwarna formal terbaru & Scan KTP / Kartu Mahasiswa (KTM)"
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Reynara Albert Pradana",
      univ: "Universitas Indonesia",
      major: "'25",
      role: "Alumni GIS batch 3",
      quote: "Pengalaman luar biasa dibimbing langsung oleh tenaga ahli dan politisi senior. Saya belajar menyusun policy brief RUU secara riil!",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
    },
    {
      name: "Maura",
      univ: "Universitas Brawijaya",
      major: "Hubungan Internasional '22",
      role: "Alumni GIS batch 1",
      quote: "Sangat membantu konversi SKS kuliah dan menambah jejaring nasional. Ruang diskusi yang inklusif dan profesional!",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
    },
    {
      name: "Imara Syafira Rachmania",
      univ: "UIN Bandung",
      major: "Ilmu Komunikasi '23",
      role: "Alumni GIS batch 2",
      quote: "Mengembangkan portal digital publik dengan tantangan data riil. Mentorship yang diberikan sangat intensif dan berbobot.",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
    }
  ];

  // FAQ list
  const faqs = (cmsFaqs && cmsFaqs.length > 0) ? cmsFaqs : [
    {
      q: "Apakah program magang Golkar Internship Student terbuka untuk umum?",
      a: "Ya! Program ini terbuka bagi seluruh mahasiswa aktif S1/D4 maupun D3 dari Perguruan Tinggi Negeri (PTN) dan Swasta (PTS) di seluruh Indonesia."
    },
    {
      q: "Berapa lama durasi pelaksanaan magang?",
      a: "Durasi magang berlangsung selama 3 hingga 6 bulan disesuaikan dengan kurikulum program magang dan kalender akademik perguruan tinggi peserta."
    },
    {
      q: "Apakah program magang ini dapat dikonversi ke SKS Kuliah?",
      a: "Ya, ini merupakan program magang mandiri, di mana hasil penilaian dan sertifikat resmi dapat diajukan secara mandiri oleh peserta ke kampusnya masing-masing untuk dikonversi menjadi SKS."
    },
    {
      q: "Apakah peserta dikenakan biaya pendaftaran?",
      a: "Tidak ada biaya sama sekali. Seluruh proses pendaftaran dan pelaksanaan program magang Golkar Internship Student adalah 100% GRATIS."
    },
    {
      q: "Bagaimana mekanisme pelaksanaan magang (WFH / WFO)?",
      a: "Pelaksanaan magang mengusung metode Hybrid / WFO di Lingkungan DPP Partai Golkar & Kompleks Parlemen DPR RI Jakarta, dengan fleksibilitas jadwal akademik."
    }
  ];

  return (
    <div className="pb-20 overflow-x-hidden">

      {/* --- RUNNING ANNOUNCEMENT MARQUEE TICKER --- */}
      {siteContent.announcement?.text && (
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 py-2.5 px-4 font-bold text-xs shadow-md border-b border-amber-300 flex items-center justify-between gap-4">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                {siteContent.announcement.badge || "PENGUMUMAN"}
              </span>
            </div>

            <div 
              className="overflow-hidden flex-1 mx-2 flex items-center"
              style={{ 
                maskImage: "linear-gradient(to right, transparent, black 15px, black calc(100% - 15px), transparent)", 
                WebkitMaskImage: "linear-gradient(to right, transparent, black 15px, black calc(100% - 15px), transparent)" 
              }}
            >
              {React.createElement(
                "marquee",
                { className: "text-[11px] sm:text-xs font-semibold whitespace-nowrap pt-0.5", scrollamount: "5" },
                siteContent.announcement.text
              )}
            </div>

            {siteContent.announcement.ctaHref && (
              <Link
                href={siteContent.announcement.ctaHref}
                className="shrink-0 bg-slate-950 text-amber-300 hover:bg-slate-900 text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 transition-transform hover:scale-105"
              >
                <span>{siteContent.announcement.ctaLabel || "Selengkapnya"}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="relative flex flex-col items-center overflow-hidden pt-10 sm:pt-14 pb-28 sm:pb-36 transition-colors duration-300">
        
        {/* Background Image of Parliament Building (Clear photo with subtle shadow blur for text readability) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero-peserta-magang.png"
            alt="Peserta Magang Golkar Internship DPR RI"
            fill
            className="object-cover object-center brightness-[0.70] dark:brightness-[0.60] transition-all duration-500"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* Transparent Gradient Shadow Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/35 to-slate-950/80 z-0" />
          {/* Ambient Lighting Accent Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none z-0" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-5 sm:space-y-7">
          
          {/* Top Badge */}
          {hero?.badge && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-sm backdrop-blur-md uppercase tracking-wider"
            >
              <span>{hero.badge}</span>
            </motion.div>
          )}

          {/* Main Title – animated word by word */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="space-y-2 sm:space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase drop-shadow-md overflow-hidden">
              {(hero?.title1 || "Gerbang Kompetensi").split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-amber-400 tracking-wide uppercase leading-tight drop-shadow-md overflow-hidden">
              {(hero?.title2 || "Masa Depan Legislatif").split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          {/* Centered Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-slate-200 text-sm sm:text-base lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed pt-1"
          >
            {hero?.subtitle || "Platform terintegrasi untuk Magang, Praktik Kerja Lapangan, dan Penelitian di Lingkungan Fraksi Partai Golkar DPR RI."}
          </motion.p>

          {/* Centered Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-3"
          >
            <Link
              href={hero?.ctaPrimaryHref || "/user/login"}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-all flex items-center gap-2 border border-amber-300/60"
            >
              <UserPlus className="w-4 h-4" />
              <span>{hero?.ctaPrimaryLabel || "Daftar Magang Sekarang"}</span>
            </Link>

            <a
              href={hero?.ctaSecondaryHref || "#alur-seleksi"}
              className="glass-panel text-slate-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-300 font-bold text-xs sm:text-sm px-7 py-4 rounded-full border border-slate-300 dark:border-white/20 transition-all flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 hover:bg-white/90 dark:hover:bg-slate-800/80 backdrop-blur-md shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{hero?.ctaSecondaryLabel || "Cek Alur & Syarat"}</span>
            </a>
          </motion.div>

          {/* Live Hearing Callout if available */}
          {liveAgenda && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setSelectedAgenda(liveAgenda)}
              className="glass-panel p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3.5 max-w-xl mx-auto border border-amber-400/60 dark:border-amber-400/40 shadow-md hover:scale-[1.01] bg-white/80 dark:bg-slate-900/90 text-left mt-4 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                <Play className="w-5 h-5 ml-0.5 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase shrink-0">SIARAN LANGSUNG</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold truncate">Ruang GIS DPR RI</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-bold truncate">
                  {liveAgenda.title}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            </motion.div>
          )}

        </div>
      </section>

      {/* --- OVERLAPPING PLATFORM CARD (MAGANG.DPR.GO.ID STYLE) --- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-amber-400/25 shadow-2xl text-center space-y-6 backdrop-blur-xl"
        >
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.4 }} className="inline-block">
            <span className="bg-amber-500 text-slate-950 font-extrabold text-xs px-6 py-2 rounded-full uppercase tracking-wider shadow-md">
              TENTANG PLATFORM
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-medium max-w-3xl mx-auto">
            {hero?.description || <><strong className="text-slate-950 dark:text-amber-400 font-bold">GOLKAR INTERNSHIP STUDENT</strong> adalah ekosistem digital dari Fraksi Partai Golkar DPR RI. Kami hadir untuk memfasilitasi mahasiswa dan pelajar dalam mengembangkan kompetensi, mengelola administrasi secara transparan, serta berkolaborasi langsung dalam lingkungan kerja legislatif Indonesia.</>}
          </motion.p>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { value: "1 - 2 Bulan", label: "Durasi Magang" },
              { value: "Tersedia", label: "Konversi SKS" },
              { value: "Banyak Pilihan", label: "Posisi Magang" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="bg-amber-50/90 dark:bg-slate-800/80 p-4 rounded-2xl border border-amber-200/90 dark:border-white/10 text-center">
                <span className="text-xl sm:text-2xl font-black text-[#B45309] dark:text-[#F5C518] block">{item.value}</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* --- STATS COUNTER BAR --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl bg-white/80 dark:bg-slate-900/80"
        >
          {[
            { num: statBar.value1 || "1,500+", label: statBar.label1 || "Alumni Magang", gold: true },
            { num: statBar.value2 || "30+", label: statBar.label2 || "Universitas Partner", gold: false },
            { num: statBar.value3 || "98%", label: statBar.label3 || "Kepuasan Mentorship", gold: true },
            { num: statBar.value4 || "100+", label: statBar.label4 || "Policy Brief Dihasilkan", gold: false },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="space-y-1">
              <span className={`text-3xl sm:text-4xl font-black block ${s.gold ? "text-[#B45309] dark:text-[#F5C518]" : "text-slate-950 dark:text-white"}`}>{s.num}</span>
              <span className="text-xs text-slate-800 dark:text-slate-300 font-bold block uppercase tracking-wider">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- TENTANG PROGRAM & KEUNGGULAN (PILLARS) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-12 sm:mt-16">
        <Reveal className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>{siteContent.keunggulan?.subtitle || "MENGAPA MEMILIH GOLKAR INTERNSHIP STUDENT"}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
            {siteContent.keunggulan?.title || "Keunggulan Utama Program Magang GIS"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
            Program magang dirancang secara profesional untuk memberikan pengalaman kerja nyata, kepemimpinan, dan jejaring publik strategis.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {siteContent.keunggulanItems && siteContent.keunggulanItems.length > 0 ? siteContent.keunggulanItems.map((pillar: any, i: number) => {
            const Icon = (LucideIcons as any)[pillar.iconName || "Users"] || LucideIcons.Users;
            return (
              <motion.div key={i} variants={fadeUp} custom={i} whileHover={{ y: -6, scale: 1.02 }} className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-400 transition-all space-y-4 bg-white/80 dark:bg-slate-900/80 shadow-md group">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 flex items-center justify-center text-[#B45309] dark:text-[#F5C518] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-slate-950 dark:text-white font-bold text-base">{pillar.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{pillar.desc}</p>
              </motion.div>
            );
          }) : (
            [
              { icon: Users, title: "Mentorship Langsung", desc: "Dibimbing langsung oleh Anggota DPR RI, tenaga ahli komisi, dan pakar kebijakan publik berpengalaman." },
              { icon: Award, title: "Sertifikat Magang Mandiri", desc: "Mendapatkan sertifikat resmi dari DPP Partai Golkar yang dapat diajukan secara mandiri untuk proses konversi SKS perkuliahan." },
              { icon: Gavel, title: "Pengalaman Rapat DPR", desc: "Keterlibatan langsung dalam rapat dengar pendapat (RDP), analisis naskah akademik, dan pengawasan hukum." },
              { icon: Globe, title: "Jaringan Nasional", desc: "Akses ke jaringan alumni mahasiswa se-Indonesia, tokoh politik nasional, dan profesional di berbagai sektor." },
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div key={i} variants={fadeUp} custom={i} whileHover={{ y: -6, scale: 1.02 }} className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-amber-400 transition-all space-y-4 bg-white/80 dark:bg-slate-900/80 shadow-md group">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 flex items-center justify-center text-[#B45309] dark:text-[#F5C518] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-slate-950 dark:text-white font-bold text-base">{pillar.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </section>

      {/* --- BERITA & PENGUMUMAN TERKINI --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-12 sm:mt-16">
        <Reveal className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest">{siteContent.berita?.subtitle || "INFORMASI & SEPUTAR PARLEMEN"}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">{siteContent.berita?.title || "Berita & Siaran Pers Golkar Internship"}</h2>
          </div>
          <Link href="/berita" className="text-xs text-[#B45309] dark:text-[#F5C518] font-bold hover:underline flex items-center gap-1 shrink-0">
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {berita.filter(a => a.pinned).slice(0, 6).map((article, idx) => (
            <motion.div
              key={article.id}
              variants={fadeUp}
              custom={idx}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedNews(article)}
              className="glass-panel rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-white/10 hover:border-amber-400 transition-all group flex flex-col justify-between bg-white/90 dark:bg-slate-900/90 shadow-md"
            >
              <div>
                <div style={{ position: "relative" }} className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase">
                    {article.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[11px] text-[#B45309] dark:text-[#F5C518] font-bold">{article.date}</span>
                  <h3 className="text-slate-950 dark:text-white font-bold text-sm line-clamp-2 group-hover:text-[#B45309] dark:group-hover:text-[#F5C518] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 text-xs text-[#B45309] dark:text-[#F5C518] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>



      {/* --- KATEGORI & POSISI MAGANG (TRACKS) --- */}
      <section id="posisi-magang" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-12 sm:mt-16">
        <Reveal className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest">LOWONGAN TERSEDIA</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">Pilihan Lowongan Magang</h2>
          </div>
          <Link
            href={siteContent.cta?.buttonLink || "/user/login"}
            className="text-xs text-[#B45309] dark:text-[#F5C518] font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Daftar & Pilih Posisi Magang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        {/* Tracks Grid / Tabs */}
        {tracks.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl border border-slate-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Belum ada posisi magang yang tersedia saat ini.</h3>
            <p className="text-sm text-slate-500 mt-2">Silakan pantau terus informasi pendaftaran terbaru kami.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Buttons Navigation */}
            <div className="lg:col-span-4 space-y-2.5">
              {tracks.map((t) => {
                const Icon = t.icon;
                const isActive = activeTrack === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTrack(t.id)}
                    className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between border ${
                      isActive
                        ? "bg-amber-400 text-slate-950 font-black border-amber-500 shadow-md"
                        : "glass-panel text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-amber-400"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-slate-950" : "text-[#B45309] dark:text-[#F5C518]"}`} />
                      <div className="truncate">
                        <span className="text-xs block leading-snug">{t.title}</span>
                        <span className={`text-[10px] font-medium block truncate ${isActive ? "text-slate-900" : "text-slate-500 dark:text-slate-400"}`}>
                          {t.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Active Track Detail Card */}
            <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-amber-300 dark:border-amber-400/30 bg-white/90 dark:bg-slate-900/90 shadow-xl flex flex-col justify-between space-y-6">
              {(() => {
                const current = tracks.find((t) => t.id === activeTrack) || tracks[0];
                const Icon = current.icon;
                return (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs text-[#B45309] dark:text-[#F5C518] font-extrabold uppercase tracking-wider block">
                            {current.category}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                            {current.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                        {current.desc}
                      </p>

                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider block">
                          Fokus Kompetensi & Skill Yang Dipelajari:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {current.skills.map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-amber-100 dark:bg-amber-400/15 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full"
                            >
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Terbuka untuk mahasiswa jurusan terkait & umum yang memenuhi kriteria.
                      </span>
                      <Link
                        href={siteContent.cta?.buttonLink || "/user/login"}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <span>Pilih Divisi Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </section>

      {/* --- ALUR PENDAFTARAN & SELEKSI (SELECTION FLOWCHART) --- */}
      <section id="alur-seleksi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-12 sm:mt-16">
        <Reveal className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>ALUR PENDAFTARAN MUDAH & TRANSPARAN</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
            Tahapan Seleksi Golkar Internship Student
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
            Ikuti 4 langkah sederhana berikut untuk mendaftar dan menjadi bagian dari peserta magang resmi.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {(siteContent.tahapanItems && siteContent.tahapanItems.length > 0 ? siteContent.tahapanItems : steps).map((st: any, idx: number) => {
            const Icon = (LucideIcons as any)[st.iconName || "FileText"] || LucideIcons.FileText;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={idx}
                whileHover={{ y: -6 }}
                className="glass-panel p-6 rounded-3xl border border-amber-300/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-lg relative flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-[#B45309] dark:text-[#F5C518]">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-400/10 text-[#B45309] dark:text-[#F5C518] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">{st.title}</h3>
                    <p className="text-xs text-[#B45309] dark:text-[#F5C518] font-bold">{st.subtitle}</p>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* --- PERSYARATAN UMUM & DOKUMEN --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-300 dark:border-amber-400/30 bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-6"
        >
          <Reveal className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest block">CHECKLIST KUALIFIKASI</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">Syarat & Berkas Administrasi</h2>
            </div>
            <span className="bg-amber-100 dark:bg-amber-400/15 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full shrink-0">
              Dokumen Resmi Peserta
            </span>
          </Reveal>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(siteContent.syaratItems && siteContent.syaratItems.length > 0 ? siteContent.syaratItems : requirements).map((req: string, i: number) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/80 dark:border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#B45309] dark:text-[#F5C518] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                  {req}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* --- TESTIMONIAL ALUMNI --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-12 sm:mt-16">
        <Reveal className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest">PENGALAMAN PESERTA MAGANG</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
            Kata Alumni Golkar Internship Student
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
            Kisah dan kesan langsung dari para alumni mahasiswa yang telah menyelesaikan program magang.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {(siteContent.alumniItems && siteContent.alumniItems.length > 0 ? siteContent.alumniItems : testimonials).map((t: any, idx: number) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              custom={idx}
              whileHover={{ y: -6 }}
              className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 bg-white/80 dark:bg-slate-900/80 shadow-md flex flex-col justify-between"
            >
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm italic leading-relaxed font-medium">
                &quot;{t.quote}&quot;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0 border border-amber-400">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-950 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-[#B45309] dark:text-[#F5C518] font-bold">{t.univ} • {t.major}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- FAQ ACCORDION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-12 sm:mt-16">
        <Reveal className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>{siteContent.faq?.subtitle || "INFORMASI PERTANYAAN"}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
            {siteContent.faq?.title || "Pertanyaan Yang Sering Diajukan (FAQ)"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
            Temukan jawaban cepat mengenai persyaratan, durasi, dan sistem pelaksanaan magang GIS.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mx-auto space-y-3"
        >
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={idx}
                className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all bg-white/80 dark:bg-slate-900/80"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-950 dark:text-white text-sm sm:text-base flex items-center justify-between gap-4"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-amber-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 font-medium"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* --- LOKASI, MEDIA SOSIAL & CONTACT BANNER --- */}
      <section id="lokasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mt-12 sm:mt-16">
        <Reveal className="text-center space-y-3">
          <span className="text-xs font-black text-[#B45309] dark:text-[#F5C518] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>KANTOR SEKRETARIAT & KANAL INFORMASI</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
            Lokasi & Media Sosial Resmi <span className="text-[#B45309] dark:text-[#F5C518]">GOLKAR INTERNSHIP STUDENT</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium">
            {maps.description}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* MAP DISPLAY (KIRI) */}
          <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="lg:col-span-7 glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl min-h-[350px] lg:min-h-[440px] relative flex flex-col justify-between">
            <div className="absolute top-4 left-4 z-10">
              <a
                href={maps.openUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-slate-900 text-[13px] font-bold px-3 py-2 rounded shadow-sm border border-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <span>Buka di Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              </a>
            </div>

            <iframe
              title="Lokasi GOLKAR INTERNSHIP STUDENT"
              src={maps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[350px] filter contrast-[1.05] grayscale-[0.2] dark:contrast-125 dark:invert-[0.9] dark:hue-rotate-180"
            />
          </motion.div>

          {/* INFORMASI KONTAK & MEDIA SOSIAL (KANAN) */}
          <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* CARD LOKASI & JAM AKTIF */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 bg-white/80 dark:bg-slate-900/80 shadow-lg">
              <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                <Building2 className="w-5 h-5 text-[#B45309] dark:text-[#F5C518]" />
                <span>{kontak.serviceTitle}</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B45309] dark:text-[#F5C518] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Jam Operasional Sekretariat</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">{kontak.serviceHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B45309] dark:text-[#F5C518] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Email Resmi Portal</span>
                    <a href={`mailto:${kontak.email}`} className="text-[#B45309] dark:text-[#F5C518] font-bold hover:underline text-xs">
                      {kontak.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* AKUN MEDIA SOSIAL RESMI GRID */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 bg-white/80 dark:bg-slate-900/80 shadow-lg">
              <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                <Share2 className="w-5 h-5 text-[#B45309] dark:text-[#F5C518]" />
                <span>{siteContent.medsos?.title || kontak.mediaTitle}</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={siteContent.medsos?.instagram || "https://instagram.com/dpr_ri"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-amber-400 transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-400/10 text-[#B45309] dark:text-[#F5C518] flex items-center justify-center shrink-0 font-bold">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-950 dark:text-white block group-hover:text-[#B45309] transition-colors">Instagram</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{kontak.instagramHandle}</span>
                  </div>
                </a>

                <a
                  href={siteContent.medsos?.youtube || "https://youtube.com/@DPRRIOfficial"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-amber-400 transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-400/10 text-[#B45309] dark:text-[#F5C518] flex items-center justify-center shrink-0 font-bold">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-950 dark:text-white block group-hover:text-[#B45309] transition-colors">YouTube</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{kontak.youtubeLabel}</span>
                  </div>
                </a>

                <a
                  href={siteContent.medsos?.twitter || "https://x.com/DPR_RI"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-amber-400 transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-400/10 text-[#B45309] dark:text-[#F5C518] flex items-center justify-center shrink-0 font-bold">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-950 dark:text-white block group-hover:text-[#B45309] transition-colors">X (Twitter)</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{kontak.twitterHandle}</span>
                  </div>
                </a>

                <a
                  href={siteContent.medsos?.facebook || "https://www.dpr.go.id"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 hover:border-amber-400 transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-400/10 text-[#B45309] dark:text-[#F5C518] flex items-center justify-center shrink-0 font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-950 dark:text-white block group-hover:text-[#B45309] transition-colors">Website Resmi</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{kontak.websiteLabel}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* BANNER REGISTRASI DIBUKA (FINAL CALL TO ACTION) */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 shadow-xl flex items-center justify-between gap-4 border border-amber-300">
              <div className="space-y-1">
                <h4 className="text-base font-black uppercase tracking-wide">{siteContent.cta?.title || "SIAP BERGABUNG DENGAN GIS?"}</h4>
                <p className="text-xs font-extrabold opacity-95">{siteContent.cta?.subtitle || "Daftarkan diri Anda sekarang & raih pengalaman publik terbaik!"}</p>
              </div>
              <Link
                href={siteContent.cta?.buttonLink || "/user/login"}
                className="bg-slate-950 text-amber-300 hover:bg-slate-900 font-black text-xs px-5 py-3 rounded-full shadow-lg shrink-0 flex items-center gap-1.5 transition-transform hover:scale-105 border border-amber-400/40"
              >
                <span>{siteContent.cta?.buttonText || "Daftar Akun"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>

        </div>
      </section>

      {/* Modals */}
      <NewsModal article={selectedNews} onClose={() => setSelectedNews(null)} />
      <AgendaModal agenda={selectedAgenda} onClose={() => setSelectedAgenda(null)} />

    </div>
  );
}





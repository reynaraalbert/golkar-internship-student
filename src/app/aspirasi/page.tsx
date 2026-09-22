"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCmsContent } from "@/components/CmsProvider";
import {
  MessageSquare,
  User,
  ShieldCheck,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  MapPin,
  Clock,
  ExternalLink,
  Building2,
  Shield,
  FileText,
  Lock,
  Scale,
  HeartHandshake,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AspirasiPage() {
  const { mitraKerja } = useCmsContent();
  const [submissionMethod, setSubmissionMethod] = useState<"Terbuka" | "Anonim">("Terbuka");
  const [selectedTopic, setSelectedTopic] = useState<string>("Umum / Reformasi Hukum");
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);

  const topicOptions = [
    { label: "Umum / Reformasi Hukum & HAM", value: "Umum / Reformasi Hukum" },
    ...mitraKerja.map((m) => ({
      label: `${m.acronym} - ${m.name}`,
      value: m.name,
    })),
  ];
  const [aspirationForm, setAspirationForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    subject: "",
    message: "",
  });
  const [aspirationSubmitted, setAspirationSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleAspirationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionMethod === "Terbuka" && !aspirationForm.name) return;
    if (!aspirationForm.message) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/aspirasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: submissionMethod,
          name: submissionMethod === "Terbuka" ? aspirationForm.name : undefined,
          email: submissionMethod === "Terbuka" ? aspirationForm.email : undefined,
          whatsapp: aspirationForm.whatsapp || undefined,
          subject: aspirationForm.subject,
          message: aspirationForm.message,
          category: selectedTopic,
        }),
      });
      if (res.ok) {
        setAspirationSubmitted(true);
        setTimeout(() => {
          setAspirationSubmitted(false);
          setAspirationForm({ name: "", email: "", whatsapp: "", subject: "", message: "" });
        }, 5000);
      } else {
        alert("Gagal mengirim aspirasi. Silakan coba lagi.");
      }
    } catch {
      alert("Gagal mengirim aspirasi. Periksa koneksi internet Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  const faqList = [
    {
      q: "Apa perbedaan pengiriman aspirasi Terbuka dan Anonim?",
      a: "Mode Terbuka menyertakan Nama dan Email Anda untuk mempermudah sekretariat memberikan balasan langsung dan nomor tiket tindak lanjut. Mode Anonim merahasiakan identitas pelapor sepenuhnya demi keamanan informasi pengaduan حساس."
    },
    {
      q: "Siapa saja yang akan menerima aspirasi yang dikirimkan?",
      a: "Aspirasi akan diverifikasi terlebih dahulu oleh Tim Sekretariat Komisi XIII DPR RI, kemudian dikelompokkan sesuai komoditas pengawasan bidang Hukum, HAM, Imigrasi, Pemasyarakatan, atau Antikorupsi."
    },
    {
      q: "Berapa lama estimasi tindak lanjut aduan atau masukan rakyat?",
      a: "Verifikasi administrasi membutuhkan waktu 1-3 hari kerja. Aspirasi prioritas yang relevan akan dimasukkan sebagai bahan materi Rapat Dengar Pendapat (RDP) Komisi XIII bersama mitra kerja terkait."
    },
    {
      q: "Apakah data dan identitas pengirim dijamin kerahasiaannya?",
      a: "Ya. Sesuai dengan UU Perlindungan Data Pribadi dan standar protokol pengaduan DPR RI, seluruh data terlindungi dan aman."
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative bg-hero-gradient-light dark:bg-hero-gradient pt-10 pb-16 border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-dpr-gold/10 border border-emerald-300 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
            <span>Kanal Pelayanan & Pengaduan Publik Resmi</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
          >
            Aspirasi & Pengaduan <span className="text-dpr-emerald dark:text-dpr-gold">Rakyat</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-700 dark:text-slate-300 text-sm sm:text-base max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Sampaikan masukan, aduan penegakan hukum, evaluasi hak asasi manusia, imigrasi, pemasyarakatan, maupun usulan regulasi langsung ke Komisi XIII DPR RI secara terbuka atau anonim.
          </motion.p>
        </div>
      </section>

      {/* DUAL MODE FORM & CONTACT SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORMULARIS ASPIRASI */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6 bg-white/90 dark:bg-slate-900/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Formulir <span className="text-blue-600 dark:text-blue-400">Pengiriman Aspirasi</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Pilih metode pengiriman yang Anda nyamankan.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-dpr-emerald-dark dark:text-dpr-gold font-bold bg-emerald-50 dark:bg-dpr-navy px-3 py-1.5 rounded-full border border-emerald-200 dark:border-white/10 shrink-0">
                <Lock className="w-3.5 h-3.5" />
                <span>Protokol Enkripsi Aman</span>
              </div>
            </div>

            {/* TOGGLE METODE PENGIRIMAN */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                PILIH METODE PENGIRIMAN
              </label>
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-white/10 gap-1">
                <button
                  type="button"
                  onClick={() => setSubmissionMethod("Terbuka")}
                  className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl transition-all ${
                    submissionMethod === "Terbuka"
                      ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <User className="w-4 h-4 shrink-0 text-dpr-emerald dark:text-dpr-gold" />
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                    <span className="text-xs sm:text-sm font-bold">Terbuka</span>
                    <span className="text-[9px] sm:text-[10px] font-medium opacity-80">(Nama & Email)</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionMethod("Anonim")}
                  className={`flex items-center justify-center gap-2 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl transition-all ${
                    submissionMethod === "Anonim"
                      ? "bg-white dark:bg-blue-600 text-blue-700 dark:text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-dpr-emerald dark:text-dpr-gold" />
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                    <span className="text-xs sm:text-sm font-bold">Anonim</span>
                    <span className="text-[9px] sm:text-[10px] font-medium opacity-80">(Kerahasiaan 100%)</span>
                  </div>
                </button>
              </div>
            </div>

            {/* KATEGORI MITRA — Custom Responsive Dropdown */}
            <div className="space-y-2 relative z-20">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                KATEGORI BIDANG / MITRA TERKAIT
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:outline-none font-semibold flex items-center justify-between gap-2 text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-700/60"
                >
                  <span className="truncate pr-2">
                    {topicOptions.find((t) => t.value === selectedTopic)?.label || selectedTopic}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${topicDropdownOpen ? "rotate-180 text-blue-500" : ""}`} />
                </button>

                <AnimatePresence>
                  {topicDropdownOpen && (
                    <>
                      {/* Backdrop overlay to dismiss when clicking outside */}
                      <div className="fixed inset-0 z-30" onClick={() => setTopicDropdownOpen(false)} />

                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto p-1.5 space-y-1"
                      >
                        {topicOptions.map((opt) => {
                          const isSelected = selectedTopic === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setSelectedTopic(opt.value);
                                setTopicDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                                isSelected
                                  ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-dpr-gold"
                                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                              }`}
                            >
                              <span className="truncate pr-2">{opt.label}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-dpr-gold shrink-0" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* FORM BODY */}
            {aspirationSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 p-8 rounded-2xl text-center space-y-3"
              >
                <CheckCircle2 className="w-14 h-14 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aspirasi Anda Telah Terkirim!</h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {submissionMethod === "Anonim"
                    ? "Pesan dan masukan Anda dikirim secara anonim tanpa menyimpan data pribadi. Sekretariat Komisi XIII akan memproses laporan ini."
                    : "Terima kasih atas partisipasi Anda. Bukti tanda terima aspirasi telah diproses dan akan menjadi acuan pengawasan legislatif Komisi XIII DPR RI."}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleAspirationSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {submissionMethod === "Terbuka" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Nama Lengkap *</span>
                        </label>
                        <input
                          type="text"
                          required={submissionMethod === "Terbuka"}
                          placeholder="Masukkan nama lengkap Anda"
                          value={aspirationForm.name}
                          onChange={(e) => setAspirationForm({ ...aspirationForm, name: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>Alamat Email *</span>
                        </label>
                        <input
                          type="email"
                          required={submissionMethod === "Terbuka"}
                          placeholder="email@domain.com"
                          value={aspirationForm.email}
                          onChange={(e) => setAspirationForm({ ...aspirationForm, email: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:outline-none font-medium"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Nomor WhatsApp {submissionMethod === "Anonim" && "(Opsional)"}</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={aspirationForm.whatsapp}
                    onChange={(e) => setAspirationForm({ ...aspirationForm, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Subjek Aspirasi / Pengaduan *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Judul singkat aspirasi Anda"
                    value={aspirationForm.subject}
                    onChange={(e) => setAspirationForm({ ...aspirationForm, subject: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detail Isi Aspirasi / Aduan Rakyat *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tuliskan latar belakang masalah, rekomendasi, usulan RUU, atau keluhan penegakan hukum secara rinci..."
                    value={aspirationForm.message}
                    onChange={(e) => setAspirationForm({ ...aspirationForm, message: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:outline-none font-medium leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 rounded-full shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{submitting ? "Mengirim..." : "Kirimkan Aspirasi Sekarang"}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* KANAN: INFORMASI KANTOR SEKRETARIAT & PROSEDUR */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 bg-white/90 dark:bg-slate-900/90 shadow-lg">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
                <span>Sekretariat Komisi XIII DPR RI</span>
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Lokasi Alamat</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      Gedung Nusantara II, Kompleks Parlemen DPR/MPR RI, Jl. Jend. Gatot Subroto, Jakarta Pusat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Jam Operasional Layanan</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      Senin s/d Kamis: 08.30 – 16.00 WIB
                      <br />Jumat: 08.30 – 16.30 WIB
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Email Resmi Sekretariat</span>
                    <a href="mailto:komisi13@dpr.go.id" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      komisi13@dpr.go.id
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD METODE ALUR TIKET */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 bg-emerald-50/70 dark:bg-slate-800/60 shadow-lg">
              <h4 className="text-sm font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-wider flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" />
                <span>Alur Penanganan Aspirasi</span>
              </h4>
              <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-dpr-emerald text-white flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <span><strong>Registrasi & Verifikasi:</strong> Tim Sekretariat memeriksa relevansi materi pengaduan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-dpr-emerald text-white flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <span><strong>Disposisi Komisi:</strong> Materi diklasifikasikan ke sub-tim kerja mitra kementerian/lembaga.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-dpr-emerald text-white flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <span><strong>Rapat Kerja / RDP:</strong> Pimpinan & Anggota membahas masukan publik pada sesi sidang komisi.</span>
                </li>
              </ol>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>PERTANYAAN UMUM</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Pertanyaan Sering Diajukan (FAQ)</h2>
        </div>

        <div className="space-y-3">
          {faqList.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white/80 dark:bg-slate-900/80"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-dpr-emerald dark:hover:text-dpr-gold transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === idx ? "rotate-180 text-dpr-emerald dark:text-dpr-gold" : "text-slate-400"}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

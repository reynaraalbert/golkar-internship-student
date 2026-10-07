"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ChevronLeft, FileText, CheckCircle2, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CVGeneratorPage() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/user/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-500" /> Auto-Generate CV (ATS)
              </h1>
              <p className="text-slate-500 text-sm mt-1">Sistem akan menyusun data profil, pengalaman, dan portofolio Anda menjadi CV berstandar ATS (Applicant Tracking System).</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || generated}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {generating ? "Menyusun CV..." : generated ? "CV Siap Diunduh" : "Generate CV Sekarang"}
            </button>
          </div>

          {generated ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-400 text-lg">CV Berhasil Dibuat!</h3>
                <p className="text-emerald-700 dark:text-emerald-600 text-sm">Resume ATS-friendly Anda siap untuk dilampirkan dalam pendaftaran.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <button onClick={() => setShowPreview(true)} className="px-6 py-3 bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-200 dark:border-emerald-800 dark:bg-slate-900 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center">
                  <Eye className="w-4 h-4" /> Preview CV
                </button>
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
                  <Download className="w-4 h-4" /> Download CV (PDF)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase tracking-wider">Preview Data yang Akan Dimasukkan:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Informasi Kontak & Biodata Pribadi</p>
                    <p className="text-xs text-slate-500">Nama lengkap, email, nomor HP, universitas, jurusan, IPK.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Pengalaman Organisasi & Profesional</p>
                    <p className="text-xs text-slate-500">Riwayat pekerjaan, kepanitiaan, atau BEM.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">Portofolio & Publikasi</p>
                    <p className="text-xs text-slate-500">Link project, jurnal karya tulis ilmiah, dan sertifikasi.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                <strong>Tips:</strong> Pastikan Anda telah melengkapi seluruh informasi di menu <strong>Profil Saya</strong> sebelum menekan tombol Generate agar hasilnya maksimal.
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b flex justify-between items-center bg-slate-50 text-slate-800">
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> Preview ATS CV
                </h3>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 flex justify-center">
                {/* CV Mockup Paper */}
                <div className="w-[210mm] min-h-[297mm] bg-white shadow-md p-8 sm:p-10 font-serif text-slate-900 space-y-4 mx-auto scale-90 sm:scale-100 origin-top">
                  <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest">NAMA LENGKAP</h1>
                    <p className="text-sm mt-1">Jakarta, Indonesia | +62 812 3456 7890 | email@domain.com</p>
                    <p className="text-sm">linkedin.com/in/username | github.com/username</p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-400 mb-2">Pendidikan</h2>
                    <div className="flex justify-between font-bold text-sm sm:text-base">
                      <span>Universitas Indonesia</span>
                      <span>2020 - 2024</span>
                    </div>
                    <div className="flex justify-between italic text-sm sm:text-base">
                      <span>S1 Ilmu Politik</span>
                      <span>IPK: 3.85 / 4.00</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-400 mt-4 mb-2">Pengalaman Organisasi & Profesional</h2>
                    <div className="mb-3 text-sm sm:text-base">
                      <div className="flex justify-between font-bold">
                        <span>Badan Eksekutif Mahasiswa</span>
                        <span>Jan 2022 - Des 2023</span>
                      </div>
                      <div className="italic mb-1">Ketua Departemen Kajian Strategis</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Memimpin 15 anggota departemen dalam merumuskan kajian kebijakan publik.</li>
                        <li>Mengadakan diskusi panel yang dihadiri oleh 500+ mahasiswa.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-400 mt-4 mb-2">Portofolio & Publikasi</h2>
                    <ul className="list-disc list-inside text-sm sm:text-base space-y-1">
                      <li><strong>Paper Kajian RUU KUHP:</strong> Dipublikasikan di Jurnal Hukum Nasional (2023).</li>
                      <li><strong>Project Data Analisis Pemilu:</strong> Tersedia di github.com/username/pemilu-data.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-400 mt-4 mb-2">Keterampilan</h2>
                    <ul className="list-disc list-inside text-sm sm:text-base">
                      <li>Analisis Kebijakan, Public Speaking, Penulisan Akademik</li>
                      <li>Microsoft Office, SPSS, Stata</li>
                    </ul>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

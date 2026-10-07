"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle2 } from "lucide-react";
import { Reveal, StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

export default function UserDokumenPage() {
  const documents = [
    { id: "ktm", title: "Kartu Tanda Mahasiswa (KTM)", status: "Belum Diunggah", type: "Wajib" },
    { id: "rekomendasi", title: "Surat Rekomendasi Fakultas", status: "Belum Diunggah", type: "Wajib" },
    { id: "sko", title: "Surat Keterangan Organisasi (SKO)", status: "Belum Diunggah", type: "Wajib" },
    { id: "ipk", title: "Bukti Transkrip IPK", status: "Belum Diunggah", type: "Wajib" },
    { id: "cv", title: "Curriculum Vitae (CV)", status: "Belum Diunggah", type: "Wajib" },
    { id: "portofolio", title: "Portofolio Karya / Sertifikat", status: "Belum Diunggah", type: "Opsional" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 px-4 py-2.5 rounded-full shadow-xs hover:bg-amber-500 transition-all self-start"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
          </div>

          <Reveal className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-7 h-7 text-amber-500" /> Unggah Dokumen Persyaratan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Lengkapi berkas pendaftaran Anda. Format yang diterima: PDF, maksimal 2MB per file.
            </p>
          </Reveal>

          {/* List Dokumen */}
          <StaggerList className="grid grid-cols-1 gap-4">
            {documents.map((doc, idx) => (
              <FadeCard
                key={doc.id}
                index={idx}
                hover={false}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {doc.title}
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        doc.type === "Wajib" ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {doc.type}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{doc.status}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-2 justify-center">
                  <Upload className="w-3.5 h-3.5" /> Pilih File
                </button>
              </FadeCard>
            ))}
          </StaggerList>
        </div>
      </div>
    </div>
  );
}

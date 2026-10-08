"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle2, Eye } from "lucide-react";
import { Reveal, StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";
import FileUpload from "@/components/ui/FileUpload";

export default function UserDokumenPage() {
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const docList = [
    { id: "ktm", title: "Kartu Tanda Mahasiswa (KTM)", type: "Wajib" },
    { id: "rekomendasi", title: "Surat Rekomendasi Fakultas", type: "Wajib" },
    { id: "sko", title: "Surat Keterangan Organisasi (SKO)", type: "Wajib" },
    { id: "ipk", title: "Bukti Transkrip IPK", type: "Wajib" },
    { id: "cv", title: "Curriculum Vitae (CV)", type: "Wajib" },
    { id: "portofolio", title: "Portofolio Karya / Sertifikat", type: "Opsional" },
  ];

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/user/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setDocuments(data.user.documents || {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const handleChange = async (docId: string, url: string) => {
    const newDocs = { ...documents, [docId]: url };
    setDocuments(newDocs);

    try {
      await fetch("/api/user/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: newDocs })
      });
    } catch (err) {
      console.error("Gagal auto-save:", err);
    }
  };

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
              Lengkapi berkas pendaftaran Anda. Format PDF/Foto/DOCX/XLSX, maksimal 1MB per file. Akan tersimpan otomatis.
            </p>
          </Reveal>

          {/* List Dokumen */}
          <StaggerList className="grid grid-cols-1 gap-4">
            {docList.map((doc, idx) => {
              const fileUrl = documents[doc.id] || "";
              return (
                <FadeCard
                  key={doc.id}
                  index={idx}
                  hover={false}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {fileUrl ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <FileText className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {doc.title}
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          doc.type === "Wajib" ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {doc.type}
                        </span>
                      </h3>
                      {fileUrl ? (
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">Tersimpan</span>
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Lihat / Preview
                          </a>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 mt-1">Belum Diunggah</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-64 shrink-0">
                    <FileUpload
                      accept="all"
                      maxSizeBytes={1 * 1024 * 1024}
                      value={fileUrl}
                      onChange={(url) => handleChange(doc.id, url)}
                    />
                  </div>
                </FadeCard>
              );
            })}
          </StaggerList>
        </div>
      </div>
    </div>
  );
}

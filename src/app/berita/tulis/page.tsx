"use client";

import React, { useEffect, useState } from "react";
import {
  Upload, FileText, Link as LinkIcon, CheckCircle2, ChevronDown,
  User, Plus, Trash2, Tag, AlignLeft, Hash, Loader2, ShieldCheck, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "@/components/ui/FileUpload";

type KategoriBerita = "Kegiatan Magang" | "Opini Mahasiswa" | "Pengumuman" | "Siaran Pers" | "Kisah Alumni" | "Lainnya";

interface Sumber { judul: string; url: string; }

interface SessionUser {
  id: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
}

export default function TulisBeritaPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [batch, setBatch] = useState("");
  const [batches, setBatches] = useState<string[]>([]);
  const [instansi, setInstansi] = useState("");

  const [judulBerita, setJudulBerita] = useState("");
  const [kategori, setKategori] = useState<KategoriBerita>("Kegiatan Magang");
  const [tanggal, setTanggal] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [isiBerita, setIsiBerita] = useState("");
  const [tags, setTags] = useState("");
  const [sumber, setSumber] = useState<Sumber[]>([{ judul: "", url: "" }]);
  const [imageUrl, setImageUrl] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [hasLampiran, setHasLampiran] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch("/api/user/auth/me", { cache: "no-store" });
        if (!res.ok) {
          router.replace("/user/login?next=/berita/tulis");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        if (data?.authenticated && data.user) {
          setSessionUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            university: data.user.university,
            major: data.user.major,
          });
          setInstansi(
            [data.user.university, data.user.major].filter(Boolean).join(" - ")
          );
        } else {
          router.replace("/user/login?next=/berita/tulis");
        }
      } catch {
        if (!cancelled) router.replace("/user/login?next=/berita/tulis");
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    }

    async function loadBatches() {
      try {
        const res = await fetch("/api/timeline", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const list: string[] = Array.isArray(data?.allBatches) ? data.allBatches : [];
        setBatches(list);
        if (list.length > 0) setBatch(list[list.length - 1]);
      } catch {
        // Batch list is optional; server validates the rest.
      }
    }

    loadSession();
    loadBatches();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const addSumber = () => setSumber(prev => [...prev, { judul: "", url: "" }]);
  const removeSumber = (i: number) => setSumber(prev => prev.filter((_, idx) => idx !== i));
  const updateSumber = (i: number, field: keyof Sumber, value: string) => {
    setSumber(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const validateStep1 = (): string[] => {
    const errors: string[] = [];
    if (!sessionUser) errors.push("Sesi Anda tidak valid. Silakan masuk kembali.");
    if (!batch.trim()) errors.push("Batch magang wajib dipilih.");
    if (!instansi.trim()) errors.push("Universitas / Jurusan wajib diisi.");
    return errors;
  };

  const validateStep2 = (): string[] => {
    const errors: string[] = [];
    if (!judulBerita.trim()) errors.push("Judul / Headline Berita wajib diisi.");
    if (!tanggal.trim()) errors.push("Tanggal Kejadian / Penulisan wajib diisi.");
    if (!ringkasan.trim()) errors.push("Ringkasan / Lead Berita wajib diisi.");
    if (!isiBerita.trim()) errors.push("Isi Berita Lengkap wajib diisi.");
    return errors;
  };

  const goToStep = (target: 1 | 2 | 3) => {
    if (target >= step) return;
    setStepErrors([]);
    setStep(target);
  };

  const handleNextStep1 = () => {
    const errors = validateStep1();
    if (errors.length > 0) { setStepErrors(errors); return; }
    setStepErrors([]);
    setStep(2);
  };

  const handleNextStep2 = () => {
    const errors = validateStep2();
    if (errors.length > 0) { setStepErrors(errors); return; }
    setStepErrors([]);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) {
      router.replace("/user/login?next=/berita/tulis");
      return;
    }
    if (!privacyAccepted) {
      setStepErrors(["Anda harus menyetujui pernyataan privasi & orisinalitas."]);
      return;
    }
    setStepErrors([]);
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artikel: {
            judul: judulBerita,
            kategori,
            tanggal,
            ringkasan,
            isiBerita,
            tags,
            sumber: sumber.filter(s => s.judul || s.url),
          },
          attachments: {
            imageUrl: imageUrl || undefined,
            documentUrl: hasLampiran ? documentUrl || undefined : undefined,
          },
          meta: { batch, instansi },
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => { window.location.href = "/berita"; }, 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setStepErrors([data?.error || "Gagal mengirim berita. Silakan coba lagi."]);
      }
    } catch {
      setStepErrors(["Gagal mengirim berita. Periksa koneksi internet Anda."]);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-slate-50 dark:bg-dpr-navy-card text-sm text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none transition-colors";
  const labelClass = "block text-sm font-bold text-slate-900 dark:text-white mb-1.5";

  if (sessionLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Memeriksa sesi...</span>
        </div>
      </div>
    );
  }

  if (!sessionUser) return null;

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-100 dark:bg-dpr-gold/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-dpr-emerald dark:text-dpr-gold" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Berita Berhasil Dikirim!</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Terima kasih, <strong>{sessionUser.name}</strong>. Artikel Anda sedang dalam proses tinjauan (status: menunggu moderasi) oleh tim redaksi Golkar Internship Student sebelum dipublikasikan.</p>
          <p className="text-slate-500 dark:text-slate-500 text-xs">Anda akan diarahkan kembali ke halaman Berita dalam beberapa detik...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <FileText className="w-4 h-4" />
          <span>PORTAL BERITA — TULIS ARTIKEL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Tulis <span className="text-dpr-emerald dark:text-dpr-gold">Berita</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Bagikan informasi, opini, atau laporan terkini seputar kegiatan Golkar Internship Student Fraksi Partai Golkar.</p>
      </div>

      <div className="flex items-center gap-0 max-w-md mx-auto">
        {[{ n: 1, label: "Biodata" }, { n: 2, label: "Konten" }, { n: 3, label: "Lampiran" }].map((s, i) => (
          <React.Fragment key={s.n}>
            <button
              type="button"
              onClick={() => goToStep(s.n as 1|2|3)}
              disabled={s.n > step}
              title={s.n > step ? "Selesaikan step sebelumnya terlebih dahulu" : undefined}
              className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                step >= s.n ? "text-dpr-emerald dark:text-dpr-gold" : "text-slate-400"
              } ${s.n > step ? "cursor-not-allowed opacity-60" : s.n < step ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step >= s.n ? "bg-dpr-emerald dark:bg-dpr-gold text-white dark:text-dpr-navy border-dpr-emerald dark:border-dpr-gold" : "border-slate-300 dark:border-slate-600 text-slate-400"}`}>{s.n}</span>
              <span className="text-xs font-semibold">{s.label}</span>
            </button>
            {i < 2 && <div className={`h-px flex-1 mb-5 transition-all ${step > s.n ? "bg-dpr-emerald dark:bg-dpr-gold" : "bg-slate-200 dark:bg-slate-700"}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                  <User className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
                  Data Diri Penulis
                </h2>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Jenis Penulis</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Peserta Golkar Internship Student</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Jenis penulis ditetapkan otomatis dari akun Anda dan tidak dapat diubah dari formulir.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Lengkap</label>
                    <input type="text" readOnly value={sessionUser.name} className={inputClass + " opacity-80 cursor-not-allowed"} />
                  </div>
                  <div>
                    <label className={labelClass}>Alamat Email</label>
                    <input type="email" readOnly value={sessionUser.email} className={inputClass + " opacity-80 cursor-not-allowed"} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Batch Magang <span className="text-red-500">*</span></label>
                    <select value={batch} onChange={e => setBatch(e.target.value)} className={inputClass}>
                      <option value="">-- Pilih Batch --</option>
                      {batches.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Universitas / Jurusan <span className="text-red-500">*</span></label>
                    <input type="text" value={instansi} onChange={e => setInstansi(e.target.value)} placeholder="Contoh: Universitas Indonesia - Ilmu Hukum" className={inputClass} />
                  </div>
                </div>

                {stepErrors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/40 rounded-xl p-4 space-y-1">
                    {stepErrors.map((err, i) => (
                      <p key={i} className="text-xs text-red-600 dark:text-red-400 font-medium">• {err}</p>
                    ))}
                  </div>
                )}
                <div className="flex justify-end pt-2">
                  <button type="button" onClick={handleNextStep1} className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold px-6 py-2.5 rounded-xl text-sm shadow-md hover:opacity-90 transition-all">
                    Lanjut ke Konten Berita <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                  <AlignLeft className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
                  Konten Berita
                </h2>

                <FileUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  accept="image"
                  label="Foto / Gambar Utama"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Judul / Headline Berita <span className="text-red-500">*</span></label>
                    <input type="text" required maxLength={200} value={judulBerita} onChange={e => setJudulBerita(e.target.value)} placeholder="Tuliskan judul yang informatif dan menarik..." className={inputClass} />
                    <p className="text-xs text-slate-400 mt-1">{judulBerita.length}/200 karakter</p>
                  </div>
                  <div>
                    <label className={labelClass}>Kategori <span className="text-red-500">*</span></label>
                    <select value={kategori} onChange={e => setKategori(e.target.value as KategoriBerita)} className={inputClass}>
                      {["Kegiatan Magang", "Opini Mahasiswa", "Pengumuman", "Siaran Pers", "Kisah Alumni", "Lainnya"].map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tanggal Kejadian / Penulisan <span className="text-red-500">*</span></label>
                    <input type="date" required value={tanggal} onChange={e => setTanggal(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}><Hash className="w-4 h-4 inline mr-1" />Tags / Kata Kunci</label>
                    <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Contoh: Magang, Seminar, Kunjungan (pisah dengan koma)" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Ringkasan / Lead Berita <span className="text-red-500">*</span></label>
                  <textarea required rows={3} maxLength={400} value={ringkasan} onChange={e => setRingkasan(e.target.value)} placeholder="Tuliskan 2-3 kalimat ringkasan yang menjelaskan inti berita." className={`${inputClass} resize-y`} />
                  <p className="text-xs text-slate-400 mt-1">{ringkasan.length}/400 karakter</p>
                </div>

                <div>
                  <label className={labelClass}>Isi Berita Lengkap <span className="text-red-500">*</span></label>
                  <textarea required rows={12} maxLength={20000} value={isiBerita} onChange={e => setIsiBerita(e.target.value)} placeholder="Tulis isi berita secara lengkap dan terstruktur di sini..." className={`${inputClass} resize-y`} />
                  <p className="text-xs text-slate-400 mt-1">{isiBerita.length} karakter (minimum 50 karakter). Teks biasa, HTML akan dibersihkan otomatis.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={labelClass + " mb-0"}><LinkIcon className="w-4 h-4 inline mr-1" />Sumber Referensi</label>
                    <button type="button" onClick={addSumber} className="flex items-center gap-1 text-xs font-semibold text-dpr-emerald dark:text-dpr-gold hover:underline">
                      <Plus className="w-3.5 h-3.5" /> Tambah Sumber
                    </button>
                  </div>
                  {sumber.map((s, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input type="text" value={s.judul} onChange={e => updateSumber(i, "judul", e.target.value)} placeholder="Nama/Judul Sumber" className={inputClass + " py-2 text-xs"} />
                        <input type="url" value={s.url} onChange={e => updateSumber(i, "url", e.target.value)} placeholder="https://..." className={inputClass + " py-2 text-xs"} />
                      </div>
                      {sumber.length > 1 && (
                        <button type="button" onClick={() => removeSumber(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {stepErrors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/40 rounded-xl p-4 space-y-1">
                    {stepErrors.map((err, i) => (
                      <p key={i} className="text-xs text-red-600 dark:text-red-400 font-medium">• {err}</p>
                    ))}
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => { setStepErrors([]); setStep(1); }} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-white/10">
                    ← Kembali
                  </button>
                  <button type="button" onClick={handleNextStep2} className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold px-6 py-2.5 rounded-xl text-sm shadow-md hover:opacity-90 transition-all">
                    Lanjut ke Lampiran <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                  <Tag className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
                  Lampiran & Konfirmasi
                </h2>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="hasLampiran" checked={hasLampiran} onChange={e => setHasLampiran(e.target.checked)} className="w-4 h-4 accent-dpr-emerald" />
                    <label htmlFor="hasLampiran" className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer">
                      Tambahkan Lampiran Dokumen Pendukung (opsional)
                    </label>
                  </div>
                  {hasLampiran && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <FileUpload
                        value={documentUrl}
                        onChange={setDocumentUrl}
                        accept="document"
                        label="Unggah dokumen PDF, DOCX, atau XLSX"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-dpr-navy-card p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3 text-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white">Ringkasan Pengiriman</h3>
                  <div className="space-y-2 text-slate-600 dark:text-slate-400">
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Penulis:</span> <span>{sessionUser.name || "—"}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Jenis Penulis:</span> <span>Peserta GIS</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Email:</span> <span>{sessionUser.email || "—"}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Judul:</span> <span className="line-clamp-1">{judulBerita || "—"}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Kategori:</span> <span>{kategori}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Foto:</span> <span>{imageUrl ? "✓ Terupload" : "—"}</span></div>
                    {hasLampiran && <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Dokumen:</span> <span>{documentUrl ? "✓ Terupload" : "—"}</span></div>}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-700/30">
                  <input
                    type="checkbox"
                    required
                    id="deklarasi"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 mt-0.5 shrink-0"
                  />
                  <label htmlFor="deklarasi" className="text-xs text-amber-800 dark:text-amber-300 cursor-pointer leading-relaxed">
                    Saya menyatakan artikel ini karya orisinal, tidak mengandung SARA/hoaks/pelanggaran hak cipta, dan saya menyetujui pemrosesan nama serta email saya sesuai{" "}
                    <Link href="/kebijakan-privasi" className="underline font-bold">Kebijakan Privasi</Link>{" "}
                    untuk keperluan moderasi dan publikasi. Artikel akan berstatus menunggu moderasi.
                  </label>
                </div>

                {stepErrors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/40 rounded-xl p-4 space-y-1">
                    {stepErrors.map((err, i) => (
                      <p key={i} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {err}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => { setStepErrors([]); setStep(2); }} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-white/10">
                    ← Kembali
                  </button>
                  <button type="submit" disabled={submitting || !privacyAccepted} className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient hover:opacity-90 text-white dark:text-dpr-navy font-bold text-sm px-8 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {submitting ? "Mengirim..." : "Kirim Berita Sekarang"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" />
        Artikel yang masuk akan ditinjau oleh tim redaksi sebelum dipublikasikan.{" "}
        <Link href="/berita" className="underline hover:text-dpr-emerald dark:hover:text-dpr-gold">Kembali ke Daftar Berita</Link>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Upload, FileText, Link as LinkIcon, Camera, CheckCircle2, ChevronDown,
  User, BadgeCheck, Building2, Plus, Trash2, Tag, AlignLeft, Hash, Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "@/components/ui/FileUpload";

type TipePenulis = "umum" | "anggota_dpr" | "pegawai_dpr";
type KategoriBerita = "Legislasi" | "Pengawasan" | "Anggaran" | "Siaran Pers" | "Kunjungan Kerja" | "Opini" | "Lainnya";

interface Sumber { judul: string; url: string; }

export default function TulisBeritaPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  const [tipePenulis, setTipePenulis] = useState<TipePenulis>("umum");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [nomorAnggota, setNomorAnggota] = useState("");
  const [fraksi, setFraksi] = useState("");
  const [dapil, setDapil] = useState("");
  const [masaJabatan, setMasaJabatan] = useState("");
  const [nip, setNip] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [instansi, setInstansi] = useState("");

  const [judulBerita, setJudulBerita] = useState("");
  const [kategori, setKategori] = useState<KategoriBerita>("Legislasi");
  const [tanggal, setTanggal] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [isiBerita, setIsiBerita] = useState("");
  const [tags, setTags] = useState("");
  const [sumber, setSumber] = useState<Sumber[]>([{ judul: "", url: "" }]);
  const [imageUrl, setImageUrl] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [hasLampiran, setHasLampiran] = useState(false);

  const addSumber = () => setSumber(prev => [...prev, { judul: "", url: "" }]);
  const removeSumber = (i: number) => setSumber(prev => prev.filter((_, idx) => idx !== i));
  const updateSumber = (i: number, field: keyof Sumber, value: string) => {
    setSumber(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const validateStep1 = (): string[] => {
    const errors: string[] = [];
    if (!namaLengkap.trim()) errors.push("Nama Lengkap wajib diisi.");
    if (!email.trim()) errors.push("Alamat Email wajib diisi.");
    if (tipePenulis === "anggota_dpr") {
      if (!nomorAnggota.trim()) errors.push("Nomor Anggota DPR RI wajib diisi.");
      if (!fraksi.trim()) errors.push("Fraksi wajib dipilih.");
      if (!dapil.trim()) errors.push("Daerah Pemilihan (Dapil) wajib diisi.");
      if (!masaJabatan.trim()) errors.push("Masa Jabatan wajib diisi.");
    }
    if (tipePenulis === "pegawai_dpr") {
      if (!nip.trim()) errors.push("NIP wajib diisi.");
      if (!unitKerja.trim()) errors.push("Unit Kerja wajib diisi.");
      if (!jabatan.trim()) errors.push("Jabatan / Pangkat wajib diisi.");
    }
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
    // Hanya boleh kembali ke step sebelumnya, tidak boleh loncat maju
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
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biodata: {
            tipePenulis,
            nama: namaLengkap,
            email,
            nomorAnggota,
            fraksi,
            dapil,
            masaJabatan,
            nip,
            unitKerja,
            jabatan,
            pekerjaan,
            instansi,
          },
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
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => { window.location.href = "/berita"; }, 3000);
      } else {
        alert("Gagal mengirim berita. Silakan coba lagi.");
      }
    } catch {
      alert("Gagal mengirim berita. Periksa koneksi internet Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-slate-50 dark:bg-dpr-navy-card text-sm text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none transition-colors";
  const labelClass = "block text-sm font-bold text-slate-900 dark:text-white mb-1.5";

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-100 dark:bg-dpr-gold/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-dpr-emerald dark:text-dpr-gold" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Berita Berhasil Dikirim!</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Terima kasih, <strong>{namaLengkap}</strong>. Artikel Anda sedang dalam proses tinjauan oleh tim redaksi Komisi XIII DPR RI sebelum dipublikasikan.</p>
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
        <p className="text-slate-600 dark:text-slate-400 text-sm">Bagikan informasi, opini, atau laporan terkini seputar kegiatan Komisi XIII DPR RI Fraksi Partai Golkar.</p>
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

                <div className="space-y-2">
                  <label className={labelClass}>Jenis Penulis <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { value: "umum", label: "Umum / Masyarakat", icon: User },
                      { value: "anggota_dpr", label: "Anggota DPR RI", icon: BadgeCheck },
                      { value: "pegawai_dpr", label: "Pegawai DPR RI", icon: Building2 },
                    ] as const).map(opt => {
                      const Icon = opt.icon;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setTipePenulis(opt.value)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${tipePenulis === opt.value ? "border-dpr-emerald dark:border-dpr-gold bg-dpr-emerald/5 dark:bg-dpr-gold/5" : "border-slate-200 dark:border-white/10 hover:border-dpr-emerald/40 dark:hover:border-dpr-gold/40"}`}
                        >
                          <Icon className={`w-5 h-5 ${tipePenulis === opt.value ? "text-dpr-emerald dark:text-dpr-gold" : "text-slate-400"}`} />
                          <span className={`text-sm font-semibold ${tipePenulis === opt.value ? "text-dpr-emerald-dark dark:text-dpr-gold" : "text-slate-700 dark:text-slate-300"}`}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
                    <input type="text" required value={namaLengkap} onChange={e => setNamaLengkap(e.target.value)} placeholder="Contoh: Dr. H. Budi Santoso, S.H., M.Hum." className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Alamat Email <span className="text-red-500">*</span></label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@domain.com" className={inputClass} />
                  </div>
                </div>

                {tipePenulis === "anggota_dpr" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 p-5 bg-dpr-emerald/5 dark:bg-dpr-gold/5 rounded-2xl border border-dpr-emerald/20 dark:border-dpr-gold/20">
                    <h3 className="text-sm font-bold text-dpr-emerald-dark dark:text-dpr-gold flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4" /> Data Keanggotaan DPR RI
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Nomor Anggota DPR RI <span className="text-red-500">*</span></label>
                        <input type="text" value={nomorAnggota} onChange={e => setNomorAnggota(e.target.value)} placeholder="Contoh: A-123" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Fraksi <span className="text-red-500">*</span></label>
                        <select value={fraksi} onChange={e => setFraksi(e.target.value)} className={inputClass}>
                          <option value="">-- Pilih Fraksi --</option>
                          {["Partai Golkar", "PDI Perjuangan", "Partai Gerindra", "Partai NasDem", "PKB", "PKS", "PAN", "Partai Demokrat", "PPP"].map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Daerah Pemilihan (Dapil) <span className="text-red-500">*</span></label>
                        <input type="text" value={dapil} onChange={e => setDapil(e.target.value)} placeholder="Contoh: Jawa Barat IV" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Masa Jabatan <span className="text-red-500">*</span></label>
                        <input type="text" value={masaJabatan} onChange={e => setMasaJabatan(e.target.value)} placeholder="Contoh: 2024 – 2029" className={inputClass} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {tipePenulis === "pegawai_dpr" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 p-5 bg-slate-100 dark:bg-dpr-navy-card rounded-2xl border border-slate-200 dark:border-white/10">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" /> Data Kepegawaian DPR RI
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>NIP <span className="text-red-500">*</span></label>
                        <input type="text" value={nip} onChange={e => setNip(e.target.value)} placeholder="18 digit NIP" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Unit Kerja <span className="text-red-500">*</span></label>
                        <input type="text" value={unitKerja} onChange={e => setUnitKerja(e.target.value)} placeholder="Contoh: Sekretariat Komisi XIII" className={inputClass} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Jabatan / Pangkat <span className="text-red-500">*</span></label>
                        <input type="text" value={jabatan} onChange={e => setJabatan(e.target.value)} placeholder="Contoh: Analis Legislatif Ahli Muda / IV-a" className={inputClass} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {tipePenulis === "umum" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Pekerjaan</label>
                      <input type="text" value={pekerjaan} onChange={e => setPekerjaan(e.target.value)} placeholder="Contoh: Jurnalis / Akademisi" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Instansi / Lembaga</label>
                      <input type="text" value={instansi} onChange={e => setInstansi(e.target.value)} placeholder="Contoh: Universitas Indonesia" className={inputClass} />
                    </div>
                  </motion.div>
                )}

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
                    <input type="text" required value={judulBerita} onChange={e => setJudulBerita(e.target.value)} placeholder="Tuliskan judul yang informatif dan menarik..." className={inputClass} />
                    <p className="text-xs text-slate-400 mt-1">{judulBerita.length}/150 karakter</p>
                  </div>
                  <div>
                    <label className={labelClass}>Kategori <span className="text-red-500">*</span></label>
                    <select value={kategori} onChange={e => setKategori(e.target.value as KategoriBerita)} className={inputClass}>
                      {["Legislasi", "Pengawasan", "Anggaran", "Siaran Pers", "Kunjungan Kerja", "Opini", "Lainnya"].map(k => <option key={k} value={k}>{k}</option>)}
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
                    <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Contoh: HAM, Lapas, KPK (pisah dengan koma)" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Ringkasan / Lead Berita <span className="text-red-500">*</span></label>
                  <textarea required rows={3} value={ringkasan} onChange={e => setRingkasan(e.target.value)} placeholder="Tuliskan 2–3 kalimat ringkasan yang menjelaskan inti berita." className={`${inputClass} resize-y`} />
                  <p className="text-xs text-slate-400 mt-1">{ringkasan.length}/300 karakter</p>
                </div>

                <div>
                  <label className={labelClass}>Isi Berita Lengkap <span className="text-red-500">*</span></label>
                  <textarea required rows={12} value={isiBerita} onChange={e => setIsiBerita(e.target.value)} placeholder="Tulis isi berita secara lengkap dan terstruktur di sini..." className={`${inputClass} resize-y`} />
                  <p className="text-xs text-slate-400 mt-1">{isiBerita.length} karakter (minimum 500 karakter disarankan)</p>
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
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Penulis:</span> <span>{namaLengkap || "—"}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Jenis Penulis:</span> <span className="capitalize">{tipePenulis.replace("_", " ")}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Email:</span> <span>{email || "—"}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Judul:</span> <span className="line-clamp-1">{judulBerita || "—"}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Kategori:</span> <span>{kategori}</span></div>
                    <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Foto:</span> <span>{imageUrl ? "✓ Terupload" : "—"}</span></div>
                    {hasLampiran && <div className="flex gap-2"><span className="font-semibold text-slate-700 dark:text-slate-300 w-28 shrink-0">Dokumen:</span> <span>{documentUrl ? "✓ Terupload" : "—"}</span></div>}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-700/30">
                  <input type="checkbox" required id="deklarasi" className="w-4 h-4 accent-amber-500 mt-0.5 shrink-0" />
                  <label htmlFor="deklarasi" className="text-xs text-amber-800 dark:text-amber-300 cursor-pointer leading-relaxed">
                    Saya menyatakan bahwa artikel ini adalah karya orisinal, tidak mengandung unsur SARA, hoaks, atau pelanggaran hak cipta. Saya bertanggung jawab penuh atas kebenaran informasi yang disampaikan sesuai UU No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE).
                  </label>
                </div>

                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => { setStepErrors([]); setStep(2); }} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-5 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-white/10">
                    ← Kembali
                  </button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient hover:opacity-90 text-white dark:text-dpr-navy font-bold text-sm px-8 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {submitting ? "Mengirim..." : "Kirim Berita Sekarang"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="text-center text-xs text-slate-400 dark:text-slate-500">
        Artikel yang masuk akan ditinjau oleh tim redaksi sebelum dipublikasikan. •{" "}
        <Link href="/berita" className="underline hover:text-dpr-emerald dark:hover:text-dpr-gold">Kembali ke Daftar Berita</Link>
      </div>
    </div>
  );
}

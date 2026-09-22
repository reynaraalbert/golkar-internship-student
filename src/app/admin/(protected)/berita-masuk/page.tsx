"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Inbox, Check, X, FileText, Image as ImageIcon, Clock, User, Mail,
  ExternalLink, ChevronLeft, Loader2, CheckCircle2, XCircle, Filter,
} from "lucide-react";
import { PageHeader, EmptyState, Field, Input, Select, Textarea, ModalWrapper } from "@/components/admin/ui";
import { motion, AnimatePresence } from "framer-motion";
import type { NewsSubmission } from "@/lib/data";

const STATUS = ["pending", "approved", "declined", "takedown"] as const;
type Status = (typeof STATUS)[number];

export default function AdminBeritaMasukPage() {
  const [submissions, setSubmissions] = useState<NewsSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [selected, setSelected] = useState<NewsSubmission | null>(null);
  const [proofread, setProofread] = useState<{ title: string; summary: string; content: string; category: string } | null>(null);
  const [proofreadNotes, setProofreadNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh so new user submissions appear instantly (polling + tab events)
  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    const interval = setInterval(() => {
      if (!document.hidden && !selected) load();
    }, 5000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [load, selected]);

  const openSubmission = (s: NewsSubmission) => {
    setSelected(s);
    setProofreadNotes(s.proofreadNotes || "");
    setProofread({
      title: s.artikel.judul,
      summary: s.artikel.ringkasan,
      content: s.artikel.isiBerita,
      category: s.artikel.kategori,
    });
  };

  const handleAction = async (action: "approve" | "decline" | "update" | "takedown") => {
    if (!selected) return;
    setBusy(true);

    // Optimistic: reflect the new status in the list immediately so the UI
    // feels instant, even while the database write is still completing.
    const newStatus: Status = action === "approve"
      ? "approved"
      : action === "decline"
        ? "declined"
        : action === "takedown"
          ? "takedown"
          : selected.status;

    const prevSelected = selected;
    setSubmissions((prev) =>
      prev.map((s) => (s.id === selected.id ? { ...s, status: newStatus, proofreadNotes: action === "decline" ? proofreadNotes : s.proofreadNotes } : s))
    );
    setSelected(null);

    try {
      const res = await fetch(`/api/submissions/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          proofreadNotes,
          proofread: action === "approve" || action === "update" ? proofread : undefined,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Roll back the optimistic update and surface the error.
        setBusy(false);
        alert(result.error || `Gagal (${res.status}). Coba lagi.`);
        setSubmissions((prev) =>
          prev.map((s) => (s.id === prevSelected.id ? { ...s, status: prevSelected.status, proofreadNotes: prevSelected.proofreadNotes } : s))
        );
        setSelected(prevSelected);
        return;
      }
    } catch (err) {
      setBusy(false);
      alert("Koneksi gagal: " + (err as Error).message);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === prevSelected.id ? { ...s, status: prevSelected.status, proofreadNotes: prevSelected.proofreadNotes } : s))
      );
      setSelected(prevSelected);
      return;
    }

    // Refresh from DB in the background so counts/status stay accurate, but
    // don't block the UI on it.
    setBusy(false);
    load();
  };

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);
  const counts = {
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    declined: submissions.filter((s) => s.status === "declined").length,
    takedown: submissions.filter((s) => s.status === "takedown").length,
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/50",
      approved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50",
      declined: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/50",
      takedown: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600",
    };
    return map[s] || "";
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Inbox}
        title="Berita Masuk"
        subtitle="Proofread & kelola berita yang dikirim pengguna. Setujui untuk publikasi, tolak, edit, atau tarik berita yang sudah tayang."
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {[{ k: "pending", label: "Menunggu" }, { k: "approved", label: "Disetujui" }, { k: "declined", label: "Ditolak" }, { k: "takedown", label: "Tarik" }, { k: "all", label: "Semua" }].map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k as typeof filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              filter === f.k
                ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy border-dpr-emerald dark:border-transparent"
                : "bg-white dark:bg-dpr-navy-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40"
            }`}
          >
            {f.label} {f.k !== "all" && <span className="opacity-70">({counts[f.k as keyof typeof counts]})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-dpr-emerald dark:text-dpr-gold animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Inbox} title="Tidak Ada Berita Masuk" description={filter === "pending" ? "Belum ada berita yang menunggu persetujuan." : "Tidak ada berita pada filter ini."} />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <motion.button
              key={s.id}
              layout
              onClick={() => openSubmission(s)}
              className="w-full text-left glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-4 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 shrink-0 relative">
                {s.attachments.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.attachments.imageUrl} alt={s.artikel.judul} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-slate-400" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(s.status)} capitalize`}>{s.status}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(s.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{s.artikel.judul}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><User className="w-3 h-3" />{s.biodata.nama} <span className="text-slate-300 dark:text-slate-600">•</span> <span className="capitalize">{s.biodata.tipePenulis.replace("_", " ")}</span></p>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 rotate-180 shrink-0" />
            </motion.button>
          ))}
        </div>
      )}

      {/* Detail / Proofread Modal */}
      <AnimatePresence>
        {selected && proofread && (
          <ModalWrapper>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/30 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-dpr-navy-card border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Proofread Berita</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(selected.status)} capitalize`}>{selected.status}</span>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Author info */}
                <div className="bg-slate-50 dark:bg-dpr-navy p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-700 dark:text-white flex items-center gap-1.5"><User className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" /> Biodata Penulis</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                    <span>Nama: <strong>{selected.biodata.nama}</strong></span>
                    <span>Tipe: <strong className="capitalize">{selected.biodata.tipePenulis.replace("_", " ")}</strong></span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.biodata.email}</span>
                    {selected.biodata.fraksi && <span>Fraksi: {selected.biodata.fraksi}</span>}
                  </div>
                </div>

                {/* Image preview */}
                {selected.attachments.imageUrl && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-2"><ImageIcon className="w-4 h-4" /> Foto Utama</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selected.attachments.imageUrl} alt="Foto" className="w-full max-h-64 object-cover rounded-2xl border border-slate-200 dark:border-white/10" />
                  </div>
                )}

                {/* Editable content */}
                <div className="space-y-4">
                  <Field label="Judul">
                    <Input
                      value={proofread.title}
                      onChange={(e) => setProofread({ ...proofread, title: e.target.value })}
                      className="w-full"
                    />
                  </Field>
                  <Field label="Kategori">
                    <Select
                      value={proofread.category}
                      onChange={(e) => setProofread({ ...proofread, category: e.target.value })}
                      className="w-full"
                    >
                      {["Legislasi", "Pengawasan", "Anggaran", "Siaran Pers", "Kunjungan Kerja"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </Select>
                  </Field>
                  <Field label="Ringkasan (Lead)">
                    <Textarea
                      rows={3}
                      value={proofread.summary}
                      onChange={(e) => setProofread({ ...proofread, summary: e.target.value })}
                    />
                  </Field>
                  <Field label="Isi Berita">
                    <Textarea
                      rows={10}
                      value={proofread.content}
                      onChange={(e) => setProofread({ ...proofread, content: e.target.value })}
                    />
                  </Field>
                  {selected.attachments.documentUrl && (
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-2"><FileText className="w-4 h-4" /> Dokumen Pendukung</span>
                      <a href={selected.attachments.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        <FileText className="w-4 h-4" /> Buka Dokumen <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Proofread notes */}
                  <Field label="Catatan Proofread">
                    <Textarea
                      rows={2}
                      value={proofreadNotes}
                      onChange={(e) => setProofreadNotes(e.target.value)}
                      placeholder="Catatan untuk penulis / alasan penolakan..."
                    />
                  </Field>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-dpr-navy-card border-t border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between gap-3">
                <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Batal
                </button>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {selected.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction("decline")}
                        disabled={busy}
                        className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Tolak
                      </button>
                      <button
                        onClick={() => handleAction("approve")}
                        disabled={busy}
                        className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Setujui & Publikasikan
                      </button>
                    </>
                  )}

                  {selected.status === "declined" && (
                    <>
                      <button
                        onClick={() => handleAction("update")}
                        disabled={busy}
                        className="inline-flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        Simpan Perubahan
                      </button>
                      <button
                        onClick={() => handleAction("approve")}
                        disabled={busy}
                        className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Setujui & Publikasikan
                      </button>
                    </>
                  )}

                  {selected.status === "approved" && (
                    <>
                      <button
                        onClick={() => handleAction("takedown")}
                        disabled={busy}
                        className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Tarik dari Publik
                      </button>
                      <button
                        onClick={() => handleAction("update")}
                        disabled={busy}
                        className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Simpan & Perbarui Publik
                      </button>
                    </>
                  )}

                  {selected.status === "takedown" && (
                    <button
                      onClick={() => handleAction("approve")}
                      disabled={busy}
                      className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Publikasikan Kembali
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

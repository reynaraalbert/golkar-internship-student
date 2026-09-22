"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare, User, ShieldCheck, Mail, Clock, ChevronLeft, Loader2,
  CheckCircle2, Filter, ExternalLink,
} from "lucide-react";
import { PageHeader, EmptyState, ModalWrapper } from "@/components/admin/ui";
import { motion, AnimatePresence } from "framer-motion";
import type { Aspirasi } from "@/lib/data";

const STATUS_FILTERS = ["new", "reviewed", "resolved"] as const;

export default function AdminAspirasiPage() {
  const [aspirasi, setAspirasi] = useState<Aspirasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"new" | "reviewed" | "resolved" | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Aspirasi | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/aspirasi", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAspirasi(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = ["all", ...Array.from(new Set(aspirasi.map((a) => a.category)))];

  const filtered = aspirasi.filter((a) => {
    const statusOk = statusFilter === "all" || a.status === statusFilter;
    const catOk = categoryFilter === "all" || a.category === categoryFilter;
    return statusOk && catOk;
  });

  const setStatus = async (id: string, status: Aspirasi["status"]) => {
    setBusy(true);
    try {
      await fetch(`/api/aspirasi/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await load();
      if (selected?.id === id) setSelected({ ...selected, status });
    } finally {
      setBusy(false);
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      new: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/50",
      reviewed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700/50",
      resolved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50",
    };
    return map[s] || "";
  };

  const statusLabel: Record<string, string> = { new: "Baru", reviewed: "Ditinjau", resolved: "Selesai" };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={MessageSquare}
        title="Kelola Aspirasi"
        subtitle="Lihat aspirasi & pengaduan rakyat yang masuk dari mode publik. Filter berdasarkan status dan kategori mitra."
      />

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Filter className="w-4 h-4" /> Filter Aspirasi
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Status:</span>
          {[{ k: "all", label: "Semua" }, ...STATUS_FILTERS.map((s) => ({ k: s, label: statusLabel[s] }))].map((f) => (
            <button
              key={f.k}
              onClick={() => setStatusFilter(f.k as typeof statusFilter)}
              className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                statusFilter === f.k
                  ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy border-dpr-emerald dark:border-transparent"
                  : "bg-white dark:bg-dpr-navy-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-dpr-navy-card text-slate-700 dark:text-slate-300"
          >
            {categories.map((c) => <option key={c} value={c}>{c === "all" ? "Semua Kategori" : c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-dpr-emerald dark:text-dpr-gold animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Tidak Ada Aspirasi" description="Belum ada aspirasi yang masuk pada filter ini." />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <motion.button
              key={a.id}
              layout
              onClick={() => setSelected(a)}
              className="w-full text-left glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-4 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${a.mode === "Anonim" ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-dpr-emerald/10 dark:bg-dpr-gold/10 text-dpr-emerald dark:text-dpr-gold"}`}>
                {a.mode === "Anonim" ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(a.status)}`}>{statusLabel[a.status]}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{a.category}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{a.subject}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {a.mode === "Anonim" ? "Pengirim Anonim" : (a.name || "Tanpa Nama")}
                </p>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 rotate-180 shrink-0" />
            </motion.button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <ModalWrapper>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/30 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-dpr-navy-card border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Detail Aspirasi</h3>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
                <div className="bg-slate-50 dark:bg-dpr-navy p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(selected.status)}`}>{statusLabel[selected.status]}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(selected.createdAt).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                    <span>Metode: <strong className="capitalize">{selected.mode}</strong></span>
                    <span>Kategori: <strong>{selected.category}</strong></span>
                    {selected.mode === "Terbuka" && (
                      <>
                        <span>Nama: <strong>{selected.name}</strong></span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.email}</span>
                        {selected.whatsapp && <span>WA: {selected.whatsapp}</span>}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Subjek</h4>
                  <p className="font-bold text-slate-900 dark:text-white">{selected.subject}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Isi Aspirasi</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-dpr-navy-card border-t border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between gap-3">
                <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Tutup
                </button>
                <div className="flex items-center gap-2">
                  {selected.status === "new" && (
                    <button
                      onClick={() => setStatus(selected.id, "reviewed")}
                      disabled={busy}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Tandai Ditinjau
                    </button>
                  )}
                  {selected.status === "reviewed" && (
                    <button
                      onClick={() => setStatus(selected.id, "resolved")}
                      disabled={busy}
                      className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-4 py-2.5 rounded-xl disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Tandai Selesai
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

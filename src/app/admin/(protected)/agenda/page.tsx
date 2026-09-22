"use client";

import React, { useState } from "react";
import {
  CalendarDays, Plus, Pencil, Trash2, X, Check, Video,
} from "lucide-react";
import { useCollection } from "@/lib/admin-collection";
import { PageHeader, Field, Grid, Input, Textarea, Select, EmptyState, SaveBar, ModalWrapper } from "@/components/admin/ui";
import type { AgendaItem } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

const TYPES = ["Rapat Kerja (Raker)", "Rapat Dengar Pendapat (RDP)", "Rapat Dengar Pendapat Umum (RDPU)", "Kunjungan Kerja Spesifik"];
const STATUSES = ["LIVE NOW", "SCHEDULED", "COMPLETED"];

const emptyAgenda = (): AgendaItem => ({
  id: `ag-${Date.now()}`,
  title: "",
  type: "Rapat Kerja (Raker)",
  partner: "",
  date: "",
  time: "",
  location: "",
  status: "SCHEDULED",
  summary: "",
  streamUrl: "",
  pdfDownloadUrl: "#",
});

const EMPTY_AGENDA_LIST: AgendaItem[] = [];

const statusBadge = (s: AgendaItem["status"]) => {
  if (s === "LIVE NOW") return "bg-dpr-emerald dark:bg-dpr-red text-white";
  if (s === "SCHEDULED") return "bg-amber-100 dark:bg-dpr-gold/20 text-amber-800 dark:text-dpr-gold border border-amber-300 dark:border-dpr-gold/40";
  return "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
};

export default function AdminAgendaPage() {
  const { data, setData, save, saving, saved } = useCollection<AgendaItem[]>("agenda", EMPTY_AGENDA_LIST);
  const [editing, setEditing] = useState<AgendaItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setIsNew(true);
    setEditing(emptyAgenda());
  };
  const openEdit = (a: AgendaItem) => {
    setIsNew(false);
    setEditing({ ...a });
  };

  const persist = (updated: AgendaItem[]) => setData(updated);

  const handleSaveItem = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      alert("Judul agenda wajib diisi.");
      return;
    }
    if (isNew) {
      persist([editing, ...data]);
    } else {
      persist(data.map((a) => (a.id === editing.id ? editing : a)));
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus agenda ini?")) return;
    persist(data.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <PageHeader
          icon={CalendarDays}
          title="Kelola Agenda Rapat"
          subtitle="Kelola jadwal Raker, RDP, RDPU, dan Kunjungan Kerja yang tampil di halaman Agenda."
        />
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-full shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <EmptyState icon={CalendarDays} title="Belum Ada Agenda" description="Klik 'Tambah Agenda' untuk membuat jadwal rapat baru." />
        ) : (
          data.map((item) => (
            <motion.div key={item.id} layout className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-dpr-emerald/10 dark:bg-dpr-gold/10 text-dpr-emerald dark:text-dpr-gold flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(item.status)}`}>{item.status}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.type}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title || "(Tanpa Judul)"}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{item.date} • {item.time} • {item.partner}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editing && (
          <ModalWrapper>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/30 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-dpr-navy-card border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{isNew ? "Tambah Agenda Baru" : "Edit Agenda"}</h3>
                <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <Field label="Judul Agenda" required>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full" />
                </Field>
                <Grid cols={2}>
                  <Field label="Jenis Rapat">
                    <Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as AgendaItem["type"] })} className="w-full">
                      {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </Field>
                  <Field label="Status">
                    <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as AgendaItem["status"] })} className="w-full">
                      {STATUSES.map((s) => <option key={s} value={s}>{s === "LIVE NOW" ? "🔴 Live Now" : s === "SCHEDULED" ? "Terjadwal" : "Selesai"}</option>)}
                    </Select>
                  </Field>
                </Grid>
                <Field label="Mitra Kerja / Partner">
                  <Input value={editing.partner} onChange={(e) => setEditing({ ...editing, partner: e.target.value })} className="w-full" placeholder="Contoh: Kemenkum & KemenHAM" />
                </Field>
                <Grid cols={2}>
                  <Field label="Tanggal">
                    <Input value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full" placeholder="Contoh: Senin, 25 Agustus 2026" />
                  </Field>
                  <Field label="Waktu">
                    <Input value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} className="w-full" placeholder="Contoh: 10:00 - 15:00 WIB" />
                  </Field>
                </Grid>
                <Field label="Lokasi">
                  <Input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full" />
                </Field>
                <Field label="Ringkasan Pembahasan">
                  <Textarea value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={3} />
                </Field>
                <Grid cols={2}>
                  <Field label="URL Live Stream (YouTube)">
                    <Input value={editing.streamUrl || ""} onChange={(e) => setEditing({ ...editing, streamUrl: e.target.value })} className="w-full" />
                  </Field>
                  <Field label="URL Unduh PDF">
                    <Input value={editing.pdfDownloadUrl || ""} onChange={(e) => setEditing({ ...editing, pdfDownloadUrl: e.target.value })} className="w-full" />
                  </Field>
                </Grid>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-dpr-navy-card border-t border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-end gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Batal
                </button>
                <button onClick={handleSaveItem} className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity">
                  <Check className="w-4 h-4" />
                  Simpan Agenda
                </button>
              </div>
            </motion.div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Clock, Plus, Pencil, Trash2, X, Check, Search, Calendar } from "lucide-react";
import { useCollection } from "@/lib/admin-collection";
import { PageHeader, Field, Grid, Input, Textarea, SaveBar, ModalWrapper, EmptyState, Select } from "@/components/admin/ui";
import { Dialog } from "@/components/admin/DialogSystem";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTimelinePage() {
  const { data, setData, save, saving, saved, loaded } = useCollection<any>("timeline", {
    title: "Timeline Pelaksanaan Magang",
    batches: ["Batch 1 (2024)", "Batch 2 (2025)", "Batch 3 (2026)", "Batch 4 (2026)"],
    sections: [
      { id: "1", type: "timeline", title: "Pendaftaran Dibuka", content: "25 Agustus 2026", order: 1 },
      { id: "2", type: "timeline", title: "Seleksi Berkas", content: "1 - 5 September 2026", order: 2 },
      { id: "3", type: "timeline", title: "Pengumuman Lolos", content: "10 September 2026", order: 3 },
    ]
  });

  const BATCHES = data.batches || ["Batch 1 (2024)", "Batch 2 (2025)", "Batch 3 (2026)", "Batch 4 (2026)"];
  const [selectedBatch, setSelectedBatch] = useState(BATCHES[BATCHES.length - 1] || "Batch 4 (2026)");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", startDate: "", endDate: "", batch: "Batch 4 (2026)", order: 0 });
  const [isNew, setIsNew] = useState(false);

  if (!loaded) return <div className="p-10 text-center text-slate-500">Memuat...</div>;

  const currentBatchSections = (data.sections || []).filter((s: any) => s.batch === selectedBatch || (!s.batch && selectedBatch === "Batch 4 (2026)"));

  const addNewBatch = async () => {
    const name = await Dialog.prompt("Masukkan nama batch baru (Misal: Batch 5 (2027)):");
    if (!name || !name.trim()) return;
    if (BATCHES.includes(name.trim())) {
      await Dialog.alert("Batch sudah ada.");
      return;
    }
    
    setData((prev: any) => ({
      ...prev,
      batches: [...(prev.batches || BATCHES), name.trim()]
    }));
    setSelectedBatch(name.trim());
  };

  const openNew = () => {
    setIsNew(true);
    setEditForm({ title: "", content: "", startDate: "", endDate: "", batch: selectedBatch, order: currentBatchSections.length + 1 });
    setEditingId(`t-${Date.now()}`);
  };

  const openEdit = (sec: any) => {
    setIsNew(false);
    setEditForm({ 
      title: sec.title || "", 
      content: sec.content || "", 
      startDate: sec.startDate || "", 
      endDate: sec.endDate || "", 
      batch: sec.batch || "Batch 4 (2026)",
      order: sec.order || 0 
    });
    setEditingId(sec.id);
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start) return "";
    const sDate = new Date(start);
    const s = sDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    if (!end) return s;
    const eDate = new Date(end);
    
    // Jika bulan dan tahun sama, format: "1 - 5 September 2026"
    if (sDate.getMonth() === eDate.getMonth() && sDate.getFullYear() === eDate.getFullYear()) {
      return `${sDate.getDate()} - ${eDate.getDate()} ${eDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`;
    }
    
    const e = eDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    return `${s} - ${e}`;
  };

  const saveItem = async () => {
    if (!editForm.title.trim()) {
      await Dialog.alert("Judul timeline wajib diisi");
      return;
    }
    
    // Auto generate content string from dates if provided
    let finalContent = editForm.content;
    if (editForm.startDate) {
      finalContent = formatDateRange(editForm.startDate, editForm.endDate);
    }

    const payload = { ...editForm, content: finalContent };
    
    let newSections = [...data.sections];
    if (isNew) {
      newSections.push({ id: editingId!, type: "timeline", ...payload });
    } else {
      newSections = newSections.map((s: any) => s.id === editingId ? { ...s, ...payload } : s);
    }
    
    newSections.sort((a, b) => (a.order || 0) - (b.order || 0));
    setData((prev: any) => ({ ...prev, sections: newSections }));
    setEditingId(null);
  };

  const deleteItem = async (id: string) => {
    const confirmed = await Dialog.confirm("Hapus item timeline ini?");
    if (!confirmed) return;
    setData((prev: any) => ({ ...prev, sections: prev.sections.filter((s: any) => s.id !== id) }));
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <PageHeader
          icon={Clock}
          title="Kelola Timeline Magang"
          subtitle="Atur timeline pelaksanaan magang per-batch."
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <Select 
              value={selectedBatch} 
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-48 bg-white dark:bg-slate-900"
            >
              {BATCHES.map((b: string) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </Select>
            <button
              onClick={addNewBatch}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Tambah Batch Baru"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-full shadow-md hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Timeline</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentBatchSections.length === 0 ? (
          <EmptyState icon={Clock} title="Belum Ada Timeline" description={`Klik tambah timeline untuk memulai pada ${selectedBatch}.`} />
        ) : (
          currentBatchSections.map((sec: any) => (
            <div key={sec.id} className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Tahap {sec.order}: {sec.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3"/> {sec.content}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(sec)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteItem(sec.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {editingId && (
          <ModalWrapper>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-dpr-navy-card rounded-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-white/10">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white">{isNew ? "Tambah Timeline" : "Edit Timeline"}</h3>
                <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-slate-700"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                <Field label="Urutan Tahap (Angka)">
                  <Input type="number" value={editForm.order} onChange={e => setEditForm(f => ({ ...f, order: Number(e.target.value) }))} className="w-full" />
                </Field>
                <Field label="Nama Tahapan (Misal: Pengumuman)">
                  <Input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full" />
                </Field>
                <Grid cols={2}>
                  <Field label="Tanggal Mulai">
                    <Input type="date" value={editForm.startDate} onChange={e => setEditForm(f => ({ ...f, startDate: e.target.value }))} className="w-full" />
                  </Field>
                  <Field label="Tanggal Selesai (Opsional)">
                    <Input type="date" value={editForm.endDate} onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value }))} className="w-full" />
                  </Field>
                </Grid>
                <Field label="Deskripsi / Teks Alternatif (Otomatis terisi jika ada tanggal)">
                  <Textarea value={editForm.content} onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))} rows={2} className="w-full" />
                </Field>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 flex justify-end gap-3">
                <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">Batal</button>
                <button onClick={saveItem} className="px-4 py-2 text-xs font-bold bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy rounded-xl">Simpan</button>
              </div>
            </motion.div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

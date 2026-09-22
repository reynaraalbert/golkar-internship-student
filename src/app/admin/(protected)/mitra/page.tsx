"use client";

import React, { useState } from "react";
import {
  Building2, Plus, Pencil, Trash2, X, Check,
} from "lucide-react";
import { useCollection } from "@/lib/admin-collection";
import { PageHeader, Field, Grid, Input, Textarea, EmptyState, SaveBar, ModalWrapper } from "@/components/admin/ui";
import type { MitraKerja } from "@/lib/data";
import FileUpload from "@/components/ui/FileUpload";
import { motion, AnimatePresence } from "framer-motion";

const emptyMitra = (): MitraKerja => ({
  id: `mitra-${Date.now()}`,
  name: "",
  acronym: "",
  ministerOrHead: "",
  focusArea: "",
  logoUrl: "",
  description: "",
});

const EMPTY_MITRA_LIST: MitraKerja[] = [];

export default function AdminMitraPage() {
  const { data, setData, save, saving, saved } = useCollection<MitraKerja[]>("mitraKerja", EMPTY_MITRA_LIST);
  const [editing, setEditing] = useState<MitraKerja | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setIsNew(true);
    setEditing(emptyMitra());
  };
  const openEdit = (m: MitraKerja) => {
    setIsNew(false);
    setEditing({ ...m });
  };

  const persist = (updated: MitraKerja[]) => setData(updated);

  const handleSaveItem = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      alert("Nama mitra wajib diisi.");
      return;
    }
    if (isNew) {
      persist([...data, editing]);
    } else {
      persist(data.map((m) => (m.id === editing.id ? editing : m)));
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus mitra kerja ini?")) return;
    persist(data.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <PageHeader
          icon={Building2}
          title="Kelola Mitra Kerja"
          subtitle={`Kelola mitra kerja Komisi XIII (${data.length} mitra). Judul & deskripsi section diatur pada menu Beranda.`}
        />
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-full shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mitra</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <EmptyState icon={Building2} title="Belum Ada Mitra Kerja" description="Klik 'Tambah Mitra' untuk menambahkan mitra kerja baru." />
        ) : (
          data.map((m) => (
            <motion.div key={m.id} layout className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                {m.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.logoUrl} alt={m.name} className="w-full h-full object-contain" />
                ) : (
                  <Building2 className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{m.name || "(Tanpa Nama)"}</h3>
                  {m.acronym && <span className="px-1.5 py-0.5 rounded bg-dpr-emerald/10 dark:bg-dpr-gold/10 text-dpr-emerald dark:text-dpr-gold text-[9px] font-bold">{m.acronym}</span>}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{m.ministerOrHead}</p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1">{m.focusArea}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(m)} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{isNew ? "Tambah Mitra Baru" : "Edit Mitra"}</h3>
                <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <Grid cols={2}>
                  <Field label="Nama Kementerian/Lembaga" required>
                    <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full" />
                  </Field>
                  <Field label="Akronim">
                    <Input value={editing.acronym} onChange={(e) => setEditing({ ...editing, acronym: e.target.value })} className="w-full" placeholder="Contoh: Kemenkum" />
                  </Field>
                </Grid>
                <Field label="Menteri / Pimpinan Lembaga">
                  <Input value={editing.ministerOrHead} onChange={(e) => setEditing({ ...editing, ministerOrHead: e.target.value })} className="w-full" />
                </Field>
                <Field label="Fokus Kerja Sama">
                  <Input value={editing.focusArea} onChange={(e) => setEditing({ ...editing, focusArea: e.target.value })} className="w-full" placeholder="Contoh: Tata Hukum, HAM, Imigrasi & Pemasyarakatan" />
                </Field>
                <Field label="Upload Logo">
                  <FileUpload value={editing.logoUrl} onChange={(url) => setEditing({ ...editing, logoUrl: url })} accept="image" />
                </Field>
                <Field label="Deskripsi Mitra">
                  <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} />
                </Field>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-dpr-navy-card border-t border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-end gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Batal</button>
                <button onClick={handleSaveItem} className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity">
                  <Check className="w-4 h-4" /> Simpan Mitra
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

"use client";

import React, { useState } from "react";
import {
  Target, Eye, Star, Plus, Trash2, ChevronDown, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { PageHeader, SectionCard, Field, Input, Textarea, SaveBar } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { PAGES } from "@/lib/pages";
import type { PageContent } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProfilVisiMisiPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection<PageContent[]>("pages", PAGES);
  const [expandedMisi, setExpandedMisi] = useState(true);
  const [expandedNilai, setExpandedNilai] = useState(true);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat data visi & misi...
      </div>
    );
  }

  const page = data.find((p) => p.slug === "profil/visi-misi");
  if (!page) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Halaman visi & misi tidak ditemukan.
      </div>
    );
  }

  const updateField = (sectionTitle: string, subId: string, fieldKey: string, value: string) => {
    setData((prev) =>
      prev.map((p) =>
        p.slug === "profil/visi-misi"
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.title === sectionTitle
                  ? {
                      ...s,
                      subsections: s.subsections.map((sub) =>
                        sub.id === subId ? { ...sub, fields: { ...sub.fields, [fieldKey]: value } } : sub
                      ),
                    }
                  : s
              ),
            }
          : p
      )
    );
  };

  type Subsections = PageContent["sections"][number]["subsections"];

  const updatePageSection = (sectionTitle: string, updater: (subs: Subsections) => Subsections) => {
    setData((prev) =>
      prev.map((p) =>
        p.slug === "profil/visi-misi"
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.title === sectionTitle ? { ...s, subsections: updater(s.subsections) } : s
              ),
            }
          : p
      )
    );
  };

  const getSection = (title: string) => page?.sections.find((s) => s.title === title);

  const headerSub = getSection("Header Halaman Visi & Misi")?.subsections[0];
  const visiSub = getSection("Visi Utama Komisi")?.subsections[0];
  const misiSubs = getSection("Misi Kerja Komisi (4 Pilar Strategis)")?.subsections || [];
  const nilaiSubs = getSection("Nilai-Nilai Utama Komisi")?.subsections || [];

  const addNilai = () => {
    updatePageSection("Nilai-Nilai Utama Komisi", (subs) => [
      ...subs,
      { id: `visimisi-nilai-${Date.now()}`, title: "Nilai Baru", fields: { judul: "Judul Nilai", deskripsi: "Deskripsi nilai baru." } },
    ]);
  };

  const deleteNilai = (subId: string) => {
    if (!confirm("Hapus nilai ini?")) return;
    updatePageSection("Nilai-Nilai Utama Komisi", (subs) => subs.filter((s) => s.id !== subId));
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Target}
        title="Kelola Visi & Misi Komisi XIII"
        subtitle="Edit header, visi utama, 4 pilar misi (termasuk target capaian), dan nilai-nilai utama komisi."
      />

      {/* Header */}
      {headerSub && (
        <SectionCard icon={Target} title="Header Halaman Visi & Misi (/profil/visi-misi)" description="Teks badge, judul, dan deskripsi intro halaman.">
          <Field label="Teks Badge">
            <Input value={headerSub.fields.badge || ""} onChange={(e) => updateField("Header Halaman Visi & Misi", headerSub.id, "badge", e.target.value)} className="w-full" />
          </Field>
          <Field label="Judul Halaman">
            <Input value={headerSub.fields.judul || ""} onChange={(e) => updateField("Header Halaman Visi & Misi", headerSub.id, "judul", e.target.value)} className="w-full" />
          </Field>
          <Field label="Deskripsi">
            <Textarea value={headerSub.fields.deskripsi || ""} onChange={(e) => updateField("Header Halaman Visi & Misi", headerSub.id, "deskripsi", e.target.value)} rows={2} />
          </Field>
        </SectionCard>
      )}

      {/* Visi */}
      {visiSub && (
        <SectionCard icon={Eye} title="Visi Utama Komisi" description="Pernyataan visi yang ditampilkan sebagai blockquote besar di halaman visi & misi.">
          <Field label="Label Visi">
            <Input value={visiSub.fields.label || ""} onChange={(e) => updateField("Visi Utama Komisi", visiSub.id, "label", e.target.value)} className="w-full" />
          </Field>
          <Field label="Sub-judul Visi">
            <Input value={visiSub.fields.judul || ""} onChange={(e) => updateField("Visi Utama Komisi", visiSub.id, "judul", e.target.value)} className="w-full" />
          </Field>
          <Field label="Pernyataan Visi (blockquote)">
            <Textarea value={visiSub.fields.visi || ""} onChange={(e) => updateField("Visi Utama Komisi", visiSub.id, "visi", e.target.value)} rows={3} />
          </Field>
          <Field label="Penjelasan Visi">
            <Textarea value={visiSub.fields.penjelasan || ""} onChange={(e) => updateField("Visi Utama Komisi", visiSub.id, "penjelasan", e.target.value)} rows={3} />
          </Field>
        </SectionCard>
      )}

      {/* Misi */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div
          className="px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-dpr-navy border-b border-slate-200 dark:border-white/10 cursor-pointer"
          onClick={() => setExpandedMisi((v) => !v)}
        >
          <div className="flex items-center gap-3">
            {expandedMisi ? <ChevronDown className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" /> : <ChevronRightIcon className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">4 Pilar Misi Komisi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Judul, isi, dan 3 target capaian per misi</p>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {expandedMisi && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-5 space-y-4">
              {misiSubs.map((sub, i) => (
                <div key={sub.id} className="border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3 bg-white/60 dark:bg-dpr-navy/40">
                  <p className="text-xs font-bold text-dpr-emerald dark:text-dpr-gold uppercase">Misi {sub.fields.nomorMisi || i + 1}</p>
                  <Field label="Judul Misi">
                    <Input value={sub.fields.judul || ""} onChange={(e) => updateField("Misi Kerja Komisi (4 Pilar Strategis)", sub.id, "judul", e.target.value)} className="w-full" />
                  </Field>
                  <Field label="Isi / Deskripsi Misi">
                    <Textarea value={sub.fields.isi || ""} onChange={(e) => updateField("Misi Kerja Komisi (4 Pilar Strategis)", sub.id, "isi", e.target.value)} rows={4} />
                  </Field>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Capaian (3 butir)</p>
                    {["target1", "target2", "target3"].map((key, ti) => (
                      <Field key={key} label={`Target ${ti + 1}`}>
                        <Input value={sub.fields[key] || ""} onChange={(e) => updateField("Misi Kerja Komisi (4 Pilar Strategis)", sub.id, key, e.target.value)} className="w-full" />
                      </Field>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nilai-Nilai */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div
          className="px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-dpr-navy border-b border-slate-200 dark:border-white/10 cursor-pointer"
          onClick={() => setExpandedNilai((v) => !v)}
        >
          <div className="flex items-center gap-3">
            {expandedNilai ? <ChevronDown className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" /> : <ChevronRightIcon className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Nilai-Nilai Utama Komisi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{nilaiSubs.length} nilai tersedia</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addNilai(); }}
            className="inline-flex items-center gap-1 text-xs font-bold text-dpr-emerald dark:text-dpr-gold px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Nilai
          </button>
        </div>
        <AnimatePresence>
          {expandedNilai && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nilaiSubs.map((sub, i) => (
                  <div key={sub.id} className="border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3 bg-white/60 dark:bg-dpr-navy/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nilai {i + 1}</span>
                      </div>
                      <button onClick={() => deleteNilai(sub.id)} className="p-1 rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Field label="Judul Nilai">
                      <Input value={sub.fields.judul || ""} onChange={(e) => updateField("Nilai-Nilai Utama Komisi", sub.id, "judul", e.target.value)} className="w-full" />
                    </Field>
                    <Field label="Deskripsi">
                      <Textarea value={sub.fields.deskripsi || ""} onChange={(e) => updateField("Nilai-Nilai Utama Komisi", sub.id, "deskripsi", e.target.value)} rows={2} />
                    </Field>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  BookOpen, Plus, Trash2, Save, Loader2, Check, ChevronDown, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { PageHeader, SectionCard, Field, Input, Textarea, SaveBar } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { PAGES } from "@/lib/pages";
import type { PageContent } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProfilSejarahPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection<PageContent[]>("pages", PAGES);
  const [expandedTimeline, setExpandedTimeline] = useState(true);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat data sejarah...
      </div>
    );
  }

  const page = data.find((p) => p.slug === "profil/sejarah");
  if (!page) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Halaman sejarah tidak ditemukan. Pastikan PAGES sudah mencakup page &apos;profil/sejarah&apos;.
      </div>
    );
  }

  const updateField = (sectionTitle: string, subId: string, fieldKey: string, value: string) => {
    setData((prev) =>
      prev.map((p) =>
        p.slug === "profil/sejarah"
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
        p.slug === "profil/sejarah"
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

  const headerSub = getSection("Header Halaman Sejarah")?.subsections[0];
  const factSubs = getSection("Statistik & Fakta Komisi")?.subsections || [];
  const narasiSubs = getSection("Narasi Latar Belakang Pembentukan")?.subsections || [];
  const timelineSubs = getSection("Linimasa Sejarah Penting")?.subsections || [];

  const addMilestone = () => {
    const newId = `sejarah-milestone-${Date.now()}`;
    updatePageSection("Linimasa Sejarah Penting", (subs) => [
      ...subs,
      {
        id: newId,
        title: "Milestone Baru",
        fields: { tahun: "Tahun", judul: "Judul Milestone", deskripsi: "Deskripsi milestone baru.", highlight: "false" },
      },
    ]);
  };

  const deleteMilestone = (subId: string) => {
    if (!confirm("Hapus milestone ini?")) return;
    updatePageSection("Linimasa Sejarah Penting", (subs) => subs.filter((s) => s.id !== subId));
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={BookOpen}
        title="Kelola Sejarah Komisi XIII"
        subtitle="Edit header, statistik fact cards, narasi latar belakang, dan linimasa (timeline) sejarah komisi."
      />

      {/* Header Section */}
      {headerSub && (
        <SectionCard icon={BookOpen} title="Header Halaman Sejarah (/profil/sejarah)" description="Badge, judul, dan deskripsi intro halaman sejarah.">
          <Field label="Teks Badge">
            <Input value={headerSub.fields.badge || ""} onChange={(e) => updateField("Header Halaman Sejarah", headerSub.id, "badge", e.target.value)} className="w-full" />
          </Field>
          <Field label="Judul Halaman">
            <Input value={headerSub.fields.judul || ""} onChange={(e) => updateField("Header Halaman Sejarah", headerSub.id, "judul", e.target.value)} className="w-full" />
          </Field>
          <Field label="Deskripsi">
            <Textarea value={headerSub.fields.deskripsi || ""} onChange={(e) => updateField("Header Halaman Sejarah", headerSub.id, "deskripsi", e.target.value)} rows={2} />
          </Field>
        </SectionCard>
      )}

      {/* Facts Section */}
      <SectionCard icon={BookOpen} title="Statistik & Fakta Komisi (4 Fact Cards)" description="Nilai dan label yang tampil pada 4 kartu statistik di bagian atas halaman sejarah.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {factSubs.map((sub) => (
            <div key={sub.id} className="p-4 rounded-xl bg-slate-50 dark:bg-dpr-navy border border-slate-200 dark:border-white/10 space-y-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{sub.title}</p>
              <Field label="Label">
                <Input value={sub.fields.label || ""} onChange={(e) => updateField("Statistik & Fakta Komisi", sub.id, "label", e.target.value)} className="w-full" />
              </Field>
              <Field label="Nilai">
                <Input value={sub.fields.value || ""} onChange={(e) => updateField("Statistik & Fakta Komisi", sub.id, "value", e.target.value)} className="w-full" />
              </Field>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Narasi Section */}
      <SectionCard icon={BookOpen} title="Narasi Latar Belakang Pembentukan" description="Paragraf-paragraf teks penjelasan tentang latar belakang pembentukan Komisi XIII.">
        {narasiSubs.map((sub, i) => (
          <Field key={sub.id} label={`Paragraf ${i + 1}`}>
            <Textarea
              value={sub.fields.teks || ""}
              onChange={(e) => updateField("Narasi Latar Belakang Pembentukan", sub.id, "teks", e.target.value)}
              rows={4}
            />
          </Field>
        ))}
      </SectionCard>

      {/* Timeline Section */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div
          className="px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-dpr-navy border-b border-slate-200 dark:border-white/10 cursor-pointer"
          onClick={() => setExpandedTimeline((v) => !v)}
        >
          <div className="flex items-center gap-3">
            {expandedTimeline ? <ChevronDown className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" /> : <ChevronRightIcon className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Linimasa Sejarah Penting (Timeline)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{timelineSubs.length} milestone tersedia</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addMilestone(); }}
            className="inline-flex items-center gap-1 text-xs font-bold text-dpr-emerald dark:text-dpr-gold px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Milestone
          </button>
        </div>

        <AnimatePresence>
          {expandedTimeline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 space-y-4"
            >
              {timelineSubs.map((sub, i) => (
                <div key={sub.id} className="border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3 bg-white/60 dark:bg-dpr-navy/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Milestone {i + 1}</span>
                    <button
                      onClick={() => deleteMilestone(sub.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Hapus milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Tahun / Periode">
                      <Input value={sub.fields.tahun || ""} onChange={(e) => updateField("Linimasa Sejarah Penting", sub.id, "tahun", e.target.value)} className="w-full" />
                    </Field>
                    <Field label="Highlight (tampil menonjol)?">
                      <select
                        value={sub.fields.highlight || "false"}
                        onChange={(e) => updateField("Linimasa Sejarah Penting", sub.id, "highlight", e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-dpr-navy text-slate-900 dark:text-white focus:ring-2 focus:ring-dpr-emerald dark:focus:ring-dpr-gold focus:outline-none"
                      >
                        <option value="false">Tidak (Normal)</option>
                        <option value="true">Ya (Highlighted)</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Judul Milestone">
                    <Input value={sub.fields.judul || ""} onChange={(e) => updateField("Linimasa Sejarah Penting", sub.id, "judul", e.target.value)} className="w-full" />
                  </Field>
                  <Field label="Deskripsi">
                    <Textarea value={sub.fields.deskripsi || ""} onChange={(e) => updateField("Linimasa Sejarah Penting", sub.id, "deskripsi", e.target.value)} rows={3} />
                  </Field>
                </div>
              ))}
              {timelineSubs.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Belum ada milestone. Klik &quot;Tambah Milestone&quot; untuk menambahkan.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

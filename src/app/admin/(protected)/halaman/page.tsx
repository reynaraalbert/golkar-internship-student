"use client";

import React, { useState } from "react";
import {
  FileText, Layout, ChevronRight, ChevronDown, Plus, Trash2, Save,
  Loader2, Check, Pencil, X,
} from "lucide-react";
import { PageHeader, EmptyState, Field, Input, Textarea } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { motion, AnimatePresence } from "framer-motion";
import type { PageContent, PageSection, PageSubsection } from "@/lib/data";
import { PAGES } from "@/lib/pages";

export default function AdminHalamanPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection<PageContent[]>("pages", PAGES);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat halaman...
      </div>
    );
  }

  const selectedPage = data.find((p) => p.id === selectedPageId) || data[0];

  const updatePage = (pageId: string, updater: (page: PageContent) => PageContent) => {
    setData((prev) => prev.map((p) => (p.id === pageId ? updater(p) : p)));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !(prev[sectionId] ?? true) }));
  };

  const addSection = (page: PageContent) => {
    updatePage(page.id, (p) => ({
      ...p,
      sections: [
        ...p.sections,
        {
          id: `sec-${Date.now()}`,
          title: "Section Baru",
          subsections: [],
        },
      ],
    }));
  };

  const addSubsection = (page: PageContent, sectionId: string) => {
    updatePage(page.id, (p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: [
                ...s.subsections,
                {
                  id: `sub-${Date.now()}`,
                  title: "Subsection Baru",
                  fields: { text: "Isi konten di sini..." },
                },
              ],
            }
          : s
      ),
    }));
  };

  const updateSubsection = (page: PageContent, sectionId: string, subId: string, updates: Partial<PageSubsection>) => {
    updatePage(page.id, (p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((sub) =>
                sub.id === subId ? { ...sub, ...updates } : sub
              ),
            }
          : s
      ),
    }));
  };

  const updateField = (page: PageContent, sectionId: string, subId: string, fieldKey: string, value: string) => {
    updatePage(page.id, (p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              subsections: s.subsections.map((sub) =>
                sub.id === subId
                  ? { ...sub, fields: { ...sub.fields, [fieldKey]: value } }
                  : sub
              ),
            }
          : s
      ),
    }));
  };

  const updateSectionTitle = (page: PageContent, sectionId: string, title: string) => {
    updatePage(page.id, (p) => ({
      ...p,
      sections: p.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    }));
  };

  const deleteSection = (page: PageContent, sectionId: string) => {
    if (!confirm("Hapus section ini beserta seluruh subsection di dalamnya?")) return;
    updatePage(page.id, (p) => ({
      ...p,
      sections: p.sections.filter((s) => s.id !== sectionId),
    }));
  };

  const addPage = () => {
    const title = prompt("Masukkan judul halaman baru:", "Halaman Baru");
    if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newPage: PageContent = {
      id: `page-${Date.now()}`,
      slug,
      title,
      sections: [
        {
          id: `sec-${Date.now()}`,
          title: "Section Utama",
          subsections: [
            {
              id: `sub-${Date.now()}`,
              title: "Konten Utama",
              fields: { judul: title, deskripsi: "Isi deskripsi halaman baru di sini..." },
            },
          ],
        },
      ],
    };
    setData((prev) => [...prev, newPage]);
    setSelectedPageId(newPage.id);
  };

  const deletePage = (pageId: string) => {
    if (data.length <= 1) {
      alert("Minimal harus ada satu halaman.");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menghapus seluruh halaman ini?")) return;
    const updated = data.filter((p) => p.id !== pageId);
    setData(updated);
    setSelectedPageId(updated[0].id);
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <PageHeader
          icon={FileText}
          title="Kelola Halaman & Dynamic Content"
          subtitle="Kelola struktur halaman, section, & subsection secara dinamis agar seluruh konten halaman publik dapat dikembangkan dan diedit secara fleksibel."
        />
        <button
          onClick={addPage}
          className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-4 py-2.5 rounded-full shadow-md hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Tambah Halaman Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Page list */}
        <div className="lg:col-span-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daftar Halaman</h3>
            <span className="text-[10px] font-bold text-dpr-emerald dark:text-dpr-gold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              {data.length} Halaman
            </span>
          </div>
          {data.length === 0 ? (
            <EmptyState icon={FileText} title="Belum Ada Halaman" description="Tidak ada halaman yang dapat dikelola." />
          ) : (
            data.map((p) => (
              <div
                key={p.id}
                className={`w-full rounded-xl border transition-all flex items-center justify-between gap-2 overflow-hidden ${
                  selectedPage?.id === p.id
                    ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy border-dpr-emerald dark:border-transparent shadow-md"
                    : "bg-white dark:bg-dpr-navy-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40"
                }`}
              >
                <button
                  onClick={() => setSelectedPageId(p.id)}
                  className="flex-1 text-left px-3 py-2.5 text-sm font-semibold flex items-center gap-2 truncate"
                >
                  <Layout className="w-4 h-4 shrink-0" />
                  <span className="truncate">{p.title}</span>
                </button>
                <button
                  onClick={() => deletePage(p.id)}
                  className="p-2 text-red-400 hover:text-red-600 opacity-70 hover:opacity-100 transition-opacity"
                  title="Hapus Halaman"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sections editor */}
        <div className="lg:col-span-9 space-y-4">
          {selectedPage ? (
            <>
              <div className="flex items-center justify-between bg-white dark:bg-dpr-navy-card p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedPage.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Slug URL: <code className="text-dpr-emerald dark:text-dpr-gold">/{selectedPage.slug}</code></p>
                </div>
                <button
                  onClick={() => addSection(selectedPage)}
                  className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-4 py-2 rounded-full shadow-md hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Tambah Section
                </button>
              </div>

              <AnimatePresence>
                {selectedPage.sections.map((section) => {
                  const expanded = expandedSections[section.id] ?? true;
                  return (
                    <motion.div
                      key={section.id}
                      layout
                      className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                      {/* Section header */}
                      <div className="px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-dpr-navy border-b border-slate-200 dark:border-white/10 gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <button onClick={() => toggleSection(section.id)} className="text-slate-400 hover:text-white">
                            {expanded ? <ChevronDown className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" /> : <ChevronRight className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />}
                          </button>
                          <input
                            value={section.title}
                            onChange={(e) => updateSectionTitle(selectedPage, section.id, e.target.value)}
                            className="bg-transparent text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-b focus:border-dpr-emerald dark:focus:border-dpr-gold px-1 py-0.5 flex-1"
                          />
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                            {section.subsections.length} sub-section
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => addSubsection(selectedPage, section.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-dpr-emerald dark:text-dpr-gold px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            title="Tambah subsection"
                          >
                            <Plus className="w-3.5 h-3.5" /> Subsection
                          </button>
                          <button
                            onClick={() => deleteSection(selectedPage, section.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Hapus section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {expanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-5 space-y-4">
                          {section.subsections.map((sub) => (
                            <div key={sub.id} className="border border-slate-200 dark:border-white/10 rounded-xl p-4 space-y-3 bg-white/60 dark:bg-dpr-navy/40">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  value={sub.title}
                                  onChange={(e) => updateSubsection(selectedPage, section.id, sub.id, { title: e.target.value })}
                                  className="flex-1 bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-b focus:border-dpr-emerald dark:focus:border-dpr-gold px-1 py-0.5"
                                />
                                <button
                                  onClick={() => updatePage(selectedPage.id, (p) => ({
                                    ...p,
                                    sections: p.sections.map((s) =>
                                      s.id === section.id
                                        ? { ...s, subsections: s.subsections.filter((x) => x.id !== sub.id) }
                                        : s
                                    ),
                                  }))}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                                  title="Hapus subsection"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Editable fields */}
                              <div className="space-y-2">
                                {Object.entries(sub.fields).map(([key, value]) => (
                                  <Field key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}>
                                    {value.length > 120 ? (
                                      <Textarea
                                        value={value}
                                        onChange={(e) => updateField(selectedPage, section.id, sub.id, key, e.target.value)}
                                        rows={2}
                                      />
                                    ) : (
                                      <Input
                                        value={value}
                                        onChange={(e) => updateField(selectedPage, section.id, sub.id, key, e.target.value)}
                                        className="w-full"
                                      />
                                    )}
                                  </Field>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          ) : (
            <EmptyState icon={FileText} title="Pilih Sebuah Halaman" description="Pilih halaman di panel kiri untuk mulai mengedit konten." />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-72 z-30 border-t border-slate-200 dark:border-white/10 bg-white/90 dark:bg-dpr-navy-card/90 backdrop-blur-lg px-6 py-3 flex items-center justify-end gap-3">
        <span className={`text-xs font-semibold ${saved ? "text-emerald-500" : "text-slate-400"}`}>
          {saved ? <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Tersimpan</span> : "Perubahan belum disimpan"}
        </span>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

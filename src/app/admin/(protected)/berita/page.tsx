"use client";

import React, { useState } from "react";
import {
  Newspaper, Plus, Pencil, Trash2, Star, ImageOff, X, Check, ChevronLeft,
} from "lucide-react";
import { useCollection } from "@/lib/admin-collection";
import { PageHeader, SectionCard, Field, Grid, Input, Textarea, Select, EmptyState, SaveBar, ModalWrapper } from "@/components/admin/ui";
import type { NewsArticle } from "@/lib/data";
import FileUpload from "@/components/ui/FileUpload";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Legislasi", "Pengawasan", "Anggaran", "Siaran Pers", "Kunjungan Kerja"];

const emptyArticle = (): NewsArticle => ({
  id: `news-${Date.now()}`,
  title: "",
  slug: "",
  category: "Legislasi",
  date: "",
  readTime: "3 Menit Baca",
  author: "Humas Komisi XIII DPR RI",
  summary: "",
  content: "",
  imageUrl: "",
  isFeatured: false,
});

const EMPTY_NEWS_LIST: NewsArticle[] = [];

export default function AdminBeritaPage() {
  const { data, setData, save, saving, saved, dbConnected } = useCollection<NewsArticle[]>("berita", EMPTY_NEWS_LIST);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setIsNew(true);
    setEditing(emptyArticle());
  };
  const openEdit = (a: NewsArticle) => {
    setIsNew(false);
    setEditing({ ...a });
  };

  const persist = (updated: NewsArticle[]) => {
    setData(updated);
  };

  const handleSaveItem = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      alert("Judul berita wajib diisi.");
      return;
    }
    if (!editing.slug) {
      editing.slug = editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (isNew) {
      persist([editing, ...data]);
    } else {
      persist(data.map((a) => (a.id === editing.id ? editing : a)));
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus berita ini?")) return;
    persist(data.filter((a) => a.id !== id));
  };

  const toggleFeatured = (id: string) => {
    persist(data.map((a) => (a.id === id ? { ...a, isFeatured: !a.isFeatured } : a)));
  };

  return (
    <div className="space-y-8 pb-24">
      {dbConnected === false && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-4 py-3 text-xs font-semibold">
          Database tidak terhubung — halaman ini menampilkan data cadangan (default). Perubahan yang Anda simpan TIDAK akan masuk ke database sampai koneksi pulih.
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <PageHeader
          icon={Newspaper}
          title="Kelola Berita"
          subtitle="Tambah, edit, atau hapus berita & siaran pers yang tampil di halaman Berita situs publik."
        />
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-full shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Berita</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <EmptyState icon={Newspaper} title="Belum Ada Berita" description="Klik tombol 'Tambah Berita' untuk membuat berita pertama Anda." />
        ) : (
          data.map((article) => (
            <motion.div
              key={article.id}
              layout
              className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Thumb */}
              <div className="w-full sm:w-40 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 shrink-0 relative">
                {article.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-slate-400 dark:text-slate-600" />
                  </div>
                )}
                {article.isFeatured && (
                  <span className="absolute top-1.5 left-1.5 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy text-[9px] font-black px-1.5 py-0.5 rounded">UTAMA</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-dpr-emerald/10 dark:bg-dpr-gold/10 text-dpr-emerald dark:text-dpr-gold border border-dpr-emerald/20 dark:border-dpr-gold/20">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{article.date}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{article.title || "(Tanpa Judul)"}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{article.summary}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => toggleFeatured(article.id)}
                  className={`p-2 rounded-lg transition-colors ${article.isFeatured ? "text-dpr-emerald dark:text-dpr-gold bg-dpr-emerald/10 dark:bg-dpr-gold/10" : "text-slate-400 dark:text-slate-500 hover:text-dpr-emerald dark:hover:text-dpr-gold"}`}
                  title="Jadikan Berita Utama"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEdit(article)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
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
              className="bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/30 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-dpr-navy-card border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {isNew ? "Tambah Berita Baru" : "Edit Berita"}
                </h3>
                <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <Field label="Judul Berita" required>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full" />
                </Field>
                <Grid cols={2}>
                  <Field label="Slug (URL)">
                    <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full" placeholder="otomatis dari judul" />
                  </Field>
                  <Field label="Kategori" required>
                    <Select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as NewsArticle["category"] })} className="w-full">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Select>
                  </Field>
                </Grid>
                <Grid cols={2}>
                  <Field label="Tanggal">
                    <Input value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full" placeholder="Contoh: 24 Agustus 2026" />
                  </Field>
                  <Field label="Waktu Baca">
                    <Input value={editing.readTime} onChange={(e) => setEditing({ ...editing, readTime: e.target.value })} className="w-full" placeholder="Contoh: 4 Menit Baca" />
                  </Field>
                </Grid>
                <Field label="Penulis">
                  <Input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} className="w-full" />
                </Field>
                <Field label="Upload Gambar Utama">
                  <FileUpload value={editing.imageUrl} onChange={(url) => setEditing({ ...editing, imageUrl: url })} accept="image" />
                </Field>
                <Field label="Ringkasan (Lead)">
                  <Textarea value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={3} />
                </Field>
                <Field label="Isi Berita Lengkap">
                  <Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} />
                </Field>
                <Field label="Lampiran Dokumen (opsional)">
                  <FileUpload value={editing.documentUrl || ""} onChange={(url) => setEditing({ ...editing, documentUrl: url })} accept="document" />
                </Field>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editing.isFeatured}
                    onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-dpr-emerald"
                  />
                  Jadikan sebagai Berita Utama (Featured)
                </label>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-dpr-navy-card border-t border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-end gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Batal
                </button>
                <button onClick={handleSaveItem} className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity">
                  <Check className="w-4 h-4" />
                  Simpan Berita
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

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Users, Briefcase, Link2, Plus, Pencil, Trash2, ExternalLink, Save, X,
  CheckCircle2, Layers, CalendarDays,
} from "lucide-react";

type ExperienceType = "organisasi" | "professional" | "project";

interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  url: string;
  createdAt: string;
}

const TYPE_META: Record<
  ExperienceType,
  {
    label: string;
    icon: React.ElementType;
    titleLabel: string;
    titlePlaceholder: string;
    roleLabel: string;
    rolePlaceholder: string;
    urlLabel: string;
    chip: string;
    iconWrap: string;
  }
> = {
  organisasi: {
    label: "Organisasi",
    icon: Users,
    titleLabel: "Nama Organisasi",
    titlePlaceholder: "Contoh: BEM Fakultas Hukum UI",
    roleLabel: "Jabatan / Peran",
    rolePlaceholder: "Contoh: Kepala Departemen Kajian Strategis",
    urlLabel: "Link Bukti / Dokumentasi (opsional)",
    chip: "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    iconWrap: "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
  },
  professional: {
    label: "Professional",
    icon: Briefcase,
    titleLabel: "Perusahaan / Instansi",
    titlePlaceholder: "Contoh: PT Kebijakan Nusantara",
    roleLabel: "Posisi / Jabatan",
    rolePlaceholder: "Contoh: Magang Riset Kebijakan",
    urlLabel: "Link Bukti / Referensi (opsional)",
    chip: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    iconWrap: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
  },
  project: {
    label: "Project / Link",
    icon: Link2,
    titleLabel: "Nama Project",
    titlePlaceholder: "Contoh: Kajian RUU Perlindungan Data Pribadi",
    roleLabel: "Peran Anda (opsional)",
    rolePlaceholder: "Contoh: Penulis Utama",
    urlLabel: "Link Project / Portofolio",
    chip: "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800",
    iconWrap: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
  },
};

const emptyForm = (type: ExperienceType = "organisasi") => ({
  id: "" as string,
  type,
  title: "",
  role: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  url: "",
});

const inputCls =
  "w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500";
const labelCls = "block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1";

function formatMonth(v: string) {
  if (!v) return "";
  const [y, m] = v.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

function period(e: Experience) {
  const start = formatMonth(e.startDate);
  const end = e.isCurrent ? "Sekarang" : formatMonth(e.endDate);
  if (!start && !end) return "";
  return `${start || "?"} – ${end || "?"}`;
}

export default function UserPengalamanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ExperienceType>("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/user/experiences", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/user/login");
        return;
      }
      const data = await res.json();
      setItems(data.experiences || []);
    } catch {
      setError("Gagal memuat data pengalaman.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const meta = TYPE_META[form.type];
  const editing = Boolean(form.id);

  const visible = useMemo(
    () =>
      items
        .filter((i) => filter === "all" || i.type === filter)
        .sort((a, b) => (b.isCurrent ? "9999-99" : b.endDate || b.startDate || "").localeCompare(a.isCurrent ? "9999-99" : a.endDate || a.startDate || "")),
    [items, filter]
  );

  const counts = useMemo(
    () => ({
      organisasi: items.filter((i) => i.type === "organisasi").length,
      professional: items.filter((i) => i.type === "professional").length,
      project: items.filter((i) => i.type === "project").length,
    }),
    [items]
  );

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const reset = () => {
    setForm(emptyForm(form.type));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/user/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: form.id || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan.");
        return;
      }
      setItems(data.experiences || []);
      flash(editing ? "Perubahan berhasil disimpan!" : "Pengalaman berhasil ditambahkan!");
      setForm(emptyForm(form.type));
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Experience) => {
    setForm({
      id: item.id,
      type: item.type,
      title: item.title,
      role: item.role,
      startDate: item.startDate,
      endDate: item.endDate,
      isCurrent: item.isCurrent,
      description: item.description,
      url: item.url,
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: Experience) => {
    if (!window.confirm(`Hapus "${item.title}" dari daftar pengalaman?`)) return;
    const res = await fetch(`/api/user/experiences?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (res.ok) {
      const data = await res.json();
      setItems(data.experiences || []);
      if (form.id === item.id) setForm(emptyForm(form.type));
      flash("Pengalaman dihapus.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-500 font-sans">
        <p className="text-sm font-bold">Memuat Pengalaman & Portofolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/user/dashboard"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 px-4 py-2.5 rounded-full shadow-xs hover:bg-amber-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Pengalaman & Portofolio</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Satu tempat untuk pengalaman organisasi, pengalaman professional, dan link project Anda.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {(Object.keys(TYPE_META) as ExperienceType[]).map((t) => {
              const Icon = TYPE_META[t].icon;
              return (
                <div key={t} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 sm:p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_META[t].iconWrap}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{counts[t]}</p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate mt-1">{TYPE_META[t].label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                {editing ? "Ubah Pengalaman" : "Tambah Pengalaman"}
              </h2>
              {editing && (
                <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
                  <X className="w-3.5 h-3.5" /> Batal ubah
                </button>
              )}
            </div>

            <div>
              <label className={labelCls}>Jenis</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                {(Object.keys(TYPE_META) as ExperienceType[]).map((t) => {
                  const Icon = TYPE_META[t].icon;
                  const active = form.type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      id={`pengalaman-jenis-${t}`}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-black transition-all ${
                        active
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {TYPE_META[t].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={labelCls}>{meta.titleLabel} <span className="text-red-500">*</span></label>
              <input
                id="pengalaman-judul"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={meta.titlePlaceholder}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>{meta.roleLabel}</label>
              <input
                id="pengalaman-peran"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder={meta.rolePlaceholder}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Mulai</label>
                <input
                  type="month"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Selesai</label>
                <input
                  type="month"
                  disabled={form.isCurrent}
                  min={form.startDate || undefined}
                  value={form.isCurrent ? "" : form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none -mt-1">
              <input
                type="checkbox"
                checked={form.isCurrent}
                onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
              Masih berjalan sampai sekarang
            </label>

            <div>
              <label className={labelCls}>
                {meta.urlLabel} {form.type === "project" && <span className="text-red-500">*</span>}
              </label>
              <input
                id="pengalaman-link"
                required={form.type === "project"}
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Deskripsi Singkat</label>
              <textarea
                id="pengalaman-deskripsi"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Apa yang Anda kerjakan dan capai?"
                className={inputCls}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs font-bold text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              id="pengalaman-simpan"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-md hover:shadow-lg disabled:opacity-60 transition-all"
            >
              {editing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambahkan"}
            </button>
          </form>

          {/* LIST */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto w-fit max-w-full">
              {([
                { v: "all", label: `Semua (${items.length})` },
                { v: "organisasi", label: `Organisasi (${counts.organisasi})` },
                { v: "professional", label: `Professional (${counts.professional})` },
                { v: "project", label: `Project (${counts.project})` },
              ] as const).map((f) => (
                <button
                  key={f.v}
                  onClick={() => setFilter(f.v)}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    filter === f.v
                      ? "bg-amber-400 text-slate-950 shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-black text-slate-700 dark:text-slate-300">Belum ada data</p>
                <p className="text-xs text-slate-500">Isi formulir di samping untuk menambahkan pengalaman pertama Anda.</p>
              </div>
            ) : (
              visible.map((item) => {
                const m = TYPE_META[item.type];
                const Icon = m.icon;
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${m.iconWrap}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.title}</h3>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${m.chip}`}>{m.label}</span>
                        </div>
                        {item.role && <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.role}</p>}
                        {period(item) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold inline-flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> {period(item)}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{item.description}</p>
                        )}
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-400 hover:underline break-all"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" /> {item.url.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          aria-label="Ubah"
                          title="Ubah"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          aria-label="Hapus"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Plus, Pencil, Trash2, Users, Globe2, Search, X, MapPin, Clock,
  CheckCircle2, UserCheck, Save,
} from "lucide-react";
import {
  PageHeader, SectionCard, EmptyState, ModalWrapper, Badge, Field, Input, Textarea, Select,
} from "@/components/admin/ui";
import { Dialog } from "@/components/admin/DialogSystem";

type Scope = "all" | "selected";
type Category = "wawancara" | "seleksi" | "pengumuman" | "kegiatan" | "deadline" | "lainnya";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: Category;
  scope: Scope;
  userIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Peserta {
  id: string;
  name: string;
  email: string;
  university: string;
}

const CATEGORY_META: Record<Category, { label: string; variant: "emerald" | "gold" | "blue" | "red" | "purple" | "default" }> = {
  wawancara: { label: "Wawancara", variant: "purple" },
  seleksi: { label: "Seleksi", variant: "blue" },
  pengumuman: { label: "Pengumuman", variant: "gold" },
  kegiatan: { label: "Kegiatan", variant: "emerald" },
  deadline: { label: "Deadline", variant: "red" },
  lainnya: { label: "Lainnya", variant: "default" },
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const emptyForm = (): Omit<CalendarEvent, "id" | "createdAt" | "updatedAt"> & { id?: string } => ({
  title: "",
  date: todayKey(),
  time: "",
  location: "",
  description: "",
  category: "kegiatan",
  scope: "all",
  userIds: [],
});

function formatDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

export default function AdminKalenderPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users, setUsers] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** "ALL" = semua agenda, "GLOBAL" = hanya agenda untuk semua peserta, otherwise a user id */
  const [viewFilter, setViewFilter] = useState<string>("ALL");
  const [showPast, setShowPast] = useState(false);

  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const [evRes, usRes] = await Promise.all([
        fetch("/api/admin/kalender", { cache: "no-store" }),
        fetch("/api/admin/peserta", { cache: "no-store" }),
      ]);
      if (!evRes.ok) throw new Error("Gagal memuat agenda kalender.");
      const ev = await evRes.json();
      const us = await usRes.json().catch(() => ({ users: [] }));
      setEvents(ev.events || []);
      setUsers(us.users || []);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const visible = useMemo(() => {
    const today = todayKey();
    return events
      .filter((e) => {
        if (viewFilter === "ALL") return true;
        if (viewFilter === "GLOBAL") return e.scope === "all";
        return e.scope === "all" || e.userIds.includes(viewFilter);
      })
      .filter((e) => showPast || e.date >= today)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [events, viewFilter, showPast]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return users.filter(
      (u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.university || "").toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const openCreate = () => {
    // When filtering by one participant, pre-target the new agenda to them.
    const base = emptyForm();
    if (viewFilter !== "ALL" && viewFilter !== "GLOBAL") {
      base.scope = "selected";
      base.userIds = [viewFilter];
    }
    setForm(base);
    setFormError(null);
    setUserSearch("");
  };

  const openEdit = (e: CalendarEvent) => {
    setForm({ ...e });
    setFormError(null);
    setUserSearch("");
  };

  const toggleUser = (id: string) => {
    setForm((f) => {
      if (!f) return f;
      const has = f.userIds.includes(id);
      return { ...f, userIds: has ? f.userIds.filter((u) => u !== id) : [...f.userIds, id] };
    });
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin/kalender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan agenda.");
        return;
      }
      setEvents(data.events || []);
      setForm(null);
    } catch {
      setFormError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: CalendarEvent) => {
    const ok = await Dialog.confirm(`Hapus agenda "${e.title}"? Agenda akan hilang dari kalender peserta.`);
    if (!ok) return;
    const res = await fetch(`/api/admin/kalender?id=${encodeURIComponent(e.id)}`, { method: "DELETE" });
    if (res.ok) {
      const data = await res.json();
      setEvents(data.events || []);
    }
  };

  const globalCount = events.filter((e) => e.scope === "all").length;
  const selectedCount = events.length - globalCount;

  if (loading) {
    return <div className="flex items-center justify-center py-32 text-slate-500 text-sm">Memuat pengaturan kalender...</div>;
  }

  return (
    <div className="space-y-6 max-w-full pb-16">
      <PageHeader
        icon={CalendarDays}
        title="Kalender Peserta"
        subtitle="Atur agenda yang tampil di Kalender Magang pada dashboard peserta. Agenda bisa ditampilkan untuk semua peserta, atau hanya untuk peserta tertentu yang punya akun."
      />

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs font-bold text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Agenda", value: events.length, icon: CalendarDays, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Untuk Semua Peserta", value: globalCount, icon: Globe2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Untuk Peserta Tertentu", value: selectedCount, icon: UserCheck, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{s.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <SectionCard
        icon={CalendarDays}
        title="Daftar Agenda"
        description="Pilih peserta pada filter untuk melihat kalender persis seperti yang mereka lihat."
        badge={<Badge variant="blue">{visible.length} agenda</Badge>}
      >
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="sm:w-80">
              <Select id="kalender-view-filter" value={viewFilter} onChange={(e) => setViewFilter(e.target.value)}>
                <option value="ALL">Semua agenda</option>
                <option value="GLOBAL">Hanya agenda untuk semua peserta</option>
                {users.length > 0 && (
                  <optgroup label="Kalender per peserta">
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                    ))}
                  </optgroup>
                )}
              </Select>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              Tampilkan agenda yang sudah lewat
            </label>
          </div>
          <button
            id="kalender-tambah-agenda"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Agenda
          </button>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Belum ada agenda"
            description="Klik 'Tambah Agenda' untuk menambahkan agenda ke kalender peserta."
          />
        ) : (
          <div className="space-y-3">
            {visible.map((ev) => {
              const cat = CATEGORY_META[ev.category] || CATEGORY_META.lainnya;
              const targets = ev.userIds.map((id) => userMap.get(id)?.name || "Akun dihapus");
              return (
                <div key={ev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-blue-400/30 transition-all">
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-start justify-between">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ev.title}</h4>
                        <Badge variant={cat.variant} size="sm">{cat.label}</Badge>
                        {ev.scope === "all" ? (
                          <Badge variant="emerald" size="sm"><Globe2 className="w-2.5 h-2.5" /> Semua peserta</Badge>
                        ) : (
                          <Badge variant="gold" size="sm"><Users className="w-2.5 h-2.5" /> {ev.userIds.length} peserta</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {formatDate(ev.date)}</span>
                        {ev.time && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time} WIB</span>}
                        {ev.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.location}</span>}
                      </div>
                      {ev.description && <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ev.description}</p>}
                      {ev.scope === "selected" && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-bold">Peserta:</span> {targets.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(ev)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Ubah
                      </button>
                      <button
                        onClick={() => handleDelete(ev)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-950/50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Create / edit modal */}
      {form && (
        <ModalWrapper>
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-dpr-navy rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {form.id ? "Ubah Agenda" : "Tambah Agenda"}
                </h2>
              </div>
              <button onClick={() => setForm(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Tutup">
                <X className="w-5 h-5" />
              </button>
            </div>

            <Field label="Judul Agenda" required showBadge={false}>
              <Input id="kalender-judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Contoh: Wawancara Daring (Zoom)" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Tanggal" required showBadge={false}>
                <Input id="kalender-tanggal" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </Field>
              <Field label="Jam (opsional)" showBadge={false}>
                <Input id="kalender-jam" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </Field>
              <Field label="Kategori" showBadge={false}>
                <Select id="kalender-kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
                  {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
                    <option key={c} value={c}>{CATEGORY_META[c].label}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Lokasi / Link (opsional)" showBadge={false}>
              <Input id="kalender-lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Contoh: Zoom / Gedung Nusantara I" />
            </Field>

            <Field label="Keterangan (opsional)" showBadge={false}>
              <Textarea id="kalender-keterangan" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detail agenda yang akan dibaca peserta" />
            </Field>

            {/* Scope */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Tampilkan agenda untuk</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { v: "all", title: "Semua Peserta", desc: "Semua akun peserta melihat agenda ini, termasuk yang mendaftar kemudian.", icon: Globe2 },
                  { v: "selected", title: "Peserta Tertentu", desc: "Hanya akun yang Anda pilih di bawah.", icon: UserCheck },
                ] as const).map((o) => {
                  const Icon = o.icon;
                  const active = form.scope === o.v;
                  return (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setForm({ ...form, scope: o.v })}
                      className={`text-left p-4 rounded-2xl border transition-all flex gap-3 ${
                        active
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500/40"
                          : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 hover:border-blue-400/40"
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                      <span>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white">{o.title}</span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{o.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {form.scope === "selected" && (
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="p-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Cari nama, email, universitas..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold shrink-0">
                      <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={() => setForm({ ...form, userIds: Array.from(new Set([...form.userIds, ...filteredUsers.map((u) => u.id)])) })}>
                        Pilih semua{userSearch ? " hasil" : ""}
                      </button>
                      <span className="text-slate-300">|</span>
                      <button type="button" className="text-slate-500 hover:underline" onClick={() => setForm({ ...form, userIds: [] })}>
                        Kosongkan
                      </button>
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                    {filteredUsers.length === 0 ? (
                      <p className="p-4 text-xs text-slate-400 text-center">
                        {users.length === 0 ? "Belum ada peserta yang mendaftar akun." : "Tidak ada peserta yang cocok."}
                      </p>
                    ) : (
                      filteredUsers.map((u) => {
                        const checked = form.userIds.includes(u.id);
                        return (
                          <label key={u.id} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                            <input type="checkbox" checked={checked} onChange={() => toggleUser(u.id)} className="w-4 h-4 accent-blue-600" />
                            <span className="min-w-0">
                              <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</span>
                              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">{u.email}{u.university ? ` • ${u.university}` : ""}</span>
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {form.userIds.length} peserta dipilih
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs font-bold text-red-700 dark:text-red-300">
                {formError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setForm(null)} className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
                Batal
              </button>
              <button
                id="kalender-simpan"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white shadow-sm transition-colors"
              >
                {saving ? <CheckCircle2 className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
                {saving ? "Menyimpan..." : "Simpan Agenda"}
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

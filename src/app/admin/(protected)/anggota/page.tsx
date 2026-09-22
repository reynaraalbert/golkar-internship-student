"use client";

import React, { useState } from "react";
import {
  Users, Plus, Pencil, Trash2, X, Check, MapPin, Award,
} from "lucide-react";
import { useCollection } from "@/lib/admin-collection";
import { PageHeader, Field, Grid, Input, Textarea, Select, EmptyState, SaveBar, ModalWrapper } from "@/components/admin/ui";
import type { Member } from "@/lib/data";
import FileUpload from "@/components/ui/FileUpload";
import { motion, AnimatePresence } from "framer-motion";

import { apiPut } from "@/lib/admin-client";

const ROLES = ["Ketua Komisi", "Wakil Ketua Komisi", "Anggota Komisi"] as const;
const FRAKSI = ["PDI Perjuangan", "Partai Golkar", "Partai Gerindra", "Partai NasDem", "PKB", "PKS", "PAN", "Partai Demokrat"] as const;

const emptyMember = (): Member => ({
  id: `m-${Date.now()}`,
  nomorAnggota: "A-000",
  name: "",
  role: "Anggota Komisi",
  fraksi: "Partai Golkar",
  dapil: "",
  photoUrl: "",
  email: "",
  bio: "",
  billsLed: [],
  pendidikan: "",
  masaJabatan: "2024 – 2029",
  komisi: "Komisi XIII",
});

const EMPTY_MEMBER_LIST: Member[] = [];

export default function AdminAnggotaPage() {
  const { data, setData, save, saving, saved } = useCollection<Member[]>("anggota", EMPTY_MEMBER_LIST);
  const [editing, setEditing] = useState<Member | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setIsNew(true);
    setEditing(emptyMember());
  };
  const openEdit = (m: Member) => {
    setIsNew(false);
    setEditing({ ...m, billsLed: [...m.billsLed] });
  };

  const persist = async (updated: Member[]) => {
    setData(updated);
    // Pimpinan is a role-filtered subset of the same member table.
    // Route both through the CRUD hook so any DB failure surfaces as UI.
    const pimpinanList = updated.filter((m) => m.role !== "Anggota Komisi");
    try {
      await apiPut("/api/data/pimpinan", pimpinanList);
    } catch (err: any) {
      alert(`Gagal menyimpan ke database: ${err?.message || "Pastikan server berjalan."}`);
    }
  };

  const handleSaveItem = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      alert("Nama anggota wajib diisi.");
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
    if (!confirm("Hapus anggota ini?")) return;
    persist(data.filter((m) => m.id !== id));
  };

  const updateBill = (idx: number, val: string) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const bills = [...prev.billsLed];
      bills[idx] = val;
      return { ...prev, billsLed: bills };
    });
  };
  const addBill = () => setEditing((prev) => (prev ? { ...prev, billsLed: [...prev.billsLed, ""] } : prev));
  const removeBill = (idx: number) => setEditing((prev) => (prev ? { ...prev, billsLed: prev.billsLed.filter((_, i) => i !== idx) } : prev));

  const pimpinanCount = data.filter((m) => m.role !== "Anggota Komisi").length;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <PageHeader
          icon={Users}
          title="Kelola Anggota"
          subtitle={`Kelola data pimpinan & anggota Komisi XIII. Saat ini ${pimpinanCount} pimpinan dan ${data.length - pimpinanCount} anggota.`}
        />
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-full shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* Pimpinan */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-dpr-emerald dark:text-dpr-gold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          Pimpinan Komisi
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.filter((m) => m.role !== "Anggota Komisi").map((m) => (
            <AnggotaCard key={m.id} m={m} onEdit={() => openEdit(m)} onDelete={() => handleDelete(m.id)} />
          ))}
        </div>
      </div>

      {/* Anggota biasa */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-dpr-emerald dark:text-dpr-gold uppercase tracking-wider">
          <Users className="w-4 h-4" />
          Anggota Komisi
        </div>
        {data.filter((m) => m.role === "Anggota Komisi").length === 0 ? (
          <EmptyState icon={Users} title="Belum Ada Anggota" description="Klik 'Tambah Anggota' untuk menambahkan data anggota." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.filter((m) => m.role === "Anggota Komisi").map((m) => (
              <AnggotaCard key={m.id} m={m} onEdit={() => openEdit(m)} onDelete={() => handleDelete(m.id)} />
            ))}
          </div>
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
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{isNew ? "Tambah Anggota Baru" : "Edit Anggota"}</h3>
                <button onClick={() => setEditing(null)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <Grid cols={2}>
                  <Field label="Nama Lengkap" required>
                    <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full" />
                  </Field>
                  <Field label="Nomor Anggota">
                    <Input value={editing.nomorAnggota} onChange={(e) => setEditing({ ...editing, nomorAnggota: e.target.value })} className="w-full" placeholder="Contoh: A-001" />
                  </Field>
                </Grid>
                <Grid cols={2}>
                  <Field label="Jabatan / Role">
                    <Select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as Member["role"] })} className="w-full">
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </Select>
                  </Field>
                  <Field label="Fraksi">
                    <Select value={editing.fraksi} onChange={(e) => setEditing({ ...editing, fraksi: e.target.value as Member["fraksi"] })} className="w-full">
                      {FRAKSI.map((f) => <option key={f} value={f}>{f}</option>)}
                    </Select>
                  </Field>
                </Grid>
                <Field label="Daerah Pemilihan (Dapil)">
                  <Input value={editing.dapil} onChange={(e) => setEditing({ ...editing, dapil: e.target.value })} className="w-full" placeholder="Contoh: Jawa Barat IV" />
                </Field>
                <Grid cols={2}>
                  <Field label="Upload Foto">
                    <FileUpload value={editing.photoUrl} onChange={(url) => setEditing({ ...editing, photoUrl: url })} accept="image" />
                  </Field>
                  <Field label="Email">
                    <Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="w-full" />
                  </Field>
                </Grid>
                <Grid cols={2}>
                  <Field label="Pendidikan">
                    <Input value={editing.pendidikan || ""} onChange={(e) => setEditing({ ...editing, pendidikan: e.target.value })} className="w-full" />
                  </Field>
                  <Field label="Masa Jabatan">
                    <Input value={editing.masaJabatan || ""} onChange={(e) => setEditing({ ...editing, masaJabatan: e.target.value })} className="w-full" />
                  </Field>
                </Grid>
                <Field label="Biografi">
                  <Textarea value={editing.bio} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={4} />
                </Field>

                {/* billsLed */}
                <Field label="RUU / Agenda yang Dikawal">
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-end">
                      <button onClick={addBill} className="text-xs font-semibold text-dpr-emerald dark:text-dpr-gold hover:underline">
                        + Tambah
                      </button>
                    </div>
                    {editing.billsLed.map((bill, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input value={bill} onChange={(e) => updateBill(idx, e.target.value)} className="flex-1" placeholder="Nama RUU / agenda" />
                        <button onClick={() => removeBill(idx)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-dpr-navy-card border-t border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-end gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  Batal
                </button>
                <button onClick={handleSaveItem} className="inline-flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity">
                  <Check className="w-4 h-4" />
                  Simpan Anggota
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

function AnggotaCard({ m, onEdit, onDelete }: { m: Member; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-3">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 shrink-0">
        {m.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600"><Users className="w-5 h-5" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${m.role !== "Anggota Komisi" ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
          {m.role}
        </span>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">{m.name || "(Tanpa Nama)"}</h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {m.dapil}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

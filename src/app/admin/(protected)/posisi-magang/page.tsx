"use client";

import React, { useState } from "react";
import {
  Briefcase, Plus, Trash2, ChevronDown, ChevronUp, Save, CheckCircle2
} from "lucide-react";
import { PageHeader, SectionCard, Field, Input, Textarea, SaveBar } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { FadeCard, StaggerList } from "@/components/ui/AnimationWrapper";
import { KomisiPosisi, DEFAULT_POSISI } from "@/lib/defaults";

function CollapsiblePosisi({ posisi, index, onChange, onDelete }: {
  posisi: KomisiPosisi;
  index: number;
  onChange: (patch: Partial<KomisiPosisi>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const statusColors: Record<string, string> = {
    TERBUKA: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    DITUTUP: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    PENUH: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 w-5 shrink-0">{index + 1}.</span>
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{posisi.namaKomisi}</span>
            <span className="ml-2 text-[10px] font-mono text-slate-400">[{posisi.kodeKomisi}]</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${statusColors[posisi.status]}`}>
            {posisi.status}
          </span>
          <span className="text-[10px] text-slate-400">Kuota: {posisi.kuota}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-red-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {open && (
        <div className="px-4 py-5 space-y-4 bg-white dark:bg-slate-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Nama Komisi / Badan">
              <Input value={posisi.namaKomisi} onChange={(e) => onChange({ namaKomisi: e.target.value })} className="w-full" />
            </Field>
            <Field label="Kode">
              <Input value={posisi.kodeKomisi} onChange={(e) => onChange({ kodeKomisi: e.target.value })} className="w-full" />
            </Field>
            <Field label="Kuota Peserta">
              <Input value={posisi.kuota} onChange={(e) => onChange({ kuota: e.target.value })} className="w-full" type="number" />
            </Field>
          </div>

          <Field label="Status Pendaftaran">
            <select
              value={posisi.status}
              onChange={(e) => onChange({ status: e.target.value as KomisiPosisi["status"] })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="TERBUKA">TERBUKA</option>
              <option value="DITUTUP">DITUTUP</option>
              <option value="PENUH">PENUH</option>
            </select>
          </Field>

          <Field label="Bidang Kerja (yang dinaungi komisi ini)">
            <Input value={posisi.bidangKerja} onChange={(e) => onChange({ bidangKerja: e.target.value })} className="w-full" placeholder="Pertahanan, Intelijen, Luar Negeri..." />
          </Field>

          <Field label="Departemen / Pihak Terkait (pisahkan dengan koma)">
            <Input value={posisi.mitraKerja} onChange={(e) => onChange({ mitraKerja: e.target.value })} className="w-full" placeholder="Kemenhan, BIN, Kemenlu..." />
          </Field>

          <Field label="Deskripsi Tugas Magang">
            <Textarea value={posisi.deskripsiTugas} onChange={(e) => onChange({ deskripsiTugas: e.target.value })} rows={2} />
          </Field>

          <Field label="Persyaratan (pisahkan dengan koma)">
            <Textarea value={posisi.persyaratan} onChange={(e) => onChange({ persyaratan: e.target.value })} rows={2} placeholder="Ilmu Hukum, IPK min 3.00, CV ATS-Friendly..." />
          </Field>

          {/* Preview mitra & bidang */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs">
            <p className="font-bold text-amber-700 dark:text-amber-400 mb-1">Preview Bidang & Mitra:</p>
            <p className="text-slate-600 dark:text-slate-400"><span className="font-bold">Bidang:</span> {posisi.bidangKerja}</p>
            <p className="text-slate-600 dark:text-slate-400 mt-1"><span className="font-bold">Mitra:</span> {posisi.mitraKerja}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPosisiMagangPage() {
  const { data: posisiList, setData: setPosisiList, save, saving, saved, loaded } = useCollection<KomisiPosisi[]>("posisi_magang", DEFAULT_POSISI);

  const updatePosisi = (i: number, patch: Partial<KomisiPosisi>) =>
    setPosisiList((prev) => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));

  const deletePosisi = (i: number) =>
    setPosisiList((prev) => prev.filter((_, idx) => idx !== i));

  const addPosisi = () =>
    setPosisiList((prev) => [...prev, {
      id: Date.now().toString(),
      namaKomisi: "Komisi Baru",
      kodeKomisi: "K??",
      kuota: "5",
      status: "TERBUKA",
      deskripsiTugas: "",
      bidangKerja: "",
      mitraKerja: "",
      persyaratan: "",
    }]);

  const terbuka = (posisiList as KomisiPosisi[]).filter(p => p.status === "TERBUKA").length;
  const totalKuota = (posisiList as KomisiPosisi[]).reduce((sum, p) => sum + (parseInt(p.kuota) || 0), 0);

  if (!loaded) {
    return <div className="flex items-center justify-center py-24 text-slate-500 text-sm">Memuat data posisi magang...</div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <FadeCard index={1} hover={false}>
        <PageHeader
          icon={Briefcase}
          title="Kelola Posisi Magang per Komisi"
          subtitle="Atur kuota, status pembukaan, departemen terkait, bidang kerja, dan persyaratan untuk setiap divisi."
        />
      </FadeCard>

      {/* Summary Stats */}
      <StaggerList className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Komisi/Badan", value: (posisiList as KomisiPosisi[]).length },
          { label: "Pendaftaran Terbuka", value: terbuka },
          { label: "Total Kuota Peserta", value: totalKuota },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 text-center shadow-sm">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</h3>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </StaggerList>

      <FadeCard index={2} hover={false}>
        <SectionCard
          icon={Briefcase}
          title="Daftar Posisi Magang per Komisi"
          description="Klik salah satu divisi untuk edit detail, departemen terkait, bidang yang dinaungi, dan persyaratan. Perubahan ini akan otomatis tercermin di halaman Posisi Magang peserta (/user/posisi)."
        >
          <div className="space-y-2">
            {(posisiList as KomisiPosisi[]).map((posisi, i) => (
              <CollapsiblePosisi
                key={posisi.id}
                posisi={posisi}
                index={i}
                onChange={(patch) => updatePosisi(i, patch)}
                onDelete={() => deletePosisi(i)}
              />
            ))}
          </div>

          <button
            onClick={addPosisi}
            className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Plus className="w-4 h-4" /> Tambah Komisi / Badan Baru
          </button>

          <SaveBar saving={saving} saved={saved} onSave={save} />
        </SectionCard>
      </FadeCard>
    </div>
  );
}

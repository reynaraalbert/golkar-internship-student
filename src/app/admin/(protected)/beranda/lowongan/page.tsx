"use client";
import React from "react";
import { Briefcase, Info, ArrowRight } from "lucide-react";
import { SectionCard, Field, Input, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";
import Link from "next/link";

export default function AdminBerandaLowonganPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, lowongan: { ...(p.lowongan || {}), ...patch } }));

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={Briefcase} title="Lowongan Magang" subtitle="Kelola teks header untuk bagian Lowongan Magang." />
      
      <SectionCard icon={Briefcase} title="Header Section Lowongan Magang" description="Teks header bagian Lowongan Magang.">
        <Field label="Judul Utama"><Input value={data.lowongan?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.lowongan?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
      </SectionCard>

      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
          <Info className="w-5 h-5" />
          <h3 className="font-bold">Edit Daftar Posisi Lowongan Magang</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Untuk menambah, mengubah, atau menghapus daftar lowongan magang (Divisi / Komisi) beserta deskripsi kompetensinya, silakan menuju menu <b>Posisi Magang per Komisi</b>.
        </p>
        <Link href="/admin/posisi-magang" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition-colors">
          Pergi ke Pengaturan Posisi Magang <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

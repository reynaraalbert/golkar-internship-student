"use client";
import React, { useState } from "react";
import { List, Plus, Trash2 } from "lucide-react";
import { SectionCard, Field, Input, Textarea, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";
import { StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

export default function AdminBerandaTahapanPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, tahapan: { ...(p.tahapan || {}), ...patch } }));
  const items = data.tahapanItems || EMPTY_SITECONTENT.tahapanItems || [];
  
  const getBaseItems = (p: any) => p.tahapanItems || EMPTY_SITECONTENT.tahapanItems || [];

  const addItem = () => setData(p => ({ ...p, tahapanItems: [...getBaseItems(p), { step: "01", title: "", subtitle: "", desc: "", iconName: "FileText" }] }));
  const updateItem = (idx: number, patch: any) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems[idx] = { ...newItems[idx], ...patch };
    return { ...p, tahapanItems: newItems };
  });
  const removeItem = (idx: number) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems.splice(idx, 1);
    return { ...p, tahapanItems: newItems };
  });

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={List} title="Tahapan Seleksi" subtitle="Kelola teks header dan urutan tahapan seleksi magang." />
      
      <SectionCard icon={List} title="Header Section" description="Teks header bagian Tahapan Seleksi.">
        <Field label="Judul Utama"><Input value={data.tahapan?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.tahapan?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
      </SectionCard>

      <SectionCard icon={List} title="Daftar Tahapan Seleksi" description="Urutan proses dari pendaftaran hingga pengumuman lulus.">
        <div className="space-y-4">
          
            {items.map((item: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">Tahapan #{i + 1}</span>
                  <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nomor Urut (Misal: 01)"><Input value={item.step} onChange={e => updateItem(i, { step: e.target.value })} className="w-full" /></Field>
                  <Field label="Nama Icon (Lucide)"><Input value={item.iconName || ''} onChange={e => updateItem(i, { iconName: e.target.value })} className="w-full" placeholder="UserPlus, FileCheck..." /></Field>
                </div>
                <Field label="Judul Tahapan"><Input value={item.title} onChange={e => updateItem(i, { title: e.target.value })} className="w-full" /></Field>
                <Field label="Sub Judul (Tanggal / Keterangan)"><Input value={item.subtitle} onChange={e => updateItem(i, { subtitle: e.target.value })} className="w-full" /></Field>
                <Field label="Deskripsi Detail"><Textarea value={item.desc} onChange={e => updateItem(i, { desc: e.target.value })} rows={2} /></Field>
              </div>
            ))}
          
          <button onClick={addItem} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-amber-500 hover:border-amber-500 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
            <Plus className="w-4 h-4" /> Tambah Tahapan
          </button>
        </div>
      </SectionCard>
      
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

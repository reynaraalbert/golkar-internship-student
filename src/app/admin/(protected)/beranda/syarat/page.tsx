"use client";
import React, { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { SectionCard, Field, Input, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";
import { StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

export default function AdminBerandaSyaratPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, syarat: { ...(p.syarat || {}), ...patch } }));
  const items = data.syaratItems || EMPTY_SITECONTENT.syaratItems || [];
  
  const getBaseItems = (p: any) => p.syaratItems || EMPTY_SITECONTENT.syaratItems || [];

  const addItem = () => setData(p => ({ ...p, syaratItems: [...getBaseItems(p), "Syarat baru..."] }));
  const updateItem = (idx: number, val: string) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems[idx] = val;
    return { ...p, syaratItems: newItems };
  });
  const removeItem = (idx: number) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems.splice(idx, 1);
    return { ...p, syaratItems: newItems };
  });

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={FileText} title="Syarat & Berkas Administrasi" subtitle="Kelola teks header dan daftar checklist syarat administrasi." />
      
      <SectionCard icon={FileText} title="Header Section" description="Teks header bagian Syarat & Berkas Administrasi.">
        <Field label="Judul Utama"><Input value={data.syarat?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.syarat?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
      </SectionCard>

      <SectionCard icon={FileText} title="Checklist Syarat Administrasi" description="Daftar kualifikasi dan berkas yang dibutuhkan untuk mendaftar.">
        <div className="space-y-4">
          
            {items.map((item: string, i: number) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-6 shrink-0 text-right">{i + 1}.</span>
                <Input value={item} onChange={e => updateItem(i, e.target.value)} className="flex-1" />
                <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          
          <button onClick={addItem} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-amber-500 hover:border-amber-500 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
            <Plus className="w-4 h-4" /> Tambah Syarat / Berkas
          </button>
        </div>
      </SectionCard>
      
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

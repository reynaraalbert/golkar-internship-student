"use client";
import React, { useState } from "react";
import { Target, Plus, Trash2 } from "lucide-react";
import { SectionCard, Field, Input, Textarea, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";
import { StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

export default function AdminBerandaKeunggulanPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, keunggulan: { ...(p.keunggulan || {}), ...patch } }));
  const items = data.keunggulanItems || EMPTY_SITECONTENT.keunggulanItems || [];
  const getBaseItems = (p: any) => p.keunggulanItems || EMPTY_SITECONTENT.keunggulanItems || [];

  const addItem = () => setData(p => ({ ...p, keunggulanItems: [...getBaseItems(p), { title: "", desc: "", iconName: "Users" }] }));
  const updateItem = (idx: number, patch: any) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems[idx] = { ...newItems[idx], ...patch };
    return { ...p, keunggulanItems: newItems };
  });
  const removeItem = (idx: number) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems.splice(idx, 1);
    return { ...p, keunggulanItems: newItems };
  });

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={Target} title="Keunggulan Magang" subtitle="Kelola teks header dan isi (poin-poin) keunggulan magang." />
      
      <SectionCard icon={Target} title="Header Section" description="Teks header bagian Keunggulan Magang.">
        <Field label="Judul Utama"><Input value={data.keunggulan?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.keunggulan?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
      </SectionCard>

      <SectionCard icon={Target} title="Poin Keunggulan" description="Daftar poin keunggulan yang tampil dalam bentuk kartu (maks 4 disarankan).">
        <div className="space-y-4">
          
            {items.map((item: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">Poin #{i + 1}</span>
                  <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
                <Field label="Judul Poin"><Input value={item.title} onChange={e => updateItem(i, { title: e.target.value })} className="w-full" /></Field>
                <Field label="Deskripsi"><Textarea value={item.desc} onChange={e => updateItem(i, { desc: e.target.value })} rows={2} /></Field>
                <Field label="Nama Icon (Lucide)"><Input value={item.iconName || ''} onChange={e => updateItem(i, { iconName: e.target.value })} className="w-full" placeholder="Users, Award, Gavel, Globe..." /></Field>
              </div>
            ))}
          
          <button onClick={addItem} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-amber-500 hover:border-amber-500 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
            <Plus className="w-4 h-4" /> Tambah Poin Keunggulan
          </button>
        </div>
      </SectionCard>
      
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

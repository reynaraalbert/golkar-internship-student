"use client";
import React, { useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { SectionCard, Field, Input, Textarea, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";
import { StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

export default function AdminBerandaAlumniPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, alumni: { ...(p.alumni || {}), ...patch } }));
  const items = data.alumniItems || EMPTY_SITECONTENT.alumniItems || [];
  
  const getBaseItems = (p: any) => p.alumniItems || EMPTY_SITECONTENT.alumniItems || [];

  const addItem = () => setData(p => ({ ...p, alumniItems: [...getBaseItems(p), { name: "", univ: "", major: "", role: "", quote: "", photo: "" }] }));
  const updateItem = (idx: number, patch: any) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems[idx] = { ...newItems[idx], ...patch };
    return { ...p, alumniItems: newItems };
  });
  const removeItem = (idx: number) => setData(p => {
    const newItems = [...getBaseItems(p)];
    newItems.splice(idx, 1);
    return { ...p, alumniItems: newItems };
  });

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={MessageSquare} title="Kata Alumni (Testimoni)" subtitle="Kelola teks header dan profil testimoni alumni magang." />
      
      <SectionCard icon={MessageSquare} title="Header Section" description="Teks header bagian Testimoni Alumni.">
        <Field label="Judul Utama"><Input value={data.alumni?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.alumni?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
      </SectionCard>

      <SectionCard icon={MessageSquare} title="Daftar Testimoni" description="Profil alumni dan kutipan testimoni mereka (maks 3 disarankan).">
        <div className="space-y-4">
          
            {items.map((item: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold">Testimoni #{i + 1}</span>
                  <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nama Lengkap"><Input value={item.name} onChange={e => updateItem(i, { name: e.target.value })} className="w-full" /></Field>
                  <Field label="Nama Universitas"><Input value={item.univ} onChange={e => updateItem(i, { univ: e.target.value })} className="w-full" /></Field>
                  <Field label="Jurusan & Angkatan"><Input value={item.major} onChange={e => updateItem(i, { major: e.target.value })} className="w-full" placeholder="Ilmu Politik '21" /></Field>
                  <Field label="Posisi Magang Alumni"><Input value={item.role} onChange={e => updateItem(i, { role: e.target.value })} className="w-full" placeholder="Alumni Magang Komisi I DPR RI" /></Field>
                </div>
                <Field label="Foto Profil">
                  <div className="flex items-center gap-4">
                    {item.photo && (
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        <img src={item.photo} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateItem(i, { photo: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-900/30 dark:file:text-amber-400"
                    />
                  </div>
                </Field>
                <Field label="Kutipan Testimoni"><Textarea value={item.quote} onChange={e => updateItem(i, { quote: e.target.value })} rows={2} /></Field>
              </div>
            ))}
          
          <button onClick={addItem} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-amber-500 hover:border-amber-500 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
            <Plus className="w-4 h-4" /> Tambah Testimoni
          </button>
        </div>
      </SectionCard>
      
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

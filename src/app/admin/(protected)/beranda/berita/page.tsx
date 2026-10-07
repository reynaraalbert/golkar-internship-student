"use client";
import React from "react";
import { Newspaper, Pin, Check } from "lucide-react";
import { SectionCard, Field, Input, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";
import { StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

export default function AdminBerandaBeritaPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  
  // Also load the Berita collection so we can pin/unpin them right from here
  const beritaCollection = useCollection<any[]>("berita", []);
  
  if (!loaded || !beritaCollection.loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, berita: { ...(p.berita || {}), ...patch } }));
  
  const togglePin = (idx: number, isPinned: boolean) => {
    beritaCollection.setData(prev => {
      const newBerita = [...prev];
      newBerita[idx] = { ...newBerita[idx], pinned: !isPinned };
      return newBerita;
    });
  };

  const handleSaveAll = async () => {
    await save();
    await beritaCollection.save();
  };

  const isSavingAll = saving || beritaCollection.saving;
  const isSavedAll = saved && beritaCollection.saved;

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={Newspaper} title="Berita & Siaran Pers" subtitle="Kelola teks header dan pilih maksimal 6 berita untuk di-pin di beranda." />
      
      <SectionCard icon={Newspaper} title="Header Section Berita" description="Teks header bagian Berita & Siaran Pers.">
        <Field label="Judul Utama"><Input value={data.berita?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.berita?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
      </SectionCard>

      <SectionCard icon={Pin} title="Pilih Berita & Siaran Pers (Pin)" description="Berita yang di-pin akan tampil di section Beranda (Maksimal 6 berita terbaru yang di-pin akan ditampilkan).">
        <div className="space-y-3">
          
            {beritaCollection.data.map((b: any, i: number) => {
              const pinnedCount = beritaCollection.data.filter((x: any) => x.pinned).length;
              const isPinned = b.pinned;
              const disablePin = !isPinned && pinnedCount >= 6;
              return (
                <div key={b.id || i} className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${isPinned ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"}`}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden relative">
                       {b.imageUrl && <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{b.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{b.category} • {b.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => togglePin(i, isPinned)}
                    disabled={disablePin}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isPinned 
                        ? "bg-amber-400 text-slate-950 hover:bg-amber-500" 
                        : disablePin 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600" 
                          : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {isPinned ? <><Check className="w-3.5 h-3.5" /> Ter-pin</> : <><Pin className="w-3.5 h-3.5" /> Pin Berita</>}
                  </button>
                </div>
              );
            })}
          
          {beritaCollection.data.length === 0 && (
            <div className="text-center p-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Belum ada berita yang tersedia. Tambahkan berita di menu Kelola Berita Publik.
            </div>
          )}
        </div>
      </SectionCard>
      
      <SaveBar saving={isSavingAll} saved={isSavedAll} onSave={handleSaveAll} />
    </div>
  );
}

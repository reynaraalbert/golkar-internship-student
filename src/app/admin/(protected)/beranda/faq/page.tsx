"use client";
import React from "react";
import { HelpCircle, Info } from "lucide-react";
import { SectionCard, Field, Input, SaveBar, PageHeader, Grid } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaFaqPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, faq: { ...(p.faq || {}), ...patch } }));

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={HelpCircle} title="Edit Header FAQ" subtitle="Ubah judul dan subjudul section FAQ di beranda." />
      <SectionCard icon={HelpCircle} title="Header Section FAQ" description="Teks header bagian FAQ.">
        <Field label="Judul Utama"><Input value={data.faq?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.faq?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
        
      </SectionCard>
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

"use client";
import React from "react";
import { Megaphone, Info } from "lucide-react";
import { SectionCard, Field, Input, SaveBar, PageHeader, Grid } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaCtaPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, cta: { ...(p.cta || {}), ...patch } }));

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={Megaphone} title="Edit Header CTA (Siap Bergabung)" subtitle="Ubah judul dan subjudul section Call to Action." />
      <SectionCard icon={Megaphone} title="Header Section CTA (Siap Bergabung)" description="Teks header bagian CTA (Siap Bergabung).">
        <Field label="Judul Utama"><Input value={data.cta?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.cta?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
        
        <Grid cols={2}>
          <Field label='Teks Tombol'><Input value={data.cta?.buttonText || ''} onChange={e => update({ buttonText: e.target.value })} className='w-full' /></Field>
          <Field label='Link Tujuan'><Input value={data.cta?.buttonLink || ''} onChange={e => update({ buttonLink: e.target.value })} className='w-full' /></Field>
        </Grid>
      </SectionCard>
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

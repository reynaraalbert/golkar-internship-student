"use client";
import React from "react";
import { Radio, Info } from "lucide-react";
import { SectionCard, Field, Input, SaveBar, PageHeader, Grid } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaMedsosPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) return <div className="flex items-center justify-center py-24">Memuat...</div>;

  const update = (patch: Record<string, string>) => setData(p => ({ ...p, medsos: { ...(p.medsos || {}), ...patch } }));

  return (
    <div className="space-y-8 pb-24">
      <PageHeader icon={Radio} title="Edit Header Media Sosial" subtitle="Ubah judul dan subjudul section link media sosial." />
      <SectionCard icon={Radio} title="Header Section Media Sosial" description="Teks header bagian Media Sosial.">
        <Field label="Judul Utama"><Input value={data.medsos?.title || ''} onChange={e => update({ title: e.target.value })} className="w-full" /></Field>
        <Field label="Sub Judul"><Input value={data.medsos?.subtitle || ''} onChange={e => update({ subtitle: e.target.value })} className="w-full" /></Field>
        
        <Grid cols={2}>
          <Field label='Link Instagram'><Input value={data.medsos?.instagram || ''} onChange={e => update({ instagram: e.target.value })} className='w-full' /></Field>
          <Field label='Link Twitter'><Input value={data.medsos?.twitter || ''} onChange={e => update({ twitter: e.target.value })} className='w-full' /></Field>
          <Field label='Link YouTube'><Input value={data.medsos?.youtube || ''} onChange={e => update({ youtube: e.target.value })} className='w-full' /></Field>
          <Field label='Link Facebook'><Input value={data.medsos?.facebook || ''} onChange={e => update({ facebook: e.target.value })} className='w-full' /></Field>
        </Grid>
      </SectionCard>
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

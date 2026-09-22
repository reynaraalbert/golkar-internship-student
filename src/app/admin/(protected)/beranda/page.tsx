"use client";

import React from "react";
import { Layout } from "lucide-react";
import { SectionCard, Grid, Field, Input, Textarea, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaHeroPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat konten hero beranda...
      </div>
    );
  }

  const hero = data.hero;

  const update = (patch: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...patch },
    }));
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Layout}
        title="Edit Section Hero (Banner Utama)"
        subtitle="Ubah judul utama, sub-judul, deskripsi hero, tombol CTA, serta kutipan statuta yang tampil di bagian atas halaman beranda."
      />

      {/* HERO */}
      <div className="space-y-6">
        <SectionCard
          icon={Layout}
          title="Banner Utama (Hero Section)"
          description="Konten utama pada bagian paling atas halaman beranda."
        >
          <Field label="Badge Pemanis Header (Pill Badge)">
            <Input value={hero.badge} onChange={(e) => update({ badge: e.target.value })} className="w-full" />
          </Field>
          <Field label="Judul Utama (Title 1)">
            <Textarea value={hero.title1} onChange={(e) => update({ title1: e.target.value })} rows={2} />
          </Field>
          <Grid cols={2}>
            <Field label="Judul Kedua (Title 2)">
              <Input value={hero.title2} onChange={(e) => update({ title2: e.target.value })} className="w-full" />
            </Field>
            <Field label="Sub Judul (Subtitle)">
              <Input value={hero.subtitle} onChange={(e) => update({ subtitle: e.target.value })} className="w-full" />
            </Field>
          </Grid>
          <Field label="Deskripsi Hero">
            <Textarea value={hero.description} onChange={(e) => update({ description: e.target.value })} rows={3} />
          </Field>
          <Grid cols={4}>
            <Field label="Label CTA 1">
              <Input value={hero.ctaPrimaryLabel} onChange={(e) => update({ ctaPrimaryLabel: e.target.value })} className="w-full" />
            </Field>
            <Field label="Link CTA 1">
              <Input value={hero.ctaPrimaryHref} onChange={(e) => update({ ctaPrimaryHref: e.target.value })} className="w-full" />
            </Field>
            <Field label="Label CTA 2">
              <Input value={hero.ctaSecondaryLabel} onChange={(e) => update({ ctaSecondaryLabel: e.target.value })} className="w-full" />
            </Field>
            <Field label="Link CTA 2">
              <Input value={hero.ctaSecondaryHref} onChange={(e) => update({ ctaSecondaryHref: e.target.value })} className="w-full" />
            </Field>
          </Grid>
          <Grid cols={2}>
            <Field label="Label Progress Statuta">
              <Input value={hero.statuteProgressLabel} onChange={(e) => update({ statuteProgressLabel: e.target.value })} className="w-full" />
            </Field>
            <Field label="Nilai Progress Statuta">
              <Input value={hero.statuteProgressValue} onChange={(e) => update({ statuteProgressValue: e.target.value })} className="w-full" />
            </Field>
          </Grid>
          <Field label="Kutipan Statuta (Quote)">
            <Textarea value={hero.statuteQuote} onChange={(e) => update({ statuteQuote: e.target.value })} rows={2} />
          </Field>
        </SectionCard>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

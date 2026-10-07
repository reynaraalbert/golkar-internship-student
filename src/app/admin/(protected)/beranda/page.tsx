"use client";

import React from "react";
import { Layout, Home } from "lucide-react";
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
  const navbarLink = data.navbarLink || { label: "GOLKAR", url: "https://fraksigolkar.com/" };

  const update = (patch: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...patch },
    }));
  };

  const updateNavbarLink = (patch: Partial<typeof navbarLink>) => {
    setData((prev) => ({ ...prev, navbarLink: { ...prev.navbarLink!, ...patch } }));
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
        </SectionCard>

        <SectionCard icon={Home} title="Link Eksternal Navbar" description="Link khusus (biasanya GOLKAR) yang terletak di ujung kanan navigasi website.">
          <Grid cols={2}>
            <Field label="Teks Menu Navbar">
              <Input value={navbarLink.label} onChange={(e) => updateNavbarLink({ label: e.target.value })} className="w-full" />
            </Field>
            <Field label="URL Link Eksternal">
              <Input value={navbarLink.url} onChange={(e) => updateNavbarLink({ url: e.target.value })} className="w-full" />
            </Field>
          </Grid>
        </SectionCard>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

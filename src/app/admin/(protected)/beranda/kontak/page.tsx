"use client";

import React from "react";
import { Share2, MapPin } from "lucide-react";
import { SectionCard, Grid, Field, Input, Textarea, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaKontakPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat konten kontak & lokasi beranda...
      </div>
    );
  }

  const kontak = data.kontak;
  const maps = data.maps;

  const updateKontak = (patch: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      kontak: { ...prev.kontak, ...patch },
    }));
  };

  const updateMaps = (patch: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      maps: { ...prev.maps, ...patch },
    }));
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Share2}
        title="Edit Section Lokasi, Kontak & Media Sosial"
        subtitle="Atur jam operasional layanan, email resmi, tautan media sosial, serta embed Google Maps pada halaman beranda."
      />

      {/* KONTAK / MEDIA SOSIAL */}
      <div className="space-y-6">
        <SectionCard
          icon={Share2}
          title="Layanan & Akun Media Sosial Resmi"
          description="Informasi jam kerja layanan publik dan handle akun media sosial resmi Komisi XIII DPR RI."
        >
          <Grid cols={2}>
            <Field label="Judul Layanan Publik">
              <Input value={kontak.serviceTitle} onChange={(e) => updateKontak({ serviceTitle: e.target.value })} className="w-full" />
            </Field>
            <Field label="Jam Operasional Layanan">
              <Input value={kontak.serviceHours} onChange={(e) => updateKontak({ serviceHours: e.target.value })} className="w-full" />
            </Field>
            <Field label="Email Resmi Sekretariat">
              <Input value={kontak.email} onChange={(e) => updateKontak({ email: e.target.value })} className="w-full" />
            </Field>
            <Field label="Judul Block Media Sosial">
              <Input value={kontak.mediaTitle} onChange={(e) => updateKontak({ mediaTitle: e.target.value })} className="w-full" />
            </Field>
            <Field label="Handle Instagram">
              <Input value={kontak.instagramHandle} onChange={(e) => updateKontak({ instagramHandle: e.target.value })} className="w-full" />
            </Field>
            <Field label="Label Channel YouTube">
              <Input value={kontak.youtubeLabel} onChange={(e) => updateKontak({ youtubeLabel: e.target.value })} className="w-full" />
            </Field>
            <Field label="Handle X (Twitter)">
              <Input value={kontak.twitterHandle} onChange={(e) => updateKontak({ twitterHandle: e.target.value })} className="w-full" />
            </Field>
            <Field label="Label Domain Website">
              <Input value={kontak.websiteLabel} onChange={(e) => updateKontak({ websiteLabel: e.target.value })} className="w-full" />
            </Field>
          </Grid>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Banner Aspirasi Rakyat</h4>
            <Grid cols={3}>
              <Field label="Judul Banner">
                <Input value={kontak.aspirasiTitle} onChange={(e) => updateKontak({ aspirasiTitle: e.target.value })} className="w-full" />
              </Field>
              <Field label="Deskripsi Banner">
                <Input value={kontak.aspirasiDesc} onChange={(e) => updateKontak({ aspirasiDesc: e.target.value })} className="w-full" />
              </Field>
              <Field label="Label Tombol CTA">
                <Input value={kontak.aspirasiCta} onChange={(e) => updateKontak({ aspirasiCta: e.target.value })} className="w-full" />
              </Field>
            </Grid>
          </div>
        </SectionCard>

        {/* SECTION MAPS & LOKASI */}
        <SectionCard
          icon={MapPin}
          title="Peta & Alamat Gedung"
          description="Atur link Google Maps yang tampil di halaman beranda (iframe embed & tombol langsung)."
        >
          <Field label="Link Embed Google Maps (iframe src)">
            <Input value={maps.embedUrl} onChange={(e) => updateMaps({ embedUrl: e.target.value })} className="w-full" placeholder="https://maps.google.com/maps?q=...&output=embed" />
          </Field>
          <Field label="Tautan Tombol 'Buka di Maps'">
            <Input value={maps.openUrl} onChange={(e) => updateMaps({ openUrl: e.target.value })} className="w-full" placeholder="https://maps.google.com" />
          </Field>
          <Field label="Deskripsi Pengantar Lokasi">
            <Textarea value={maps.description} onChange={(e) => updateMaps({ description: e.target.value })} rows={2} />
          </Field>
        </SectionCard>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

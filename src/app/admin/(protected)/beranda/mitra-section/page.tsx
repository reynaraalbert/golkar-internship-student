"use client";

import React from "react";
import { Handshake } from "lucide-react";
import { SectionCard, Field, Input, Textarea, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaMitraSectionPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat konten section mitra beranda...
      </div>
    );
  }

  const mitraSection = data.mitraSection;

  const update = (patch: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      mitraSection: { ...prev.mitraSection, ...patch },
    }));
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Handshake}
        title="Edit Section Mitra Kerja Beranda"
        subtitle="Ubah tagline, judul, dan deskripsi pengantar pada bagian Mitra Kerja di halaman beranda."
      />

      <div className="space-y-6">
        <SectionCard
          icon={Handshake}
          title="Teks Header Mitra Kerja"
          description="Informasi pengantar showcase mitra kerja Komisi XIII."
        >
          <Field label="Tagline Header">
            <Input value={mitraSection.tagline} onChange={(e) => update({ tagline: e.target.value })} className="w-full" />
          </Field>
          <Field label="Judul Utama Section">
            <Input value={mitraSection.title} onChange={(e) => update({ title: e.target.value })} className="w-full" />
          </Field>
          <Field label="Deskripsi Section">
            <Textarea value={mitraSection.description} onChange={(e) => update({ description: e.target.value })} rows={3} />
          </Field>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-dpr-navy text-xs text-slate-600 dark:text-slate-300">
            <strong>Catatan:</strong> Untuk menambah, menghapus, atau mengubah data per-kementerian mitra kerja, silakan menuju menu <code className="text-dpr-emerald dark:text-dpr-gold font-bold">Jadwal & Tim → Mitra Kerja</code>.
          </div>
        </SectionCard>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

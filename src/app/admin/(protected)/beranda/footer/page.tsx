"use client";

import React from "react";
import { PanelBottom } from "lucide-react";
import { SectionCard, Grid, Field, Input, Textarea, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaFooterPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat konten footer...
      </div>
    );
  }

  const footer = data.footer;

  const update = (patch: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      footer: { ...prev.footer, ...patch },
    }));
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={PanelBottom}
        title="Edit Section Footer Situs"
        subtitle="Ubah deskripsi brand, alamat gedung, kontak telepon, informasi keterbukaan publik (PPID), dan hak cipta footer."
      />

      <div className="space-y-6">
        <SectionCard
          icon={PanelBottom}
          title="Pengaturan Footer Publik"
          description="Informasi yang ditampilkan di bagian paling bawah pada seluruh halaman situs publik."
        >
          <Field label="Deskripsi Profil Ringkas Footer">
            <Textarea value={footer.brandDescription} onChange={(e) => update({ brandDescription: e.target.value })} rows={2} />
          </Field>
          <Field label="Alamat Sekretariat Lengkap">
            <Input value={footer.address} onChange={(e) => update({ address: e.target.value })} className="w-full" />
          </Field>
          <Grid cols={2}>
            <Field label="Nomor Telepon Sekretariat">
              <Input value={footer.phone} onChange={(e) => update({ phone: e.target.value })} className="w-full" />
            </Field>
            <Field label="Email Resmi Sekretariat">
              <Input value={footer.email} onChange={(e) => update({ email: e.target.value })} className="w-full" />
            </Field>
          </Grid>
          <Field label="Teks Keterbukaan Informasi Publik (UU KIP)">
            <Textarea value={footer.transparencyText} onChange={(e) => update({ transparencyText: e.target.value })} rows={3} />
          </Field>
          <Field label="Informasi Jam Layanan PPID">
            <Input value={footer.ppidText} onChange={(e) => update({ ppidText: e.target.value })} className="w-full" />
          </Field>
          <Field label="Teks Hak Cipta (Copyright)">
            <Input value={footer.copyrightText} onChange={(e) => update({ copyrightText: e.target.value })} className="w-full" />
          </Field>
        </SectionCard>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { SectionCard, Grid, Field, Input, SaveBar, PageHeader } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

export default function AdminBerandaStatistikPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection("siteContent", EMPTY_SITECONTENT);
  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat konten statistik beranda...
      </div>
    );
  }

  const statBar = data.statBar;

  const update = (patch: Record<string, string>) => {
    setData((prev) => ({
      ...prev,
      statBar: { ...prev.statBar, ...patch },
    }));
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={BarChart3}
        title="Edit Section Statistik Beranda"
        subtitle="Atur label teks pada bilah statistik (counter) halaman beranda situs publik Komisi XIII."
      />

      <div className="space-y-6">
        <SectionCard
          icon={BarChart3}
          title="Label Counter Statistik"
          description="Empat label statistik utama yang tampil di bilah counter halaman depan."
        >
          <Grid cols={2}>
            <Field label="Label 1 (Anggota)">
              <Input value={statBar.label1} onChange={(e) => update({ label1: e.target.value })} className="w-full" />
            </Field>
            <Field label="Label 2 (Kementerian/Lembaga)">
              <Input value={statBar.label2} onChange={(e) => update({ label2: e.target.value })} className="w-full" />
            </Field>
            <Field label="Label 3 (Rapat Kemitraan)">
              <Input value={statBar.label3} onChange={(e) => update({ label3: e.target.value })} className="w-full" />
            </Field>
            <Field label="Label 4 (Aspirasi Diproses)">
              <Input value={statBar.label4} onChange={(e) => update({ label4: e.target.value })} className="w-full" />
            </Field>
          </Grid>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-dpr-navy text-xs text-slate-600 dark:text-slate-300">
            <strong>Catatan:</strong> Angka kuantitatif statistik (misal: jumlah anggota 46, rapat 84+) dapat dikelola langsung dari menu <code className="text-dpr-emerald dark:text-dpr-gold font-bold">Dashboard Admin → Angka Statistik</code>.
          </div>
        </SectionCard>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

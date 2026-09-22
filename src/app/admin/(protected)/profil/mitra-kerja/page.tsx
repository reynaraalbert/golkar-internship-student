"use client";

import React from "react";
import { Handshake, Info } from "lucide-react";
import { PageHeader, SectionCard, Field, Input, Textarea, SaveBar } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { PAGES } from "@/lib/pages";
import type { PageContent } from "@/lib/data";

export default function AdminProfilMitraKerjaPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection<PageContent[]>("pages", PAGES);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat data...
      </div>
    );
  }

  const page = data.find((p) => p.slug === "profil/mitra-kerja");
  if (!page) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Halaman mitra kerja tidak ditemukan.
      </div>
    );
  }

  const headerSub = page.sections.find((s) => s.title === "Header Halaman Mitra Kerja")?.subsections[0];

  const updateField = (fieldKey: string, value: string) => {
    if (!headerSub) return;
    setData((prev) =>
      prev.map((p) =>
        p.slug === "profil/mitra-kerja"
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.title === "Header Halaman Mitra Kerja"
                  ? {
                      ...s,
                      subsections: s.subsections.map((sub) =>
                        sub.id === headerSub.id ? { ...sub, fields: { ...sub.fields, [fieldKey]: value } } : sub
                      ),
                    }
                  : s
              ),
            }
          : p
      )
    );
  };

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Handshake}
        title="Kelola Header Mitra Kerja"
        subtitle="Edit teks header halaman /profil/mitra-kerja. Untuk mengelola data lembaga mitra, gunakan menu Mitra Kerja."
      />

      {headerSub && (
        <SectionCard
          icon={Handshake}
          title="Header Halaman Mitra Kerja (/profil/mitra-kerja)"
          description="Badge, judul, dan deskripsi yang tampil di bagian atas halaman mitra kerja."
        >
          <Field label="Teks Badge">
            <Input
              value={headerSub.fields.badge || ""}
              onChange={(e) => updateField("badge", e.target.value)}
              className="w-full"
            />
          </Field>
          <Field label="Judul Halaman">
            <Input
              value={headerSub.fields.judul || ""}
              onChange={(e) => updateField("judul", e.target.value)}
              className="w-full"
            />
          </Field>
          <Field label="Deskripsi">
            <Textarea
              value={headerSub.fields.deskripsi || ""}
              onChange={(e) => updateField("deskripsi", e.target.value)}
              rows={3}
            />
          </Field>
        </SectionCard>
      )}

      <SectionCard
        icon={Info}
        title="Kelola Data Lembaga Mitra Kerja"
        description="Data per-lembaga mitra dikelola secara terpisah."
      >
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300 space-y-2">
          <p className="font-bold">Untuk mengedit data per-lembaga mitra kerja:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Nama Lembaga, Logo, Deskripsi, Fokus Area → menu <strong>Jadwal & Tim → Mitra Kerja</strong></li>
            <li>Penambahan / penghapusan lembaga juga dilakukan di menu tersebut.</li>
          </ul>
        </div>
      </SectionCard>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

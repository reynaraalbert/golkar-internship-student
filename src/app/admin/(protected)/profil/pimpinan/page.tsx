"use client";

import React from "react";
import { Users, Info } from "lucide-react";
import { PageHeader, SectionCard, Field, Input, Textarea, SaveBar } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { PAGES } from "@/lib/pages";
import type { PageContent } from "@/lib/data";

export default function AdminProfilPimpinanPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection<PageContent[]>("pages", PAGES);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat data...
      </div>
    );
  }

  const page = data.find((p) => p.slug === "profil/pimpinan");
  if (!page) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Halaman pimpinan tidak ditemukan.
      </div>
    );
  }

  const headerSub = page.sections.find((s) => s.title === "Header Halaman Pimpinan")?.subsections[0];

  const updateField = (fieldKey: string, value: string) => {
    if (!headerSub) return;
    setData((prev) =>
      prev.map((p) =>
        p.slug === "profil/pimpinan"
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.title === "Header Halaman Pimpinan"
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
        icon={Users}
        title="Kelola Header Pimpinan & Anggota"
        subtitle="Edit teks header halaman /profil/pimpinan. Untuk mengelola data anggota dan pimpinan, gunakan menu Anggota Komisi."
      />

      {headerSub && (
        <SectionCard
          icon={Users}
          title="Header Halaman Pimpinan (/profil/pimpinan)"
          description="Badge, judul, dan deskripsi pengantar halaman Pimpinan & Anggota."
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
        title="Kelola Data Pimpinan & Anggota"
        description="Data Pimpinan dan Anggota Komisi dikelola secara terpisah."
      >
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <p className="font-bold">Untuk mengedit data Pimpinan & Anggota:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Nama, Foto, Bio, Dapil, Email, Fraksi → menu <strong>Jadwal & Tim → Anggota Komisi</strong></li>
            <li>Pimpinan Komisi diidentifikasi oleh role <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Ketua Komisi</code> / <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Wakil Ketua Komisi</code></li>
          </ul>
        </div>
      </SectionCard>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

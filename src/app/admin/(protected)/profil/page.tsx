"use client";

import React from "react";
import { Shield, BookOpen, Target, Users, Handshake, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader, SectionCard, Field, Input, Textarea, SaveBar } from "@/components/admin/ui";
import { useCollection } from "@/lib/admin-collection";
import { PAGES } from "@/lib/pages";
import type { PageContent } from "@/lib/data";

export default function AdminProfilPage() {
  const { data, setData, save, saving, saved, loaded } = useCollection<PageContent[]>("pages", PAGES);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Memuat konten profil...
      </div>
    );
  }

  const page = data.find((p) => p.slug === "profil");
  if (!page) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400 text-sm">
        Halaman profil tidak ditemukan. Silakan reset data.
      </div>
    );
  }

  const updateField = (sectionTitle: string, subId: string, fieldKey: string, value: string) => {
    setData((prev) =>
      prev.map((p) =>
        p.slug === "profil"
          ? {
              ...p,
              sections: p.sections.map((s) =>
                s.title === sectionTitle
                  ? {
                      ...s,
                      subsections: s.subsections.map((sub) =>
                        sub.id === subId ? { ...sub, fields: { ...sub.fields, [fieldKey]: value } } : sub
                      ),
                    }
                  : s
              ),
            }
          : p
      )
    );
  };

  const getSub = (sectionTitle: string, subId?: string) => {
    const sec = page.sections.find((s) => s.title === sectionTitle);
    if (!sec) return { id: "", fields: {} as Record<string, string> };
    const sub = subId ? sec.subsections.find((s) => s.id === subId) : sec.subsections[0];
    return sub || { id: "", fields: {} as Record<string, string> };
  };

  const headerSub = getSub("Header Halaman Profil");
  const sejarahSub = getSub("Sejarah Komisi");
  const visiSub = getSub("Visi & Misi", "profil-visi-misi-utama");
  const pilarSub = getSub("Visi & Misi", "profil-visi-misi-pilar");

  const quickLinks = [
    { label: "Edit Sejarah Lengkap (Timeline & Milestones)", href: "/admin/profil/sejarah", icon: BookOpen },
    { label: "Edit Visi & Misi Lengkap (Pilar & Nilai)", href: "/admin/profil/visi-misi", icon: Target },
    { label: "Edit Header Pimpinan & Anggota", href: "/admin/profil/pimpinan", icon: Users },
    { label: "Edit Header Mitra Kerja", href: "/admin/profil/mitra-kerja", icon: Handshake },
  ];

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Shield}
        title="Kelola Profil Komisi XIII"
        subtitle="Edit teks utama halaman profil: header, sejarah ringkas, dan visi utama yang tampil di halaman /profil."
      />

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickLinks.map((ql) => {
          const Icon = ql.icon;
          return (
            <Link
              key={ql.href}
              href={ql.href}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-dpr-emerald/10 dark:bg-dpr-gold/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors">{ql.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold shrink-0 transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* Header Halaman Profil */}
      {headerSub.id && (
        <SectionCard
          icon={Shield}
          title="Header Halaman Profil Utama (/profil)"
          description="Teks badge, judul, dan deskripsi yang tampil di bagian atas halaman profil."
        >
          <Field label="Teks Badge">
            <Input
              value={headerSub.fields.badge || ""}
              onChange={(e) => updateField("Header Halaman Profil", headerSub.id, "badge", e.target.value)}
              className="w-full"
            />
          </Field>
          <Field label="Judul Halaman">
            <Input
              value={headerSub.fields.judul || ""}
              onChange={(e) => updateField("Header Halaman Profil", headerSub.id, "judul", e.target.value)}
              className="w-full"
            />
          </Field>
          <Field label="Deskripsi Header">
            <Textarea
              value={headerSub.fields.deskripsi || ""}
              onChange={(e) => updateField("Header Halaman Profil", headerSub.id, "deskripsi", e.target.value)}
              rows={3}
            />
          </Field>
        </SectionCard>
      )}

      {/* Sejarah Ringkas */}
      {sejarahSub.id && (
        <SectionCard
          icon={BookOpen}
          title="Sejarah Ringkas (tampil di /profil)"
          description="2 paragraf sejarah singkat yang tampil di halaman profil utama."
        >
          <Field label="Paragraf Intro Sejarah">
            <Textarea
              value={sejarahSub.fields.intro || ""}
              onChange={(e) => updateField("Sejarah Komisi", sejarahSub.id, "intro", e.target.value)}
              rows={4}
            />
          </Field>
          <Field label="Paragraf Body Sejarah">
            <Textarea
              value={sejarahSub.fields.body || ""}
              onChange={(e) => updateField("Sejarah Komisi", sejarahSub.id, "body", e.target.value)}
              rows={4}
            />
          </Field>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
            Untuk mengedit konten sejarah lengkap (timeline, milestones, dll), gunakan menu <strong>Sejarah Komisi</strong> di sidebar.
          </div>
        </SectionCard>
      )}

      {/* Visi Ringkas */}
      {visiSub.id && (
        <SectionCard
          icon={Target}
          title="Visi & Ringkasan (tampil di /profil)"
          description="Visi utama dan deskripsi yang muncul di halaman profil."
        >
          <Field label="Teks Visi Utama">
            <Input
              value={visiSub.fields.visi || ""}
              onChange={(e) => updateField("Visi & Misi", visiSub.id, "visi", e.target.value)}
              className="w-full"
            />
          </Field>
          <Field label="Deskripsi Visi">
            <Textarea
              value={visiSub.fields.deskripsi || ""}
              onChange={(e) => updateField("Visi & Misi", visiSub.id, "deskripsi", e.target.value)}
              rows={3}
            />
          </Field>
        </SectionCard>
      )}

      {/* Pilar Misi Ringkas */}
      {pilarSub.id && (
        <SectionCard
          icon={Target}
          title="4 Pilar Misi Ringkas (tampil di /profil)"
          description="Butir-butir misi yang tampil sebagai checklist di halaman profil utama."
        >
          {["pilar1", "pilar2", "pilar3", "pilar4"].map((key, i) => (
            <Field key={key} label={`Pilar Misi ${i + 1}`}>
              <Textarea
                value={pilarSub.fields[key] || ""}
                onChange={(e) => updateField("Visi & Misi", pilarSub.id, key, e.target.value)}
                rows={2}
              />
            </Field>
          ))}
        </SectionCard>
      )}

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

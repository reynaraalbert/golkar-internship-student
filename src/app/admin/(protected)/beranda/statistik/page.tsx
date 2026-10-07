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

  const stats = [
    { valueKey: "value1", labelKey: "label1", defaultValue: "1,500+", defaultLabel: "Alumni Magang", color: "text-amber-600 dark:text-amber-400" },
    { valueKey: "value2", labelKey: "label2", defaultValue: "30+", defaultLabel: "Universitas Partner", color: "text-slate-700 dark:text-slate-200" },
    { valueKey: "value3", labelKey: "label3", defaultValue: "98%", defaultLabel: "Kepuasan Mentorship", color: "text-amber-600 dark:text-amber-400" },
    { valueKey: "value4", labelKey: "label4", defaultValue: "100+", defaultLabel: "Policy Brief Dihasilkan", color: "text-slate-700 dark:text-slate-200" },
  ];

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={BarChart3}
        title="Edit Section Statistik Beranda"
        subtitle="Atur angka dan label pada bilah statistik (counter) halaman beranda situs publik Golkar Internship."
      />

      {/* Preview */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 border border-amber-200 dark:border-white/10">
        <p className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-4">Preview — Tampilan di Halaman User (/)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.valueKey} className="space-y-1">
              <span className={`text-2xl sm:text-3xl font-black block ${s.color}`}>
                {(statBar as any)[s.valueKey] || s.defaultValue}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold block uppercase tracking-wider">
                {(statBar as any)[s.labelKey] || s.defaultLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <SectionCard
          icon={BarChart3}
          title="Counter Statistik — Angka & Label"
          description="Edit angka besar (misal: 1,500+) dan label di bawahnya untuk setiap counter yang tampil di halaman beranda."
        >
          <div className="space-y-5">
            {stats.map((s, i) => (
              <div key={s.valueKey} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Counter {i + 1}</p>
                <Grid cols={2}>
                  <Field label="Angka / Nilai (tampil besar)">
                    <Input
                      value={(statBar as any)[s.valueKey] ?? s.defaultValue}
                      onChange={(e) => update({ [s.valueKey]: e.target.value })}
                      className="w-full"
                      placeholder={s.defaultValue}
                    />
                  </Field>
                  <Field label="Label (tampil di bawah angka)">
                    <Input
                      value={(statBar as any)[s.labelKey] ?? s.defaultLabel}
                      onChange={(e) => update({ [s.labelKey]: e.target.value })}
                      className="w-full"
                      placeholder={s.defaultLabel}
                    />
                  </Field>
                </Grid>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  );
}

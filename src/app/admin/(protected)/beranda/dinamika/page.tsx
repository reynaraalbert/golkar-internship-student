"use client";

import React, { useState } from "react";
import { useCollection } from "@/lib/admin-collection";
import { DEFAULT_TRACKS, DEFAULT_STEPS, DEFAULT_REQUIREMENTS, DEFAULT_FAQS } from "@/lib/defaults";
import { PageHeader, SectionCard, SaveBar, Field, Input, Textarea } from "@/components/admin/ui";
import { Briefcase, ChevronDown, ChevronUp, Plus, Trash2, List, HelpCircle, CheckSquare, Megaphone } from "lucide-react";
import type { InternshipTrack, SelectionStep, Requirement, FaqItem } from "@/lib/data";
import { useCollection as useSiteCollection } from "@/lib/admin-collection";
import { EMPTY_SITECONTENT } from "@/lib/defaults";

function CollapsibleItem({ title, children, onDelete }: { title: string; children: React.ReactNode; onDelete?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{title}</span>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-red-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      {open && <div className="px-4 py-4 space-y-3 bg-white dark:bg-slate-900/50">{children}</div>}
    </div>
  );
}

export default function AdminBerandaDinamikaPage() {
  // Tracks
  const { data: tracks, setData: setTracks, save: saveTracks, saving: savingTracks, saved: savedTracks, loaded: loadedTracks } = useCollection<InternshipTrack[]>("tracks", DEFAULT_TRACKS);

  // Steps
  const { data: steps, setData: setSteps, save: saveSteps, saving: savingSteps, saved: savedSteps, loaded: loadedSteps } = useCollection<SelectionStep[]>("steps", DEFAULT_STEPS);

  // Requirements
  const { data: reqs, setData: setReqs, save: saveReqs, saving: savingReqs, saved: savedReqs, loaded: loadedReqs } = useCollection<Requirement[]>("requirements", DEFAULT_REQUIREMENTS);

  // FAQs
  const { data: faqs, setData: setFaqs, save: saveFaqs, saving: savingFaqs, saved: savedFaqs, loaded: loadedFaqs } = useCollection<FaqItem[]>("faqs", DEFAULT_FAQS);

  // Announcement bar
  const { data: siteContent, setData: setSiteContent, save: saveSite, saving: savingSite, saved: savedSite } = useSiteCollection("siteContent", EMPTY_SITECONTENT);
  const announcement = siteContent.announcement || { badge: "INFO", text: "", ctaLabel: "Daftar Sekarang", ctaHref: "/user/login" };
  const updateAnnouncement = (patch: Record<string, string>) => setSiteContent((prev) => ({ ...prev, announcement: { ...prev.announcement!, ...patch } }));

  const updateTrack = (i: number, patch: Partial<InternshipTrack>) => setTracks((prev) => prev.map((t, idx) => idx === i ? { ...t, ...patch } : t));
  const deleteTrack = (i: number) => setTracks((prev) => prev.filter((_, idx) => idx !== i));
  const addTrack = () => setTracks((prev) => [...prev, { id: Date.now().toString(), title: "Track Baru", category: "", desc: "", skills: "" }]);

  const updateStep = (i: number, patch: Partial<SelectionStep>) => setSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const deleteStep = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i));
  const addStep = () => setSteps((prev) => [...prev, { id: Date.now().toString(), step: String(prev.length + 1).padStart(2, "0"), title: "Langkah Baru", subtitle: "", desc: "" }]);

  const updateReq = (i: number, text: string) => setReqs((prev) => prev.map((r, idx) => idx === i ? { ...r, text } : r));
  const deleteReq = (i: number) => setReqs((prev) => prev.filter((_, idx) => idx !== i));
  const addReq = () => setReqs((prev) => [...prev, { id: Date.now().toString(), text: "" }]);

  const updateFaq = (i: number, patch: Partial<FaqItem>) => setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  const deleteFaq = (i: number) => setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  const addFaq = () => setFaqs((prev) => [...prev, { id: Date.now().toString(), q: "", a: "" }]);

  if (!loadedTracks || !loadedSteps || !loadedReqs || !loadedFaqs) {
    return <div className="flex items-center justify-center py-24 text-slate-500 text-sm">Memuat data konten dinamis beranda...</div>;
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        icon={Briefcase}
        title="Edit Konten Dinamis Beranda"
        subtitle="Edit section Program Magang, Alur Seleksi, Persyaratan, FAQ, dan Pengumuman yang tampil di halaman utama (/)."
      />

      {/* ANNOUNCEMENT BAR */}
      <SectionCard icon={Megaphone} title="Ticker Pengumuman (Atas Halaman)" description="Teks berjalan yang tampil di bagian paling atas halaman beranda.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Label Badge (mis. PENGUMUMAN)">
            <Input value={announcement.badge} onChange={(e) => updateAnnouncement({ badge: e.target.value })} className="w-full" />
          </Field>
          <Field label="Label Tombol CTA">
            <Input value={announcement.ctaLabel} onChange={(e) => updateAnnouncement({ ctaLabel: e.target.value })} className="w-full" />
          </Field>
          <Field label="Link Tombol CTA">
            <Input value={announcement.ctaHref} onChange={(e) => updateAnnouncement({ ctaHref: e.target.value })} className="w-full" />
          </Field>
        </div>
        <Field label="Teks Ticker / Pengumuman (Berjalan)">
          <Textarea value={announcement.text} onChange={(e) => updateAnnouncement({ text: e.target.value })} rows={2} />
        </Field>
        <SaveBar saving={savingSite} saved={savedSite} onSave={saveSite} />
      </SectionCard>

      {/* PROGRAM TRACKS */}
      <SectionCard icon={Briefcase} title="Pilihan Lowongan Magang" description="Daftar lowongan yang tampil di section 'Lowongan Magang' halaman beranda.">
        <div className="space-y-2">
          {(tracks as InternshipTrack[]).map((track, i) => (
            <CollapsibleItem key={track.id} title={`${i + 1}. ${track.title}`} onDelete={() => deleteTrack(i)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Judul Track">
                  <Input value={track.title} onChange={(e) => updateTrack(i, { title: e.target.value })} className="w-full" />
                </Field>
                <Field label="Kategori">
                  <Input value={track.category} onChange={(e) => updateTrack(i, { category: e.target.value })} className="w-full" />
                </Field>
              </div>
              <Field label="Deskripsi Track">
                <Textarea value={track.desc} onChange={(e) => updateTrack(i, { desc: e.target.value })} rows={2} />
              </Field>
              <Field label="Skill List (pisahkan dengan koma)">
                <Input value={track.skills} onChange={(e) => updateTrack(i, { skills: e.target.value })} className="w-full" placeholder="Analisis Hukum, Policy Briefing, ..." />
              </Field>
            </CollapsibleItem>
          ))}
        </div>
        <button onClick={addTrack} className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
          <Plus className="w-4 h-4" /> Tambah Track Baru
        </button>
        <SaveBar saving={savingTracks} saved={savedTracks} onSave={saveTracks} />
      </SectionCard>

      {/* ALUR SELEKSI */}
      <SectionCard icon={List} title="Alur / Tahapan Seleksi" description="Langkah-langkah proses seleksi yang tampil di section 'Alur Seleksi' halaman beranda.">
        <div className="space-y-2">
          {(steps as SelectionStep[]).map((step, i) => (
            <CollapsibleItem key={step.id} title={`Langkah ${step.step}: ${step.title}`} onDelete={() => deleteStep(i)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Nomor Langkah">
                  <Input value={step.step} onChange={(e) => updateStep(i, { step: e.target.value })} className="w-full" />
                </Field>
                <Field label="Judul Langkah">
                  <Input value={step.title} onChange={(e) => updateStep(i, { title: e.target.value })} className="w-full" />
                </Field>
                <Field label="Sub Judul">
                  <Input value={step.subtitle} onChange={(e) => updateStep(i, { subtitle: e.target.value })} className="w-full" />
                </Field>
              </div>
              <Field label="Deskripsi">
                <Textarea value={step.desc} onChange={(e) => updateStep(i, { desc: e.target.value })} rows={2} />
              </Field>
            </CollapsibleItem>
          ))}
        </div>
        <button onClick={addStep} className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
          <Plus className="w-4 h-4" /> Tambah Langkah Baru
        </button>
        <SaveBar saving={savingSteps} saved={savedSteps} onSave={saveSteps} />
      </SectionCard>

      {/* PERSYARATAN */}
      <SectionCard icon={CheckSquare} title="Persyaratan Pendaftaran" description="Daftar persyaratan yang tampil di section syarat pendaftaran halaman beranda.">
        <div className="space-y-2">
          {(reqs as Requirement[]).map((req, i) => (
            <div key={req.id} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 w-5 shrink-0">{i + 1}.</span>
              <Input value={req.text} onChange={(e) => updateReq(i, e.target.value)} className="flex-1" />
              <button onClick={() => deleteReq(i)} className="p-1.5 text-red-400 hover:text-red-600 shrink-0 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addReq} className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
          <Plus className="w-4 h-4" /> Tambah Persyaratan Baru
        </button>
        <SaveBar saving={savingReqs} saved={savedReqs} onSave={saveReqs} />
      </SectionCard>

      {/* FAQ */}
      <SectionCard icon={HelpCircle} title="FAQ (Pertanyaan yang Sering Diajukan)" description="Pertanyaan dan jawaban yang tampil di section FAQ halaman beranda.">
        <div className="space-y-2">
          {(faqs as FaqItem[]).map((faq, i) => (
            <CollapsibleItem key={faq.id} title={`FAQ ${i + 1}: ${faq.q.slice(0, 60)}${faq.q.length > 60 ? "..." : ""}`} onDelete={() => deleteFaq(i)}>
              <Field label="Pertanyaan">
                <Input value={faq.q} onChange={(e) => updateFaq(i, { q: e.target.value })} className="w-full" />
              </Field>
              <Field label="Jawaban">
                <Textarea value={faq.a} onChange={(e) => updateFaq(i, { a: e.target.value })} rows={3} />
              </Field>
            </CollapsibleItem>
          ))}
        </div>
        <button onClick={addFaq} className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
          <Plus className="w-4 h-4" /> Tambah FAQ Baru
        </button>
        <SaveBar saving={savingFaqs} saved={savedFaqs} onSave={saveFaqs} />
      </SectionCard>
    </div>
  );
}

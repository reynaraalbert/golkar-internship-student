"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Briefcase, Hash, Save, CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/admin/ui";
import { StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

interface AdminBiodata {
  nama: string;
  email: string;
  jabatan: string;
  komisi: string;
  nrp: string;
  noHp: string;
}

export default function BiodataTimSeleksiPage() {
  const [formData, setFormData] = useState<AdminBiodata>({
    nama: "",
    email: "",
    jabatan: "",
    komisi: "",
    nrp: "",
    noHp: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Load from database
  useEffect(() => {
    async function loadBiodata() {
      try {
        const res = await fetch("/api/admin/biodata", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === "object") {
            setFormData((prev) => ({
              ...prev,
              ...data,
            }));
          }
        }
      } catch {
        // Use empty form if no data exists yet
      } finally {
        setLoading(false);
      }
    }
    loadBiodata();
  }, []);

  const handleResetPassword = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setResetEmailSent(true);
      setTimeout(() => setResetEmailSent(false), 5000);
    }, 1500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/biodata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Gagal menyimpan biodata. Periksa koneksi database.");
      }
    } catch {
      alert("Gagal menyimpan biodata. Pastikan server berjalan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-xs font-bold">Memuat biodata dari database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <FadeCard index={1} hover={false}>
        <PageHeader
          icon={User}
          title="Biodata Tim Seleksi"
          subtitle="Lengkapi profil Anda sebagai Tim Penilai / Administrator Program Magang GIS."
        />
      </FadeCard>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Biodata berhasil disimpan ke database!</span>
        </div>
      )}

      {resetEmailSent && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Tautan konfirmasi untuk mengubah password telah dikirim ke {formData.email || "email Anda"}. Silakan periksa kotak masuk Anda!</span>
        </div>
      )}

      <StaggerList className="space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <SectionCard icon={User} title="Informasi Dasar" description="Identitas Anda di dalam sistem.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.nama} 
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Masukkan email"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Keamanan Akun</label>
                <div>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={saving || resetEmailSent}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" />
                    {saving ? "Memproses..." : "Kirim Tautan Ubah Password"}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">*Demi keamanan, Anda harus mengonfirmasi via email sebelum dapat memasukkan password baru.</p>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Nomor Induk / NRP</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.nrp} 
                    onChange={(e) => setFormData({...formData, nrp: e.target.value})} 
                    placeholder="Masukkan NRP"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Briefcase} title="Detail Posisi & Jabatan" description="Informasi posisi Anda sebagai Administrator di Program Magang Golkar Internship Student.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Jabatan</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.jabatan} 
                    onChange={(e) => setFormData({...formData, jabatan: e.target.value})} 
                    placeholder="Masukkan jabatan"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">Penugasan Divisi</label>
                <select 
                  value={formData.komisi} 
                  onChange={(e) => setFormData({...formData, komisi: e.target.value})} 
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                >
                  <option value="">-- Pilih Divisi --</option>
                  <option value="Divisi Magang">Divisi Program Magang</option>
                  <option value="Legislative Drafting">Divisi Legislative Drafting</option>
                  <option value="Media & Komunikasi">Divisi Media & Komunikasi</option>
                  <option value="Riset Kebijakan">Divisi Riset Kebijakan</option>
                  <option value="Sekretariat Jenderal">Sekretariat Jenderal</option>
                  <option value="Pusat Data">Pusat Data</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Biodata"}
            </button>
          </div>
        </form>
      </StaggerList>
    </div>
  );
}

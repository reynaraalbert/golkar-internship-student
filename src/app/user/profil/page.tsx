"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Save, Camera, Upload } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tipeInstitusi: "Universitas",
    tipeInstitusiLainnya: "",
    programPendidikan: "S1",
    statusPtnPts: "PTN",
    lokasiKampus: "",
    fakultas: "Fakultas Hukum",
    fakultasLainnya: "",
    university: "",
    major: "",
    phone: "",
    nim: "",
    ipk: "",
    semester: "Semester 5",
    bio: "",
    statusMagang: "Terverifikasi",
    posisiDilamar: "Program Magang Analisis Kebijakan & Riset Legislatif",
  });

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/user/auth/me");
        if (!res.ok) {
          router.push("/user/login");
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            tipeInstitusi: data.user.tipeInstitusi || "Universitas",
            tipeInstitusiLainnya: "",
            programPendidikan: data.user.programPendidikan || "S1",
            statusPtnPts: data.user.statusPtnPts || "PTN",
            lokasiKampus: data.user.lokasiKampus || "",
            fakultas: data.user.fakultas || "Fakultas Hukum",
            fakultasLainnya: "",
            university: data.user.university || "",
            major: data.user.major || "",
            phone: data.user.phone || "",
            nim: data.user.nim || "",
            ipk: data.user.ipk || "",
            semester: data.user.semester || "Semester 5",
            bio: data.user.bio || "",
            statusMagang: data.user.statusMagang || "Terverifikasi",
            posisiDilamar: data.user.posisiDilamar || "Program Magang Analisis Kebijakan & Riset Legislatif",
          });
        }
      } catch {
        router.push("/user/login");
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Profil berhasil disimpan!");
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 600);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-500 font-sans">
        <p className="text-sm font-bold">Memuat Profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/user/dashboard"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 px-4 py-2.5 rounded-full shadow-xs hover:bg-amber-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <span className="text-xs font-black px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-800">
            {formData.statusMagang}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex items-center gap-5 sm:gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-4xl shadow-md overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  formData.name.charAt(0)
                )}
              </div>
              <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-2xl">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">Ubah Foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{formData.name}</h1>
              <p className="text-sm text-slate-500 font-semibold mb-3">{formData.university} • {formData.major}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-900/50">
                <Upload className="w-3.5 h-3.5" />
                Wajib pas foto formal (Latar Kuning)
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Tipe Institusi
                </label>
                <select
                  value={formData.tipeInstitusi}
                  onChange={(e) => setFormData({ ...formData, tipeInstitusi: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Universitas">Universitas</option>
                  <option value="Institut">Institut</option>
                  <option value="Sekolah Tinggi">Sekolah Tinggi</option>
                  <option value="Politeknik">Politeknik</option>
                  <option value="Akademi">Akademi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {formData.tipeInstitusi === "Lainnya" && (
                  <input
                    type="text"
                    placeholder="Sebutkan Tipe Institusi"
                    value={formData.tipeInstitusiLainnya}
                    onChange={(e) => setFormData({ ...formData, tipeInstitusiLainnya: e.target.value })}
                    className="w-full mt-2 px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Program Pendidikan
                </label>
                <select
                  value={formData.programPendidikan}
                  onChange={(e) => setFormData({ ...formData, programPendidikan: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="S1">S1 (Sarjana)</option>
                  <option value="D4">D4 (Sarjana Terapan)</option>
                  <option value="D3">D3 (Diploma III)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Status Kampus
                </label>
                <select
                  value={formData.statusPtnPts}
                  onChange={(e) => setFormData({ ...formData, statusPtnPts: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="PTN">PTN (Negeri)</option>
                  <option value="PTS">PTS (Swasta)</option>
                  <option value="Kedinasan">Kedinasan</option>
                  <option value="Luar Negeri">Luar Negeri</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Nama Perguruan Tinggi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Universitas Indonesia"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Lokasi Kampus (Tulis Sendiri)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pulau Jawa / Jabodetabek / Sumatera"
                  value={formData.lokasiKampus}
                  onChange={(e) => setFormData({ ...formData, lokasiKampus: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Fakultas
                </label>
                <select
                  value={formData.fakultas}
                  onChange={(e) => setFormData({ ...formData, fakultas: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Fakultas Hukum">Fakultas Hukum</option>
                  <option value="Fakultas Ilmu Sosial & Ilmu Politik">Fakultas Ilmu Sosial & Ilmu Politik</option>
                  <option value="Fakultas Ekonomi & Bisnis">Fakultas Ekonomi & Bisnis</option>
                  <option value="Fakultas Teknik">Fakultas Teknik</option>
                  <option value="Fakultas Ilmu Budaya">Fakultas Ilmu Budaya</option>
                  <option value="Fakultas Kedokteran & Kesehatan">Fakultas Kedokteran & Kesehatan</option>
                  <option value="Fakultas MIPA">Fakultas MIPA</option>
                  <option value="Fakultas Pertanian / Kehutanan">Fakultas Pertanian / Kehutanan</option>
                  <option value="Fakultas Ilmu Pendidikan">Fakultas Ilmu Pendidikan</option>
                  <option value="Fakultas Ilmu Komunikasi">Fakultas Ilmu Komunikasi</option>
                  <option value="Fakultas Syariah / Agama">Fakultas Syariah / Agama</option>
                  <option value="Fakultas Ilmu Komputer / IT">Fakultas Ilmu Komputer / IT</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {formData.fakultas === "Lainnya" && (
                  <input
                    type="text"
                    placeholder="Sebutkan Nama Fakultas"
                    value={formData.fakultasLainnya}
                    onChange={(e) => setFormData({ ...formData, fakultasLainnya: e.target.value })}
                    className="w-full mt-2 px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Program Studi (Tulis Sendiri)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Ilmu Hukum / Hubungan Internasional"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  NIM / Nomor Induk (Wajib Angka)
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Semester Saat Ini
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                  <option value="Semester 9">Semester 9</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  IPK Terakhir (Wajib Angka)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.00"
                  placeholder="Contoh: 3.85"
                  value={formData.ipk}
                  onChange={(e) => setFormData({ ...formData, ipk: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Bio Singkat & Motivasi Magang
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan Profil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Save, Camera, Upload, Phone, MapPin, Globe, Linkedin, Github, Instagram, Twitter } from "lucide-react";

const inputCls = "w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500";
const labelCls = "block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1";

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    domisili: "",
    tipeInstitusi: "Universitas",
    tipeInstitusiLainnya: "",
    programPendidikan: "S1",
    statusPtnPts: "PTN",
    lokasiKampus: "",
    fakultas: "Fakultas Hukum",
    fakultasLainnya: "",
    university: "",
    major: "",
    nim: "",
    ipk: "",
    semester: "Semester 5",
    bio: "",
    statusMagang: "Terverifikasi",
    posisiDilamar: "Program Magang Analisis Kebijakan & Riset Legislatif",
  });

  const [socialMedia, setSocialMedia] = useState({
    linkedin: "",
    github: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    website: "",
  });

  const set = (key: string, val: string) => setFormData(f => ({ ...f, [key]: val }));
  const setSocial = (key: string, val: string) => setSocialMedia(s => ({ ...s, [key]: val }));

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/user/auth/me");
        if (!res.ok) { router.push("/user/login"); return; }
        const data = await res.json();
        if (data.authenticated && data.user) {
          const u = data.user;
          setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            whatsapp: u.whatsapp || "",
            domisili: u.domisili || "",
            tipeInstitusi: u.tipeInstitusi || "Universitas",
            tipeInstitusiLainnya: "",
            programPendidikan: u.programPendidikan || "S1",
            statusPtnPts: u.statusPtnPts || "PTN",
            lokasiKampus: u.lokasiKampus || "",
            fakultas: u.fakultas || "Fakultas Hukum",
            fakultasLainnya: "",
            university: u.university || "",
            major: u.major || "",
            nim: u.nim || "",
            ipk: u.ipk || "",
            semester: u.semester || "Semester 5",
            bio: u.bio || "",
            statusMagang: u.statusMagang || "Terverifikasi",
            posisiDilamar: u.posisiDilamar || "Program Magang Analisis Kebijakan & Riset Legislatif",
          });
          if (u.socialMedia) setSocialMedia({ ...{ linkedin:"", github:"", instagram:"", twitter:"", tiktok:"", website:"" }, ...u.socialMedia });
          if (u.photoUrl) setProfilePic(u.photoUrl);
        }
      } catch { router.push("/user/login"); }
      finally { setLoading(false); }
    }
    fetchMe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...formData, socialMedia };
      if (profilePic && profilePic.startsWith("http")) payload.photoUrl = profilePic;
      const res = await fetch("/api/user/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal menyimpan profil");
      setSuccessMsg("Profil berhasil disimpan!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
    } finally { setSaving(false); }
  };

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/aeknpwzs/upload";
  const UPLOAD_PRESET = "golkar_uploads";

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Foto maksimal 2 MB!"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("upload_preset", UPLOAD_PRESET);
      fd.append("file", file);
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Gagal unggah foto");
      setProfilePic(data.secure_url);
      await fetch("/api/user/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: data.secure_url })
      });
      setSuccessMsg("Foto Profil berhasil diunggah & disimpan!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/user/dashboard" className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 px-4 py-2.5 rounded-full shadow-xs hover:bg-amber-500 transition-all">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
          <span className="text-xs font-black px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-800">
            {formData.statusMagang}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          {/* Photo header */}
          <div className="flex items-center gap-5 sm:gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-4xl shadow-md overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : formData.name.charAt(0)}
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
                <Upload className="w-3.5 h-3.5" /> Wajib pas foto formal (Latar Kuning)
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* === INFORMASI DASAR === */}
            <div>
              <h2 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                Informasi Pribadi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nama Lengkap</label>
                  <input type="text" value={formData.name} onChange={e => set("name", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Alamat Email (Tidak Bisa Diubah)</label>
                  <input type="email" disabled value={formData.email} className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className={labelCls}>Nomor WhatsApp (Aktif)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-500 font-black text-xs">WA</span>
                    <input type="tel" placeholder="Contoh: 081234567890" value={formData.phone} onChange={e => set("phone", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">*Nomor yang bisa dihubungi via WhatsApp</p>
                </div>
                <div>
                  <label className={labelCls}>Domisili / Kota Tinggal Saat Ini</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Contoh: Jakarta Selatan / Depok / Bandung" value={formData.domisili} onChange={e => set("domisili", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Bio Singkat & Motivasi Magang</label>
                  <textarea rows={2} value={formData.bio} onChange={e => set("bio", e.target.value)} placeholder="Ceritakan sedikit tentang diri Anda..." className={inputCls} />
                </div>
              </div>
            </div>

            {/* === MEDIA SOSIAL === */}
            <div>
              <h2 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                Media Sosial & Tautan Profil
              </h2>
              <p className="text-xs text-slate-500 mb-4">Isi tautan yang relevan. Akan ditampilkan di CV otomatis Anda.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                    <input type="text" placeholder="Username atau Link Profil" value={socialMedia.linkedin} onChange={e => setSocial("linkedin", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>GitHub</label>
                  <div className="relative">
                    <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 dark:text-slate-300" />
                    <input type="text" placeholder="Username atau Link Profil" value={socialMedia.github} onChange={e => setSocial("github", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Instagram</label>
                  <div className="relative">
                    <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                    <input type="text" placeholder="Username atau Link Profil" value={socialMedia.instagram} onChange={e => setSocial("instagram", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Twitter / X</label>
                  <div className="relative">
                    <Twitter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
                    <input type="text" placeholder="Username atau Link Profil" value={socialMedia.twitter} onChange={e => setSocial("twitter", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>TikTok</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-300 font-black text-[11px]">TK</span>
                    <input type="text" placeholder="Username atau Link Profil" value={socialMedia.tiktok} onChange={e => setSocial("tiktok", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Website / Portofolio Pribadi</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Nama Website atau Link" value={socialMedia.website} onChange={e => setSocial("website", e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* === DATA AKADEMIK === */}
            <div>
              <h2 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                Data Akademik
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Tipe Institusi</label>
                    <select value={formData.tipeInstitusi} onChange={e => set("tipeInstitusi", e.target.value)} className={inputCls}>
                      <option value="Universitas">Universitas</option>
                      <option value="Institut">Institut</option>
                      <option value="Sekolah Tinggi">Sekolah Tinggi</option>
                      <option value="Politeknik">Politeknik</option>
                      <option value="Akademi">Akademi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    {formData.tipeInstitusi === "Lainnya" && (
                      <input type="text" placeholder="Sebutkan Tipe Institusi" value={formData.tipeInstitusiLainnya} onChange={e => set("tipeInstitusiLainnya", e.target.value)} className={`mt-2 ${inputCls}`} />
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Program Pendidikan</label>
                    <select value={formData.programPendidikan} onChange={e => set("programPendidikan", e.target.value)} className={inputCls}>
                      <option value="S1">S1 (Sarjana)</option>
                      <option value="D4">D4 (Sarjana Terapan)</option>
                      <option value="D3">D3 (Diploma III)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Status Kampus</label>
                    <select value={formData.statusPtnPts} onChange={e => set("statusPtnPts", e.target.value)} className={inputCls}>
                      <option value="PTN">PTN (Negeri)</option>
                      <option value="PTS">PTS (Swasta)</option>
                      <option value="Kedinasan">Kedinasan</option>
                      <option value="Luar Negeri">Luar Negeri</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Nama Perguruan Tinggi</label>
                    <input type="text" placeholder="Contoh: Universitas Indonesia" value={formData.university} onChange={e => set("university", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Lokasi Kampus</label>
                    <input type="text" placeholder="Contoh: Pulau Jawa / Jabodetabek" value={formData.lokasiKampus} onChange={e => set("lokasiKampus", e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Fakultas</label>
                    <select value={formData.fakultas} onChange={e => set("fakultas", e.target.value)} className={inputCls}>
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
                      <input type="text" placeholder="Sebutkan Nama Fakultas" value={formData.fakultasLainnya} onChange={e => set("fakultasLainnya", e.target.value)} className={`mt-2 ${inputCls}`} />
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Program Studi (Tulis Sendiri)</label>
                    <input type="text" placeholder="Contoh: Ilmu Hukum / Hubungan Internasional" value={formData.major} onChange={e => set("major", e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>NIM / Nomor Induk</label>
                    <input type="text" value={formData.nim} onChange={e => set("nim", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Semester Saat Ini</label>
                    <select value={formData.semester} onChange={e => set("semester", e.target.value)} className={inputCls}>
                      {["Semester 3","Semester 4","Semester 5","Semester 6","Semester 7","Semester 8","Semester 9"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>IPK Terakhir</label>
                    <input type="number" step="0.01" min="0" max="4.00" placeholder="Contoh: 3.85" value={formData.ipk} onChange={e => set("ipk", e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan Profil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Wrench } from "lucide-react";
import { useCmsContent } from "@/components/CmsProvider";

export default function UserRegisterPage() {
  const router = useRouter();
  const { siteContent } = useCmsContent();
  const isMaintenance = siteContent?.maintenanceMode;
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    major: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat akun");
      }

      router.push("/user/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (isMaintenance) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-6">
        <Wrench className="w-16 h-16 text-amber-500 mb-6 animate-bounce" />
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 text-center">
          Sistem Under Maintenance
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-md text-center mb-8">
          Sistem pendaftaran saat ini sedang dalam perbaikan atau pemeliharaan. Silakan kembali beberapa saat lagi.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 px-6 py-3 rounded-xl transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* LEFT COLUMN: REGISTRATION FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10 overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-extrabold text-xl">
              G
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                GOLKAR INTERNSHIP STUDENT
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                PENDAFTARAN PESERTA MAGANG
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Lengkapi data diri Anda untuk mendaftar program magang Golkar Internship Student.
          </p>

          <Link
            href="/user/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-600/30 dark:border-amber-400/30 hover:bg-amber-500/10 px-4 py-2 rounded-full transition-all mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Sudah Memiliki Akun? Masuk
          </Link>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap (Sesuai KTP/KTM) *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Reynara Albert Pradana"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Perguruan Tinggi *
                </label>
                <input
                  type="text"
                  name="university"
                  required
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="Contoh: Universitas Indonesia"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jurusan / Prodi *
                </label>
                <input
                  type="text"
                  name="major"
                  required
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Contoh: Ilmu Hukum"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email Aktif *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="reynara@email.com"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="081234567890"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ulangi Kata Sandi *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Sama dengan kata sandi"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-amber-600 shadow-md transition-all mt-4 cursor-pointer"
            >
              {loading ? "Mendaftarkan Akun..." : "Daftar Akun Peserta"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: HERO BANNER */}
      <div className="hidden lg:flex w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen flex items-end justify-start p-8 sm:p-16 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-peserta-magang.png"
            alt="DPR RI Gedung Pembinaan"
            className="w-full h-full object-cover object-center brightness-50 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-xl text-white space-y-4">
          <div className="w-16 h-1.5 bg-amber-500 rounded-full mb-4 shadow-sm" />
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-amber-100 drop-shadow-md">
            Daftar & Kembangkan Karir Legislatif Anda.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed drop-shadow-sm">
            Dapatkan pengalaman berharga langsung bersama Sekretariat Jenderal dan Anggota Legislatif Fraksi Partai Golkar DPR RI.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Wrench } from "lucide-react";
import { useCmsContent } from "@/components/CmsProvider";

export default function UserLoginPage() {
  const router = useRouter();
  const { siteContent } = useCmsContent();
  const isMaintenance = siteContent?.maintenanceMode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/user/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk");
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
          Sistem login saat ini sedang dalam perbaikan atau pemeliharaan. Silakan kembali beberapa saat lagi.
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
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 overflow-y-auto lg:overflow-hidden">
      
      {/* MOBILE HERO BANNER (HEADER IMAGE ON MOBILE) */}
      <div className="lg:hidden relative h-40 sm:h-48 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src="/images/hero-peserta-magang.png"
          alt="DPR RI Gedung Pembinaan"
          className="w-full h-full object-cover object-center brightness-60 opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 text-white space-y-1 z-10">
          <div className="w-10 h-1 bg-amber-400 rounded-full mb-1.5" />
          <h2 className="text-lg font-black text-amber-100 leading-tight">
            Golkar Internship Student
          </h2>
          <p className="text-xs text-slate-300 font-normal">
            Portal Resmi Pendaftaran & Pembinaan Magang
          </p>
        </div>
      </div>

      {/* FORM CONTAINER (BALANCED SPACING & VERTICALLY CENTERED ON MOBILE & DESKTOP) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-8 sm:py-12 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10 flex-1 my-auto">
        <div className="max-w-md w-full mx-auto lg:mx-0">

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
            Masuk Akun
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
            Gunakan email dan password terdaftar untuk mengakses portal magang.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-600/30 dark:border-amber-400/30 hover:bg-amber-500/10 px-3.5 py-1.5 rounded-full transition-all mb-4 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-4 pr-11 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Ingat Saya
              </label>
              <a href="#" className="text-amber-700 dark:text-amber-400 hover:underline">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-amber-600 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <span>Memproses...</span> : <span>Masuk Sekarang</span>}
            </button>

            <div className="text-center space-y-1.5 text-xs font-semibold pt-2">
              <p className="text-slate-600 dark:text-slate-400">
                Belum punya akun?{" "}
                <Link href="/user/register" className="text-amber-700 dark:text-amber-400 font-extrabold hover:underline">
                  Daftar Sekarang
                </Link>
              </p>
              <p>
                <Link href="/admin/login" className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Portal Pegawai / Admin CMS
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: HERO BANNER (DESKTOP) */}
      <div className="hidden lg:flex w-full lg:w-1/2 relative h-full items-end justify-start p-8 sm:p-16 overflow-hidden bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-peserta-magang.png"
            alt="DPR RI Gedung Pembinaan"
            className="w-full h-full object-cover object-center brightness-50 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-xl text-white space-y-4">
          <div className="w-16 h-1.5 bg-amber-500 rounded-full mb-4 shadow-sm" />
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-amber-100 drop-shadow-md">
            Membangun Kompetensi Untuk Negeri.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed drop-shadow-sm">
            Jadilah bagian dari perjalanan legislatif Indonesia melalui program magang yang berintegritas, profesional, dan berdampak nyata bagi bangsa.
          </p>
        </div>
      </div>
    </div>
  );
}

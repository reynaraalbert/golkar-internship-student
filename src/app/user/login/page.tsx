"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("reynara@ui.ac.id");
  const [password, setPassword] = useState("peserta123");
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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      {/* LEFT COLUMN: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10 overflow-y-auto">
        <div>
          {/* Header Branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-extrabold text-xl shadow-sm">
              G
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                GOLKAR INTERNSHIP STUDENT
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                SETJEN & FRAKSI GOLKAR DPR RI
              </span>
            </div>
          </div>

          {/* Badge Portal Peserta */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-700 text-white tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> PORTAL PESERTA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Masuk Akun
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Silakan gunakan email dan password terdaftar Anda untuk mengakses portal magang.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-600/30 dark:border-amber-400/30 hover:bg-amber-500/10 px-4 py-2 rounded-full transition-all mb-8 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-4 pr-11 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all shadow-xs"
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
              className="w-full py-3.5 px-6 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-amber-600 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                </>
              )}
            </button>

            <div className="pt-4 text-center space-y-2 text-xs font-semibold">
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

        {/* Demo Credentials Box */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-md">
          <p className="font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Akun Pengujian Pengunjung (Default Demo):
          </p>
          <div className="bg-amber-500/10 dark:bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20 font-mono text-[11px] text-slate-700 dark:text-slate-300">
            Email: reynara@ui.ac.id <br />
            Password: peserta123
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: HERO BANNER (Presisi Foto 1) */}
      <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen flex items-end justify-start p-8 sm:p-16 overflow-hidden bg-slate-900">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1600&auto=format&fit=crop&q=80"
            alt="DPR RI Gedung Pembinaan"
            className="w-full h-full object-cover object-center filter grayscale brightness-50 opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay" />
        </div>

        {/* Content Card Overlay */}
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

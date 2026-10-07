"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Briefcase, Mail
} from "lucide-react";
import { motion } from "framer-motion";

export default function TimSeleksiRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    jabatan: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Simulate API registration request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // In a real app, this would save to DB with status: 'PENDING'
      // The Admin CMS would then approve it
    }, 1500);
  }

  const inputClass =
    "w-full bg-slate-50 dark:bg-dpr-navy-card text-sm text-slate-900 dark:text-white placeholder-slate-400 pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none focus:ring-1 focus:ring-dpr-emerald dark:focus:ring-dpr-gold transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-hero-gradient-light dark:bg-hero-gradient relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dpr-emerald/15 dark:bg-dpr-red/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 bg-white/90 dark:bg-slate-900/90">
          {/* Brand */}
          <div className="text-center space-y-3">
            <img
              src="/images/logo-dpr.svg"
              alt="Logo DPR RI"
              className="w-20 h-20 mx-auto object-contain drop-shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Daftar Tim Seleksi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Registrasi Akun Tim Seleksi / Interviewer Golkar Internship
              </p>
            </div>
          </div>

          {/* Success State */}
          {success ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pendaftaran Berhasil!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Akun Anda sedang dalam status <span className="font-bold text-amber-500">Menunggu Verifikasi</span> oleh Administrator. Anda baru dapat login setelah akun di-approve.
                </p>
              </div>
              <Link href="/admin/login" className="inline-block mt-4 text-sm font-bold text-dpr-emerald dark:text-dpr-gold hover:underline">
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Masukkan nama lengkap Anda"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Resmi
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@dpr.go.id"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Jabatan / Posisi di Fraksi
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      placeholder="Contoh: Tenaga Ahli Komisi III"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Buat password"
                      className={inputClass + " pr-12"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-dpr-emerald dark:bg-gold-gradient hover:opacity-90 disabled:opacity-60 text-white dark:text-dpr-navy font-bold text-sm py-3.5 rounded-xl shadow-md dark:shadow-gold-glow transition-all mt-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  <span>{loading ? "Mendaftar..." : "Ajukan Akun Tim Seleksi"}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="text-center mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sudah punya akun yang disetujui?{" "}
                  <Link href="/admin/login" className="font-bold text-dpr-emerald dark:text-dpr-gold hover:underline">
                    Login di sini
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

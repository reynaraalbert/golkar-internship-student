"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login gagal. Periksa kembali kredensial Anda.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-slate-50 dark:bg-dpr-navy-card text-sm text-slate-900 dark:text-white placeholder-slate-400 pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none focus:ring-1 focus:ring-dpr-emerald dark:focus:ring-dpr-gold transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-hero-gradient-light dark:bg-hero-gradient relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dpr-emerald/15 dark:bg-dpr-red/20 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md"
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
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">CMS KOMISI XIII</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Admin Control Panel — DPR RI Komisi XIII
              </p>
            </div>
          </div>

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
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin"
                  className={inputClass}
                  autoComplete="username"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className={inputClass + " pr-12"}
                  autoComplete="current-password"
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
              className="w-full flex items-center justify-center gap-2 bg-dpr-emerald dark:bg-gold-gradient hover:opacity-90 disabled:opacity-60 text-white dark:text-dpr-navy font-bold text-sm py-3.5 rounded-xl shadow-md dark:shadow-gold-glow transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Account creation for the admin area is intentionally NOT self-service.
 * Admin/Tim Seleksi accounts are provisioned by the program administrator.
 */
export default function TimSeleksiRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-hero-gradient-light dark:bg-hero-gradient relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 bg-white/90 dark:bg-slate-900/90 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Akun Admin & Tim Seleksi</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pendaftaran akun admin tidak dilakukan secara mandiri. Akun Admin CMS dan Tim Seleksi dibuat
              oleh administrator program melalui konfigurasi server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 text-left">
            <Mail className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Jika Anda memerlukan akses, silakan hubungi pengelola program Golkar Internship Student.
              Jangan membagikan kata sandi melalui kanal publik.
            </span>
          </div>

          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-dpr-emerald dark:bg-gold-gradient hover:opacity-90 text-white dark:text-dpr-navy font-bold text-sm py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

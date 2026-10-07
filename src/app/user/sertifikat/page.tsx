"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Award, Download, Lock } from "lucide-react";
import { Reveal, FadeCard } from "@/components/ui/AnimationWrapper";

export default function UserSertifikatPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 px-4 py-2.5 rounded-full shadow-xs hover:bg-amber-500 transition-all self-start"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
          </div>

          <Reveal className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-7 h-7 text-amber-500" /> Sertifikat Magang
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              E-Certificate resmi akan tersedia di sini setelah Anda dinyatakan lulus dari program magang.
            </p>
          </Reveal>

          <FadeCard index={0} hover={false} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sertifikat Belum Tersedia</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                Anda belum menyelesaikan program magang yang sedang berjalan, atau status kelulusan Anda belum diverifikasi oleh panitia.
              </p>
            </div>
            <button disabled className="mt-4 px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl cursor-not-allowed inline-flex items-center gap-2">
              <Download className="w-4 h-4" /> Unduh Sertifikat
            </button>
          </FadeCard>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 font-sans px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700 shadow-2xl p-8 sm:p-10 space-y-6">
          {/* Logo badge */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-xl">G</div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">GOLKAR INTERNSHIP STUDENT</span>
              <span className="text-xs font-extrabold text-white">Portal Resmi Magang</span>
            </div>
          </div>

          {sent ? (
            /* ── SUCCESS STATE ── */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-black text-white">Email Terkirim!</h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Jika email <span className="font-bold text-amber-400">{email}</span> terdaftar, tautan reset kata sandi telah dikirimkan.
                Silakan periksa kotak masuk (atau folder <em>Spam</em>) Anda.
              </p>
              <p className="text-xs text-slate-500">Tautan berlaku selama <strong className="text-slate-300">1 jam</strong>.</p>
              <Link
                href="/user/login"
                className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 px-4 py-2 rounded-full transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Login
              </Link>
            </div>
          ) : (
            /* ── FORM STATE ── */
            <>
              <div>
                <h1 className="text-2xl font-black text-white">Lupa Kata Sandi?</h1>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Masukkan email terdaftar Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
                </p>
              </div>

              <Link
                href="/user/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 px-3.5 py-1.5 rounded-full transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
              </Link>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wide">
                    Alamat Email Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh@email.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-amber-600 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim Email...</>
                  ) : (
                    "Kirim Tautan Reset"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2, Lock, ShieldCheck } from "lucide-react";

function StrengthIndicator({ password }: { password: string }) {
  const checks = [
    { label: "Minimal 8 karakter", ok: password.length >= 8 },
    { label: "Huruf kapital (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "Huruf kecil (a-z)", ok: /[a-z]/.test(password) },
    { label: "Angka (0-9)", ok: /[0-9]/.test(password) },
    { label: "Simbol (@, #, !, _…)", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-emerald-500"];
  const color = colors[passed - 1] ?? "bg-slate-700";

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passed ? color : "bg-slate-700"}`} />
        ))}
      </div>
      <ul className="space-y-0.5">
        {checks.map((c) => (
          <li key={c.label} className={`flex items-center gap-1.5 text-[11px] ${c.ok ? "text-emerald-400" : "text-slate-500"}`}>
            {c.ok ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <XCircle className="w-3 h-3 shrink-0" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStrong =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isStrong) { setError("Kata sandi belum memenuhi semua syarat keamanan."); return; }
    if (password !== confirm) { setError("Konfirmasi kata sandi tidak cocok."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/user/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");
      setDone(true);
      setTimeout(() => router.push("/user/login"), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <XCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h1 className="text-xl font-black text-white">Tautan Tidak Valid</h1>
        <p className="text-sm text-slate-400">Token reset tidak ditemukan. Silakan minta ulang tautan reset.</p>
        <Link href="/user/forgot-password" className="inline-flex items-center gap-2 mt-2 text-xs font-bold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 px-4 py-2 rounded-full transition-all">
          Minta Tautan Baru
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-white">Kata Sandi Diperbarui!</h1>
        <p className="text-sm text-slate-400">Kata sandi Anda berhasil direset. Anda akan diarahkan ke halaman login dalam 3 detik…</p>
        <Loader2 className="w-5 h-5 text-amber-400 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-white">Buat Kata Sandi Baru</h1>
        <p className="text-sm text-slate-400 mt-1">Kata sandi harus kuat — mengandung huruf kapital, angka, dan simbol.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Kata Sandi Baru</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter, huruf kapital, angka, simbol"
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {password && <StrengthIndicator password={password} />}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Ulangi Kata Sandi</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showCf ? "text" : "password"}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Sama dengan kata sandi baru"
              className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-slate-800 text-white placeholder:text-slate-500 focus:ring-2 outline-none transition-all ${
                confirm && confirm !== password ? "border-red-600 focus:ring-red-500" : "border-slate-700 focus:ring-amber-500 focus:border-amber-500"
              }`}
            />
            <button type="button" onClick={() => setShowCf(!showCf)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
              {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirm && confirm !== password && (
            <p className="text-[11px] text-red-400 mt-1">Kata sandi tidak cocok.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isStrong || password !== confirm}
          className="w-full py-3 px-6 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-amber-600 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan Kata Sandi Baru"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 font-sans px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700 shadow-2xl p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-xl">G</div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Golkar Internship Student</span>
              <span className="text-xs font-extrabold text-white">Portal Resmi Magang</span>
            </div>
          </div>
          <Suspense fallback={<div className="text-slate-400 text-sm">Memuat...</div>}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

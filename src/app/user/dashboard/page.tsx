"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, Briefcase, Calendar as CalendarIcon, CheckCircle2, ChevronRight, FileText, Home, LogOut,
  Search, Shield, Star, User, UserCheck
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  photoUrl: string;
  statusMagang: string;
  posisiDilamar: string;
  nim?: string;
  ipk?: string;
  semester?: string;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/user/auth/me");
        if (!res.ok) {
          router.push("/user/login");
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push("/user/login");
        }
      } catch {
        router.push("/user/login");
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold">Memuat Dashboard Peserta...</p>
        </div>
      </div>
    );
  }

  const currentUser = user || {
    name: "Reynara Albert Pradana",
    university: "Universitas Indonesia",
    major: "Ilmu Hukum & Kebijakan Publik",
    email: "reynara@ui.ac.id",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    statusMagang: "Terverifikasi",
    posisiDilamar: "Program Magang Analisis Kebijakan & Riset Legislatif",
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col">
      {/* MAIN BODY AREA WITH LEFT SIDEBAR AND DASHBOARD GRID */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        {/* LEFT ICON SIDEBAR */}
        <aside className="hidden md:flex flex-col items-center gap-4 w-16 bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-md border border-slate-200 dark:border-slate-800 self-start">
          <img
            src={currentUser.photoUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm"
          />
          <Link
            href="/user/dashboard"
            className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs hover:bg-amber-500/30 transition-colors"
            title="Dashboard"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/user/profil"
            className="w-10 h-10 rounded-2xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 flex items-center justify-center transition-colors"
            title="Profil Saya"
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/user/posisi"
            className="w-10 h-10 rounded-2xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 flex items-center justify-center transition-colors"
            title="Posisi Magang"
          >
            <Briefcase className="w-5 h-5" />
          </Link>
        </aside>

        {/* DASHBOARD CONTENT AREA */}
        <main className="flex-1 space-y-6">
          {/* HERO BANNER CARD (Gold/Amber Theme) */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-slate-950 shadow-xl min-h-[220px] flex items-center p-6 sm:p-10 border border-amber-400/50">
            {/* Background Image Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden sm:block z-0">
              <img
                src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80"
                alt="Gedung DPR RI"
                className="w-full h-full object-cover filter brightness-90 mix-blend-overlay opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-600/90 to-transparent" />
            </div>

            <div className="relative z-10 space-y-2 max-w-xl">
              <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Dashboard / Dashboard
              </p>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 flex items-center gap-2">
                Selamat Datang {currentUser.name} 👋
              </h1>
              <p className="text-sm sm:text-base text-slate-900 font-bold">
                Pengguna, {currentUser.university}.
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu dashboard..."
              className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none shadow-xs"
            />
          </div>

          {/* CARDS GRID & RIGHT CALENDAR WIDGET */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CARDS GRID (8 Columns) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Dashboard */}
              <Link
                href="/user/dashboard"
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      Dashboard
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ringkasan aktivitas dan akses.
                    </p>
                  </div>
                </div>
                <Star className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors shrink-0" />
              </Link>

              {/* Card 2: Profil Saya */}
              <Link
                href="/user/profil"
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      Profil Saya
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Lengkapi informasi akun Anda.
                    </p>
                  </div>
                </div>
                <Star className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors shrink-0" />
              </Link>

              {/* Card 3: Pengaturan Keamanan */}
              <Link
                href="/user/profil"
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      Pengaturan Keamanan
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Atur 2FA dan kata sandi akun.
                    </p>
                  </div>
                </div>
                <Star className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors shrink-0" />
              </Link>

              {/* Card 4: Status Lamaran */}
              <Link
                href="/user/posisi"
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      Status Lamaran
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pantau proses verifikasi & seleksi.
                    </p>
                  </div>
                </div>
                <Star className="w-4 h-4 text-slate-300 group-hover:text-amber-400 transition-colors shrink-0" />
              </Link>

              {/* Status Box Info */}
              <div className="sm:col-span-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                      STATUS PENDAFTARAN MAGANG
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {currentUser.statusMagang} - {currentUser.posisiDilamar}
                    </h4>
                  </div>
                </div>
                <Link
                  href="/user/profil"
                  className="text-xs font-extrabold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  Lihat Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT WIDGET: CALENDAR WIDGET */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Kalender</h3>
                </div>
                <span className="text-xs font-bold text-slate-500">September 2026</span>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
                <span>Min</span>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-2 text-slate-700 dark:text-slate-300">
                <span className="text-slate-300 dark:text-slate-700">1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                {/* Today Date Highlighted in Gold */}
                <span className="bg-amber-400 text-slate-950 font-black rounded-full py-1 shadow-md scale-110">
                  23
                </span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">Agenda Terdekat:</p>
                <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 font-semibold">
                  🗓️ 25 Sep - Pengumuman Seleksi Berkas Magang
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

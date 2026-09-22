"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User } from "lucide-react";

interface UserProfile {
  name: string;
  university: string;
}

export default function UserNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/user/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch {
        setUser(null);
      }
    }
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/user/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/user/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const displayName = user?.name || "Reynara Albert Pradana";

  return (
    <header className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 shadow-lg sticky top-0 z-50 border-b border-amber-400/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/user/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center text-amber-400 font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            G
          </div>
          <div>
            <span className="text-base font-black tracking-tight block text-slate-950 leading-tight">
              E-Magang
            </span>
            <span className="text-[11px] text-slate-900 block font-bold">
              Ayo Magang di Golkar Internship Student DPR RI
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold">
          <Link
            href="/"
            className={`pb-1 transition-all border-b-2 ${
              pathname === "/"
                ? "border-slate-950 text-slate-950 font-black"
                : "border-transparent text-slate-900 hover:text-slate-950"
            }`}
          >
            Beranda
          </Link>

          <Link
            href="/user/dashboard"
            className={`pb-1 transition-all border-b-2 flex items-center gap-1.5 ${
              pathname === "/user/dashboard"
                ? "border-slate-950 text-slate-950 font-black"
                : "border-transparent text-slate-900 hover:text-slate-950"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-slate-950" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/user/posisi"
            className={`pb-1 transition-all border-b-2 ${
              pathname === "/user/posisi"
                ? "border-slate-950 text-slate-950 font-black"
                : "border-transparent text-slate-900 hover:text-slate-950"
            }`}
          >
            Posisi Magang
          </Link>

          <Link
            href="/aspirasi"
            className={`pb-1 transition-all border-b-2 ${
              pathname === "/aspirasi"
                ? "border-slate-950 text-slate-950 font-black"
                : "border-transparent text-slate-900 hover:text-slate-950"
            }`}
          >
            Sering Ditanyakan
          </Link>
        </nav>

        {/* Right User Action & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/user/dashboard"
            className="flex items-center gap-2 bg-slate-950 text-amber-400 px-3.5 py-1.5 rounded-full shadow-sm text-xs font-black border border-amber-400/40 hover:bg-slate-900 transition-all"
            title="Ke Dashboard Peserta"
          >
            <User className="w-4 h-4 text-amber-400" />
            <span className="truncate max-w-[140px]">{displayName}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-black px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 border border-amber-400/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}

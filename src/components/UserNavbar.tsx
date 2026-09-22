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
    <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/user/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-950 font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            G
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight block text-white leading-tight">
              E-Magang
            </span>
            <span className="text-[11px] text-blue-200 block font-medium">
              Ayo Magang di Golkar Internship Student DPR RI
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
          <Link
            href="/"
            className={`pb-1 transition-all border-b-2 ${
              pathname === "/"
                ? "border-amber-400 text-white font-black"
                : "border-transparent text-blue-100 hover:text-amber-300"
            }`}
          >
            Beranda
          </Link>

          <Link
            href="/user/dashboard"
            className={`pb-1 transition-all border-b-2 flex items-center gap-1.5 ${
              pathname === "/user/dashboard"
                ? "border-amber-400 text-white font-black"
                : "border-transparent text-blue-100 hover:text-amber-300"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/user/posisi"
            className={`pb-1 transition-all border-b-2 ${
              pathname === "/user/posisi"
                ? "border-amber-400 text-white font-black"
                : "border-transparent text-blue-100 hover:text-amber-300"
            }`}
          >
            Posisi Magang
          </Link>

          <Link
            href="/aspirasi"
            className={`pb-1 transition-all border-b-2 ${
              pathname === "/aspirasi"
                ? "border-amber-400 text-white font-black"
                : "border-transparent text-blue-100 hover:text-amber-300"
            }`}
          >
            Sering Ditanyakan
          </Link>
        </nav>

        {/* Right User Action & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/user/dashboard"
            className="flex items-center gap-2 bg-white text-slate-800 px-3.5 py-1.5 rounded-full shadow-sm text-xs font-bold border border-white/20 hover:bg-slate-50 transition-all"
            title="Ke Dashboard Peserta"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span className="truncate max-w-[140px]">{displayName}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}

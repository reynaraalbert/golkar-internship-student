"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

interface UserProfile {
  name: string;
  university: string;
}

export default function UserNavbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const displayName = user?.name || "Peserta";

  const formattedTime = currentTime
    ? currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " • " +
      currentTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WIB"
    : "Memuat waktu...";

  return (
    <React.Fragment>
      <header className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-950 dark:text-slate-100 shadow-lg sticky top-0 z-50 border-b border-amber-400/50 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link href="/user/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-slate-950 dark:bg-slate-800 border-2 border-white dark:border-slate-600 flex items-center justify-center text-amber-400 dark:text-amber-500 font-black text-base shadow-md group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-black tracking-tight block text-slate-950 dark:text-white leading-tight">
                E-Magang
              </span>
              <span className="text-[10px] text-slate-900 dark:text-slate-400 block font-bold leading-tight">
                Golkar Internship Student
              </span>
            </div>
          </Link>

          {/* Center Nav: Beranda & Dashboard only */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-bold">
            <Link
              href="/"
              className="pb-0.5 transition-all border-b-2 border-transparent text-slate-900 dark:text-slate-300 hover:text-slate-950 dark:hover:text-amber-400 hover:border-slate-950 dark:hover:border-amber-400"
            >
              Beranda
            </Link>
            <Link
              href="/user/dashboard"
              className="pb-0.5 transition-all border-b-2 border-slate-950 dark:border-amber-400 text-slate-950 dark:text-amber-400 font-black flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Realtime Clock */}
            <div className="hidden lg:flex items-center px-3 py-1 rounded-full bg-slate-950/10 dark:bg-slate-800/50 text-slate-900 dark:text-slate-300 text-[10px] font-bold border border-slate-950/10 dark:border-slate-700 mr-2">
              {formattedTime}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-slate-950/15 dark:bg-white/10 hover:bg-slate-950/25 dark:hover:bg-white/20 text-slate-950 dark:text-amber-400 flex items-center justify-center transition-all hover:scale-110"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* User Name Pill */}
            <Link
              href="/user/dashboard"
              className="flex items-center gap-2 bg-slate-950 text-amber-400 px-3 py-1.5 rounded-full shadow-sm text-xs font-black border border-amber-400/40 hover:bg-slate-900 transition-all"
              title="Ke Dashboard Peserta"
            >
              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[120px]">{displayName}</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-black px-3 py-2 rounded-xl shadow-md transition-all active:scale-95 border border-amber-400/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isLogoutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-600 dark:text-red-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Konfirmasi Keluar</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Apakah Anda yakin ingin mengakhiri sesi dan keluar dari portal magang?
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setIsLogoutModalOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

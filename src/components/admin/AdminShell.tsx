"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Newspaper, CalendarDays, Users, Handshake, Home, LogOut,
  Menu, X, Sun, Moon, ExternalLink, Shield, Settings, ChevronRight,
  Inbox, MessageSquare, FileText, BarChart3, MapPin, PanelBottom, RefreshCw,
  Sliders, User, Radio, BookOpen, Target, Save, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { useAdminAuth, logout } from "@/lib/admin-client";
import { SyncLiveProvider, useSyncLive, Badge } from "@/components/admin/ui";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    groupTitle: "BERANDA",
    items: [
      { name: "Hero & Banner", href: "/admin/beranda", icon: Home },
      { name: "Statistik", href: "/admin/beranda/statistik", icon: BarChart3 },
      { name: "Mitra Kerja Section", href: "/admin/beranda/mitra-section", icon: Handshake },
      { name: "Lokasi & Kontak", href: "/admin/beranda/kontak", icon: MapPin },
      { name: "Footer", href: "/admin/beranda/footer", icon: PanelBottom },
    ],
  },
  {
    groupTitle: "PROFIL KOMISI",
    items: [
      { name: "Profil Utama", href: "/admin/profil", icon: User },
      { name: "Sejarah Komisi", href: "/admin/profil/sejarah", icon: BookOpen },
      { name: "Visi & Misi", href: "/admin/profil/visi-misi", icon: Target },
      { name: "Header Pimpinan", href: "/admin/profil/pimpinan", icon: Users },
      { name: "Header Mitra Kerja", href: "/admin/profil/mitra-kerja", icon: Handshake },
    ],
  },
  {
    groupTitle: "KONTEN",
    items: [
      { name: "Berita & Siaran Pers", href: "/admin/berita", icon: Newspaper },
      { name: "Berita Masuk", href: "/admin/berita-masuk", icon: Inbox },
      { name: "Aspirasi Rakyat", href: "/admin/aspirasi", icon: MessageSquare },
    ],
  },
  {
    groupTitle: "JADWAL & TIM",
    items: [
      { name: "Agenda Rapat", href: "/admin/agenda", icon: CalendarDays },
      { name: "Anggota Komisi", href: "/admin/anggota", icon: Users },
      { name: "Mitra Kerja", href: "/admin/mitra", icon: Handshake },
    ],
  },
  {
    groupTitle: "PENGATURAN",
    items: [
      { name: "Kelola Halaman", href: "/admin/halaman", icon: FileText },
      { name: "Pengaturan Website", href: "/admin/pengaturan", icon: Sliders },
    ],
  },
];

function ClockDisplay() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(/:/g, ".");

      const date = now.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setTimeStr(`${time} · ${date}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
      {timeStr || "Memuat jam..."}
    </span>
  );
}

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const status = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const { syncLive, setSyncLive } = useSyncLive();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient-light dark:bg-hero-gradient">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <svg className="w-6 h-6 animate-spin text-dpr-emerald dark:text-dpr-gold" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-semibold">Memverifikasi sesi admin...</span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
    router.refresh();
  };

  const allNavItems = NAV_GROUPS.flatMap((g) => g.items);

  const isActive = (href: string) => {
    if (pathname === href) return true;
    const hasMoreSpecificMatch = allNavItems.some(
      (item) => item.href !== href && (pathname === item.href || pathname?.startsWith(`${item.href}/`))
    );
    if (hasMoreSpecificMatch) return false;
    return pathname?.startsWith(`${href}/`) ?? false;
  };
  const activeNavItem = allNavItems.find((n) => isActive(n.href)) || { name: "Dashboard" };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#090D1A] text-slate-800 dark:text-slate-200">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <img
            src="/images/logo-dpr.svg"
            alt="Logo DPR RI"
            className="w-10 h-10 object-contain drop-shadow-md shrink-0"
          />
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">KOMISI XIII</p>
            <p className="text-[10px] font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-wider">
              PANEL ADMIN
            </p>
          </div>
        </Link>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <p className="px-3 pb-1 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {group.groupTitle}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? "text-white" : "text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Profile Box (matching BEMPRKK screenshot) */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-2">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              A
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Administrator</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold border border-slate-200 dark:border-white/5 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Preview Site</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B16]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[min(288px,80vw)] bg-white dark:bg-[#090D1A] border-r border-slate-200 dark:border-white/10 z-50 lg:hidden flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#090D1A] border-r border-slate-200 dark:border-white/10 z-40 flex-col transition-transform duration-300 ${
          desktopSidebarCollapsed ? "-translate-x-full" : ""
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main column */}
      <div
        className={`flex flex-col min-h-screen transition-[padding] duration-300 ${
          desktopSidebarCollapsed ? "lg:pl-0" : "lg:pl-72"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/90 dark:bg-[#090D1A]/90 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left section: Collapse button + Breadcrumb + Clock */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDesktopSidebarCollapsed((v) => !v)}
              className="hidden lg:flex p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shrink-0"
              aria-label="Toggle sidebar"
            >
              {desktopSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>

            {/* Title & Realtime Clock */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-bold text-slate-800 dark:text-white min-w-0">
                <span className="truncate max-w-[100px] sm:max-w-none">{activeNavItem.name}</span>
                <span className="text-slate-400 font-normal shrink-0">/</span>
                <span className="bg-blue-600/10 text-blue-600 dark:text-blue-400 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] uppercase font-bold shrink-0">
                  Editor
                </span>
              </div>
              <div className="hidden md:block text-slate-400 text-xs shrink-0">•</div>
              <div className="hidden md:block"><ClockDisplay /></div>
            </div>
          </div>

          {/* Right section: Sync Live + Theme + Preview */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* DB status */}
            <DbStatusBadge />

            {/* Simpan Perubahan Button */}
            <HeaderSaveButton />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-dpr-gold hover:scale-105 transition-transform"
              title="Ubah Tema"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Redirect to public site */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy px-3 sm:px-3.5 py-2 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Situs User</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function DbStatusBadge() {
  const [state, setState] = useState<"checking" | "online" | "offline">("checking");

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/db-status", { cache: "no-store" });
      const d = await res.json();
      setState(d.connected ? "online" : "offline");
    } catch {
      setState("offline");
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  const map = {
    checking: { label: "Cek DB...", cls: "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10", dot: "bg-slate-400" },
    online: { label: "DB Terhubung", cls: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
    offline: { label: "DB Tidak Terhubung (Mode Default)", cls: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800", dot: "bg-red-500" },
  }[state];

  return (
    <button
      onClick={check}
      title={state === "offline" ? "Database tidak terhubung — tampilan memakai data default. Klik untuk cek ulang." : "Klik untuk cek status database"}
      className={`hidden xl:inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${map.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${map.dot} ${state === "checking" ? "animate-pulse" : ""}`} />
      {map.label}
    </button>
  );
}

function HeaderSaveButton() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    window.dispatchEvent(new CustomEvent("cms-manual-save"));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`flex items-center gap-1.5 sm:gap-2 text-xs font-bold px-3 sm:px-4 py-2 rounded-xl shadow-md transition-all ${
        saved
          ? "bg-emerald-600 text-white border border-emerald-500"
          : "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy border border-transparent hover:opacity-90 active:scale-95 cursor-pointer"
      }`}
      title="Simpan semua perubahan ke database dan update mode user"
    >
      {saving ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      ) : saved ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
      ) : (
        <Save className="w-3.5 h-3.5" />
      )}
      <span>{saved ? "Tersimpan!" : saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
    </button>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SyncLiveProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </SyncLiveProvider>
  );
}

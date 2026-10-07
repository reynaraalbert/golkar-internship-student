"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, Briefcase, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, Clock, FileText, Home, Layers, LogOut,
  MapPin, Search, Shield, Star, User, UserCheck, HelpCircle, Upload, Award, FilePlus, Users
} from "lucide-react";
import { Reveal, StaggerList, FadeCard, SlideIn } from "@/components/ui/AnimationWrapper";
import TimelineWidget from "@/components/TimelineWidget";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  category: string;
}

const CATEGORY_STYLE: Record<string, { label: string; dot: string; chip: string }> = {
  wawancara: { label: "Wawancara", dot: "bg-purple-500", chip: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300" },
  seleksi: { label: "Seleksi", dot: "bg-blue-500", chip: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300" },
  pengumuman: { label: "Pengumuman", dot: "bg-amber-500", chip: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" },
  kegiatan: { label: "Kegiatan", dot: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" },
  deadline: { label: "Deadline", dot: "bg-red-500", chip: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300" },
  lainnya: { label: "Lainnya", dot: "bg-slate-400", chip: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

const MONTH_FORMAT: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  photoUrl: string;
  statusMagang: string;
  posisiDilamar: string;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<{ year: number; month: number } | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [experienceCounts, setExperienceCounts] = useState({ organisasi: 0, professional: 0, project: 0 });

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setViewMonth({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedKey(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    );
  }, []);

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

  // Calendar events (set by admin: for everyone or for this account) + experience summary
  useEffect(() => {
    if (!user) return;
    fetch("/api/user/kalender", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((d) => setEvents(d.events || []))
      .catch(() => setEvents([]));
    fetch("/api/user/experiences", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { experiences: [] }))
      .then((d) => {
        const list: { type: string }[] = d.experiences || [];
        setExperienceCounts({
          organisasi: list.filter((e) => e.type === "organisasi").length,
          professional: list.filter((e) => e.type === "professional").length,
          project: list.filter((e) => e.type === "project").length,
        });
      })
      .catch(() => {});
  }, [user]);

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

  const MENU_ITEMS = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Ringkasan aktivitas dan akses cepat akun Anda.",
      href: "/user/dashboard",
      icon: Home,
      category: "Akses Utama",
    },
    {
      id: "profil",
      title: "Profil Saya",
      description: "Lengkapi data diri, perguruan tinggi, & berkas.",
      href: "/user/profil",
      icon: User,
      category: "Pengaturan Akun",
    },
    {
      id: "pengalaman-portofolio",
      title: "Pengalaman & Portofolio",
      description: "Tambah pengalaman organisasi, professional, atau link project.",
      href: "/user/pengalaman",
      icon: Layers,
      category: "Pemberkasan",
    },
    {
      id: "dokumen-persyaratan",
      title: "Dokumen Persyaratan",
      description: "Unggah KTM, Surat Rekomendasi, SKO, Bukti IPK, CV, dll.",
      href: "/user/dokumen",
      icon: Upload,
      category: "Pemberkasan",
    },
    {
      id: "buat-cv",
      title: "Auto-Generate CV",
      description: "Buat CV otomatis berdasarkan biodata dan profil Anda.",
      href: "/user/cv",
      icon: FilePlus,
      category: "Layanan",
    },
    {
      id: "posisi-magang",
      title: "Posisi Magang",
      description: "Jelajahi daftar lowongan & kuota magang DPR RI.",
      href: "/user/posisi",
      icon: Briefcase,
      category: "Proses Magang",
    },
    {
      id: "status-lamaran",
      title: "Status Lamaran",
      description: "Pantau proses verifikasi, tahapan seleksi, & riwayat.",
      href: "/user/status-lamaran",
      icon: FileText,
      category: "Proses Magang",
      highlight: true,
    },
    {
      id: "sertifikat-magang",
      title: "Sertifikat Magang",
      description: "Unduh e-certificate setelah menyelesaikan program.",
      href: "/user/sertifikat",
      icon: Award,
      category: "Pemberkasan",
    },
    {
      id: "bantuan-faq",
      title: "Bantuan & FAQ",
      description: "Pusat informasi pendaftaran dan aspirasi magang.",
      href: "/aspirasi",
      icon: HelpCircle,
      category: "Layanan",
    },
    {
      id: "keamanan",
      title: "Pengaturan Keamanan",
      description: "Atur kata sandi, 2FA, dan sesi keamanan akun.",
      href: "/user/profil",
      icon: Shield,
      category: "Pengaturan Akun",
    },
  ];

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const toKey = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
  const fmtKey = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
  };
  const todayKey = currentDate
    ? toKey(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    : "";
  const eventsByDate = events.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});
  const selectedEvents = selectedKey ? eventsByDate[selectedKey] || [] : [];
  const upcomingEvents = events
    .filter((e) => e.date >= todayKey && e.date !== selectedKey)
    .slice(0, 3);
  const shiftMonth = (delta: number) =>
    setViewMonth((v) => {
      if (!v) return v;
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const renderEventCard = (ev: CalendarEvent) => {
    const style = CATEGORY_STYLE[ev.category] || CATEGORY_STYLE.lainnya;
    return (
      <div
        key={ev.id}
        className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 font-semibold space-y-1"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="font-bold leading-snug">{ev.title}</span>
          <span className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full ${style.chip}`}>{style.label}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {fmtKey(ev.date)}</span>
          {ev.time && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time} WIB</span>}
          {ev.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.location}</span>}
        </div>
        {ev.description && <p className="text-[10px] text-slate-600 dark:text-slate-400 font-normal leading-snug">{ev.description}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col">
      {/* MAIN BODY AREA WITH LEFT SIDEBAR AND DASHBOARD GRID */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8 flex-1 flex gap-6">
        {/* LEFT ICON SIDEBAR */}
        <aside className="hidden md:flex flex-col items-center gap-4 w-16 bg-white dark:bg-slate-900 rounded-full pt-6 pb-6 px-3 shadow-md border border-slate-200 dark:border-slate-800 self-start relative z-40 mt-6">
          <img
            src={currentUser.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm mb-2"
          />
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/user/dashboard";
            return (
              <div key={item.id} className="relative group">
                <Link
                  href={item.href}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isActive 
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-xs" 
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
                {/* TOOLTIP */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg shadow-xl opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50">
                  {item.title}
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 transform rotate-45"></div>
                </div>
              </div>
            );
          })}
        </aside>


        {/* DASHBOARD CONTENT AREA */}
        <main className="flex-1 space-y-6 mt-6">
          {/* HERO BANNER CARD */}
          <Reveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-950 dark:text-white shadow-xl min-h-[200px] flex items-start pt-6 pb-6 px-6 sm:px-10 border border-amber-400/50 dark:border-slate-800 transition-colors">
            {/* Background Image Overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-2/3 sm:w-1/2 z-0">
              <img
                src="/images/hero-peserta-magang.png"
                alt="Peserta Magang"
                className="w-full h-full object-cover filter mix-blend-overlay opacity-60 dark:opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-400/80 to-transparent dark:from-slate-800 dark:via-slate-800/80 dark:to-transparent" />
            </div>

            <div className="relative z-10 max-w-xl space-y-1">
              <p className="text-[11px] font-black text-slate-900/70 dark:text-amber-500 uppercase tracking-[0.18em]">
                DASHBOARD PESERTA GOLKAR INTERNSHIP
              </p>
              <p className="text-base sm:text-lg font-semibold text-slate-900/90 dark:text-slate-300 tracking-tight">
                Selamat Datang,
              </p>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
                {currentUser.name}
              </h1>
            </div>
          </div>
          </Reveal>

          {/* SEARCH BAR FOR DASHBOARD MENU */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu dashboard... (cth: Status Lamaran, Profil, Keamanan, Posisi)"
              className="w-full pl-11 pr-10 py-3.5 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Reset
              </button>
            )}
          </div>

          {/* CARDS GRID & RIGHT CALENDAR WIDGET */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CARDS GRID (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              {filteredMenuItems.length > 0 ? (
                <StaggerList className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMenuItems.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <FadeCard
                        key={item.id}
                        index={idx}
                        className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer ${
                          item.highlight
                            ? "border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/30"
                            : "border-slate-200 dark:border-slate-800 hover:border-amber-400"
                        }`}
                      >
                        <Link href={item.href} className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                      </FadeCard>
                    );
                  })}
                </StaggerList>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-500">
                    Tidak ditemukan menu dashboard dengan kata kunci &quot;<span className="text-amber-600">{searchQuery}</span>&quot;.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-black text-amber-600 dark:text-amber-400 underline"
                  >
                    Tampilkan semua menu
                  </button>
                </div>
              )}

              {/* Status Box Info */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                      STATUS PENDAFTARAN MAGANG SAYA
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {currentUser.statusMagang} — {currentUser.posisiDilamar}
                    </h4>
                  </div>
                </div>
                <Link
                  href="/user/status-lamaran"
                  className="text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded-xl flex items-center gap-1 transition-all shadow-xs shrink-0"
                >
                  Pantau Tahapan Seleksi <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* SECTION TIMELINE MAGANG */}
              <TimelineWidget />

              {/* SECTION PENGALAMAN & PORTOFOLIO (satu tempat: organisasi / professional / project-link) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Pengalaman & Portofolio</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      Pengalaman organisasi, professional, dan link project Anda dalam satu tempat.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                        <Users className="w-3 h-3" /> {experienceCounts.organisasi} Organisasi
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                        <Briefcase className="w-3 h-3" /> {experienceCounts.professional} Professional
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300">
                        <FileText className="w-3 h-3" /> {experienceCounts.project} Project
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/user/pengalaman"
                  className="text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-500 px-4 py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs shrink-0"
                >
                  + Tambah / Kelola <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT WIDGET: CALENDAR WIDGET */}
            <SlideIn direction="right" className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 self-start">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Kalender Magang</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => shiftMonth(-1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-500 min-w-[100px] text-center">
                    {viewMonth ? new Date(viewMonth.year, viewMonth.month, 1).toLocaleDateString("id-ID", MONTH_FORMAT) : "Memuat..."}
                  </span>
                  <button
                    onClick={() => shiftMonth(1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Bulan berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
                <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span>
                <span>Jum</span><span>Sab</span><span>Min</span>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-2 gap-x-1 text-slate-700 dark:text-slate-300">
                {(() => {
                  if (!viewMonth) return null;
                  const { year, month } = viewMonth;
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const firstDay = new Date(year, month, 1).getDay();
                  const startingDay = firstDay === 0 ? 6 : firstDay - 1;

                  const days = [];
                  for (let i = 0; i < startingDay; i++) {
                    days.push(<span key={`empty-${i}`} className="text-slate-300/30 dark:text-slate-700/30">-</span>);
                  }
                  for (let i = 1; i <= daysInMonth; i++) {
                    const key = toKey(year, month, i);
                    const isToday = key === todayKey;
                    const isSelected = key === selectedKey;
                    const dayEvents = eventsByDate[key] || [];
                    days.push(
                      <button
                        key={i}
                        onClick={() => setSelectedKey(key)}
                        title={dayEvents.length ? dayEvents.map((e) => e.title).join(", ") : undefined}
                        className={`relative py-1 rounded-full text-center transition-all ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 font-black shadow-md scale-110"
                            : isToday
                            ? "border border-amber-400 text-amber-600 dark:text-amber-400 font-bold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {i}
                        {dayEvents.length > 0 && (
                          <span
                            className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-1 h-1 rounded-full ${
                              isSelected ? "bg-slate-950" : (CATEGORY_STYLE[dayEvents[0].category] || CATEGORY_STYLE.lainnya).dot
                            }`}
                          />
                        )}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Agenda {selectedKey ? fmtKey(selectedKey) : ""}:
                </p>
                {selectedEvents.length > 0 ? (
                  <div className="space-y-2">{selectedEvents.map(renderEventCard)}</div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">Tidak ada agenda pada tanggal ini.</p>
                )}

                {upcomingEvents.length > 0 && (
                  <>
                    <p className="font-bold text-slate-700 dark:text-slate-300 pt-2">Agenda Terdekat:</p>
                    <div className="space-y-2">{upcomingEvents.map(renderEventCard)}</div>
                  </>
                )}
                {events.length === 0 && (
                  <p className="text-[10px] text-slate-400">Belum ada agenda dari panitia.</p>
                )}
              </div>
            </SlideIn>
          </div>
        </main>
      </div>
    </div>
  );
}



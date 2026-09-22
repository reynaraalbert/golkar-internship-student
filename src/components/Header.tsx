/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCmsContent } from "@/components/CmsProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Users, Newspaper, Info, Menu, X, Search, Landmark, ChevronRight, Sun, Moon, MessageSquare, UserCheck, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { berita, anggota, agenda } = useCmsContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Beranda", href: "/", icon: Landmark },
    { name: "Peserta Magang", href: "/anggota", icon: Users },
    {
      name: "Berita",
      href: "/berita",
      icon: Newspaper,
      children: [
        { name: "Baca Berita", href: "/berita" },
        { name: "Tulis Berita", href: "/berita/tulis" }
      ]
    },
    {
      name: "Profil GIS",
      href: "/profil",
      icon: Info,
      children: [
        { name: "Sejarah GIS", href: "/profil/sejarah" },
        { name: "Visi & Misi", href: "/profil/visi-misi" },
        { name: "Pimpinan & Pengurus", href: "/profil/pimpinan" },
        { name: "Mitra Kerja", href: "/profil/mitra-kerja" }
      ]
    },
    { name: "Aspirasi", href: "/aspirasi", icon: MessageSquare },
    { name: "GOLKAR", href: "https://fraksigolkar.com/", icon: Globe, isExternal: true },
  ];

  // Live search filtering logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchedBerita = berita.filter(
      (b) => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAnggota = anggota.filter(
      (m) => m.name.toLowerCase().includes(q) || m.fraksi.toLowerCase().includes(q) || m.dapil.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAgenda = agenda.filter(
      (a) => a.title.toLowerCase().includes(q) || a.partner.toLowerCase().includes(q)
    ).slice(0, 2);

    return { matchedBerita, matchedAnggota, matchedAgenda, totalCount: matchedBerita.length + matchedAnggota.length + matchedAgenda.length };
  }, [searchQuery, berita, anggota, agenda]);

  return (
    <>
      <header ref={headerRef} className={`sticky z-40 transition-all duration-150 ${
        isScrolled
          ? "top-2 sm:top-3 max-w-[1440px] mx-auto px-2.5 sm:px-6 pointer-events-none"
          : "top-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 shadow-md"
      }`}>
        <div className={`w-full mx-auto transition-all duration-150 ${
          isScrolled
            ? "pointer-events-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl lg:rounded-full shadow-2xl border border-slate-200/90 dark:border-white/15 px-2.5 sm:px-6 py-1.5 sm:py-2"
            : "max-w-[1536px] px-2 sm:px-4 lg:px-5 py-1 sm:py-1.5 min-h-[52px] sm:min-h-[68px] lg:min-h-[82px]"
        }`}>
          <div className="flex items-center justify-between gap-1 sm:gap-2 lg:gap-3 relative">
            
            {/* Logo & Brand (Hapus Logo DPR RI, Sisakan Logo Partai Golkar & Logo GIS Lebih Besar) */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 group min-w-0 shrink py-0.5">
              <div className={`transition-all duration-150 shrink-0 flex items-center justify-center gap-1 sm:gap-1.5 ${
                isScrolled ? "h-7 sm:h-9 lg:h-10" : "h-[32px] sm:h-[44px] lg:h-[58px]"
              }`}>
                {/* Logo Partai Golkar */}
                <img
                  src="/images/fraksi-golkar-new.png"
                  alt="Partai Golkar"
                  className={`w-auto object-contain drop-shadow-md transition-all duration-150 ${
                    isScrolled ? "h-6 sm:h-8 lg:h-9" : "h-[30px] sm:h-[42px] lg:h-[52px]"
                  }`}
                />
                {/* Logo GIS (Dibuat Lebih Besar Sedikit) */}
                <img
                  src="/images/golkar-internship-trans.png"
                  alt="Golkar Internship Student"
                  className={`w-auto object-contain drop-shadow-md transition-all duration-150 ${
                    isScrolled ? "h-7 sm:h-9 lg:h-10" : "h-[34px] sm:h-[48px] lg:h-[60px]"
                  }`}
                />
              </div>

              <AnimatePresence mode="wait">
                {!isScrolled ? (
                  <motion.div
                    key="full-brand"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col justify-center min-w-0 overflow-hidden"
                  >
                    <span className="text-xs sm:text-sm xl:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                      GOLKAR INTERNSHIP STUDENT
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase mt-0.5">
                      PORTAL MAGANG MAHASISWA
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="scrolled-brand"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5 sm:gap-2"
                  >
                    <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-amber-500">
                      GIS
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 p-1 sm:p-1.5 rounded-full border border-slate-200 dark:border-white/10 shrink-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                if (link.isExternal) {
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center gap-1 lg:gap-1.5 px-2 lg:px-2.5 xl:px-3.5 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-[11px] xl:text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
                    >
                      <Icon className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-amber-500 shrink-0" />
                      <span>{link.name}</span>
                    </a>
                  );
                }

                return (
                  <div key={link.name} className="relative group">
                    <Link
                      href={link.href}
                      className={`relative flex items-center gap-1 lg:gap-1.5 px-1.5 lg:px-2 xl:px-3 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "text-white dark:text-dpr-navy font-bold shadow-md"
                          : "text-slate-700 dark:text-slate-200 hover:text-dpr-emerald dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 bg-dpr-emerald dark:bg-gold-gradient rounded-full shadow-md dark:shadow-gold-glow"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1 lg:gap-1.5">
                        <Icon className={`w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 shrink-0 ${isActive ? "text-white dark:text-dpr-navy" : "text-dpr-emerald dark:text-dpr-gold"}`} />
                        <span>{link.name}</span>
                      </span>
                    </Link>

                    {link.children && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-1 group-hover:translate-y-0 p-1.5 space-y-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-dpr-emerald dark:hover:text-dpr-gold transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Search, Theme Toggle & Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/15 text-slate-700 dark:text-dpr-gold hover:scale-110 transition-transform shadow-sm"
                title={theme === "dark" ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-dpr-gold animate-spin-slow" />
                ) : (
                  <Moon className="w-4 h-4 text-dpr-emerald-dark" />
                )}
              </button>

              <Link
                href="/user/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] xl:text-xs font-black rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-sm hover:shadow-md hover:scale-105 transition-all shrink-0 border border-amber-500/30"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Portal Peserta</span>
              </Link>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berita, peserta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-28 lg:w-32 xl:w-36 bg-slate-100 dark:bg-dpr-navy text-[10px] xl:text-[11px] text-slate-900 dark:text-white placeholder-slate-400 pl-7 xl:pl-8 pr-5 py-1.5 rounded-full border border-slate-300 dark:border-white/15 focus:outline-none focus:border-dpr-emerald dark:focus:border-dpr-gold focus:ring-1 focus:ring-dpr-emerald dark:focus:ring-dpr-gold transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 dark:hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Desktop Live Search Popover */}
              <AnimatePresence>
                {searchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/40 rounded-2xl shadow-2xl overflow-hidden z-50 p-4 space-y-4 max-h-[75vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                      <span className="text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold uppercase tracking-wider flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" />
                        Hasil Pencarian ({searchResults.totalCount})
                      </span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full"
                      >
                        Tutup [X]
                      </button>
                    </div>

                    {searchResults.totalCount === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                        Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {searchResults.matchedAnggota.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Peserta Magang</span>
                            {searchResults.matchedAnggota.map((m) => (
                              <Link
                                key={m.id}
                                href="/anggota"
                                onClick={() => setSearchQuery("")}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-dpr-navy hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-all text-left group"
                              >
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors">{m.name}</h4>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.fraksi} • {m.role}</p>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold opacity-60 shrink-0" />
                              </Link>
                            ))}
                          </div>
                        )}

                        {searchResults.matchedBerita.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Berita & Siaran Pers</span>
                            {searchResults.matchedBerita.map((b) => (
                              <Link
                                key={b.id}
                                href="/berita"
                                onClick={() => setSearchQuery("")}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-dpr-navy hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 transition-all text-left group"
                              >
                                <div className="pr-2">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors line-clamp-1">{b.title}</h4>
                                  <p className="text-[10px] text-dpr-emerald-dark dark:text-dpr-gold font-semibold">{b.category} • {b.date}</p>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold opacity-60 shrink-0" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Right Bar (Theme toggle + Menu toggle) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-dpr-gold"
                title="Ganti Mode"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-dpr-gold" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-dpr-emerald-dark" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer — Standalone overlay fixed to viewport */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex flex-col pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 w-full max-h-[85vh] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-b-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    GIS PORTAL
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    GOLKAR INTERNSHIP STUDENT
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                <div className="space-y-1">
                  <p className="px-2 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Navigasi Utama
                  </p>
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActivePath = pathname === link.href;

                    if (link.isExternal) {
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-amber-500" />
                            <span>{link.name}</span>
                          </div>
                        </a>
                      );
                    }

                    return (
                      <div key={link.name} className="flex flex-col">
                        <Link
                          href={link.href}
                          onClick={() => !link.children && setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                            isActivePath && !link.children
                              ? "bg-dpr-emerald/10 dark:bg-dpr-gold/20 text-dpr-emerald-dark dark:text-dpr-gold border border-dpr-emerald/30 dark:border-dpr-gold/30"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActivePath ? "text-dpr-emerald dark:text-dpr-gold" : "text-dpr-emerald dark:text-dpr-gold opacity-75"}`} />
                            <span>{link.name}</span>
                          </div>
                          {link.children && <ChevronRight className="w-4 h-4 text-slate-400" />}
                        </Link>

                        {link.children && (
                          <div className="pl-9 pr-2 py-1 space-y-1">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                  pathname === child.href
                                    ? "text-dpr-emerald dark:text-dpr-gold bg-emerald-50 dark:bg-dpr-gold/10"
                                    : "text-slate-600 dark:text-slate-400 hover:text-dpr-emerald dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

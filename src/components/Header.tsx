/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCmsContent } from "@/components/CmsProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Users, Newspaper, Info, Menu, X, Landmark, ChevronRight, Sun, Moon, MessageSquare, UserCheck, Globe, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const { siteContent } = useCmsContent();

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

  useEffect(() => {
    fetch("/api/user/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated === true) {
          setIsUserLoggedIn(true);
          setLoggedInUserName(data.user?.name || null);
        } else {
          setIsUserLoggedIn(false);
          setLoggedInUserName(null);
        }
      })
      .catch(() => { setIsUserLoggedIn(false); setLoggedInUserName(null); });
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

  type NavLink = { name: string; href: string; icon: any; isExternal?: boolean; children?: { name: string; href: string }[] };
  const navLinks: NavLink[] = [
    { name: "Beranda", href: "/", icon: Landmark },
    { name: "Timeline", href: "/timeline", icon: Clock },
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
        { name: "Pimpinan & Pengurus", href: "/profil/pimpinan" }
      ]
    },
    { name: "Aspirasi", href: "/aspirasi", icon: MessageSquare },
  ];

  // The external link from CMS
  const customLink = siteContent?.navbarLink || { label: "GOLKAR", url: "https://fraksigolkar.com/" };
  if (customLink.label) {
    navLinks.push({ name: customLink.label, href: customLink.url, icon: Globe, isExternal: true });
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-transparent"
            : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 shadow-md"
        }`}
      >
        <div className={`w-full mx-auto transition-all duration-300 ease-in-out ${
          isScrolled
            ? "max-w-[1200px] px-3 sm:px-5 py-2 sm:py-2.5"
            : "max-w-[1536px] px-2 sm:px-4 lg:px-5 py-1 sm:py-1.5 min-h-[52px] sm:min-h-[68px] lg:min-h-[82px]"
        }`}>
          <div className={`transition-all duration-300 ease-in-out ${
            isScrolled
              ? "bg-white/92 dark:bg-slate-800/92 backdrop-blur-xl rounded-xl lg:rounded-full shadow-2xl border border-slate-200/90 dark:border-white/15 px-3 sm:px-5 py-1.5 sm:py-2"
              : ""
          }`}>
          <div className="flex items-center justify-between gap-1 sm:gap-2 lg:gap-3 relative">
            
            {/* Logo & Brand (Logo Partai Golkar & Logo GIS) */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 group shrink-0 py-0.5">
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
                {/* Logo Golkar Internship Student */}
                <img
                  src="/images/golkar-internship-trans.png"
                  alt="GIS"
                  className={`w-auto object-contain drop-shadow-md transition-all duration-150 ${
                    isScrolled ? "h-6 sm:h-8 lg:h-9" : "h-[30px] sm:h-[42px] lg:h-[52px]"
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
                    className="flex flex-col justify-center shrink-0"
                  >
                    <span className="text-xs sm:text-[11px] lg:text-xs xl:text-[13px] 2xl:text-[15px] font-black text-slate-900 dark:text-white tracking-tight leading-tight whitespace-nowrap">
                      GOLKAR INTERNSHIP STUDENT
                    </span>
                    <span className="text-[8px] sm:text-[8px] lg:text-[8px] 2xl:text-[10px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase mt-0.5 whitespace-nowrap">
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
                    className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                  >
                    <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-amber-500">
                      GIS
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-3 shrink-0">
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
                      className="relative flex items-center gap-1 lg:gap-1.5 px-1 lg:px-1.5 xl:px-2 py-1.5 rounded-full text-[10px] lg:text-[11px] xl:text-[13px] 2xl:text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
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
                      className={`relative flex items-center gap-1 lg:gap-1.5 px-1 lg:px-1.5 xl:px-2 py-1.5 rounded-full text-[10px] lg:text-[11px] xl:text-[13px] 2xl:text-sm whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "font-black text-amber-600 dark:text-amber-400"
                          : "font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-1 lg:gap-1.5">
                        <Icon className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>{link.name}</span>
                      </span>
                    </Link>

                    {link.children && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-1 group-hover:translate-y-0 p-1.5 space-y-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
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

            {/* Theme Toggle & Actions (Desktop) */}
            <div className="hidden xl:flex items-center gap-1 lg:gap-2 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/15 text-slate-700 dark:text-dpr-gold hover:scale-110 transition-transform shadow-sm"
                title={theme === "dark" ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-dpr-gold animate-spin-slow" />
                ) : (
                  <Moon className="w-4 h-4 text-amber-700" />
                )}
              </button>

              <Link
                href={isUserLoggedIn ? "/user/dashboard" : "/user/login"}
                className="inline-flex items-center gap-1 lg:gap-1.5 px-2 lg:px-3 xl:px-4 py-1.5 lg:py-2 text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-xs font-black rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-sm hover:shadow-md hover:scale-105 transition-all shrink-0 border border-amber-500/30"
              >
                <UserCheck className="w-3 h-3 lg:w-3.5 lg:h-3.5 shrink-0" />
                <span className="truncate max-w-[45px] lg:max-w-[60px] xl:max-w-[100px] 2xl:max-w-[150px]">
                  {isUserLoggedIn ? (loggedInUserName || "Portal Peserta") : "Register / Login"}
                </span>
              </Link>
            </div>

            {/* Mobile Right Bar (Theme toggle + Menu toggle) */}
            <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-dpr-gold"
                title="Ganti Mode"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-dpr-gold" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />}
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
        </div>
      </header>
      {/* Constant height spacer so layout never reflows or jitters when floating header triggers */}
      <div className="h-[52px] sm:h-[68px] lg:h-[82px]" />

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
                              ? "bg-amber-100 dark:bg-amber-400/20 text-amber-900 dark:text-amber-400 border border-amber-300 dark:border-amber-400/30"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActivePath ? "text-amber-600 dark:text-amber-400" : "text-amber-600 dark:text-amber-400 opacity-75"}`} />
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
                                    ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10"
                                    : "text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
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

                {/* Mobile Login / User Menu */}
                <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
                  <Link
                    href={isUserLoggedIn ? "/user/dashboard" : "/user/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-black rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-md hover:shadow-lg transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>
                      {isUserLoggedIn ? (loggedInUserName || "Portal Peserta") : "Register / Login"}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

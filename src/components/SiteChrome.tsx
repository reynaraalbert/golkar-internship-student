"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserNavbar from "@/components/UserNavbar";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isParticipantLoggedIn, setIsParticipantLoggedIn] = useState(false);

  useEffect(() => {
    async function checkParticipantAuth() {
      try {
        const res = await fetch("/api/user/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsParticipantLoggedIn(true);
            return;
          }
        }
      } catch {
        // silent catch
      }
      setIsParticipantLoggedIn(false);
    }
    checkParticipantAuth();
  }, [pathname]);

  const isAdmin = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/user/login" || pathname === "/user/register";
  const isUserDashboardPage = pathname?.startsWith("/user/");

  // 1. Admin area: pure admin shell (no public header/footer/ticker)
  if (isAdmin) {
    return <>{children}</>;
  }

  // 2. Pure auth pages (/user/login & /user/register): PURE page (NO header, NO footer, NO ticker)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // 3. User Dashboard pages (/user/dashboard, /user/profil, /user/posisi): Participant Navbar + Page, NO public header/footer
  if (isUserDashboardPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
        <UserNavbar />
        <main className="flex-grow">{children}</main>
      </div>
    );
  }

  // 4. Public pages (Beranda /, /profil, /aspirasi, dll)
  // Jika peserta sedang login, tampilkan UserNavbar di atas agar pas pencet "Beranda" tetap ada navbar E-Magang dengan info peserta & tombol Keluar!
  if (isParticipantLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <UserNavbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  }

  // Pengunjung publik biasa (belum login)
  return (
    <div className="min-h-screen flex flex-col">
      <Ticker />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

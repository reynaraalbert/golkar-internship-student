"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserNavbar from "@/components/UserNavbar";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

  // 4. Public pages — always use the regular Header (Header handles showing user name when logged in)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

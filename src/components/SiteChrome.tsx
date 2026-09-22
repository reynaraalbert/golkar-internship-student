"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Ticker from "@/components/Ticker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin area has its own chrome; skip the public header/footer/ticker.
    return <>{children}</>;
  }

  return (
    <>
      <Ticker />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}

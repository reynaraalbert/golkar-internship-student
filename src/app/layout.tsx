import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CmsProvider } from "@/components/CmsProvider";
import SiteChrome from "@/components/SiteChrome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Komisi XIII DPR RI - Reformasi Hukum, HAM & Antikorupsi",
  description:
    "Portal Resmi Komisi XIII Dewan Perwakilan Rakyat Republik Indonesia (DPR RI) Periode 2024-2029 membidangi Reformasi Hukum, HAM, Imigrasi, Pemasyarakatan, KPK, BNPT, LPSK, Komnas HAM & BKN.",
  keywords: [
    "Komisi XIII DPR RI",
    "DPR RI",
    "Reformasi Hukum",
    "HAM",
    "Imigrasi",
    "Pemasyarakatan",
    "KPK",
    "BNPT",
    "LPSK",
    "BKN",
    "Dewan Perwakilan Rakyat",
  ],
  authors: [{ name: "Komisi XIII DPR RI" }],
  icons: {
    icon: [
      { url: "/images/logo-dpr.svg", type: "image/svg+xml" },
    ],
    shortcut: "/images/logo-dpr.svg",
    apple: "/images/logo-dpr.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased batik-bg transition-colors duration-300">
        <ThemeProvider>
          <CmsProvider>
            <SiteChrome>{children}</SiteChrome>
          </CmsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

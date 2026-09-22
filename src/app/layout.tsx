import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CmsProvider } from "@/components/CmsProvider";
import SiteChrome from "@/components/SiteChrome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "GOLKAR INTERNSHIP STUDENT",
  description:
    "Portal GOLKAR INTERNSHIP STUDENT — Program magang resmi Partai Golkar untuk mahasiswa Indonesia.",
  keywords: [
    "Golkar",
    "Partai Golkar",
    "Internship",
    "Magang",
    "Mahasiswa",
    "Program Magang Golkar",
  ],
  authors: [{ name: "GOLKAR INTERNSHIP STUDENT" }],
  icons: {
    icon: [
      { url: "/images/golkar-internship.png", type: "image/png" },
    ],
    shortcut: "/images/golkar-internship.png",
    apple: "/images/golkar-internship.png",
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

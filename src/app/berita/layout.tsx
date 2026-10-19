import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita & Siaran Pers",
  description: "Berita, pengumuman, dan siaran pers terbaru seputar Golkar Internship Student.",
  alternates: { canonical: "/berita" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pimpinan & Pengurus",
  description: "Struktur pimpinan dan pengurus Golkar Internship Student.",
  alternates: { canonical: "/profil/pimpinan" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

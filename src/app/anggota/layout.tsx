import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peserta Magang",
  description: "Daftar peserta magang Golkar Internship Student yang dipublikasikan oleh pengelola program.",
  alternates: { canonical: "/anggota" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

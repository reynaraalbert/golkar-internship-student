import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda Kegiatan",
  description: "Jadwal kegiatan dan agenda program Golkar Internship Student.",
  alternates: { canonical: "/agenda" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Program",
  description: "Gambaran umum, sejarah, visi-misi, dan pengurus Golkar Internship Student.",
  alternates: { canonical: "/profil" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

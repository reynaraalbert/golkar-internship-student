import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi & Misi",
  description: "Visi, misi, dan nilai utama Golkar Internship Student.",
  alternates: { canonical: "/profil/visi-misi" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

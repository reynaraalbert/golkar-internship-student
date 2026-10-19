import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sejarah Program",
  description: "Latar belakang dan perjalanan program Golkar Internship Student.",
  alternates: { canonical: "/profil/sejarah" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

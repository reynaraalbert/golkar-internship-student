import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aspirasi & Masukan",
  description: "Sampaikan pertanyaan, masukan, atau kendala terkait program Golkar Internship Student.",
  alternates: { canonical: "/aspirasi" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

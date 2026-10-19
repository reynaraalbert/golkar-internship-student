import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peta Situs",
  description: "Peta navigasi seluruh halaman portal Golkar Internship Student.",
  alternates: { canonical: "/peta-situs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

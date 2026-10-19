import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat Penggunaan",
  description: "Syarat dan ketentuan penggunaan portal Golkar Internship Student.",
  alternates: { canonical: "/syarat-penggunaan" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

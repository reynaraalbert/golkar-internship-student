import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan pemrosesan dan pelindungan data pribadi peserta dan pengunjung portal.",
  alternates: { canonical: "/kebijakan-privasi" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

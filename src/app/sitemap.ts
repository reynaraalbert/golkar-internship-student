import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://golkar-internship-student.vercel.app"
  ).replace(/\/$/, "");

  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/profil", priority: 0.8, changeFrequency: "monthly" },
    { path: "/profil/sejarah", priority: 0.7, changeFrequency: "monthly" },
    { path: "/profil/visi-misi", priority: 0.7, changeFrequency: "monthly" },
    { path: "/profil/pimpinan", priority: 0.7, changeFrequency: "monthly" },
    { path: "/berita", priority: 0.8, changeFrequency: "weekly" },
    { path: "/agenda", priority: 0.7, changeFrequency: "weekly" },
    { path: "/anggota", priority: 0.6, changeFrequency: "monthly" },
    { path: "/timeline", priority: 0.7, changeFrequency: "monthly" },
    { path: "/aspirasi", priority: 0.6, changeFrequency: "monthly" },
    { path: "/kebijakan-privasi", priority: 0.4, changeFrequency: "yearly" },
    { path: "/syarat-penggunaan", priority: 0.4, changeFrequency: "yearly" },
    { path: "/peta-situs", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

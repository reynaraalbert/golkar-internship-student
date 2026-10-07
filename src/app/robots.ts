import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/user/dashboard/", "/user/pengalaman/"],
    },
    sitemap: "https://golkarinternship.com/sitemap.xml", // Replace with your actual domain
  };
}

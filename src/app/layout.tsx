import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CmsProvider } from "@/components/CmsProvider";
import SiteChrome from "@/components/SiteChrome";
import { DialogRenderer } from "@/components/admin/DialogSystem";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL("https://golkarinternship.com"), // Placeholder URL, to be updated by the user
  title: {
    default: "GOLKAR INTERNSHIP STUDENT | Program Magang Resmi Partai Golkar",
    template: "%s | GOLKAR INTERNSHIP STUDENT",
  },
  description:
    "Portal Resmi Golkar Internship Student (GIS). Program magang komprehensif bagi mahasiswa unggul Indonesia untuk mendapatkan pengalaman langsung di bidang politik, kebijakan publik, dan pemerintahan.",
  keywords: [
    "Golkar Internship Student",
    "Magang DPR RI",
    "Magang Fraksi Golkar DPR RI",
    "Portal Magang Mandiri DPR RI",
    "Magang Mahasiswa",
    "Program Magang DPR",
    "Magang Mandiri",
    "Internship Politik",
    "Kebijakan Publik",
  ],
  authors: [{ name: "Partai Golkar" }, { name: "Golkar Internship Student" }],
  creator: "Partai Golkar",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://golkarinternship.com",
    title: "GOLKAR INTERNSHIP STUDENT | Program Magang Resmi",
    description: "Program magang komprehensif bagi mahasiswa unggul Indonesia untuk mendapatkan pengalaman langsung di bidang politik, kebijakan publik, dan pemerintahan.",
    siteName: "GOLKAR INTERNSHIP STUDENT",
    images: [
      {
        url: "/images/golkar-internship-trans.png",
        width: 1200,
        height: 630,
        alt: "GOLKAR INTERNSHIP STUDENT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOLKAR INTERNSHIP STUDENT | Program Magang Resmi",
    description: "Program magang komprehensif bagi mahasiswa unggul Indonesia untuk mendapatkan pengalaman langsung di bidang politik, kebijakan publik, dan pemerintahan.",
    creator: "@partaigolkar",
    images: ["/images/golkar-internship-trans.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/golkar-internship-trans.png", type: "image/png" },
    ],
    shortcut: "/images/golkar-internship-trans.png",
    apple: "/images/golkar-internship-trans.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: "Golkar Internship Student",
  url: "https://golkarinternship.com",
  logo: "https://golkarinternship.com/images/golkar-internship-trans.png",
  description: "Program magang resmi Partai Golkar untuk mahasiswa Indonesia.",
  sameAs: [
    "https://www.instagram.com/golkar.internship",
    "https://twitter.com/partaigolkar"
  ]
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased batik-bg transition-colors duration-300">
        <ThemeProvider>
          <CmsProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SiteChrome>{children}</SiteChrome>
            <DialogRenderer />
          </CmsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

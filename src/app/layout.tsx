import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CmsProvider } from "@/components/CmsProvider";
import SiteChrome from "@/components/SiteChrome";
import { DialogRenderer } from "@/components/admin/DialogSystem";
import SplashScreen from "@/components/SplashScreen";
import CustomCursor from "@/components/CustomCursor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL("https://golkarinternship.com"), // Placeholder URL, to be updated by the user
  title: {
    default: "Golkar Internship Student | Program Magang Resmi Partai Golkar",
    template: "%s | Golkar Internship Student",
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
    title: "Golkar Internship Student | Program Magang Resmi",
    description: "Program magang komprehensif bagi mahasiswa unggul Indonesia untuk mendapatkan pengalaman langsung di bidang politik, kebijakan publik, dan pemerintahan.",
    siteName: "Golkar Internship Student",
    images: [
      {
        url: "/images/golkar-internship-trans.png",
        width: 1200,
        height: 630,
        alt: "Golkar Internship Student Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golkar Internship Student | Program Magang Resmi",
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
        {/* Runs before paint: if the splash already played this session, hide it
            instantly (avoids a flash of the SSR splash before hydration).
            Key must match SPLASH_SESSION_KEY in components/SplashScreen.tsx */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("gis-splash-seen"))document.documentElement.setAttribute("data-gis-splash","seen")}catch(e){}`,
          }}
        />
        <ThemeProvider>
          <CmsProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SplashScreen />
            <SiteChrome>{children}</SiteChrome>
            <DialogRenderer />
            <CustomCursor />
          </CmsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

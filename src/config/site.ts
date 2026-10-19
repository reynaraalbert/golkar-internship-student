/**
 * Single source of truth for official programme information.
 *
 * Values below were confirmed by the programme owner:
 *  - Secretariat: Gedung Nusantara I Lt. 12
 *  - Service hours: Senin-Jumat 08.00-16.00 WIB
 *  - Certificate issuer: Fraksi Partai Golkar DPR RI
 *  - GIS has its own social media accounts.
 *
 * TODO(konfirmasi-owner): isi URL akun media sosial resmi GIS pada
 * `social.instagram`, `social.youtube`, dan `social.twitter` bila sudah final.
 */

export const siteConfig = {
  name: "Golkar Internship Student",
  shortName: "GIS",
  organizer: "Fraksi Partai Golkar DPR RI",
  certificateIssuer: "Fraksi Partai Golkar DPR RI",
  description:
    "Program magang resmi Fraksi Partai Golkar DPR RI bagi mahasiswa Indonesia untuk belajar langsung tentang legislasi, kebijakan publik, dan parlemen.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://golkar-internship-student.vercel.app",
  secretariat: {
    address: "Gedung Nusantara I Lt. 12, Jl. Jend. Gatot Subroto, Jakarta Pusat, DKI Jakarta 10270",
    addressLines: ["Gedung Nusantara I Lt. 12", "Jl. Jend. Gatot Subroto", "Jakarta Pusat, DKI Jakarta 10270"],
    hours: "Senin - Jumat, 08.00 - 16.00 WIB",
    email: "golkarinternshipstudent@gmail.com",
    phone: "(021) 5715878",
    phoneHref: "tel:+62215715878",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.44977461462!2d106.79727507582531!3d-6.204342260775988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6ba89b33a59%3A0xb35a507cb8e2db26!2sGedung%20Nusantara%20I%20DPR%20RI!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid",
    mapsOpenUrl: "https://maps.google.com/?q=Gedung+Nusantara+I+DPR+RI",
  },
  social: {
    // TODO(konfirmasi-owner): URL di bawah masih menunjuk kanal Fraksi Partai
    // Golkar. Ganti dengan URL akun resmi GIS setelah tautannya dikonfirmasi.
    instagram: "https://instagram.com/fraksigolkar",
    youtube: "https://youtube.com/fraksigolkar",
    twitter: "https://twitter.com/fraksigolkar",
    facebook: "https://facebook.com/fraksigolkar",
    website: "https://fraksigolkar.com",
    label: "Kanal resmi Golkar Internship Student",
  },
} as const;

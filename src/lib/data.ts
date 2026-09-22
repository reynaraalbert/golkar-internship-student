// ============================================================
// data.ts — GOLKAR INTERNSHIP STUDENT
// TODO: Isi dengan data konten project Golkar Internship Student
// ============================================================

// --- INTERFACES ---

export interface Member {
  id: string;
  nomorAnggota: string;
  name: string;
  role: string;
  fraksi: string;
  dapil: string;
  photoUrl: string;
  email: string;
  bio: string;
  billsLed: string[];
  pendidikan?: string;
  masaJabatan?: string;
  komisi?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  summary: string;
  content: string;
  imageUrl: string;
  documentUrl?: string;
  isFeatured?: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  type: string;
  partner: string;
  date: string;
  time: string;
  location: string;
  status: "LIVE NOW" | "SCHEDULED" | "COMPLETED";
  summary: string;
  streamUrl?: string;
  pdfDownloadUrl?: string;
}

export interface MitraKerja {
  id: string;
  name: string;
  acronym: string;
  ministerOrHead: string;
  focusArea: string;
  logoUrl: string;
  description: string;
}

export interface NewsSubmission {
  id: string;
  biodata: {
    tipePenulis: string;
    nama: string;
    email: string;
    nomorAnggota?: string;
    fraksi?: string;
    dapil?: string;
    masaJabatan?: string;
    nip?: string;
    unitKerja?: string;
    jabatan?: string;
    pekerjaan?: string;
    instansi?: string;
  };
  artikel: {
    judul: string;
    kategori: string;
    tanggal: string;
    ringkasan: string;
    isiBerita: string;
    tags?: string;
    sumber?: { judul: string; url: string }[];
    publishedNewsId?: string;
  };
  attachments: {
    imageUrl?: string;
    documentUrl?: string;
  };
  status: "pending" | "approved" | "declined" | "takedown";
  proofreadNotes?: string;
  createdAt: string;
}

export interface Aspirasi {
  id: string;
  mode: "Terbuka" | "Anonim";
  name?: string;
  email?: string;
  whatsapp?: string;
  subject: string;
  message: string;
  category: string;
  status: "new" | "reviewed" | "resolved";
  createdAt: string;
}

export interface FooterContent {
  brandDescription: string;
  address: string;
  phone: string;
  email: string;
  transparencyText: string;
  ppidText: string;
  copyrightText: string;
}

export interface MapsContent {
  embedUrl: string;
  openUrl: string;
  address: string;
  description: string;
}

export interface PageSubsection {
  id: string;
  title: string;
  fields: Record<string, string>;
}

export interface PageSection {
  id: string;
  title: string;
  subsections: PageSubsection[];
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  sections: PageSection[];
}

export interface MitraKerjaSiteContent {
  tagline: string;
}

export interface HeroContent {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  statuteQuote: string;
  statuteProgressLabel: string;
  statuteProgressValue: string;
}

export interface StatBarContent {
  label1: string;
  label2: string;
  label3: string;
  label4: string;
}

export interface MitraSectionContent {
  tagline: string;
  title: string;
  description: string;
}

export interface KontakContent {
  serviceTitle: string;
  serviceHours: string;
  email: string;
  mediaTitle: string;
  instagramHandle: string;
  youtubeLabel: string;
  twitterHandle: string;
  websiteLabel: string;
  aspirasiTitle: string;
  aspirasiDesc: string;
  aspirasiCta: string;
}

export interface SiteContent {
  hero: HeroContent;
  statBar: StatBarContent;
  mitraSection: MitraSectionContent;
  kontak: KontakContent;
  footer: FooterContent;
  maps: MapsContent;
}

// --- DATA ---
// TODO: Isi dengan data konten GOLKAR INTERNSHIP STUDENT

export const PIMPINAN_KOMISI: Member[] = [];

export const ANGGOTA_KOMISI: Member[] = [];

export const MITRA_KERJA: MitraKerja[] = [];

export const BERITA_LIST: NewsArticle[] = [];

export const AGENDA_LIST: AgendaItem[] = [];

export const STATS = {
  totalMembers: 0,
  totalPimpinan: 0,
  mitraKerjaCount: 0,
  activeBills: 0,
  completedHearings: 0,
  aspirationsProcessed: 0,
};

// --- SITE CONTENT ---
// TODO: Sesuaikan dengan konten GOLKAR INTERNSHIP STUDENT

export const SiteContent: SiteContent = {
  hero: {
    badge: "GOLKAR INTERNSHIP STUDENT",
    title1: "Partai Golkar",
    title2: "GOLKAR INTERNSHIP STUDENT",
    subtitle: "Program Magang Mahasiswa",
    description:
      "Program magang resmi Partai Golkar untuk mahasiswa Indonesia.",
    ctaPrimaryLabel: "Daftar Peserta",
    ctaPrimaryHref: "/anggota",
    ctaSecondaryLabel: "Lihat Program",
    ctaSecondaryHref: "/agenda",
    statuteQuote:
      "Membangun generasi muda Indonesia yang berkarakter, kompeten, dan berdedikasi.",
    statuteProgressLabel: "Program Internship",
    statuteProgressValue: "Aktif",
  },
  statBar: {
    label1: "Peserta Magang",
    label2: "Departemen",
    label3: "Program Kegiatan",
    label4: "Alumni",
  },
  mitraSection: {
    tagline: "PROGRAM UNGGULAN",
    title: "Program GOLKAR INTERNSHIP STUDENT",
    description:
      "Program magang Golkar untuk mahasiswa Indonesia berprestasi.",
  },
  kontak: {
    serviceTitle: "Informasi Kontak",
    serviceHours: "Senin - Jumat: 09.00 – 17.00 WIB",
    email: "golkarinternshipstudent@gmail.com",
    mediaTitle: "Media Sosial Resmi",
    instagramHandle: "@golkarinternshipstudent",
    youtubeLabel: "Golkar Official",
    twitterHandle: "@partaigolkar",
    websiteLabel: "golkar.or.id",
    aspirasiTitle: "Punya Pertanyaan?",
    aspirasiDesc: "Sampaikan pertanyaan dan aspirasi Anda.",
    aspirasiCta: "Hubungi Kami",
  },
  footer: {
    brandDescription:
      "GOLKAR INTERNSHIP STUDENT adalah program magang resmi Partai Golkar untuk mahasiswa Indonesia.",
    address: "DPP Partai Golkar, Jl. Anggrek Nelly Murni, Jakarta Barat",
    phone: "(021) 530-0652",
    email: "golkarinternshipstudent@gmail.com",
    transparencyText:
      "Program GOLKAR INTERNSHIP STUDENT berkomitmen pada transparansi dan akuntabilitas.",
    ppidText: "Jam Kerja: Senin - Jumat (09:00 - 17:00 WIB)",
    copyrightText: "© Build by Reynara Albert Pradana. Hak Cipta Dilindungi Undang-Undang.",
  },
  maps: {
    embedUrl:
      "https://maps.google.com/maps?q=DPP+Partai+Golkar+Jakarta&t=&z=15&ie=UTF8&iwloc=&output=embed",
    openUrl: "https://maps.google.com",
    address: "DPP Partai Golkar, Jl. Anggrek Nelly Murni, Jakarta Barat.",
    description: "DPP Partai Golkar, Jl. Anggrek Nelly Murni, Jakarta Barat.",
  },
};

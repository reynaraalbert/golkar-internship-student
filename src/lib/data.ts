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
  pinned?: boolean;
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
  // Values (the big numbers shown)
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  // Labels shown below the numbers
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

export interface InternshipTrack {
  id: string;
  title: string;
  category: string;
  desc: string;
  skills: string; // comma-separated
}

export interface SelectionStep {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  desc: string;
}

export interface Requirement {
  id: string;
  text: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  univ: string;
  major: string;
  role: string;
  quote: string;
  photo: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface AnnouncementBar {
  badge: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SectionHeader {
  title: string;
  subtitle: string;
  description?: string;
}

export interface MedsosContent {
  title: string;
  subtitle: string;
  instagram: string;
  twitter: string;
  youtube: string;
  facebook: string;
}

export interface CtaContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface SiteContent {
  hero: HeroContent;
  statBar: StatBarContent;
  keunggulan: SectionHeader;
  lowongan: SectionHeader;
  tahapan: SectionHeader;
  syarat: SectionHeader;
  alumni: SectionHeader;
  berita: SectionHeader;
  faq: SectionHeader;
  kontak: KontakContent;
  medsos: MedsosContent;
  cta: CtaContent;
  footer: FooterContent;
  maps: MapsContent;
  announcement?: AnnouncementBar;
  navbarLink?: { label: string; url: string; };
  keunggulanItems?: any[];
  tahapanItems?: any[];
  syaratItems?: string[];
  alumniItems?: any[];
  mitraSection?: MitraSectionContent;
  maintenanceMode?: boolean;
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
    title1: "Program Magang",
    title2: "GOLKAR INTERNSHIP STUDENT",
    subtitle: "Pendidikan Politik & Praktik Parlemen Terpadu",
    description: "Program magang resmi terintegrasi dari Fraksi Partai Golkar untuk mahasiswa unggul Indonesia dalam membentuk pemimpin masa depan yang inovatif.",
    ctaPrimaryLabel: "Mulai Pendaftaran",
    ctaPrimaryHref: "/user/login",
    ctaSecondaryLabel: "Jelajahi Program",
    ctaSecondaryHref: "/agenda",
    statuteQuote: "3 - 6 Bulan",
    statuteProgressLabel: "Pilihan Posisi",
    statuteProgressValue: "5 Divisi",
  },
  statBar: {
    value1: "1,500+", value2: "30+", value3: "98%", value4: "100+",
    label1: "Alumni Magang", label2: "Universitas Partner", label3: "Kepuasan Mentorship", label4: "Policy Brief Dihasilkan",
  },
  keunggulan: { title: "Keunggulan Program Magang", subtitle: "Mengapa Golkar Internship Student Menjadi Pilihan Tepat untuk Karir Anda?" },
  lowongan: { title: "Posisi Magang Tersedia", subtitle: "Temukan peluang pengembangan karir yang sesuai dengan kompetensi Anda." },
  tahapan: { title: "Proses Seleksi Magang", subtitle: "Alur rekrutmen transparan dan terstruktur." },
  syarat: { title: "Persyaratan & Dokumen", subtitle: "Kriteria kualifikasi bagi calon peserta magang." },
  alumni: { title: "Kisah Sukses Alumni", subtitle: "Simak testimoni inspiratif dari lulusan program Golkar Internship Student." },
  berita: { title: "Informasi Publik & Siaran Pers", subtitle: "Pembaruan terkini seputar kegiatan dan pencapaian magang." },
  faq: { title: "Pertanyaan Umum (FAQ)", subtitle: "Temukan jawaban atas pertanyaan seputar program magang." },
  kontak: {
    serviceTitle: "Pusat Bantuan & Layanan",
    serviceHours: "Senin - Jumat, 08.00 - 16.00 WIB",
    email: "golkarinternshipstudent@gmail.com",
    mediaTitle: "Media & Kemitraan",
    instagramHandle: "@fraksigolkar",
    youtubeLabel: "Fraksi Partai Golkar DPR RI",
    twitterHandle: "@fraksigolkar",
    websiteLabel: "fraksigolkar.com",
    aspirasiTitle: "Ruang Aspirasi Peserta",
    aspirasiDesc: "Sampaikan laporan, masukan, dan evaluasi Anda untuk pengembangan program yang lebih baik.",
    aspirasiCta: "Sampaikan Aspirasi",
  },
  medsos: { title: "Jejaring Sosial Kami", subtitle: "Dapatkan informasi terkini melalui kanal resmi kami.", instagram: "https://instagram.com/fraksigolkar", twitter: "https://twitter.com/fraksigolkar", youtube: "https://youtube.com/fraksigolkar", facebook: "https://facebook.com/fraksigolkar" },
  cta: { title: "Tentukan Arah Karir Anda", subtitle: "Mari berkembang bersama para profesional di legislatif tingkat nasional.", buttonText: "Mulai Registrasi", buttonLink: "/user/login" },
  footer: {
    brandDescription: "Golkar Internship Student (GIS) merupakan program pembinaan eksekutif antara Fraksi Partai Golkar DPR RI dan Perguruan Tinggi terkemuka di Indonesia.",
    address: `Gedung Nusantara I Lt. 12
Jl. Jenderal Gatot Subroto
Jakarta Pusat, DKI Jakarta 10270`,
    phone: "(021) 5715878",
    email: "golkarinternshipstudent@gmail.com",
    transparencyText: "Fraksi Partai Golkar DPR RI senantiasa memegang teguh prinsip keterbukaan informasi dan akuntabilitas kelembagaan.",
    ppidText: "Layanan informasi publik dikelola melalui Pejabat Pengelola Informasi dan Dokumentasi (PPID).",
    copyrightText: "© 2024 Golkar Internship Student. Hak Cipta Dilindungi.",
  },
  maps: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4527710352516!2d106.79737117582522!3d-6.203953562497672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6baaa569f1d%3A0x8f3c734493b82a0b!2sGedung%20DPR%2FMPR%20RI!5e0!3m2!1sid!2sid!4v1707010537482!5m2!1sid!2sid",
    openUrl: "https://maps.app.goo.gl/3QWjE4vUu4V7hAxb9",
    address: `Gedung Nusantara I Lt. 12
Jl. Jenderal Gatot Subroto
Jakarta Pusat, 10270`,
    description: "Kantor Pusat Operasional Golkar Internship Student",
  },
  announcement: {
    badge: "PENGUMUMAN PENTING",
    text: "Pendaftaran Golkar Internship Student Batch Terbaru resmi dibuka!",
    ctaLabel: "Registrasi Disini",
    ctaHref: "/user/login",
  },
  navbarLink: {
    label: "GOLKAR",
    url: "https://fraksigolkar.com/",
  },
};

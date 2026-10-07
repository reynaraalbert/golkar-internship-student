import re

with open('src/lib/data.ts', 'r', encoding='utf-8') as f:
    code = f.read()

obj_replacement = '''export const SiteContent: SiteContent = {
  hero: {
    badge: "GOLKAR INTERNSHIP STUDENT",
    title1: "Partai Golkar",
    title2: "GOLKAR INTERNSHIP STUDENT",
    subtitle: "Program Magang Mahasiswa",
    description: "Program magang resmi Partai Golkar untuk mahasiswa Indonesia.",
    ctaPrimaryLabel: "Daftar Peserta",
    ctaPrimaryHref: "/anggota",
    ctaSecondaryLabel: "Lihat Program",
    ctaSecondaryHref: "/agenda",
    statuteQuote: "Membangun generasi muda Indonesia yang berkarakter, kompeten, dan berdedikasi.",
    statuteProgressLabel: "Program Internship",
    statuteProgressValue: "Aktif",
  },
  statBar: {
    value1: "1,500+", value2: "30+", value3: "98%", value4: "100+",
    label1: "Alumni Magang", label2: "Universitas Partner", label3: "Kepuasan Mentorship", label4: "Policy Brief Dihasilkan",
  },
  keunggulan: { title: "Keunggulan Magang", subtitle: "Kenapa memilih magang di Golkar Internship Student?" },
  lowongan: { title: "Lowongan Magang", subtitle: "Posisi yang tersedia untuk batch ini." },
  tahapan: { title: "Tahapan Seleksi", subtitle: "Alur proses penerimaan magang." },
  syarat: { title: "Syarat & Berkas Administrasi", subtitle: "Persyaratan umum untuk mendaftar." },
  alumni: { title: "Kata Alumni", subtitle: "Testimoni dari alumni Golkar Internship Student." },
  berita: { title: "Berita & Siaran Pers", subtitle: "Informasi terbaru seputar kegiatan magang." },
  faq: { title: "FAQ", subtitle: "Pertanyaan yang sering diajukan." },
  kontak: {
    serviceTitle: "Layanan Bantuan & Aspirasi",
    serviceHours: "Senin - Jumat, 08.00 - 16.00 WIB",
    email: "magang@fraksigolkar.com",
    mediaTitle: "Media & Publikasi",
    instagramHandle: "@fraksigolkar",
    youtubeLabel: "Fraksi Partai Golkar DPR RI",
    twitterHandle: "@fraksigolkar",
    websiteLabel: "fraksigolkar.com",
    aspirasiTitle: "Punya Aspirasi?",
    aspirasiDesc: "Sampaikan aspirasi, kritik, dan saran Anda melalui portal pengaduan resmi.",
    aspirasiCta: "Kirim Aspirasi",
  },
  medsos: { title: "Media Sosial", subtitle: "Ikuti aktivitas kami.", instagram: "https://instagram.com/fraksigolkar", twitter: "https://twitter.com/fraksigolkar", youtube: "https://youtube.com/fraksigolkar", facebook: "https://facebook.com/fraksigolkar" },
  cta: { title: "Siap Bergabung?", subtitle: "Tingkatkan kapasitas dirimu sekarang.", buttonText: "Daftar Peserta", buttonLink: "/user/login" },
  footer: {
    brandDescription: "Golkar Internship Student adalah program kolaborasi antara Fraksi Partai Golkar DPR RI dengan Universitas terbaik di Indonesia.",
    address: "Gedung Nusantara I Lt. 12\\nJl. Jenderal Gatot Subroto\\nJakarta Pusat, DKI Jakarta 10270",
    phone: "(021) 5715878",
    email: "sekretariat@fraksigolkar.com",
    transparencyText: "Fraksi Partai Golkar DPR RI berkomitmen untuk mewujudkan tata kelola organisasi yang transparan dan akuntabel sesuai dengan UU Keterbukaan Informasi Publik.",
    ppidText: "Layanan PPID tersedia untuk publikasi data.",
    copyrightText: "© Build by Reynara Albert Pradana. Hak Cipta Dilindungi Undang-Undang.",
  },
  maps: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4526001235123!2d106.79758711476906!3d-6.203998995508821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6ba89387a2d%3A0x64e8371ea3e80455!2sGedung%20Nusantara%20I%20DPR%2FRI!5e0!3m2!1sid!2sid!4v1652331599554!5m2!1sid!2sid",
    openUrl: "https://goo.gl/maps/QG2yQG2yQG2yQG2yQ",
    address: "Gedung Nusantara I Lt. 12\\nJl. Jenderal Gatot Subroto\\nJakarta Pusat, 10270",
    description: "Kantor Sekretariat Fraksi Partai Golkar DPR RI",
  },
  announcement: {
    badge: "INFO TERBARU",
    text: "Pendaftaran Golkar Internship Student Batch 6 telah dibuka!",
    ctaLabel: "Daftar Sekarang",
    ctaHref: "/user/login",
  },
  navbarLink: {
    label: "GOLKAR",
    url: "https://fraksigolkar.com/",
  },
};'''

code = re.sub(r'export const SiteContent: SiteContent = \{[\s\S]*?^};\n', obj_replacement + '\\n', code, flags=re.MULTILINE)

with open('src/lib/data.ts', 'w', encoding='utf-8') as f:
    f.write(code)

with open('src/components/admin/AdminShell.tsx', 'r', encoding='utf-8') as f:
    shell = f.read()

replacement_shell = '''  {
    groupTitle: "BERANDA ( / )",
    items: [
      { name: "Hero & Banner", href: "/admin/beranda", icon: Home },
      { name: "Statistik Counter", href: "/admin/beranda/statistik", icon: BarChart3 },
      { name: "Keunggulan Magang", href: "/admin/beranda/keunggulan", icon: Target },
      { name: "Lowongan Magang", href: "/admin/beranda/lowongan", icon: Briefcase },
      { name: "Tahapan Seleksi", href: "/admin/beranda/tahapan", icon: List },
      { name: "Syarat & Berkas Administrasi", href: "/admin/beranda/syarat", icon: FileText },
      { name: "Kata Alumni", href: "/admin/beranda/alumni", icon: MessageSquare },
      { name: "Berita & Siaran Pers", href: "/admin/beranda/berita", icon: Newspaper },
      { name: "FAQ", href: "/admin/beranda/faq", icon: HelpCircle },
      { name: "Informasi Kontak", href: "/admin/beranda/kontak", icon: MapPin },
      { name: "Media Sosial", href: "/admin/beranda/medsos", icon: Radio },
      { name: "CTA Siap Bergabung", href: "/admin/beranda/cta", icon: Megaphone },
      { name: "Footer", href: "/admin/beranda/footer", icon: PanelBottom },
    ],
  },'''

shell = re.sub(r'  \{\n    groupTitle: "BERANDA \( / \)",\n    items: \[[^\]]*\],\n  \},', replacement_shell, shell)

with open('src/components/admin/AdminShell.tsx', 'w', encoding='utf-8') as f:
    f.write(shell)

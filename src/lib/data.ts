export interface Member {
  id: string;
  nomorAnggota: string;
  name: string;
  role: "Ketua Komisi" | "Wakil Ketua Komisi" | "Anggota Komisi";
  fraksi: "PDI Perjuangan" | "Partai Golkar" | "Partai Gerindra" | "Partai NasDem" | "PKB" | "PKS" | "PAN" | "Partai Demokrat";
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
  category: "Legislasi" | "Pengawasan" | "Anggaran" | "Siaran Pers" | "Kunjungan Kerja";
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
  type: "Rapat Kerja (Raker)" | "Rapat Dengar Pendapat (RDP)" | "Rapat Dengar Pendapat Umum (RDPU)" | "Kunjungan Kerja Spesifik";
  partner: string; // e.g. Kemenkum / KPK / Komnas HAM
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

// --- DATA MOCKS ---

export const PIMPINAN_KOMISI: Member[] = [
  {
    id: 'm-1',
    nomorAnggota: 'A-001',
    name: 'Hj. Dewi Asmara, S.H., M.H.',
    role: 'Ketua Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Jawa Barat IV',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    email: 'dewi.asmara@dpr.go.id',
    bio: 'Hj. Dewi Asmara, S.H., M.H. adalah legislator senior Fraksi Partai Golkar yang telah mengabdikan diri di dunia legislasi selama lebih dari dua dekade. Sebagai Ketua Komisi XIII DPR RI Periode 2024–2029, beliau memimpin pengawasan terhadap reformasi hukum, HAM, keimigrasian, pemasyarakatan, dan antikorupsi. Keahliannya di bidang hukum tata negara menjadi landasan kuat dalam memimpin rapat kerja bersama Kemenkum, KemenHAM, dan KPK.',
    billsLed: ['RUU Bantuan Hukum Bagi Masyarakat Miskin', 'RUU Pemasyarakatan (Revisi)', 'RUU Hak Cipta (Amendemen)'],
    pendidikan: 'S2 Hukum, Universitas Indonesia',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
];

export const ANGGOTA_KOMISI: Member[] = [
  ...PIMPINAN_KOMISI,
  {
    id: 'm-3',
    nomorAnggota: 'A-101',
    name: 'H. Andi Rio Idris Padjalangi, S.H., M.Kn.',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Sulawesi Selatan II',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    email: 'andi.rio@dpr.go.id',
    bio: 'H. Andi Rio Idris Padjalangi adalah politisi Golkar dari Sulawesi Selatan yang konsisten memperjuangkan reformasi peradilan pidana dan perlindungan hak saksi. Aktif dalam Rapat Dengar Pendapat dengan LPSK dan mendorong perluasan program perlindungan saksi kejahatan terorganisir.',
    billsLed: ['Perbaikan Regulasi KUHAP', 'Program Perlindungan Saksi Tipikor'],
    pendidikan: 'S2 Kenotariatan, Universitas Hasanuddin',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-4',
    nomorAnggota: 'A-102',
    name: 'Supriansa, S.H., M.H.',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Sulawesi Selatan III',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    email: 'supriansa@dpr.go.id',
    bio: 'Supriansa, S.H., M.H. adalah anggota DPR RI dua periode dari Sulawesi Selatan III. Fokus pengawasannya mencakup keimigrasian di wilayah timur Indonesia, penindakan TPPO di bandara-bandara internasional, serta harmonisasi regulasi imigrasi dengan standar internasional.',
    billsLed: ['Pencegahan TPPO di Bandara', 'Revisi UU Keimigrasian No. 6 Tahun 2011', 'Pengawasan Jalur Imigrasi Timur Indonesia'],
    pendidikan: 'S2 Hukum, Universitas Muslim Indonesia',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-5',
    nomorAnggota: 'A-103',
    name: 'Christina Aryani, S.H., M.H.',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'DKI Jakarta III',
    photoUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=600&auto=format&fit=crop',
    email: 'christina.aryani@dpr.go.id',
    bio: 'Christina Aryani adalah pakar hukum internasional yang berfokus pada penanganan kejahatan siber lintas negara, trafficking manusia, dan penguatan sistem perlindungan WNI di luar negeri. Sebelum menjadi legislator, ia aktif sebagai advokat dan analis kebijakan migrasi internasional.',
    billsLed: ['Perlindungan WNI Luar Negeri', 'RUU Keimigrasian', 'MOU Perlindungan PMI dengan Negara Penempatan'],
    pendidikan: 'S2 Hukum Internasional, Universitas Padjajaran',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-6',
    nomorAnggota: 'A-104',
    name: 'Hj. Endang Agustini Syarwan Hamid, S.IP.',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Riau I',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    email: 'endang.agustini@dpr.go.id',
    bio: 'Hj. Endang Agustini Syarwan Hamid adalah politisi Golkar senior dari Riau yang aktif dalam perjuangan legislasi perlindungan perempuan. Sebagai anggota Komisi XIII, beliau mendorong penguatan jaminan HAM dan akses keadilan bagi kelompok rentan di wilayah Sumatera.',
    billsLed: ['RUU Perlindungan Perempuan Korban Kekerasan', 'Harmonisasi RUU TPKS dengan Regulasi HAM'],
    pendidikan: 'S1 Ilmu Politik, Universitas Riau',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-7',
    nomorAnggota: 'A-105',
    name: 'Drg. Hj. Marlinda Irwanti, S.E.',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Kalimantan Timur',
    photoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=600&auto=format&fit=crop',
    email: 'marlinda.irwanti@dpr.go.id',
    bio: 'Drg. Hj. Marlinda Irwanti memiliki latar belakang medis dan ekonomi yang unik. Sebagai anggota Komisi XIII, beliau berfokus pada standar kesehatan di Lembaga Pemasyarakatan dan Rumah Tahanan, mendorong pemenuhan layanan medis yang layak bagi warga binaan di wilayah Kalimantan.',
    billsLed: ['Standar Pelayanan Kesehatan di Lapas & Rutan', 'Pengawasan Kondisi Kesehatan WBP Kalimantan'],
    pendidikan: 'Dokter Gigi (Drg.), Universitas Gadjah Mada; S1 Ekonomi, STIE Balikpapan',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-8',
    nomorAnggota: 'A-106',
    name: 'H. Muhammad Farhan',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Jawa Barat II',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
    email: 'muh.farhan@dpr.go.id',
    bio: 'H. Muhammad Farhan adalah politisi muda Golkar berlatar belakang jurnalis dan pegiat media sosial. Aktif mendorong keterbukaan informasi publik dan reformasi komunikasi di lembaga penegak hukum. Dikenal sebagai legislator yang vokal soal kebebasan pers dan perlindungan jurnalis.',
    billsLed: ['Transparansi Lembaga Hukum Negara', 'RUU Perlindungan Jurnalis', 'Keterbukaan Informasi Lembaga Hukum'],
    pendidikan: 'S1 Komunikasi, Universitas Padjajaran',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-9',
    nomorAnggota: 'A-107',
    name: 'H. Zainal Abidin Domba',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Kalimantan Barat I',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
    email: 'zainal.domba@dpr.go.id',
    bio: 'H. Zainal Abidin Domba adalah tokoh masyarakat Kalimantan Barat yang berjuang keras untuk pemenuhan akses keadilan bagi masyarakat di wilayah terpencil dan perbatasan. Aktif menginisiasi program layanan hukum keliling dan klinik hukum gratis di daerah-daerah terpinggirkan.',
    billsLed: ['Layanan Hukum di Wilayah Terpencil & Perbatasan', 'Program Bantuan Hukum Gratis 3T'],
    pendidikan: 'S1 Hukum, Universitas Tanjungpura',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-10',
    nomorAnggota: 'A-108',
    name: 'Ir. H. A. Bakri HM, S.E.',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Jambi',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    email: 'a.bakri@dpr.go.id',
    bio: 'Ir. H. A. Bakri HM adalah pengusaha dan politisi senior Golkar dari Jambi yang dikenal atas dedikasinya dalam penguatan tata kelola pemerintahan daerah yang bersih dan bebas korupsi. Aktif berkolaborasi dengan KPK dalam program pencegahan korupsi di Provinsi Jambi.',
    billsLed: ['Penguatan Tata Kelola Daerah & Pencegahan Korupsi', 'Pengawasan Integritas Pejabat Daerah Jambi'],
    pendidikan: 'S1 Teknik, Universitas Jambi; S1 Ekonomi, STIE Jambi',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
  {
    id: 'm-11',
    nomorAnggota: 'A-109',
    name: 'H. Ilham Pangestu, S.T.',
    role: 'Anggota Komisi',
    fraksi: 'Partai Golkar',
    dapil: 'Sumatera Barat I',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    email: 'ilham.pangestu@dpr.go.id',
    bio: 'H. Ilham Pangestu adalah legislator muda berbasis teknologi dari Sumatera Barat. Sebagai anggota Komisi XIII, beliau fokus pada modernisasi sistem penegakan hukum berbasis teknologi informasi, digitalisasi layanan imigrasi, dan penerapan e-government di lembaga pemasyarakatan.',
    billsLed: ['Digitalisasi Layanan Imigrasi Nasional', 'Sistem Informasi Pemasyarakatan Terpadu', 'Smart Border Management'],
    pendidikan: 'S1 Teknik Informatika, Universitas Andalas',
    masaJabatan: '2024 – 2029',
    komisi: 'Komisi XIII'
  },
];

export const MITRA_KERJA: MitraKerja[] = [

  {
    id: "mitra-1",
    name: "Kementerian Hukum RI",
    acronym: "Kemenkum",
    ministerOrHead: "Menteri Hukum RI",
    focusArea: "Pembentukan Regulasi, Administrasi Hukum Umum, dan Pelayanan Kekayaan Intelektual",
    logoUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop",
    description: "Bertanggung jawab atas penyusunan rancangan undang-undang, harmonisasi regulasi nasional, pendataan legalitas korporasi, serta perlindungan hak cipta dan paten."
  },
  {
    id: "mitra-2",
    name: "Kementerian Hak Asasi Manusia RI",
    acronym: "KemenHAM",
    ministerOrHead: "Menteri HAM RI",
    focusArea: "Pemajuan, Perlindungan, Pemenuhan, dan Penegakan Hak Asasi Manusia",
    logoUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
    description: "Kementerian khusus pemajuan HAM yang menyusun kriteria Kabupaten/Kota Peduli HAM, penanganan laporan indikasi pelanggaran HAM sipil dan ekonomi."
  },
  {
    id: "mitra-3",
    name: "Kementerian Imigrasi dan Pemasyarakatan RI",
    acronym: "Kemenimipas",
    ministerOrHead: "Menteri Imigrasi & Pemasyarakatan",
    focusArea: "Pengawasan Perbatasan, Pelayanan Paspor/Visa, Pembinaan Lapas & Rutan",
    logoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop",
    description: "Mengelola pemeriksaan lalu lintas keimigrasian nasional, penindakan kejahatan lintas negara, serta rehabilitasi & resosialisasi warga binaan pemasyarakatan."
  },
  {
    id: "mitra-4",
    name: "Komisi Pemberantasan Korupsi",
    acronym: "KPK",
    ministerOrHead: "Ketua KPK",
    focusArea: "Pencegahan, Penindakan, dan Koordinasi Pemberantasan Korupsi",
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
    description: "Lembaga negara independen yang berwenang melakukan penyelidikan, penyidikan, dan penuntutan tindak pidana korupsi serta pendidikan antikorupsi."
  },
  {
    id: "mitra-5",
    name: "Komisi Nasional Hak Asasi Manusia",
    acronym: "Komnas HAM",
    ministerOrHead: "Ketua Komnas HAM",
    focusArea: "Pengkajian, Penelitian, Penyuluhan, Pemantauan, dan Mediasi HAM",
    logoUrl: "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=600&auto=format&fit=crop",
    description: "Lembaga mandiri setingkat lembaga negara untuk mengembangkan kondisi yang kondusif bagi pelaksanaan Hak Asasi Manusia di Indonesia."
  },
  {
    id: "mitra-6",
    name: "Lembaga Perlindungan Saksi dan Korban",
    acronym: "LPSK",
    ministerOrHead: "Ketua LPSK",
    focusArea: "Perlindungan Fisik, Hukum, Medis, & Psikologis bagi Saksi dan Korban Pidana",
    logoUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=600&auto=format&fit=crop",
    description: "Lembaga penanggung jawab perlindungan hak-hak saksi dan korban dalam proses peradilan pidana tindak kejahatan terorganisir dan kekerasan."
  },
  {
    id: "mitra-7",
    name: "Badan Nasional Penanggulangan Terorisme",
    acronym: "BNPT",
    ministerOrHead: "Kepala BNPT",
    focusArea: "Kesiapsiagaan Nasional, Kontra Radikalisasi, dan Deradikalisasi",
    logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop",
    description: "Lembaga pemerintah nonkementerian yang bertugas menyusun kebijakan nasional, strategi, dan program penanggulangan terorisme di tanah air."
  },
  {
    id: "mitra-8",
    name: "Badan Kepegawaian Negara",
    acronym: "BKN",
    ministerOrHead: "Kepala BKN",
    focusArea: "Manajemen Aparatur Sipil Negara (ASN) dan Pembinaan Kepegawaian",
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    description: "Lembaga penyelenggara seleksi CASN, pembinaan karier, penilaian kinerja, dan digitalisasi data kepegawaian ASN nasional."
  }
];

export const BERITA_LIST: NewsArticle[] = [
  {
    id: "news-1",
    title: "Komisi XIII DPR RI Sepakati Rencana Kerja dan Anggaran Kemenkum & KemenHAM Tahun 2025",
    slug: "komisi-xiii-sepakati-rkakl-kemenkum-kemenham-2025",
    category: "Anggaran",
    date: "24 Agustus 2026",
    readTime: "4 Menit Baca",
    author: "Humas Komisi XIII DPR RI",
    summary: "Rapat Kerja Komisi XIII DPR RI secara resmi menyetujui Pagu Indikatif Rencana Kerja dan Anggaran (RKA-K/L) Kementerian Hukum RI dan Kementerian HAM RI untuk mempercepat digitalisasi layanan hukum publik.",
    content: `Dalam Rapat Kerja yang dipimpin oleh Ketua Komisi XIII DPR RI Willy Aditya, komisi memberikan persetujuan anggaran untuk program prioritas pemajuan HAM di daerah 3T serta perbaikan infrastruktur teknologi keimigrasian nasional.

Willy Aditya menegaskan bahwa anggaran yang disetujui harus benar-benar menyentuh masyarakat bawah, khususnya dalam pemberian bantuan hukum gratis bagi warga tidak mampu yang menghadapi permasalahan perdata maupun pidana.

"Kita pastikan bahwa pemisahan kementerian ini berbuah pada fokus kerja yang lebih tajam. Kementerian HAM harus mampu menjamin hak dasar warga negara, sementara Kementerian Hukum fokus pada kepastian regulasi," tegas Willy di Ruang Rapat Komisi XIII, Gedung Nusantara II, Senayan.`,
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    documentUrl: "#",
    isFeatured: true
  },
  {
    id: "news-2",
    title: "Sidak Komisi XIII di Lapas Klas I Cipinang: Dorong Sistem Smart Prison dan Reduksi Overcrowding",
    slug: "sidak-komisi-xiii-lapas-cipinang-smart-prison",
    category: "Kunjungan Kerja",
    date: "22 Agustus 2026",
    readTime: "5 Menit Baca",
    author: "Tim Media Parlemen",
    summary: "Tim Kunjungan Kerja Spesifik Komisi XIII meninjau langsung kelayakan fasilitas Lapas Cipinang dan menyoroti perlunya percepatan otomatisasi pembinaan warga binaan.",
    content: `Tim Komisi XIII DPR RI yang dipimpin Wakil Ketua Sugiat Santoso melakukan sidak mendadak ke Lapas Klas I Cipinang Jakarta. Sidak ini bertujuan mengevaluasi kondisi nyata kapasitas hunian (overcrowding) dan implementasi standar HAM dalam pembinaan narapidana.

Sugiat menekankan bahwa program re-integrasi sosial dan pendidikan vokasional di dalam lapas harus diperkuat agar warga binaan memiliki keterampilan kerja yang produktif saat bebas nanti.

"Kemenimipas perlu mempercepat transisi menuju Smart Prison dengan pengawasan berbasis CCTV intelijen AI untuk mencegah penyelundupan barang terlarang sekaligus menjamin keamanan petugas," ujar Sugiat.`,
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    documentUrl: "#",
    isFeatured: true
  },
  {
    id: "news-3",
    title: "Komisi XIII DPR Rapat Bersama KPK: Tekankan Integritas dan Pencegahan Korupsi Sektor Layanan Publik",
    slug: "komisi-xiii-rdp-kpk-pencegahan-korupsi",
    category: "Pengawasan",
    date: "19 Agustus 2026",
    readTime: "3 Menit Baca",
    author: "Pemberitaan DPR RI",
    summary: "Komisi XIII mendorong koordinasi KPK dengan aparat penegak hukum lainnya dalam sistem deteksi dini kecurangan anggaran pada proyek infrastruktur strategis nasional.",
    content: `Komisi XIII DPR RI menggelar Rapat Dengar Pendapat (RDP) dengan jajaran Pimpinan KPK di Senayan. Agenda utama membahas capaian pencegahan korupsi sektor keimigrasian, pengadaan barang dan jasa, serta penguatan indeks integritas nasional.

Dewi Asmara menyatakan dukungan penuh parlemen terhadap penguatan anggaran operasional KPK, selaras dengan tuntutan transparansi publik yang semakin tinggi.`,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    documentUrl: "#"
  },
  {
    id: "news-4",
    title: "RUU Perlindungan Saksi dan Korban Masuk Prolegnas Prioritas Usulan Komisi XIII",
    slug: "ruu-perlindungan-saksi-korban-prolegnas-prioritas",
    category: "Legislasi",
    date: "15 Agustus 2026",
    readTime: "4 Menit Baca",
    author: "Humas Komisi XIII",
    summary: "Revisi UU No. 31 Tahun 2014 tentang Perlindungan Saksi dan Korban resmi masuk dalam daftar pembahasan Prolegnas Prioritas guna memberikan jaminan keamanan komprehensif bagi Justice Collaborator.",
    content: `Komisi XIII sepakat bahwa hak-hak saksi dan korban dalam kasus kejahatan terorganisir, pelecehan seksual, dan Tindak Pidana Perdagangan Orang (TPPO) butuh klausul perlindungan darurat yang lebih responsif dan fleksibel.`,
    imageUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=800&auto=format&fit=crop",
    documentUrl: "#"
  },
  {
    id: "news-5",
    title: "Siaran Pers: Tanggapan Komisi XIII Mengenai Modernisasi Autogate Keimigrasian Perbatasan",
    slug: "siaran-pers-modernisasi-autogate-imigrasi",
    category: "Siaran Pers",
    date: "10 Agustus 2026",
    readTime: "2 Menit Baca",
    author: "Pimpinan Komisi XIII DPR RI",
    summary: "Komisi XIII menyambut positif pengoperasian 100 unit autogate biometrik baru di Bandara Internasional Soekarno-Hatta dan Ngurah Rai Bali.",
    content: `Langkah Kementerian Imigrasi dan Pemasyarakatan menerapkan autogate biometrik berbasis pengenalan wajah (facial recognition) dinilai mempercepat alur kedatangan wisatawan mancanegara sekaligus memperketat penyaringan DPO internasional.`,
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
  }
];

export const AGENDA_LIST: AgendaItem[] = [
  {
    id: "ag-1",
    title: "Rapat Kerja Komisi XIII DPR RI dengan Menteri Hukum RI & Menteri HAM RI",
    type: "Rapat Kerja (Raker)",
    partner: "Kemenkum & KemenHAM",
    date: "Senin, 25 Agustus 2026",
    time: "10:00 - 15:00 WIB",
    location: "Ruang Rapat Komisi XIII, Gedung Nusantara II Lantai 1, Senayan",
    status: "LIVE NOW",
    summary: "Pembahasan Rencana Kerja & Anggaran Kementerian/Lembaga (RKA-K/L) TA 2027 serta evaluasi capaian pelaksanaan Prolegnas TA 2026.",
    streamUrl: "https://www.youtube.com/embed/live_stream?channel=DPRRI",
    pdfDownloadUrl: "#"
  },
  {
    id: "ag-2",
    title: "Rapat Dengar Pendapat (RDP) dengan Pimpinan Komisi Nasional Hak Asasi Manusia (Komnas HAM)",
    type: "Rapat Dengar Pendapat (RDP)",
    partner: "Komnas HAM",
    date: "Selasa, 26 Agustus 2026",
    time: "13:30 - 17:00 WIB",
    location: "Ruang Rapat Komisi XIII, Gedung Nusantara II, Senayan",
    status: "SCHEDULED",
    summary: "Laporan Pemantauan Kasus Pelanggaran HAM di Wilayah Industri Ekstraktif dan Pembahasan draf rekomendasi kebijakan pemulihan hak korban.",
    pdfDownloadUrl: "#"
  },
  {
    id: "ag-3",
    title: "Rapat Dengar Pendapat Umum (RDPU) bersama Koalisi Masyarakat Sipil Perlindungan Saksi & Korban",
    type: "Rapat Dengar Pendapat Umum (RDPU)",
    partner: "LPSK & Masyarakat Sipil",
    date: "Kamis, 28 Agustus 2026",
    time: "10:00 - 12:30 WIB",
    location: "Ruang Rapat Komisi XIII, Gedung Nusantara II, Senayan",
    status: "SCHEDULED",
    summary: "Penjaringan aspirasi publik terkait materi muatan draf RUU Perlindungan Saksi dan Korban (Revisi UU 31/2014).",
    pdfDownloadUrl: "#"
  },
  {
    id: "ag-4",
    title: "Kunjungan Kerja Spesifik Komisi XIII ke Kantor Imigrasi Kelas I Khusus TPI Ngurah Rai Bali",
    type: "Kunjungan Kerja Spesifik",
    partner: "Kemenimipas",
    date: "Jumat, 29 Agustus 2026",
    time: "09:00 - 16:00 WITA",
    location: "Kanim Kelas I Khusus TPI Ngurah Rai, Badung, Bali",
    status: "SCHEDULED",
    summary: "Pengawasan langsung implementasi Sistem Autogate Biometrik dan penindakan WNA pelanggar izin tinggal (overstay).",
    pdfDownloadUrl: "#"
  },
  {
    id: "ag-5",
    title: "Rapat Dengar Pendapat dengan Kepala Badan Penanggulangan Terorisme (BNPT)",
    type: "Rapat Dengar Pendapat (RDP)",
    partner: "BNPT",
    date: "Rabu, 20 Agustus 2026",
    time: "10:00 - 14:00 WIB",
    location: "Ruang Rapat Komisi XIII, Gedung Nusantara II, Senayan",
    status: "COMPLETED",
    summary: "Evaluasi Pelaksanaan Program Kemitraan Kesiapsiagaan Nasional dan Kontra Radikalisasi Ruang Digital.",
    pdfDownloadUrl: "#"
  }
];

export const STATS = {
  totalMembers: 46,
  totalPimpinan: 5,
  mitraKerjaCount: 8,
  activeBills: 12,
  completedHearings: 84,
  aspirationsProcessed: 1420
};

// --- EDITABLE SITE CONTENT (used by CMS + rendered by public pages) ---

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

export const SiteContent: SiteContent = {
  hero: {
    badge: "Parlemen Transparan & Akuntabel • Periode 2024-2029",
    title1: "Dewan Perwakilan Rakyat Republik Indonesia (DPR RI)",
    title2: "KOMISI XIII",
    subtitle: "Reformasi Hukum & HAM",
    description:
      "Komisi XIII DPR RI bertugas mengawasi legislasi, anggaran, dan kinerja penegakan hukum nasional bersama Kementerian Hukum, KemenHAM, Kemenimipas, KPK, BNPT, Komnas HAM, dan LPSK.",
    ctaPrimaryLabel: "Daftar Anggota Komisi",
    ctaPrimaryHref: "/anggota",
    ctaSecondaryLabel: "Jadwal Rapat Kerja",
    ctaSecondaryHref: "/agenda",
    statuteQuote:
      "Menjamin kepastian hukum yang adil serta perlindungan hak asasi seluruh warga negara Indonesia tanpa diskriminasi.",
    statuteProgressLabel: "Fokus Pengawasan HAM & Imigrasi",
    statuteProgressValue: "94% Target",
  },
  statBar: {
    label1: "Anggota Parlemen",
    label2: "Kementerian & Lembaga",
    label3: "Rapat Kemitraan",
    label4: "Aspirasi Diproses",
  },
  mitraSection: {
    tagline: "KEMITRAAN STRATEGIS",
    title: "Mitra Kerja Komisi XIII DPR RI",
    description:
      "Komisi XIII melakukan pengawasan berkala dan pembagian alokasi anggaran bersama 8 Kementerian & Lembaga Negara Republik Indonesia.",
  },
  kontak: {
    serviceTitle: "Informasi Jam Layanan",
    serviceHours: "Senin & Kamis: 14.00 – 17.00 WIB (Ruang Sekretariat)",
    email: "komisi13@dpr.go.id",
    mediaTitle: "Akun Media Sosial Resmi",
    instagramHandle: "@komisi13dpr",
    youtubeLabel: "DPR RI Official",
    twitterHandle: "@DPR_RI",
    websiteLabel: "dpr.go.id",
    aspirasiTitle: "Punya Aspirasi Rakyat?",
    aspirasiDesc: "Sampaikan aduan & masukan Anda di Halaman Khusus Aspirasi.",
    aspirasiCta: "Form Aspirasi",
  },
  footer: {
    brandDescription:
      "Komisi XIII DPR RI membidangi Reformasi Hukum, Hak Asasi Manusia (HAM), Keimigrasian, Pemasyarakatan, Antikorupsi, dan Kepegawaian Negara.",
    address: "Gedung Nusantara II Lantai 1, Jl. Jend. Gatot Subroto, Jakarta Pusat 10270",
    phone: "(021) 5715-341 / Ext. 1300",
    email: "golkarinternshipstudent@gmail.com",
    transparencyText:
      "Setiap hasil risalah rapat, draf rancangan undang-undang, serta risalah pengawasan Komisi XIII DPR RI bersifat terbuka dan dapat diakses oleh publik sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.",
    ppidText: "Jam Kerja: Senin - Jumat (08:00 - 16:00 WIB)",
    copyrightText: "© Build by Reynara Albert Pradana. Hak Cipta Dilindungi Undang-Undang.",
  },
  maps: {
    embedUrl:
      "https://maps.google.com/maps?q=Gedung+Nusantara+II+DPR+RI&t=&z=15&ie=UTF8&iwloc=&output=embed",
    openUrl: "https://maps.google.com",
    address:
      "Gedung Nusantara II, Kompleks Parlemen DPR/MPR RI, Jl. Jend. Gatot Subroto, Senayan, Jakarta Pusat.",
    description:
      "Gedung Nusantara II, Kompleks Parlemen DPR/MPR RI, Jl. Jend. Gatot Subroto, Senayan, Jakarta Pusat.",
  },
};

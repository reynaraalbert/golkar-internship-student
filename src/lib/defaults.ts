import type { SiteContent } from "@/lib/data";

export const EMPTY_STATS = {
  totalMembers: 0,
  totalPimpinan: 0,
  mitraKerjaCount: 0,
  activeBills: 0,
  completedHearings: 0,
  aspirationsProcessed: 0,
};

export const EMPTY_SITECONTENT: SiteContent = {
  hero: {
    badge: "", title1: "", title2: "", subtitle: "", description: "",
    ctaPrimaryLabel: "", ctaPrimaryHref: "", ctaSecondaryLabel: "", ctaSecondaryHref: "",
    statuteQuote: "", statuteProgressLabel: "", statuteProgressValue: "",
  },
  statBar: { value1: "1,500+", value2: "30+", value3: "98%", value4: "100+", label1: "Alumni Magang", label2: "Universitas Partner", label3: "Kepuasan Mentorship", label4: "Policy Brief Dihasilkan" },
  keunggulan: { title: "Keunggulan Program Magang", subtitle: "Mengapa Golkar Internship Student Menjadi Pilihan Tepat untuk Karir Anda?" },
  keunggulanItems: [
    { title: "Mentorship Eksklusif", desc: "Dapatkan bimbingan langsung dari Anggota DPR RI, tenaga ahli komisi, serta pakar kebijakan publik yang berpengalaman di tingkat nasional.", iconName: "Users" },
    { title: "Sertifikasi Magang Mandiri", desc: "Peroleh sertifikat resmi dari DPP Partai Golkar yang dapat diajukan secara mandiri oleh peserta untuk proses konversi SKS di kampus masing-masing.", iconName: "Award" },
    { title: "Pengalaman Praktis Parlemen", desc: "Terlibat aktif dalam Rapat Dengar Pendapat (RDP), penyusunan naskah akademik, dan pengawasan implementasi regulasi.", iconName: "Gavel" },
    { title: "Jaringan Profesional Nasional", desc: "Bangun koneksi strategis dengan tokoh politik, profesional multi-sektor, dan alumni berprestasi dari seluruh Indonesia.", iconName: "Globe" },
  ],
  tahapanItems: [
    { step: "01", title: "Registrasi Portal", subtitle: "Pendaftaran Akun Terpadu", desc: "Akses portal resmi Golkar Internship Student dan daftarkan diri Anda secara gratis untuk memulai langkah awal.", iconName: "UserPlus" },
    { step: "02", title: "Kelengkapan Berkas", subtitle: "Unggah Dokumen Persyaratan", desc: "Lengkapi profil akademik, tentukan divisi penempatan, dan unggah Curriculum Vitae (CV) serta dokumen pendukung lainnya.", iconName: "FileCheck" },
    { step: "03", title: "Seleksi Terpadu", subtitle: "Evaluasi & Wawancara", desc: "Proses seleksi kompetensi dan wawancara profesional bersama tim verifikator untuk menilai kelayakan dan kesiapan kandidat.", iconName: "UserCheck" },
    { step: "04", title: "Orientasi & Onboarding", subtitle: "Pengumuman Kelulusan", desc: "Tahap penyambutan peserta terpilih, pembekalan materi intensif, dan pengalokasian mentor fraksi secara resmi.", iconName: "GraduationCap" },
  ],
  syaratItems: [
    "Mahasiswa S1/D4 (minimal Semester 5) atau D3 (minimal Semester 4) berstatus aktif.",
    "Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 (skala 4.00) dari institusi terakreditasi.",
    "Melampirkan Surat Rekomendasi/Pengantar resmi dari pihak Fakultas atau Perguruan Tinggi.",
    "Menyertakan Curriculum Vitae (CV) terbaru berbasis ATS dan Portofolio (jika tersedia).",
    "Melampirkan Transkrip Nilai Akademik terbaru yang telah dilegalisasi atau diverifikasi.",
    "Menyertakan Pasfoto formal terbaru dan pindaian Kartu Tanda Penduduk (KTP) / Kartu Tanda Mahasiswa (KTM)."
  ],
  alumniItems: [
    { quote: "Magang di Golkar Internship Student adalah titik balik dalam perjalanan karir saya. Mendapatkan mentor langsung dari Anggota DPR memberikan wawasan politik yang tidak diajarkan di kampus.", name: "Budi Santoso", univ: "Universitas Indonesia", major: "Ilmu Politik", role: "Legislative Research Assistant", photo: "https://i.pravatar.cc/150?img=11" },
    { quote: "Saya belajar banyak tentang bagaimana kebijakan publik dirumuskan. Terlibat dalam perancangan draft RUU benar-benar mengasah kemampuan analisis hukum saya secara nyata.", name: "Nadia Saphira", univ: "Universitas Gadjah Mada", major: "Ilmu Hukum", role: "Legal Drafter Assistant", photo: "https://i.pravatar.cc/150?img=5" },
    { quote: "Jaringan alumni yang kuat dan sesi mentorship rutin sangat membantu. Sampai sekarang saya masih sering berdiskusi dengan mentor saya di Fraksi terkait isu-isu strategis.", name: "Kevin Pratama", univ: "Institut Teknologi Bandung", major: "Sistem Informasi", role: "Data Analyst & IT Support", photo: "https://i.pravatar.cc/150?img=15" },
  ],
  lowongan: { title: "Posisi Magang Tersedia", subtitle: "Temukan peluang pengembangan karir yang sesuai dengan kompetensi Anda." },
  tahapan: { title: "Proses Seleksi Magang", subtitle: "Alur rekrutmen transparan dan terstruktur." },
  syarat: { title: "Persyaratan & Dokumen", subtitle: "Kriteria kualifikasi bagi calon peserta magang." },
  alumni: { title: "Kisah Sukses Alumni", subtitle: "Simak testimoni inspiratif dari lulusan program Golkar Internship Student." },
  berita: { title: "Informasi Publik & Siaran Pers", subtitle: "Pembaruan terkini seputar kegiatan dan pencapaian magang." },
  faq: { title: "Pertanyaan Umum (FAQ)", subtitle: "Temukan jawaban atas pertanyaan seputar program magang." },
  kontak: {
    serviceTitle: "", serviceHours: "", email: "", mediaTitle: "", instagramHandle: "", youtubeLabel: "",
    twitterHandle: "", websiteLabel: "", aspirasiTitle: "", aspirasiDesc: "", aspirasiCta: "",
  },
  medsos: { title: "Terhubung Bersama Kami", subtitle: "Ikuti perkembangan dan kegiatan terbaru melalui media sosial.", instagram: "", twitter: "", youtube: "", facebook: "" },
  cta: { title: "Ambil Langkah Pertama Karir Anda", subtitle: "Tingkatkan kapasitas kepemimpinan dan pemahaman politik melalui program magang unggulan kami.", buttonText: "Mulai Pendaftaran", buttonLink: "/user/login" },
  footer: { brandDescription: "", address: "", phone: "", email: "", transparencyText: "", ppidText: "", copyrightText: "" },
  maps: { embedUrl: "", openUrl: "", address: "", description: "" },
  announcement: { badge: "INFO", text: "", ctaLabel: "Daftar Sekarang", ctaHref: "/user/login" },
  navbarLink: { label: "GOLKAR", url: "https://fraksigolkar.com/" },
};

export const DEFAULT_TRACKS = [
  { id: "1", title: "Riset & Analisis Kebijakan", category: "Legislative Research", desc: "Fokus pada analisis draft RUU, penyusunan policy brief naskah akademik, dan pengawasan regulasi pemerintah.", skills: "Analisis Hukum,Policy Briefing,Drafting RUU,Riset Data Sekunder" },
  { id: "2", title: "Humas & Media Digital", category: "Public Relations", desc: "Pengelolaan strategi komunikasi publik, pembuatan konten berita, desain visual, dan dokumentasi rapat DPR RI.", skills: "Copywriting,Desain Grafis,Social Media,Jurnalistik Parlemen" },
  { id: "3", title: "Hubungan Luar Negeri", category: "International Affairs", desc: "Kajian diplomasi parlemen internasional, analisis kerjasama antar-negara, dan kajian isu geostrategis global.", skills: "Diplomasi Publik,Kajian Geopolitik,Bahasa Asing,Bilateral Studies" },
  { id: "4", title: "Data Science & Sistem IT", category: "IT & System Development", desc: "Pengolahan data aspirasi masyarakat, analisis sentimen publik, dan optimasi portal aplikasi magang.", skills: "Web Development,Data Analysis,Database System,UI/UX Design" },
  { id: "5", title: "Kesekretariatan & Protocol", category: "Executive Support", desc: "Dukungan operasional rapat komisi, notulensi persidangan, tata kelola kearsipan, dan keprotokoleran persidangan.", skills: "Notulensi Rapat,Administrasi Publik,Keprotokoleran,Arsip Digital" },
];

export const DEFAULT_STEPS = [
  { id: "1", step: "01", title: "Registrasi Portal", subtitle: "Pendaftaran Akun Terpadu", desc: "Akses portal resmi Golkar Internship Student dan daftarkan diri Anda secara gratis untuk memulai langkah awal." },
  { id: "2", step: "02", title: "Kelengkapan Berkas", subtitle: "Unggah Dokumen Persyaratan", desc: "Lengkapi profil akademik, tentukan divisi penempatan, dan unggah Curriculum Vitae (CV) serta dokumen pendukung lainnya." },
  { id: "3", step: "03", title: "Seleksi Terpadu", subtitle: "Evaluasi & Wawancara", desc: "Proses seleksi kompetensi dan wawancara profesional bersama tim verifikator untuk menilai kelayakan dan kesiapan kandidat." },
  { id: "4", step: "04", title: "Orientasi & Onboarding", subtitle: "Pengumuman Kelulusan", desc: "Tahap penyambutan peserta terpilih, pembekalan materi intensif, dan pengalokasian mentor fraksi secara resmi." },
];

export const DEFAULT_REQUIREMENTS = [
  { id: "1", text: "Mahasiswa S1/D4 (minimal Semester 5) atau D3 (minimal Semester 4) berstatus aktif." },
  { id: "2", text: "Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.00 (skala 4.00) dari institusi terakreditasi." },
  { id: "3", text: "Melampirkan Surat Rekomendasi/Pengantar resmi dari pihak Fakultas atau Perguruan Tinggi." },
  { id: "4", text: "Menyertakan Curriculum Vitae (CV) terbaru berbasis ATS dan Portofolio (jika tersedia)." },
  { id: "5", text: "Melampirkan Transkrip Nilai Akademik terbaru yang telah dilegalisasi atau diverifikasi." },
  { id: "6", text: "Menyertakan Pasfoto formal terbaru dan pindaian Kartu Tanda Penduduk (KTP) / Kartu Tanda Mahasiswa (KTM)." },
];

export const DEFAULT_FAQS = [
  { id: "1", q: "Apakah program magang Golkar Internship Student (GIS) terbuka secara nasional?", a: "Ya. Program GIS bersifat inklusif dan terbuka bagi seluruh mahasiswa aktif program S1/D4 maupun D3 dari Perguruan Tinggi Negeri (PTN) maupun Swasta (PTS) terakreditasi di seluruh wilayah Indonesia." },
  { id: "2", q: "Berapa lama durasi implementasi program magang ini?", a: "Program magang ini dirancang berlangsung selama 3 hingga 6 bulan, disesuaikan secara proporsional dengan kurikulum magang serta kalender akademik masing-masing perguruan tinggi." },
  { id: "3", q: "Apakah partisipasi dalam program GIS dapat dikonversi menjadi SKS kuliah?", a: "Ya. Golkar Internship Student adalah program magang mandiri, namun evaluasi kinerja dan sertifikat resmi dapat diajukan oleh peserta magang ke perguruan tinggi masing-masing untuk proses konversi SKS akademik." },
  { id: "4", q: "Apakah terdapat biaya registrasi untuk mengikuti program ini?", a: "Sama sekali tidak ada. Kami menjamin bahwa seluruh rangkaian proses seleksi dan partisipasi dalam Golkar Internship Student bersifat 100% tanpa biaya (Gratis)." },
  { id: "5", q: "Bagaimana sistem kerja harian peserta magang (WFO/WFH)?", a: "Program ini menerapkan pendekatan kerja hibrida (Hybrid). Peserta akan mengikuti orientasi dan tugas luring (WFO) di lingkungan Dewan Pimpinan Pusat (DPP) Partai Golkar maupun Gedung MPR/DPR RI, dengan tetap mengutamakan fleksibilitas jam akademik." },
];

export interface KomisiPosisi {
  id: string;
  namaKomisi: string;
  kodeKomisi: string;
  kuota: string;
  status: "TERBUKA" | "DITUTUP" | "PENUH";
  deskripsiTugas: string;
  bidangKerja: string;
  mitraKerja: string;
  persyaratan: string;
}

export const DEFAULT_POSISI: KomisiPosisi[] = [
  { id: "komisi-1", namaKomisi: "Komisi I", kodeKomisi: "K1", kuota: "10", status: "TERBUKA", deskripsiTugas: "Analisis RUU, risalah rapat, kajian pertahanan dan keamanan nasional.", bidangKerja: "Pertahanan, Intelijen, Luar Negeri, Komunikasi & Informatika", mitraKerja: "Kemenhan, BIN, Kemenlu, Kominfo", persyaratan: "Hukum/FISIP/Hub. Internasional,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-2", namaKomisi: "Komisi II", kodeKomisi: "K2", kuota: "8", status: "TERBUKA", deskripsiTugas: "Kajian otonomi daerah, administrasi kepemiluan, dan reformasi birokrasi.", bidangKerja: "Pemerintahan Dalam Negeri, Otonomi Daerah, Pemilu, ASN", mitraKerja: "Kemendagri, KPU, Bawaslu, BKN, ANRI", persyaratan: "Administrasi Publik/Hukum/FISIP,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-3", namaKomisi: "Komisi III", kodeKomisi: "K3", kuota: "8", status: "TERBUKA", deskripsiTugas: "Pemantauan penegakan hukum, analisis RUU bidang hukum dan HAM.", bidangKerja: "Hukum, HAM, Keamanan, Kejaksaan, KPK", mitraKerja: "Kemenkumham, KPK, Mahkamah Agung, Kejaksaan Agung", persyaratan: "Ilmu Hukum,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-4", namaKomisi: "Komisi IV", kodeKomisi: "K4", kuota: "6", status: "TERBUKA", deskripsiTugas: "Kajian ketahanan pangan, lingkungan hidup, dan pemberdayaan petani.", bidangKerja: "Pertanian, Lingkungan Hidup, Kehutanan, Kelautan & Perikanan", mitraKerja: "Kementan, KLHK, KKP", persyaratan: "Pertanian/Biologi/Lingkungan Hidup,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-5", namaKomisi: "Komisi V", kodeKomisi: "K5", kuota: "6", status: "TERBUKA", deskripsiTugas: "Pemantauan proyek infrastruktur, transportasi, dan pembangunan daerah.", bidangKerja: "Infrastruktur, Perhubungan, Pekerjaan Umum, Perumahan, BMKG", mitraKerja: "Kemenhub, PUPR, Kemen PUPR, BMKG, BPPT", persyaratan: "Teknik Sipil/Perencanaan Wilayah/Manajemen,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-6", namaKomisi: "Komisi VI", kodeKomisi: "K6", kuota: "6", status: "TERBUKA", deskripsiTugas: "Kajian iklim usaha, perdagangan domestik, dan pengembangan UMKM.", bidangKerja: "Perdagangan, Perindustrian, Investasi, BUMN, UMKM", mitraKerja: "Kemendag, Kemenperin, BKPM, Kemen BUMN", persyaratan: "Ekonomi/Manajemen/Bisnis,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-7", namaKomisi: "Komisi VII", kodeKomisi: "K7", kuota: "6", status: "TERBUKA", deskripsiTugas: "Kajian kebijakan energi terbarukan, riset nasional, dan pengembangan IPTEK.", bidangKerja: "Energi, Mineral, Riset & Teknologi, Lingkungan Hidup", mitraKerja: "ESDM, BRIN, BATAN, LAPAN", persyaratan: "Teknik/Sains/Energi,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-8", namaKomisi: "Komisi VIII", kodeKomisi: "K8", kuota: "6", status: "TERBUKA", deskripsiTugas: "Kajian bantuan sosial, pemberdayaan perempuan dan anak, serta keagamaan.", bidangKerja: "Agama, Sosial, Pemberdayaan Perempuan & Perlindungan Anak", mitraKerja: "Kemensos, Kemenag, Kemen PPPA, BNPB", persyaratan: "Sosial/Kesejahteraan/Psikologi,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-9", namaKomisi: "Komisi IX", kodeKomisi: "K9", kuota: "6", status: "TERBUKA", deskripsiTugas: "Pemantauan kebijakan ketenagakerjaan, kesehatan nasional, dan BPJS.", bidangKerja: "Ketenagakerjaan, Kesehatan, Kependudukan & KB", mitraKerja: "Kemenkes, Kemenaker, BPJS Kesehatan, BPJS Ketenagakerjaan, BKKBN", persyaratan: "Kesehatan Masyarakat/Manajemen/Hukum,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-10", namaKomisi: "Komisi X", kodeKomisi: "K10", kuota: "6", status: "TERBUKA", deskripsiTugas: "Kajian kebijakan pendidikan nasional, kebudayaan, dan kepemudaan.", bidangKerja: "Pendidikan, Kebudayaan, Pariwisata, Olahraga & Pemuda", mitraKerja: "Kemendikbud, Kemenpar, Kemenpora", persyaratan: "Pendidikan/Sastra/Olahraga,IPK min 3.00,CV ATS-Friendly" },
  { id: "komisi-11", namaKomisi: "Komisi XI", kodeKomisi: "K11", kuota: "6", status: "TERBUKA", deskripsiTugas: "Kajian APBN, fiskal, moneter, dan pengawasan lembaga keuangan negara.", bidangKerja: "Keuangan, Perbankan, Perencanaan Pembangunan Nasional, Koperasi", mitraKerja: "Kemenkeu, BI, OJK, BPS, Bappenas", persyaratan: "Ekonomi/Akuntansi/Keuangan,IPK min 3.20,CV ATS-Friendly" },
  { id: "komisi-13", namaKomisi: "Komisi XIII", kodeKomisi: "K13", kuota: "5", status: "TERBUKA", deskripsiTugas: "Kajian reformasi kelembagaan dan bidang hak asasi manusia.", bidangKerja: "Reformasi Birokrasi, Akuntabilitas, HAM", mitraKerja: "KemenPAN-RB, Ombudsman, Komnas HAM", persyaratan: "Hukum/FISIP/Administrasi,IPK min 3.00,CV ATS-Friendly" },
  { id: "baleg", namaKomisi: "Badan Legislasi (Baleg)", kodeKomisi: "BALEG", kuota: "8", status: "TERBUKA", deskripsiTugas: "Penyusunan, analisis, dan harmonisasi RUU prioritas nasional dalam Program Legislasi Nasional.", bidangKerja: "Legislasi, Harmonisasi Hukum, Program Legislasi Nasional", mitraKerja: "Semua Kementerian terkait RUU", persyaratan: "Ilmu Hukum/Tata Negara,IPK min 3.25,CV ATS-Friendly" },
  { id: "banggar", namaKomisi: "Badan Anggaran (Banggar)", kodeKomisi: "BANGGAR", kuota: "5", status: "TERBUKA", deskripsiTugas: "Pembahasan dan pengawasan APBN, evaluasi realisasi anggaran negara per kementerian.", bidangKerja: "APBN, Fiskal, Anggaran Negara", mitraKerja: "Kemenkeu, Bappenas, BPK", persyaratan: "Ekonomi/Akuntansi/Keuangan Negara,IPK min 3.25,CV ATS-Friendly" },
  { id: "bamus", namaKomisi: "Badan Urusan Rumah Tangga (BURT)", kodeKomisi: "BURT", kuota: "4", status: "TERBUKA", deskripsiTugas: "Pengelolaan administrasi, tata kelola internal, dan keprotokoleran DPR RI.", bidangKerja: "Administrasi Internal, Keprotokoleran, Tata Kelola DPR", mitraKerja: "Sekretariat Jenderal DPR RI", persyaratan: "Administrasi/Manajemen/Sekretaris,IPK min 3.00,CV ATS-Friendly" },
];

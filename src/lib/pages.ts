import type { PageContent } from "@/lib/data";

export const PAGES: PageContent[] = [
  {
    id: "page-beranda",
    slug: "beranda",
    title: "Halaman Beranda",
    sections: [
      {
        id: "beranda-hero",
        title: "Section Hero (Banner Utama)",
        subsections: [
          {
            id: "beranda-hero-main",
            title: "Hero Utama",
            fields: {
              badge: "Parlemen Transparan & Akuntabel • Periode 2024-2029",
              title1: "Dewan Perwakilan Rakyat Republik Indonesia (DPR RI)",
              title2: "KOMISI XIII",
              subtitle: "Reformasi Hukum & HAM",
              description:
                "Komisi XIII DPR RI bertugas mengawasi legislasi, anggaran, dan kinerja penegakan hukum nasional bersama Kementerian Hukum, KemenHAM, Kemenimipas, KPK, BNPT, Komnas HAM, dan LPSK.",
              statuteQuote:
                "Menjamin kepastian hukum yang adil serta perlindungan hak asasi seluruh warga negara Indonesia tanpa diskriminasi.",
            },
          },
        ],
      },
      {
        id: "beranda-kontak",
        title: "Section Kontak & Media Sosial",
        subsections: [
          {
            id: "beranda-kontak-media",
            title: "Media Sosial",
            fields: {
              instagramHandle: "@komisi13dpr",
              youtubeLabel: "DPR RI Official",
              twitterHandle: "@DPR_RI",
              websiteLabel: "dpr.go.id",
            },
          },
        ],
      },
    ],
  },
  {
    id: "page-profil",
    slug: "profil",
    title: "Halaman Profil Komisi",
    sections: [
      {
        id: "profil-header",
        title: "Header Halaman Profil",
        subsections: [
          {
            id: "profil-header-main",
            title: "Teks Header",
            fields: {
              badge: "PORTAL PROFIL PERLENGKAPAN DPR RI",
              judul: "Tentang Komisi XIII DPR RI",
              deskripsi:
                "Komisi XIII merupakan alat kelengkapan DPR RI yang dibentuk berdasarkan Keputusan Rapat Paripurna DPR RI untuk mengawal Reformasi Hukum, HAM, Keimigrasian, Pemasyarakatan, dan Antikorupsi.",
            },
          },
        ],
      },
      {
        id: "profil-sejarah",
        title: "Sejarah Komisi",
        subsections: [
          {
            id: "profil-sejarah-paragraf",
            title: "Paragraf Sejarah (untuk Profil Utama)",
            fields: {
              intro:
                "Komisi XIII dibentuk sebagai respons atas kebutuhan reformasi struktural di bidang penegakan hukum dan hak asasi manusia. Seiring dengan kompleksitas tantangan hukum nasional, keimigrasian, dan kapasitas pemasyarakatan, DPR RI melalui Rapat Paripurna menyepakati pembentukan komisi khusus ini untuk memperkuat fungsi pengawasan.",
              body: "Secara historis, tugas dan wewenang Komisi XIII sebelumnya tersebar di beberapa komisi lain. Pembentukan komisi yang berdiri sendiri ini menjadi tonggak sejarah penting (milestone) dalam upaya parlemen memberikan perhatian penuh pada isu-isu perlindungan HAM, pemberantasan korupsi, dan modernisasi sistem hukum Indonesia.",
            },
          },
        ],
      },
      {
        id: "profil-visi-misi",
        title: "Visi & Misi",
        subsections: [
          {
            id: "profil-visi-misi-utama",
            title: "Visi Utama",
            fields: {
              visi: "Terwujudnya Penegakan Hukum yang Adil, Humanis, dan Bebas Korupsi",
              deskripsi:
                "Komisi XIII berkomitmen menjaga independensi kelembagaan penegak hukum, memastikan pemenuhan hak asasi warga negara, serta mendorong otomatisasi layanan imigrasi dan perbaikan kondisi lembaga pemasyarakatan secara berkelanjutan.",
            },
          },
          {
            id: "profil-visi-misi-pilar",
            title: "Pilar Misi (ringkasan untuk Profil Utama)",
            fields: {
              pilar1: "Mempercepat kodifikasi dan harmonisasi perundang-undangan nasional bidang hukum pidana & perdata.",
              pilar2: "Memastikan pengalokasian anggaran berbasis kinerja bagi penguatan institusi KPK, Komnas HAM & LPSK.",
              pilar3: "Mengawasi penataan tata kelola keimigrasian di seluruh gerbang batas negara NKRI.",
              pilar4: "Mendorong sistem pembinaan pemasyarakatan humanis yang berorientasi pada reintegrasi sosial.",
            },
          },
        ],
      },
      {
        id: "profil-fungsi",
        title: "Tiga Fungsi Utama Parlemen",
        subsections: [
          {
            id: "profil-fungsi-legislasi",
            title: "Fungsi Legislasi",
            fields: {
              judul: "1. Fungsi Legislasi",
              isi: "Menyusun dan membahas Rancangan Undang-Undang (RUU) prioritas Prolegnas di bidang hukum, HAM, keimigrasian, dan pemasyarakatan.",
            },
          },
          {
            id: "profil-fungsi-anggaran",
            title: "Fungsi Anggaran",
            fields: {
              judul: "2. Fungsi Anggaran",
              isi: "Membahas dan memberikan persetujuan terhadap alokasi Rencana Kerja & Anggaran Kementerian/Lembaga (RKA-K/L) mitra kerja Komisi XIII.",
            },
          },
          {
            id: "profil-fungsi-pengawasan",
            title: "Fungsi Pengawasan",
            fields: {
              judul: "3. Fungsi Pengawasan",
              isi: "Melakukan Rapat Dengar Pendapat (RDP), Kunjungan Kerja Spesifik, dan penyerapan aspirasi masyarakat atas pelaksanaan undang-undang.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "page-profil-sejarah",
    slug: "profil/sejarah",
    title: "Halaman Sejarah Komisi",
    sections: [
      {
        id: "sejarah-header",
        title: "Header Halaman Sejarah",
        subsections: [
          {
            id: "sejarah-header-main",
            title: "Teks Header",
            fields: {
              badge: "PROFIL KOMISI XIII — SEJARAH",
              judul: "Sejarah Komisi XIII DPR RI",
              deskripsi:
                "Perjalanan panjang pembentukan Komisi XIII DPR RI sebagai garda terdepan reformasi hukum, perlindungan HAM, dan pemberantasan korupsi di Indonesia.",
            },
          },
        ],
      },
      {
        id: "sejarah-facts",
        title: "Statistik & Fakta Komisi",
        subsections: [
          {
            id: "sejarah-fact-1",
            title: "Fakta 1: Tahun Berdiri",
            fields: {
              label: "Tahun Berdiri",
              value: "2024",
            },
          },
          {
            id: "sejarah-fact-2",
            title: "Fakta 2: Periode Aktif",
            fields: {
              label: "Periode Aktif",
              value: "2024–2029",
            },
          },
          {
            id: "sejarah-fact-3",
            title: "Fakta 3: Total Anggota",
            fields: {
              label: "Total Anggota",
              value: "46 Orang",
            },
          },
          {
            id: "sejarah-fact-4",
            title: "Fakta 4: Mitra Kerja",
            fields: {
              label: "Mitra Kerja",
              value: "8 K/L",
            },
          },
        ],
      },
      {
        id: "sejarah-narasi",
        title: "Narasi Latar Belakang Pembentukan",
        subsections: [
          {
            id: "sejarah-narasi-p1",
            title: "Paragraf 1",
            fields: {
              teks: "Komisi XIII Dewan Perwakilan Rakyat Republik Indonesia merupakan salah satu alat kelengkapan DPR RI yang dibentuk berdasarkan Keputusan Rapat Paripurna DPR RI pada awal masa jabatan 2024–2029. Pembentukan komisi ini merupakan respons strategis parlemen terhadap semakin kompleksnya tantangan hukum, hak asasi manusia, keimigrasian, pemasyarakatan, dan pemberantasan korupsi di era modern.",
            },
          },
          {
            id: "sejarah-narasi-p2",
            title: "Paragraf 2",
            fields: {
              teks: "Sebelum terbentuk sebagai komisi yang berdiri sendiri, fungsi-fungsi pengawasan dan legislasi di bidang hukum dan HAM tersebar di berbagai komisi, terutama Komisi III. Namun, seiring dengan tumbuhnya tuntutan publik akan akuntabilitas lembaga penegak hukum dan meningkatnya kasus korupsi, TPPO, serta pelanggaran HAM, DPR RI menilai perlunya pembentukan komisi khusus yang lebih terfokus dan efektif.",
            },
          },
          {
            id: "sejarah-narasi-p3",
            title: "Paragraf 3",
            fields: {
              teks: "Komisi XIII hadir untuk menjembatani kebijakan negara dengan aspirasi masyarakat dalam mewujudkan sistem hukum Indonesia yang adil, transparan, dan humanis. Dengan kewenangan penuh atas tiga fungsi parlemen — legislasi, anggaran, dan pengawasan — Komisi XIII berkomitmen menjadi mitra strategis pemerintah dalam mendorong reformasi hukum yang komprehensif dan berkelanjutan.",
            },
          },
          {
            id: "sejarah-narasi-p4",
            title: "Paragraf 4",
            fields: {
              teks: "Fraksi Partai Golkar, sebagai salah satu fraksi terbesar di DPR RI, menempatkan beberapa kader terbaiknya di Komisi XIII. Para anggota Fraksi Golkar di Komisi XIII membawa rekam jejak dan keahlian yang beragam — dari pakar hukum, advokat senior, dokter, hingga teknolog — untuk memastikan bahwa agenda reformasi hukum dijalankan dengan pendekatan yang komprehensif, berbasis data, dan berpihak pada kepentingan rakyat.",
            },
          },
        ],
      },
      {
        id: "sejarah-timeline",
        title: "Linimasa Sejarah Penting",
        subsections: [
          {
            id: "sejarah-milestone-1",
            title: "Milestone: Pembentukan Komisi XIII 2024",
            fields: {
              tahun: "Oktober 2024",
              judul: "Pembentukan Komisi XIII DPR RI Periode 2024–2029",
              deskripsi:
                "Melalui Keputusan Rapat Paripurna DPR RI, Komisi XIII resmi dibentuk sebagai alat kelengkapan DPR RI yang membidangi reformasi hukum, HAM, keimigrasian, pemasyarakatan, dan antikorupsi. Ini menandai era baru tata kelola legislasi hukum di Indonesia.",
              highlight: "true",
            },
          },
          {
            id: "sejarah-milestone-2",
            title: "Milestone: Era Komisi III 2019-2024",
            fields: {
              tahun: "2019–2024",
              judul: "Era Komisi III – Cikal Bakal Komisi XIII",
              deskripsi:
                "Sebelum terbentuk sebagai komisi independen, fungsi-fungsi yang kini diemban Komisi XIII tersebar di Komisi III (Hukum, HAM, Keamanan). Meningkatnya kompleksitas isu hukum, HAM, dan imigrasi mendorong DPR RI untuk membentuk komisi khusus yang lebih fokus.",
              highlight: "false",
            },
          },
          {
            id: "sejarah-milestone-3",
            title: "Milestone: Reformasi Hukum 2014",
            fields: {
              tahun: "2014",
              judul: "Reformasi Hukum Nasional & Revisi UU Keimigrasian",
              deskripsi:
                "Pengesahan UU Keimigrasian No. 6 Tahun 2011 menjadi tonggak reformasi hukum keimigrasian. Komisi yang membidangi hukum kala itu aktif terlibat dalam harmonisasi regulasi imigrasi dengan standar UNHCR dan IOM.",
              highlight: "false",
            },
          },
          {
            id: "sejarah-milestone-4",
            title: "Milestone: Pembentukan KPK 2003",
            fields: {
              tahun: "2003",
              judul: "Pembentukan KPK – Awal Babak Antikorupsi",
              deskripsi:
                "Komisi Pemberantasan Korupsi (KPK) lahir lewat UU No. 30 Tahun 2002. Sejak saat itu, pengawasan legislatif terhadap lembaga antikorupsi menjadi salah satu agenda utama komisi yang membidangi hukum di DPR RI.",
              highlight: "false",
            },
          },
          {
            id: "sejarah-milestone-5",
            title: "Milestone: Era Reformasi HAM 1999",
            fields: {
              tahun: "1999",
              judul: "Era Reformasi – Momentum HAM Nasional",
              deskripsi:
                "Pasca reformasi 1998, UU No. 39 Tahun 1999 tentang Hak Asasi Manusia dan UU No. 26 Tahun 2000 tentang Pengadilan HAM lahir. Komisi DPR yang membidangi hukum berperan kunci dalam proses legislasi ini, meletakkan fondasi hukum HAM modern Indonesia.",
              highlight: "false",
            },
          },
          {
            id: "sejarah-milestone-6",
            title: "Milestone: Fondasi Konstitusional 1945",
            fields: {
              tahun: "1945",
              judul: "Fondasi Konstitusional – DPR RI Berdiri",
              deskripsi:
                "Sejak terbentuknya DPR RI berdasarkan UUD 1945, alat kelengkapan dewan yang membidangi hukum telah ada dalam berbagai bentuk. Fungsi legislasi, anggaran, dan pengawasan di bidang hukum telah menjadi DNA parlemen Indonesia sejak kemerdekaan.",
              highlight: "false",
            },
          },
        ],
      },
    ],
  },
  {
    id: "page-profil-visi-misi",
    slug: "profil/visi-misi",
    title: "Halaman Visi & Misi",
    sections: [
      {
        id: "visimisi-header",
        title: "Header Halaman Visi & Misi",
        subsections: [
          {
            id: "visimisi-header-main",
            title: "Teks Header",
            fields: {
              badge: "PROFIL KOMISI XIII — VISI & MISI",
              judul: "Visi & Misi Komisi XIII DPR RI",
              deskripsi:
                "Arah dan tujuan strategis Komisi XIII dalam mengawal reformasi hukum, HAM, keimigrasian, pemasyarakatan, dan antikorupsi Indonesia untuk periode 2024–2029.",
            },
          },
        ],
      },
      {
        id: "visimisi-visi",
        title: "Visi Utama Komisi",
        subsections: [
          {
            id: "visimisi-visi-main",
            title: "Pernyataan Visi",
            fields: {
              label: "Visi Utama",
              judul: "Komisi XIII DPR RI 2024–2029",
              visi: "Terwujudnya Sistem Hukum Indonesia yang Adil, Humanis, Transparan, dan Bebas Korupsi demi Keadilan Sosial bagi Seluruh Rakyat Indonesia.",
              penjelasan:
                "Visi ini menjadi kompas dan tolok ukur seluruh agenda kerja Komisi XIII selama periode 2024–2029. Setiap keputusan legislasi, alokasi anggaran, dan tindakan pengawasan akan selalu diukur terhadap kontribusinya dalam mewujudkan visi besar ini.",
            },
          },
        ],
      },
      {
        id: "visimisi-misi",
        title: "Misi Kerja Komisi (4 Pilar Strategis)",
        subsections: [
          {
            id: "visimisi-misi-1",
            title: "Misi 1: Legislasi",
            fields: {
              nomorMisi: "1",
              judul: "Mempercepat Legislasi Bidang Hukum & HAM",
              isi: "Memimpin dan mengawal proses penyusunan serta pengesahan Rancangan Undang-Undang (RUU) prioritas Prolegnas di bidang hukum pidana, perdata, keimigrasian, dan pemasyarakatan, serta memastikan setiap undang-undang yang dihasilkan selaras dengan prinsip-prinsip HAM universal dan nilai-nilai konstitusi Pancasila.",
              target1: "Selesaikan minimal 5 RUU prioritas Prolegnas bidang hukum per periode",
              target2: "Harmonisasi regulasi keimigrasian dengan standar UNHCR dan IOM",
              target3: "Revisi undang-undang yang tidak sesuai dengan putusan MK",
            },
          },
          {
            id: "visimisi-misi-2",
            title: "Misi 2: Anggaran",
            fields: {
              nomorMisi: "2",
              judul: "Optimalisasi Anggaran Berbasis Kinerja",
              isi: "Memastikan alokasi anggaran yang efisien, transparan, dan berbasis kinerja (performance-based budgeting) bagi seluruh Kementerian/Lembaga mitra kerja Komisi XIII. Anggaran harus diarahkan pada program-program yang berdampak langsung terhadap peningkatan pelayanan publik di sektor hukum dan HAM.",
              target1: "Efisiensi anggaran Kemenkum & KemenHAM minimal 15% tanpa mengorbankan pelayanan",
              target2: "Memastikan 100% anggaran KPK terserap untuk program pemberantasan korupsi",
              target3: "Audit kinerja program bantuan hukum gratis bagi masyarakat tidak mampu",
            },
          },
          {
            id: "visimisi-misi-3",
            title: "Misi 3: Pengawasan",
            fields: {
              nomorMisi: "3",
              judul: "Pengawasan Ketat & Berkelanjutan",
              isi: "Menyelenggarakan Rapat Dengar Pendapat (RDP) dan Rapat Dengar Pendapat Umum (RDPU) secara rutin dengan seluruh mitra kerja untuk memastikan pelaksanaan undang-undang berjalan sesuai amanat rakyat. Pengawasan mencakup kondisi Lapas, sistem imigrasi, integritas KPK, dan pemenuhan HAM.",
              target1: "Kunjungan kerja ke minimal 20 Lapas & Rutan per tahun",
              target2: "RDP bulanan dengan seluruh mitra kerja K/L",
              target3: "Sidak tidak terencana ke fasilitas keimigrasian & pemasyarakatan",
            },
          },
          {
            id: "visimisi-misi-4",
            title: "Misi 4: HAM & Antikorupsi",
            fields: {
              nomorMisi: "4",
              judul: "Penguatan Perlindungan HAM & Antikorupsi",
              isi: "Mendorong penguatan kelembagaan dan kapasitas lembaga HAM independen (Komnas HAM, LPSK, BNPT) serta memastikan KPK beroperasi secara independen dan efektif. Komisi XIII berperan sebagai 'watchdog' parlemen terhadap setiap potensi intervensi atau pelemahan lembaga antikorupsi.",
              target1: "Pastikan anggaran Komnas HAM naik minimal 10% per tahun",
              target2: "Pantau setiap kasus besar KPK yang berpotensi menimbulkan intervensi",
              target3: "Sahkan RUU Perlindungan Saksi & Korban versi revisi yang lebih kuat",
            },
          },
        ],
      },
      {
        id: "visimisi-nilai",
        title: "Nilai-Nilai Utama Komisi",
        subsections: [
          {
            id: "visimisi-nilai-1",
            title: "Nilai 1: Integritas",
            fields: {
              judul: "Integritas",
              deskripsi: "Setiap tindakan dan keputusan dilandasi kejujuran, konsistensi, dan tanggung jawab penuh kepada rakyat.",
            },
          },
          {
            id: "visimisi-nilai-2",
            title: "Nilai 2: Profesionalisme",
            fields: {
              judul: "Profesionalisme",
              deskripsi: "Mengedepankan kompetensi, keahlian, dan standar kerja tertinggi dalam setiap proses legislasi dan pengawasan.",
            },
          },
          {
            id: "visimisi-nilai-3",
            title: "Nilai 3: Keadilan",
            fields: {
              judul: "Keadilan",
              deskripsi: "Memastikan setiap regulasi yang dihasilkan memberikan keadilan yang setara bagi seluruh lapisan masyarakat tanpa diskriminasi.",
            },
          },
          {
            id: "visimisi-nilai-4",
            title: "Nilai 4: Humanisme",
            fields: {
              judul: "Humanisme",
              deskripsi: "Menempatkan harkat dan martabat manusia sebagai pusat dari setiap kebijakan hukum yang dihasilkan.",
            },
          },
          {
            id: "visimisi-nilai-5",
            title: "Nilai 5: Akuntabilitas",
            fields: {
              judul: "Akuntabilitas",
              deskripsi: "Transparan dan bertanggung jawab kepada publik atas setiap keputusan anggaran, legislasi, dan hasil pengawasan.",
            },
          },
          {
            id: "visimisi-nilai-6",
            title: "Nilai 6: Kolaborasi",
            fields: {
              judul: "Kolaborasi",
              deskripsi: "Bekerja secara sinergis dengan Pemerintah, masyarakat sipil, akademisi, dan lembaga internasional untuk menghasilkan hukum yang berkualitas.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "page-profil-pimpinan",
    slug: "profil/pimpinan",
    title: "Halaman Pimpinan & Anggota",
    sections: [
      {
        id: "pimpinan-header",
        title: "Header Halaman Pimpinan",
        subsections: [
          {
            id: "pimpinan-header-main",
            title: "Teks Header",
            fields: {
              badge: "PROFIL KOMISI XIII — PIMPINAN & ANGGOTA",
              judul: "Pimpinan & Anggota Fraksi Golkar",
              deskripsi:
                "Daftar lengkap Pimpinan dan Anggota Komisi XIII DPR RI dari Fraksi Partai Golkar periode 2024–2029 beserta profil dan rekam jejak legislasinya.",
            },
          },
        ],
      },
    ],
  },
  {
    id: "page-profil-mitra-kerja",
    slug: "profil/mitra-kerja",
    title: "Halaman Mitra Kerja",
    sections: [
      {
        id: "mitrakerja-header",
        title: "Header Halaman Mitra Kerja",
        subsections: [
          {
            id: "mitrakerja-header-main",
            title: "Teks Header",
            fields: {
              badge: "PROFIL KOMISI XIII — MITRA KERJA",
              judul: "Daftar Mitra Kerja Komisi XIII",
              deskripsi:
                "8 Kementerian dan Lembaga Negara yang menjadi mitra strategis Komisi XIII DPR RI dalam pelaksanaan tugas legislasi, anggaran, dan pengawasan.",
            },
          },
        ],
      },
    ],
  },
];

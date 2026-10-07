// ============================================================
// pages.ts — GOLKAR INTERNSHIP STUDENT
// TODO: Definisikan halaman-halaman untuk project Golkar Internship Student
// ============================================================

import type { PageContent } from "./data";

export interface PageDefinition extends PageContent {}

export const PAGES: PageContent[] = [
  {
    id: "page-profil",
    slug: "profil",
    title: "Profil GIS",
    sections: [
      {
        id: "sec-profil-header",
        title: "Header Halaman Profil",
        subsections: [{ id: "sub-profil-header", title: "Header", fields: { badge: "PROFIL KAMI", judul: "Tentang Golkar Internship Student", deskripsi: "Program magang eksklusif dan komprehensif bagi mahasiswa unggul Indonesia untuk berkontribusi langsung dalam legislasi dan kebijakan publik." } }]
      },
      {
        id: "sec-profil-sejarah",
        title: "Sejarah Komisi",
        subsections: [{ id: "sub-profil-sejarah", title: "Sejarah Ringkas", fields: { intro: "Golkar Internship Student dibentuk dengan visi strategis...", body: "Sebagai inkubator kepemimpinan dan wadah pengembangan kader muda yang profesional..." } }]
      },
      {
        id: "sec-profil-visimisi",
        title: "Visi & Misi",
        subsections: [
          { id: "profil-visi-misi-utama", title: "Visi Utama", fields: { visi: "Menjadi katalisator pembentukan sumber daya manusia unggul...", deskripsi: "Visi ini diwujudkan melalui ekosistem pembelajaran yang kolaboratif..." } },
          { id: "profil-visi-misi-pilar", title: "Pilar Misi", fields: { pilar1: "Pendidikan Politik & Kebangsaan", pilar2: "Pengembangan Karakter Pemimpin", pilar3: "Praktik Magang Profesional", pilar4: "Pengabdian Kepada Masyarakat" } }
        ]
      }
    ]
  },
  {
    id: "page-profil-sejarah",
    slug: "profil/sejarah",
    title: "Sejarah GIS",
    sections: [
      {
        id: "sec-sej-header",
        title: "Header Halaman Sejarah",
        subsections: [{ id: "sub-sej-header", title: "Header", fields: { badge: "SEJARAH GIS", judul: "Jejak Langkah Program Magang", deskripsi: "Menelusuri dedikasi dan rekam jejak penyelenggaraan Golkar Internship Student." } }]
      },
      {
        id: "sec-sej-fakta",
        title: "Statistik & Fakta Komisi",
        subsections: [{ id: "sub-sej-fakta-1", title: "Fakta 1", fields: { angka: "5+", label: "Generasi Alumni", deskripsi: "Telah diselenggarakan lebih dari 5 angkatan secara konsisten." } }]
      },
      {
        id: "sec-sej-narasi",
        title: "Narasi Latar Belakang Pembentukan",
        subsections: [{ id: "sub-sej-narasi", title: "Latar Belakang", fields: { teks: "Golkar Internship Student didirikan dengan landasan kesadaran kolektif untuk membina potensi pemuda..." } }]
      },
      {
        id: "sec-sej-timeline",
        title: "Linimasa Sejarah Penting",
        subsections: [{ id: "sub-sej-timeline-1", title: "Milestone", fields: { tahun: "2020", judul: "Inisiasi Program", deskripsi: "Pelaksanaan angkatan pertama sukses digelar dan menetapkan standar baru magang parlemen.", highlight: "true" } }]
      }
    ]
  },
  {
    id: "page-profil-visimisi",
    slug: "profil/visi-misi",
    title: "Visi Misi GIS",
    sections: [
      {
        id: "sec-vm-header",
        title: "Header Halaman Visi & Misi",
        subsections: [{ id: "sub-vm-header", title: "Header", fields: { badge: "VISI & MISI", judul: "Kompas dan Orientasi Strategis", deskripsi: "Landasan filosofis dan pedoman utama dalam setiap pelaksanaan inisiatif program magang." } }]
      },
      {
        id: "sec-vm-utama",
        title: "Visi Utama Komisi",
        subsections: [{ id: "sub-vm-utama", title: "Visi", fields: { label: "VISI", judul: "Katalisator Pemimpin Masa Depan", visi: "Menciptakan ekosistem pembinaan generasi muda yang sadar politik, berintegritas, dan berkontribusi nyata bagi bangsa.", penjelasan: "Visi ini merepresentasikan komitmen strategis kami..." } }]
      },
      {
        id: "sec-vm-misi",
        title: "Misi Kerja Komisi (4 Pilar Strategis)",
        subsections: [
          { id: "sub-vm-misi-1", title: "Misi 1", fields: { nomorMisi: "1", judul: "Pendidikan Politik Berkelanjutan", isi: "Menyediakan literasi dan edukasi politik berbasis empiris.", target1: "Mahasiswa memahami dinamika kebijakan", target2: "Keterlibatan aktif dalam dialektika publik", target3: "Berpikir kritis, analitis, dan solutif" } }
        ]
      },
      {
        id: "sec-vm-nilai",
        title: "Nilai-Nilai Utama Komisi",
        subsections: [{ id: "sub-vm-nilai-1", title: "Nilai", fields: { judul: "Integritas & Akuntabilitas", deskripsi: "Menjunjung tinggi etika profesional, transparansi, dan kejujuran dalam berorganisasi." } }]
      }
    ]
  },
  {
    id: "page-profil-pimpinan",
    slug: "profil/pimpinan",
    title: "Pimpinan GIS",
    sections: [
      {
        id: "sec-pim-header",
        title: "Header Halaman Pimpinan",
        subsections: [{ id: "sub-pim-header", title: "Header", fields: { badge: "TIM KAMI", judul: "Pimpinan & Pengurus", deskripsi: "Mengenal lebih dekat para penggerak Golkar Internship Student." } }]
      }
    ]
  },
  {
    id: "page-profil-mitrakerja",
    slug: "profil/mitra-kerja",
    title: "Mitra Kerja GIS",
    sections: [
      {
        id: "sec-mitra-header",
        title: "Header Halaman Mitra Kerja",
        subsections: [{ id: "sub-mitra-header", title: "Header", fields: { badge: "KOLABORASI", judul: "Mitra Kerja Strategis", deskripsi: "Jaringan kerjasama untuk memperluas dampak positif program." } }]
      }
    ]
  }
];

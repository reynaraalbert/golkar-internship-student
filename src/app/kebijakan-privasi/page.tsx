"use client";

import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "1. Data yang Kami Kumpulkan",
    content: [
      "Portal Komisi XIII DPR RI dapat mengumpulkan data berikut secara otomatis saat Anda menggunakan layanan ini:",
      "• Data teknis seperti alamat IP, jenis browser, sistem operasi, dan halaman yang Anda kunjungi.",
      "• Waktu dan durasi kunjungan ke portal untuk keperluan analisis statistik penggunaan layanan publik.",
      "• Informasi yang Anda masukkan secara sukarela, seperti saat mengisi formulir aspirasi atau pertanyaan kepada komisi.",
      "Kami tidak mengumpulkan data sensitif seperti data keuangan, kesehatan, atau Nomor Induk Kependudukan (NIK) tanpa persetujuan eksplisit Anda.",
    ]
  },
  {
    icon: Database,
    title: "2. Penggunaan Data",
    content: [
      "Data yang dikumpulkan digunakan semata-mata untuk tujuan berikut:",
      "• Meningkatkan kualitas dan fungsionalitas layanan informasi publik komisi.",
      "• Memproses dan menanggapi pertanyaan, aspirasi, atau masukan yang Anda kirimkan kepada Komisi XIII.",
      "• Melakukan analisis statistik dan pelaporan penggunaan portal secara anonim demi pengembangan layanan.",
      "• Mematuhi kewajiban hukum dan peraturan yang berlaku di Negara Kesatuan Republik Indonesia.",
    ]
  },
  {
    icon: UserCheck,
    title: "3. Hak-Hak Anda",
    content: [
      "Sebagai pengguna portal dan warga negara, Anda memiliki hak penuh atas data pribadi Anda, meliputi:",
      "• Hak untuk mengakses data pribadi yang telah kami kumpulkan terkait Anda.",
      "• Hak untuk meminta koreksi atas data yang tidak akurat atau tidak lengkap.",
      "• Hak untuk meminta penghapusan data pribadi Anda dari sistem kami.",
      "• Hak untuk mengajukan keberatan terhadap pemrosesan data Anda.",
      "Untuk menggunakan hak-hak ini, silakan hubungi Sekretariat Komisi XIII melalui email resmi.",
    ]
  },
  {
    icon: Lock,
    title: "4. Keamanan Data",
    content: [
      "Kami berkomitmen untuk melindungi integritas dan kerahasiaan data Anda melalui langkah-langkah keamanan berikut:",
      "• Enkripsi data pada transmisi menggunakan protokol HTTPS/TLS.",
      "• Akses data dibatasi hanya bagi personel yang berwenang dan membutuhkan data tersebut.",
      "• Audit keamanan berkala untuk memastikan sistem bebas dari potensi celah keamanan.",
      "Meskipun kami berupaya maksimal menjaga keamanan, tidak ada sistem yang sepenuhnya terjamin. Kami menyarankan Anda untuk tidak mengirimkan data sensitif melalui formulir publik.",
    ]
  },
  {
    icon: AlertCircle,
    title: "5. Tautan Pihak Ketiga",
    content: [
      "Portal ini mungkin mengandung tautan menuju situs web pihak ketiga seperti situs resmi DPR RI, Kementerian mitra kerja, atau media massa.",
      "Kebijakan privasi ini hanya berlaku untuk portal Komisi XIII DPR RI. Kami tidak bertanggung jawab atas praktik privasi situs web pihak ketiga yang ditautkan.",
      "Kami menyarankan Anda untuk membaca kebijakan privasi dari setiap situs web yang Anda kunjungi melalui tautan di portal ini.",
    ]
  },
  {
    icon: Shield,
    title: "6. Perubahan Kebijakan",
    content: [
      "Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu sesuai dengan perkembangan hukum, teknologi, atau kebutuhan organisasi.",
      "Setiap perubahan material akan diberitahukan melalui pengumuman di portal ini dengan mencantumkan tanggal pembaruan terbaru.",
      "Penggunaan berkelanjutan atas portal setelah pembaruan kebijakan diterbitkan dianggap sebagai penerimaan Anda atas kebijakan yang diperbarui.",
    ]
  }
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Lock className="w-4 h-4" />
          <span>DOKUMEN LEGAL RESMI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Kebijakan <span className="text-dpr-emerald dark:text-dpr-gold">Privasi</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Portal Informasi Resmi Komisi XIII DPR RI berkomitmen penuh untuk melindungi privasi dan data pribadi pengguna layanan ini. Kebijakan ini berlaku sejak <strong>1 Januari 2025</strong>.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
              <h2 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
                <span className="w-8 h-8 rounded-lg bg-dpr-emerald/10 dark:bg-dpr-gold/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                </span>
                {section.title}
              </h2>
              <div className="space-y-2 pl-11">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-dpr-emerald/30 dark:border-dpr-gold/30 bg-dpr-emerald/5 dark:bg-dpr-gold/5 text-sm text-slate-700 dark:text-slate-300">
        <strong className="text-dpr-emerald-dark dark:text-dpr-gold">Hubungi Kami:</strong> Untuk pertanyaan atau permintaan terkait data pribadi Anda, silakan hubungi Sekretariat Komisi XIII DPR RI melalui email: <a href="mailto:golkarinternshipstudent@gmail.com" className="underline font-semibold text-dpr-emerald dark:text-dpr-gold">golkarinternshipstudent@gmail.com</a> atau melalui halaman <a href="/aspirasi" className="underline font-semibold text-dpr-emerald dark:text-dpr-gold">Aspirasi</a>.
      </div>
    </div>
  );
}

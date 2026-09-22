"use client";

import React from "react";
import { FileText, CheckCircle2, XCircle, Scale, AlertCircle, Globe } from "lucide-react";

const sections = [
  {
    icon: Globe,
    title: "1. Penerimaan Syarat",
    content: [
      "Dengan mengakses dan menggunakan Portal Informasi Resmi Komisi XIII DPR RI, Anda secara otomatis dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum dalam Syarat Penggunaan ini.",
      "Portal ini dikelola oleh Sekretariat Komisi XIII Dewan Perwakilan Rakyat Republik Indonesia sebagai layanan informasi publik. Penggunaan portal ini bersifat sukarela dan tidak mengikat secara hukum untuk keperluan yang tidak berkaitan dengan urusan resmi kenegaraan.",
    ]
  },
  {
    icon: CheckCircle2,
    title: "2. Penggunaan yang Diizinkan",
    content: [
      "Anda diperbolehkan menggunakan portal ini untuk tujuan-tujuan yang sah dan konstruktif, antara lain:",
      "• Mengakses informasi publik mengenai kegiatan Komisi XIII DPR RI.",
      "• Membaca berita, siaran pers, dan risalah rapat yang dipublikasikan secara resmi.",
      "• Mengirimkan aspirasi dan masukan konstruktif kepada Komisi XIII.",
      "• Memantau jadwal dan agenda rapat komisi.",
      "• Mengunduh dokumen publik yang tersedia untuk keperluan edukasi dan penelitian.",
    ]
  },
  {
    icon: XCircle,
    title: "3. Larangan Penggunaan",
    content: [
      "Anda dilarang menggunakan portal ini untuk hal-hal berikut:",
      "• Menyebarkan informasi palsu (hoaks), fitnah, atau konten yang merendahkan martabat lembaga negara.",
      "• Melakukan percobaan peretasan (hacking), injeksi kode berbahaya, atau serangan siber lainnya.",
      "• Menggunakan konten portal ini untuk kepentingan komersial tanpa izin tertulis dari Sekretariat Komisi XIII.",
      "• Meniru identitas anggota DPR, staf sekretariat, atau lembaga lain yang berkaitan.",
      "• Mengumpulkan data pengguna lain secara tidak sah melalui portal ini.",
      "Pelanggaran terhadap ketentuan ini dapat berakibat pada pemblokiran akses dan tindakan hukum sesuai peraturan yang berlaku.",
    ]
  },
  {
    icon: FileText,
    title: "4. Hak Kekayaan Intelektual",
    content: [
      "Seluruh konten yang terdapat dalam portal ini, termasuk namun tidak terbatas pada teks, gambar, logo, desain antarmuka, dan dokumen resmi, merupakan milik Sekretariat Komisi XIII DPR RI atau pihak yang telah memberikan lisensi.",
      "Penggunaan konten untuk keperluan pribadi dan non-komersial diperbolehkan dengan mencantumkan sumber (DPR.go.id / Portal Komisi XIII DPR RI).",
      "Reproduksi, distribusi, atau modifikasi konten untuk tujuan komersial tanpa izin tertulis adalah pelanggaran hak cipta sesuai UU No. 28 Tahun 2014 tentang Hak Cipta.",
    ]
  },
  {
    icon: Scale,
    title: "5. Batasan Tanggung Jawab",
    content: [
      "Portal ini disediakan 'sebagaimana adanya' demi kepentingan publik. Sekretariat Komisi XIII DPR RI tidak memberikan jaminan tersirat atas ketersediaan, akurasi, atau kelengkapan informasi di portal ini.",
      "Kami tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan atau ketidakmampuan untuk menggunakan portal ini, termasuk gangguan layanan atau kesalahan teknis yang disebabkan oleh pihak di luar kendali kami.",
      "Pendapat, aspirasi, atau konten yang dikirimkan oleh pengguna tidak mencerminkan pandangan resmi Komisi XIII DPR RI.",
    ]
  },
  {
    icon: AlertCircle,
    title: "6. Perubahan Layanan & Syarat",
    content: [
      "Komisi XIII DPR RI berhak untuk sewaktu-waktu mengubah, menangguhkan, atau menghentikan layanan portal ini tanpa pemberitahuan sebelumnya.",
      "Syarat Penggunaan ini dapat diperbarui kapan saja. Versi terbaru akan selalu dipublikasikan di halaman ini dengan tanggal pembaruan yang jelas.",
      "Pembaruan syarat terakhir: 30 Agustus 2026.",
      "Pertanyaan mengenai Syarat Penggunaan dapat diajukan melalui email resmi Sekretariat Komisi XIII.",
    ]
  }
];

export default function SyaratPenggunaanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <FileText className="w-4 h-4" />
          <span>DOKUMEN LEGAL RESMI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Syarat <span className="text-dpr-emerald dark:text-dpr-gold">Penggunaan</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Syarat dan ketentuan ini mengatur penggunaan Portal Informasi Resmi Komisi XIII DPR RI. Harap baca dengan seksama sebelum menggunakan layanan kami. Dokumen ini berlaku sejak <strong>1 Januari 2025</strong>.
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
        <strong className="text-dpr-emerald-dark dark:text-dpr-gold">Pertanyaan Hukum:</strong> Apabila Anda memiliki pertanyaan terkait Syarat Penggunaan ini, silakan hubungi kami di <a href="mailto:golkarinternshipstudent@gmail.com" className="underline font-semibold text-dpr-emerald dark:text-dpr-gold">golkarinternshipstudent@gmail.com</a>. Dokumen ini tunduk pada hukum yang berlaku di Negara Kesatuan Republik Indonesia.
      </div>
    </div>
  );
}

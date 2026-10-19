"use client";

import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle, FileText, Clock, Scale } from "lucide-react";
import Link from "next/link";
import { Reveal, StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";
import { siteConfig } from "@/config/site";
import { PRIVACY_POLICY_VERSION } from "@/lib/privacy";

const LAST_UPDATED = "19 Oktober 2026";

const sections = [
  {
    icon: Scale,
    title: "1. Dasar Hukum dan Pengendali Data",
    content: [
      "Kebijakan Privasi ini disusun berdasarkan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) serta peraturan pelaksanaannya.",
      `Pengendali data pribadi adalah pengelola program ${siteConfig.name} (${siteConfig.organizer}).`,
      `Kontak pengendali data: ${siteConfig.secretariat.email} · ${siteConfig.secretariat.phone} · ${siteConfig.secretariat.address}.`,
      "Dasar pemrosesan data: (a) persetujuan eksplisit Anda saat mendaftar dan mengunggah berkas; (b) pelaksanaan hubungan program magang; dan (c) pemenuhan kewajiban hukum.",
    ],
  },
  {
    icon: Database,
    title: "2. Data yang Kami Kumpulkan",
    content: [
      "a. Data akun: nama lengkap, alamat email, nomor telepon/WhatsApp, kata sandi (disimpan sebagai hash, bukan teks asli).",
      "b. Data akademik: perguruan tinggi, program studi, NIM, IPK, semester, dan data institusi.",
      "c. Dokumen pendaftaran: Curriculum Vitae (CV), transkrip nilai, surat rekomendasi/pengantar kampus, Kartu Tanda Mahasiswa (KTM) atau Kartu Tanda Penduduk (KTP), pasfoto, dan portofolio (opsional).",
      "d. Data aktivitas: status lamaran, posisi yang dilamar, riwayat pengalaman yang Anda isi, serta jadwal seleksi.",
      "e. Data teknis: alamat IP, jenis browser/perangkat, waktu akses, dan catatan pembatasan laju permintaan (rate limit) untuk mencegah penyalahgunaan.",
      "f. Data komunikasi: isi aspirasi/pesan yang Anda kirimkan, beserta nama, email, dan/atau nomor WhatsApp bila Anda memilih mode terbuka.",
      "Kami tidak meminta data keuangan, data kesehatan, atau data biometrik. NIK hanya diproses bila Anda mengunggah KTP sebagai dokumen identitas pendaftaran, dan hanya digunakan untuk verifikasi peserta.",
    ],
  },
  {
    icon: FileText,
    title: "3. Tujuan dan Dasar Pemrosesan Dokumen Pendaftaran",
    content: [
      "CV dan portofolio: menilai kualifikasi dan kesesuaian bidang magang — dasar: persetujuan dan pelaksanaan seleksi.",
      "Transkrip nilai: memverifikasi pemenuhan syarat akademik (mis. IPK minimum) — dasar: persetujuan dan pelaksanaan seleksi.",
      "Surat rekomendasi/pengantar: memverifikasi status mahasiswa dan dukungan institusi — dasar: persetujuan.",
      "KTM/KTP dan pasfoto: memverifikasi identitas peserta serta keperluan administrasi dan sertifikat — dasar: persetujuan.",
      "Data identitas tidak ditampilkan pada halaman publik. Halaman Peserta Magang hanya menampilkan data yang memang dipublikasikan oleh pengelola program.",
    ],
  },
  {
    icon: Clock,
    title: "4. Masa Retensi",
    content: [
      "Data pendaftar yang tidak diterima disimpan maksimal 12 bulan setelah pengumuman seleksi, kemudian dihapus atau dianonimkan.",
      "Data peserta yang diterima disimpan selama masa magang dan maksimal 24 bulan setelah program berakhir untuk keperluan administrasi, sertifikat, dan pelaporan.",
      "Dokumen identitas (KTP/KTM) dihapus lebih cepat bila sudah tidak diperlukan untuk verifikasi.",
      "Data aspirasi disimpan maksimal 24 bulan sejak diterima, kecuali diwajibkan lain oleh ketentuan hukum.",
      "Catatan teknis (IP/rate limit) bersifat sementara dan tidak disimpan permanen di luar log operasional.",
      "Anda dapat meminta penghapusan lebih awal melalui kontak pengendali data.",
    ],
  },
  {
    icon: UserCheck,
    title: "5. Hak Subjek Data",
    content: [
      "Sesuai UU PDP, Anda berhak: (a) mendapatkan informasi tentang pemrosesan data; (b) mengakses dan memperoleh salinan data pribadi; (c) meminta koreksi data yang tidak akurat; (d) meminta penghapusan data; (e) menarik kembali persetujuan; (f) mengajukan keberatan atas pemrosesan; dan (g) mengajukan pengaduan kepada otoritas pengawas.",
      `Permintaan dapat dikirim ke ${siteConfig.secretariat.email}. Kami akan memverifikasi identitas pemohon sebelum memproses permintaan.`,
      "Penarikan persetujuan tidak memengaruhi keabsahan pemrosesan yang telah dilakukan sebelumnya.",
    ],
  },
  {
    icon: Lock,
    title: "6. Keamanan Data",
    content: [
      "Kata sandi disimpan dalam bentuk hash (bcrypt) dan tidak pernah dikembalikan melalui API.",
      "Transmisi data menggunakan HTTPS/TLS. Sesi pengguna menggunakan cookie httpOnly.",
      "Akses ke data peserta dibatasi pada akun admin/tim seleksi yang terautentikasi.",
      "Berkas pendaftaran disimpan di penyimpanan privat dan hanya dapat diakses oleh pemilik berkas atau admin melalui route yang memeriksa hak akses.",
      "Meskipun demikian, tidak ada sistem yang sepenuhnya bebas risiko. Laporkan dugaan insiden ke kontak resmi di atas.",
    ],
  },
  {
    icon: Eye,
    title: "7. Berbagi Data dengan Pihak Ketiga",
    content: [
      "Data dapat diproses oleh penyedia layanan teknis (hosting, basis data, penyimpanan berkas, dan pengiriman email) yang terikat kewajiban kerahasiaan.",
      "Data tidak dijual atau disewakan kepada pihak ketiga untuk tujuan pemasaran.",
      "Data dapat diungkapkan bila diwajibkan oleh peraturan perundang-undangan atau permintaan otoritas yang berwenang.",
    ],
  },
  {
    icon: AlertCircle,
    title: "8. Tautan Pihak Ketiga",
    content: [
      "Portal ini dapat memuat tautan menuju situs pihak ketiga. Kebijakan Privasi ini hanya berlaku untuk portal ini.",
      "Kami menyarankan Anda membaca kebijakan privasi situs tujuan sebelum memberikan data pribadi.",
    ],
  },
  {
    icon: Shield,
    title: "9. Perubahan Kebijakan",
    content: [
      `Versi kebijakan ini: ${PRIVACY_POLICY_VERSION}. Pembaruan terakhir: ${LAST_UPDATED}.`,
      "Perubahan material akan ditandai dengan pembaruan versi dan tanggal pada halaman ini.",
      "Bila diperlukan, persetujuan ulang akan diminta pada formulir pendaftaran atau unggah berkas.",
    ],
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Reveal className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Lock className="w-4 h-4" />
          <span>DOKUMEN LEGAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Kebijakan <span className="text-dpr-emerald dark:text-dpr-gold">Privasi</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Kebijakan ini menjelaskan bagaimana {siteConfig.name} memproses data pribadi peserta dan pengunjung portal.
          Pembaruan terakhir: <strong>{LAST_UPDATED}</strong> · Versi <strong>{PRIVACY_POLICY_VERSION}</strong>.
        </p>
      </Reveal>

      <div className="glass-panel p-5 rounded-2xl border border-amber-300 dark:border-amber-700/50 bg-amber-50/80 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
        <strong>Catatan:</strong> draf ini perlu ditinjau oleh pihak hukum sebelum dipublikasikan sebagai dokumen final.
        {/* TODO(konfirmasi-owner): finalisasi oleh tim hukum dan konfirmasi masa retensi. */}
      </div>

      <StaggerList className="space-y-6">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <FadeCard key={section.title} index={i} hover={false} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
              <h2 className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
                <span className="w-8 h-8 rounded-lg bg-dpr-emerald/10 dark:bg-dpr-gold/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                </span>
                {section.title}
              </h2>
              <div className="space-y-2 pl-11">
                {section.content.map((paragraph, index) => (
                  <p key={index} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </FadeCard>
          );
        })}
      </StaggerList>

      <div className="glass-panel p-6 rounded-2xl border border-dpr-emerald/30 dark:border-dpr-gold/30 bg-dpr-emerald/5 dark:bg-dpr-gold/5 text-sm text-slate-700 dark:text-slate-300 space-y-2">
        <p>
          <strong className="text-dpr-emerald-dark dark:text-dpr-gold">Hubungi pengendali data:</strong>{" "}
          <a href={`mailto:${siteConfig.secretariat.email}`} className="underline font-semibold text-dpr-emerald dark:text-dpr-gold">
            {siteConfig.secretariat.email}
          </a>{" "}
          · {siteConfig.secretariat.phone}
        </p>
        <p>
          Lihat juga <Link href="/syarat-penggunaan" className="underline font-semibold text-dpr-emerald dark:text-dpr-gold">Syarat Penggunaan</Link>.
        </p>
      </div>
    </div>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Briefcase, CheckCircle2, Clock, X, AlertCircle, FileText, Upload, Check, Loader2, Home, User
} from "lucide-react";
import { Reveal, StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";
import { KomisiPosisi, DEFAULT_POSISI } from "@/lib/defaults";

interface PosisiItem extends Omit<KomisiPosisi, "status"> {
  title: string;
  komisiStr: string;
  status: string;
  isApplied: boolean;
  userStatus?: "MENUNGGU_VERIFIKASI" | "DITERIMA" | "DITOLAK";
  persyaratanList: string[];
}

export default function UserPosisiPage() {
  const router = useRouter();
  const [selectedPosisi, setSelectedPosisi] = useState<PosisiItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const [selectedBatch, setSelectedBatch] = useState("Batch 4");

  const batches = [
    { id: "Batch 1", label: "Batch 1 (Ditutup)", disabled: true },
    { id: "Batch 2", label: "Batch 2 (Ditutup)", disabled: true },
    { id: "Batch 3", label: "Batch 3 (Ditutup)", disabled: true },
    { id: "Batch 4", label: "Batch 4 (Pendaftaran Dibuka)", disabled: false },
  ];

  const [posisiList, setPosisiList] = useState<PosisiItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load positions from CMS and apply local applicant status
  useEffect(() => {
    fetch("/api/data/posisi_magang")
      .then((res) => res.json())
      .then((data) => {
        const sourceData = (data && Array.isArray(data) && data.length > 0) ? data : DEFAULT_POSISI;
        let list: PosisiItem[] = sourceData.map((p: KomisiPosisi) => ({
          ...p,
          title: `Program Magang ${p.namaKomisi}`,
          komisiStr: p.namaKomisi,
          persyaratanList: (p.persyaratan || "").split(",").map((s) => s.trim()).filter(Boolean),
          isApplied: false,
        }));

        try {
          const stored = localStorage.getItem("golkar_pendaftar_magang_db");
          if (stored) {
            const pendaftar = JSON.parse(stored);
            const myApp = pendaftar.find((app: any) => app.email === "reynaraalbertpradana@gmail.com" || app.nama === "Reynara Albert Pradana");
            if (myApp) {
              list = list.map((item) => {
                if (item.id === myApp.posisiId || item.title === myApp.posisiTitle) {
                  let statusLabel = "TERKIRIM - MENUNGGU VERIFIKASI";
                  if (myApp.status === "DITERIMA") statusLabel = "DITERIMA - LOLOS BERKAS";
                  if (myApp.status === "DITOLAK") statusLabel = "BERKAS DITOLAK";

                  return {
                    ...item,
                    isApplied: true,
                    userStatus: myApp.status,
                    status: statusLabel as any,
                  };
                }
                return item;
              });
            }
          }
        } catch {
          // ignore
        }

        setPosisiList(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenModal = (pos: PosisiItem) => {
    setSelectedPosisi(pos);
    setAgreed(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSelectedPosisi(null);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !selectedPosisi) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      // Create new application entry with status MENUNGGU_VERIFIKASI
      const newApplication = {
        id: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        nama: "Reynara Albert Pradana",
        email: "reynaraalbertpradana@gmail.com",
        universitas: "Universitas Indonesia",
        jurusan: "Ilmu Hukum & Kebijakan Publik",
        nim: "2006123456",
        ipk: "3.85",
        posisiId: selectedPosisi.id,
        posisiTitle: selectedPosisi.title,
        komisi: selectedPosisi.komisiStr,
        tanggalDaftar: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        status: "MENUNGGU_VERIFIKASI" as const,
        berkas: {
          cv: "CV_ATS_Reynara_2026.pdf",
          transkrip: "Transkrip_Akademik_UI.pdf",
          rekomendasi: "Surat_Rekomendasi_Dekan_FHUI.pdf",
          ktm: "KTM_UI_2006123456.pdf",
        },
      };

      try {
        const stored = localStorage.getItem("golkar_pendaftar_magang_db");
        let list = stored ? JSON.parse(stored) : [];
        list = [newApplication, ...list.filter((x: any) => x.nama !== newApplication.nama)];
        localStorage.setItem("golkar_pendaftar_magang_db", JSON.stringify(list));

        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const bc = new BroadcastChannel("golkar_magang_channel");
          bc.postMessage({ type: "NEW_APPLICATION", data: newApplication });
          bc.close();
        }
      } catch {
        // ignore
      }

      setPosisiList((prev) =>
        prev.map((item) =>
          item.id === selectedPosisi.id
            ? { ...item, isApplied: true, userStatus: "MENUNGGU_VERIFIKASI", status: "TERKIRIM - MENUNGGU VERIFIKASI" }
            : item
        )
      );
      setSuccessMessage(`Formulir berhasil terkirim! Berkas Anda sedang dalam antrean verifikasi Admin CMS.`);
      setIsModalOpen(false);
      setSelectedPosisi(null);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 6000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 p-4 sm:p-8 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1 flex gap-6">
        {/* LEFT ICON SIDEBAR */}
        <aside className="hidden md:flex flex-col items-center gap-4 w-16 bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-md border border-slate-200 dark:border-slate-800 self-start">
          <Link
            href="/user/dashboard"
            className="w-10 h-10 rounded-2xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 flex items-center justify-center transition-colors"
            title="Dashboard"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/user/profil"
            className="w-10 h-10 rounded-2xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 flex items-center justify-center transition-colors"
            title="Profil Saya"
          >
            <User className="w-5 h-5" />
          </Link>
          <Link
            href="/user/status-lamaran"
            className="w-10 h-10 rounded-2xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 flex items-center justify-center transition-colors"
            title="Status Lamaran"
          >
            <FileText className="w-5 h-5" />
          </Link>
          <Link
            href="/user/posisi"
            className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs hover:bg-amber-500/30 transition-colors"
            title="Posisi Magang"
          >
            <Briefcase className="w-5 h-5" />
          </Link>
        </aside>

        {/* MAIN BODY AREA */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 px-4 py-2.5 rounded-full shadow-xs hover:bg-amber-500 transition-all self-start"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </Link>
            <div className="relative self-start sm:self-auto">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="text-xs font-black px-3.5 py-1.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-800 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none pr-8"
                style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%2378350f"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '12px' }}
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id} disabled={b.disabled}>{b.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Reveal className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-amber-500" /> Posisi Magang DPR RI & Pendaftaran
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Pilih posisi magang yang sesuai dengan kualifikasi studi Anda dan ajukan pendaftaran untuk diverifikasi oleh Admin CMS.
            </p>
          </Reveal>

          {/* SUCCESS MESSAGE BANNER */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between gap-3 shadow-md animate-fade-in">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
              <Link
                href="/user/status-lamaran"
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition-colors shrink-0"
              >
                Pantau Status Lamaran →
              </Link>
            </div>
          )}

          {/* POSISI LIST */}
          <StaggerList className="grid grid-cols-1 gap-4">
            {posisiList.map((pos, idx) => (
              <FadeCard
                key={pos.id}
                index={idx}
                hover={false}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-sm transition-all space-y-4 ${
                  pos.isApplied
                    ? pos.userStatus === "DITERIMA"
                      ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : pos.userStatus === "DITOLAK"
                      ? "border-red-500/50 bg-red-50/20 dark:bg-red-950/10"
                      : "border-amber-500/50 bg-amber-50/20 dark:bg-amber-950/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-amber-400"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    {pos.komisiStr} ({pos.kodeKomisi})
                  </span>
                  <span
                    className={`text-[11px] font-black px-3 py-1 rounded-full self-start sm:self-auto border ${
                      pos.isApplied
                        ? pos.userStatus === "DITERIMA"
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                          : pos.userStatus === "DITOLAK"
                          ? "bg-red-600 text-white border-red-700 shadow-xs"
                          : "bg-amber-500 text-slate-950 border-amber-600 shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {pos.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{pos.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pos.deskripsiTugas}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bidang & Departemen Terkait:</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-snug"><span className="font-semibold">Bidang:</span> {pos.bidangKerja}</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-snug mt-1"><span className="font-semibold">Terkait:</span> {pos.mitraKerja}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kualifikasi Utama:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
                      {pos.persyaratanList.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 font-semibold">
                    Kuota Pendaftaran: <strong className="text-slate-900 dark:text-white">{pos.kuota}</strong>
                  </span>
                  {pos.isApplied ? (
                    <div className="flex items-center gap-3">
                      {pos.userStatus === "DITERIMA" && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Berkas Lolos Verifikasi Admin
                        </span>
                      )}
                      {pos.userStatus === "DITOLAK" && (
                        <span className="text-red-700 dark:text-red-400 font-extrabold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-red-600" /> Berkas Ditolak Admin
                        </span>
                      )}
                      {pos.userStatus === "MENUNGGU_VERIFIKASI" && (
                        <span className="text-amber-700 dark:text-amber-400 font-extrabold flex items-center gap-1">
                          <Clock className="w-4 h-4 text-amber-600" /> Menunggu Verifikasi Admin CMS
                        </span>
                      )}
                      <Link
                        href="/user/status-lamaran"
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs hover:bg-amber-500 transition-colors"
                      >
                        Pantau Status →
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(pos)}
                      className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" /> Daftar Posisi Ini
                    </button>
                  )}
                </div>
              </FadeCard>
            ))}
          </StaggerList>
        </div>
      </div>

      {/* REGISTRATION MODAL POPUP */}
      {isModalOpen && selectedPosisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 p-6 flex items-start justify-between relative">
              <div className="space-y-1 max-w-[90%]">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full">
                  FORMULIR PENDAFTARAN MAGANG
                </span>
                <h3 className="text-lg font-black text-slate-950 leading-tight">
                  {selectedPosisi.title}
                </h3>
                <p className="text-xs font-bold text-slate-900">{selectedPosisi.komisiStr}</p>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="w-8 h-8 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* NOTICE BOX FOR ADMIN VERIFICATION */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Setelah formulir dikirim, berkas Anda akan masuk ke antrean verifikasi <strong>Admin CMS</strong>. Status kelulusan administrasi akan diperbarui secara acak oleh Admin.
                </span>
              </div>

              {/* PESERTA INFO PREVIEW */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <h4 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  Data Pelamar Magang:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama Pelamar:</span>
                    <strong className="text-slate-900 dark:text-white">Reynara Albert Pradana</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Perguruan Tinggi:</span>
                    <strong className="text-slate-900 dark:text-white">Universitas Indonesia</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">NIM:</span>
                    <strong className="text-slate-900 dark:text-white">2006123456</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">IPK:</span>
                    <strong className="text-slate-900 dark:text-white">3.85 (Terverifikasi)</strong>
                  </div>
                </div>
              </div>

              {/* PERSYARATAN CHECKLIST */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 dark:text-white block">
                  Ceklist Kelengkapan Dokumen (Wajib Dicentang):
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    "Curriculum Vitae (CV) ATS-Friendly",
                    "Transkrip Nilai Akademik Kumulatif Terakhir",
                    "Surat Rekomendasi Resmi dari Perguruan Tinggi / Fakultas",
                    "Kartu Tanda Mahasiswa (KTM) Aktif",
                  ].map((doc, idx) => (
                    <label key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={checkedDocs[idx] || false}
                        onChange={(e) => setCheckedDocs({ ...checkedDocs, [idx]: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                      />
                      <span className={`font-semibold ${checkedDocs[idx] ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                        {doc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* AGREEMENT CHECKBOX */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                    Saya menyatakan bahwa data dan berkas yang saya lampirkan adalah benar, serta bersedia mengikuti seluruh tahapan seleksi magang di DPR RI.
                  </span>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!agreed || Object.keys(checkedDocs).length < 4 || Object.values(checkedDocs).some(v => !v) || isSubmitting}
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirimkan ke Admin...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Kirim Pendaftaran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

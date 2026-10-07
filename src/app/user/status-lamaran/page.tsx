"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Clock, FileText, Calendar, Building2,
  Download, ExternalLink, HelpCircle, AlertCircle, ShieldCheck, UserCheck, Briefcase, Home, User, XCircle
} from "lucide-react";
import { Reveal, StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

interface UserProfile {
  name: string;
  email: string;
  university: string;
  major: string;
  photoUrl: string;
  statusMagang: string;
  posisiDilamar: string;
}

interface ApplicationState {
  id: string;
  posisiTitle: string;
  komisi: string;
  tanggalDaftar: string;
  status: "MENUNGGU_VERIFIKASI" | "DITERIMA" | "DITOLAK";
  catatanAdmin?: string;
  jadwalWawancara?: string;
}

export default function UserStatusLamaranPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState<ApplicationState>({
    id: "REG-2026-0892",
    posisiTitle: "Program Magang Analisis Kebijakan & Riset Legislatif",
    komisi: "Sekretariat Jenderal & Fraksi Partai Golkar DPR RI",
    tanggalDaftar: "25 Sep 2026",
    status: "MENUNGGU_VERIFIKASI",
    catatanAdmin: "Berkas sedang diperiksa oleh Tim Admin CMS Fraksi Golkar DPR RI.",
    jadwalWawancara: "Jadwal wawancara akan diterbitkan setelah berkas dinyatakan lolos verifikasi.",
  });

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/user/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  // Sync state with Admin CMS verification updates
  useEffect(() => {
    const checkStorage = () => {
      try {
        const stored = localStorage.getItem("golkar_pendaftar_magang_db");
        if (stored) {
          const list = JSON.parse(stored);
          const myApp = list.find((p: any) => p.email === "reynaraalbertpradana@gmail.com" || p.nama === "Reynara Albert Pradana");
          if (myApp) {
            setAppState({
              id: myApp.id,
              posisiTitle: myApp.posisiTitle,
              komisi: myApp.komisi,
              tanggalDaftar: myApp.tanggalDaftar,
              status: myApp.status,
              catatanAdmin: myApp.catatanAdmin,
              jadwalWawancara: myApp.jadwalWawancara,
            });
          }
        }
      } catch {
        // ignore
      }
    };

    checkStorage();

    // Listen for broadcast updates from Admin tab
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel("golkar_magang_channel");
      bc.onmessage = (event) => {
        if (event.data?.type === "PENDAFTAR_UPDATED" || event.data?.type === "NEW_APPLICATION") {
          checkStorage();
        }
      };
      return () => bc.close();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold">Memuat Status Lamaran...</p>
        </div>
      </div>
    );
  }

  const currentUser = user || {
    name: "Reynara Albert Pradana",
    university: "Universitas Indonesia",
    major: "Ilmu Hukum & Kebijakan Publik",
    email: "reynara@ui.ac.id",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  };

  const isPending = appState.status === "MENUNGGU_VERIFIKASI";
  const isAccepted = appState.status === "DITERIMA";
  const isRejected = appState.status === "DITOLAK";

  const TAHAPAN_SELEKSI = [
    {
      id: 1,
      title: "Pendaftaran & Pengunggahan Berkas",
      date: appState.tanggalDaftar,
      desc: "Formulir pendaftaran dan kelengkapan dokumen telah diterima oleh sistem.",
      status: "completed",
    },
    {
      id: 2,
      title: "Verifikasi Administrasi & Kualifikasi Berkas (Oleh Admin CMS)",
      date: isAccepted ? "25 Sep 2026" : isRejected ? "25 Sep 2026" : "Proses Verifikasi Admin",
      desc: isAccepted
        ? "Tim Admin CMS Fraksi Golkar DPR RI telah MEMVERIFIKASI & MENERIMA berkas pendaftaran Anda."
        : isRejected
        ? "Tim Admin CMS menyatakan berkas Anda TIDAK MEMENUHI KUALIFIKASI."
        : "Berkas Anda sedang dalam antrean verifikasi oleh Admin CMS. Silakan periksa kembali secara berkala.",
      status: isAccepted ? "completed" : isRejected ? "failed" : "current",
      note: appState.catatanAdmin ? `Catatan Admin CMS: ${appState.catatanAdmin}` : null,
    },
    {
      id: 3,
      title: "Wawancara & Assessment Daring",
      date: isAccepted ? "27 - 28 September 2026" : "Terkunci",
      desc: isAccepted
        ? "Sesi wawancara kompetensi bersama Panitia Seleksi."
        : "Tahap wawancara terbuka setelah lulus verifikasi berkas oleh Admin CMS.",
      status: isAccepted ? "current" : "upcoming",
      note: isAccepted && appState.jadwalWawancara ? `Jadwal Wawancara Anda: ${appState.jadwalWawancara}` : null,
    },
    {
      id: 4,
      title: "Pengumuman Akhir & Orientasi Magang",
      date: "05 Oktober 2026",
      desc: "Penetapan hasil akhir kelulusan dan pembekalan teknis prapenempatan magang.",
      status: "upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        {/* LEFT ICON SIDEBAR */}
        <aside className="hidden md:flex flex-col items-center gap-4 w-16 bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-md border border-slate-200 dark:border-slate-800 self-start">
          <img
            src={currentUser.photoUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 shadow-sm"
          />
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
            className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs hover:bg-amber-500/30 transition-colors"
            title="Status Lamaran"
          >
            <FileText className="w-5 h-5" />
          </Link>
          <Link
            href="/user/posisi"
            className="w-10 h-10 rounded-2xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 flex items-center justify-center transition-colors"
            title="Posisi Magang"
          >
            <Briefcase className="w-5 h-5" />
          </Link>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 space-y-6">
          {/* HEADER NAVIGATION */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-amber-400 border border-amber-500 px-4 py-2.5 rounded-full shadow-xs hover:bg-amber-500 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 ${
                  isAccepted
                    ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : isRejected
                    ? "bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800"
                    : "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Status Verifikasi Admin:{" "}
                <strong>
                  {isAccepted ? "BERKAS LOLOS" : isRejected ? "BERKAS DITOLAK" : "MENUNGGU VERIFIKASI ADMIN"}
                </strong>
              </span>
            </div>
          </div>

          {/* ACTIVE APPLICATION SUMMARY CARD */}
          <Reveal>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    LAMARAN MAGANG SAYA
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    ID: {appState.id}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {appState.posisiTitle}
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-500" /> {appState.komisi}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => alert(`Bukti pendaftaran resmi ${appState.id} berhasil diunduh.`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" /> Unduh Bukti Daftar
                </button>
                <Link
                  href="/admin/pendaftar"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                  title="Buka Admin CMS Verifikasi"
                >
                  <ShieldCheck className="w-4 h-4" /> Verifikasi di Admin CMS ↗
                </Link>
              </div>
            </div>

            {/* TIMELINE OF CURRENT PROCESS */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" /> Tahapan Seleksi Magang & Status Real-time Admin
              </h2>

              <StaggerList className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {TAHAPAN_SELEKSI.map((step, i) => {
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";
                  const isFailed = step.status === "failed";

                  return (
                    <FadeCard key={step.id} index={i} hover={false} className="relative flex items-start gap-4">
                      {/* Timeline Dot Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-xs z-10 transition-all ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-md"
                            : isFailed
                            ? "bg-red-500 text-white shadow-md"
                            : isCurrent
                            ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-md animate-pulse"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isFailed ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`flex-1 rounded-2xl p-4 border transition-all ${
                          isFailed
                            ? "bg-red-500/10 border-red-500/40 shadow-sm"
                            : isCurrent
                            ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
                            : isCompleted
                            ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3
                            className={`text-sm font-extrabold ${
                              isFailed
                                ? "text-red-600 dark:text-red-400"
                                : isCurrent
                                ? "text-amber-700 dark:text-amber-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-500" /> {step.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {step.desc}
                        </p>

                        {step.note && (
                          <div
                            className={`mt-3 p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                              isFailed
                                ? "bg-red-500/20 border-red-500/30 text-red-950 dark:text-red-200"
                                : "bg-amber-500/20 border-amber-500/30 text-amber-950 dark:text-amber-200"
                            }`}
                          >
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{step.note}</span>
                          </div>
                        )}
                      </div>
                    </FadeCard>
                  );
                })}
              </StaggerList>
            </div>
          </div>
          </Reveal>
        </main>
      </div>
    </div>
  );
}

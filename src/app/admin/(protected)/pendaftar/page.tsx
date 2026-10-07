"use client";

import React, { useState, useEffect } from "react";
import {
  Users, CheckCircle2, XCircle, Clock, FileText, Search, Filter, Eye, Download,
  Check, X, AlertCircle, Building2, Calendar, MessageSquare, RefreshCw, UserCheck
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader, SectionCard, Field, Grid, Input, Select, EmptyState, SaveBar, ModalWrapper, Badge } from "@/components/admin/ui";
import { StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";
import { Dialog } from "@/components/admin/DialogSystem";
import TimelineWidget from "@/components/TimelineWidget";

export interface PendaftarMagang {
  id: string;
  nama: string;
  email: string;
  universitas: string;
  jurusan: string;
  nim: string;
  ipk: string;
  posisiId: string;
  posisiTitle: string;
  komisi: string;
  tanggalDaftar: string;
  status: "MENUNGGU_VERIFIKASI" | "LOLOS_BERKAS" | "LOLOS_WAWANCARA" | "TIDAK_LOLOS" | "CADANGAN";
  batch?: string;
  catatanAdmin?: string;
  jadwalWawancara?: string;
  pewawancara?: string;
  diupdateOleh?: string;
  gender?: "Laki-laki" | "Perempuan";
  jenisPT?: "PTN" | "PTS";
  lokasi?: string;
  semester?: number;
  berkas: {
    cv: string;
    transkrip: string;
    rekomendasi: string;
    ktm: string;
  };
}

const INITIAL_PENDAFTAR: PendaftarMagang[] = [
  {
    id: "REG-2026-0892",
    nama: "Reynara Albert Pradana",
    email: "reynaraalbertpradana@gmail.com",
    universitas: "Universitas Indonesia",
    jurusan: "Ilmu Hukum & Kebijakan Publik",
    nim: "2006123456",
    ipk: "3.85",
    posisiId: "1",
    posisiTitle: "Program Magang Analisis Kebijakan & Riset Legislatif",
    komisi: "Sekretariat Jenderal & Fraksi Partai Golkar DPR RI",
    tanggalDaftar: "25 Sep 2026",
    status: "MENUNGGU_VERIFIKASI",
    batch: "Batch 4 (2026)",
    gender: "Laki-laki",
    jenisPT: "PTN",
    lokasi: "Pulau Jawa (DKI Jakarta)",
    semester: 7,
    berkas: {
      cv: "CV_ATS_Reynara_2026.pdf",
      transkrip: "Transkrip_Akademik_UI.pdf",
      rekomendasi: "Surat_Rekomendasi_Dekan_FHUI.pdf",
      ktm: "KTM_UI_2006123456.pdf",
    },
  },
  {
    id: "REG-2026-0893",
    nama: "Siti Rahmawati",
    email: "siti.rahmawati@ugm.ac.id",
    universitas: "Universitas Gadjah Mada",
    jurusan: "Ilmu Komunikasi",
    nim: "21/478910/SP/2901",
    ipk: "3.72",
    posisiId: "2",
    posisiTitle: "Program Magang Komunikasi Publik & Media Kebijakan",
    komisi: "Humas & Pemberitaan Fraksi DPR RI",
    tanggalDaftar: "24 Sep 2026",
    status: "LOLOS_BERKAS",
    batch: "Batch 4 (2026)",
    catatanAdmin: "Berkas sangat baik, pengalaman relevan. Lanjut wawancara.",
    jadwalWawancara: "Sabtu, 27 September 2026 - Pukul 10.00 WIB (Zoom)",
    pewawancara: "Fahmi Idris",
    diupdateOleh: "Muyassar",
    gender: "Perempuan",
    jenisPT: "PTN",
    lokasi: "Pulau Jawa (DI Yogyakarta)",
    semester: 5,
    berkas: {
      cv: "CV_Siti_Rahmawati.pdf",
      transkrip: "Transkrip_UGM_Siti.pdf",
      rekomendasi: "Surat_Rekomendasi_Fisipol_UGM.pdf",
      ktm: "KTM_UGM_21478910.pdf",
    },
  },
  {
    id: "REG-2026-0894",
    nama: "Budi Santoso",
    email: "budi.santoso@itb.ac.id",
    universitas: "Institut Teknologi Bandung",
    jurusan: "Teknik Informatika",
    nim: "13520011",
    ipk: "3.10",
    posisiId: "4",
    posisiTitle: "Program Magang Teknologi Informasi & Digitalisasi Parlemen",
    komisi: "Pusat Data & Sistem Informasi Fraksi DPR RI",
    tanggalDaftar: "23 Sep 2026",
    status: "TIDAK_LOLOS",
    batch: "Batch 4 (2026)",
    catatanAdmin: "Maaf, kualifikasi belum memenuhi standar kebutuhan tim untuk saat ini.",
    gender: "Laki-laki",
    jenisPT: "PTN",
    lokasi: "Pulau Jawa (Jawa Barat)",
    semester: 9,
    berkas: {
      cv: "CV_Budi_Santoso.pdf",
      transkrip: "Transkrip_Provisioanl_ITB.pdf",
      rekomendasi: "Surat_Keterangan_Aktif.pdf",
      ktm: "KTM_ITB_13520011.pdf",
    },
  },
];

export default function AdminVerifikasiPendaftarPage() {
  const searchParams = useSearchParams();
  const filterQuery = searchParams?.get("filter");
  const router = useRouter();
  const [pendaftarList, setPendaftarList] = useState<PendaftarMagang[]>(INITIAL_PENDAFTAR);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterBatch, setFilterBatch] = useState<string>("Batch 4 (2026)");
  const [activeAdvancedFilter, setActiveAdvancedFilter] = useState<string>("ALL");
  const [selectedPendaftar, setSelectedPendaftar] = useState<PendaftarMagang | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catatanInput, setCatatanInput] = useState("");
  const [jadwalInput, setJadwalInput] = useState("");
  const [pewawancaraInput, setPewawancaraInput] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [adminRole, setAdminRole] = useState<"admin" | "seleksi">("admin");
  const [adminName, setAdminName] = useState("Tim Seleksi");

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("golkar_pendaftar_magang_db");
      if (savedData) setPendaftarList(JSON.parse(savedData));
      
      const role = localStorage.getItem("admin_role") as "admin" | "seleksi";
      if (role) setAdminRole(role);
      
      // If we had a real auth, we'd get the name from the session. 
      // For now, hardcode or let them set it in biodata. 
      // Let's assume biodata sets 'tim_seleksi_nama'
      const name = localStorage.getItem("tim_seleksi_nama") || "Tim Seleksi";
      setAdminName(name);
    } catch {
      // ignore error
    }
  }, []);

  useEffect(() => {
    if (filterQuery) {
      if (filterQuery === "semua") setFilterStatus("ALL");
      if (filterQuery === "lolos-berkas") setFilterStatus("LOLOS_BERKAS");
      if (filterQuery === "lolos-wawancara") setFilterStatus("LOLOS_WAWANCARA");
      if (filterQuery === "jadwal-saya") setFilterStatus("JADWAL_SAYA");
    }
  }, [filterQuery]);

  const saveToStorage = (updated: PendaftarMagang[]) => {
    setPendaftarList(updated);
    try {
      localStorage.setItem("golkar_pendaftar_magang_db", JSON.stringify(updated));
      // Broadcast update across tabs
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("golkar_magang_channel");
        bc.postMessage({ type: "PENDAFTAR_UPDATED", data: updated });
        bc.close();
      }
    } catch {
      // ignore
    }
  };

  const handleOpenDetail = (item: PendaftarMagang) => {
    setSelectedPendaftar(item);
    setCatatanInput(item.catatanAdmin || "");
    setJadwalInput(item.jadwalWawancara || "");
    setPewawancaraInput(item.pewawancara || "");
    setIsModalOpen(true);
  };

  const updateStatus = async (status: "LOLOS_BERKAS" | "LOLOS_WAWANCARA" | "TIDAK_LOLOS" | "CADANGAN", successMsg: string) => {
    if (!selectedPendaftar) return;
    if (status === "TIDAK_LOLOS" && !catatanInput) {
      await Dialog.alert("Harap masukkan alasan pada kolom catatan admin.");
      return;
    }
    const updated = pendaftarList.map((item) =>
      item.id === selectedPendaftar.id
        ? { ...item, status, catatanAdmin: catatanInput, jadwalWawancara: jadwalInput, pewawancara: pewawancaraInput, diupdateOleh: adminName }
        : item
    );
    saveToStorage(updated);
    setActionSuccess(`Pelamar ${selectedPendaftar.nama} telah dipindah ke status ${successMsg}.`);
    setIsModalOpen(false);
    setSelectedPendaftar(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleKlaimWawancara = async () => {
    if (!selectedPendaftar) return;
    if (!jadwalInput) {
      await Dialog.alert("Tentukan jadwal wawancara terlebih dahulu!");
      return;
    }
    const updated = pendaftarList.map((item) =>
      item.id === selectedPendaftar.id
        ? { ...item, pewawancara: adminName, jadwalWawancara: jadwalInput }
        : item
    );
    saveToStorage(updated);
    setActionSuccess(`Anda berhasil mengklaim jadwal wawancara untuk ${selectedPendaftar.nama}.`);
    setIsModalOpen(false);
    setSelectedPendaftar(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleResetStatus = () => {
    if (!selectedPendaftar) return;
    const updated = pendaftarList.map((item) =>
      item.id === selectedPendaftar.id
        ? {
            ...item,
            status: "MENUNGGU_VERIFIKASI" as const,
            catatanAdmin: "",
            diupdateOleh: undefined,
          }
        : item
    );
    saveToStorage(updated);
    setActionSuccess(`Status ${selectedPendaftar.nama} dikembalikan ke MENUNGGU VERIFIKASI.`);
    setIsModalOpen(false);
    setSelectedPendaftar(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  let isAdvancedFilterView = ["ptn-pts", "lokasi", "gender", "semester", "komisi"].includes(filterQuery || "");
  let advGroupKey: keyof PendaftarMagang = "gender";
  let advTitle = "Filter Lanjutan";
  
  if (filterQuery === "gender") { advGroupKey = "gender"; advTitle = "Gender"; }
  if (filterQuery === "ptn-pts") { advGroupKey = "jenisPT"; advTitle = "PTN / PTS"; }
  if (filterQuery === "lokasi") { advGroupKey = "lokasi"; advTitle = "Lokasi Universitas"; }
  if (filterQuery === "semester") { advGroupKey = "semester"; advTitle = "Semester"; }
  if (filterQuery === "komisi") { advGroupKey = "komisi"; advTitle = "Komisi Tujuan"; }

  let currentPendaftarList = pendaftarList;
  if (filterBatch !== "ALL") {
    currentPendaftarList = currentPendaftarList.filter((p) => p.batch === filterBatch || (!p.batch && filterBatch === "Batch 4 (2026)"));
  }

  const advGroups = isAdvancedFilterView 
    ? Array.from(new Set(currentPendaftarList.map(p => String(p[advGroupKey] || "Belum Diisi")))).sort()
    : [];

  const filteredList = currentPendaftarList.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.universitas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.posisiTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (isAdvancedFilterView) {
      if (activeAdvancedFilter !== "ALL") {
        if (String(item[advGroupKey] || "Belum Diisi") !== activeAdvancedFilter) return false;
      }
      return true;
    }

    if (filterStatus === "JADWAL_SAYA") return item.pewawancara === adminName;
    if (filterStatus === "ALL") return true;
    return item.status === filterStatus;
  });

  const totalCount = currentPendaftarList.length;
  const pendingCount = currentPendaftarList.filter((i) => i.status === "MENUNGGU_VERIFIKASI").length;
  const lolosBerkasCount = currentPendaftarList.filter((i) => i.status === "LOLOS_BERKAS").length;
  const lolosWawancaraCount = currentPendaftarList.filter((i) => i.status === "LOLOS_WAWANCARA").length;
  const cadanganCount = currentPendaftarList.filter((i) => i.status === "CADANGAN").length;
  const rejectedCount = currentPendaftarList.filter((i) => i.status === "TIDAK_LOLOS").length;

  const AVAILABLE_BATCHES = ["ALL", ...Array.from(new Set(["Batch 1 (2024)", "Batch 2 (2025)", "Batch 3 (2026)", "Batch 4 (2026)", ...pendaftarList.map(p => p.batch).filter(Boolean) as string[]]))];

  return (
    <div className="space-y-6 max-w-full">
      <FadeCard index={1} hover={false}>
        <PageHeader
          icon={Users}
          title={isAdvancedFilterView ? advTitle : "Verifikasi & Seleksi Berkas Pendaftar Magang"}
          subtitle={isAdvancedFilterView ? "Analisis berdasarkan kategori khusus." : "Kelola verifikasi dokumen pendaftaran mahasiswa, terima/loloskan berkas, atau tolak dengan catatan resmi."}
        />
      </FadeCard>

      <StaggerList className="w-full">
      {isAdvancedFilterView ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div 
            onClick={() => setActiveAdvancedFilter("ALL")}
            className={`p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border ${activeAdvancedFilter === "ALL" ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-md' : 'border-slate-200 dark:border-white/10 shadow-sm'} flex flex-col items-center text-center justify-center cursor-pointer hover:border-blue-400 transition-all`}
          >
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Keseluruhan</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount} Peserta</h3>
          </div>
          {advGroups.map(g => {
            const count = currentPendaftarList.filter(p => String(p[advGroupKey] || "Belum Diisi") === g).length;
            return (
              <div 
                key={g} 
                onClick={() => setActiveAdvancedFilter(g)} 
                className={`p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border ${activeAdvancedFilter === g ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-md' : 'border-slate-200 dark:border-white/10 shadow-sm'} flex flex-col items-center text-center justify-center cursor-pointer hover:border-blue-400 transition-all`}
              >
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 truncate w-full px-2" title={g}>{g}</p>
                <h3 className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">{count} Peserta</h3>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Pendaftar</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount} Peserta</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Menunggu Verifikasi</p>
              <h3 className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{pendingCount} Peserta</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Lolos Berkas</p>
              <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{lolosBerkasCount} Peserta</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Lolos Wawancara</p>
              <h3 className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">{lolosWawancaraCount} Peserta</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Cadangan / Antrian</p>
              <h3 className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">{cadanganCount} Peserta</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-red-600 dark:text-red-400">Tidak Lolos</p>
              <h3 className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">{rejectedCount} Peserta</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}
      </StaggerList>

      {/* SUCCESS ACTION ALERT */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* TIMELINE WIDGET */}
      <TimelineWidget />

      {/* FILTER & TABLE SECTION */}
      <FadeCard index={2} hover={false}>
        <SectionCard icon={FileText} title={isAdvancedFilterView ? `Daftar Pelamar — ${activeAdvancedFilter === "ALL" ? "Semua Kategori" : activeAdvancedFilter}` : "Daftar Berkas Pendaftar Magang"} description={isAdvancedFilterView ? `Analisis berdasarkan ${advTitle}` : "Pilih pelamar untuk memeriksa kelengkapan berkas dan lakukan verifikasi (Accept / Reject)."}>
          {/* FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* SEARCH */}
          <div className="relative flex-1 max-w-md flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, PT, NIM, posisi..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Select 
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              className="w-40 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl"
            >
              {AVAILABLE_BATCHES.map(b => (
                <option key={b} value={b}>{b === "ALL" ? "Semua Batch" : b}</option>
              ))}
            </Select>
          </div>

          {!isAdvancedFilterView && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-white/10 text-xs overflow-x-auto">
              <button
                onClick={() => setFilterStatus("ALL")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterStatus === "ALL"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                onClick={() => setFilterStatus("MENUNGGU_VERIFIKASI")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterStatus === "MENUNGGU_VERIFIKASI"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
                }`}
              >
                Menunggu ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus("LOLOS_BERKAS")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterStatus === "LOLOS_BERKAS"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                }`}
              >
                Lolos Berkas ({lolosBerkasCount})
              </button>
              <button
                onClick={() => setFilterStatus("LOLOS_WAWANCARA")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterStatus === "LOLOS_WAWANCARA"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600"
                }`}
              >
                Lolos Wawancara ({lolosWawancaraCount})
              </button>
              <button
                onClick={() => setFilterStatus("CADANGAN")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterStatus === "CADANGAN"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
                }`}
              >
                Cadangan ({cadanganCount})
              </button>
              <button
                onClick={() => setFilterStatus("TIDAK_LOLOS")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterStatus === "TIDAK_LOLOS"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-red-600"
                }`}
              >
                Tidak Lolos ({rejectedCount})
              </button>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4">Pelamar & Perguruan Tinggi</th>
                <th className="p-4">Posisi Magang Yang Dilamar</th>
                <th className="p-4">Tanggal Daftar</th>
                <th className="p-4">Status Berkas</th>
                <th className="p-4 text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredList.length > 0 ? (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <strong className="text-sm text-slate-900 dark:text-white block">{item.nama}</strong>
                        <p className="text-slate-500 font-medium">{item.universitas} • IPK: <strong>{item.ipk}</strong></p>
                        <p className="text-[11px] font-mono text-slate-400">NIM: {item.nim}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5 max-w-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.posisiTitle}</span>
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block">{item.komisi}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{item.tanggalDaftar}</td>
                    <td className="p-4">
                      {item.status === "MENUNGGU_VERIFIKASI" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-bold">
                          <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
                        </span>
                      )}
                      {item.status === "LOLOS_BERKAS" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Lolos Berkas
                        </span>
                      )}
                      {item.status === "LOLOS_WAWANCARA" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold">
                          <UserCheck className="w-3.5 h-3.5" /> Lolos Wawancara
                        </span>
                      )}
                      {item.status === "CADANGAN" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold">
                          <Users className="w-3.5 h-3.5" /> Cadangan
                        </span>
                      )}
                      {item.status === "TIDAK_LOLOS" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Tidak Lolos
                        </span>
                      )}
                      
                      {item.pewawancara && (
                        <span className="mt-2 text-[10px] text-slate-500 font-semibold block flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-amber-500" />
                          Diwawancara: {item.pewawancara}
                        </span>
                      )}
                      {item.diupdateOleh && (
                        <span className="mt-1 text-[10px] text-slate-500 font-semibold block flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          Diupdate oleh: {item.diupdateOleh}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Verifikasi Berkas
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    Tidak ada data pendaftar magang yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
      </FadeCard>

      {/* VERIFICATION MODAL */}
      {isModalOpen && selectedPendaftar && (
        <ModalWrapper>
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-dpr-navy rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 relative">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Verifikasi Berkas — {selectedPendaftar.nama}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* APPLICANT DETAIL HEAD */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">REGISTRASI ID: {selectedPendaftar.id}</span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedPendaftar.nama}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedPendaftar.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">{selectedPendaftar.universitas}</span>
                    <span className="text-[11px] text-slate-500 font-medium">Jurusan: {selectedPendaftar.jurusan}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">IPK: {selectedPendaftar.ipk}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">POSISI YANG DILAMAR:</span>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedPendaftar.posisiTitle}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">{selectedPendaftar.komisi}</p>
                  </div>
                  {selectedPendaftar.diupdateOleh && (
                    <div className="text-right bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">DIUPDATE OLEH:</span>
                      <p className="text-xs font-black text-blue-700 dark:text-blue-300">{selectedPendaftar.diupdateOleh}</p>
                    </div>
                  )}
                </div>
              </div>

            {/* UPLOADED DOCUMENTS INSPECTOR */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-500" /> Berkas Dokumen Terunggah Pelamar:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Curriculum Vitae (CV)", filename: selectedPendaftar.berkas.cv },
                  { title: "Transkrip Nilai Akademik", filename: selectedPendaftar.berkas.transkrip },
                  { title: "Surat Rekomendasi Fakultas", filename: selectedPendaftar.berkas.rekomendasi },
                  { title: "Kartu Tanda Mahasiswa (KTM)", filename: selectedPendaftar.berkas.ktm },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{doc.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 truncate block">{doc.filename}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Membuka berkas ${doc.filename} dalam pratinjau dokumen...`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shrink-0 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Lihat
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIN DECISION NOTES & INTERVIEW SCHEDULE */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
              <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-500" /> Catatan Admin & Jadwal Seleksi:
              </h4>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Catatan / Alasan Verifikasi (Terima/Tolak):
                </label>
                <textarea
                  rows={2}
                  value={catatanInput}
                  onChange={(e) => setCatatanInput(e.target.value)}
                  placeholder="Contoh: Berkas lengkap dan sesuai kualifikasi. Atau: Berkas transkrip belum terstempel sah."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Jadwal Wawancara:
                  </label>
                  <input
                    type="text"
                    value={jadwalInput}
                    onChange={(e) => setJadwalInput(e.target.value)}
                    placeholder="Contoh: Sabtu, 27 Sept - Pukul 10.00 WIB"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Pewawancara (Tim Seleksi):
                  </label>
                  <input
                    type="text"
                    value={pewawancaraInput}
                    onChange={(e) => setPewawancaraInput(e.target.value)}
                    placeholder="Contoh: Bpk. Fahmi Idris"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* MODAL ACTION BUTTONS (ACCEPT / CADANGAN / REJECT / RESET) */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={handleResetStatus}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 transition-colors"
              >
                Reset ke Menunggu
              </button>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                {adminRole === "seleksi" && selectedPendaftar.status === "LOLOS_BERKAS" && !selectedPendaftar.pewawancara && (
                  <button
                    type="button"
                    onClick={handleKlaimWawancara}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-[11px] shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Ambil / Klaim Wawancara
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => updateStatus("TIDAK_LOLOS", "TIDAK LOLOS")}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Tidak Lolos
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus("CADANGAN", "CADANGAN")}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Users className="w-3.5 h-3.5" /> Set Cadangan
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus("LOLOS_BERKAS", "LOLOS BERKAS")}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" /> Lolos Berkas
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus("LOLOS_WAWANCARA", "LOLOS WAWANCARA")}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] shadow-md flex items-center gap-1.5 transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Lolos Wawancara
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalWrapper>
      )}
    </div>
  );
}

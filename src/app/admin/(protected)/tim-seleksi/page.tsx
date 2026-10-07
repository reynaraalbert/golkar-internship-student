"use client";

import React, { useState } from "react";
import { Users, CheckCircle2, XCircle, Shield, FileText, Search } from "lucide-react";
import { PageHeader, SectionCard, ModalWrapper } from "@/components/admin/ui";
import { motion, AnimatePresence } from "framer-motion";

interface TimSeleksiMember {
  id: string;
  nama: string;
  email: string;
  jabatan: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  tanggalDaftar: string;
}

const INITIAL_DATA: TimSeleksiMember[] = [
  {
    id: "TS-001",
    nama: "Fahmi Idris",
    email: "fahmi.idris@dpr.go.id",
    jabatan: "Tenaga Ahli Fraksi Golkar",
    status: "PENDING",
    tanggalDaftar: "28 Sep 2026",
  },
  {
    id: "TS-002",
    nama: "Anisa Rahma",
    email: "anisa.rahma@gmail.com",
    jabatan: "Orang Iseng",
    status: "REJECTED",
    tanggalDaftar: "27 Sep 2026",
  },
  {
    id: "TS-003",
    nama: "Dr. Budi Hartono",
    email: "budi.hartono@dpr.go.id",
    jabatan: "Staf Ahli Bidang Hukum",
    status: "APPROVED",
    tanggalDaftar: "26 Sep 2026",
  },
];

const MOCK_BIODATA = {
  instansi: "Sekretariat Jenderal DPR RI",
  alamat: "Gedung Nusantara I Lt. 12, Kompleks Parlemen Senayan",
  telepon: "0812-3456-7890",
  cvUrl: "https://example.com/cv.pdf"
};

export default function AdminTimSeleksiPage() {
  const [members, setMembers] = useState<TimSeleksiMember[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [selectedBiodata, setSelectedBiodata] = useState<TimSeleksiMember | null>(null);

  const handleApprove = (id: string, nama: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "APPROVED" } : m))
    );
    setActionSuccess(`Akun Tim Seleksi atas nama ${nama} berhasil DISETUJUI.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleReject = (id: string, nama: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "REJECTED" } : m))
    );
    setActionSuccess(`Akun Tim Seleksi atas nama ${nama} telah DITOLAK.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filtered = members.filter(
    (m) =>
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.jabatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Shield}
        title="Kelola Tim Seleksi"
        subtitle="Verifikasi dan berikan akses kepada tim yang akan menyeleksi dan mewawancarai peserta magang."
      />

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Menunggu Verifikasi</p>
            <h3 className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
              {members.filter((m) => m.status === "PENDING").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Disetujui (Aktif)</p>
            <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
              {members.filter((m) => m.status === "APPROVED").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-600 dark:text-red-400">Ditolak</p>
            <h3 className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">
              {members.filter((m) => m.status === "REJECTED").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <SectionCard icon={FileText} title="Daftar Akun Tim Seleksi" description="Cek apakah mereka benar-benar bagian dari tim fraksi atau orang asing.">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, atau jabatan..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-dpr-emerald"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Nama / Email</th>
                <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Jabatan / Posisi</th>
                <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Tanggal Daftar</th>
                <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">Status</th>
                <th className="px-4 py-3 font-bold text-slate-900 dark:text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-900/50">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white">{m.nama}</div>
                    <div className="text-[10px] text-slate-500">{m.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.jabatan}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.tanggalDaftar}</td>
                  <td className="px-4 py-3">
                    {m.status === "PENDING" && <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded font-bold text-[10px]">MENUNGGU</span>}
                    {m.status === "APPROVED" && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded font-bold text-[10px]">DISETUJUI</span>}
                    {m.status === "REJECTED" && <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded font-bold text-[10px]">DITOLAK</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedBiodata(m)}
                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> Lihat Biodata
                      </button>
                      {m.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(m.id, m.nama)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Terima
                          </button>
                          <button
                            onClick={() => handleReject(m.id, m.nama)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada akun ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <AnimatePresence>
        {selectedBiodata && (
          <ModalWrapper>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" /> Detail Tim Seleksi
                </h3>
                <button onClick={() => setSelectedBiodata(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NAMA LENGKAP</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedBiodata.nama}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">EMAIL INSTITUSI</p>
                  <p>{selectedBiodata.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">JABATAN</p>
                  <p>{selectedBiodata.jabatan}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">INSTANSI / ASAL UNIT</p>
                  <p>{MOCK_BIODATA.instansi}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ALAMAT KANTOR</p>
                  <p>{MOCK_BIODATA.alamat}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NOMOR TELEPON</p>
                  <p>{MOCK_BIODATA.telepon}</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                <button onClick={() => setSelectedBiodata(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition-colors">Tutup</button>
              </div>
            </motion.div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

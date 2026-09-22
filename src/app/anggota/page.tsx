"use client";

import React, { useState } from "react";
import { useCmsContent } from "@/components/CmsProvider";
import MemberCard from "@/components/MemberCard";
import { Search, Users, Award, Shield, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function MembersPage() {
  const { anggota, pimpinan } = useCmsContent();
  const [selectedDapil, setSelectedDapil] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Clean separation of Pimpinan vs regular Anggota
  const pimpinanList = pimpinan.length > 0
    ? pimpinan
    : anggota.filter((m) => m.role !== "Anggota Komisi");

  const pimpinanIds = new Set(pimpinanList.map((p) => p.id));
  const regularAnggota = anggota.filter((m) => m.role === "Anggota Komisi" && !pimpinanIds.has(m.id));

  const dapilList = [
    "Semua",
    ...Array.from(new Set(regularAnggota.map((m) => m.dapil))),
  ];

  const filteredMembers = regularAnggota.filter((member) => {
    const matchesDapil = selectedDapil === "Semua" || member.dapil === selectedDapil;
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.dapil.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.fraksi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDapil && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Users className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
          <span>ALAT KELENGKAPAN DPR RI 2024-2029</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Daftar <span className="text-dpr-emerald dark:text-red-600">Anggota Komisi XIII</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          Sebanyak {anggota.length} Anggota DPR RI Fraksi Partai Golkar ditugaskan mengawal fungsi legislasi, anggaran, dan pengawasan sektor Hukum, HAM, Imigrasi, dan Antikorupsi.
        </p>
      </div>

      {/* Filter & Search Bar — Placed at the top for instant mobile & desktop access */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
              <Filter className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0" />
              <span>Filter Berdasarkan Daerah Pemilihan</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal sm:hidden">← Geser dapil →</span>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari nama anggota atau dapil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-dpr-navy text-xs text-slate-900 dark:text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-full border border-slate-300 dark:border-white/15 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dapil Filter Pills — Horizontal Scroll without wrapping */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pb-1 -mx-1 px-1">
          {dapilList.map((dapil) => {
            const isActive = selectedDapil === dapil;
            return (
              <button
                key={dapil}
                onClick={() => setSelectedDapil(dapil)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold shadow-md scale-105"
                    : "bg-slate-100 dark:bg-dpr-navy text-slate-700 dark:text-slate-300 hover:text-dpr-emerald dark:hover:text-white border border-slate-200 dark:border-white/10"
                }`}
              >
                {dapil}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leadership Tier Banner */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-white/10 pb-3">
          <Award className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
          <span>Pimpinan Komisi XIII DPR RI</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pimpinanList.map((item) => (
            <MemberCard key={item.id} member={item} />
          ))}
        </div>
      </div>

      {/* All Members Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Menampilkan <strong className="text-dpr-emerald-dark dark:text-dpr-gold">{filteredMembers.length}</strong> Anggota</span>
          <span>Klik kartu anggota untuk melihat profil & risalah tugas</span>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
            <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
            <h3 className="text-slate-900 dark:text-white font-bold text-base font-serif">Tidak Ada Anggota Ditemukan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Coba ubah kata kunci pencarian atau reset filter dapil.</p>
            <button
              onClick={() => { setSelectedDapil("Semua"); setSearchQuery(""); }}
              className="bg-slate-100 dark:bg-dpr-navy text-dpr-emerald-dark dark:text-dpr-gold border border-slate-300 dark:border-dpr-gold/30 px-4 py-2 rounded-full text-xs font-semibold"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

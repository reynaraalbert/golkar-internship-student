"use client";

import React, { useState } from "react";
import { useCmsContent } from "@/components/CmsProvider";
import MemberCard from "@/components/MemberCard";
import { Search, Users, Award, Shield, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, StaggerList, FadeCard } from "@/components/ui/AnimationWrapper";

export default function MembersPage() {
  const { anggota, pimpinan } = useCmsContent();
  const [selectedDapil, setSelectedDapil] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Clean separation of Best Interns vs regular Peserta
  const pimpinanList = anggota.filter((m) => m.kategoriPeserta && m.kategoriPeserta !== "Tidak Ada" && m.kategoriPeserta !== "");

  const pimpinanIds = new Set(pimpinanList.map((p) => p.id));
  const regularAnggota = anggota.filter((m) => !pimpinanIds.has(m.id));

  const batchList = [
    "Semua",
    ...Array.from(new Set(regularAnggota.map((m) => m.fraksi))),
  ];

  const filteredMembers = regularAnggota.filter((member) => {
    const matchesBatch = selectedDapil === "Semua" || member.fraksi === selectedDapil;
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.dapil.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.fraksi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <Reveal className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Users className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
          <span>PROGRAM MAGANG RESMI FRAKSI PARTAI GOLKAR</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Daftar <span className="text-dpr-emerald dark:text-red-600">Peserta Magang</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          Berikut adalah {anggota.length} mahasiswa berprestasi yang telah terpilih dan tergabung dalam program magang Golkar Internship Student.
        </p>
      </Reveal>

      {/* Filter & Search Bar — Placed at the top for instant mobile & desktop access */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
              <Filter className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0" />
              <span>Filter Berdasarkan Batch Magang</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal sm:hidden">← Geser batch →</span>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari nama peserta atau batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-dpr-navy text-xs text-slate-900 dark:text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-full border border-slate-300 dark:border-white/15 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dapil Filter Pills — Horizontal Scroll without wrapping */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pb-1 -mx-1 px-1">
          {batchList.map((batchName) => {
            const isActive = selectedDapil === batchName;
            return (
              <button
                key={batchName}
                onClick={() => setSelectedDapil(batchName)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold shadow-md scale-105"
                    : "bg-slate-100 dark:bg-dpr-navy text-slate-700 dark:text-slate-300 hover:text-dpr-emerald dark:hover:text-white border border-slate-200 dark:border-white/10"
                }`}
              >
                {batchName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leadership Tier Banner */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-white/10 pb-3">
          <Award className="w-5 h-5 text-dpr-emerald dark:text-dpr-gold" />
          <span>Peserta Magang Terbaik (Best Interns)</span>
        </div>

        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pimpinanList.map((item, idx) => (
            <FadeCard key={item.id} index={idx}>
              <MemberCard member={item} />
            </FadeCard>
          ))}
        </StaggerList>
      </div>

      {/* All Members Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Menampilkan <strong className="text-dpr-emerald-dark dark:text-dpr-gold">{filteredMembers.length}</strong> Peserta</span>
          <span>Klik kartu peserta untuk melihat profil lengkap</span>
        </div>

        {filteredMembers.length > 0 ? (
          <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member, idx) => (
              <FadeCard key={member.id} index={idx % 8}>
                <MemberCard member={member} />
              </FadeCard>
            ))}
          </StaggerList>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
            <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
            <h3 className="text-slate-900 dark:text-white font-bold text-base font-serif">Tidak Ada Peserta Ditemukan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Coba ubah kata kunci pencarian atau reset filter batch.</p>
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

"use client";

import React, { useState } from "react";
import { AgendaItem } from "@/lib/data";
import { useCmsContent } from "@/components/CmsProvider";
import AgendaModal from "@/components/AgendaModal";
import { Calendar, Clock, MapPin, Play, FileText, Filter, Video, Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AgendaPage() {
  const { agenda } = useCmsContent();
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAgenda, setActiveAgenda] = useState<AgendaItem | null>(null);

  const statusOptions = ["Semua", "LIVE NOW", "SCHEDULED", "COMPLETED"];

  const liveItem = agenda.find((a) => a.status === "LIVE NOW") || null;

  const filteredAgendas = agenda.filter((item) => {
    const matchesStatus =
      selectedStatus === "Semua" ||
      (selectedStatus === "LIVE NOW" && item.status === "LIVE NOW") ||
      (selectedStatus === "SCHEDULED" && item.status === "SCHEDULED") ||
      (selectedStatus === "COMPLETED" && item.status === "COMPLETED");

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Calendar className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
          <span>JADWAL SIDANG & KAPASITAS KOMISI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Agenda Rapat <span className="text-dpr-emerald dark:text-red-600">Komisi XIII DPR RI</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          Jadwal Rapat Kerja (Raker) bersama Menteri, Rapat Dengar Pendapat (RDP) mitra kerja, Uji Kelayakan (Fit & Proper Test), serta Kunjungan Kerja Lapangan.
        </p>
      </div>

      {/* Live Hearing Highlight Section */}
      {liveItem && (
        <div className="glass-panel-emerald dark:glass-panel-red p-6 sm:p-8 rounded-3xl border border-dpr-emerald dark:border-dpr-red shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-dpr-red/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 bg-dpr-emerald dark:bg-dpr-red text-white text-xs font-bold px-3.5 py-1.5 rounded-full animate-pulse shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>SIARAN LANGSUNG (LIVE NOW)</span>
              </span>
              <span className="text-xs text-dpr-emerald-dark dark:text-dpr-gold font-semibold">Terbuka Untuk Umum</span>
            </div>

            <button
              onClick={() => setActiveAgenda(liveItem)}
              className="bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-full shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Tonton Live Stream Rapat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {liveItem.title}
              </h2>
              <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                {liveItem.summary}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2">
                <span className="flex items-center gap-1.5 text-dpr-emerald-dark dark:text-dpr-gold font-semibold">
                  <MapPin className="w-4 h-4" />
                  {liveItem.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                  {liveItem.time}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-dpr-navy/80 p-5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs space-y-2 shadow-sm">
              <span className="text-dpr-emerald-dark dark:text-dpr-gold font-bold block uppercase tracking-wider">MITRA KERJA TERDAFTAR</span>
              <p className="text-slate-900 dark:text-white font-semibold text-sm">
                {liveItem.partner}
              </p>
              <span className="text-slate-500 dark:text-slate-400 block pt-1">Gedung Nusantara II Senayan, Jakarta</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Filter className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
            <span>Filter Status Rapat</span>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari topik rapat atau mitra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-dpr-navy text-xs text-slate-900 dark:text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-full border border-slate-300 dark:border-white/15 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pb-1 -mx-1 px-1">
          {statusOptions.map((opt) => {
            const isActive = selectedStatus === opt;
            return (
              <button
                key={opt}
                onClick={() => setSelectedStatus(opt)}
                className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold shadow-md scale-105"
                    : "bg-slate-100 dark:bg-dpr-navy text-slate-700 dark:text-slate-300 hover:text-dpr-emerald dark:hover:text-white border border-slate-200 dark:border-white/10"
                }`}
              >
                {opt === "LIVE NOW" ? "🔴 Live Now" : opt === "SCHEDULED" ? "Terjadwal" : opt === "COMPLETED" ? "Selesai" : "Semua Status"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agenda Timeline List */}
      <div className="space-y-4">
        {filteredAgendas.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 4 }}
            onClick={() => setActiveAgenda(item)}
            className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 cursor-pointer transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                {item.status === "LIVE NOW" ? (
                  <span className="bg-dpr-emerald dark:bg-dpr-red text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase animate-pulse">
                    LIVE NOW
                  </span>
                ) : item.status === "SCHEDULED" ? (
                  <span className="bg-amber-100 dark:bg-dpr-gold/20 text-dpr-gold-dark dark:text-dpr-gold text-[10px] font-bold px-2.5 py-0.5 rounded uppercase border border-amber-300 dark:border-dpr-gold/40">
                    TERJADWAL
                  </span>
                ) : (
                  <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    SELESAI
                  </span>
                )}
                <span className="text-xs text-dpr-emerald-dark dark:text-dpr-gold font-semibold">{item.type}</span>
              </div>

              <h3 className="text-slate-900 dark:text-white font-bold text-base group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                {item.summary}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold" />
                  {item.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold" />
                  {item.time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold" />
                  {item.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <span className="text-xs font-semibold text-dpr-emerald-dark dark:text-dpr-gold group-hover:underline flex items-center gap-1">
                <span>Rincian & Dokumen</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AgendaModal agenda={activeAgenda} onClose={() => setActiveAgenda(null)} />
    </div>
  );
}

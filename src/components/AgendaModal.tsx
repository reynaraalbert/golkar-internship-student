"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AgendaItem } from "@/lib/data";
import { X, Calendar, Clock, MapPin, Video, FileText, ShieldAlert, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AgendaModalProps {
  agenda: AgendaItem | null;
  onClose: () => void;
}

export default function AgendaModal({ agenda, onClose }: AgendaModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (agenda) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [agenda]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {agenda && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 dark:bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8"
          >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Status Badge */}
          <div className="flex items-center gap-3 mb-4">
            {agenda.status === "LIVE NOW" ? (
              <span className="flex items-center gap-2 bg-dpr-emerald dark:bg-dpr-red text-white text-xs font-bold px-3.5 py-1.5 rounded-full animate-pulse shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>SIARAN LANGSUNG</span>
              </span>
            ) : agenda.status === "SCHEDULED" ? (
              <span className="bg-amber-100 dark:bg-dpr-gold/20 text-dpr-gold-dark dark:text-dpr-gold text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-300 dark:border-dpr-gold/40">
                TERJADWAL
              </span>
            ) : (
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
                SELESAI
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{agenda.type}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
            {agenda.title}
          </h2>

          {/* Video Player Embed Mock for Live Stream */}
          {agenda.status === "LIVE NOW" && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 border border-dpr-emerald/40 dark:border-dpr-gold/40 shadow-2xl bg-black">
              <iframe
                src="https://www.youtube.com/embed/live_stream?channel=DPRRI"
                title="Live Streaming Komisi XIII DPR RI"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-dpr-navy p-5 rounded-2xl border border-slate-200 dark:border-white/10 mb-6 text-xs">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Tanggal Pelaksanaan</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{agenda.date}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Waktu / Durasi</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{agenda.time}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Lokasi Ruang Rapat</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{agenda.location}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Mitra Kerja Terkait</span>
                  <span className="text-dpr-emerald-dark dark:text-dpr-gold font-bold">{agenda.partner}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
              <span>Ringkasan Pokok Pembahasan Rapat</span>
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-dpr-navy/50 p-4 rounded-xl border border-slate-200 dark:border-white/5 text-justify">
              {agenda.summary}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Video className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
              <span>Siaran Terbuka Untuk Umum & Media Parlemen</span>
            </div>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Risalah rapat PDF sedang diunduh..."); }}
              className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF Risalah / Handout Rapat</span>
            </a>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

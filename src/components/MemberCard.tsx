"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Member } from "@/lib/data";
import { Shield, Mail, MapPin, Award, FileText, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const getFraksiBadgeColor = (fraksi: string) => {
    switch (fraksi) {
      case "PDI Perjuangan":
        return "bg-red-100 dark:bg-red-950/90 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800/60";
      case "Partai Golkar":
        return "bg-amber-100 dark:bg-amber-950/90 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/60";
      case "Partai Gerindra":
        return "bg-red-100 dark:bg-red-900/80 text-red-900 dark:text-red-200 border-red-300 dark:border-red-700/60";
      case "Partai NasDem":
        return "bg-blue-100 dark:bg-blue-950/90 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-800/60";
      case "PKB":
        return "bg-emerald-100 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60";
      case "PKS":
        return "bg-orange-100 dark:bg-orange-950/90 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800/60";
      case "PAN":
        return "bg-sky-100 dark:bg-sky-950/90 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-800/60";
      case "Partai Demokrat":
        return "bg-indigo-100 dark:bg-indigo-950/90 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800/60";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700";
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={() => setModalOpen(true)}
        className="glass-panel rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/50 shadow-lg dark:shadow-2xl group flex flex-col justify-between"
      >
        <div>
          {/* Top Banner / Role Ribbon */}
          <div style={{ position: "relative" }} className="relative h-44 w-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 dark:from-dpr-navy via-dpr-navy/40 to-transparent" />

            {/* Role Badge */}
            {member.role !== "Anggota Komisi" ? (
              <span className="absolute top-3 left-3 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                {member.role}
              </span>
            ) : (
              <span className="absolute top-3 left-3 bg-slate-900/80 dark:bg-dpr-navy/90 text-white dark:text-slate-200 font-semibold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-white/20">
                {member.role}
              </span>
            )}

            {/* Fraksi Tag */}
            <span
              className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${getFraksiBadgeColor(
                member.fraksi
              )}`}
            >
              {member.fraksi}
            </span>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-2.5">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors font-serif">
              {member.name}
            </h3>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-dpr-emerald dark:text-dpr-gold shrink-0" />
              <span className="truncate">{member.dapil}</span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed pt-1">
              {member.bio}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/10 text-xs text-dpr-emerald-dark dark:text-dpr-gold font-bold group-hover:text-dpr-emerald dark:group-hover:text-white transition-colors">
          <span>Lihat Profil Lengkap</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>

      {mounted && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 dark:bg-black/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8"
              >
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
                  <div style={{ position: "relative" }} className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-dpr-emerald dark:border-dpr-gold shrink-0 shadow-md">
                    <Image src={member.photoUrl} alt={member.name} fill className="object-cover object-top" />
                  </div>

                  <div className="space-y-2 text-center sm:text-left">
                    <span className="inline-block bg-emerald-100 dark:bg-dpr-red/40 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold px-3 py-1 rounded-full border border-dpr-emerald/30 dark:border-dpr-gold/40">
                      {member.role}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{member.name}</h2>
                    <p className="text-dpr-emerald-dark dark:text-dpr-gold text-xs font-semibold">{member.fraksi} — {member.dapil}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1 font-medium">
                      <Mail className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                      <span>{member.email}</span>
                    </div>
                  </div>
                </div>

                {/* Bio & Legislative Work */}
                <div className="py-6 space-y-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-base mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                      <span>Biografi & Rekam Jejak</span>
                    </h4>
                    <p className="bg-slate-50 dark:bg-dpr-navy p-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 leading-relaxed">{member.bio}</p>
                  </div>

                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-base mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                      <span>RUU & Agenda Pengawasan yang Ditolak/Dikawal</span>
                    </h4>
                    <ul className="space-y-2">
                      {member.billsLed.map((bill, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 bg-slate-50 dark:bg-dpr-navy/80 p-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 font-medium">
                          <Shield className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold shrink-0" />
                          <span>{bill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-6 py-2.5 rounded-full shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity"
                  >
                    Tutup Profil
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

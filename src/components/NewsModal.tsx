"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { NewsArticle } from "@/lib/data";
import { X, Calendar, Clock, Share2, Download, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export default function NewsModal({ article, onClose }: NewsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (article) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [article]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {article && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 dark:bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-dpr-gold/30 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8"
          >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Image */}
          <div style={{ position: "relative" }} className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-6">
            <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-dpr-navy-card via-transparent to-transparent" />
            <span className="absolute top-4 left-4 bg-dpr-emerald dark:bg-dpr-red text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md">
              {article.category}
            </span>
          </div>

          {/* Meta Bar */}
          <div className="flex items-center gap-4 text-xs text-dpr-emerald-dark dark:text-dpr-gold font-medium mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </div>
            <span>•</span>
            <span>Oleh {article.author}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
            {article.title}
          </h2>

          <div className="bg-slate-100 dark:bg-dpr-navy p-4 rounded-2xl border-l-4 border-dpr-emerald dark:border-dpr-gold mb-6 text-slate-800 dark:text-slate-200 text-sm font-medium italic">
            &quot;{article.summary}&quot;
          </div>

          <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-4 whitespace-pre-line border-b border-slate-200 dark:border-white/10 pb-6 text-justify">
            {article.content}
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-slate-100 dark:bg-dpr-navy px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-dpr-emerald dark:hover:text-white transition-all">
                <Share2 className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                <span>Bagikan Siaran Pers</span>
              </button>
              <button className="flex items-center gap-2 bg-slate-100 dark:bg-dpr-navy px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-dpr-emerald dark:hover:text-white transition-all">
                <Bookmark className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
                <span>Simpan</span>
              </button>
            </div>

            {article.documentUrl && (
              <a
                href={article.documentUrl}
                download
                className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs px-5 py-2.5 rounded-xl shadow-md dark:shadow-gold-glow hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Draf Lampiran PDF</span>
              </a>
            )}
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

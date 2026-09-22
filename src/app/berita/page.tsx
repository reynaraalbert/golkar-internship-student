"use client";

import React, { useState } from "react";
import Image from "next/image";
import { NewsArticle } from "@/lib/data";
import { useCmsContent } from "@/components/CmsProvider";
import NewsModal from "@/components/NewsModal";
import { Newspaper, Calendar, Clock, ArrowRight, Search, Filter, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsPage() {
  const { berita } = useCmsContent();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = ["Semua", "Legislasi", "Pengawasan", "Anggaran", "Siaran Pers", "Kunjungan Kerja"];

  const featuredArticle = berita.find((a) => a.isFeatured) || berita[0] || null;

  const filteredNews = berita.filter((article) => {
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dpr-emerald/10 dark:bg-dpr-gold/10 border border-dpr-emerald/30 dark:border-dpr-gold/30 text-dpr-emerald-dark dark:text-dpr-gold text-xs font-bold">
          <Newspaper className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
          <span>PUSAT INFORMASI & SIARAN PERS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          Berita & <span className="text-dpr-emerald dark:text-red-600">Pengumuman Komisi XIII</span>
        </h1>
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          Kumpulan kabar terbaru mengenai rapat kerja, uji kelayakan, peninjauan lapangan, dan rilis pers resmi dari Sekretariat Komisi XIII DPR RI.
        </p>
      </div>

      {/* Featured News Hero Card */}
      {featuredArticle && (
      <div
        onClick={() => setActiveArticle(featuredArticle)}
        className="glass-panel rounded-3xl overflow-hidden cursor-pointer border border-slate-200 dark:border-dpr-gold/30 hover:border-dpr-emerald dark:hover:border-dpr-gold transition-all shadow-2xl group grid grid-cols-1 lg:grid-cols-12 gap-0"
      >
        <div style={{ position: "relative" }} className="lg:col-span-7 relative h-72 lg:h-auto min-h-[300px] bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <Image
            src={featuredArticle.imageUrl}
            alt={featuredArticle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 dark:from-dpr-navy via-transparent to-transparent lg:hidden" />
          <span className="absolute top-4 left-4 bg-dpr-emerald dark:bg-dpr-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {featuredArticle.category} • UTAMA
          </span>
        </div>

        <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6 bg-white dark:bg-dpr-navy-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-dpr-emerald-dark dark:text-dpr-gold font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {featuredArticle.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {featuredArticle.readTime}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors">
              {featuredArticle.title}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {featuredArticle.summary}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4 text-xs font-bold text-dpr-emerald-dark dark:text-dpr-gold">
            <span>Baca Siaran Pers Selengkapnya</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Filter className="w-4 h-4 text-dpr-emerald dark:text-dpr-gold" />
            <span>Kategori Berita Parlemen</span>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari kata kunci berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-dpr-navy text-xs text-slate-900 dark:text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-full border border-slate-300 dark:border-white/15 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pb-1 -mx-1 px-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold shadow-md scale-105"
                    : "bg-slate-100 dark:bg-dpr-navy text-slate-700 dark:text-slate-300 hover:text-dpr-emerald dark:hover:text-white border border-slate-200 dark:border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ y: -5 }}
            onClick={() => setActiveArticle(article)}
            className="glass-panel rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-white/10 hover:border-dpr-emerald dark:hover:border-dpr-gold/40 transition-all group flex flex-col justify-between"
          >
            <div>
              <div style={{ position: "relative" }} className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-dpr-emerald dark:bg-dpr-red text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                  {article.category}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-dpr-emerald-dark dark:text-dpr-gold font-medium">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base line-clamp-2 group-hover:text-dpr-emerald dark:group-hover:text-dpr-gold transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/5 text-xs text-dpr-emerald-dark dark:text-dpr-gold font-semibold">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      <NewsModal article={activeArticle} onClose={() => setActiveArticle(null)} />
    </div>
  );
}

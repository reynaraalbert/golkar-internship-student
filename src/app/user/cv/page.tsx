"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, ChevronLeft, FileText, CheckCircle2, Eye, X, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Experience {
  id: string;
  type: "organisasi" | "professional" | "project";
  title: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  url: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  domisili?: string;
  university: string;
  major: string;
  programPendidikan?: string;
  fakultas?: string;
  nim?: string;
  ipk?: string;
  semester?: string;
  bio?: string;
  socialMedia?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    website?: string;
  };
}

function formatMonth(v: string) {
  if (!v) return "";
  const [y, m] = v.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

function formatSocialUrl(url: string): string {
  if (!url) return "";
  return url
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");
}

function getHostLabel(url: string): string {
  if (!url) return "";
  if (url.includes("linkedin")) return "LinkedIn";
  if (url.includes("github")) return "GitHub";
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("twitter") || url.includes("x.com")) return "Twitter/X";
  if (url.includes("tiktok")) return "TikTok";
  return "Website";
}

/** Standard PDF fonts only support Latin-1, so normalize/strip unsupported characters. */
function pdfSafe(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/[^\x00-\xFF]/g, "")
    .trim();
}

function toBullets(description: string): string[] {
  return description
    ? description.split("\n").map(s => s.replace(/^[-•]\s*/, "").trim()).filter(Boolean)
    : [];
}

export default function CVGeneratorPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, expRes] = await Promise.all([
          fetch("/api/user/auth/me"),
          fetch("/api/user/experiences", { cache: "no-store" }),
        ]);
        if (!meRes.ok) { setError("Silakan login terlebih dahulu."); setLoading(false); return; }
        const meData = await meRes.json();
        if (meData.authenticated && meData.user) setProfile(meData.user);
        if (expRes.ok) {
          const expData = await expRes.json();
          setExperiences(expData.experiences || []);
        }
      } catch {
        setError("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGenerate = () => {
    if (!profile) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1200);
  };

  /**
   * Generates a text-based (ATS-readable) PDF straight from profile data and
   * downloads it immediately — no preview modal or print dialog required.
   */
  const handleDownload = async () => {
    if (!profile || downloading) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const PAGE_W = 210;
      const PAGE_H = 297;
      const MX = 16;
      const MT = 18;
      const MB = 18;
      const CW = PAGE_W - MX * 2;
      const PT = 0.3528; // 1pt in mm
      const lh = (size: number, factor = 1.4) => size * PT * factor;
      let y = MT;

      const ensure = (h: number) => {
        if (y + h > PAGE_H - MB) { doc.addPage(); y = MT; }
      };
      const setFont = (style: "normal" | "bold" | "italic" | "bolditalic", size: number) => {
        doc.setFont("times", style);
        doc.setFontSize(size);
      };
      const centered = (text: string, size: number, style: "normal" | "bold" | "italic" = "normal") => {
        setFont(style, size);
        const lines = doc.splitTextToSize(pdfSafe(text), CW) as string[];
        lines.forEach(line => {
          ensure(lh(size));
          y += lh(size);
          doc.text(line, PAGE_W / 2, y - lh(size) * 0.25, { align: "center" });
        });
      };
      const paragraph = (text: string, size: number, x = MX, width = CW, style: "normal" | "italic" = "normal") => {
        setFont(style, size);
        const lines = doc.splitTextToSize(pdfSafe(text), width) as string[];
        lines.forEach(line => {
          ensure(lh(size));
          y += lh(size);
          doc.text(line, x, y - lh(size) * 0.25);
        });
      };
      const row = (
        left: string, right: string, size: number,
        leftStyle: "normal" | "bold" | "italic", rightStyle: "normal" | "bold" | "italic",
      ) => {
        const r = pdfSafe(right);
        setFont(rightStyle, size);
        const rightW = r ? doc.getTextWidth(r) + 4 : 0;
        setFont(leftStyle, size);
        const lines = doc.splitTextToSize(pdfSafe(left), CW - rightW) as string[];
        lines.forEach((line, i) => {
          ensure(lh(size));
          y += lh(size);
          const baseline = y - lh(size) * 0.25;
          setFont(leftStyle, size);
          doc.text(line, MX, baseline);
          if (i === 0 && r) {
            setFont(rightStyle, size);
            doc.text(r, PAGE_W - MX, baseline, { align: "right" });
          }
        });
      };
      const bullets = (items: string[]) => {
        const size = 9.5;
        setFont("normal", size);
        items.forEach(item => {
          const lines = doc.splitTextToSize(pdfSafe(item), CW - 7) as string[];
          lines.forEach((line, i) => {
            ensure(lh(size, 1.45));
            y += lh(size, 1.45);
            const baseline = y - lh(size, 1.45) * 0.28;
            if (i === 0) doc.circle(MX + 3, baseline - 1.1, 0.45, "F");
            doc.text(line, MX + 6, baseline);
          });
          y += 0.5;
        });
      };
      const section = (title: string) => {
        ensure(14);
        y += 5;
        setFont("bold", 11);
        y += lh(11);
        doc.text(title.toUpperCase(), MX, y - lh(11) * 0.25);
        y += 0.8;
        doc.setLineWidth(0.25);
        doc.setDrawColor(136);
        doc.line(MX, y, PAGE_W - MX, y);
        doc.setDrawColor(0);
        y += 1.8;
      };

      // === HEADER ===
      doc.setTextColor(17);
      centered((profile.name || "Nama Lengkap").toUpperCase(), 20, "bold");
      if (profile.bio) { doc.setTextColor(68); centered(profile.bio, 9, "italic"); doc.setTextColor(17); }
      if (contactParts.length > 0) centered(contactParts.join("  |  "), 9);
      if (socialLinks.length > 0) centered(socialLinks.map(([, url]) => formatSocialUrl(url as string)).join("  |  "), 9);
      y += 2;
      doc.setLineWidth(0.6);
      doc.line(MX, y, PAGE_W - MX, y);
      y += 1;

      // === PENDIDIKAN ===
      if (profile.university || profile.major) {
        section("Pendidikan");
        row(profile.university || "-", profile.semester || "", 10.5, "bold", "bold");
        row(
          `${profile.programPendidikan || "S1"} ${profile.major || "-"}${profile.fakultas ? `, ${profile.fakultas}` : ""}`,
          profile.ipk ? `IPK: ${profile.ipk} / 4.00` : "",
          10, "italic", "italic",
        );
      }

      // === PROFIL SINGKAT ===
      if (profile.bio) {
        section("Profil Singkat");
        paragraph(profile.bio, 9.5);
      }

      // === PENGALAMAN ORGANISASI & PROFESIONAL ===
      if (orgExp.length > 0) {
        section("Pengalaman Organisasi & Profesional");
        orgExp.forEach(exp => {
          const start = formatMonth(exp.startDate);
          const end = exp.isCurrent ? "Sekarang" : formatMonth(exp.endDate);
          const period = [start, end].filter(Boolean).join(" - ");
          row(exp.title, period, 10.5, "bold", "italic");
          if (exp.role) paragraph(exp.role, 10, MX, CW, "italic");
          const b = toBullets(exp.description);
          if (b.length > 0) bullets(b);
          y += 2.5;
        });
      }

      // === PORTOFOLIO & PUBLIKASI ===
      if (projectExp.length > 0) {
        section("Portofolio & Publikasi");
        projectExp.forEach(exp => {
          row(exp.role ? `${exp.title} - ${exp.role}` : exp.title, "", 10.5, "bold", "normal");
          const b = toBullets(exp.description);
          if (b.length > 0) bullets(b);
          if (exp.url) { doc.setTextColor(85); paragraph(`Link: ${formatSocialUrl(exp.url)}`, 8.5); doc.setTextColor(17); }
          y += 2;
        });
      }

      if (orgExp.length === 0 && projectExp.length === 0) {
        section("Pengalaman");
        doc.setTextColor(136);
        paragraph("Belum ada pengalaman yang ditambahkan. Lengkapi di menu Pengalaman.", 9.5, MX, CW, "italic");
        doc.setTextColor(17);
      }

      // === INFORMASI TAMBAHAN ===
      const extra: [string, string][] = [];
      if (profile.phone) extra.push(["WhatsApp", profile.phone]);
      if (profile.domisili) extra.push(["Domisili", profile.domisili]);
      if (profile.nim) extra.push(["NIM", profile.nim]);
      if (profile.semester) extra.push(["Semester", profile.semester]);
      if (extra.length > 0) {
        section("Informasi Tambahan");
        extra.forEach(([label, value]) => {
          ensure(lh(9.5, 1.6));
          y += lh(9.5, 1.6);
          const baseline = y - lh(9.5, 1.6) * 0.3;
          setFont("bold", 9.5);
          const labelText = `${label}: `;
          doc.text(labelText, MX, baseline);
          const lw = doc.getTextWidth(labelText);
          setFont("normal", 9.5);
          doc.text(pdfSafe(value), MX + lw, baseline);
        });
      }

      doc.setProperties({ title: `CV - ${pdfSafe(profile.name || "ATS CV")}`, author: pdfSafe(profile.name || "") });
      const safeName = (profile.name || "ATS").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
      doc.save(`CV_${safeName || "ATS"}.pdf`);
    } catch (err) {
      console.error("Gagal membuat PDF:", err);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  const orgExp = experiences.filter(e => e.type === "organisasi" || e.type === "professional");
  const projectExp = experiences.filter(e => e.type === "project");

  const socialLinks = profile?.socialMedia
    ? Object.entries(profile.socialMedia).filter(([, v]) => v)
    : [];

  const contactParts: string[] = [];
  if (profile?.domisili) contactParts.push(profile.domisili);
  const contactPhone = profile?.whatsapp || profile?.phone || "";
  if (contactPhone) contactParts.push(contactPhone);
  if (profile?.email) contactParts.push(profile.email);

  const missingFields: string[] = [];
  if (!profile?.name) missingFields.push("Nama Lengkap");
  if (!profile?.university) missingFields.push("Nama Perguruan Tinggi");
  if (!profile?.major) missingFields.push("Program Studi");
  if (!profile?.ipk) missingFields.push("IPK");
  if (!profile?.semester) missingFields.push("Semester");

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/user/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-500" /> Auto-Generate CV (ATS)
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                CV dibentuk otomatis dari data Profil, Pengalaman, dan Portofolio Anda yang sebenarnya.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {generated && (
                <button
                  onClick={() => { setGenerated(false); setGenerating(false); }}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={generating || generated || loading || !!error}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memuat...</> :
                 generating ? "Menyusun CV..." :
                 generated ? <><CheckCircle2 className="w-4 h-4" /> CV Siap</> :
                 "Generate CV Sekarang"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <span className="ml-3 text-slate-500 font-semibold">Memuat data profil Anda...</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          {!loading && !error && !generated && (
            <div className="space-y-4">
              {missingFields.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  <p className="font-bold mb-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Data belum lengkap:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {missingFields.map(f => <li key={f}>{f} — lengkapi di <Link href="/user/profil" className="underline font-bold">Profil Saya</Link></li>)}
                  </ul>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase tracking-wider">Data yang Akan Dimuat ke CV:</h3>
                <div className="space-y-3">
                  {[
                    { num: 1, title: "Informasi Kontak", desc: `${profile?.name || "—"} | ${contactPhone || "Belum ada nomor"} | ${profile?.domisili || "Domisili belum diisi"}` },
                    { num: 2, title: "Pendidikan", desc: `${profile?.university || "—"}, ${profile?.programPendidikan || "S1"} ${profile?.major || "—"}, IPK: ${profile?.ipk || "—"}, ${profile?.semester || "—"}` },
                    { num: 3, title: "Pengalaman Organisasi & Profesional", desc: `${orgExp.length} entri telah diisi` },
                    { num: 4, title: "Portofolio & Project", desc: `${projectExp.length} project/publikasi` },
                    { num: 5, title: "Media Sosial", desc: socialLinks.length > 0 ? socialLinks.map(([k]) => k).join(", ") : "Belum ada — isi di Profil" },
                  ].map(item => (
                    <div key={item.num} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">{item.num}</div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                  <strong>Tips:</strong> Semakin lengkap data Profil dan Pengalaman Anda, semakin kuat CV yang dihasilkan.
                  Tambahkan pengalaman di menu <Link href="/user/pengalaman" className="underline font-bold">Pengalaman</Link>.
                </div>
              </div>
            </div>
          )}

          {generated && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-400 text-lg">CV ATS Berhasil Dibuat!</h3>
                <p className="text-emerald-700 dark:text-emerald-600 text-sm">Resume berbasis data profil nyata Anda. Klik Preview untuk melihat, atau langsung Download PDF.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-200 dark:border-emerald-800 dark:bg-slate-900 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Eye className="w-4 h-4" /> Preview CV
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-60"
                >
                  {downloading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan PDF...</>
                    : <><Download className="w-4 h-4" /> Download / Cetak PDF</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CV PREVIEW MODAL */}
      <AnimatePresence>
        {showPreview && profile && (
          <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b flex justify-between items-center bg-slate-50 text-slate-800 shrink-0">
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> Preview ATS CV — {profile.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-colors disabled:opacity-60"
                  >
                    {downloading
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Download className="w-3.5 h-3.5" />} Download PDF
                  </button>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* CV Paper */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 flex justify-center">
                <div
                  className="w-[210mm] min-h-[297mm] bg-white shadow-md p-8 sm:p-10 text-slate-900 space-y-0 mx-auto origin-top"
                  style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "11pt" }}
                >
                  {/* === HEADER === */}
                  <div className="text-center border-b-2 border-slate-900 pb-3 mb-3">
                    <h1 style={{ fontSize: "20pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px" }}>
                      {profile.name || "NAMA LENGKAP"}
                    </h1>
                    {profile.bio && (
                      <p style={{ fontSize: "9pt", fontStyle: "italic", marginTop: "4px", color: "#444" }}>
                        {profile.bio}
                      </p>
                    )}
                    {contactParts.length > 0 && (
                      <p style={{ fontSize: "9pt", marginTop: "5px" }}>
                        {contactParts.join("  |  ")}
                      </p>
                    )}
                    {socialLinks.length > 0 && (
                      <p style={{ fontSize: "9pt", marginTop: "3px" }}>
                        {socialLinks.map(([, url], i) => (
                          <span key={i}>
                            {i > 0 && "  |  "}
                            {formatSocialUrl(url as string)}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>

                  {/* === PENDIDIKAN === */}
                  {(profile.university || profile.major) && (
                    <div style={{ marginTop: "12px" }}>
                      <h2 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #888", paddingBottom: "2px", marginBottom: "6px" }}>
                        Pendidikan
                      </h2>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "10.5pt" }}>
                        <span>{profile.university || "—"}</span>
                        <span>{profile.semester || ""}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontStyle: "italic", fontSize: "10pt" }}>
                        <span>{profile.programPendidikan || "S1"} {profile.major || "—"}{profile.fakultas ? `, ${profile.fakultas}` : ""}</span>
                        {profile.ipk && <span>IPK: {profile.ipk} / 4.00</span>}
                      </div>
                    </div>
                  )}

                  {/* === PROFIL SINGKAT / OBJECTIVE (dari bio) === */}
                  {profile.bio && (
                    <div style={{ marginTop: "14px" }}>
                      <h2 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #888", paddingBottom: "2px", marginBottom: "6px" }}>
                        Profil Singkat
                      </h2>
                      <p style={{ fontSize: "9.5pt", lineHeight: "1.55" }}>{profile.bio}</p>
                    </div>
                  )}

                  {/* === PENGALAMAN ORGANISASI & PROFESIONAL === */}
                  {orgExp.length > 0 && (
                    <div style={{ marginTop: "14px" }}>
                      <h2 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #888", paddingBottom: "2px", marginBottom: "8px" }}>
                        Pengalaman Organisasi & Profesional
                      </h2>
                      {orgExp.map((exp) => {
                        const start = formatMonth(exp.startDate);
                        const end = exp.isCurrent ? "Sekarang" : formatMonth(exp.endDate);
                        const period = [start, end].filter(Boolean).join(" – ");
                        const bullets = exp.description
                          ? exp.description.split("\n").map(s => s.replace(/^[-•]\s*/, "").trim()).filter(Boolean)
                          : [];
                        return (
                          <div key={exp.id} style={{ marginBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "10.5pt" }}>
                              <span>{exp.title}</span>
                              {period && <span style={{ fontWeight: "normal", fontStyle: "italic" }}>{period}</span>}
                            </div>
                            {exp.role && <div style={{ fontStyle: "italic", fontSize: "10pt", marginBottom: "2px" }}>{exp.role}</div>}
                            {bullets.length > 0 && (
                              <ul style={{ paddingLeft: "18px", marginTop: "2px" }}>
                                {bullets.map((b, i) => (
                                  <li key={i} style={{ fontSize: "9.5pt", lineHeight: "1.45", marginBottom: "2px" }}>{b}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* === PORTOFOLIO & PROJECT === */}
                  {projectExp.length > 0 && (
                    <div style={{ marginTop: "14px" }}>
                      <h2 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #888", paddingBottom: "2px", marginBottom: "8px" }}>
                        Portofolio & Publikasi
                      </h2>
                      {projectExp.map((exp) => {
                        const bullets = exp.description
                          ? exp.description.split("\n").map(s => s.replace(/^[-•]\s*/, "").trim()).filter(Boolean)
                          : [];
                        return (
                          <div key={exp.id} style={{ marginBottom: "8px" }}>
                            <div style={{ fontWeight: "bold", fontSize: "10.5pt" }}>
                              {exp.title}
                              {exp.role && <span style={{ fontWeight: "normal", fontStyle: "italic" }}> — {exp.role}</span>}
                            </div>
                            {bullets.length > 0 && (
                              <ul style={{ paddingLeft: "18px", marginTop: "2px" }}>
                                {bullets.map((b, i) => (
                                  <li key={i} style={{ fontSize: "9.5pt", lineHeight: "1.45", marginBottom: "2px" }}>{b}</li>
                                ))}
                              </ul>
                            )}
                            {exp.url && (
                              <p style={{ fontSize: "8.5pt", color: "#555", marginTop: "2px" }}>
                                🔗 {formatSocialUrl(exp.url)}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Empty state if no experiences */}
                  {orgExp.length === 0 && projectExp.length === 0 && (
                    <div style={{ marginTop: "14px" }}>
                      <h2 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #888", paddingBottom: "2px", marginBottom: "8px" }}>
                        Pengalaman
                      </h2>
                      <p style={{ fontSize: "9.5pt", color: "#888", fontStyle: "italic" }}>
                        Belum ada pengalaman yang ditambahkan. Lengkapi di menu Pengalaman.
                      </p>
                    </div>
                  )}

                  {/* === INFORMASI TAMBAHAN === */}
                  <div style={{ marginTop: "14px" }}>
                    <h2 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #888", paddingBottom: "2px", marginBottom: "6px" }}>
                      Informasi Tambahan
                    </h2>
                    <div style={{ fontSize: "9.5pt", lineHeight: "1.6" }}>
                      {profile.phone && <p><strong>WhatsApp:</strong> {profile.phone}</p>}
                      {profile.domisili && <p><strong>Domisili:</strong> {profile.domisili}</p>}
                      {profile.nim && <p><strong>NIM:</strong> {profile.nim}</p>}
                      {profile.semester && <p><strong>Semester:</strong> {profile.semester}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

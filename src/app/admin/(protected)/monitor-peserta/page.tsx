"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Search, Eye, User, GraduationCap, FileText, Award,
  Upload, Mail, Phone, CheckCircle2, Clock, AlertCircle, X, Download,
  MapPin, Globe, Linkedin, Github, Instagram, Twitter, Star, Link2
} from "lucide-react";
import { PageHeader, SectionCard, EmptyState, ModalWrapper } from "@/components/admin/ui";
import { FadeCard, StaggerList } from "@/components/ui/AnimationWrapper";

interface UserExperience {
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

interface StudentUser {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  phone: string;
  whatsapp?: string;
  domisili?: string;
  photoUrl: string;
  statusMagang: string;
  posisiDilamar: string;
  nim?: string;
  ipk?: string;
  semester?: string;
  bio?: string;
  cvUrl?: string;
  socialMedia?: Record<string, string>;
  documents?: Record<string, string>;
  experiences?: UserExperience[];
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    "Terverifikasi": { cls: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700", label: "Terverifikasi" },
    "Dalam Seleksi": { cls: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700", label: "Dalam Seleksi" },
    "Aktif": { cls: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700", label: "Aktif Magang" },
    "Belum Melamar": { cls: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700", label: "Belum Melamar" },
  };
  const s = map[status] || map["Belum Melamar"];
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${s.cls}`}>{s.label}</span>;
}

export default function AdminMonitorPesertaPage() {
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<StudentUser | null>(null);

  useEffect(() => {
    fetch("/api/admin/peserta")
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.university.toLowerCase().includes(q);
    const matchStatus = filterStatus === "ALL" || u.statusMagang === filterStatus;
    return matchSearch && matchStatus;
  });

  const statuses = ["ALL", "Terverifikasi", "Dalam Seleksi", "Aktif", "Belum Melamar"];

  if (loading) {
    return <div className="flex items-center justify-center py-32 text-slate-500 text-sm">Memuat data peserta terdaftar...</div>;
  }

  return (
    <div className="space-y-6 max-w-full pb-16">
      <FadeCard index={1} hover={false}>
        <PageHeader
          icon={Users}
          title="Monitor Dashboard Peserta"
          subtitle="Pantau semua peserta yang terdaftar, lihat biodata lengkap, dokumen yang diunggah, serta status magang mereka."
        />
      </FadeCard>

      {/* STAT CARDS */}
      <StaggerList className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Peserta Terdaftar", value: users.length, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Terverifikasi", value: users.filter(u => u.statusMagang === "Terverifikasi").length, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "Dalam Seleksi", value: users.filter(u => u.statusMagang === "Dalam Seleksi").length, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Aktif Magang", value: users.filter(u => u.statusMagang === "Aktif").length, icon: Award, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-5 rounded-2xl bg-white dark:bg-dpr-navy-card border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{s.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </StaggerList>

      {/* FILTER & LIST */}
      <FadeCard index={2} hover={false}>
        <SectionCard icon={FileText} title="Daftar Peserta Terdaftar" description="Klik 'Lihat Detail' untuk memeriksa profil lengkap, biodata, dan dokumen yang diunggah peserta.">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, universitas..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-white/10 text-xs overflow-x-auto">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${filterStatus === st ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                >
                  {st === "ALL" ? `Semua (${users.length})` : st}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="Belum ada peserta" description="Belum ada peserta yang mendaftar atau sesuai filter pencarian." />
          ) : (
            <div className="space-y-3">
              {filtered.map((user) => (
                <div key={user.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-blue-400/30 dark:hover:border-blue-500/30 transition-all">
                  <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src={user.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/50 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</h4>
                          <StatusBadge status={user.statusMagang} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">{user.university} • {user.major}</p>
                        {user.posisiDilamar && (
                          <p className="text-[10px] text-dpr-emerald dark:text-dpr-gold font-bold mt-1 line-clamp-1">Melamar: {user.posisiDilamar}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-13 xl:ml-0 shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">Daftar: {new Date(user.createdAt).toLocaleDateString("id-ID")}</span>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Detail</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </FadeCard>

      {/* DETAIL MODAL */}
      {selectedUser && (
        <ModalWrapper>
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-dpr-navy rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-5 relative">
            {/* Close */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">Detail Peserta — {selectedUser.name}</h2>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo & Basic Info */}
            <div className="flex items-start gap-4">
              <img
                src={selectedUser.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedUser.name)}`}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/50 shrink-0"
              />
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white">{selectedUser.name}</h3>
                <StatusBadge status={selectedUser.statusMagang} />
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedUser.email}</p>
                  {selectedUser.phone && <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> WA: {selectedUser.phone}</p>}
                  {selectedUser.domisili && <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {selectedUser.domisili}</p>}
                </div>
              </div>
            </div>

            {/* Akademik */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-2">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-amber-500" /> Data Akademik</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-400 block">Universitas</span><span className="font-bold text-slate-900 dark:text-white">{selectedUser.university}</span></div>
                <div><span className="text-slate-400 block">Jurusan</span><span className="font-bold text-slate-900 dark:text-white">{selectedUser.major}</span></div>
                <div><span className="text-slate-400 block">NIM</span><span className="font-bold text-slate-900 dark:text-white">{selectedUser.nim || "—"}</span></div>
                <div><span className="text-slate-400 block">IPK</span><span className="font-bold text-slate-900 dark:text-white">{selectedUser.ipk || "—"}</span></div>
                <div><span className="text-slate-400 block">Semester</span><span className="font-bold text-slate-900 dark:text-white">{selectedUser.semester || "—"}</span></div>
                <div><span className="text-slate-400 block">Posisi Dilamar</span><span className="font-bold text-dpr-emerald dark:text-dpr-gold">{selectedUser.posisiDilamar || "—"}</span></div>
              </div>
            </div>

            {/* Bio */}
            {selectedUser.bio && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Bio / Deskripsi Diri</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{selectedUser.bio}</p>
              </div>
            )}

            {/* Media Sosial */}
            {selectedUser.socialMedia && Object.entries(selectedUser.socialMedia).filter(([, v]) => v).length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-4 h-4 text-sky-500" /> Media Sosial</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(selectedUser.socialMedia).map(([k, v]) => {
                    if (!v) return null;
                    return (
                      <div key={k} className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                        <span className="font-bold text-slate-500 capitalize">{k}:</span>
                        <span className="text-slate-900 dark:text-white">{v}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dokumen Terunggah */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-3">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"><Upload className="w-4 h-4 text-blue-500" /> Dokumen Terunggah</h4>
              {selectedUser.documents && Object.keys(selectedUser.documents).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(selectedUser.documents).map(([key, url]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate capitalize">{key.replace(/-/g, ' ')}</span>
                      <a href={url} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shrink-0 flex items-center gap-1 transition-colors">
                        <Eye className="w-3 h-3" /> Lihat
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400"><AlertCircle className="w-4 h-4" /> Belum ada dokumen yang diunggah.</div>
              )}
            </div>

            {/* Pengalaman */}
            {selectedUser.experiences && selectedUser.experiences.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 space-y-3">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> Pengalaman ({selectedUser.experiences.length})</h4>
                <div className="space-y-2">
                  {selectedUser.experiences.map((exp) => (
                    <div key={exp.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600">
                              {exp.type}
                            </span>
                            <strong className="text-xs text-slate-900 dark:text-white">{exp.title}</strong>
                          </div>
                          {exp.role && <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{exp.role}</p>}
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate || "?"}
                          </p>
                          {exp.description && <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{exp.description}</p>}
                        </div>
                        {exp.url && (
                          <a href={exp.url} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[9px] shrink-0 flex items-center gap-1 hover:bg-slate-300 transition-colors">
                            <Link2 className="w-2.5 h-2.5" /> Link
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tanggal Daftar */}
            <p className="text-[10px] text-slate-400 text-center">Terdaftar sejak: {new Date(selectedUser.createdAt).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}

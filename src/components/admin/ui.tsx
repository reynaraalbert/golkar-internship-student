"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { LucideIcon, Pencil } from "lucide-react";

export const inputClass =
  "w-full bg-slate-50 dark:bg-dpr-navy-card text-sm text-slate-900 dark:text-white placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none focus:ring-1 focus:ring-dpr-emerald dark:focus:ring-dpr-gold transition-colors";

export const textareaClass =
  "w-full bg-slate-50 dark:bg-dpr-navy-card text-sm text-slate-900 dark:text-white placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-dpr-emerald dark:focus:border-dpr-gold focus:outline-none focus:ring-1 focus:ring-dpr-emerald dark:focus:ring-dpr-gold transition-colors resize-y";

export const labelClass =
  "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5";

/* ─── Badge Components ───────────────────────────────────── */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "emerald" | "gold" | "blue" | "red" | "purple" | "amber";
  size?: "xs" | "sm";
  className?: string;
}

const badgeVariants: Record<string, string> = {
  default: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600",
  emerald: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  gold: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  red: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  purple: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  amber: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
};

export function Badge({ children, variant = "default", size = "xs", className = "" }: BadgeProps) {
  const sizeClass = size === "xs" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5";
  return (
    <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-md border ${badgeVariants[variant]} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}

export function EditableBadge() {
  return (
    <Badge variant="emerald" size="xs">
      <Pencil className="w-2.5 h-2.5" />
      Editable
    </Badge>
  );
}

export function LiveBadge() {
  return (
    <Badge variant="red" size="sm">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      Live
    </Badge>
  );
}

/* ─── Sync Live Context ──────────────────────────────────── */

interface SyncLiveContextValue {
  syncLive: boolean;
  setSyncLive: (v: boolean) => void;
}

const SyncLiveContext = createContext<SyncLiveContextValue>({
  syncLive: false,
  setSyncLive: () => {},
});

export function SyncLiveProvider({ children }: { children: ReactNode }) {
  const [syncLive, setSyncLive] = useState(false);
  return (
    <SyncLiveContext.Provider value={{ syncLive, setSyncLive }}>
      {children}
    </SyncLiveContext.Provider>
  );
}

export function useSyncLive() {
  return useContext(SyncLiveContext);
}

/* ─── Form Components ────────────────────────────────────── */

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${className || ""}`.trim()} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${textareaClass} ${className || ""}`.trim()} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${className || ""}`.trim()} />;
}

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}

export function SectionCard({ icon: Icon, title, description, children, badge }: SectionCardProps) {
  return (
    <div className="glass-panel rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-dpr-navy-card/50 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-dpr-emerald/10 dark:bg-dpr-gold/10 text-dpr-emerald dark:text-dpr-gold flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
            {badge || <EditableBadge />}
          </div>
          {description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
  showBadge?: boolean;
}

export function Field({ label, children, required, full = true, showBadge = true }: FieldProps) {
  return (
    <div className={full ? "space-y-0" : "space-y-0"}>
      <label className={labelClass}>
        <span className="inline-flex items-center gap-1.5">
          {label}
          {required && <span className="text-red-500">*</span>}
          {showBadge && (
            <span className="inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1 py-0 rounded border border-emerald-200 dark:border-emerald-800">
              <Pencil className="w-2 h-2" />
              Edit
            </span>
          )}
        </span>
      </label>
      {children}
    </div>
  );
}

interface GridProps {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export function Grid({ cols = 2, children }: GridProps) {
  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };
  return <div className={`grid ${colMap[cols]} gap-4`}>{children}</div>;
}

interface SaveBarProps {
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}

export function SaveBar({ saving, saved, onSave }: SaveBarProps) {
  const { syncLive } = useSyncLive();

  return (
    <div className="sticky bottom-4 z-30">
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-dpr-gold/40 shadow-2xl px-5 py-3 flex items-center justify-between gap-4 bg-white/95 dark:bg-dpr-navy/95">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {syncLive ? (
            <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sync Live aktif — perubahan tersimpan otomatis
            </span>
          ) : saved ? (
            <span className="text-dpr-emerald dark:text-dpr-gold font-bold flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Perubahan tersimpan
            </span>
          ) : (
            "Perubahan ditampilkan di situs publik secara langsung."
          )}
        </div>
        {!syncLive && (
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 bg-dpr-emerald dark:bg-gold-gradient text-white dark:text-dpr-navy font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md dark:shadow-gold-glow hover:opacity-90 disabled:opacity-60 transition-all"
          >
            {saving ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-dpr-emerald dark:bg-gold-gradient flex items-center justify-center shadow-md dark:shadow-gold-glow">
          <Icon className="w-5 h-5 text-white dark:text-dpr-navy" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="glass-panel p-10 rounded-2xl text-center space-y-3">
      <Icon className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto" />
      <h3 className="text-slate-900 dark:text-white font-bold text-base">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
    </div>
  );
}

export function ModalWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-white/60 dark:bg-black/70 backdrop-blur-md">
      {children}
    </div>,
    document.body
  );
}

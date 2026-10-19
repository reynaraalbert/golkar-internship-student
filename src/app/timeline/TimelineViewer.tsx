"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, CircleDot, Circle } from "lucide-react";
import type { BatchInfo, StageStatus } from "@/lib/batch";

interface Section {
  id?: string;
  batch?: string;
  title?: string;
  content?: string;
  order?: number;
  status?: StageStatus;
}

export default function TimelineViewer({
  allSections,
  batches,
  batchInfo,
  initialBatch,
  statusLabels,
}: {
  allSections: Section[];
  batches: string[];
  batchInfo: BatchInfo[];
  initialBatch: string;
  statusLabels: Record<StageStatus, string>;
}) {
  const [selectedBatch, setSelectedBatch] = useState(initialBatch);

  // Filter sections by the currently selected batch
  const displayedSections = allSections.filter(
    (s) => !s.batch || s.batch === selectedBatch
  );

  const selectedInfo = batchInfo.find((b) => b.name === selectedBatch);

  const statusStyle: Record<StageStatus, { badge: string; icon: React.ReactNode }> = {
    selesai: {
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    berlangsung: {
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
      icon: <CircleDot className="w-4 h-4" />,
    },
    "akan-datang": {
      badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
      icon: <Circle className="w-4 h-4" />,
    },
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-3 mb-12">
        <label htmlFor="batch-select" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Pilih Batch
        </label>
        <select
          id="batch-select"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
        >
          {batches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {selectedInfo && (
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Status pendaftaran:{" "}
            <strong
              className={
                selectedInfo.registrationOpen
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-700 dark:text-slate-300"
              }
            >
              {selectedInfo.status}
            </strong>
          </span>
        )}
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-amber-300 dark:before:via-amber-700/50 before:to-transparent">
        {displayedSections.length === 0 ? (
          <div className="text-center py-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/10 relative z-10">
            <Clock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada timeline untuk {selectedBatch}.</p>
          </div>
        ) : (
          displayedSections.map((sec, idx) => {
            const status: StageStatus = sec.status || "akan-datang";
            const style = statusStyle[status];
            return (
              <div key={sec.id || idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-amber-400 text-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                  {style.icon}
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 shadow hover:border-amber-400 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">{sec.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                        Tahap {sec.order || idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${style.badge}`}>
                        {statusLabels[status]}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{sec.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

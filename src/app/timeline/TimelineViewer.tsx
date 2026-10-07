"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";

export default function TimelineViewer({ 
  allSections, 
  batches, 
  initialBatch 
}: { 
  allSections: any[], 
  batches: string[], 
  initialBatch: string 
}) {
  const [selectedBatch, setSelectedBatch] = useState(initialBatch);

  // Filter sections by the currently selected batch
  const displayedSections = allSections.filter((s: any) => !s.batch || s.batch === selectedBatch);

  return (
    <div>
      <div className="flex justify-center mb-12">
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
        >
          {batches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-amber-300 dark:before:via-amber-700/50 before:to-transparent">
        {displayedSections.length === 0 ? (
          <div className="text-center py-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/10 relative z-10">
            <Clock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada timeline untuk {selectedBatch}.</p>
          </div>
        ) : (
          displayedSections.map((sec: any, idx: number) => (
            <div key={sec.id || idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-amber-400 text-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                <Clock className="w-4 h-4" />
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 shadow hover:border-amber-400 transition-colors">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">{sec.title}</h3>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                    Tahap {sec.order || idx + 1}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{sec.content}</p>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

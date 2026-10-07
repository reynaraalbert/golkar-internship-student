"use client";

import React, { useEffect, useState } from "react";
import TimelineViewer from "@/app/timeline/TimelineViewer";

export default function TimelineWidget() {
  const [data, setData] = useState<{ sections: any[], allBatches: string[], latestBatch: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timeline")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !data.sections || data.sections.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm mt-8 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Timeline Pelaksanaan Magang</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Pantau jadwal dan tahapan penting dalam program GIS.</p>
      </div>
      <TimelineViewer 
        allSections={data.sections} 
        batches={data.allBatches} 
        initialBatch={data.latestBatch} 
      />
    </div>
  );
}

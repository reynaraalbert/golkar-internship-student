/**
 * Single source of truth for batch registration status.
 *
 * Data lives in the CMS `timeline` document (PageContent slug "timeline"):
 *   {
 *     batches: ["Batch 1 (2024)", ...],
 *     batchSettings: { "Batch 4 (2026)": { registrationStart, registrationEnd, status? } },
 *     sections: [{ batch, title, content, startDate, endDate, order }]
 *   }
 *
 * The registration window is derived from `batchSettings` when present,
 * otherwise from the first timeline stage (registration) of that batch.
 */

export type BatchStatus = "Dibuka" | "Ditutup" | "Selesai" | "Belum Dibuka";

export interface TimelineStage {
  id?: string;
  batch?: string;
  title?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface BatchSetting {
  registrationStart?: string;
  registrationEnd?: string;
  status?: BatchStatus;
}

export interface TimelineData {
  batches?: string[];
  batchSettings?: Record<string, BatchSetting>;
  sections?: TimelineStage[];
}

export interface BatchInfo {
  name: string;
  status: BatchStatus;
  registrationOpen: boolean;
  startDate?: string;
  endDate?: string;
}

export const DEFAULT_BATCHES = [
  "Batch 1 (2024)",
  "Batch 2 (2025)",
  "Batch 3 (2026)",
  "Batch 4 (2026)",
];

const REGISTRATION_TITLE = /pendaftaran|registrasi/i;

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function endOfDay(value?: string): Date | null {
  const d = parseDate(value);
  if (!d) return null;
  d.setHours(23, 59, 59, 999);
  return d;
}

function registrationStageFor(sections: TimelineStage[], batch: string): TimelineStage | undefined {
  return sections
    .filter((s) => (!s.batch || s.batch === batch) && REGISTRATION_TITLE.test(s.title || ""))
    .sort((a, b) => (a.order || 0) - (b.order || 0))[0];
}

export function getBatchInfo(timeline: TimelineData | null | undefined, batch: string): BatchInfo {
  const settings = timeline?.batchSettings?.[batch] || {};
  const sections = Array.isArray(timeline?.sections) ? timeline!.sections! : [];
  const stage = registrationStageFor(sections, batch);

  const startRaw = settings.registrationStart || stage?.startDate;
  const endRaw = settings.registrationEnd || stage?.endDate;

  const start = parseDate(startRaw);
  const end = endOfDay(endRaw);
  const now = new Date();

  // An explicit status set by the admin always wins.
  if (settings.status) {
    return {
      name: batch,
      status: settings.status,
      registrationOpen: settings.status === "Dibuka",
      startDate: startRaw,
      endDate: endRaw,
    };
  }

  if (!start && !end) {
    // No schedule configured → do not advertise an open registration.
    return { name: batch, status: "Belum Dibuka", registrationOpen: false };
  }

  if (start && now < start) {
    return { name: batch, status: "Belum Dibuka", registrationOpen: false, startDate: startRaw, endDate: endRaw };
  }

  if (end && now > end) {
    const allStages = sections.filter((s) => !s.batch || s.batch === batch);
    const lastEnd = allStages
      .map((s) => endOfDay(s.endDate))
      .filter((d): d is Date => d !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0];

    // After the registration deadline: "Selesai" if the whole batch ended,
    // otherwise the registration is simply "Ditutup".
    const finished = lastEnd ? now > lastEnd : false;
    return {
      name: batch,
      status: finished ? "Selesai" : "Ditutup",
      registrationOpen: false,
      startDate: startRaw,
      endDate: endRaw,
    };
  }

  return { name: batch, status: "Dibuka", registrationOpen: true, startDate: startRaw, endDate: endRaw };
}

export function getAllBatchInfo(timeline: TimelineData | null | undefined): BatchInfo[] {
  const batches = timeline?.batches?.length ? timeline.batches : DEFAULT_BATCHES;
  return batches.map((batch) => getBatchInfo(timeline, batch));
}

/** Latest batch by list order (the last entry in the CMS list). */
export function getLatestBatchInfo(timeline: TimelineData | null | undefined): BatchInfo {
  const batches = timeline?.batches?.length ? timeline.batches : DEFAULT_BATCHES;
  return getBatchInfo(timeline, batches[batches.length - 1]);
}

export function isRegistrationOpen(timeline: TimelineData | null | undefined): boolean {
  return getAllBatchInfo(timeline).some((b) => b.registrationOpen);
}

export type StageStatus = "selesai" | "berlangsung" | "akan-datang";

export function getStageStatus(stage: TimelineStage, now = new Date()): StageStatus {
  const start = parseDate(stage.startDate);
  const end = endOfDay(stage.endDate);

  if (!start && !end) return "akan-datang";
  if (start && now < start) return "akan-datang";
  if (end && now > end) return "selesai";
  return "berlangsung";
}

export const STAGE_STATUS_LABEL: Record<StageStatus, string> = {
  selesai: "Selesai",
  berlangsung: "Berlangsung",
  "akan-datang": "Akan Datang",
};

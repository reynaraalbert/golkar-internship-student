import fs from "fs";
import path from "path";

export type CalendarScope = "all" | "selected";

export const CALENDAR_CATEGORIES = [
  "wawancara",
  "seleksi",
  "pengumuman",
  "kegiatan",
  "deadline",
  "lainnya",
] as const;

export type CalendarCategory = (typeof CALENDAR_CATEGORIES)[number];

export interface CalendarEvent {
  id: string;
  title: string;
  /** Format YYYY-MM-DD */
  date: string;
  /** Format HH:mm (opsional) */
  time: string;
  location: string;
  description: string;
  category: CalendarCategory;
  /** "all" = tampil untuk semua peserta, "selected" = hanya untuk userIds */
  scope: CalendarScope;
  userIds: string[];
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CALENDAR_FILE = path.join(DATA_DIR, "calendar.json");

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CALENDAR_FILE)) {
    fs.writeFileSync(CALENDAR_FILE, "[]", "utf8");
  }
}

export function getAllCalendarEvents(): CalendarEvent[] {
  try {
    ensureFileExists();
    const parsed = JSON.parse(fs.readFileSync(CALENDAR_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(events: CalendarEvent[]) {
  ensureFileExists();
  fs.writeFileSync(CALENDAR_FILE, JSON.stringify(events, null, 2), "utf8");
}

export function eventAppliesToUser(event: CalendarEvent, userId: string): boolean {
  return event.scope === "all" || (event.userIds || []).includes(userId);
}

export function getCalendarEventsForUser(userId: string): CalendarEvent[] {
  return getAllCalendarEvents()
    .filter((e) => eventAppliesToUser(e, userId))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export function saveCalendarEvent(event: CalendarEvent): CalendarEvent {
  const events = getAllCalendarEvents();
  const index = events.findIndex((e) => e.id === event.id);
  if (index >= 0) {
    events[index] = { ...events[index], ...event, createdAt: events[index].createdAt };
  } else {
    events.push(event);
  }
  writeAll(events);
  return event;
}

export function deleteCalendarEvent(id: string): boolean {
  const events = getAllCalendarEvents();
  const next = events.filter((e) => e.id !== id);
  if (next.length === events.length) return false;
  writeAll(next);
  return true;
}

/**
 * Validates & normalises an untrusted payload into a CalendarEvent.
 * Returns an error string when the payload is invalid.
 */
export function normalizeCalendarEvent(
  raw: any,
  existing?: CalendarEvent
): { event: CalendarEvent } | { error: string } {
  const title = String(raw?.title ?? "").trim();
  const date = String(raw?.date ?? "").trim();
  const time = String(raw?.time ?? "").trim();
  if (!title) return { error: "Judul agenda wajib diisi." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Tanggal tidak valid (YYYY-MM-DD)." };
  if (time && !/^\d{2}:\d{2}$/.test(time)) return { error: "Jam tidak valid (HH:mm)." };

  const scope: CalendarScope = raw?.scope === "selected" ? "selected" : "all";
  const userIds: string[] =
    scope === "selected" && Array.isArray(raw?.userIds)
      ? Array.from(new Set(raw.userIds.map((u: unknown) => String(u)).filter(Boolean)))
      : [];
  if (scope === "selected" && userIds.length === 0) {
    return { error: "Pilih minimal satu peserta, atau ubah ke 'Semua Peserta'." };
  }

  const category: CalendarCategory = (CALENDAR_CATEGORIES as readonly string[]).includes(raw?.category)
    ? raw.category
    : "lainnya";

  const now = new Date().toISOString();
  return {
    event: {
      id: existing?.id || String(raw?.id || `cal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`),
      title,
      date,
      time,
      location: String(raw?.location ?? "").trim(),
      description: String(raw?.description ?? "").trim(),
      category,
      scope,
      userIds,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    },
  };
}

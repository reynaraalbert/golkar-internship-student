import { z } from "zod";

/**
 * Status values accepted by the admin verification screen
 * (`src/app/admin/(protected)/pendaftar/page.tsx`).
 */
export const APPLICATION_STATUSES = [
  "MENUNGGU_VERIFIKASI",
  "LOLOS_BERKAS",
  "LOLOS_WAWANCARA",
  "TIDAK_LOLOS",
  "CADANGAN",
] as const;

/** Legacy participant statuses still present in the database. */
export const LEGACY_MEMBER_STATUSES = [
  "Belum Melamar",
  "Dalam Seleksi",
  "Terverifikasi",
  "Aktif",
] as const;

export const memberStatusSchema = z.enum([
  ...APPLICATION_STATUSES,
  ...LEGACY_MEMBER_STATUSES,
]);

export type MemberStatus = z.infer<typeof memberStatusSchema>;

export const adminUpdateParticipantSchema = z.object({
  id: z.string().trim().min(1, "ID wajib diisi.").max(64),
  statusMagang: memberStatusSchema.optional(),
  bio: z.string().trim().max(2000, "Catatan maksimal 2000 karakter.").optional(),
});

export const participantUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  university: z.string().trim().min(1).max(160).optional(),
  major: z.string().trim().min(1).max(160).optional(),
  phone: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  domisili: z.string().trim().max(160).optional(),
  nim: z.string().trim().max(40).optional(),
  ipk: z.string().trim().max(10).optional(),
  semester: z.string().trim().max(4).optional(),
  bio: z.string().trim().max(2000).optional(),
  photoUrl: z.string().trim().max(2000).optional(),
  cvUrl: z.string().trim().max(2000).optional(),
  tipeInstitusi: z.string().trim().max(60).optional(),
  programPendidikan: z.string().trim().max(120).optional(),
  statusPtnPts: z.string().trim().max(20).optional(),
  lokasiKampus: z.string().trim().max(160).optional(),
  fakultas: z.string().trim().max(160).optional(),
  socialMedia: z.record(z.string(), z.string().trim().max(500)).optional(),
  documents: z.record(z.string(), z.string().trim().max(4000)).optional(),
  posisiDilamar: z.string().trim().max(160).optional(),
});

export type ParticipantUpdate = z.infer<typeof participantUpdateSchema>;

/** Formats a zod error into a generic, non-leaking message. */
export function validationErrorResponse(error: z.ZodError): string {
  const first = error.issues[0];
  return first?.message || "Data yang dikirim tidak valid.";
}

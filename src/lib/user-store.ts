import { prisma } from "@/lib/prisma";
import type { StudentUser as PrismaStudent, UserExperience as PrismaExperience, Prisma } from "@prisma/client";

export type ExperienceType = "organisasi" | "professional" | "project";

export interface UserExperience {
  id: string;
  type: ExperienceType;
  title: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  url: string;
  createdAt: string;
}

export interface SocialMedia {
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  website?: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  university: string;
  major: string;
  phone: string;
  whatsapp?: string;
  domisili?: string;
  photoUrl: string;
  statusMagang: "Terverifikasi" | "Dalam Seleksi" | "Aktif" | "Belum Melamar" | string;
  posisiDilamar: string;
  nim?: string;
  ipk?: string;
  semester?: string;
  bio?: string;
  cvUrl?: string;
  tipeInstitusi?: string;
  programPendidikan?: string;
  statusPtnPts?: string;
  lokasiKampus?: string;
  fakultas?: string;
  socialMedia?: SocialMedia;
  documents?: Record<string, string>;
  experiences?: UserExperience[];
  createdAt: string;
}

type StudentUserWithExperiences = PrismaStudent & {
  experiences?: PrismaExperience[];
};

// ─── Helper: Convert Prisma row to our interface ───
function rowToStudentUser(row: StudentUserWithExperiences): StudentUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    university: row.university,
    major: row.major,
    phone: row.phone || "",
    whatsapp: row.whatsapp || undefined,
    domisili: row.domisili || undefined,
    photoUrl: row.photoUrl || "",
    statusMagang: row.statusMagang || "Belum Melamar",
    posisiDilamar: row.posisiDilamar || "",
    nim: row.nim || undefined,
    ipk: row.ipk || undefined,
    semester: row.semester || undefined,
    bio: row.bio || undefined,
    cvUrl: row.cvUrl || undefined,
    tipeInstitusi: row.tipeInstitusi || undefined,
    programPendidikan: row.programPendidikan || undefined,
    statusPtnPts: row.statusPtnPts || undefined,
    lokasiKampus: row.lokasiKampus || undefined,
    fakultas: row.fakultas || undefined,
    socialMedia: (row.socialMedia as SocialMedia) || undefined,
    documents: (row.documents as Record<string, string>) || undefined,
    experiences: row.experiences
      ? row.experiences.map((e: PrismaExperience) => ({
        id: e.id,
        type: e.type as ExperienceType,
        title: e.title,
        role: e.role || "",
        startDate: e.startDate || "",
        endDate: e.endDate || "",
        isCurrent: e.isCurrent,
        description: e.description || "",
        url: e.url || "",
        createdAt: e.createdAt.toISOString(),
      }))
      : [],
    createdAt: row.createdAt.toISOString(),
  };
}

// ─── Public functions (all async, using Prisma) ───

export async function getAllStudentUsers(): Promise<StudentUser[]> {
  const rows = await prisma.studentUser.findMany({
    include: { experiences: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(rowToStudentUser);
}

export async function findStudentUserByEmail(email: string): Promise<StudentUser | undefined> {
  const row = await prisma.studentUser.findUnique({
    where: { email: email.toLowerCase() },
    include: { experiences: true },
  });
  return row ? rowToStudentUser(row) : undefined;
}

export async function findStudentUserById(id: string): Promise<StudentUser | undefined> {
  const row = await prisma.studentUser.findUnique({
    where: { id },
    include: { experiences: true },
  });
  return row ? rowToStudentUser(row) : undefined;
}

export async function saveStudentUser(user: Partial<StudentUser> & { id: string; email: string }): Promise<StudentUser> {
  const { experiences, createdAt, id, passwordHash, ...data } = user;

  const prismaData: Prisma.StudentUserUpdateInput = {
    ...data,
    socialMedia: user.socialMedia !== undefined ? (user.socialMedia as unknown as Prisma.InputJsonValue) : undefined,
    documents: user.documents !== undefined ? (user.documents as unknown as Prisma.InputJsonValue) : undefined,
  };

  // Check if user exists
  const existing = await prisma.studentUser.findUnique({ where: { id: user.id } });

  if (existing) {
    const row = await prisma.studentUser.update({
      where: { id: user.id },
      data: prismaData,
      include: { experiences: true },
    });
    return rowToStudentUser(row);
  } else {
    // For new user creation, include passwordHash
    const createData: Prisma.StudentUserCreateInput = {
      id: user.id,
      name: user.name || "",
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash || "",
      university: user.university || "",
      major: user.major || "Umum",
      phone: user.phone || "",
      photoUrl: user.photoUrl || "",
      statusMagang: user.statusMagang || "Belum Melamar",
      posisiDilamar: user.posisiDilamar || "",
      nim: user.nim,
      ipk: user.ipk,
      semester: user.semester,
      bio: user.bio,
      cvUrl: user.cvUrl,
      tipeInstitusi: user.tipeInstitusi,
      programPendidikan: user.programPendidikan,
      statusPtnPts: user.statusPtnPts,
      lokasiKampus: user.lokasiKampus,
      fakultas: user.fakultas,
      socialMedia: user.socialMedia as unknown as Prisma.InputJsonValue,
      documents: user.documents as unknown as Prisma.InputJsonValue,
    };

    const row = await prisma.studentUser.create({
      data: createData,
      include: { experiences: true },
    });
    return rowToStudentUser(row);
  }
}

export async function createStudentUser(userData: {
  name: string;
  email: string;
  passwordHash: string;
  university: string;
  major: string;
  phone: string;
  photoUrl?: string;
}): Promise<StudentUser> {
  const row = await prisma.studentUser.create({
    data: {
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      university: userData.university,
      major: userData.major || "Umum",
      phone: userData.phone || "",
      photoUrl: userData.photoUrl || "",
      statusMagang: "Belum Melamar",
      posisiDilamar: "",
    },
    include: { experiences: true },
  });
  return rowToStudentUser(row);
}

// ─── Experience CRUD (using Prisma) ───

export async function addExperience(userId: string, exp: Omit<UserExperience, "id" | "createdAt">): Promise<UserExperience> {
  const row = await prisma.userExperience.create({
    data: {
      studentUserId: userId,
      type: exp.type,
      title: exp.title,
      role: exp.role || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      isCurrent: exp.isCurrent || false,
      description: exp.description || "",
      url: exp.url || null,
    },
  });
  return {
    id: row.id,
    type: row.type as ExperienceType,
    title: row.title,
    role: row.role,
    startDate: row.startDate,
    endDate: row.endDate,
    isCurrent: row.isCurrent,
    description: row.description,
    url: row.url || "",
    createdAt: row.createdAt.toISOString(),
  };
}

export async function updateExperience(expId: string, exp: Partial<UserExperience>): Promise<UserExperience> {
  const data: Prisma.UserExperienceUpdateInput = {};
  if (exp.type !== undefined) data.type = exp.type;
  if (exp.title !== undefined) data.title = exp.title;
  if (exp.role !== undefined) data.role = exp.role;
  if (exp.startDate !== undefined) data.startDate = exp.startDate;
  if (exp.endDate !== undefined) data.endDate = exp.endDate;
  if (exp.isCurrent !== undefined) data.isCurrent = exp.isCurrent;
  if (exp.description !== undefined) data.description = exp.description;
  if (exp.url !== undefined) data.url = exp.url || null;

  const row = await prisma.userExperience.update({
    where: { id: expId },
    data,
  });
  return {
    id: row.id,
    type: row.type as ExperienceType,
    title: row.title,
    role: row.role,
    startDate: row.startDate,
    endDate: row.endDate,
    isCurrent: row.isCurrent,
    description: row.description,
    url: row.url || "",
    createdAt: row.createdAt.toISOString(),
  };
}

export async function deleteExperience(expId: string): Promise<void> {
  await prisma.userExperience.delete({ where: { id: expId } });
}

export async function getExperiencesByUserId(userId: string): Promise<UserExperience[]> {
  const rows = await prisma.userExperience.findMany({
    where: { studentUserId: userId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    type: row.type as ExperienceType,
    title: row.title,
    role: row.role,
    startDate: row.startDate,
    endDate: row.endDate,
    isCurrent: row.isCurrent,
    description: row.description,
    url: row.url || "",
    createdAt: row.createdAt.toISOString(),
  }));
}

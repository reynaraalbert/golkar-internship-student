import fs from "fs";
import path from "path";

export type ExperienceType = "organisasi" | "professional" | "project";

export interface UserExperience {
  id: string;
  type: ExperienceType;
  /** Nama organisasi / perusahaan / project */
  title: string;
  /** Jabatan / peran */
  role: string;
  /** Format YYYY-MM */
  startDate: string;
  /** Format YYYY-MM, kosong jika masih berjalan */
  endDate: string;
  isCurrent: boolean;
  description: string;
  /** Link project / portofolio / bukti (opsional) */
  url: string;
  createdAt: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // stored plainly or hashed for simple demo
  university: string;
  major: string;
  phone: string;
  photoUrl: string;
  statusMagang: "Terverifikasi" | "Dalam Seleksi" | "Aktif" | "Belum Melamar";
  posisiDilamar: string;
  nim?: string;
  ipk?: string;
  semester?: string;
  bio?: string;
  cvUrl?: string;
  experiences?: UserExperience[];
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const DEFAULT_USERS: StudentUser[] = [
  {
    id: "user-default-1",
    name: "Reynara Albert Pradana",
    email: "reynara@ui.ac.id",
    passwordHash: "peserta123",
    university: "Universitas Indonesia",
    major: "Ilmu Hukum & Kebijakan Publik",
    phone: "081234567890",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    statusMagang: "Terverifikasi",
    posisiDilamar: "Program Magang Analisis Kebijakan & Riset Legislatif",
    nim: "2006123456",
    ipk: "3.85",
    semester: "Semester 6",
    bio: "Mahasiswa tingkat akhir dengan ketertarikan tinggi pada analisis hukum legislatif dan kebijakan publik Indonesia.",
    createdAt: "2026-09-01T00:00:00.000Z",
  },
];

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), "utf8");
  }
}

export function getAllStudentUsers(): StudentUser[] {
  try {
    ensureFileExists();
    const content = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(content);
  } catch {
    return DEFAULT_USERS;
  }
}

export function findStudentUserByEmail(email: string): StudentUser | undefined {
  const users = getAllStudentUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findStudentUserById(id: string): StudentUser | undefined {
  const users = getAllStudentUsers();
  return users.find((u) => u.id === id);
}

export function saveStudentUser(user: StudentUser): StudentUser {
  ensureFileExists();
  const users = getAllStudentUsers();
  const index = users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.push(user);
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  return user;
}

import { describe, it, expect } from "vitest";
import { getBatchInfo, getAllBatchInfo, getStageStatus, isRegistrationOpen } from "@/lib/batch";

const now = new Date();
const day = 24 * 60 * 60 * 1000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

describe("batch registration status", () => {
  it("Dibuka ketika hari ini di dalam rentang pendaftaran", () => {
    const timeline = {
      batches: ["Batch Uji"],
      batchSettings: {
        "Batch Uji": {
          registrationStart: iso(new Date(now.getTime() - day)),
          registrationEnd: iso(new Date(now.getTime() + day)),
        },
      },
      sections: [],
    };
    const info = getBatchInfo(timeline, "Batch Uji");
    expect(info.status).toBe("Dibuka");
    expect(info.registrationOpen).toBe(true);
  });

  it("Belum Dibuka ketika pendaftaran baru dimulai nanti", () => {
    const timeline = {
      batches: ["Batch Uji"],
      batchSettings: {
        "Batch Uji": {
          registrationStart: iso(new Date(now.getTime() + 7 * day)),
          registrationEnd: iso(new Date(now.getTime() + 14 * day)),
        },
      },
      sections: [],
    };
    const info = getBatchInfo(timeline, "Batch Uji");
    expect(info.status).toBe("Belum Dibuka");
    expect(info.registrationOpen).toBe(false);
  });

  it("Ditutup ketika pendaftaran sudah lewat", () => {
    const timeline = {
      batches: ["Batch Uji"],
      batchSettings: {
        "Batch Uji": {
          registrationStart: iso(new Date(now.getTime() - 30 * day)),
          registrationEnd: iso(new Date(now.getTime() - 10 * day)),
        },
      },
      sections: [
        { title: "Registrasi", startDate: iso(new Date(now.getTime() - 30 * day)), endDate: iso(new Date(now.getTime() - 10 * day)) },
        { title: "Pengumuman", startDate: iso(new Date(now.getTime() - 5 * day)), endDate: iso(new Date(now.getTime() - 4 * day)) },
      ],
    };
    const info = getBatchInfo(timeline, "Batch Uji");
    expect(info.registrationOpen).toBe(false);
    expect(["Ditutup", "Selesai"]).toContain(info.status);
  });

  it("status eksplisit menimpa perhitungan tanggal", () => {
    const timeline = {
      batches: ["Batch Uji"],
      batchSettings: { "Batch Uji": { status: "Dibuka" as const } },
      sections: [],
    };
    expect(getBatchInfo(timeline, "Batch Uji").registrationOpen).toBe(true);
  });

  it("tanpa jadwal tidak pernah dianggap dibuka", () => {
    expect(getBatchInfo({ batches: ["X"], sections: [] }, "X").registrationOpen).toBe(false);
    expect(isRegistrationOpen({ batches: ["X"], sections: [] })).toBe(false);
  });

  it("getAllBatchInfo mengembalikan semua batch", () => {
    const all = getAllBatchInfo({ batches: ["A", "B"], sections: [] });
    expect(all.map((b) => b.name)).toEqual(["A", "B"]);
  });
});

describe("stage status", () => {
  it("selesai untuk tahap yang sudah lewat", () => {
    expect(
      getStageStatus({
        startDate: iso(new Date(now.getTime() - 10 * day)),
        endDate: iso(new Date(now.getTime() - 5 * day)),
      })
    ).toBe("selesai");
  });

  it("berlangsung untuk tahap saat ini", () => {
    expect(
      getStageStatus({
        startDate: iso(new Date(now.getTime() - day)),
        endDate: iso(new Date(now.getTime() + day)),
      })
    ).toBe("berlangsung");
  });

  it("akan-datang untuk tahap mendatang", () => {
    expect(
      getStageStatus({
        startDate: iso(new Date(now.getTime() + 5 * day)),
        endDate: iso(new Date(now.getTime() + 10 * day)),
      })
    ).toBe("akan-datang");
  });
});

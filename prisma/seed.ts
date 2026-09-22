import { PrismaClient } from "@prisma/client";
import { BERITA_LIST, AGENDA_LIST, ANGGOTA_KOMISI, PIMPINAN_KOMISI, MITRA_KERJA, STATS, SiteContent } from "../src/lib/data";
import { PAGES } from "../src/lib/pages";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Supabase Database Seeding...");

  // 1. Seed Berita
  console.log("Seeding Berita...");
  for (const item of BERITA_LIST) {
    await prisma.newsArticle.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        date: item.date,
        readTime: item.readTime,
        author: item.author,
        summary: item.summary,
        content: item.content,
        imageUrl: item.imageUrl,
        documentUrl: item.documentUrl || null,
        isFeatured: item.isFeatured || false,
      },
    });
  }

  // 2. Seed Agenda
  console.log("Seeding Agenda...");
  for (const item of AGENDA_LIST) {
    await prisma.agendaItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        type: item.type,
        partner: item.partner,
        date: item.date,
        time: item.time,
        location: item.location,
        status: item.status,
        summary: item.summary,
        streamUrl: item.streamUrl || null,
        pdfDownloadUrl: item.pdfDownloadUrl || null,
      },
    });
  }

  // 3. Seed Anggota & Pimpinan
  console.log("Seeding Anggota & Pimpinan...");
  for (const item of [...PIMPINAN_KOMISI, ...ANGGOTA_KOMISI]) {
    await prisma.member.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        nomorAnggota: item.nomorAnggota,
        name: item.name,
        role: item.role,
        fraksi: item.fraksi,
        dapil: item.dapil,
        photoUrl: item.photoUrl,
        email: item.email,
        bio: item.bio,
        billsLed: item.billsLed,
        pendidikan: item.pendidikan || null,
        masaJabatan: item.masaJabatan || null,
        komisi: item.komisi || null,
      },
    });
  }

  // 4. Seed Mitra Kerja
  console.log("Seeding Mitra Kerja...");
  for (const item of MITRA_KERJA) {
    await prisma.mitraKerja.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        acronym: item.acronym,
        ministerOrHead: item.ministerOrHead,
        focusArea: item.focusArea,
        logoUrl: item.logoUrl,
        description: item.description,
      },
    });
  }

  // 6. Seed Pages
  console.log("Seeding Pages CMS...");
  for (const page of PAGES) {
    await prisma.pageContent.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        sections: page.sections as any,
      },
    });
  }

  // 6b. Seed Site Content (beranda content: hero, footer, kontak, maps, dll.)
  console.log("Seeding Site Content...");
  await prisma.pageContent.upsert({
    where: { slug: "siteContent" },
    update: {},
    create: {
      id: "siteContent",
      slug: "siteContent",
      title: "siteContent",
      sections: SiteContent as any,
    },
  });

  // 7. Seed Stats
  console.log("Seeding Site Stats...");
  await prisma.siteStat.upsert({
    where: { id: "default-stats" },
    update: {},
    create: {
      id: "default-stats",
      ...STATS,
    },
  });

  console.log("✅ Supabase Database Seeding Completed Successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

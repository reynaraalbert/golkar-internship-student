import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import type { NewsSubmission, NewsArticle } from "@/lib/data";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

interface Proofread {
  title?: string;
  category?: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  documentUrl?: string;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatDate(date?: string): string {
  if (date) return date;
  return new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function buildArticle(sub: NewsSubmission, proofread: Proofread, id: string): NewsArticle {
  const title = proofread.title?.trim() || sub.artikel.judul;
  return {
    id,
    title,
    slug: slugify(title),
    category: (proofread.category || sub.artikel.kategori) as NewsArticle["category"],
    date: formatDate(sub.artikel.tanggal),
    readTime: "4 Menit Baca",
    author: sub.biodata.nama,
    summary: proofread.summary?.trim() || sub.artikel.ringkasan,
    content: proofread.content?.trim() || sub.artikel.isiBerita,
    imageUrl: proofread.imageUrl || sub.attachments.imageUrl || "",
    documentUrl: proofread.documentUrl || sub.attachments.documentUrl || "",
    isFeatured: false,
  };
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const proofread: Proofread = body.proofread || {};

    const row = await prisma.newsSubmission.findUnique({ where: { id: params.id } });
    if (!row) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    const sub = row as unknown as NewsSubmission;
    const publishedNewsId = (sub.artikel.publishedNewsId as string) || null;

    const updateSubmission = (patch: Partial<NewsSubmission>) =>
      prisma.newsSubmission.update({
        where: { id: params.id },
        data: {
          status: patch.status || sub.status,
          proofreadNotes: patch.proofreadNotes !== undefined ? patch.proofreadNotes : body.proofreadNotes || row.proofreadNotes,
          artikel: patch.artikel !== undefined ? (patch.artikel as any) : row.artikel,
        },
      });

    if (body.action === "approve") {
      const articleId = publishedNewsId || `news-${Date.now()}`;
      const article = buildArticle(sub, proofread, articleId);
      await prisma.newsArticle.upsert({
        where: { id: article.id },
        update: {
          title: article.title,
          slug: article.slug,
          category: article.category,
          date: article.date,
          readTime: article.readTime,
          author: article.author,
          summary: article.summary,
          content: article.content,
          imageUrl: article.imageUrl,
          documentUrl: article.documentUrl || null,
          isFeatured: article.isFeatured,
        },
        create: article,
      });
      await updateSubmission({
        status: "approved",
        artikel: { ...sub.artikel, publishedNewsId: article.id },
        proofreadNotes: body.proofreadNotes || "",
      });
      return NextResponse.json({ ok: true });
    }

    if (body.action === "decline") {
      await updateSubmission({ status: "declined", proofreadNotes: body.proofreadNotes || "" });
      return NextResponse.json({ ok: true });
    }

    if (body.action === "update") {
      const artikel: typeof sub.artikel = {
        ...sub.artikel,
        judul: proofread.title?.trim() || sub.artikel.judul,
        kategori: proofread.category || sub.artikel.kategori,
        ringkasan: proofread.summary?.trim() || sub.artikel.ringkasan,
        isiBerita: proofread.content?.trim() || sub.artikel.isiBerita,
      };
      await updateSubmission({
        status: sub.status,
        artikel,
        proofreadNotes: body.proofreadNotes || "",
      });
      if (sub.status === "approved" && publishedNewsId) {
        await prisma.newsArticle.updateMany({
          where: { id: publishedNewsId },
          data: {
            title: artikel.judul,
            slug: slugify(artikel.judul),
            category: artikel.kategori as NewsArticle["category"],
            summary: artikel.ringkasan,
            content: artikel.isiBerita,
            imageUrl: proofread.imageUrl || sub.attachments.imageUrl || "",
            documentUrl: proofread.documentUrl || sub.attachments.documentUrl || "",
          },
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (body.action === "takedown") {
      if (publishedNewsId) {
        await prisma.newsArticle.deleteMany({ where: { id: publishedNewsId } });
      } else {
        await prisma.newsArticle.deleteMany({ where: { slug: slugify(sub.artikel.judul) } });
      }
      await updateSubmission({ status: "takedown", proofreadNotes: body.proofreadNotes || "" });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Aksi tidak dikenal" }, { status: 400 });
  } catch (err) {
    console.error("[Submissions PUT Error]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memproses aksi" }, { status: 500 });
  }
}
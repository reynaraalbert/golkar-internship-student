import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use Supabase's transaction pooler (DATABASE_URL, port 6543 + pgbouncer=true).
// This pooler is designed for apps that issue many short queries at once (like
// this CMS endpoint that reads several collections in parallel) and reuses a
// shared pool. It never hits the "session mode: max clients" limit that the
// direct connection (DIRECT_URL, port 5432) hits under load.
//
// The pgbouncer connection_limit is injected here so the CMS stays fast and
// reliable regardless of what value (or missing value) is configured in the
// hosting environment's DATABASE_URL (e.g. Vercel). A limit of 1 (the old
// default) serializes ALL queries → slow CMS and timeouts; too high can exceed
// Supabase's pool. 6 is a safe middle ground for this app's parallel reads.
function withConnectionLimit(url: string | undefined, limit: number): string | undefined {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("connection_limit", String(limit));
    // Keep pgbouncer=true so Prisma routes through the transaction pooler.
    u.searchParams.set("pgbouncer", "true");
    return u.toString();
  } catch {
    return url;
  }
}

function buildClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  const cleanUrl = withConnectionLimit(url, parseInt(process.env.PRISMA_CONNECTION_LIMIT || "6", 10) || 6);
  return new PrismaClient({
    datasources: cleanUrl ? { db: { url: cleanUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma || buildClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
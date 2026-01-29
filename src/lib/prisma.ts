import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Configure pool for Supabase connection pooling (PgBouncer)
  const pool = new Pool({ 
    connectionString,
    // Supabase uses PgBouncer, so we need to disable prepared statements
    // when using transaction mode (port 6543)
    ...(connectionString.includes("pgbouncer=true") && {
      // PgBouncer in transaction mode doesn't support prepared statements
      statement_timeout: 0,
    }),
  });
  
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// lib/prisma.ts
import { PrismaClient as PrismaClientEdge } from "@prisma/client/edge";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: any };

function createPrismaClient() {
  // In Cloudflare Workers environment with D1
  if (process.env.DB) {
    const adapter = new PrismaD1(process.env.DB as any);
    return new PrismaClientEdge({ adapter }).$extends(withAccelerate());
  }

  // For local development - use regular PrismaClient without Accelerate
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

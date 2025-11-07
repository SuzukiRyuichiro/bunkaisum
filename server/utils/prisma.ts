// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { withAccelerate } from "@prisma/extension-accelerate";
import type { H3Event } from "h3";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// For local development, we can create a singleton
let localPrisma: ReturnType<typeof PrismaClient.prototype.$extends> | null = null;

function createLocalPrismaClient() {
  if (!localPrisma) {
    localPrisma = new PrismaClient().$extends(withAccelerate());
  }
  return localPrisma;
}

// Function to get Prisma client based on the environment
export function usePrisma(event?: H3Event) {
  // In Cloudflare Workers environment with D1
  // The DB binding is available from event.context.cloudflare.env
  if (event?.context?.cloudflare?.env?.DB) {
    const adapter = new PrismaD1(event.context.cloudflare.env.DB);
    return new PrismaClient({ adapter }).$extends(withAccelerate());
  }

  // For local development
  return createLocalPrismaClient();
}

// For backward compatibility with auto-imports
// This will only work in local development
export const prisma = globalForPrisma.prisma || createLocalPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

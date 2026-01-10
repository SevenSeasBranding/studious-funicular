import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // In Prisma 7, we pass the direct database connection via adapter or let it use the config
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


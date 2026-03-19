// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL;
  const isAccelerate = url?.startsWith("prisma://") || url?.startsWith("prisma+postgres://");
                       
  if (isAccelerate) {
    return new PrismaClient({
      log: ['query'],
      accelerateUrl: url,
    });
  } else {
    return new PrismaClient({
      log: ['query'],
      datasourceUrl: url,
    });
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

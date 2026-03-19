// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const isAccelerate = process.env.DATABASE_URL?.startsWith("prisma://") || 
                       process.env.DATABASE_URL?.startsWith("prisma+postgres://");
                       
  return new PrismaClient({
    log: ['query'],
    ...(isAccelerate ? { accelerateUrl: process.env.DATABASE_URL } : { datasourceUrl: process.env.DATABASE_URL })
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL;
  const isAccelerate = url?.startsWith("prisma://") || url?.startsWith("prisma+postgres://");
                       
  const options: any = {
    log: ['query'],
  };

  if (isAccelerate) {
    options.accelerateUrl = url;
  } else {
    options.datasourceUrl = url;
  }

  return new PrismaClient(options);
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

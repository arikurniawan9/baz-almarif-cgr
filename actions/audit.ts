"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAuditLogs(q: string = "", page: number = 1, limit: number = 10) {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const skip = (page - 1) * limit;

  const where = q
    ? {
        OR: [
          { action: { equals: q as any } },
          { entity: { contains: q, mode: "insensitive" as any } },
          { user: { name: { contains: q, mode: "insensitive" as any } } }
        ],
      }
    : {};

  const [total, data] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, role: true } }
      }
    }),
  ]);

  return {
    data,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function logAction(
  userId: string,
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT",
  entity: string,
  entityId?: string,
  details?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details ? JSON.stringify(details) : null,
      }
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

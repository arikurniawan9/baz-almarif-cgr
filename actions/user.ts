// actions/user.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function getUsers(search?: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as any } },
          { username: { contains: search, mode: "insensitive" as any } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        wilayah: true
      }
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function createUser(formData: any) {
  const { name, username, password, role, wilayahId } = formData;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
      role: role as Role,
      wilayahId: wilayahId || null,
      active: true,
    },
  });

  revalidatePath("/petugas");
}

export async function updateUser(id: string, formData: any) {
  const { name, username, password, role, active, wilayahId } = formData;
  
  const data: any = {
    name,
    username,
    role: role as Role,
    wilayahId: wilayahId || null,
    active: active === "true" || active === true,
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data,
  });

  revalidatePath("/petugas");
}

export async function toggleUserStatus(id: string, currentStatus: boolean) {
  await prisma.user.update({
    where: { id },
    data: { active: !currentStatus },
  });

  revalidatePath("/petugas");
}

export async function deleteUser(id: string) {
  const count = await prisma.muzakki.count({ where: { petugasId: id } });
  if (count > 0) {
    throw new Error("Petugas ini sudah memiliki data transaksi zakat.");
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/petugas");
}

export async function deleteMultipleUser(ids: string[]) {
  // Check if any user has transactions
  const count = await prisma.muzakki.count({
    where: { petugasId: { in: ids } }
  });

  if (count > 0) {
    throw new Error("Beberapa petugas terpilih sudah memiliki data transaksi.");
  }

  await prisma.user.deleteMany({
    where: { id: { in: ids } }
  });

  revalidatePath("/petugas");
}

// actions/user.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createUser(formData: any) {
  const { name, username, password, role } = formData;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
      role: role as Role,
      active: true,
    },
  });

  revalidatePath("/petugas");
}

export async function updateUser(id: string, formData: any) {
  const { name, username, password, role, active } = formData;
  
  const data: any = {
    name,
    username,
    role: role as Role,
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
  // Check if user has muzakki records
  const count = await prisma.muzakki.count({ where: { petugasId: id } });
  if (count > 0) {
    throw new Error("Tidak dapat menghapus petugas yang sudah memiliki data muzakki");
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/petugas");
}

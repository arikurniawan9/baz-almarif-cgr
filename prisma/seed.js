// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Menggunakan accelerateUrl sesuai spesifikasi Prisma 7 untuk Prisma Postgres (db.prisma.io)
const prisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL || process.env.DATABASE_URL,
});

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Memulai proses seeding...');

  // Create Admin
  await prisma.user.upsert({
    where: { username: 'admintoko' },
    update: {},
    create: {
      username: 'admintoko',
      name: 'Admin Zakat Fitrah',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });

  // Create default setting
  await prisma.setting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      hargaBeras: 15000,
      tahunZakat: '2025',
      identitasPanitia: 'Masjid Al-Ikhlas',
    },
  });

  console.log('Seed data created successfully!');
  console.log('Admin user: admintoko / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

  // Create Wilayah (5 wilayah sesuai kebutuhan BAZ Al Ma'arif CGR)
  const wilayahNames = ['Wilayah 1', 'Wilayah 2', 'Wilayah 3', 'Wilayah 4', 'Wilayah 5'];
  
  for (const nama of wilayahNames) {
    await prisma.wilayah.upsert({
      where: { nama },
      update: {},
      create: { nama },
    });
  }

  console.log('5 Wilayah berhasil dibuat.');

  // Create Admin
  await prisma.user.upsert({
    where: { username: 'adminbaz' },
    update: {},
    create: {
      username: 'adminbaz',
      name: 'Admin Zakat Fitrah',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });

  // Create default setting
  await prisma.setting.upsert({
    where: { id: 'default' },
    update: {
      besaranBeras: 2.5,
      besaranUang: 37500, // 15000 * 2.5
      infakDesaDefault: 2000,
    },
    create: {
      id: 'default',
      hargaBeras: 15000,
      besaranBeras: 2.5,
      besaranUang: 37500,
      infakDesaDefault: 2000,
      tahunZakat: '2026',
      identitasPanitia: 'BAZ Al Ma\'arif CGR',
    },
  });

  console.log('Seed data created successfully!');
  console.log('Admin user: adminbaz / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
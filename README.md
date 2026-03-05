# Zakat Fitrah Manager

Aplikasi web administrasi penerimaan zakat fitrah terintegrasi menggunakan Next.js 14, Prisma, dan PostgreSQL.

## Fitur Utama
- **Dashboard Modern**: Ringkasan penerimaan zakat (Beras & Uang) dengan statistik grafik harian.
- **Manajemen Muzakki**: CRUD data muzakki dengan perhitungan otomatis kewajiban zakat.
- **Manajemen Petugas**: Pengelolaan akun petugas (ADMIN & PETUGAS) dengan aktivasi/nonaktifkan akun.
- **Rekap & Laporan**: Export laporan ke format PDF dan Excel.
- **Pengaturan Fleksibel**: Konfigurasi harga beras per kg, tahun zakat, dan identitas panitia.
- **Autentikasi Aman**: Login menggunakan NextAuth Credentials dengan proteksi middleware.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **UI Components**: Shadcn UI & Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Utility**: Server Actions, bcrypt, jsPDF, ExcelJS

## Cara Menjalankan

### 1. Persiapan
Pastikan Anda memiliki Node.js dan database PostgreSQL yang aktif.

### 2. Instalasi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di root direktori (bisa salin dari `.env.example`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/zakatfitrah?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database
Jalankan migrasi dan seeding untuk membuat tabel dan akun admin awal:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```

### 6. Login Awal
- **Username**: `admintoko`
- **Password**: `password123`

## Struktur Folder
- `app/`: Routing dan halaman aplikasi.
- `components/`: Komponen UI reusable.
- `actions/`: Server Actions untuk logika bisnis.
- `lib/`: Konfigurasi library (Prisma, Auth).
- `prisma/`: Skema database dan skrip seed.
- `store/`: State management (Zustand).

## Lisensi
MIT

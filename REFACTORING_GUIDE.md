# Toilet Checklist - Refactoring Guide

## 🎯 **Tujuan Refactoring**

Mengubah project dari **toilet-monitoring** yang kompleks menjadi **toilet-checklist** yang sederhana dengan clean architecture/DDD.

## 📋 **Flow Aplikasi yang Disederhanakan**

1. **Login** → User masuk dengan Supabase Auth
2. **Dashboard** → Tampilan sederhana dengan tombol scan QR di center
3. **Scan QR** → Scanner untuk lokasi toilet
4. **Checklist** → Form sederhana kondisi toilet
5. **Upload Foto** → Auto watermark dengan lokasi, jam, tanggal
6. **Submit** → Kirim ke database
7. **Admin Dashboard** → Kalender untuk lihat hasil

## 🏗️ **Struktur Clean Architecture**

```
src/
├── domain/                    # Business Logic (DDD)
│   ├── entities/             # Core business entities
│   │   ├── User.ts
│   │   ├── Location.ts
│   │   ├── Inspection.ts
│   │   └── Photo.ts
│   ├── value-objects/        # Value objects
│   │   └── LocationCode.ts
│   └── services/             # Domain services
│       ├── InspectionService.ts
│       └── PhotoService.ts
├── application/              # Use Cases (Clean Architecture)
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── LoginUser.ts
│   │   │   └── GetCurrentUser.ts
│   │   ├── location/
│   │   │   ├── GetLocationByQR.ts
│   │   │   └── GenerateQRCode.ts
│   │   ├── inspection/
│   │   │   ├── CreateInspection.ts
│   │   │   ├── SubmitInspection.ts
│   │   │   └── GetInspectionsByDate.ts
│   │   └── photo/
│   │       ├── UploadPhoto.ts
│   │       └── AddWatermark.ts
│   └── interfaces/           # Ports
│       ├── repositories/
│       └── services/
├── infrastructure/           # External concerns
│   ├── database/
│   │   ├── supabase/
│   │   └── repositories/
│   ├── storage/
│   │   └── cloudinary/
│   └── external/
│       └── qr-generator/
└── presentation/            # UI Layer
    ├── pages/
    │   ├── login/
    │   ├── dashboard/
    │   ├── scan/
    │   ├── inspection/
    │   └── admin/
    ├── components/
    │   ├── ui/
    │   ├── forms/
    │   └── features/
    └── hooks/
```

## 🎨 **Design System**

### **Mobile-First Design**
- Background putih dengan komponen hijau muda
- Scan QR di center bottom navigation (seperti m-banking)
- UI yang clean dan tidak over-saturated

### **Color Palette**
- Primary: `#10B981` (Green-500)
- Secondary: `#F3F4F6` (Gray-100)
- Success: `#059669` (Green-600)
- Warning: `#F59E0B` (Yellow-500)
- Error: `#EF4444` (Red-500)

## 🔧 **Fitur yang Dipertahankan**

1. ✅ **QR Code Generation** - Sudah ada dan berfungsi
2. ✅ **QR Scanner** - Sudah ada komponennya
3. ✅ **Supabase Integration** - Database schema sudah sesuai
4. ✅ **Cloudinary Integration** - Untuk upload foto
5. ✅ **Authentication** - Supabase Auth

## 🗑️ **Fitur yang Dihapus/Disederhanakan**

1. ❌ Hapus fitur monitoring kompleks
2. ❌ Hapus fitur bulk operations yang tidak perlu
3. ❌ Sederhanakan admin dashboard
4. ❌ Fokus hanya pada checklist toilet

## 📱 **Halaman yang Dibuat**

### **1. Login Page** (`/login`)
- Form login sederhana
- Design mobile-first
- Redirect ke dashboard setelah login

### **2. Dashboard Page** (`/dashboard`)
- Tampilan utama dengan tombol scan QR di center
- Quick actions untuk akses cepat
- Recent activity dan stats

### **3. Scan QR Page** (`/scan`)
- Camera scanner untuk QR code
- Flashlight toggle
- Error handling untuk permission

### **4. Inspection Page** (`/inspection/[locationId]`)
- Form checklist toilet
- Photo upload dengan watermark
- Status calculation otomatis

### **5. Admin Dashboard** (`/admin`)
- Calendar view untuk hasil inspeksi
- List view dengan filter tanggal
- Download dan print functionality

### **6. QR Generator** (`/admin/qr-generator`)
- Generate QR code untuk lokasi
- Bulk download dan print
- Integrasi dengan existing QR code

## 🚀 **Cara Menjalankan**

1. **Install Dependencies**
   ```bash
   npm install
   # atau
   pnpm install
   ```

2. **Setup Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   # atau
   pnpm build
   ```

## 📊 **Database Schema**

Menggunakan schema Supabase yang sudah ada:
- `users` - Data pengguna
- `locations` - Lokasi toilet dengan QR code
- `inspection_records` - Hasil inspeksi
- `inspection_templates` - Template checklist
- `photos` - Foto dokumentasi
- `roles` - Role pengguna

## 🔄 **Migration dari Project Lama**

1. **Backup data** dari project lama
2. **Update environment variables** untuk Supabase
3. **Test semua fitur** yang sudah direfactor
4. **Deploy** ke production

## 📝 **Next Steps**

1. **Testing** - Unit test untuk domain logic
2. **Integration** - Test dengan Supabase dan Cloudinary
3. **Performance** - Optimasi untuk mobile
4. **Security** - Implementasi RLS di Supabase
5. **Monitoring** - Error tracking dan analytics

## 🎉 **Hasil Refactoring**

- ✅ **Clean Architecture** - Separation of concerns yang jelas
- ✅ **Mobile-First** - UI yang responsive dan user-friendly
- ✅ **Simplified Flow** - Proses yang mudah dipahami
- ✅ **Maintainable Code** - Kode yang mudah di-maintain
- ✅ **Scalable** - Siap untuk pengembangan lebih lanjut

---

**Refactoring selesai!** 🎊 Project sekarang sudah mengikuti clean architecture dan siap untuk production.

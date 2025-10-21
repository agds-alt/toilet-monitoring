# 🚀 Quick Start Guide - Inspection Module

## ⚡ SUPER FAST SETUP (2 MENIT!)

### **Step 1: Create API Route** ✅

Buat file: `src/app/api/seed/template/route.ts`

Paste code dari artifact `seed_template_api`

### **Step 2: Create Folder Structure**

```bash
# Buat folder structure untuk seed utility
mkdir -p src/lib/seed
```

### **Step 3: Seed Template (PILIH 1 CARA)**

#### **Option A: Via UI (TERMUDAH!)** ⭐
1. Buka inspection page: `http://localhost:3000/inspection`
2. Lihat error "Template Belum Tersedia"
3. Klik button **"🌱 Buat Template Default"**
4. Tunggu sebentar
5. Refresh halaman
6. **DONE!** ✅

#### **Option B: Via Browser Console**
1. Buka browser console (F12)
2. Paste & Enter:
```javascript
fetch('/api/seed/template', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(console.log)
```
3. Refresh halaman
4. **DONE!** ✅

#### **Option C: Via cURL**
```bash
curl -X POST http://localhost:3000/api/seed/template \
  -H "Content-Type: application/json"
```

#### **Option D: Via Postman/Thunder Client**
- Method: `POST`
- URL: `http://localhost:3000/api/seed/template`
- Body: (optional)
```json
{
  "userId": "your-user-id"
}
```

---

## 🎯 Verify Template Created

### **Check via Supabase Dashboard:**

1. Go to Table Editor
2. Select `inspection_templates` table
3. You should see:
```
| id | name | is_default | is_active | components |
|----|------|------------|-----------|------------|
| uuid | Standard Toilet Inspection | true | true | 11 items |
```

### **Check via SQL:**
```sql
SELECT 
  id, 
  name, 
  is_default, 
  is_active,
  jsonb_array_length(fields->'components') as component_count
FROM inspection_templates;
```

---

## 🎨 Test Inspection Form

1. Go to: `http://localhost:3000/inspection`
2. You should see:
   - ✅ Template loaded (11 components)
   - ✅ UI Mode Switcher (Professional ↔️ Gen Z)
   - ✅ Photo Mode Switcher (Solo ↔️ Batch)
   - ✅ Location Mode Switcher (GPS ↔️ QR)

3. Try:
   - ⭐ Rate components (stars or emojis)
   - 💬 Add comments
   - 📷 Take/upload photos
   - ✍️ Add notes

---

## 📁 File Structure (Make Sure All Exist)

```
src/
├── app/
│   └── api/
│       └── seed/
│           └── template/
│               └── route.ts              ← CREATE THIS!
│
├── core/
│   └── types/
│       └── inspection.types.ts          ← DONE ✅
│
├── lib/
│   ├── constants/
│   │   └── inspection.constants.ts      ← DONE ✅
│   ├── utils/
│   │   ├── rating.utils.ts              ← DONE ✅
│   │   ├── geolocation.utils.ts         ← DONE ✅
│   │   └── validation.utils.ts          ← DONE ✅
│   └── seed/
│       └── seedDefaultTemplate.ts       ← OPTIONAL
│
├── infrastructure/
│   ├── database/
│   │   └── supabase.ts                  ← EXISTING
│   └── services/
│       ├── cloudinary.service.ts        ← DONE ✅
│       ├── inspection.service.ts        ← DONE ✅
│       ├── template.service.ts          ← DONE ✅
│       └── location.service.ts          ← DONE ✅
│
└── presentation/
    ├── hooks/
    │   ├── useInspection.ts             ← DONE ✅
    │   ├── useTimer.ts                  ← DONE ✅
    │   ├── usePhotoUpload.ts            ← DONE ✅
    │   └── useGeolocation.ts            ← DONE ✅
    │
    └── components/
        └── features/
            └── inspection/
                ├── InspectionForm.tsx              ← DONE ✅
                ├── InspectionForm.module.css       ← DONE ✅
                ├── UIModeSwitcher.tsx              ← DONE ✅
                ├── UIModeSwitcher.module.css       ← DONE ✅
                ├── PhotoModeSwitcher.tsx           ← DONE ✅
                ├── PhotoModeSwitcher.module.css    ← DONE ✅
                ├── LocationModeSwitcher.tsx        ← DONE ✅
                ├── LocationModeSwitcher.module.css ← DONE ✅
                ├── ComponentRating.tsx             ← DONE ✅
                ├── ComponentRating.module.css      ← DONE ✅
                ├── CommentModal.tsx                ← DONE ✅
                ├── CommentModal.module.css         ← DONE ✅
                ├── PhotoCapture.tsx                ← DONE ✅
                ├── PhotoCapture.module.css         ← DONE ✅
                ├── PhotoPreview.tsx                ← DONE ✅
                └── PhotoPreview.module.css         ← DONE ✅
```

---

## 🐛 Troubleshooting

### **Error: "Template Belum Tersedia"**
**Solution:** Klik button "🌱 Buat Template Default"

### **Error: "Failed to seed template"**
**Possible causes:**
1. Supabase connection issue
2. RLS policies blocking insert
3. Table doesn't exist

**Fix:**
```sql
-- Check if table exists
SELECT * FROM inspection_templates LIMIT 1;

-- Temporarily disable RLS for testing
ALTER TABLE inspection_templates DISABLE ROW LEVEL SECURITY;

-- Try seed again
```

### **Button seed tidak muncul**
**Solution:** 
1. Check console errors
2. Make sure API route exists
3. Restart dev server

### **Template created but still error**
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear localStorage
3. Check browser console for errors

---

## ✅ Success Checklist

After seeding, you should have:

- [ ] Template exists in database
- [ ] Template has `is_default = true`
- [ ] Template has 11 components in `fields.components`
- [ ] Inspection page loads without error
- [ ] 11 components visible in form
- [ ] Can rate components
- [ ] Can add comments
- [ ] Can capture photos

---

## 🎉 You're Done!

Template is ready! Now you can:
1. Start inspecting toilets 🚽
2. Test all features
3. Customize components if needed

Need help? Check console logs! 🔍

---

## 📞 Quick Commands

### **Seed Template:**
```bash
curl -X POST http://localhost:3000/api/seed/template
```

### **Check Template:**
```sql
SELECT * FROM inspection_templates WHERE is_default = true;
```

### **Reset Template:**
```sql
DELETE FROM inspection_templates WHERE is_default = true;
-- Then seed again
```

**Happy Inspecting!** 🎊
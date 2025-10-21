# 🌱 Database Seeding Guide

## ⚠️ Error yang Lo Alami

```
❌ Seed template API error: {
  code: '23505',
  details: 'Key (name)=(Standard Toilet Inspection) already exists.',
  message: 'duplicate key value violates unique constraint "inspection_templates_name_key"'
}
```

**Artinya**: Template udah ada di database, jadi error karena nama harus unique.

---

## ✅ SOLUSI CEPAT

### **Option 1: Skip Seed (Recommended)**
Template udah ada, jadi **ga perlu seed lagi**. Langsung aja lanjut development:

```bash
npm run dev
```

Template udah ready to use! 🎉

---

### **Option 2: Update API Endpoint**

Gw udah bikinin API yang **idempotent** (aman dipanggil berkali-kali):

**File**: `src/app/api/seed/template/route.ts`

API ini akan:
- ✅ Cek dulu apakah template sudah ada
- ✅ Kalau ada, skip dan return existing
- ✅ Kalau belum ada, baru create new

**Test API:**

```bash
# POST - Seed template (safe, bisa dipanggil berkali-kali)
curl -X POST http://localhost:3000/api/seed/template

# GET - Check templates
curl http://localhost:3000/api/seed/template

# DELETE - Reset all templates (dev only)
curl -X DELETE http://localhost:3000/api/seed/template
```

---

### **Option 3: CLI Seed Script**

Gw udah bikinin CLI script yang lebih user-friendly:

**File**: `scripts/seed.ts`

**Install tsx first:**

```bash
npm install -D tsx
```

**Run seeder:**

```bash
# Seed database
npm run seed

# Reset & re-seed (dev only)
npm run db:reset
```

---

## 📋 AVAILABLE SCRIPTS

```json
{
  "seed": "Seed database (safe, skip if exists)",
  "seed:reset": "Delete all data & re-seed (⚠️ dev only!)",
  "db:seed": "Alias for seed",
  "db:reset": "Reset + seed"
}
```

---

## 🔍 CHECK TEMPLATE DI DATABASE

### **Via Supabase Dashboard:**

1. Buka Supabase Dashboard
2. Go to **Table Editor**
3. Select `inspection_templates`
4. Lo akan lihat template yang udah ada

### **Via API:**

```bash
curl http://localhost:3000/api/seed/template
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Standard Toilet Inspection",
      "description": "Template standar untuk inspeksi...",
      "fields": {
        "components": [...]
      }
    }
  ],
  "count": 1
}
```

---

## 🚀 NEXT STEPS

### **1. Verify Template Exists:**

```bash
curl http://localhost:3000/api/seed/template
```

### **2. Start Development:**

```bash
npm run dev
```

### **3. Test Inspection Page:**

```
http://localhost:3000/inspection
```

---

## 🛠️ TROUBLESHOOTING

### **Problem: Template tidak muncul di form**

**Solution:**

```typescript
// Check di useInspection hook
const { data: template } = await supabase
  .from('inspection_templates')
  .select('*')
  .eq('is_default', true)
  .single();

console.log('Template:', template);
```

### **Problem: Mau delete & re-seed**

**Solution (Dev Only):**

```bash
# Via CLI
npm run db:reset

# Via API
curl -X DELETE http://localhost:3000/api/seed/template
curl -X POST http://localhost:3000/api/seed/template
```

### **Problem: Seed locations juga**

**Solution:**

Edit `scripts/seed.ts`, uncomment `seedLocations()`, then:

```bash
npm run seed
```

---

## 📝 SEED DATA SUMMARY

### **Templates:**
- ✅ Standard Toilet Inspection (11 components)

### **Locations (Optional):**
- 📍 Toilet Lantai 1 - Lobby (QR: LOC-A001-F01)
- 📍 Toilet Lantai 2 - Office (QR: LOC-A002-F02)
- 📍 Toilet Lantai 3 - Cafeteria (QR: LOC-A003-F03)

---

## ✅ VERIFICATION CHECKLIST

- [ ] Template exists in database
- [ ] API returns template successfully
- [ ] InspectionForm loads template
- [ ] 11 components rendered
- [ ] Rating system works
- [ ] Photo upload works
- [ ] Submit inspection works

---

## 💡 TIPS

1. **Always check API first** before seeding
2. **Use CLI script** for better control
3. **Never run reset in production**
4. **Keep seed scripts idempotent**

---

**Template udah ada = GOOD TO GO!** 🎉

Sekarang tinggal:
1. Test inspection flow
2. Integrate QR scanner
3. Deploy to production

**HAPPY CODING!** 🚀
# 🎯 SEED TEMPLATE - STEP BY STEP GUIDE

## 🚀 CARA TERMUDAH - VIA SUPABASE SQL EDITOR

### **Step 1: Buka Supabase Dashboard**
1. Go to: https://supabase.com/dashboard
2. Select your project: **toilet-monitoring**
3. Click **"SQL Editor"** di sidebar kiri

---

### **Step 2: Copy SQL Script**
1. Buka artifact: **`seed_template.sql`**
2. Copy **SEMUA** code (Ctrl+A, Ctrl+C)

---

### **Step 3: Paste & Run**
1. Di SQL Editor, paste code
2. Click **"RUN"** button (atau Ctrl+Enter)
3. Tunggu sebentar (~1-2 detik)

---

### **Step 4: Verify Success**
You should see output seperti ini:
```
✅ 1 row inserted

Query Results:
┌──────────────────────────────────────┬──────────────────────────┬────────────┬───────────┬────────────────┐
│ id                                   │ name                     │ is_default │ is_active │ component_count│
├──────────────────────────────────────┼──────────────────────────┼────────────┼───────────┼────────────────┤
│ 123e4567-e89b-12d3-a456-426614174000 │ Standard Toilet Inspect. │ true       │ true      │ 11             │
└──────────────────────────────────────┴──────────────────────────┴────────────┴───────────┴────────────────┘
```

**Kalo ada output kayak gini, SUCCESS!** ✅

---

### **Step 5: Test di App**
1. Buka: `http://localhost:3000/inspection`
2. Refresh (F5) kalo perlu
3. **BOOM! Form muncul dengan 11 komponen!** 🎉

---

## 🔍 TROUBLESHOOTING

### **Error: "duplicate key value violates unique constraint"**
**Artinya:** Template sudah ada!

**Solution:**
```sql
-- Check existing template
SELECT id, name FROM inspection_templates WHERE is_default = true;

-- If you want to recreate:
DELETE FROM inspection_templates WHERE is_default = true;
-- Then run INSERT again
```

---

### **Error: "permission denied for table inspection_templates"**
**Artinya:** RLS blocking insert

**Solution (TEMPORARY - for development):**
```sql
-- Disable RLS temporarily
ALTER TABLE inspection_templates DISABLE ROW LEVEL SECURITY;

-- Run INSERT again

-- Re-enable RLS after testing
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;
```

**Solution (PERMANENT - proper RLS policy):**
```sql
-- Create policy to allow insert for authenticated users
CREATE POLICY "Allow authenticated users to insert templates"
ON inspection_templates
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Or allow all operations for now
CREATE POLICY "Allow all for authenticated"
ON inspection_templates
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

---

### **Error: "relation inspection_templates does not exist"**
**Artinya:** Table belum dibuat

**Solution:**
Check apakah table schema sudah di-run. Cek di Table Editor, apakah table `inspection_templates` ada?

If not, run your schema migration first.

---

### **Still shows "Template Belum Tersedia"**
**Possible causes:**

1. **Cache issue**
   - Hard refresh: Ctrl+Shift+R
   - Clear browser cache
   - Open incognito/private window

2. **RLS blocking SELECT**
   ```sql
   -- Add read policy
   CREATE POLICY "Allow authenticated to read templates"
   ON inspection_templates
   FOR SELECT
   TO authenticated
   USING (true);
   ```

3. **Wrong database**
   - Make sure you're connected to correct Supabase project
   - Check `.env` file for correct credentials

---

## ✅ VERIFICATION CHECKLIST

Run these queries to verify everything:

### **1. Check template exists:**
```sql
SELECT COUNT(*) as template_count 
FROM inspection_templates 
WHERE is_default = true;
```
**Expected:** `template_count = 1`

### **2. Check components:**
```sql
SELECT 
  name,
  jsonb_array_length(fields->'components') as components
FROM inspection_templates 
WHERE is_default = true;
```
**Expected:** `components = 11`

### **3. Check component details:**
```sql
SELECT 
  jsonb_array_elements(fields->'components')->>'label' as component_name,
  jsonb_array_elements(fields->'components')->>'icon' as icon
FROM inspection_templates 
WHERE is_default = true;
```
**Expected:** 11 rows with toilet components

### **4. Check RLS policies:**
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'inspection_templates';
```
**Expected:** At least SELECT policy for authenticated users

---

## 🎉 SUCCESS CRITERIA

After seeding, you should have:

- ✅ 1 template in database
- ✅ Template has `is_default = true`
- ✅ Template has 11 components
- ✅ Components have icons (🚽 🧹 🧱 etc)
- ✅ Inspection page loads
- ✅ Form shows 11 rating components
- ✅ Can interact with form

---

## 🚨 QUICK FIX - If Nothing Works

Run this **ALL-IN-ONE** script:

```sql
-- Disable RLS
ALTER TABLE inspection_templates DISABLE ROW LEVEL SECURITY;

-- Clear existing
DELETE FROM inspection_templates WHERE is_default = true;

-- Insert fresh template
INSERT INTO inspection_templates (
  name, description, estimated_time, is_active, is_default, fields
) VALUES (
  'Standard Toilet Inspection',
  'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen penilaian',
  10, true, true,
  '{"components":[{"id":"toilet_bowl","label":"Toilet Bowl / Kloset","label_id":"Kebersihan Kloset","type":"rating","required":true,"order":1,"icon":"🚽"},{"id":"floor_cleanliness","label":"Floor Cleanliness","label_id":"Kebersihan Lantai","type":"rating","required":true,"order":2,"icon":"🧹"},{"id":"wall_cleanliness","label":"Wall Cleanliness","label_id":"Kebersihan Dinding","type":"rating","required":true,"order":3,"icon":"🧱"},{"id":"sink_wastafel","label":"Sink / Wastafel","label_id":"Wastafel","type":"rating","required":true,"order":4,"icon":"🚰"},{"id":"soap_dispenser","label":"Soap Dispenser","label_id":"Sabun","type":"rating","required":true,"order":5,"icon":"🧼"},{"id":"tissue_availability","label":"Tissue / Paper Towel","label_id":"Tisu / Handuk Kertas","type":"rating","required":true,"order":6,"icon":"🧻"},{"id":"trash_bin","label":"Trash Bin","label_id":"Tempat Sampah","type":"rating","required":true,"order":7,"icon":"🗑️"},{"id":"door_lock","label":"Door & Lock","label_id":"Pintu & Kunci","type":"rating","required":true,"order":8,"icon":"🚪"},{"id":"ventilation","label":"Ventilation","label_id":"Ventilasi","type":"rating","required":true,"order":9,"icon":"💨"},{"id":"lighting","label":"Lighting","label_id":"Pencahayaan","type":"rating","required":true,"order":10,"icon":"💡"},{"id":"overall_smell","label":"Overall Smell / Aroma","label_id":"Aroma Keseluruhan","type":"rating","required":true,"order":11,"icon":"👃"}]}'::jsonb
);

-- Verify
SELECT id, name, jsonb_array_length(fields->'components') as components 
FROM inspection_templates 
WHERE is_default = true;
```

**Expected output:** 1 row with 11 components

---

## 📞 Still Not Working?

Check these:

1. **Console logs** - Any error messages?
2. **Network tab** - API calls failing?
3. **Supabase logs** - Any database errors?
4. **RLS policies** - Are they blocking?

**Last resort:**
```sql
-- Nuclear option - allow everything temporarily
ALTER TABLE inspection_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;

-- Test again
-- Don't forget to re-enable for production!
```

---

## 🎊 You Got This!

Template seeding adalah step paling krusial. Setelah ini works, sisanya smooth! 🚀

**Good luck bro!** 💪
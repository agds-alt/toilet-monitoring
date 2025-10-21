# 🔐 RLS Policy Fix Guide

## 🚨 Problem
```
Error: new row violates row-level security policy for table "inspection_templates"
```

RLS (Row Level Security) blocking insert operations.

---

## ✅ SOLUTION - Choose ONE Method

### **METHOD 1: Add Service Role Key (RECOMMENDED)** ⭐

This allows seed operations to bypass RLS using admin privileges.

#### **Step 1: Get Service Role Key**

1. Go to Supabase Dashboard
2. Navigate to: **Settings** → **API**
3. Find: **Project API keys**
4. Copy: **`service_role` secret** (NOT the anon key!)

⚠️ **WARNING**: Keep this key SECRET! Never commit to Git!

#### **Step 2: Add to .env**

Add to your `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ...
```

#### **Step 3: Restart Dev Server**

```bash
# Kill server (Ctrl+C)
# Restart
npm run dev
```

#### **Step 4: Try Seed Again**

```
http://localhost:3000/seed
```

Click "🚀 Seed Template" - Should work now! ✅

---

### **METHOD 2: Fix RLS Policies (PRODUCTION-READY)** 📋

Run SQL in Supabase SQL Editor:

#### **Quick Fix (Development):**

```sql
-- Disable RLS temporarily
ALTER TABLE inspection_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
```

#### **Proper Policies (Production):**

Use the complete SQL from `fix-rls-policies.sql` artifact above.

Key policies to create:

```sql
-- Allow public read for templates
CREATE POLICY "Allow public read access" 
ON inspection_templates FOR SELECT 
USING (true);

-- Allow service_role insert (for seeding)
CREATE POLICY "Allow service_role insert" 
ON inspection_templates FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Allow authenticated users
CREATE POLICY "Allow authenticated insert" 
ON inspection_templates FOR INSERT 
TO authenticated 
WITH CHECK (true);
```

---

### **METHOD 3: Manual Insert (Testing)** 🔧

If you just want to test quickly:

```sql
-- Manually insert template in Supabase SQL Editor
INSERT INTO inspection_templates (
  name,
  description,
  estimated_time,
  is_active,
  is_default,
  fields
) VALUES (
  'Standard Toilet Inspection',
  'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen penilaian',
  10,
  true,
  true,
  '{
    "components": [
      {
        "id": "toilet_bowl",
        "label": "Toilet Bowl / Kloset",
        "label_id": "Kebersihan Kloset",
        "type": "rating",
        "required": true,
        "order": 1,
        "icon": "🚽"
      },
      {
        "id": "floor_cleanliness",
        "label": "Floor Cleanliness",
        "label_id": "Kebersihan Lantai",
        "type": "rating",
        "required": true,
        "order": 2,
        "icon": "🧹"
      },
      {
        "id": "wall_cleanliness",
        "label": "Wall Cleanliness",
        "label_id": "Kebersihan Dinding",
        "type": "rating",
        "required": true,
        "order": 3,
        "icon": "🧱"
      },
      {
        "id": "sink_wastafel",
        "label": "Sink / Wastafel",
        "label_id": "Wastafel",
        "type": "rating",
        "required": true,
        "order": 4,
        "icon": "🚰"
      },
      {
        "id": "soap_dispenser",
        "label": "Soap Dispenser",
        "label_id": "Sabun",
        "type": "rating",
        "required": true,
        "order": 5,
        "icon": "🧼"
      },
      {
        "id": "tissue_availability",
        "label": "Tissue / Paper Towel",
        "label_id": "Tisu / Handuk Kertas",
        "type": "rating",
        "required": true,
        "order": 6,
        "icon": "🧻"
      },
      {
        "id": "trash_bin",
        "label": "Trash Bin",
        "label_id": "Tempat Sampah",
        "type": "rating",
        "required": true,
        "order": 7,
        "icon": "🗑️"
      },
      {
        "id": "door_lock",
        "label": "Door & Lock",
        "label_id": "Pintu & Kunci",
        "type": "rating",
        "required": true,
        "order": 8,
        "icon": "🚪"
      },
      {
        "id": "ventilation",
        "label": "Ventilation",
        "label_id": "Ventilasi",
        "type": "rating",
        "required": true,
        "order": 9,
        "icon": "💨"
      },
      {
        "id": "lighting",
        "label": "Lighting",
        "label_id": "Pencahayaan",
        "type": "rating",
        "required": true,
        "order": 10,
        "icon": "💡"
      },
      {
        "id": "overall_smell",
        "label": "Overall Smell / Aroma",
        "label_id": "Aroma Keseluruhan",
        "type": "rating",
        "required": true,
        "order": 11,
        "icon": "👃"
      }
    ]
  }'::jsonb
);
```

---

## 📋 Verify Setup

### **Check .env.local has:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # ← THIS IS IMPORTANT!

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxx
```

### **Check RLS Status:**

```sql
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'inspection_templates',
    'inspection_records',
    'photos',
    'locations'
  );
```

### **Check Policies:**

```sql
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'inspection_templates';
```

---

## 🚀 Quick Start (Recommended Flow)

```bash
# 1. Add service role key to .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your-key-here" >> .env.local

# 2. Restart dev server
npm run dev

# 3. Seed template
open http://localhost:3000/seed

# 4. Click "Seed Template" button

# DONE! ✅
```

---

## 🐛 Troubleshooting

### **Still getting RLS error?**

1. ✅ Check service role key is correct
2. ✅ Check .env.local is loaded (restart server)
3. ✅ Try disabling RLS temporarily (METHOD 2)

### **Service role key not working?**

1. Check you copied the `service_role` key, NOT `anon` key
2. Check key is complete (starts with `eyJ...`)
3. Check no extra spaces in .env

### **Want to re-enable RLS for production?**

```sql
-- Enable RLS
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;

-- Add proper policies (see fix-rls-policies.sql)
```

---

## 📞 Need Help?

- Check Supabase logs: Dashboard → Logs
- Check console errors: Browser DevTools
- Check SQL errors: Supabase SQL Editor

---

## ✅ Success Checklist

- [ ] Service role key added to .env.local
- [ ] Dev server restarted
- [ ] Seed page works
- [ ] Template created in DB
- [ ] Inspection page loads
- [ ] No RLS errors

**You're all set!** 🎉
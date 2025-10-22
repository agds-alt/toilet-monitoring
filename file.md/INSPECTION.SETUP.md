# 🚽 Inspection Module Setup Guide

## 🔧 Prerequisites

Pastikan database schema sudah ada:

- ✅ `inspection_templates` table
- ✅ `inspection_records` table
- ✅ `photos` table
- ✅ `locations` table
- ✅ `users` table

---

## 📝 Step 1: Create Default Template

Ada 3 cara untuk membuat default template:

### **Option A: Via API Route (Recommended)**

1. Buka browser dan akses:

```
POST http://localhost:3000/api/seed/template
```

Atau gunakan cURL:

```bash
curl -X POST http://localhost:3000/api/seed/template \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id-here"}'
```

2. Response sukses:

```json
{
  "success": true,
  "message": "Default template created successfully",
  "data": {
    "id": "uuid-here",
    "name": "Standard Toilet Inspection",
    ...
  }
}
```

### **Option B: Via Supabase SQL**

Jalankan SQL ini di Supabase SQL Editor:

```sql
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
        "description": "Cleanliness and condition of the toilet bowl",
        "type": "rating",
        "required": true,
        "order": 1,
        "icon": "🚽"
      },
      {
        "id": "floor_cleanliness",
        "label": "Floor Cleanliness",
        "label_id": "Kebersihan Lantai",
        "description": "Overall floor cleanliness and dryness",
        "type": "rating",
        "required": true,
        "order": 2,
        "icon": "🧹"
      },
      {
        "id": "wall_cleanliness",
        "label": "Wall Cleanliness",
        "label_id": "Kebersihan Dinding",
        "description": "Walls, tiles, and surfaces condition",
        "type": "rating",
        "required": true,
        "order": 3,
        "icon": "🧱"
      },
      {
        "id": "sink_wastafel",
        "label": "Sink / Wastafel",
        "label_id": "Wastafel",
        "description": "Sink cleanliness and water flow",
        "type": "rating",
        "required": true,
        "order": 4,
        "icon": "🚰"
      },
      {
        "id": "soap_dispenser",
        "label": "Soap Dispenser",
        "label_id": "Sabun",
        "description": "Soap availability and dispenser condition",
        "type": "rating",
        "required": true,
        "order": 5,
        "icon": "🧼"
      },
      {
        "id": "tissue_availability",
        "label": "Tissue / Paper Towel",
        "label_id": "Tisu / Handuk Kertas",
        "description": "Tissue availability and dispenser condition",
        "type": "rating",
        "required": true,
        "order": 6,
        "icon": "🧻"
      },
      {
        "id": "trash_bin",
        "label": "Trash Bin",
        "label_id": "Tempat Sampah",
        "description": "Trash bin cleanliness and fullness",
        "type": "rating",
        "required": true,
        "order": 7,
        "icon": "🗑️"
      },
      {
        "id": "door_lock",
        "label": "Door & Lock",
        "label_id": "Pintu & Kunci",
        "description": "Door condition and lock functionality",
        "type": "rating",
        "required": true,
        "order": 8,
        "icon": "🚪"
      },
      {
        "id": "ventilation",
        "label": "Ventilation",
        "label_id": "Ventilasi",
        "description": "Air circulation and ventilation system",
        "type": "rating",
        "required": true,
        "order": 9,
        "icon": "💨"
      },
      {
        "id": "lighting",
        "label": "Lighting",
        "label_id": "Pencahayaan",
        "description": "Light brightness and functionality",
        "type": "rating",
        "required": true,
        "order": 10,
        "icon": "💡"
      },
      {
        "id": "overall_smell",
        "label": "Overall Smell / Aroma",
        "label_id": "Aroma Keseluruhan",
        "description": "Overall smell and air freshness",
        "type": "rating",
        "required": true,
        "order": 11,
        "icon": "👃"
      }
    ]
  }'::jsonb
);
```

### **Option C: Auto-create (Built-in)**

Template service akan otomatis membuat default template jika tidak ada saat pertama kali diakses.

---

## 🎯 Step 2: Test Inspection Form

1. Navigate ke inspection page:

```
http://localhost:3000/inspection
```

2. Pastikan:
   - ✅ Template loaded
   - ✅ 11 komponen muncul
   - ✅ UI mode switcher works
   - ✅ Photo mode switcher works
   - ✅ Location mode switcher works

---

## 🔍 Troubleshooting

### **Error: "Template tidak memiliki komponen"**

**Solusi:**

1. Check apakah template ada di database
2. Jalankan seed template (Option A atau B)
3. Refresh page

### **Error: "can't access property 'length'"**

**Solusi:**
Bug sudah di-fix. Update ke latest code dan pastikan template memiliki field `components`.

### **Template tidak muncul**

**Solusi:**

1. Check Supabase connection
2. Check RLS policies untuk `inspection_templates` table
3. Enable RLS bypass untuk development:

```sql
ALTER TABLE inspection_templates DISABLE ROW LEVEL SECURITY;
```

### **Photo upload gagal**

**Solusi:**

1. Pastikan Cloudinary credentials di `.env` benar
2. Check preset name: `toilet-monitoring_unsigned`
3. Test upload manual di Cloudinary dashboard

---

## 📊 Verify Template in DB

Query untuk check template:

```sql
-- Check semua templates
SELECT id, name, is_default, is_active,
       jsonb_array_length(fields->'components') as component_count
FROM inspection_templates;

-- Check default template detail
SELECT * FROM inspection_templates
WHERE is_default = true;

-- Count komponen dalam template
SELECT
  id,
  name,
  jsonb_array_length(fields->'components') as total_components
FROM inspection_templates
WHERE is_active = true;
```

---

## 🎨 Customization

### Add Custom Components

Edit `DEFAULT_TOILET_COMPONENTS` in `inspection.constants.ts`:

```typescript
export const DEFAULT_TOILET_COMPONENTS: InspectionComponent[] = [
  // ... existing components
  {
    id: 'custom_component',
    label: 'Custom Component',
    label_id: 'Komponen Custom',
    description: 'Custom description',
    type: 'rating',
    required: true,
    order: 12,
    icon: '🎯',
  },
];
```

### Change UI Mode Default

In `useInspection.ts`, change initial state:

```typescript
uiState: {
  uiMode: 'genz', // or 'professional'
  photoMode: 'batch', // or 'solo'
  locationMode: 'qr', // or 'gps'
  ...
}
```

---

## ✅ Success Checklist

- [ ] Template created in database
- [ ] 11 components visible
- [ ] Rating system works (star/emoji)
- [ ] Comment modal works
- [ ] Photo capture works
- [ ] Photo preview works
- [ ] Submit inspection works
- [ ] Data saved to `inspection_records`
- [ ] Photos saved to `photos` table
- [ ] Geolocation works (if enabled)

---

## 🚀 Production Deployment

1. **Enable RLS** for all tables
2. **Set proper policies** for inspection tables
3. **Configure Cloudinary** properly
4. **Test on mobile** devices
5. **Monitor performance**

---

## 📞 Support

Kalo masih ada issue, cek:

- Console logs (browser DevTools)
- Supabase logs
- Network tab untuk failed requests

**Happy Inspecting!** 🎉

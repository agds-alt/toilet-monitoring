#!/bin/bash
echo "🧪 COMPLETE API TEST..."

# 1. Create test user jika belum ada
echo "1. Creating test user..."
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_'$(date +%s)'@toiletapp.com",
    "full_name": "Test User",
    "password_hash": "temp_hash_'$(date +%s)'",
    "is_active": true
  }')

USER_ID=$(echo "$USER_RESPONSE" | jq -r '.data.id // empty')

if [ -z "$USER_ID" ]; then
  echo "⚠️  Using existing user..."
  USER_ID=$(curl -s http://localhost:3001/api/users | jq -r '.data[0].id')
fi

echo "✅ User ID: $USER_ID"

# 2. Get location ID
LOCATION_ID="a8f16c93-2628-452d-961d-e2bc83b58264"
TEMPLATE_ID="e08831de-2ca3-4ede-96d2-c49396300a91"

# 3. Test inspection creation
echo "2. Creating inspection..."
INSPECTION_RESPONSE=$(curl -s -X POST http://localhost:3001/api/inspections \
  -H "Content-Type: application/json" \
  -d "{
    \"template_id\": \"$TEMPLATE_ID\",
    \"location_id\": \"$LOCATION_ID\",
    \"user_id\": \"$USER_ID\",
    \"inspection_date\": \"2024-10-21\",
    \"inspection_time\": \"14:30:00\",
    \"overall_status\": \"clean\",
    \"responses\": {\"toilet_bowl\": {\"rating\": 5}},
    \"duration_seconds\": 300
  }")

echo "$INSPECTION_RESPONSE"

# 4. Verify
echo "3. Verifying inspections..."
curl -s http://localhost:3001/api/inspections | jq '.data[] | {id, overall_status}'

echo "✅ TEST COMPLETED!"
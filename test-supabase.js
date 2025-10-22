// test-supabase.js
// Script untuk test koneksi Supabase dan create test user
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure you have:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('🔄 Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('locations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

async function createTestUsers() {
  console.log('\n🔄 Creating test users...');
  
  const testUsers = [
    {
      email: 'admin@toilet.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin'
    },
    {
      email: 'inspector@toilet.com',
      password: 'inspector123',
      fullName: 'Inspector User',
      role: 'inspector'
    },
    {
      email: 'cleaner@toilet.com',
      password: 'cleaner123',
      fullName: 'Cleaner User',
      role: 'cleaner'
    }
  ];
  
  for (const user of testUsers) {
    try {
      // Create user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role
        }
      });
      
      if (error) {
        if (error.message.includes('already')) {
          console.log(`⚠️ User ${user.email} already exists`);
        } else {
          console.error(`❌ Failed to create ${user.email}:`, error.message);
        }
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${user.email}:`, error);
    }
  }
}

async function listUsers() {
  console.log('\n📋 Listing all users...');
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Failed to list users:', error.message);
      return;
    }
    
    if (users.length === 0) {
      console.log('No users found');
      return;
    }
    
    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.id})`);
      console.log(`   - Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   - Role: ${user.user_metadata?.role || 'Not set'}`);
    });
  } catch (error) {
    console.error('❌ Error listing users:', error);
  }
}

async function testLogin() {
  console.log('\n🔄 Testing login...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@toilet.com',
      password: 'admin123'
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      return false;
    }
    
    console.log('✅ Login successful!');
    console.log('User:', data.user.email);
    console.log('Session:', data.session ? 'Active' : 'None');
    
    // Sign out
    await supabase.auth.signOut();
    
    return true;
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Test Script\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('\n❌ Cannot connect to Supabase. Check your credentials.');
    process.exit(1);
  }
  
  // Create test users
  await createTestUsers();
  
  // List users
  await listUsers();
  
  // Test login
  await testLogin();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📝 You can now login with:');
  console.log('   Email: admin@toilet.com');
  console.log('   Password: admin123');
}

main().catch(console.error);
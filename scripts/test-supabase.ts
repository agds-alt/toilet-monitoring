// scripts/test-supabase.ts
import { supabase } from '../src/infrastructure/database/supabase';

async function testSupabase() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test 1: Check environment variables
    console.log('🔧 Checking environment variables...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Test 2: Test connection dengan select
    console.log('\n🔌 Testing database connection...');
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('id, name, code')
      .limit(3);

    if (locationsError) {
      console.error('❌ Locations query failed:', locationsError);
      throw new Error(`Database error: ${locationsError.message}`);
    }

    console.log('✅ Locations query successful');
    console.log('Sample locations:', locations);

    // Test 3: Test inspections table
    console.log('\n📋 Testing inspections table...');
    const { data: inspections, error: inspectionsError } = await supabase
      .from('inspections')
      .select('id, location_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (inspectionsError) {
      console.error('❌ Inspections query failed:', inspectionsError);
    } else {
      console.log('✅ Inspections query successful');
      console.log('Recent inspections:', inspections || 'No data');
    }

    // Test 4: Test insert (optional)
    console.log('\n📝 Testing insert...');
    const testData = {
      location_id: '550e8400-e29b-41d4-a716-446655440001',
      status: 'test',
      overall_comment: 'Test dari script'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('inspections')
      .insert([testData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
    } else {
      console.log('✅ Insert test successful:', insertData.id);
      
      // Clean up test data
      await supabase
        .from('inspections')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Test data cleaned up');
    }

    console.log('\n🎉 All tests completed!');
    return true;

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testSupabase().then(success => {
  process.exit(success ? 0 : 1);
});
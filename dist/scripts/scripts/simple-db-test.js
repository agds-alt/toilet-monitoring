"use strict";
// src/scripts/simple-db-test.ts
// Simple database connection test
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const locations_1 = require("../lib/constants/locations");
async function testBasic() {
    console.log('🧪 BASIC DATABASE TEST...\n');
    // Test Location Mapping
    console.log('1️⃣ Testing Location Mapping...');
    const locationIds = [
        '550e8400-e29b-41d4-a716-446655440001', // Lobby
        '550e8400-e29b-41d4-a716-446655440002', // Lt1 Depan
        '550e8400-e29b-41d4-a716-446655440008', // Security
    ];
    locationIds.forEach(id => {
        const location = (0, locations_1.getLocationById)(id);
        if (location) {
            console.log(`✅ ${id.slice(-4)} → ${location.name}`);
        }
        else {
            console.log(`❌ ${id.slice(-4)} → NOT FOUND`);
        }
    });
    // Test direct database connection
    console.log('\n2️⃣ Testing Database Connection...');
    try {
        // Simple fetch from inspections table
        const { createClient } = await Promise.resolve().then(() => __importStar(require('@supabase/supabase-js')));
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) {
            console.log('❌ Missing Supabase environment variables');
            return;
        }
        const supabase = createClient(supabaseUrl, supabaseKey);
        // Test simple query
        const { data, error } = await supabase
            .from('inspections')
            .select('id, location_id, status')
            .limit(3);
        if (error) {
            console.error('❌ Database query error:', error.message);
        }
        else {
            console.log(`✅ Found ${data?.length || 0} inspections`);
            data?.forEach((insp, idx) => {
                const location = (0, locations_1.getLocationById)(insp.location_id);
                console.log(`   ${idx + 1}. ${location?.name || 'Unknown'} - ${insp.status}`);
            });
        }
    }
    catch (error) {
        console.error('❌ Database connection error:', error.message);
    }
    console.log('\n✅ TEST COMPLETED\n');
}
testBasic();

#!/usr/bin/env node
// sync-supabase.js - Clear and re-sync all brands from repo to Supabase

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase config from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jqygmrgargwvjovhrbid.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY not set");
  console.error("Run: export SUPABASE_SERVICE_ROLE_KEY=your_key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Category mapping (same as generate-brands.js)
const categoryMap = {
  'tech-saas': ['google', 'microsoft', 'apple', 'amazon', 'meta', 'netflix', 'spotify', 'airbnb', 'uber', 'lyft', 'twitter', 'slack', 'zoom', 'discord', 'notion', 'figma', 'github', 'gitlab', 'docker', 'kubernetes', 'salesforce', 'oracle', 'sap', 'adobe', 'nvidia', 'intel', 'amd', 'cisco', 'cloudflare'],
  'finance': ['visa', 'mastercard', 'chase', 'bank', 'wells', 'citi', 'goldman', 'morgan', 'blackrock', 'vanguard', 'fidelity', 'paypal', 'stripe', 'square', 'american-express'],
  'retail': ['walmart', 'target', 'costco', 'amazon', 'ebay', 'shopify', 'bestbuy', 'nordstrom', 'macys', 'ikea', 'wayfair'],
  'automotive': ['tesla', 'ford', 'gm', 'chevrolet', 'toyota', 'honda', 'bmw', 'mercedes', 'audi', 'vw', 'volkswagen', 'porsche', 'nissan', 'hyundai', 'kia'],
  'healthcare': ['pfizer', 'moderna', 'johnson', 'novartis', 'roche', 'merck', 'united', 'cvs', 'walgreens', 'pfizer'],
  'entertainment': ['disney', 'netflix', 'warner', 'paramount', 'sony', 'universal', 'spotify', 'hulu', 'hbo'],
  'food-beverage': ['coca', 'pepsi', 'nestle', 'mcdonalds', 'starbucks', 'yum', 'chipotle', 'dominos'],
  'energy': ['exxon', 'chevron', 'shell', 'bp', 'duke', 'southern', 'next-era'],
  'travel': ['delta', 'united', 'american', 'marriott', 'hilton', 'booking', 'airbnb', 'uber', 'lyft'],
  'telecom': ['verizon', 'att', 'tmobile', 'comcast', 'charter'],
};

function getCategory(name) {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryMap)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return cat;
    }
  }
  return 'tech-saas';
}

async function main() {
  console.log('🔄 Starting Supabase Sync...\n');

  // Step 1: Check current state
  console.log('Step 1: Checking current Supabase data...');
  const { data: existing, error: countError } = await supabase
    .from('brands')
    .select('id', { count: 'exact' });
  
  if (countError) {
    console.error('❌ Error checking Supabase:', countError.message);
    return;
  }
  console.log(`   Found ${existing?.length || 0} brands in Supabase\n`);

  // Step 2: Clear existing data
  console.log('Step 2: Clearing old data from Supabase...');
  const { error: deleteError } = await supabase
    .from('brands')
    .delete()
    .neq('id', 'placeholder'); // Delete all rows
  
  if (deleteError) {
    console.error('❌ Error clearing Supabase:', deleteError.message);
    return;
  }
  console.log('   ✅ Cleared all brands from Supabase\n');

  // Step 3: Read local logos
  console.log('Step 3: Reading local logos...');
  const logosDir = path.join(__dirname, '..', 'public', 'logos');
  const files = fs.readdirSync(logosDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.svg'));
  
  console.log(`   Found ${files.length} logo files\n`);

  // Step 4: Build brand objects
  console.log('Step 4: Preparing brand data...');
  const seen = new Set();
  const brands = [];
  
  files.forEach((f, index) => {
    const slug = f.replace(/\.png$/, '').replace(/\.svg$/, '');
    
    // Skip duplicates
    if (seen.has(slug)) {
      console.log(`   ⚠️ Skipping duplicate: ${slug}`);
      return;
    }
    seen.add(slug);
    
    const name = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const category = getCategory(slug);
    const ext = f.endsWith('.png') ? 'png' : 'svg';
    
    brands.push({
      id: slug,
      name: name,
      slug: slug,
      category_slug: category,
      logo_url: `https://res.cloudinary.com/dqmcws9vx/image/upload/v1738791843/logos/${slug}.${ext}`,
    });
  });

  console.log(`   Prepared ${brands.length} brands\n`);

  // Step 5: Insert in batches (Supabase has limits)
  console.log('Step 5: Inserting brands into Supabase...');
  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < brands.length; i += batchSize) {
    const batch = brands.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('brands')
      .insert(batch);
    
    if (insertError) {
      console.error(`   ❌ Error inserting batch ${i/batchSize + 1}:`, insertError.message);
    } else {
      inserted += batch.length;
      console.log(`   ✅ Inserted batch ${i/batchSize + 1}/${Math.ceil(brands.length/batchSize)} (${inserted}/${brands.length})`);
    }
    
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n🎉 Done! Inserted ${inserted} brands into Supabase.`);
  
  // Step 6: Verify
  console.log('\nStep 6: Verifying...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('brands')
    .select('*', { count: 'exact' });
  
  if (verifyError) {
    console.error('❌ Verification error:', verifyError.message);
  } else {
    console.log(`   ✅ Supabase now has ${verifyData.length} brands`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

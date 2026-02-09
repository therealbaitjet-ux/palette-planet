#!/usr/bin/env node
/**
 * Pinterest Pin Generator
 * Creates pin data for all 742 logos
 * Output: JSON file for bulk upload to Tailwind or Pinterest
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const logosDir = path.join(rootDir, 'public', 'logos');
const outputFile = path.join(__dirname, 'pinterest-pins.json');

// Category hashtags mapping
const categoryHashtags = {
  'tech-saas': '#tech #saas #software #startup #technology',
  'finance': '#finance #banking #fintech #money #investment',
  'retail': '#retail #shopping #ecommerce #consumer #brand',
  'automotive': '#automotive #cars #auto #vehicles #driving',
  'healthcare': '#healthcare #medical #health #pharma #wellness',
  'entertainment': '#entertainment #media #streaming #movies #tv',
  'food-beverage': '#food #beverage #restaurant #drinks #cooking',
  'energy': '#energy #oil #gas #utilities #power',
  'travel': '#travel #hospitality #airlines #hotels #vacation',
  'telecom': '#telecom #telecommunications #phone #internet #mobile'
};

// Simple category detection
function detectCategory(filename) {
  const name = filename.toLowerCase();
  
  const techKeywords = ['google', 'meta', 'apple', 'amazon', 'netflix', 'microsoft', 'adobe', 'oracle', 'salesforce', 'shopify', 'stripe', 'github', 'gitlab', 'docker', 'kubernetes', 'figma', 'notion', 'slack', 'zoom', 'discord'];
  const financeKeywords = ['visa', 'mastercard', 'chase', 'bank', 'paypal', 'square', 'amex', 'goldman', 'morgan', 'fidelity', 'vanguard'];
  const autoKeywords = ['tesla', 'ford', 'bmw', 'mercedes', 'audi', 'toyota', 'honda', 'porsche', 'nissan', 'chevrolet'];
  
  if (techKeywords.some(k => name.includes(k))) return 'tech-saas';
  if (financeKeywords.some(k => name.includes(k))) return 'finance';
  if (autoKeywords.some(k => name.includes(k))) return 'automotive';
  
  return 'tech-saas'; // Default
}

function generatePins() {
  if (!fs.existsSync(logosDir)) {
    console.log('❌ Logos directory not found');
    return [];
  }

  const files = fs.readdirSync(logosDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.svg'));

  console.log(`📊 Found ${files.length} logos`);

  const pins = files.map((filename, index) => {
    const brandName = filename
      .replace(/\.png$/, '')
      .replace(/\.svg$/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    const category = detectCategory(filename);
    const hashtags = categoryHashtags[category] || '#branding #design';
    
    return {
      id: index + 1,
      image: `/logos/${filename}`,
      title: `${brandName} Logo - Brand Identity Inspiration`,
      description: `${brandName} brand identity showcase. Explore ${brandName}'s logo design and visual system.

Discover 700+ curated brand logos at Palette Planet - the ultimate logo inspiration gallery for designers, founders, and brand builders.

#logo #branding #logodesign #brandidentity ${hashtags}`,
      link: `https://palette-planet.com/brand/${filename.replace(/\.png$/, '').replace(/\.svg$/, '')}`,
      board: category,
      brandName: brandName
    };
  });

  return pins;
}

const pins = generatePins();

// Save as JSON
fs.writeFileSync(outputFile, JSON.stringify(pins, null, 2));

// Also create CSV for easy import
const csvHeader = 'Title,Description,Image,Link,Board\n';
const csvRows = pins.map(p => 
  `"${p.title}","${p.description.replace(/"/g, '""')}","${p.image}","${p.link}","${p.board}"`
).join('\n');
fs.writeFileSync(outputFile.replace('.json', '.csv'), csvHeader + csvRows);

console.log(`✅ Generated ${pins.length} pins`);
console.log(`📁 JSON: ${outputFile}`);
console.log(`📁 CSV: ${outputFile.replace('.json', '.csv')}`);

// Show sample
console.log('\n📌 Sample Pin:');
console.log(JSON.stringify(pins[0], null, 2));

// Category breakdown
const categoryCounts = pins.reduce((acc, p) => {
  acc[p.board] = (acc[p.board] || 0) + 1;
  return acc;
}, {});

console.log('\n📊 Pins by Category:');
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} pins`);
  });

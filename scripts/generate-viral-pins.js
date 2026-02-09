#!/usr/bin/env node
/**
 * VIRAL Pinterest Pin Generator
 * Optimized for maximum engagement and click-throughs
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const logosDir = path.join(rootDir, 'public', 'logos');
const outputFile = path.join(__dirname, 'viral-pinterest-pins.json');

// Viral title templates (rotated for variety)
const titleTemplates = [
  (name) => `${name} Logo Design - Brand Identity Breakdown`,
  (name) => `Why ${name}'s Logo Works So Well`,
  (name) => `${name} Brand Identity - Design Analysis`,
  (name) => `The ${name} Logo: What Makes It Iconic`,
  (name) => `${name} Visual Identity - Designer Notes`,
  (name) => `How ${name} Nailed Their Branding`,
  (name) => `${name} Logo - Inspiration for Designers`,
  (name) => `Breaking Down ${name}'s Visual System`,
];

// Viral description templates with CTAs
const descriptionTemplates = [
  (name, category) => `${name}'s logo is a masterclass in ${category} branding. 

The clean lines, strategic color palette, and memorable mark make this identity system work across every touchpoint.

Save this for your next branding project 👇

See the full logo breakdown at Palette Planet - 700+ curated brand identities for designers and founders.

#logo #branding #${category} #designinspiration #brandidentity #logodesign #graphicdesign #designer #founder`,

  (name, category) => `Studying ${name}'s brand identity today. 

What works: simplicity, scalability, and instant recognition. The kind of logo that works on a billboard AND a favicon.

Designers: save this reference!

Explore ${name} + 700 more brand logos at Palette Planet 👇

#logo #branding #${category} #visualidentity #branddesign #logodesign #designinspiration #brandstrategy`,

  (name, category) => `${name} logo analysis 🔍

Color psychology: ✅
Typography: ✅  
Scalability: ✅
Timeless design: ✅

This is how you build a ${category} brand that lasts.

Get the full breakdown + 700 more examples at Palette Planet (link in bio) 👇

#logo #branding #${category} #design #brandidentity #logoinspiration #graphicdesign #designsystem`,

  (name, category) => `Logo inspo: ${name} 🎨

Perfect example of ${category} branding done right. Clean, confident, instantly recognizable.

Pin this for your next client project 📌

Full gallery: 700+ brand logos at Palette Planet 👇

#logo #branding #${category} #designinspiration #brandidentity #logodesigner #graphicdesign #visualdesign`,
];

// Category mapping for better hashtags
const categoryMap = {
  'tech-saas': { name: 'Tech', hashtags: '#tech #saas #startup #software #technology #applogo #techstartup' },
  'finance': { name: 'Finance', hashtags: '#finance #fintech #banking #money #investment #wealth #financial' },
  'retail': { name: 'Retail', hashtags: '#retail #ecommerce #shopping #store #consumer #retaildesign #shop' },
  'automotive': { name: 'Automotive', hashtags: '#automotive #cars #auto #vehicles #carbranding #automotivedesign' },
  'healthcare': { name: 'Healthcare', hashtags: '#healthcare #medical #health #wellness #pharma #healthbranding' },
  'entertainment': { name: 'Entertainment', hashtags: '#entertainment #media #streaming #movies #tv #content' },
  'food-beverage': { name: 'Food', hashtags: '#food #beverage #restaurant #foodie #drinks #foodbranding #culinary' },
  'energy': { name: 'Energy', hashtags: '#energy #oil #gas #utilities #power #greenenergy #sustainability' },
  'travel': { name: 'Travel', hashtags: '#travel #hospitality #airlines #hotels #vacation #tourism #wanderlust' },
  'telecom': { name: 'Telecom', hashtags: '#telecom #telecommunications #phone #internet #mobile #connectivity' },
};

// Detect category
function detectCategory(filename) {
  const name = filename.toLowerCase();
  
  const techKeywords = ['google', 'meta', 'apple', 'amazon', 'netflix', 'microsoft', 'adobe', 'oracle', 'salesforce', 'shopify', 'stripe', 'github', 'gitlab', 'docker', 'kubernetes', 'figma', 'notion', 'slack', 'zoom', 'discord', 'airtable', 'webflow', 'framer', 'linear', 'raycast', 'vercel', 'supabase'];
  const financeKeywords = ['visa', 'mastercard', 'chase', 'bank', 'paypal', 'square', 'amex', 'goldman', 'morgan', 'fidelity', 'vanguard', 'robinhood', 'plaid', 'wise'];
  const autoKeywords = ['tesla', 'ford', 'bmw', 'mercedes', 'audi', 'toyota', 'honda', 'porsche', 'nissan', 'chevrolet', 'lamborghini', 'ferrari'];
  const foodKeywords = ['coca', 'pepsi', 'nestle', 'mcdonalds', 'starbucks', 'chipotle', 'dominos', 'kfc', 'subway', 'burger'];
  const travelKeywords = ['delta', 'united', 'american', 'marriott', 'hilton', 'booking', 'airbnb', 'expedia', 'uber', 'lyft'];
  
  if (techKeywords.some(k => name.includes(k))) return 'tech-saas';
  if (financeKeywords.some(k => name.includes(k))) return 'finance';
  if (autoKeywords.some(k => name.includes(k))) return 'automotive';
  if (foodKeywords.some(k => name.includes(k))) return 'food-beverage';
  if (travelKeywords.some(k => name.includes(k))) return 'travel';
  
  return 'tech-saas';
}

// Get viral title (rotated based on index)
function getViralTitle(name, index) {
  const template = titleTemplates[index % titleTemplates.length];
  return template(name);
}

// Get viral description (rotated based on index)
function getViralDescription(name, category, index) {
  const template = descriptionTemplates[index % descriptionTemplates.length];
  return template(name, categoryMap[category]?.name || category);
}

function generateViralPins() {
  if (!fs.existsSync(logosDir)) {
    console.log('❌ Logos directory not found');
    return [];
  }

  const files = fs.readdirSync(logosDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.svg'));

  console.log(`📊 Found ${files.length} logos`);

  const pins = files.map((filename, index) => {
    const brandSlug = filename.replace(/\.png$/, '').replace(/\.svg$/, '');
    const brandName = brandSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const category = detectCategory(filename);
    const catInfo = categoryMap[category];
    
    return {
      id: index + 1,
      image: `/logos/${filename}`,
      title: getViralTitle(brandName, index),
      description: getViralDescription(brandName, category, index),
      link: `https://palette-planet.com/brand/${brandSlug}`,
      board: category,
      brandName: brandName,
      category: category,
      priority: index < 50 ? 'high' : index < 200 ? 'medium' : 'low'
    };
  });

  return pins;
}

const pins = generateViralPins();

// Save as JSON
fs.writeFileSync(outputFile, JSON.stringify(pins, null, 2));

// Create CSV for bulk upload
const csvHeader = 'Priority,Title,Description,Image,Link,Board,Brand\n';
const csvRows = pins.map(p => 
  `"${p.priority}","${p.title}","${p.description.replace(/"/g, '""')}","${p.image}","${p.link}","${p.board}","${p.brandName}"`
).join('\n');
fs.writeFileSync(outputFile.replace('.json', '.csv'), csvHeader + csvRows);

// Create daily pinning schedule (first 30 days)
const schedule = [];
const highPriority = pins.filter(p => p.priority === 'high');
const mediumPriority = pins.filter(p => p.priority === 'medium');
const lowPriority = pins.filter(p => p.priority === 'low');

// Week 1: 10 pins/day of high priority
for (let day = 1; day <= 7; day++) {
  const dayPins = highPriority.slice((day - 1) * 10, day * 10);
  schedule.push({ day, pins: dayPins, focus: 'High priority brands (top 50)' });
}

// Week 2: 10 pins/day of medium priority
for (let day = 8; day <= 14; day++) {
  const dayPins = mediumPriority.slice((day - 8) * 10, (day - 7) * 10);
  schedule.push({ day, pins: dayPins, focus: 'Medium priority brands' });
}

// Week 3-4: 5 pins/day of remaining
for (let day = 15; day <= 30; day++) {
  const dayPins = lowPriority.slice((day - 15) * 5, (day - 14) * 5);
  schedule.push({ day, pins: dayPins, focus: 'Remaining brands' });
}

fs.writeFileSync(
  outputFile.replace('.json', '-schedule.json'), 
  JSON.stringify(schedule, null, 2)
);

console.log(`✅ Generated ${pins.length} VIRAL pins`);
console.log(`📁 JSON: ${outputFile}`);
console.log(`📁 CSV: ${outputFile.replace('.json', '.csv')}`);
console.log(`📁 Schedule: ${outputFile.replace('.json', '-schedule.json')}`);

// Show samples
console.log('\n📌 SAMPLE PINS:');
[0, 10, 50, 100].forEach(i => {
  if (pins[i]) {
    console.log(`\n--- Pin #${i + 1} (${pins[i].priority} priority) ---`);
    console.log(`Title: ${pins[i].title}`);
    console.log(`Board: ${pins[i].board}`);
    console.log(`Link: ${pins[i].link}`);
  }
});

// Stats
console.log('\n📊 BREAKDOWN:');
console.log(`  High priority (pin first): ${highPriority.length}`);
console.log(`  Medium priority: ${mediumPriority.length}`);
console.log(`  Low priority: ${lowPriority.length}`);

const categoryCounts = pins.reduce((acc, p) => {
  acc[p.board] = (acc[p.board] || 0) + 1;
  return acc;
}, {});

console.log('\n📊 BY CATEGORY:');
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} pins`);
  });

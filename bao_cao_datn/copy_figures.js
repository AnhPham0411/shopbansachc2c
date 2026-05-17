// Script to copy generated diagram files to the figures directory
const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:', 'Users', 'letua', '.gemini', 'antigravity', 'brain', 'bcd944b2-8bee-4dd9-a953-ba7ba7706e7b');
const destDir = path.join('d:', 'ban sach', 'bao_cao_datn', 'figures');

// Ensure figures directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const mappings = [
  ['homepage_mockup_1778924507372.png', 'homepage_mockup.png'],
  ['admin_dashboard_mockup_1778924855853.png', 'admin_dashboard_mockup.png'],
  ['seller_dashboard_mockup_1778924870166.png', 'seller_dashboard_mockup.png'],
  ['wallet_mockup_1778924887345.png', 'wallet_mockup.png'],
  ['chat_mockup_1778924977565.png', 'chat_mockup.png'],
  ['book_detail_mockup_retry_1778925150472.png', 'book_detail_mockup.png'],
  ['checkout_mockup_1778925340250.png', 'checkout_mockup.png'],
];

let copied = 0;
let failed = 0;

for (const [src, dest] of mappings) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log('OK: ' + src + ' -> ' + dest);
      copied++;
    } else {
      console.log('MISSING: ' + src);
      failed++;
    }
  } catch (e) {
    console.log('ERROR: ' + src + ': ' + e.message);
    failed++;
  }
}

console.log('\nDone: ' + copied + ' copied, ' + failed + ' failed');
console.log('Please run this script using: node copy_figures.js');

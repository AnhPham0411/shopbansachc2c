// Script to copy generated diagram files to the figures directory
const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:', 'Users', 'letua', '.gemini', 'antigravity', 'brain', 'ed9b7bfe-23f0-4b7b-8972-4fc1ac787d4c');
const destDir = path.join('d:', 'ban sach', 'bao_cao_datn', 'figures');

// Ensure figures directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const mappings = [
  ['use_case_diagram_1777179712791.png', 'use_case_diagram.png'],
  ['context_diagram_1777179728145.png', 'context_diagram.png'],
  ['dfd_level_1_1777179742574.png', 'dfd_level_1.png'],
  ['dfd_level_2_1777179756663.png', 'dfd_level_2_order.png'],
  ['database_erd_1777179803926.png', 'database_erd.png'],
  ['class_diagram_1777179821075.png', 'class_diagram.png'],
  ['sequence_auth_1777179833472.png', 'sequence_auth.png'],
  ['activity_checkout_1777179848832.png', 'activity_checkout.png'],
  ['activity_dispute_1777179887929.png', 'activity_dispute.png'],
  ['state_machine_order_1777179904172.png', 'state_machine_order.png'],
  ['sequence_payment_1777179919474.png', 'sequence_payment.png'],
  ['sequence_cashout_1777179937920.png', 'sequence_cashout.png'],
  ['architecture_diagram_1777179989122.png', 'architecture_diagram.png'],
  ['deployment_diagram_1777180001144.png', 'deployment_diagram.png'],
  ['homepage_mockup_1777180016816.png', 'homepage_mockup.png'],
  ['seller_dashboard_mockup_1777180061264.png', 'seller_dashboard_mockup.png'],
  ['checkout_mockup_1777180079203.png', 'checkout_mockup.png'],
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

console.log('\\nDone: ' + copied + ' copied, ' + failed + ' failed');

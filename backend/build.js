#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const srcGenerated = path.join(__dirname, 'src', 'generated');
const distGenerated = path.join(distDir, 'generated');

// Ensure dist/generated exists and is populated for any subsequent operations
if (fs.existsSync(srcGenerated)) {
  // Ensure dist dir exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Clean old generated
  if (fs.existsSync(distGenerated)) {
    fs.rmSync(distGenerated, { recursive: true, force: true });
  }
  
  // Copy all generated files
  fs.cpSync(srcGenerated, distGenerated, { recursive: true, force: true });
  console.log('✓ Copied Prisma generated to dist');
} else {
  console.error('✗ src/generated not found');
  process.exit(1);
}

console.log('✓ Build complete');

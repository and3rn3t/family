/**
 * Icon Generator Script
 * 
 * This script generates PNG icons from the SVG source.
 * 
 * Prerequisites:
 *   npm install --save-dev sharp
 * 
 * Usage:
 *   node scripts/generate-icons.js
 * 
 * Or use an online tool like:
 *   - https://realfavicongenerator.net/
 *   - https://maskable.app/editor
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const iconsDir = join(rootDir, 'public', 'icons');

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

async function generateIcons() {
  // Check if sharp is available
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.log('⚠️  sharp is not installed.');
    console.log('');
    console.log('To generate icons automatically, run:');
    console.log('  npm install --save-dev sharp');
    console.log('  node scripts/generate-icons.js');
    console.log('');
    console.log('Or use an online tool:');
    console.log('  - https://realfavicongenerator.net/');
    console.log('  - Upload public/icons/icon.svg');
    console.log('  - Download and extract to public/icons/');
    console.log('');
    createPlaceholderInfo();
    return;
  }

  // Ensure icons directory exists
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
  }

  const svgPath = join(iconsDir, 'icon.svg');
  
  if (!existsSync(svgPath)) {
    console.error('❌ icon.svg not found in public/icons/');
    return;
  }

  const svgBuffer = readFileSync(svgPath);

  console.log('🎨 Generating icons from icon.svg...\n');

  // Generate regular icons
  for (const size of sizes) {
    const outputPath = join(iconsDir, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  ✓ icon-${size}.png`);
  }

  // Generate maskable icons (with padding for safe zone)
  for (const size of maskableSizes) {
    const outputPath = join(iconsDir, `icon-maskable-${size}.png`);
    // Maskable icons need 10% padding on each side (safe zone)
    const innerSize = Math.floor(size * 0.8);
    const padding = Math.floor(size * 0.1);
    
    await sharp(svgBuffer)
      .resize(innerSize, innerSize)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 217, g: 119, b: 6, alpha: 1 } // theme color
      })
      .png()
      .toFile(outputPath);
    console.log(`  ✓ icon-maskable-${size}.png`);
  }

  console.log('\n✅ All icons generated successfully!');
}

function createPlaceholderInfo() {
  const infoPath = join(iconsDir, 'GENERATE-ICONS.md');
  const info = `# Icon Generation

The PNG icons need to be generated from \`icon.svg\`.

## Option 1: Use the script (requires sharp)

\`\`\`bash
npm install --save-dev sharp
node scripts/generate-icons.js
\`\`\`

## Option 2: Use an online tool

1. Go to https://realfavicongenerator.net/
2. Upload \`public/icons/icon.svg\`
3. Configure settings and download
4. Extract to \`public/icons/\`

## Required icon files

- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-192.png (192x192)
- icon-384.png (384x384)
- icon-512.png (512x512)
- icon-maskable-192.png (192x192, with 10% padding)
- icon-maskable-512.png (512x512, with 10% padding)
`;
  writeFileSync(infoPath, info);
  console.log('📝 Created GENERATE-ICONS.md with instructions');
}

generateIcons().catch(console.error);

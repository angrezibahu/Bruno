import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '../public/favicon.svg');
const svgBuffer = readFileSync(svgPath);

const icons = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const icon of icons) {
  const outPath = join(__dirname, '../public', icon.name);
  await sharp(svgBuffer)
    .resize(icon.size, icon.size)
    .png()
    .toFile(outPath);
  console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
}

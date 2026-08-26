// Generates raster favicon / touch-icon / OG assets from SVG sources using sharp.
// Run: node scripts/gen-assets.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/** Wrap a PNG buffer in a single-image .ico container (ICO supports PNG entries). */
function pngToIco(pngBuf, size = 32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size % 256, 0); // width (0 => 256)
  entry.writeUInt8(size % 256, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuf.length, 8); // size
  entry.writeUInt32LE(22, 12); // offset (6 + 16)
  return Buffer.concat([header, entry, pngBuf]);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const favSvg = readFileSync(join(pub, 'favicon.svg'));
const ogSvg = readFileSync(join(root, 'scripts', 'og-source.svg'));

async function run() {
  mkdirSync(join(pub, 'og'), { recursive: true });

  // OG image (1200x630)
  await sharp(ogSvg).png({ quality: 90 }).toFile(join(pub, 'og', 'arcfinity-og.png'));

  // App icons from favicon
  await sharp(favSvg).resize(192, 192).png().toFile(join(pub, 'android-chrome-192.png'));
  await sharp(favSvg).resize(512, 512).png().toFile(join(pub, 'android-chrome-512.png'));
  await sharp(favSvg).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));

  // favicon.ico — a real ICO container wrapping a 32x32 PNG
  const png32 = await sharp(favSvg).resize(32, 32).png().toBuffer();
  writeFileSync(join(pub, 'favicon-32.png'), png32);
  writeFileSync(join(pub, 'favicon.ico'), pngToIco(png32, 32));

  console.log('✓ Generated OG image, favicon.ico and icon assets in /public');
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});

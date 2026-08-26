// Post-build SEO/quality audit over dist/. No deps — regex-based checks.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

function walk(dir) {
  let files = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) files = files.concat(walk(p));
    else if (p.endsWith('.html')) files.push(p);
  }
  return files;
}

const htmlFiles = walk(dist).filter((f) => !relative(dist, f).replace(/\\/g, '/').startsWith('admin/'));
const titles = new Map();
const descs = new Map();
const problems = [];
const pathFor = (f) => '/' + relative(dist, f).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');

// Collect all valid internal targets (routes)
const routes = new Set(htmlFiles.map(pathFor).map((p) => (p.endsWith('/') && p !== '/' ? p.slice(0, -1) : p)));

for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  const route = pathFor(f);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const h1s = html.match(/<h1[\s>]/g) || [];
  const canonical = /<link rel="canonical"/.test(html);
  const noindex = /content="noindex/.test(html);
  const isUtility = route.includes('404') || route.includes('thank-you');

  if (!title) problems.push(`[title] missing: ${route}`);
  else {
    if (titles.has(title)) problems.push(`[title] duplicate "${title}": ${route} & ${titles.get(title)}`);
    titles.set(title, route);
  }
  if (!desc) problems.push(`[desc] missing: ${route}`);
  else {
    if (descs.has(desc)) problems.push(`[desc] duplicate: ${route} & ${descs.get(desc)}`);
    descs.set(desc, route);
  }
  if (h1s.length !== 1) problems.push(`[h1] count=${h1s.length}: ${route}`);
  if (!canonical) problems.push(`[canonical] missing: ${route}`);
  if (noindex && !isUtility) problems.push(`[noindex] on indexable page: ${route}`);

  // Internal link check
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (let h of hrefs) {
    h = h.replace(/\/$/, '') || '/';
    if (h.startsWith('/_astro') || h.startsWith('/og') || /\.(png|svg|ico|xml|txt|webmanifest|jpg|jpeg|webp|avif|css|js)$/.test(h)) continue;
    if (!routes.has(h) && !routes.has(h + '/')) problems.push(`[link] broken "${h}" in ${route}`);
  }
}

// Sitemap + robots presence
for (const f of ['sitemap-index.xml', 'robots.txt']) {
  if (!existsSync(join(dist, f))) problems.push(`[file] missing: ${f}`);
}

console.log(`Audited ${htmlFiles.length} pages.`);
console.log(`Unique titles: ${titles.size}, unique descriptions: ${descs.size}`);
if (problems.length === 0) {
  console.log('✅ No problems found.');
} else {
  console.log(`\n⚠️  ${problems.length} issue(s):`);
  for (const p of [...new Set(problems)]) console.log('  - ' + p);
  process.exitCode = 1;
}

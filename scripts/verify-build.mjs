import * as cheerio from 'cheerio';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const manifest = JSON.parse(await readFile(path.join(root, 'src/data/migration-manifest.json'), 'utf8'));
const assets = JSON.parse(await readFile(path.join(root, 'src/data/assets.json'), 'utf8'));
const expected = new Map(manifest.map((entry) => [entry.path, entry]));
expected.set('/home', { path: '/home', kind: 'page', textLength: 0 });

const htmlFile = (pathname) => pathname === '/' ? path.join(dist, 'index.html') : path.join(dist, pathname.replace(/^\//, ''), 'index.html');
const errors = [];

for (const entry of expected.values()) {
  const file = htmlFile(entry.path);
  try {
    const html = await readFile(file, 'utf8');
    const $ = cheerio.load(html);
    if (!$('title').text().trim()) errors.push(`${entry.path}: missing title`);
    if (!$('meta[name="description"]').attr('content')) errors.push(`${entry.path}: missing description`);
    if (!$('link[rel="canonical"]').attr('href')) errors.push(`${entry.path}: missing canonical`);
    if (!$('meta[property="og:image"]').attr('content')) errors.push(`${entry.path}: missing social image`);
    if (entry.path !== '/home' && $('main#main').length !== 1) errors.push(`${entry.path}: missing unique main landmark`);
    if (entry.path !== '/home' && $('h1').length !== 1) errors.push(`${entry.path}: expected exactly one h1`);
    if ($('a:not([href])').length) errors.push(`${entry.path}: anchor without href`);
    if ($('iframe:not([title])').length) errors.push(`${entry.path}: iframe without title`);
    if ($('img:not([alt])').length) errors.push(`${entry.path}: image without alt text`);
    const ids = $('[id]').toArray().map((element) => $(element).attr('id'));
    if (new Set(ids).size !== ids.length) errors.push(`${entry.path}: duplicate element id`);
    if ((entry.kind === 'blog' || entry.kind === 'project') && $('article').text().replace(/\s+/g, ' ').trim().length < entry.textLength * 0.95) {
      errors.push(`${entry.path}: migrated article body is unexpectedly short`);
    }
    if (/Squarespace|\/cart/.test(html)) errors.push(`${entry.path}: obsolete Squarespace/cart copy remains`);
    for (const anchor of $('a[href^="/"]').toArray()) {
      const target = $(anchor).attr('href')?.split(/[?#]/)[0] || '/';
      if (/\.[a-z0-9]+$/i.test(target) && !target.endsWith('.html')) continue;
      const targetFile = target.endsWith('.html') ? path.join(dist, target.slice(1)) : htmlFile(target);
      try { await access(targetFile); }
      catch { errors.push(`${entry.path}: broken internal link ${target}`); }
    }
    for (const image of $('img[src^="/"]').toArray()) {
      const target = $(image).attr('src')?.split(/[?#]/)[0];
      if (!target) continue;
      try { await access(path.join(root, 'public', target)); }
      catch { errors.push(`${entry.path}: missing referenced image ${target}`); }
    }
  } catch {
    errors.push(`${entry.path}: missing generated route`);
  }
}

for (const local of new Set(Object.values(assets).filter((value) => String(value).startsWith('/images/')))) {
  try { await access(path.join(root, 'public', String(local))); }
  catch { errors.push(`missing local asset ${local}`); }
}

for (const file of ['404.html', 'sitemap-index.xml', 'robots.txt']) {
  try { await access(path.join(dist, file)); }
  catch { errors.push(`missing ${file}`); }
}

try {
  const sitemap = await readFile(path.join(dist, 'sitemap-0.xml'), 'utf8');
  if (sitemap.includes('/home/')) errors.push('sitemap includes redirect-only /home route');
} catch {
  errors.push('missing sitemap-0.xml');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Verified ${expected.size} preserved routes, 1 custom 404 page, and ${new Set(Object.values(assets)).size} mapped assets.`);

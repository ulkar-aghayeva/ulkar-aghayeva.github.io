import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = 'https://www.ulkaraghayeva.com';
const imageDir = path.join(ROOT, 'public/images/imported');
const blogDir = path.join(ROOT, 'src/content/blog');
const projectDir = path.join(ROOT, 'src/content/projects');
const dataDir = path.join(ROOT, 'src/data');

await Promise.all([imageDir, blogDir, projectDir, dataDir].map((dir) => mkdir(dir, { recursive: true })));

const fetchText = async (url) => {
  const response = await fetch(url, { headers: { 'user-agent': 'UlkarAghayevaSiteMigration/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
};

const xml = await fetchText(`${SITE}/sitemap.xml`);
const sitemapUrls = [...xml.matchAll(/<loc>(https:\/\/www\.ulkaraghayeva\.com\/[^<]*)<\/loc>/g)]
  .map((match) => match[1].replaceAll('&amp;', '&'));
const routes = [...new Set([SITE + '/', ...sitemapUrls])].filter((url) => {
  const pathname = new URL(url).pathname;
  return pathname === '/' || ['/about', '/projects', '/blog', '/gallery', '/contact', '/home'].includes(pathname)
    || /^\/projects\/[^/]+$/.test(pathname) && !pathname.includes('/category/')
    || /^\/blog\/[^/]+$/.test(pathname);
});

const imageMap = new Map();
const cleanFilename = (url) => {
  const parsed = new URL(url);
  const original = decodeURIComponent(path.basename(parsed.pathname)).replace(/[^a-zA-Z0-9._-]+/g, '-');
  const ext = /\.(jpe?g|png|gif|webp)$/i.test(original) ? path.extname(original) : '.jpg';
  const stem = path.basename(original, ext).slice(0, 54) || 'image';
  const hash = createHash('sha1').update(url.split('?')[0]).digest('hex').slice(0, 9);
  return `${stem}-${hash}${ext.toLowerCase()}`;
};

const downloadImage = async (source) => {
  if (!source || source.startsWith('data:')) return source;
  const absolute = new URL(source, SITE).href.replace(/\?format=\d+w$/, '?format=2500w');
  if (!/images\.squarespace-cdn\.com|static1\.squarespace\.com|images\.unsplash\.com/.test(absolute)) return absolute;
  if (imageMap.has(absolute)) return imageMap.get(absolute);
  const file = cleanFilename(absolute);
  const local = `/images/imported/${file}`;
  imageMap.set(absolute, local);
  const response = await fetch(absolute, { headers: { 'user-agent': 'UlkarAghayevaSiteMigration/1.0' } });
  if (!response.ok) {
    console.warn(`image ${response.status}: ${absolute}`);
    imageMap.set(absolute, source);
    return source;
  }
  await writeFile(path.join(imageDir, file), Buffer.from(await response.arrayBuffer()));
  return local;
};

const normalizeEmbed = (src) => {
  if (!src) return '';
  try {
    const url = new URL(src, SITE);
    if (url.hostname === 'cdn.embedly.com') {
      const embedded = url.searchParams.get('src') || url.searchParams.get('url');
      const id = embedded?.match(/(?:embed\/|v=)([\w-]{11})/)?.[1];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    return url.href;
  } catch {
    return src;
  }
};

const tidyContent = async ($, root) => {
  root.find('script, style, noscript, form, .newsletter-block, .blog-item-share, .blog-item-pagination, .blog-meta-item--author, .sqs-empty').remove();
  root.find('[style]').removeAttr('style');
  root.find('[id]').removeAttr('id');
  root.find('button').each((_, element) => {
    const button = $(element);
    button.replaceWith(`<span>${button.text().trim()}</span>`);
  });
  root.find('img').each((_, element) => {
    const img = $(element);
    const source = img.attr('data-src') || img.attr('src');
    if (source) img.attr('data-migrate-src', new URL(source, SITE).href);
    for (const attribute of ['data-src', 'data-image', 'data-image-dimensions', 'data-image-focal-point', 'data-load', 'srcset', 'sizes', 'loading', 'decoding']) img.removeAttr(attribute);
  });
  for (const element of root.find('img').toArray()) {
    const img = $(element);
    const source = img.attr('data-migrate-src');
    img.removeAttr('data-migrate-src');
    if (!source) { img.remove(); continue; }
    img.attr('src', await downloadImage(source));
    img.attr('loading', 'lazy');
    if (!img.attr('alt')) img.attr('alt', '');
  }
  root.find('iframe').each((_, element) => {
    const frame = $(element);
    frame.attr('src', normalizeEmbed(frame.attr('src')));
    frame.attr('loading', 'lazy');
    frame.attr('allowfullscreen', '');
    frame.attr('title', frame.attr('title') || 'Embedded media');
  });
  root.find('a').each((_, element) => {
    const anchor = $(element);
    const href = anchor.attr('href');
    if (!href) return;
    try {
      const absolute = new URL(href, SITE);
      anchor.attr('href', absolute.hostname === 'www.ulkaraghayeva.com' ? `${absolute.pathname}${absolute.search}${absolute.hash}` : absolute.href);
      if (absolute.hostname !== 'www.ulkaraghayeva.com') anchor.attr('rel', 'noopener');
    } catch { /* preserve anchors and unusual protocols */ }
  });
  root.find('*').each((_, element) => {
    const node = $(element);
    const keep = ['href', 'src', 'alt', 'title', 'loading', 'allowfullscreen', 'rel'];
    for (const attribute of Object.keys(element.attribs || {})) if (!keep.includes(attribute)) node.removeAttr(attribute);
  });
  return root.html()?.trim() || '';
};

const jsonString = (value) => JSON.stringify(value ?? '');
const frontmatter = (data) => `---\n${Object.entries(data).map(([key, value]) => `${key}: ${jsonString(value)}`).join('\n')}\n---\n`;

const manifest = [];
for (const [index, url] of routes.entries()) {
  console.log(`[${index + 1}/${routes.length}] ${url}`);
  const html = await fetchText(url);
  const $ = cheerio.load(html);
  const pathname = new URL(url).pathname === '/home' ? '/' : new URL(url).pathname;
  const kind = pathname.startsWith('/blog/') ? 'blog' : pathname.startsWith('/projects/') ? 'project' : 'page';
  const title = $('meta[property="og:title"]').attr('content')?.replace(/\s+[—|-]\s+Ulkar Aghayeva$/, '').trim()
    || $('h1').first().text().trim() || 'Ulkar Aghayeva';
  const description = $('meta[property="og:description"]').attr('content')?.trim()
    || $('meta[name="description"]').attr('content')?.trim() || '';
  const date = $('meta[itemprop="datePublished"]').attr('content')
    || $('meta[property="article:published_time"]').attr('content')
    || $('time[datetime]').first().attr('datetime')
    || $('.blog-meta-item--date time').first().attr('datetime')
    || $('.blog-meta-item--date').first().text().trim() || '';
  const ogSource = $('meta[property="og:image"]').attr('content') || '';
  const featuredImage = ogSource ? await downloadImage(ogSource) : '';

  if (kind === 'page') {
    for (const element of $('main img').toArray()) {
      const img = $(element);
      const source = img.attr('data-src') || img.attr('src');
      if (source) await downloadImage(new URL(source, SITE).href);
    }
  }

  let content = '';
  if (kind !== 'page') {
    let root = $('.blog-item-content').first();
    if (!root.length) root = $('article .sqs-layout').first();
    if (!root.length) root = $('main article').first();
    content = await tidyContent($, root.clone());
    const slug = pathname.split('/').filter(Boolean).at(-1);
    const directory = kind === 'blog' ? blogDir : projectDir;
    const data = { title, date, kind, sourceUrl: url, featuredImage, description };
    await writeFile(path.join(directory, `${slug}.md`), `${frontmatter(data)}\n${content}\n`);
  }
  const bodyText = kind === 'page' ? $('main').text() : cheerio.load(content).text();
  manifest.push({ path: pathname, sourceUrl: url, title, date, kind, featuredImage, description, textLength: bodyText.replace(/\s+/g, ' ').trim().length, imageCount: kind === 'page' ? $('main img').length : cheerio.load(content)('img').length, embedCount: kind === 'page' ? $('main iframe').length : cheerio.load(content)('iframe').length });
}

await writeFile(path.join(dataDir, 'migration-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(path.join(dataDir, 'assets.json'), JSON.stringify(Object.fromEntries(imageMap), null, 2) + '\n');
console.log(`Migrated ${manifest.filter((entry) => entry.kind === 'blog').length} blog posts, ${manifest.filter((entry) => entry.kind === 'project').length} projects, and ${imageMap.size} images.`);

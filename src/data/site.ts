import type { CollectionEntry } from 'astro:content';

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export const socialLinks = [
  { href: 'https://www.youtube.com/user/bioorgmsu', label: 'YouTube' },
  { href: 'https://twitter.com/ulkar_aghayeva', label: 'Twitter / X' },
  { href: 'https://soundcloud.com/ulkar-aghayeva/fugue-chahargah-segah', label: 'SoundCloud' },
];

export const sortProjects = (projects: CollectionEntry<'projects'>[]) =>
  [...projects].sort((a, b) => (a.data.order ?? Number.MAX_SAFE_INTEGER) - (b.data.order ?? Number.MAX_SAFE_INTEGER));

export const getPreviewDescription = (
  data: { previewDescription?: string; description?: string },
  fallback: string,
) => {
  const customPreview = data.previewDescription?.trim();
  if (customPreview) return customPreview;

  const importedPreview = data.description?.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (!importedPreview) return fallback;
  if (importedPreview.length <= 180) return importedPreview;
  return `${importedPreview.slice(0, 177).trimEnd()}…`;
};

export const galleryImages = [
  ['/images/imported/-DSC09421-6d9bcb335.jpg', 'Ulkar standing beside a red and black mural in Brooklyn'],
  ['/images/imported/-DSC09503-88c502b97.jpg', 'Ulkar leaning beside a geometric street mural'],
  ['/images/imported/DSC08882-a2a9ded8b.jpg', 'Ulkar seated on a yellow wooden bench'],
  ['/images/imported/-DSC09009--b7ecdadf9.jpg', 'Ulkar seated on brightly painted outdoor steps'],
  ['/images/imported/DSC09713-7fa936334.jpg', 'Ulkar standing in front of a red Brooklyn shipping container'],
  ['/images/imported/DSCF1140--280e2e68d.jpg', 'Ulkar standing on a sunlit residential street'],
  ['/images/imported/DSCF1077--7edd56bad.jpg', 'Ulkar beside a townhouse garden in Brooklyn'],
  ['/images/imported/DSCF1205--9058cd4a9.jpg', 'Portrait of Ulkar beneath green leaves'],
  ['/images/imported/DSCF1304--982577bcb.jpg', 'Ulkar seated beside a brownstone stair rail'],
  ['/images/imported/DSCF1239--41192427e.jpg', 'Black and white portrait of Ulkar on brownstone steps'],
  ['/images/imported/DSCF1261--466872a6c.jpg', 'Ulkar seated on shaded brownstone steps'],
  ['/images/imported/DSCF1361--309404bcf.jpg', 'Ulkar leaning on a brownstone stair rail'],
  ['/images/imported/DSCF1445--1c1221be8.jpg', 'Ulkar seated outside a Brooklyn brownstone'],
  ['/images/imported/DSCF1553--099e73f46.jpg', 'Ulkar standing in a green park with a rose-colored shawl'],
  ['/images/imported/DSCF1723--db98cd109.jpg', 'Ulkar seated at the base of a large tree'],
  ['/images/imported/DSCF1772--540aeb961.jpg', 'Ulkar beside a sunlit chain-link fence'],
  ['/images/imported/DSCF1828--f056aa8b7.jpg', 'Ulkar seated in sunlight beside a chain-link fence'],
] as const;

const parseDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);

export const formatDate = (value: string) => {
  const parsed = parseDate(value);
  return Number.isNaN(parsed.valueOf())
    ? value
    : new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(parsed);
};

export const yearFromDate = (value: string) => {
  const parsed = parseDate(value);
  return Number.isNaN(parsed.valueOf()) ? 'Archive' : String(parsed.getFullYear());
};

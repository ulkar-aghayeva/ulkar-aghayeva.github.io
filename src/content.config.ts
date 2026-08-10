import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  date: z.string(),
  kind: z.enum(['blog', 'project']),
  sourceUrl: z.url(),
  featuredImage: z.string(),
  description: z.string(),
});

export const collections = {
  blog: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/blog' }), schema: articleSchema }),
  projects: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/projects' }), schema: articleSchema }),
};

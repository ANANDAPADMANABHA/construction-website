import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faqSchema = z.array(z.object({ q: z.string(), a: z.string() }));

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(), // H1 / page heading
    metaTitle: z.string(), // <title> (unique per page)
    description: z.string(), // meta description (unique per page)
    summary: z.string(),
    icon: z.string(),
    order: z.number().default(99),
    intro: z.string(),
    problems: z.array(z.string()).default([]),
    process: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
    included: z.array(z.string()).default([]),
    benefits: z.array(z.object({ title: z.string(), description: z.string() })).default([]),
    faqs: faqSchema.default([]),
    related: z.array(z.string()).default([]),
    seed: z.number().default(1),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(), // used for meta + card
    category: z.enum(['Residential', 'Commercial', 'Renovation', 'Interior', '3D Design']),
    location: z.string(),
    area: z.string().optional(),
    services: z.array(z.string()).default([]),
    status: z.enum(['Completed', 'Ongoing', 'Upcoming']).default('Completed'),
    completedDate: z.coerce.string().optional(),
    seed: z.number().default(1),
    featured: z.boolean().default(false),
    // Real images can be added later; when absent a branded placeholder renders.
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    /** Set true for genuine projects; sample/demo entries are clearly flagged. */
    isSample: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    excerpt: z.string(),
    category: z.string().default('Guide'),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Arcfinity'),
    faqs: faqSchema.default([]),
    related: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, projects, blog };

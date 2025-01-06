import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const PostSchema = z.object({
	title: z.string(),
	slug: z.string(),
	data: z.string(),
	excerpt: z.string(),
	category: z.enum(['episodes', 'transcripts', 'promo']),
	tags: z.array(z.string()),
	image: z.string(),
	audio: z.string(),
});

export type Post = z.infer<typeof PostSchema>;

const posts = defineCollection({
	loader: glob({ pattern: '*.md', base: './posts' }),
	schema: PostSchema,
});

export const collections = { posts };

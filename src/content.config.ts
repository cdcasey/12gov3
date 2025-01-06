import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// const PostSchema = ({ image }) =>
// 	z.object({
// 		title: z.string().optional(),
// 		slug: z.string().optional(),
// 		date: z.coerce.date().optional(),
// 		excerpt: z.string().optional(),
// 		category: z.enum(['episodes', 'transcripts', 'promo']).optional(),
// 		tags: z.array(z.string()).optional(),
// 		coverImage: image(),
// 		audio: z.string().optional(),
// 	});
//
// export type Post = z.infer<typeof PostSchema>;

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './posts' }),
	schema: ({ image }) =>
		z.object({
			title: z.string().optional(),
			slug: z.string().optional(),
			date: z.coerce.date().optional(),
			excerpt: z.string().optional(),
			category: z.enum(['episodes', 'transcripts', 'promo']).optional(),
			tags: z.array(z.string()).optional(),
			coverImage: image(),
			audio: z.string().optional(),
		}),
});

export const collections = { posts };

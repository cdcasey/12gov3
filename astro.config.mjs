// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.onetogrowonpod.com',
	integrations: [sitemap()],
	prefetch: { prefetchAll: true },
	// The old WP feed URL; static hosts won't serve index.xml for a bare
	// directory request, so send it to the actual file. Mirrored in
	// public/_redirects for Cloudflare Pages.
	redirects: {
		'/feed/podcast': '/feed/podcast/index.xml',
	},
});

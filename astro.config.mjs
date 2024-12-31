// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	// output: 'static',
	// vite: {
	// 	build: {
	// 		outDir: 'dist',
	// 	},
	// },
	integrations: [tailwind()],
});

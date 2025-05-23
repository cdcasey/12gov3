// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// output: 'static',
	// vite: {
	// 	build: {
	// 		outDir: 'dist',
	// 	},
	// },
	// vite: {
	// 	plugins: [tailwindcss()],
	// },
	prefetch: { prefetchAll: true },
});

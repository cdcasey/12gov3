// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	// output: 'static',
	// vite: {
	// 	build: {
	// 		outDir: 'dist',
	// 	},
	// },
	vite: {
		plugins: [tailwindcss()],
	},
});

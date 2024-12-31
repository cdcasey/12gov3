import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				header: ['Lilita One', ...defaultTheme.fontFamily.serif],
				sans: ['Cabin', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
};

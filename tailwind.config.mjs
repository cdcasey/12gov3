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
			colors: {
				'accent-1': '#FAFAFA',
				'accent-2': '#EAEAEA',
				'accent-7': '#333',
				success: '#0070f3',
				cyan: '#79FFE1',
				otgogreen: {
					light: '#b4d55f',
					medium: '#4c9342',
					dark: '#3f421b',
				},
				otgopurple: {
					light: '#692f65',
					dark: '#4e2688',
				},
				otgoorange: {
					light: '#f9a415',
					dark: '#f68722',
				},
				otgored: '#b42025',
				otgoyellow: '#ffd744',
				otgowhite: '#fdfdfd',
				otgoblack: '#212121',
			},
		},
	},
	plugins: [],
};

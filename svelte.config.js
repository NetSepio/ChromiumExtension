import adapter from 'sveltekit-adapter-chrome-extension';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			manifest: 'manifest.json',
			emptyOutDir: true
		}),
		alias: {
			'@/*': './src/lib/*'
		},
		appDir: 'app'
	},
	vite: {
		// Other Vite options...
		build: {
			inlineDynamicImports: false,
			assetsInlineLimit: 0
		}
	}
};

export default config;

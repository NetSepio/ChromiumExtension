import adapter from 'sveltekit-adapter-chrome-extension';
import { vitePreprocess } from '@sveltejs/kit/vite';

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

		appDir: 'app'
	},
	vite: {
		// Other Vite options...
		build: {
			inlineDynamicImports: false,
			assetsInlineLimit: 0
		}
	},
	preprocess: vitePreprocess()
};

export default config;

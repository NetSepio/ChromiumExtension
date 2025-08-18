import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		nodePolyfills({
			// Include essential Node.js polyfills for crypto operations
			include: ['crypto', 'stream', 'util'],
			globals: {
				Buffer: true,
				global: true,
				process: true
			}
		})
	],
	define: {
		'process.env.HELIUS_API_KEY': JSON.stringify(process.env.PUBLIC_HELIUS_API_KEY),
		'process.env.MAGIC_EDEN_API_KEY': JSON.stringify(process.env.PUBLIC_MAGIC_EDEN_API_KEY),
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		global: 'globalThis'
	},
	optimizeDeps: {
		include: ['crypto-js', 'bip39']
	}
});

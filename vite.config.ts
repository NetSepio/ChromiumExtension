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
		'process.env': {},
		global: 'globalThis'
	},
	optimizeDeps: {
		include: ['crypto-js', 'bip39']
	}
});

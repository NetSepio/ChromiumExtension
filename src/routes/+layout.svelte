<script lang="ts">
	import '../app.css';
	// Supports weights 100-900
	import '@fontsource-variable/dm-sans';
	// Initialize secure storage
	import '../lib/init';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let { children } = $props();

	// Handle hash-based routing for browser tabs
	onMount(() => {
		const handleHashChange = () => {
			const hash = window.location.hash;
			if (hash && hash.startsWith('#/')) {
				const path = hash.substring(1); // Remove the #
				goto(path);
			}
		};

		// Handle initial hash
		handleHashChange();

		// Listen for hash changes
		window.addEventListener('hashchange', handleHashChange);

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	});
</script>

<!-- <div class="w-screen flex justify-center items-center"> -->
<main class="relative h-[600px] w-[23rem]">{@render children()}</main>
<!-- </div> -->

<!-- Logo component -->
<script lang="ts">
	// Importing necessary modules
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	// Initial values for image sources and dark mode
	let src = '/netsepio-logo.png'; // Dark mode logo source
	let lightLogo = '/logo-3.png'; // Light mode logo source
	let darkMode = true; // Initial dark mode state

	// Function executed on component mount
	onMount(() => {
		if (browser) {
			// Check if the theme is set to 'dark' or if the user prefers dark mode
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				darkMode = true;
			} else {
				// If not dark mode, remove 'dark' class from the root element
				document.documentElement.classList.remove('dark');
				darkMode = false;
			}
		}
	});
</script>

<!-- Link to the homepage -->
<a href="/">
	<!-- Conditional rendering based on darkMode -->
	{#if darkMode == true}
		<img {src} alt="logo" class="w-4/5" />
	{:else if darkMode == false}
		<img src={lightLogo} alt="logo" class="w-2/5" />
	{/if}
</a>

<!-- Logo component -->
<script lang="ts">
	// Importing necessary modules
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { darktheme } from '$lib/store/store';

	// Initial values for image sources and dark mode
	let src = '/netsepio-logo.png'; // Dark mode logo source
	let lightLogo = '/light-logo.svg'; // Light mode logo source
	let darkMode = true; // Initial dark mode state

	darktheme.subscribe(data=> darkMode = data)

	// // Function executed on component mount
	// onMount(() => {
	// 	if (browser) {
	// 		// Check if the theme is set to 'dark' or if the user prefers dark mode
	// 		if (
	// 			localStorage.theme === 'dark' ||
	// 			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	// 		) {
	// 			darkMode = localStorage.theme;
	// 		} else {
	// 			// If not dark mode, remove 'dark' class from the root element
	// 			document.documentElement.classList.remove('dark');
	// 			darkMode = localStorage.theme;
	// 		}
	// 	}
	// });
</script>

<!-- Link to the homepage -->
<a href="/">
	<!-- Conditional rendering based on darkMode -->
	{#if darkMode == true}
		<img {src} alt="logo" class="w-[38px] h-[38px]  object-cover" />
	{:else}
		<img src={lightLogo} alt="logo" class="w-[34px] h-[34px]  object-cover" />
	{/if}
</a>

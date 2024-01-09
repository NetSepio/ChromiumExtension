<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let src = '/netsepio-logo.png';
	let lightLogo = '/logo-3.png';
	let darkMode = true;

	onMount(() => {
		if (browser) {
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				darkMode = true;
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
</script>

<a href="/">
	{#if darkMode == true}
		<img {src} alt="logo" class="w-4/5" />
	{:else if darkMode == false}
		<img src={lightLogo} alt="logo" class="w-2/5" />
	{/if}
</a>

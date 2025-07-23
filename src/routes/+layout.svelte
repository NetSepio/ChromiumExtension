<script lang="ts">
	import '../app.css';
	// Supports weights 100-900
	import '@fontsource-variable/dm-sans';
	// Initialize secure storage
	import '../lib/init';

	let { children } = $props();
</script>

<!-- <div class="w-screen flex justify-center items-center"> -->
<main class="relative h-[600px] w-[23rem]">{@render children()}</main>
<!-- </div> -->

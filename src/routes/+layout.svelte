<script lang="ts">
	import '../app.css';
	// Supports weights 100-900
import '@fontsource-variable/dm-sans';

	let { children } = $props();
</script>

<div class="w-screen flex justify-center items-center">
	<main class='w-[23rem] h-[600px] max-h-[700px] relative'>{@render children()}</main>
</div>

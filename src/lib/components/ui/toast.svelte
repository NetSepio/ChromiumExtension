<script>
	import { Check, Info, X } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	let { status, success, error, open } = $props();

	// Auto-hide toast after 3 seconds
	$effect(() => {
		if (open) {
			const timer = setTimeout(() => {
				open = false;
			}, 3000);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if open}
	<div
		class="fixed top-4 left-1/2 z-50 flex max-w-[300px] -translate-x-1/2 transform items-center gap-2 rounded-lg border border-[#333] bg-[#111111] px-3 py-2 text-white shadow-lg"
		transition:fade
	>
		{#if success}
			<Check color="#24ff3d" size="16" />
		{:else if error}
			<X color="#ff3a24" size="16" />
		{:else}
			<Info color="#ffaf24" size="16" />
		{/if}
		<span class="truncate text-sm">{status}</span>
	</div>
{/if}

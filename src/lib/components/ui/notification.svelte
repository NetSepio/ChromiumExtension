<script lang="ts">
	import { fly } from 'svelte/transition';
	
	let { 
		message = '', 
		visible = false, 
		type = 'info' as 'info' | 'success' | 'warning' | 'error'
	} = $props();
	
	const typeColors: Record<string, string> = {
		info: 'bg-blue-500/90',
		success: 'bg-green-500/90',
		warning: 'bg-yellow-500/90',
		error: 'bg-red-500/90'
	};
</script>

{#if visible}
	<div 
		class="fixed top-4 right-4 z-50 max-w-sm"
		transition:fly={{ x: 300, duration: 300 }}
	>
		<div class="rounded-lg px-4 py-3 text-white shadow-lg border border-white/20 {typeColors[type]}">
			<div class="flex items-center gap-2">
				{#if type === 'info'}
					<div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
				{:else if type === 'success'}
					<div class="text-white">✓</div>
				{:else if type === 'warning'}
					<div class="text-white">⚠</div>
				{:else if type === 'error'}
					<div class="text-white">✗</div>
				{/if}
				<span class="text-sm font-medium">{message}</span>
			</div>
		</div>
	</div>
{/if}

<script lang="ts">
	let { open, onClose, children } = $props();
</script>

{#if open}
	<div
		class="absolute inset-0 z-50 flex items-center justify-center bg-black/80"
		role="button"
		tabindex="0"
		onclick={onClose}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ' ? onClose() : null)}
		aria-label="dialog"
	>
		<div class="animate-fade-in grid w-5/6 place-items-center p-2 text-white">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}
</style>

<script lang="ts">
	import Off from '../icons/off.svelte';
	import On from '../icons/on.svelte';

	let { enabled, toggleConnection, disabled = false } = $props();
</script>

<div class="z-30 flex h-[200px] w-[200px] items-center justify-center rounded-full bg-[#ffffff5e]">
	<div
		class={`rounded-full ${enabled ? 'bg-[#0eafa280]' : 'bg-[#f81e1e80]'} flex size-[75%]  items-center justify-center transition-colors duration-700`}
	>
		<button
			class="flex size-[70%] items-center justify-center rounded-full bg-[#ffffff] {disabled
				? 'cursor-not-allowed'
				: 'cursor-pointer'}"
			onclick={toggleConnection}
			{disabled}
		>
			{#if enabled}
				<Off />
			{:else}
				<On />
			{/if}
		</button>
	</div>
</div>

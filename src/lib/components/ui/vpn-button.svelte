<script lang="ts">
	import Off from '../icons/off.svelte';
	import On from '../icons/on.svelte';

   let {enabled, toggleConnection, disabled = false} = $props()

</script>

<div class='rounded-full z-30 bg-[#ffffff5e] w-[200px] h-[200px] flex items-center justify-center'>
	<div
		class={`rounded-full ${enabled ? 'bg-[#0eafa280]' :'bg-[#f81e1e80]'} transition-colors duration-700  size-[75%] flex items-center justify-center`}
	>
		<button
			class='rounded-full bg-[#ffffff] size-[70%] flex items-center justify-center {disabled ? "cursor-not-allowed" : "cursor-pointer"}'
			onclick={toggleConnection}
			disabled={disabled}
		>
			{#if enabled}
				<Off />
			{:else}
				<On />
			{/if}
		</button>
	</div>
</div>


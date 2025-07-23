<script lang="ts">
	import Signal from '../icons/signal.svelte';
	import { node } from '../../../store/store';
</script>

{#if !$node.id}
	<div
		class="bg-opacity-50 mt-4 flex flex-col items-center gap-0 rounded-lg bg-[#f1f1f13f] px-4 py-2 text-white/85 backdrop-blur-sm transition-all hover:shadow-md"
	>
		<h3 class="mb-2 text-center text-base font-bold">Select Your Preferred nodes</h3>
		<p class="text-sm">Connect to one of our various nodes.</p>
	</div>
{:else}
	<div
		class="bg-opacity-50 mt-4 flex items-center justify-between rounded-lg bg-[#f1f1f13f] px-4 py-2 backdrop-blur-sm transition-all hover:shadow-md"
	>
		<div class="items flex gap-4">
			<img src={`https://flagsapi.com/${$node.region}/flat/64.png`} alt="flag" class="h-8 w-10" />
			<div class="text-sm font-semibold text-white capitalize">
				<p class="flex items-center gap-2">
					<span>{$node.ipinfocountry}</span> <span> - </span>
					<span>{$node.ipinfocity}</span>
				</p>
				<p class="text-left text-xs">{$node.name}</p>
			</div>
		</div>
		<Signal signal={$node.status} />
	</div>
{/if}

<script lang="ts">
	import Signal from '../icons/signal.svelte';
	import { node } from '../../../store/store';
	
</script>

{#if !$node.id}
	<div
		class="bg-[#f1f1f13f] text-white/85 py-2 px-4 rounded-lg bg-opacity-50 backdrop-blur-sm hover:shadow-md transition-all mt-4 flex flex-col items-center gap-0"
	>
		<h3 class="text-base font-bold text-center mb-2">Select Your Preferred nodes</h3>
		<p class="text-sm">Connect to one of our various nodes.</p>
	</div>
{:else}
	<div
		class="bg-[#f1f1f13f] py-2 px-4 rounded-lg bg-opacity-50 backdrop-blur-sm hover:shadow-md transition-all mt-4 flex items-center justify-between"
	>
		<div class="flex items gap-4">
			<img
				src={`https://flagsapi.com/${$node.region}/flat/64.png`}
				alt="flag"
				class="h-8 w-10"
			/>
			<div class="text-sm capitalize text-white font-semibold">
				<p class="flex items-center gap-2">
					<span>{$node.ipinfocountry}</span> <span> - </span>
					<span>{$node.ipinfocity}</span>
				</p>
				<p class="text-xs text-left">{$node.name}</p>
			</div>
		</div>
		<Signal signal={$node.status} />
	</div>
{/if}

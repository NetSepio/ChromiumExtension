<script lang="ts">
	import Signal from '../icons/signal.svelte';

	let { location, onclick } = $props();
</script>

<button
	class="bg-opacity-50 mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-[#1f1e1ea8] px-4 py-3 backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] hover:border-[#00ccba]/20 hover:bg-[#1f1e1ec0] hover:shadow-lg"
	{onclick}
	aria-label="select location"
>
	<div class="flex items-center gap-4">
		<div class="relative">
			<img
				src={`https://flagsapi.com/${location.region}/flat/64.png`}
				alt="flag"
				class="h-8 w-10 rounded-sm shadow-sm"
				loading="lazy"
			/>
		</div>
		<div class="text-left text-sm font-semibold text-white">
			<p class="flex items-center gap-1">
				<span class="text-white">{location.ipinfocountry}</span>
				<span class="text-[#00ccba]/60">-</span>
				<span class="text-white/90">{location.ipinfocity}</span>
			</p>
			<p class="text-xs font-normal text-white/70">{location.name}</p>
		</div>
	</div>
	<div class="flex-shrink-0">
		<Signal signal={location.status} />
	</div>
</button>

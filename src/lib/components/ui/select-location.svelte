<script lang="ts">
	import Signal from '../icons/signal.svelte';

	let { location, onclick } = $props();
</script>

<button
	class={`bg-[#1f1e1ea8] cursor-pointer py-3 px-4 rounded-lg bg-opacity-50 backdrop-blur-sm hover:bg-[#1f1e1ec0] hover:shadow-lg hover:scale-[1.01] transition-all duration-200 mt-3 flex items-center justify-between w-full border border-transparent hover:border-[#00ccba]/20`}
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
		<div class="text-sm text-white font-semibold text-left">
			<p class='flex items-center gap-1'>
				<span class="text-white">{location.ipinfocountry}</span> 
				<span class="text-[#00ccba]/60">-</span>
				<span class="text-white/90">{location.ipinfocity}</span>
			</p>
			<p class="text-xs text-white/70 font-normal">{location.name}</p>
		</div>
	</div>
	<div class="flex-shrink-0">
		<Signal signal={location.status} />
	</div>
</button>

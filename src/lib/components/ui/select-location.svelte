<script lang="ts">
	import Signal from '../icons/signal.svelte';

	let { location, onclick } = $props();
</script>

<button
	class={`bg-[#1f1e1ea8] cursor-pointer py-2 px-4 rounded-lg bg-opacity-50 backdrop-blur-sm hover:shadow-md transition-all mt-4 flex items-center justify-between w-[15rem]`}
	{onclick}
	aria-label="select location"
>
	<div class="flex items gap-4">
		<img src={`https://flagsapi.com/${location.region}/flat/64.png`} alt="flag" class="h-8 w-10" />
		<div class="text-sm capitalize text-white font-semibold">
			<p class='flex items-center '>
				<span>{location.ipinfocountry}</span> <span>-</span>
				<span>{location.ipinfocity}</span>
			</p>
			<p class="text-xs text-left">{location.name}</p>
		</div>
	</div>
	<Signal signal={location.status} />
</button>

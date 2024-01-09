<script>
	import Header from '$lib/components/Header.svelte';
</script>

<div>
	<Header />
	<div class="h-[460px] text-center flex flex-col items-center justify-center gap-4">
		<svg
			width="180"
			height="180"
			viewBox="0 0 180 180"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="75" cy="105" r="52.5" fill="#222944" />
			<path
				d="M44.9998 97.502L74.2205 119.417C74.6542 119.743 75.268 119.663 75.6045 119.238L126.9 54.4531"
				stroke="#11D9C5"
				stroke-width="7"
				stroke-linecap="round"
			/>
		</svg>

		<h1 class="text-black dark:text-white text-xl text-center font-bold">
			Successfully submitted!
		</h1>
		<a href="/" class="w-full"><button class="btn primary-button">go to homepage</button></a>
	</div>
</div>

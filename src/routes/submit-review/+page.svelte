<script>
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';

	// 	const getUrl = async () => {
	// 	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	// 	websiteUrl = tab.url?.toLocaleLowerCase();
	// };

	// onMount(() => getUrl())
</script>

<div>
	<Header />
	<div class="h-[460px] flex flex-col gap-4 justify-center items-start">
		<h1 class="text-2xl font-bold text-center capitalize text-[#263238] dark:text-white">
			secure Your Visit, Share Insights on
			<br />
			[“Website Name”]
		</h1>
		<a href="/submit-review/create-review" class="w-full"
			><button class="btn primary-button">Submit Review</button></a
		>
	</div>
</div>

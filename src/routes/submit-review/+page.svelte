<!-- Create review onboard page -->
<script lang="ts">
	// Importing Header component and onMount from Svelte
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';

	// Variable to store the URL of the current tab
	let websiteUrl: string | undefined = $state();

	// Function to get the URL of the current tab
	const getUrl = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		websiteUrl = tab.url?.toLocaleLowerCase();
	};

	// Call the getUrl function on component mount
	onMount(() => getUrl());
</script>

<!-- Main content for the onboard page -->
<div>
	<!-- Header component for consistent styling -->
	<Header />

	<!-- Container for onboard message and button -->
	<div class="h-[460px] flex flex-col gap-4 justify-center items-start">
		<!-- Title with the URL of the current tab -->
		<h1 class="text-2xl font-bold text-center capitalize text-[#263238] dark:text-white">
			Secure Your Visit, Share Insights on
			<br />
			{websiteUrl}
		</h1>

		<!-- Button to navigate to the submit review page -->
		<a href="/submit-review/create-review" class="w-full">
			<button class="btn primary-button">Submit Review</button>
		</a>
	</div>
</div>

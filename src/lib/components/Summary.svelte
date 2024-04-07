<!-- Summary component -->
<script lang="ts">
	// Importing necessary modules and libraries
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';

	// Component state variables
	let currentUrl: string | undefined;
	let summary: string = '';
	let result: string;
	let isLoading = false;

	// Function to get the current URL when the component is mounted
	const getUrl = async () => {
		isLoading = true;
		try {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			currentUrl = tab.url?.toLocaleLowerCase() as string;
		} catch (error) {
			console.log(error);
			isLoading = false;
		} finally {
			isLoading = false;
		}
	};

	// Function to fetch the summary/insight for the given URL
	const getSummary = async () => {
		isLoading = true;
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		try {
			const response = await fetch(
				`${PUBLIC_GATEWAY_URL}/site-insight?siteUrl=${new URL(currentUrl as string).origin}`,
				options
			);
			const data = await response.json();
			result = data.message;
			if (data.payload?.insight) {
				summary = data.payload.insight;
			}
			isLoading = !true;
		} catch (error) {
			console.log('error', error);
			isLoading = !true;
		}
	};

	// Hook to get the URL and fetch the summary when the component is mounted
	onMount(async () => {
		await getUrl();
		await getSummary();
	});
</script>

<!-- HTML structure for the component -->
<div class="reviews w-[80%] h-[315px] mx-auto">
	{#if isLoading}
		<!-- Display a message if insight generation is in progress -->
		<p class="p-5 w-max mx-auto font-medium capitalize">Insight generation in progress</p>
	{:else if summary !== ''}
		<!-- Display the summary if available -->
		<p class="text-[11px] font-normal">{summary}</p>
	{:else if summary == ''}
		<p class="text-[11px] capitalize w-max mx-auto font-medium">
			{'No insight found for the above url'}
		</p>
	{/if}
	<!-- {#if isLoading}
		<Loader />
	{/if} -->
</div>

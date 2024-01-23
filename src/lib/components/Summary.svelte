<!-- Summary component -->
<script lang="ts">
	// Importing necessary modules and libraries
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { onMount } from 'svelte';

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
			currentUrl = tab.url?.toLocaleLowerCase();
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	};

	// Function to fetch the summary/insight for the given URL
	const getSummary = async () => {
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const response = await fetch(
			`${PUBLIC_GATEWAY_URL}/site-insight?siteUrl=${currentUrl}`,
			options
		);
		const data = await response.json();
		result = data.message;
		if (data.payload.insight) {
			summary = data.payload.insight;
		}
		return summary;
	};

	// Hook to get the URL and fetch the summary when the component is mounted
	onMount(async () => {
		await getUrl();
		setTimeout(await getSummary(), 30000);
	});
</script>

<!-- HTML structure for the component -->
<div class="reviews">
	{#if result === 'Insight generation in progress'}
		<!-- Display a message if insight generation is in progress -->
		<p>{result}</p>
	{:else}
		<!-- Display the summary if available -->
		<p>{summary}</p>
	{/if}
</div>

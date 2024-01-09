<script lang="ts">
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	export let url: string;
	let currentUrl: string | undefined;
	let summary: string = '';
	let result: string;
	let isLoading = false;

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

	onMount(async () => {
		await getUrl();
		await getSummary();
	});
</script>

<div class="reviews">
	{#if result === 'Insight generation in progress'}
		<p>{result}</p>
	{:else}
		<p>{summary}</p>
	{/if}
</div>

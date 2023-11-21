<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';
	import Chart from 'svelte-frappe-charts';
	import { onMount } from 'svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { jwtToken } from '$lib/store/store';

	let currentUrl: string;
	let url: string | undefined;
	let stats: any = [];
	let donutData: any;

	// let tempUrl = 'https://blog.com';

	const getUrl = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		url = tab.url?.toLocaleLowerCase();

		console.log(url);
	};

	let getStats = async () => {
		let token = '';

		jwtToken.subscribe((val) => (token = val));

		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		};

		const response = await fetch(`${PUBLIC_GATEWAY_URL}/stats?siteUrl=${url}`, options);
		const result = await response.json();
		stats = result.payload;
		console.log(stats);
	};

	const structureDataForDonut = async () => {
		donutData = {
			labels: [],
			datasets: [
				{
					values: []
				}
			]
		};

		if (stats) {
			stats.forEach((item: any) => {
				donutData.labels.push(item.siteSafety);
				donutData.datasets[0].values.push(Number(item.count));
			});
		}
	};

	onMount(async () => {
		await getUrl();
		await getStats();
		await structureDataForDonut();
		currentUrl = url?.substring(0, 23) + '...';
	});
</script>

<div>
	<Header />
	<div
		class="text-center text-xl text-bold dark:text-white p-2 m-5 border border-zinc-600 dark:border-green-400 rounded-full flex justify-center items-center"
	>
		{currentUrl}
	</div>
	<div class="bg-white text-black dark:bg-gray-900 dark:text-white">
		{#if stats && stats.length > 0}
			<div class="justify-center">
				<div class="block w-auto h-max">
					<Chart data={donutData} type="donut" height={300} width={300} />
					<div />
				</div>
			</div>
			<br />
			<div class="w-auto shadow-lg dark:shadow-green-300/30 rounded-lg">
				<div class="p-4">
					<h2 class="px-5 text-xl font-bold text-center dark:text-white">What people say</h2>

					<div class="card-actions mt-4 justify-center">
						<Review {url} />
						<SubmitReview />
					</div>
				</div>
			</div>
		{:else if (stats && stats.length <= 0) || !stats}
			<div class="flex flex-col gap-28 items-center">
				<h3 class="text-3xl text-center">Be the first to review this website</h3>

				<div class="card-actions justify-end">
					<SubmitReview />
				</div>
			</div>
		{/if}
		<!-- <br />
			<br /> -->
		<!-- {:else}
			<NoReviewFound {error} {currentUrl} />
		{/if} -->
	</div>
</div>

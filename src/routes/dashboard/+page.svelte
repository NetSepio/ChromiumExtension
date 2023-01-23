<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';
	import { GET_SITE_REVIEWS } from '$lib/graphql/queries';
	import Chart from 'svelte-frappe-charts';
	import { onMount } from 'svelte';

	interface responseType {
		category?: string;
		id?: string;
		siteSafety?: string;
		siteTag?: string;
		siteType?: string;
		siteURL?: string;
		domainAddress?: string;
	}

	let error: string = '';
	let response: responseType;
	let currentUrl: string | undefined;
	let chartValues = [12, 19, 3, 5, 3];
	let chartLabels = ['Genuine', 'Scam', 'Stereotype', 'Hate', 'Fake'];
	let data = {
		labels: chartLabels,
		datasets: [
			{
				values: chartValues
			}
		]
	};
	let url: string | undefined;

	const fetchSiteRelatedData = async () => {
		let tempRes = await fetchGraphQLData(GET_SITE_REVIEWS, { url: currentUrl });

		if (tempRes.reviewCreateds.length < 1) {
			error = 'No reviews found..';
			console.log(error);
			return;
		}

		response = tempRes.reviewCreateds[0];
	};

	const getUrl = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		url = tab.url;
	};

	onMount(async () => {
		await getUrl();

		await fetchSiteRelatedData();

		currentUrl = url?.substring(0, 23) + '...';
	});
</script>

<div class="p-5 mb-5 pb-5">
	<Header />
	<br />
	{#if error.length < 1}
		<div class="flex">
			<div class="flex-1 w-72">
				<div class="justify-center">
					<div class="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto content-around">
						<h1 class="font-bold text-black text-lg">{response?.domainAddress ?? 'loading..'}</h1>
					</div>
				</div>
			</div>
			<div class="flex-none">
				<div class="flex justify-center">
					<div class="block rounded-lg shadow-lg bg-zinc-700 p-5 w-auto h-auto content-around">
						<div class="rounded-full shadow-lg w-6 h-auto">
							<!-----------
							 how to do this rating? 
							This is not coming from API
						-------->
							<p class="font-bold text-white text-lg">0/5</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<br />
		<div class="justify-center">
			<div class="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto">
				<h1 class="font-bold text-black text-3xl text-center">
					{response?.siteSafety ?? 'Loading..'}
				</h1>
				<Chart {data} type="donut" />
			</div>
		</div>
		<br />

		<div class="w-auto bg-base-100 shadow-xl rounded-lg">
			<div class="card-body">
				<h2 class="py-3 px-5 bg-gray-50 text-lg font-bold text-center">What people say</h2>
				<br />
				<div class="flex">
					<div class="flex-none w-28 h-14 font-semibold">Genuine</div>
					<div class="flex-initial w-auto ...">
						<progress class="progress w-40" value="10" max="100" />
					</div>
				</div>

				<div class="flex">
					<div class="flex-none w-28 h-14 font-semibold">Scam</div>
					<div class="flex-initial w-auto ...">
						<progress class="progress w-40" value="30" max="100" />
					</div>
				</div>

				<div class="flex">
					<div class="flex-none w-28 h-14 font-semibold">Stereotype</div>
					<div class="flex-initial w-auto ...">
						<progress class="progress w-40" value="40" max="100" />
					</div>
				</div>

				<div class="flex">
					<div class="flex-none w-28 h-14 font-semibold">Hate</div>
					<div class="flex-initial w-auto ...">
						<progress class="progress w-40" value="60" max="100" />
					</div>
				</div>

				<div class="flex">
					<div class="flex-none w-28 h-14 font-semibold">Fake</div>
					<div class="flex-initial w-auto ...">
						<progress class="progress w-40" value="80" max="100" />
					</div>
				</div>

				<div class="card-actions justify-center">
					<Review />
					<SubmitReview />
				</div>
			</div>
		</div>
		<br />
		<br />
	{:else}
		<h1>{error}</h1>
	{/if}
</div>

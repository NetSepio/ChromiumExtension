<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';
	// import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';
	// import { GET_SITE_REVIEWS } from '$lib/graphql/queries';
	import Chart from 'svelte-frappe-charts';
	import { onMount } from 'svelte';
	import NoReviewFound from './NoReviewFound.svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { jwtToken } from '$lib/store/store';

	// interface reviewType {
	// 	category?: string;
	// 	id?: string;
	// 	siteSafety?: string;
	// 	siteTag?: string;
	// 	siteType?: string;
	// 	siteURL?: string;
	// 	domainAddress?: string;
	// }

	export let error: string = '';
	let response: any;
	let currentUrl: string | undefined;
	let chartValues: any[] = [];
	let chartLabels: string[] = [];
	let url: string | undefined;
	let ratingValue: number;
	let siteTags: any = {};
	let siteSafety: any = {};
	let statsChart = 1;
	let donutData: any = {
		labels: ['stats'],
		datasets: [
			{
				values: [statsChart]
			}
		]
	};
	let siteOverallSafety: string;
	let stats: any = [];

	const tempUrl = 'https://google.com';
	// 'todo.ommore.xyz'

	// const fetchSiteRelatedData = async () => {
	// 	let tempRes = await fetchGraphQLData(GET_SITE_REVIEWS, { url });

	// 	if (tempRes.reviewCreateds.length < 1) {
	// 		error = 'No reviews found..';
	// 		return;
	// 	}

	// 	response = tempRes.reviewCreateds;

	// 	console.log('Fetch Site Related Data: ' + response);

	// 	// structureSiteTagsAndSiteRating();
	// 	// structureDataForDonut();
	// };
	// const getUrl = async () => {
	// 	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	// 	url = tab.url?.toLocaleLowerCase();

	// 	console.log(url);
	// };

	// const structureSiteTagsAndSiteRating = () => {

	// 	if (response?.length) {

	// 		let tempArray: any = [];

	// 		response?.map((v: reviewType) => {
	// 			tempArray.push(v.siteTag);
	// 		});

	// 		for (let char of tempArray) {
	// 			!siteTags[char] ? (siteTags[char] = 1) : (siteTags[char] += 1);
	// 		}
	// 		let totalReviews = 0;

	// 		for (let char of Object.keys(siteTags)) {
	// 			totalReviews += siteTags[char];
	// 		}

	// 		let gen = siteTags.genuine ? siteTags.genuine : 0;
	// 		ratingValue = Math.round((gen / totalReviews) * 5);
	// 	}

	// };

	// const structureDataForDonut = () => {
	// 	if (response?.length) {
	// 		let tempArray: any = [];
	// 		response?.map((v: reviewType) => {
	// 			tempArray.push(v.siteSafety);
	// 		});
	// 		for (let char of tempArray) {
	// 			!siteSafety[char] ? (siteSafety[char] = 1) : (siteSafety[char] += 1);
	// 		}
	// 		let totalReviews = 0;
	// 		for (let char of Object.keys(siteSafety)) {
	// 			totalReviews += siteSafety[char];
	// 		}

	// 		for (let [key, value] of Object.entries(siteSafety)) {
	// 			chartLabels.push(key);
	// 			chartValues.push(value);
	// 		}
	// 		siteOverallSafety = Object.entries(siteSafety).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
	// 		donutData = {
	// 			labels: chartLabels,
	// 			datasets: [
	// 				{
	// 					values: chartValues
	// 				}
	// 			]
	// 		};
	// 	}
	// };

	const getStats = async () => {
		let token = '';

		jwtToken.subscribe((val) => (token = val));

		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${token}`
			}
		};

		const response = await fetch(`${PUBLIC_GATEWAY_URL}/stats?siteUrl=${tempUrl}`, options);
		const result = await response.json();
		stats = result.payload;
	};

	onMount(async () => {
		// await getUrl();
		// await fetchSiteRelatedData();
		await getStats();
		currentUrl = url?.substring(0, 23) + '...';
	});
</script>

<div>
	<Header />
	<br />
	<div class="bg-white text-black dark:bg-gray-900 dark:text-white">
		{#if error.length < 1}
			<div class="justify-center my-4">
				<div class="block p-4 w-auto h-fit">
					<Chart data={donutData} type="donut" height={200} />
					<div />
				</div>
			</div>
			<br />

			<div class="w-auto shadow-lg dark:shadow-green-300/30 rounded-lg">
				<div class="p-4">
					<h2 class="px-5 text-xl font-bold text-center dark:text-white">What people say</h2>
					<br />
					<!-- {#each Object.entries(siteTags) as [key, value]}
						<div class="flex">
							<div class="flex-none w-28 h-14 font-semibold dark:text-white">
								{key.toLocaleUpperCase()}
							</div>
							<div class="flex-initial w-auto ...">
								<progress
									class="progress w-40 bg-white dark:bg-green-300/30 dark:border-white/30 dark:border"
									value={(value / response?.length) * 100}
									max="100"
								/>
							</div>
						</div>
					{/each} -->
					<div class="card-actions justify-center">
						<Review {stats} />
						<SubmitReview />
					</div>
				</div>
			</div>
			<br />
			<br />
		{:else}
			<NoReviewFound {error} {currentUrl} />
		{/if}
	</div>
</div>

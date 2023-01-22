<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';
	import { GET_SITE_REVIEWS } from '$lib/graphql/queries';
	import { siteReviews } from '$lib/modules/dummyResponseData';
	import Chart from 'svelte-frappe-charts';
	import { onMount } from 'svelte';

	let error;
	// let response = fetchGraphQLData(GET_SITE_REVIEWS, { url: 'https://todo.ommore.me' });

	let response = siteReviews.data.reviews[0];

	// THIS CODE IS FOR FORMATTING THE DATA FOR THE CHART =======
	// THIS IS COMMENTED BECAUSE THE API IS NOT WORKING
	// WHEN IT DOES WE CAN UNCOMMENT IT
	// if (response?.reviews?.length) {
	// 	let tempArray = [];
	// 	response?.reviews?.map((v) => {
	// 		tempArray.push(v?.siteTag);
	// 	});
	// 	let obj = {};
	// 	for (let char of tempArray) {
	// 		!obj[char] ? (obj[char] = 1) : (obj[char] += 1);
	// 	}
	// 	console.log(obj);
	// }

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
	async function getUrl() {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		url = tab.url;
	}

	let currentUrl: string | undefined = '';

	onMount(async () => {
		await getUrl();
		currentUrl = url;
	});
</script>

<div class="artboard phone-3 p-5 mb-5 pb-5">
	<Header />
	<br />
	<div class="flex">
		<div class="flex-1 w-72">
			<div class="justify-center">
				<div class="block rounded-lg shadow-lg bg-white p-5 w-auto h-auto content-around">
					<h1 class="font-bold text-black text-lg">{currentUrl}</h1>
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
			<h1 class="font-bold text-black text-3xl text-center">{response.siteSafety}</h1>
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
</div>

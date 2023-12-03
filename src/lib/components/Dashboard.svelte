<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';
	import Chart from 'svelte-frappe-charts';
	import { onMount, onDestroy} from 'svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { jwtToken } from '$lib/store/store';
	import { get } from 'svelte/store';
	import { writable } from 'svelte/store';
	import Loader from './Loader.svelte';
	 import { isReviewSubmitted } from '$lib/store/store';

	
  let storeSubscription;
	let currentUrl: string;
	let url: string | undefined;
	let stats: any = [];
	let donutData: any;
	let isLoading = false;

	// let tempUrl = 'https://blog.com';

	$: urlWithoutProtocol = url?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');


	const getUrl = async () => {
		isLoading = true;
		try {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			url = tab.url?.toLocaleLowerCase();
		} catch (error) {
			console.log(error)
		}finally{
			isLoading = false;
		}
		// console.log(url);
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

		const response = await fetch(
			`${PUBLIC_GATEWAY_URL}/stats?domain=${urlWithoutProtocol}`,
			options
		);
		const result = await response.json();
		stats = result.payload;
		console.log(result);
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

//  // Watch for changes in isReviewSubmitted
//     const storeSubscription = isReviewSubmitted.subscribe((value) => {
//       if (value) {
//         stats(); // Refetch data when isReviewSubmitted becomes true
//         isReviewSubmitted.set(false); // Reset the store value after refetching
//       }
//     });

// 		// Cleanup function
//     onDestroy(() => {
//       storeSubscription.unsubscribe();
//     });

  });

</script>

<div>
	<Header />
	<div
		class="text-center text-xl text-bold dark:text-white p-2 m-5 border border-zinc-600 dark:border-green-400 rounded-full flex justify-center items-center"
	>
		{urlWithoutProtocol}
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
						<Review {urlWithoutProtocol} />
						<SubmitReview />
					</div>
				</div>
			</div>
		{:else if (stats && stats.length <= 0) || !stats}
			<div class="flex flex-col gap-28 items-center">
				<h3 class="text-3xl text-center">Be the first to review this website</h3>

				<div class="card-actions justify-end">
					<SubmitReview  />
				</div>
			</div>
		{/if}
		<!-- <br />
			<br /> -->
		<!-- {:else}
			<NoReviewFound {error} {currentUrl} />
		{/if} -->
	</div>
	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>

<!-- Reviews component -->

<script lang="ts">
	// Importing necessary modules and components
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';

	//declaring variables and constants
	let currentUrl: any;

	let isLoading = false;
	let reviews: any = [];
	let averageRating = 0;

	let isUserAuthenticated: boolean;

	// Derived variable to extract domain from URL
	$: urlWithoutProtocol = currentUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');

	// Function to get the current URL using Chrome API
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

	const removeIpfsPrefix = (input: string | undefined) => {
		// Check if input is not undefined before performing replace
		return input?.replace('ipfs://', '');
	};

	// Function to fetch reviews for the given domain
	const getReviews = async () => {
		try {
			const options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			};

			const response = await fetch(
				`${PUBLIC_GATEWAY_URL}/getreviews?page=1&domain=${urlWithoutProtocol}`,
				options
			);
			const result = await response.json();
			averageRating = result.payload.averageRating;
			const data = result.payload.reviews;

			if (data) {
				result.payload.reviews.forEach(async (meta: any) => {
					const response = await fetch(
						`https://nftstorage.link/ipfs/${removeIpfsPrefix(meta.metaDataUri)}`
					);
					const data = await response.json();

					reviews = [...reviews, data];
					// console.log(reviews);
				});
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	// Lifecycle hook that runs after the component is first mounted
	onMount(async () => {
		await getUrl();
		await getReviews();

		[isUserAuthenticated] = await checkAuth();
	});
</script>

<!-- HTML structure for displaying ratings and reviews -->
<div>
	<!-- Ratings section -->
	<div>
		<div class="flex justify-between items-center mt-2">
			<h3 class="text-xl font-bold">Ratings</h3>
			<span class="text-xs">{averageRating}% safe</span>
		</div>
		<div
			class="mt-4 h-2 w-full overflow-hidden rounded-lg bg-[#FFFFFF0D] dark:bg-#2F3A65 shadow-light"
		>
			<span
				style={`width: ${averageRating}%`}
				class={`h-8 block my-auto bg-#263238 dark:bg-[#11D9C5]`}
			/>
		</div>
	</div>

	<!-- Reviews section -->
	<div class="my-4">
		<h3 class="text-xl font-bold">Reviews</h3>
		<div class="flex flex-col gap-4">
			{#each reviews.slice(0, 2) as review}
				<div class="reviews">
					<p>
						{review.description}
					</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Grid layout for displaying Review and SubmitReview components -->
	<div class="grid grid-cols-2 gap-x-2">
		<Review {urlWithoutProtocol} />
		{#if isUserAuthenticated == false}
			<SubmitReview {urlWithoutProtocol} />
		{:else}
			<a href="/submit-review"><button class="btn primary-button"> Submit Review </button></a>
		{/if}
	</div>
</div>

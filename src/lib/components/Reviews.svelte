<!-- Reviews component -->

<script lang="ts">
	// Importing necessary modules and components
	import Review from '$lib/components/Review.svelte';
	import SubmitReview from '$lib/components/SubmitReview.svelte';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { fetchMetadataFromIPFS } from '$lib/utils';
	import { jwtToken } from '$lib/store/store';

	//declaring variables and constants
	let currentUrl: string | undefined = $state();

	let isLoading = false;
	let reviews: any = $state([]);
	let averageRating = $state(0);

	let isUserAuthenticated: boolean;

	// Derived variable to extract domain from URL
	let urlWithoutProtocol = $derived(currentUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1'));

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
		let token = '';
		// Get the JWT token from the store
		jwtToken.subscribe((val) => (token = val));
		try {
			const options = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			};

			const response = await fetch(
				`${PUBLIC_GATEWAY_URL}/getreviews?page=1&domain=${urlWithoutProtocol}`,
				options
			);
			const result = await response.json();
			averageRating = result?.payload?.averageRating ?? 0;
			const data = result?.payload?.reviews;

			if (data) {
				result?.payload?.reviews.forEach(async (meta: any) => {
					const ipfsUrl = `https://nftstorage.link/ipfs/${removeIpfsPrefix(meta.metaDataUri)}`;
					const response = await fetch(ipfsUrl);
					const data = await response.json();
					// const metaData = await fetchMetadataFromIPFS(ipfsUrl, data.id);
					data.transactionHash = meta.transactionHash;

					reviews = [...reviews, data];
				});
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	const truncateDescription = (description: string, maxLength: number) => {
		const words = description.split(' ');
		const truncatedWords = words.slice(0, maxLength);
		const truncatedDescription = truncatedWords.join(' ');
		const isTruncated = words.length > maxLength;

		return truncatedDescription.concat(isTruncated ? '..' : '');
	};

	// Lifecycle hook that runs after the component is first mounted
	onMount(async () => {
		await getUrl();
		await getReviews();

		[isUserAuthenticated] = await checkAuth();
	});
</script>

<!-- HTML structure for displaying ratings and reviews -->
<div class="w-[75%] mx-auto mt-[6%]">
	<!-- Ratings section -->
	<div class="mb-[10%]">
		<div class="flex justify-between items-center mt-2">
			<h3 class="text-sm dark:font-medium font-semibold">Ratings</h3>
			<span class="text-[10px]">{Math.round(averageRating * 10)}% safe</span>
		</div>
		<div
			class="mt-4 h-2 w-full rounded-lg bg-white/5 shadow-sm shadow-appGray dark:shadow-none dark:bg-[#2F3A65] shadow-light"
		>
			<span
				style={`width: ${Math.round(averageRating * 10)}%`}
				class={`h-[8px] block my-auto shad rounded-[5px] bg-[#263238] dark:bg-[#11D9C5]`}
			></span>
		</div>
	</div>

	<!-- Reviews section -->
	<div class="">
		<h3 class="text-sm mb-3 dark:font-medium font-semibold">Reviews</h3>
		<div class="flex flex-col gap-3">
			{#each reviews.slice(0, 2) as review}
				<div
					style="box-shadow: 0px 2px 4px 0px rgba(38, 50, 56, 0.2);"
					class="reviews border border-secondary dark:border-action dark:shadow-action dark:border-opacity-10 border-opacity-10 h-[85px]"
				>
					<p class="text-[11px]">
						&quot;{truncateDescription(review.description, 15)}&quot;
					</p>
					<button
						class="flex items-center mt-2 bg-secondary dark:bg-action dark:bg-opacity-60 hover:scale-105 cursor-pointer duration-200 active:scale-100 w-[84px] h-[19px] gap-1 pt-[1px] px-[5px] pb-[2px] rounded-[5px]"
					>
						<img width={12} height={12} src={'/img.svg'} alt="img" class="" />

						<a
							target="_blank"
							href={`https://explorer.aptoslabs.com/txn/${review?.transactionHash}/?network=mainnet`}
							class="text-[8px] whitespace-nowrap text-white">Review as NFT</a
						>
					</button>
				</div>
			{/each}
		</div>
	</div>

	<!-- Grid layout for displaying Review and SubmitReview components -->
	<div class="grid grid-cols-2 mt-[10%] gap-x-4">
		<Review {urlWithoutProtocol} />
		<!-- {#if isUserAuthenticated == false}
			<SubmitReview {urlWithoutProtocol} />
		{:else} -->
		<a href="/submit-review/create-review"
			><button class="primary-button"> Write Reviews </button></a
		>
		<!-- {/if} -->
	</div>
</div>

<script lang="ts">
	import { storeMetaData, createReview } from '$lib/modules/reviewSubmitFunctions';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';

	let showModal = false;
	let title: string;
	let description: string;
	let websiteUrl: string | undefined;
	let category: string;
	let siteTag: string;
	let siteSafety: string;
	let siteType: string;
	let image = 'ipfs://bafybeica7pi67452fokrlrmxrooazsxbuluckmcojascc5z4fcazsuhsuy';
	let isAuthenticated = false;

	const handleSubmit = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		websiteUrl = tab.url;
		const domainAddress = new URL(`${websiteUrl}`).hostname;

		let metaData = {
			name: title ?? '',
			description: description ?? '',
			category: category ?? '',
			image: image ?? '',
			domainAddress: domainAddress ?? '',
			siteUrl: websiteUrl ?? '',
			siteType: siteType ?? '',
			siteTag: siteTag ?? '',
			siteSafety: siteSafety ?? ''
		};

		let CID = await storeMetaData(metaData);

		let reviewData = {
			category: category ?? '',
			domainAddress: domainAddress ?? '',
			siteUrl: websiteUrl ?? '',
			siteType: siteType ?? '',
			siteTag: siteTag ?? '',
			siteSafety: siteSafety ?? '',
			metaDataUri: `ipfs://${CID}`,
			voter: $walletAddress
		};

		let [response, error] = await createReview(reviewData);

		showModal = false;
	};

	onMount(async () => {
		[isAuthenticated] = await checkAuth();
	});
</script>

<div class="grid flex-grow">
	<button
		class="ml-2 btn"
		on:click={() => {
			showModal = true;
		}}
	>
		Submit Review
	</button>
	<div class="modal" class:modal-open={showModal}>
		<div class="modal-box relative bg-white text-black dark:bg-gray-900 dark:text-white">
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={() => {
					showModal = false;
				}}
			>
				✕
			</button>
			{#if isAuthenticated}
				<h3 class="font-bold text-3xl mt-5">Write your Reviews Here</h3>

				<!-- TITLE -->
				<p class="text-md mt-5 mb-3">TITLE</p>
				<input
					type="text"
					placeholder="TITLE"
					class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={title}
				/>
				<!-- DESCRIPTION -->
				<p class="text-md mt-3 mb-3">DESCRIPTION</p>
				<input
					type="text"
					placeholder="DESCRIPTION"
					class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={description}
				/>
				<!-- CATEGORY -->
				<p class="text-md mt-3 mb-3">CATEGORY</p>
				<input
					type="text"
					placeholder="CATEGORY"
					class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={category}
				/>
				<!-- SITE TYPE -->
				<p class="text-md mt-3 mb-3">SITE TYPE</p>
				<input
					type="text"
					placeholder="SITE TYPE"
					class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={siteType}
				/>
				<!-- SITE TAG -->
				<p class="text-md mt-3 mb-3">SITE TAG</p>
				<input
					type="text"
					placeholder="SITE TAG"
					class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={siteTag}
				/>
				<!-- SITE SAFETY -->
				<p class="text-md mt-3 mb-3">SITE SAFETY</p>
				<input
					type="text"
					placeholder="SITE SAFETY"
					class="input input-bordered dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={siteSafety}
				/>
				<div class="modal-action">
					<button class="btn" on:click={handleSubmit}> Submit </button>
				</div>
			{:else}
				<a href="/Onboarding" class="btn">
					<h1>Get Authenticated</h1>
				</a>
			{/if}
		</div>
	</div>
</div>

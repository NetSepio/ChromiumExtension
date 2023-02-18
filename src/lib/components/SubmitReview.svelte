<script lang="ts">
	import { storeMetaData, createReview } from '$lib/modules/reviewSubmitFunctions';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';

	// USE THESE VALUES TO RENDER THE OPTIONS IN THE INPUT FIELD
	export let availableSiteSafetyKeywords: string[];
	export let availableSiteTagKeywords: string[];
	export let availableSiteTypeKeywords: string[];

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
		let metaDataUri = `ipfs://${CID}`.split(',')[0];

		let reviewData = {
			category: category ?? '',
			domainAddress: domainAddress ?? '',
			siteUrl: websiteUrl ?? '',
			siteType: siteType ?? '',
			siteTag: siteTag ?? '',
			siteSafety: siteSafety ?? '',
			metaDataUri,
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
					class="input input-bordered input-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={title}
					required={true}
				/>
				<!-- DESCRIPTION -->
				<p class="text-md mt-3 mb-3">DESCRIPTION</p>
				<textarea
					placeholder="DESCRIPTION"
					class="textarea textarea-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={description}
					required={true}
				/>
				<!-- CATEGORY -->
				<p class="text-md mt-3 mb-3">CATEGORY</p>
				<select
					class="select select-success w-full max-w-xs dark:bg-gray-900 dark:text-white dark:border-zinc-600"
					required={true}
					bind:value={category}
				>
					<option disabled selected>Pick a category</option>
					<option value="website">Website</option>
					<option value="mobile">Mobile</option>
				</select>
				<!-- SITE TYPE -->
				<p class="text-md mt-3 mb-3">SITE TYPE</p>
				<select
					class="select select-success w-full max-w-xs dark:bg-gray-900 dark:text-white dark:border-zinc-600"
					required={true}
					bind:value={siteType}
				>
					<option disabled selected>Pick a site type</option>
					<option value="common website">Common Website</option>
					<option value="social media">Social Media</option>
					<option value="software">Software</option>
					<option value="wallet address">Wallet Address</option>
					<option value="company">Company</option>
					<option value="defi project">DeFi Project</option>
				</select>
				<!-- SITE TAG -->
				<p class="text-md mt-3 mb-3">SITE TAG</p>
				<select
					class="select select-success w-full max-w-xs dark:bg-gray-900 dark:text-white dark:border-zinc-600"
					required={true}
					bind:value={siteTag}
				>
					<option disabled selected>Pick a site tag</option>
					<option value="scam">Scam</option>
					<option value="fake">Fake</option>
					<option value="stereotype">Stereotype</option>
					<option value="hate">Hate</option>
					<option value="genuine">Genuine</option>
				</select>
				<!-- SITE SAFETY -->
				<p class="text-md mt-3 mb-3">SITE SAFETY</p>
				<select
					class="select select-success w-full max-w-xs dark:bg-gray-900 dark:text-white dark:border-zinc-600"
					required={true}
					bind:value={siteSafety}
				>
					<option disabled selected>Pick a site safety</option>
					<option value="safe">Safe</option>
					<option value="phishing">Phishing</option>
					<option value="adware">Adware</option>
					<option value="malware">Malware</option>
					<option value="spyware">Spyware</option>
				</select>
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

<script lang="ts">
	import { storeMetaData, createReview } from '$lib/modules/reviewSubmitFunctions';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';

	let showModal = false;
	let title: string;
	let description: string;
	let websiteUrl: string | undefined;
	let category: string = 'website';
	let siteTag: string;
	let siteSafety: string;
	let siteType: string;
	let image = 'ipfs://bafybeica7pi67452fokrlrmxrooazsxbuluckmcojascc5z4fcazsuhsuy';
	let isAuthenticated = false;
	let isLoading = false;
	let siteRating = 0;

	const getUrl = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		websiteUrl = tab.url?.toLocaleLowerCase();
	};

	// const reloadPage = () => {
	// 	location.reload();
	// };

	const handleSubmit = async () => {
		isLoading = true;
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
			siteSafety: siteSafety ?? '',
			siteRating: siteRating ?? ''
		};

		let CID = await storeMetaData(metaData);
		let metaDataUri = `ipfs://${CID}`.split(',')[0];

		try {
			let reviewData = {
				category: category ?? 'website',
				domainAddress: domainAddress ?? '',
				siteUrl: websiteUrl ?? '',
				siteType: siteType ?? '',
				siteTag: siteTag ?? '',
				siteSafety: siteSafety ?? '',
				metaDataUri,
				siteIpfsHash: 'ipfs://abcd'
			};

			await createReview(reviewData);
		} catch (error) {
			console.log('error: ' + error);
		} finally {
			isLoading = false;
			showModal = false;
		}

		// setTimeout(function () {
		// 	reloadPage();
		// }, 3000);
	};

	onMount(async () => {
		[isAuthenticated] = await checkAuth();
		await getUrl();
	});
</script>

<div class="grid flex-grow">
	<button
		class=" btn"
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
				on:click={() => (showModal = false)}
			>
				✕
			</button>
			{#if isAuthenticated}
				<h3 class="font-bold text-2xl mt-5">Write Your Reviews Here</h3>

				<!-- Site URL -->
				<label for="websiteUrl" class="text-md mt-5 mb-3 block">URL</label>
				<input
					id="websiteUrl"
					type="text"
					value={websiteUrl}
					class="input input-bordered input-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					disabled
				/>
				<!-- CATEGORY -->
				<label for="category" class="text-md mt-3 mb-3 hidden">CATEGORY</label>
				<input
					id="category"
					type="text"
					value="Website"
					class="input input-bordered input-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs hidden"
					disabled
				/>
				<!-- RATING-->
				<label for="rating" class="text-md mt-3 mb-3 block">RATING</label>
				<input
					id="rating"
					type="number"
					min={0}
					max={10}
					placeholder="rating"
					class="textarea textarea-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={siteRating}
					required
				/>
				<!-- TITLE -->
				<label for="title" class="text-md mt-5 mb-3 block">TITLE</label>
				<input
					id="title"
					type="text"
					placeholder="TITLE"
					class="input input-bordered input-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={title}
					required
				/>
				<!-- DESCRIPTION -->
				<label for="description" class="text-md mt-3 mb-3 block">DESCRIPTION</label>
				<textarea
					id="description"
					placeholder="DESCRIPTION"
					class="textarea textarea-success dark:bg-gray-900 dark:text-white dark:border-zinc-600 input-md w-full max-w-xs"
					bind:value={description}
					required
				/>
				<!-- SITE TYPE -->
				<label for="siteType" class="text-md mt-3 mb-3 block">SITE TYPE</label>
				<select
					id="siteType"
					class="select select-success w-full max-w-xs dark:bg-gray-900 dark:text-white dark:border-zinc-600"
					required
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
				<label for="siteTag" class="text-md mt-3 mb-3 block">SITE TAG</label>
				<select
					id="siteTag"
					class="select select-success w-full max-w-xs dark:bg-gray-900 dark:text-white dark:border-zinc-600"
					required
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
				<label for="siteSafety" class="text-md mt-3 mb-3 block">SITE SAFETY</label>
				<select
					id="siteSafety"
					class="select select-success w-full max-w-xs dark:bg-gray-900 dark:text-white dark:border-zinc-600"
					required
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
					<button class="btn" on:click={handleSubmit}>Submit</button>
				</div>
			{:else}
				<a href="/Onboarding" class="btn">
					<h1>Get Authenticated</h1>
				</a>
			{/if}
		</div>
		<div
			class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
			class:modal-open={isLoading}
		>
			<Loader />
		</div>
	</div>
</div>

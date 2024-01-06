<script lang="ts">
	import { storeMetaData, createReview } from '$lib/modules/reviewSubmitFunctions';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Header from '$lib/components/Header.svelte';

	let title: string;
	let description: string;
	let websiteUrl: string | undefined;
	let category: string;
	let siteTag: string;
	let siteSafety: string;
	let siteType: string;
	let image = 'ipfs://bafybeica7pi67452fokrlrmxrooazsxbuluckmcojascc5z4fcazsuhsuy';
	let isAuthenticated = false;
	let isLoading = false;
	let siteRating = 0;

	let tempUrl = 'https://blog.com/';
	$: urlWithoutProtocol = tempUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');

	const getUrl = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		websiteUrl = tab.url?.toLocaleLowerCase();
	};

	const handleSubmit = async () => {
		isLoading = true;
		const domainAddress = urlWithoutProtocol;
		// new URL(`${websiteUrl}`).hostname;

		let metaData = {
			name: title ?? '',
			description: description ?? '',
			category: category ?? '',
			image: image ?? '',
			domainAddress: domainAddress ?? '',
			siteUrl: websiteUrl ?? tempUrl,
			siteType: siteType ?? '',
			siteTag: siteTag ?? '',
			siteSafety: siteSafety ?? '',
			siteRating: siteRating ?? ''
		};

		let CID = await storeMetaData(metaData);
		let metaDataUri = `ipfs://${CID}`.split(',')[0];

		try {
			let reviewData = {
				category: category ?? '',
				domainAddress: domainAddress ?? '',
				siteUrl: websiteUrl ?? tempUrl,
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
			// window.location.href = '/submit-review/success';
		}
	};

	onMount(async () => {
		[isAuthenticated] = await checkAuth();
		// await getUrl();
	});
</script>

<div class="grid flex-grow">
	<Header />
	<div class="relative text-black dark:text-white">
		<!-- {#if isAuthenticated} -->
		<div class="flex gap-4 mt-6">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16.6205 2.98833C16.5044 2.87192 16.3664 2.77956 16.2146 2.71655C16.0627 2.65353 15.8999 2.62109 15.7355 2.62109C15.5711 2.62109 15.4083 2.65353 15.2564 2.71655C15.1045 2.77956 14.9666 2.87192 14.8505 2.98833L6.54049 11.2983C6.44779 11.3908 6.37424 11.5007 6.32406 11.6217C6.27388 11.7427 6.24805 11.8724 6.24805 12.0033C6.24805 12.1343 6.27388 12.264 6.32406 12.385C6.37424 12.5059 6.44779 12.6158 6.54049 12.7083L14.8505 21.0183C15.3405 21.5083 16.1305 21.5083 16.6205 21.0183C17.1105 20.5283 17.1105 19.7383 16.6205 19.2483L9.38049 11.9983L16.6305 4.74833C17.1105 4.26833 17.1105 3.46833 16.6205 2.98833Z"
					fill="#11D9C5"
				/>
			</svg>

			<h1 class="font-bold text-2xl capitalize">share your reviews</h1>
		</div>

		<div class="grid gap-y-4 mt-4">
			<!-- Site URL -->
			<div
				id="websiteUrl"
				class="text-xs text-gray-400 bg-transparent border border-[#263238] dark:border-[#11D9C5] py-3 px-3 rounded-full"
			>
				{urlWithoutProtocol}
			</div>
			<!-- CATEGORY -->
			<select
				id="siteTag"
				class="select select-success primary-input h-8"
				required
				bind:value={category}
			>
				<option disabled selected class="font-bold">Category</option>
				<option value="tooling">Tooling</option>
				<option value="infra">Infra</option>
				<option value="bridges">Bridges</option>
				<option value="launchpads">Launchpads</option>
				<option value="social">Social</option>
				<option value="marketplaces">Marketplaces</option>
				<option value="wallets">Wallets</option>
				<option value="stablecoins">Stablecoins</option>
				<option value="nft tooling">NFT Tooling</option>
				<option value="gaming">Gaming</option>
				<option value="defi">DeFi</option>
			</select>
			<!-- RATING-->
			<input
				id="rating"
				type="number"
				min={0}
				max={10}
				placeholder="rating"
				class="input primary-input text-gray-400"
				bind:value={siteRating}
				required
			/>

			<!-- TITLE -->
			<input
				id="title"
				type="text"
				placeholder="Title"
				class="input primary-input"
				bind:value={title}
				required
			/>

			<!-- DESCRIPTION -->
			<textarea
				id="description"
				placeholder="Description"
				class="textarea textarea-success primary-input h-12 rounded-2xl"
				bind:value={description}
				required
			/>

			<!-- SITE TYPE -->
			<select
				id="siteType"
				class="select select-success primary-input"
				required
				bind:value={siteType}
			>
				<option disabled selected class="font-bold">Type</option>

				<option value="website">Website</option>
				<option value="mobile app">Mobile App</option>
				<option value="browser extension">Browser Extension</option>
				<option value="software">Software</option>
			</select>
			<!-- SITE TAG -->
			<select
				id="siteTag"
				class="select select-success primary-input"
				required
				bind:value={siteTag}
			>
				<option disabled selected class="font-bold">Tag</option>
				<option value="genuine">Genuine</option>
				<option value="abandoned">Abandoned</option>
				<option value="scam">Scam</option>
				<option value="fake">Fake</option>
				<option value="unsure">Unsure</option>
			</select>

			<!-- SITE SAFETY -->
			<select
				id="siteSafety"
				class="select select-success primary-input"
				required
				bind:value={siteSafety}
			>
				<option disabled selected class="font-bold">Safety</option>
				<option value="safe">Safe</option>
				<option value="mostyle safe">Mostly Safe</option>
				<option value="adware issues">Adware Issues</option>
				<option value="malware threats">Malware Threats</option>
				<option value="spyware risks">Spyware Risks</option>
				<option value="phishing concerns">Phishing Concerns</option>
			</select>

			<div>
				<button class="btn primary-button" on:click={handleSubmit}>Submit</button>
			</div>
		</div>

		<!-- {:else}
				<a href="/Onboarding" class="btn">
					<h1>Get Authenticated</h1>
				</a>
			{/if} -->
	</div>
	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>

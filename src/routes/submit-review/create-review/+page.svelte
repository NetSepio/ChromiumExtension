<!-- Create review page -->
<script lang="ts">
	// Importing necessary functions and components
	import { storeMetaData, createReview } from '$lib/modules/reviewSubmitFunctions';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Header from '$lib/components/Header.svelte';
	import { goto } from '$app/navigation';

	// Initializing variables
	let title: string;
	let description: string;
	let websiteUrl: string | undefined;
	let category: string;
	let siteTag: string;
	let siteSafety: string;
	let siteType: string;
	let image = 'ipfs://bafybeica7pi67452fokrlrmxrooazsxbuluckmcojascc5z4fcazsuhsuy'; // Default image URL
	let isAuthenticated = false;
	let isLoading = false;
	let siteRating = 0;
	let response: any;

	// Function to get the active tab URL
	const getUrl = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		websiteUrl = tab.url?.toLocaleLowerCase();
	};

	// Function to handle form submission
	const handleSubmit = async () => {
		isLoading = true;
		const domainAddress = new URL(`${websiteUrl}`).hostname;

		// Creating metadata object
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

		// Storing metadata on IPFS and obtaining CID
		let CID = await storeMetaData(metaData);
		let metaDataUri = `ipfs://${CID}`.split(',')[0];

		try {
			// Creating review data object
			let reviewData = {
				category: category ?? '',
				description: description ?? '',
				domainAddress: domainAddress ?? '',
				siteUrl: websiteUrl ?? '',
				siteType: siteType ?? '',
				siteTag: siteTag ?? '',
				siteSafety: siteSafety ?? '',
				siteRating: siteRating ?? '',
				metaDataUri,
				siteIpfsHash: 'ipfs://abcd' // Placeholder IPFS hash
			};

			// Making API call to create a review
			response = await createReview(reviewData);
		} catch (error) {
			console.log('error: ' + error);
		} finally {
			isLoading = false;

			// Redirecting to success page on successful submission
			if (response.status === 200) {
				console.log('success');

				setTimeout(() => {
					goto('/submit-review/success');
				}, 2000);

				// window.location.replace('/submit-review/success');
			}
		}
	};

	// On component mount, check authentication and get the active tab URL
	onMount(async () => {
		[isAuthenticated] = await checkAuth();
		await getUrl();
	});
</script>

<!-- Main Content -->
<div class="grid flex-grow">
	<Header />

	<!-- Main Form Section -->
	<div class="relative text-black dark:text-white">
		<div class="flex items-center gap-4 mt-6">
			<a href="/">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="fill-[#263238] dark:fill-[#11D9C5]"
				>
					<path
						d="M16.6205 2.98833C16.5044 2.87192 16.3664 2.77956 16.2146 2.71655C16.0627 2.65353 15.8999 2.62109 15.7355 2.62109C15.5711 2.62109 15.4083 2.65353 15.2564 2.71655C15.1045 2.77956 14.9666 2.87192 14.8505 2.98833L6.54049 11.2983C6.44779 11.3908 6.37424 11.5007 6.32406 11.6217C6.27388 11.7427 6.24805 11.8724 6.24805 12.0033C6.24805 12.1343 6.27388 12.264 6.32406 12.385C6.37424 12.5059 6.44779 12.6158 6.54049 12.7083L14.8505 21.0183C15.3405 21.5083 16.1305 21.5083 16.6205 21.0183C17.1105 20.5283 17.1105 19.7383 16.6205 19.2483L9.38049 11.9983L16.6305 4.74833C17.1105 4.26833 17.1105 3.46833 16.6205 2.98833Z"
					/>
				</svg>
			</a>

			<h1 class="font-bold text-2xl capitalize">share your reviews</h1>
		</div>

		<!-- Main Form Inputs -->
		<div class="grid gap-y-4 mt-4">
			<!-- Site URL -->
			<div
				id="websiteUrl"
				class="text-xs text-gray-400 bg-transparent border border-[#263238] dark:border-[#11D9C5] py-3 px-3 rounded-full"
			>
				{websiteUrl}
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

			<!-- RATING -->
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
				<option value="mostly safe">Mostly Safe</option>
				<option value="adware issues">Adware Issues</option>
				<option value="malware threats">Malware Threats</option>
				<option value="spyware risks">Spyware Risks</option>
				<option value="phishing concerns">Phishing Concerns</option>
			</select>

			<!-- Submit button -->
			<div>
				<button class="btn primary-button" on:click={handleSubmit}>Submit</button>
			</div>
		</div>
	</div>

	<!-- Loading Spinner -->
	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>

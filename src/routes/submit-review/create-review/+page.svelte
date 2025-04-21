<!-- Create review page -->
<script lang="ts">
	// Importing necessary functions and components
	import { storeMetaDataPin, createReview } from '$lib/modules/reviewSubmitFunctions';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Header from '$lib/components/Header.svelte';
	import { goto } from '$app/navigation';
	import Arrow from '$lib/components/Arrow.svelte';
	import { fade, slide } from 'svelte/transition';
	import { darktheme } from '$lib/store/store';
	import { PUBLIC_GATEWAY_URL_PINATA, PUBLIC_PINATA_JWT } from '$env/static/public';
	import { PinataSDK } from 'pinata';

	export const pinata = new PinataSDK({
		pinataJwt: `${PUBLIC_PINATA_JWT}`,
		pinataGateway: `${PUBLIC_GATEWAY_URL_PINATA}`
	});

	// Initializing variables
	let tab: number = $state(1);
	let title: string = $state();
	let description: string = $state();
	let websiteUrl: string | undefined = 'https://google.com';
	let hostUrl: string | undefined = $state('https://google.com');
	let category: string = $state('');
	let siteTag: string = $state('');
	let siteSafety: string = $state('');
	let siteType: string = $state('');
	let image = 'ipfs://bafybeica7pi67452fokrlrmxrooazsxbuluckmcojascc5z4fcazsuhsuy'; // Default image URL
	let isAuthenticated = $state(false);
	let submitted = $state(false);
	let isLoading = $state(false);
	let rating: number = $state(0);
	let response: any;
	let error: string = $state('');
	let categories = [
		{ text: 'Category', disabled: true, selected: !true },
		{ text: 'Tooling' },
		{ text: 'Infra' },
		{ text: 'Bridges' },
		{ text: 'Launchpads' },
		{ text: 'Social' },
		{ text: 'Marketplaces' },
		{ text: 'Wallets' },
		{ text: 'Stablecoins' },
		{ text: 'NFT Tooling' },
		{ text: 'Gaming' },
		{ text: 'DeFi' }
	];
	let siteSafetyOptions = [
		{ text: 'Safety', disabled: true, selected: !true },
		{ text: 'Safe' },
		{ text: 'Mostly Safe' },
		{ text: 'Adware Issues' },
		{ text: 'Malware Threats' },
		{ text: 'Spyware Risks' },
		{ text: 'Phishing Concerns' }
	];
	let siteTagOptions = [
		{ text: 'Tag', disabled: true, selected: !true },
		{ text: 'Genuine' },
		{ text: 'Abandoned' },
		{ text: 'Scam' },
		{ text: 'Fake' },
		{ text: 'Unsure' }
	];
	let types = [
		{ text: 'Type', disabled: true, selected: !true },
		{ text: 'Website' },
		{ text: 'Mobile App' },
		{ text: 'Browser Extension' },
		{ text: 'Software' }
	];
	let ratings = [
		{ text: 'Rating', selected: !true, disabled: true },
		{ text: 1 },
		{ text: 2 },
		{ text: 3 },
		{ text: 4 },
		{ text: 5 },
		{ text: 6 },
		{ text: 7 },
		{ text: 8 },
		{ text: 9 },
		{ text: 10 }
	];
	let darkMode: boolean | undefined = $state(undefined); // Initial dark mode state
	darktheme.subscribe((data) => (darkMode = data));
	let src = $derived(darkMode ? '/done.svg' : '/done_light.svg');

	//function to handlescreenshot
	const handleScreenshot = async () => {
		try {
			chrome.tabs.captureVisibleTab(
				chrome.windows.WINDOW_ID_CURRENT,
				{ format: 'png' },
				async (dataurl) => {
					const response = await fetch(dataurl);
					const blob = await response.blob();
					const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
					const upload = await pinata.upload.file(file);
					image = upload.cid;
				}
			);
		} catch (error) {
			console.error('Error capturing screenshot:', error);
		}
	};

	// Function to get the active tab URL
	const getUrl = async () => {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		websiteUrl = tab.url?.toLocaleLowerCase();
		hostUrl = new URL(websiteUrl!).origin.toLocaleLowerCase();
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
			siteUrl: hostUrl ?? '',
			siteType: siteType ?? '',
			siteTag: siteTag ?? '',
			siteSafety: siteSafety ?? '',
			siteRating: rating ?? ''
		};

		// Storing metadata on IPFS and obtaining CID
		let CID = await storeMetaDataPin(metaData);
		let metaDataUri = `ipfs://${CID}`.split(',')[0];

		try {
			// Creating review data object
			let reviewData = {
				category: category ?? '',
				description: description ?? '',
				domainAddress: domainAddress ?? '',
				siteUrl: hostUrl ?? '',
				siteType: siteType ?? '',
				siteTag: siteTag ?? '',
				siteSafety: siteSafety ?? '',
				siteRating: rating ?? '',
				metaDataUri,
				siteIpfsHash: 'ipfs://abcd' // Placeholder IPFS hash
			};

			// console.log('revData', reviewData);

			// Making API call to create a review
			response = await createReview(reviewData);

			isLoading = false;
		} catch (error) {
			console.log('error: ' + error);
			isLoading = false;
		} finally {
			isLoading = false;

			// Redirecting to success page on successful submission
			if (response.status === 200) {
				console.log('success');
				submitted = true;

				// setTimeout(() => {
				// 	goto('/submit-review/success');
				// }, 2000);

				// window.location.replace('/submit-review/success');
			}
			if (response.error) {
				error = response.error;
			}
		}
	};

	// On component mount, check authentication and get the active tab URL
	onMount(async () => {
		[isAuthenticated] = await checkAuth();
		await getUrl();
		await handleScreenshot();
	});
</script>

<!-- Main Content -->
<div class={`h-full relative flex  flex-col`}>
	{#if !isAuthenticated}
		<div class=" w-full h-full absolute top-[4%] z-10">
			<h5
				class="semiBold text-[14px] mb-[4%] relative left-[5%] dark:text-[#FF85C2] text-[#EB3438]"
			>
				Wallet Not Connected!
			</h5>
			<div
				class="w-[97%] border mx-auto px-[28px] py-[19px] dark:border-action border-secondary rounded-[10px] h-[100px]"
			>
				<p class="font-medium text-xs">Connect Your Wallet</p>
				<button class="h-[36px] mx-auto w-[100%] primary-button mt-[5%]">
					<a href="/Onboarding">Connect</a></button
				>
			</div>
		</div>
	{/if}
	<div class={`h-full flex ${isAuthenticated ? 'opacity-100' : 'opacity-10'} flex-col`}>
		<Header />
		<!-- Loading Spinner -->
		{#if isLoading}
			<Loader />
		{:else if !submitted}
			{#if tab === 1}
				<!-- Main Form Section -->
				<form
					onsubmit={() => (tab = 2)}
					in:fade|global={{ duration: 300 }}
					class="relative flex flex-col justify-start flex-grow text-black dark:text-white"
				>
					<div class="flex items-center mx-auto w-[85%] mt-[17%] mb-[10%] gap-4">
						<a class="hover:-translate-x-[2px] duration-300" href="/">
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								class="fill-[#263238] dark:fill-[#11D9C5]"
							>
								<path
									d="M16.6205 2.98833C16.5044 2.87192 16.3664 2.77956 16.2146 2.71655C16.0627 2.65353 15.8999 2.62109 15.7355 2.62109C15.5711 2.62109 15.4083 2.65353 15.2564 2.71655C15.1045 2.77956 14.9666 2.87192 14.8505 2.98833L6.54049 11.2983C6.44779 11.3908 6.37424 11.5007 6.32406 11.6217C6.27388 11.7427 6.24805 11.8724 6.24805 12.0033C6.24805 12.1343 6.27388 12.264 6.32406 12.385C6.37424 12.5059 6.44779 12.6158 6.54049 12.7083L14.8505 21.0183C15.3405 21.5083 16.1305 21.5083 16.6205 21.0183C17.1105 20.5283 17.1105 19.7383 16.6205 19.2483L9.38049 11.9983L16.6305 4.74833C17.1105 4.26833 17.1105 3.46833 16.6205 2.98833Z"
								/>
							</svg>
						</a>

						<h1 class="semiBold leading-none text-[24px] capitalize">share your reviews</h1>
					</div>

					<!-- Main Form Inputs -->
					<div class="flex flex-col gap-[16px]">
						<!-- Site URL -->
						<div
							id="websiteUrl"
							class="text-xs w-[80%] mx-auto text-gray-400 bg-transparent border flex items-center border-[#263238] dark:border-[#11D9C5] h-[36px] px-3 rounded-[50px]"
						>
							{hostUrl}
						</div>

						<!-- CATEGORY -->
						<div class="w-full relative items-center flex justify-center">
							<div
								class="absolute primary-input flex justify-between items-center mx-auto border px-4 w-[80%]"
							>
								<p
									class={`text-dark text-xs dark:text-white ${
										!category ? 'opacity-50' : 'opacity-100'
									}`}
								>
									{!category ? 'Category' : category}
								</p>
								<Arrow />
							</div>

							<select
								id="siteTag"
								class="select z-10 opacity-0 text-white/0 dark:text-dark/0 primary-input"
								required
								bind:value={category}
							>
								{#each categories as category}
									<option
										value={category.text}
										selected={category.selected}
										disabled={category.disabled}
										class="font-medium text-black"
									>
										{category.text}
									</option>
								{/each}
							</select>
						</div>
						<!-- RATING -->
						<div class="w-full relative items-center flex justify-center">
							<div
								class="absolute primary-input flex justify-between items-center mx-auto border px-4 w-[80%]"
							>
								<p
									class={`text-dark text-xs dark:text-white ${
										!rating ? 'opacity-50' : 'opacity-100'
									}`}
								>
									{!rating ? 'Rating' : rating}
								</p>
								<Arrow />
							</div>

							<select
								id="rating"
								class="select z-10 opacity-0 text-white/0 dark:text-dark/0 primary-input"
								required
								bind:value={rating}
							>
								{#each ratings as rating}
									<option
										value={rating.text}
										selected={rating.selected}
										disabled={rating.disabled}
										class="font-medium text-black"
									>
										{rating.text}
									</option>
								{/each}
							</select>
						</div>

						<!-- RATING -->
						<!-- <input
							id="rating"
							type="number"
							min={0}
							max={10}
							placeholder="Rating"
							class="input appearance-none primary-input text-xs focus:outline-none"
							bind:value={siteRating}
							required
						/> -->

						<!-- TITLE -->
						<input
							id="title"
							type="text"
							placeholder="Title"
							class="input primary-input focus:outline-none"
							bind:value={title}
							required
						/>

						<!-- DESCRIPTION -->
						<!-- <textarea
				id="description"
				placeholder="Description"
				class="textarea textarea-success primary-input h-12 rounded-2xl"
				bind:value={description}
				required
			/> -->

						<!-- SITE TYPE -->
						<div class="w-full relative items-center flex justify-center">
							<div
								class="absolute primary-input flex justify-between items-center mx-auto border px-4 w-[80%]"
							>
								<p
									class={`text-dark text-xs dark:text-white ${
										!siteType ? 'opacity-50' : 'opacity-100'
									}`}
								>
									{!siteType ? 'Type' : siteType}
								</p>
								<Arrow />
							</div>
							<select
								id="siteType"
								class="select opacity-0 primary-input"
								required
								bind:value={siteType}
							>
								{#each types as type}
									<option
										value={type.text}
										selected={type.selected}
										disabled={type.disabled}
										class="font-medium text-black">{type.text}</option
									>
								{/each}
							</select>
						</div>
					</div>
					<!-- Submit button -->
					<div class="absolute w-[80%] mx-auto flex flex-col gap-[29px] bottom-[5%] self-center">
						<div class="flex justify-center items-center gap-[8px]">
							<button
								class={`w-[10px] bg-secondary dark:bg-action dark:hover:border-action hover:border dark:hover:bg-transparent h-[10px] rounded-full`}
							></button>
							<button
								class={`w-[10px] bg-transparent hover:bg-secondary dark:hover:bg-action border border-secondary dark:border-action h-[10px] rounded-full`}
							></button>
						</div>
						<button type="submit" class="h-[36px] mx-auto w-[100%] primary-button">Next</button>
					</div>
				</form>
			{:else}
				<!-- Main Form Section -->
				<form
					onsubmit={handleSubmit}
					in:fade|global={{ duration: 300 }}
					class="relative flex flex-col justify-start flex-grow text-black dark:text-white"
				>
					<div class="flex items-center mx-auto w-[85%] mt-[17%] mb-[10%] gap-4">
						<button onclick={() => (tab = 1)} class="hover:-translate-x-[2px] duration-300">
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								class="fill-[#263238] dark:fill-[#11D9C5]"
							>
								<path
									d="M16.6205 2.98833C16.5044 2.87192 16.3664 2.77956 16.2146 2.71655C16.0627 2.65353 15.8999 2.62109 15.7355 2.62109C15.5711 2.62109 15.4083 2.65353 15.2564 2.71655C15.1045 2.77956 14.9666 2.87192 14.8505 2.98833L6.54049 11.2983C6.44779 11.3908 6.37424 11.5007 6.32406 11.6217C6.27388 11.7427 6.24805 11.8724 6.24805 12.0033C6.24805 12.1343 6.27388 12.264 6.32406 12.385C6.37424 12.5059 6.44779 12.6158 6.54049 12.7083L14.8505 21.0183C15.3405 21.5083 16.1305 21.5083 16.6205 21.0183C17.1105 20.5283 17.1105 19.7383 16.6205 19.2483L9.38049 11.9983L16.6305 4.74833C17.1105 4.26833 17.1105 3.46833 16.6205 2.98833Z"
								/>
							</svg>
						</button>

						<h1 class="semiBold leading-none text-[24px] capitalize">share your reviews</h1>
					</div>

					<!-- Main Form Inputs -->
					<div class="flex flex-col gap-[16px] ml-3">
						<div class="w-full relative items-center flex justify-center">
							<div
								class="absolute primary-input flex justify-between items-center mx-auto border px-4 w-[80%]"
							>
								<p
									class={`text-dark text-xs dark:text-white ${
										!siteTag ? 'opacity-50' : 'opacity-100'
									}`}
								>
									{!siteTag ? 'Tag' : siteTag}
								</p>
								<Arrow />
							</div>
							<!-- SITE TAG -->
							<select
								id="siteTag"
								class="select opacity-0 primary-input"
								required
								bind:value={siteTag}
							>
								{#each siteTagOptions as option}
									<option
										value={option.text}
										selected={option.selected}
										disabled={option.disabled}
										class="font-medium text-black"
									>
										{option.text}
									</option>
								{/each}
							</select>
						</div>

						<div class="w-full relative items-center flex justify-center">
							<div
								class="absolute primary-input flex justify-between items-center mx-auto border px-4 w-[80%]"
							>
								<p
									class={`text-dark text-xs dark:text-white ${
										!siteSafety ? 'opacity-50' : 'opacity-100'
									}`}
								>
									{!siteSafety ? 'Safety' : siteSafety}
								</p>
								<Arrow />
							</div>
							<!-- SITE SAFETY -->
							<select
								id="siteSafety"
								class="select opacity-0 primary-input"
								required
								bind:value={siteSafety}
							>
								{#each siteSafetyOptions as option}
									<option
										value={option.text}
										selected={option.selected}
										disabled={option.disabled}
										class="font-medium text-black"
									>
										{option.text}
									</option>
								{/each}
							</select>
						</div>

						<!-- DESCRIPTION -->
						<div class="w-max mx-auto h-max relative">
							<p class="absolute bottom-3 right-4 text-appGray dark:text-appGray text-[10px]">
								Max. 50 words
							</p>

							<textarea
								id="description"
								placeholder="Additional Feedback"
								class="textarea textarea-success resize-none primary-input h-[126px] w-[282px] focus:outline-none rounded-[20px]"
								bind:value={description}
								required
							></textarea>
						</div>
					</div>
					{#if error}
						<p class="text-xs mx-auto text-red-400">{error}</p>
					{/if}
					<!-- Submit button -->
					<div class="absolute w-[80%] flex flex-col gap-[29px] bottom-[5%] self-center">
						<div class="flex justify-center items-center gap-[8px]">
							<button
								onclick={() => (tab = 1)}
								class={`w-[10px] bg-transparent hover:bg-secondary dark:hover:bg-action border border-secondary dark:border-action h-[10px] rounded-full`}
							></button>
							<button
								onclick={() => (tab = 2)}
								class={`w-[10px] bg-secondary dark:bg-action dark:hover:border-action hover:border dark:hover:bg-transparent h-[10px] rounded-full`}
							></button>
						</div>
						<button type="submit" class="h-[36px] text-sm w-full primary-button">Submit</button>
						<!-- on:click={handleSubmit} -->
					</div>
				</form>
			{/if}
		{:else}
			<div class="h-[460px] text-center flex flex-col items-center justify-center gap-4">
				<!-- Success illustration with a circle and path -->
				<img src="/good.svg" alt="good" />

				<!-- Success message -->
				<h1 class="text-black dark:text-white text-xl text-center font-bold">
					Successfully submitted!
				</h1>

				<!-- Button to navigate to the homepage -->
				<a href="/" class="w-full">
					<button class="w-[200px] primary-button">Home</button>
				</a>
			</div>
		{/if}
	</div>
</div>

<!-- Create review page -->
<script lang="ts">
	// Importing necessary functions and components
	import { storeMetaData, createReview } from '$lib/modules/reviewSubmitFunctions';
	import { checkAuth } from '$lib/modules/secondAuth';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Header from '$lib/components/Header.svelte';
	import { goto } from '$app/navigation';
	import Arrow from '$lib/components/Arrow.svelte';

	// Initializing variables
	let title: string;
	let description: string;
	let websiteUrl: string | undefined = 'Website Url';
	let category: string;
	let siteTag: string;
	let siteSafety: string;
	let siteType: string;
	let image = 'ipfs://bafybeica7pi67452fokrlrmxrooazsxbuluckmcojascc5z4fcazsuhsuy'; // Default image URL
	let isAuthenticated = false;
	let isLoading = false;
	let siteRating: number;
	let response: any;
	let tab: number = 1;

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
<div class="h-full flex flex-col">
	<Header />

	<!-- Main Form Section -->
	<div class="relative flex flex-col justify-start flex-grow text-black dark:text-white">
		<div class="flex items-center mx-auto w-[85%] mt-[17%] mb-[10%] gap-4">
			<a class="hover:-translate-x-[2px] duration-300" href="/submit-review/create-review">
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
		<div class="flex flex-col gap-[16px] ml-3">
			<div class="w-full relative items-center flex justify-center">
				<div
					class="absolute primary-input flex justify-between items-center mx-auto border px-4 w-[80%]"
				>
					<p class="text-dark text-xs dark:text-white opacity-50">
						{siteTag}
					</p>
					<Arrow />
				</div>
				<!-- SITE TAG -->
				<select id="siteTag" class="select opacity-0 primary-input" required bind:value={siteTag}>
					<option disabled selected class="font-bold">Tag</option>
					<option value="genuine">Genuine</option>
					<option value="abandoned">Abandoned</option>
					<option value="scam">Scam</option>
					<option value="fake">Fake</option>
					<option value="unsure">Unsure</option>
				</select>
			</div>

			<div class="w-full relative items-center flex justify-center">
				<div
					class="absolute primary-input flex justify-between items-center mx-auto border px-4 w-[80%]"
				>
					<p class="text-dark text-xs dark:text-white opacity-50">
						{siteSafety}
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
					<option disabled selected class="font-bold">Safety</option>
					<option value="safe">Safe</option>
					<option value="mostly safe">Mostly Safe</option>
					<option value="adware issues">Adware Issues</option>
					<option value="malware threats">Malware Threats</option>
					<option value="spyware risks">Spyware Risks</option>
					<option value="phishing concerns">Phishing Concerns</option>
				</select>
			</div>

			<!-- DESCRIPTION -->
			<textarea
				id="description"
				placeholder="Additional Feedback"
				class="textarea textarea-success resize-none primary-input h-[126px] w-[282px] focus:outline-none rounded-[20px]"
				bind:value={description}
				required
			/>
		</div>
		<!-- Submit button -->
		<div class="absolute w-[80%] flex flex-col gap-[29px] bottom-[5%] self-center">
			<div class="flex justify-center items-center gap-[8px]">
				<a href="/submit-review/create-review">
					<div
						class={`w-[10px] bg-transparent hover:bg-action border border-secondary dark:border-action h-[10px] rounded-full`}
					/>
				</a>
				<a href="feedback">
					<div
						class={`w-[10px] bg-secondary dark:bg-action dark:hover:border-action hover:border dark:hover:bg-transparent h-[10px] rounded-full`}
					/>
				</a>
			</div>
			<button class="h-[36px] text-sm w-full primary-button" on:click={handleSubmit}>Submit</button>
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

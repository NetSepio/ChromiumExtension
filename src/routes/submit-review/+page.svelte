<script lang="ts">
	import Dialog from '$lib/components/ui/dialog.svelte';
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { createReview, storeMetaDataPin } from '$lib/modules/reviewFunction';
	import { LoaderCircle } from '@lucide/svelte';

	let title = $state('');
	let description = $state('');
	let websiteUrl: string | undefined = $state('');
	let category = $state('');
	let siteTag = $state('');
	let siteSafety = $state('');
	let siteType = $state('');
	let image = $state('ipfs://bafybeica7pi67452fokrlrmxrooazsxbuluckmcojascc5z4fcazsuhsuy'); // Default image URL
	let isLoading = $state(false);
	let siteRating = $state(0);
	let showStatus = $state(false);

	function getRootUrl(url: string): string {
		try {
			const u = new URL(url);
			return u.origin.replace(/\/$/, '');
		} catch {
			return url
				.replace(/^https?:\/\//, '')
				.split('/')[0]
				.replace(/\/$/, '');
		}
	}

	async function getUrl() {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
		if (tab.url) {
			websiteUrl = getRootUrl(tab.url.toLocaleLowerCase());
		}
	}

	// Call getUrl on component mount

	$effect(() => {
		getUrl();
	});

	// Function to handle form submission
	const handleSubmit = async () => {
		isLoading = true;

		// Ensure websiteUrl is set and valid
		if (!websiteUrl) {
			isLoading = false;
			alert('Website URL is missing. Please refresh and try again.');
			return;
		}

		let domainAddress = '';
		try {
			domainAddress = new URL(websiteUrl).hostname;
		} catch {
			isLoading = false;
			alert('Invalid website URL. Please refresh and try again.');
			return;
		}

		// Block submission if either is empty
		if (!domainAddress || !websiteUrl) {
			isLoading = false;
			alert('Domain address or site URL is missing. Please refresh and try again.');
			return;
		}

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
		let CID = await storeMetaDataPin(metaData);
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
			const response = await createReview(reviewData);
			// Redirecting to success page on successful submission
			if (response.status === 200) {
				showStatus = true;
			}
		} catch (error) {
			console.log('error: ' + error);
		} finally {
			isLoading = false;
		}
	};
</script>

<!-- Main Content -->
<section
	class="relative h-full bg-[#101212] px-8 pt-4 pb-8 text-center text-sm text-white capitalize"
>
	<VpnHeader />

	<!-- Main Form Section -->
	<div class="relative">
		<!-- Main Form Inputs -->
		<div class="mt-2 grid space-y-4">
			<!-- Site URL -->
			<!-- Site URL -->
			<div
				id="websiteUrl"
				class="overflow-hidden rounded-lg border-none bg-[#1012118f] px-3 py-2 text-center text-ellipsis whitespace-nowrap text-gray-400 lowercase"
				style="max-width: 100%;"
			>
				{websiteUrl}
			</div>

			<!-- CATEGORY -->
			<select
				id="siteTag"
				class="rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 outline-[#00887d]"
				required
				bind:value={category}
			>
				<option value="" disabled selected class="font-bold">Category</option>
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
				class="rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 outline-[#00887d] placeholder:text-white/80"
				bind:value={siteRating}
				required
			/>

			<!-- TITLE -->
			<input
				id="title"
				type="text"
				placeholder="Title"
				class="rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 outline-[#00887d] placeholder:text-white/80"
				bind:value={title}
				required
			/>

			<!-- DESCRIPTION -->
			<textarea
				id="description"
				placeholder="Description"
				class="rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 outline-[#00887d] placeholder:text-white/80"
				bind:value={description}
				required>{description}</textarea
			>

			<!-- SITE TYPE -->
			<select
				id="siteType"
				class="rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 text-white outline-[#00887d]"
				required
				bind:value={siteType}
			>
				<option value="" disabled selected class="font-bold text-white">Type</option>
				<option value="website">Website</option>
				<option value="mobile app">Mobile App</option>
				<option value="browser extension">Browser Extension</option>
				<option value="software">Software</option>
			</select>

			<!-- SITE TAG -->
			<select
				id="siteTag"
				class="rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 outline-[#00887d]"
				required
				bind:value={siteTag}
			>
				<option value="" disabled selected class="font-bold text-white">Tag</option>
				<option value="genuine">Genuine</option>
				<option value="abandoned">Abandoned</option>
				<option value="scam">Scam</option>
				<option value="fake">Fake</option>
				<option value="unsure">Unsure</option>
			</select>

			<!-- SITE SAFETY -->
			<select
				id="siteSafety"
				class="rounded-lg border-none bg-[#3b3b3bbd] px-4 py-2 outline-[#00887d]"
				required
				bind:value={siteSafety}
			>
				<option value="" disabled selected class="font-bold">Safety</option>
				<option value="safe">Safe</option>
				<option value="mostly safe">Mostly Safe</option>
				<option value="adware issues">Adware Issues</option>
				<option value="malware threats">Malware Threats</option>
				<option value="spyware risks">Spyware Risks</option>
				<option value="phishing concerns">Phishing Concerns</option>
			</select>

			<!-- Submit button -->
			<div>
				<button
					class="w-full cursor-pointer rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black"
					onclick={handleSubmit}>Submit</button
				>
			</div>
		</div>
	</div>
</section>

<!-- Loading Spinner -->
<Dialog open={isLoading} onClose={() => (isLoading = false)}>
	<LoaderCircle class="animate-spin" />
</Dialog>

<Dialog open={showStatus} onClose={() => (showStatus = false)}>
	<div class="grid space-y-4 rounded-lg bg-[#1012128f] p-4">
		<h3 class="text-center text-xl font-bold">Successfully submitted!</h3>
		<svg
			width="68"
			height="66"
			viewBox="0 0 68 66"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="mx-auto fill-[#263238] dark:fill-[#11D9C5]"
		>
			<!-- SVG path for checkmark -->
			<g filter="url(#filter0_d_6892_6947)">
				<path
					d="M12.6233 46.6667L20.4879 24.7917C20.6615 24.3403 20.9309 23.9931 21.2962 23.75C21.6615 23.5069 22.0518 23.3854 22.4671 23.3854C22.7448 23.3854 23.0053 23.4375 23.2483 23.5417C23.4914 23.6458 23.7171 23.8021 23.9254 24.0104L37.9879 38.0729C38.1962 38.2812 38.3525 38.5069 38.4566 38.75C38.5608 38.9931 38.6129 39.2535 38.6129 39.5312C38.6129 39.9479 38.4914 40.3389 38.2483 40.7042C38.0052 41.0694 37.658 41.3382 37.2066 41.5104L15.3316 49.375C14.915 49.5486 14.5157 49.575 14.1337 49.4542C13.7518 49.3333 13.4219 49.1333 13.1441 48.8542C12.8664 48.5764 12.6664 48.2465 12.5441 47.8646C12.4219 47.4826 12.4483 47.0833 12.6233 46.6667ZM54.9671 19.6354C54.6546 19.9479 54.29 20.1042 53.8733 20.1042C53.4566 20.1042 53.0921 19.9479 52.7796 19.6354L52.6233 19.4792C52.1372 18.9931 51.5296 18.75 50.8004 18.75C50.0712 18.75 49.4636 18.9931 48.9775 19.4792L38.4046 30.0521C38.0921 30.3646 37.7275 30.5208 37.3108 30.5208C36.8941 30.5208 36.5296 30.3646 36.2171 30.0521C35.9046 29.7396 35.7483 29.375 35.7483 28.9583C35.7483 28.5417 35.9046 28.1771 36.2171 27.8646L46.79 17.2917C47.9011 16.1806 49.2379 15.625 50.8004 15.625C52.3629 15.625 53.6997 16.1806 54.8108 17.2917L54.9671 17.4479C55.2796 17.7604 55.4358 18.125 55.4358 18.5417C55.4358 18.9583 55.2796 19.3229 54.9671 19.6354ZM27.7796 13.3854C28.0921 13.0729 28.4566 12.9167 28.8733 12.9167C29.29 12.9167 29.6546 13.0729 29.9671 13.3854L30.2275 13.6458C31.3386 14.7569 31.8941 16.0764 31.8941 17.6042C31.8941 19.1319 31.3386 20.4514 30.2275 21.5625L30.0712 21.7187C29.7587 22.0312 29.3941 22.1875 28.9775 22.1875C28.5608 22.1875 28.1962 22.0312 27.8837 21.7187C27.5712 21.4062 27.415 21.0417 27.415 20.625C27.415 20.2083 27.5712 19.8438 27.8837 19.5312L28.04 19.375C28.5261 18.8889 28.7691 18.2986 28.7691 17.6042C28.7691 16.9097 28.5261 16.3194 28.04 15.8333L27.7796 15.5729C27.4671 15.2604 27.3108 14.8958 27.3108 14.4792C27.3108 14.0625 27.4671 13.6979 27.7796 13.3854ZM36.2171 9.21875C36.5296 8.90625 36.8941 8.75 37.3108 8.75C37.7275 8.75 38.0921 8.90625 38.4046 9.21875L40.6441 11.4583C41.7552 12.5694 42.3108 13.9062 42.3108 15.4688C42.3108 17.0312 41.7552 18.3681 40.6441 19.4792L34.2379 25.8854C33.9254 26.1979 33.5608 26.3542 33.1441 26.3542C32.7275 26.3542 32.3629 26.1979 32.0504 25.8854C31.7379 25.5729 31.5816 25.2083 31.5816 24.7917C31.5816 24.375 31.7379 24.0104 32.0504 23.6979L38.4566 17.2917C38.9427 16.8056 39.1858 16.1979 39.1858 15.4688C39.1858 14.7396 38.9427 14.1319 38.4566 13.6458L36.2171 11.4062C35.9046 11.0938 35.7483 10.7292 35.7483 10.3125C35.7483 9.89583 35.9046 9.53125 36.2171 9.21875ZM52.8837 34.2187C52.5712 34.5312 52.2066 34.6875 51.79 34.6875C51.3733 34.6875 51.0087 34.5312 50.6962 34.2187L48.4566 31.9792C47.9705 31.4931 47.3629 31.25 46.6337 31.25C45.9046 31.25 45.2969 31.4931 44.8108 31.9792L42.5712 34.2187C42.2587 34.5312 41.8941 34.6875 41.4775 34.6875C41.0608 34.6875 40.6962 34.5312 40.3837 34.2187C40.0712 33.9062 39.915 33.5417 39.915 33.125C39.915 32.7083 40.0712 32.3438 40.3837 32.0312L42.6233 29.7917C43.7344 28.6806 45.0712 28.125 46.6337 28.125C48.1962 28.125 49.533 28.6806 50.6441 29.7917L52.8837 32.0312C53.1962 32.3438 53.3525 32.7083 53.3525 33.125C53.3525 33.5417 53.1962 33.9062 52.8837 34.2187Z"
				/>
			</g>
			<defs>
				<filter
					id="filter0_d_6892_6947"
					x="0.46875"
					y="0.75"
					width="66.9688"
					height="64.7793"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="6" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0666667 0 0 0 0 0.85098 0 0 0 0 0.772549 0 0 0 0.2 0"
					/>
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6892_6947" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_6892_6947"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
		<a
			class="w-full cursor-pointer self-end rounded-3xl bg-gradient-to-b from-[#0b8f84] to-[#00ccba] py-2 text-black"
			href="/website-review"
			onclick={() => (showStatus = false)}>Go home</a
		>
	</div>
</Dialog>

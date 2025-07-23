<script lang="ts">
	import VpnHeader from '$lib/components/ui/vpn-header.svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import Summary from '$lib/components/ui/summary.svelte';
	import Review from '$lib/components/ui/review.svelte';
	import { removeIpfsPrefix } from '$lib/helpers/removeIpfsPrefix';
	import type { ReviewType } from '../../types/types';
	import { LoaderCircle } from '@lucide/svelte';
	import Dialog from '$lib/components/ui/dialog.svelte';

	let currentUrl: string | undefined = $state('');
	let isLoading = $state(false);
	let urlWithoutProtocol = $derived(currentUrl.replace(/^https?:\/\//, ''));
	let currentTab = $state('summary');
	let summary = $state('');
	let result = $state('');
	let averageRating = $state(0);
	let reviews = $state<ReviewType[]>([]);

	function getRootUrl(url: string): string {
		try {
			// Remove protocol and trailing slash, keep only domain
			const u = new URL(url);
			return u.origin.replace(/\/$/, '');
		} catch {
			// fallback: remove protocol, path, query, and trailing slash
			return url
				.replace(/^https?:\/\//, '')
				.split('/')[0]
				.replace(/\/$/, '');
		}
	}

	// Asynchronous function to get the current URL
	async function getUrl() {
		isLoading = true;
		try {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (tab.url) {
				// Always use the root domain, no trailing slash
				const root = getRootUrl(tab.url.toLocaleLowerCase());
				currentUrl = tab.url.startsWith('http') ? new URL(tab.url).origin : `https://${root}`;
				currentUrl = currentUrl.replace(/\/$/, '');
				urlWithoutProtocol = root;
			}
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	}

	async function getSummary() {
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};

		try {
			const response = await fetch(
				`${PUBLIC_GATEWAY_URL}/site-insight?siteUrl=${currentUrl}`,
				options
			);
			const data = await response.json();

			if (data.status !== 200 || !data.payload) {
				result = data.message || 'No insight available for this site.';
				summary = '';
				return summary;
			}

			result = data.message || '';
			summary = data.payload.insight || 'No summary insight available.';
			// Optionally, you can also use data.payload.siteUrl and data.payload.createdAt if needed

			return summary;
		} catch {
			result = 'Failed to fetch site insight.';
			summary = '';
			return summary;
		}
	}

	async function getReviews() {
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
				for (const meta of result.payload.reviews) {
					const response = await fetch(
						`https://nftstorage.link/ipfs/${removeIpfsPrefix(meta.metaDataUri)}`
					);
					const data = await response.json();

					reviews = [...reviews, data];
					// console.log(reviews);
				}
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	}

	$effect(() => {
		(async () => {
			await getUrl();
			await getReviews();
			setTimeout(await getSummary(), 30000);
		})();
	});
</script>

<section
	class="relative h-full bg-[#101212] px-8 pt-4 pb-8 text-center text-sm text-white capitalize"
>
	<VpnHeader />
	<h1 class="text-base font-bold">Reviews for</h1>
	<h2 class="text-sm lowercase">{urlWithoutProtocol}</h2>
	<div class="py-4">
		<div class="flex gap-2 rounded-lg bg-[#3333338f] p-1">
			<button
				onclick={() => (currentTab = 'summary')}
				class={`w-full cursor-pointer rounded-lg py-2 ${currentTab === 'summary' ? 'bg-[#00ccba]' : 'bg-transparent'} text-white transition-colors duration-500`}
			>
				Summary
			</button>
			<button
				onclick={() => (currentTab = 'reviews')}
				class={`w-full cursor-pointer rounded-lg py-2 ${currentTab === 'reviews' ? 'bg-[#00ccba]' : 'bg-transparent'} text-white transition-colors duration-500`}
				>Reviews</button
			>
		</div>
		{#if currentTab === 'summary'}
			<div class="my-6 h-80 w-full rounded-lg bg-[#3333338f] py-4">
				<Summary {result} {summary} />
			</div>
		{:else if currentTab === 'reviews'}
			<div class="py-">
				<Review {averageRating} {urlWithoutProtocol} {reviews} />
			</div>
		{/if}
	</div>
</section>

<Dialog open={isLoading} onClose={() => (isLoading = false)}>
	<LoaderCircle class="animate-spin" />
</Dialog>

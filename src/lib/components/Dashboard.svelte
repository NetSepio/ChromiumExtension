<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_GATEWAY_URL } from '$env/static/public';
	import { jwtToken } from '$lib/store/store';
	import Loader from './Loader.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Reviews from './Reviews.svelte';
	import Summary from './Summary.svelte';
	import SubmitReviewForm from './SubmitReviewForm.svelte';

	let currentUrl: string;
	let url: string | undefined;
	let metaData: string;
	let reviews: any = [];
	let reviewSummaryMax = 500;

	let isLoading = false;

	let tempUrl = 'https://blog.com/';

	// url = tempUrl;
	$: urlWithoutProtocol = tempUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');

	const getUrl = async () => {
		isLoading = true;
		try {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			url = tab.url?.toLocaleLowerCase();
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
		// console.log(url);
	};

	let getMetadata = async () => {
		let token = '';

		jwtToken.subscribe((val) => (token = val));

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
		metaData = result.payload[0].metaDataUri;

		console.log(result);

		return metaData;
	};

	const getReview = async (metaData: string) => {
		if (metaData !== 'undefined') {
			const removeIpfsPrefix = (input: string) => input.replace('ipfs://', '');
			const response = await fetch(`https://nftstorage.link/ipfs/${removeIpfsPrefix(metaData)}`);
			reviews = await response.json();
			console.log(reviews);
		}
	};

	onMount(async () => {
		try {
			const metaData = await getMetadata();

			await getReview(metaData);
		} catch (error) {
			console.error('An error occurred:', error);
		}
	});
</script>

<div>
	<Header />

	<h2 class="pb-2 text-center text-black dark:text-white my-6 text-2xl">{urlWithoutProtocol}</h2>

	<Tabs
		tabs={[
			{
				id: 'tab1',
				label: "AI's summary",
				component: Summary,
				props: {
					url: urlWithoutProtocol
				}
			},
			{
				id: 'tab2',
				label: 'Reviews',
				component: Reviews,
				props: { url: urlWithoutProtocol, reviews }
			}
		]}
	/>

	<div
		class="modal h-screen z-10 absolute top-0 flex justify-center items-center"
		class:modal-open={isLoading}
	>
		<Loader />
	</div>
</div>

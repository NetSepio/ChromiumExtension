<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Reviews from './Reviews.svelte';
	import Summary from './Summary.svelte';

	let currentUrl: string | undefined;
	let isLoading = false;

	// let tempUrl = 'https://sooma.com/';

	$: urlWithoutProtocol = currentUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');

	const getUrl = async () => {
		isLoading = true;
		try {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			currentUrl = tab.url?.toLocaleLowerCase();
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	};

	onMount(async () => {
		await getUrl();
	});
</script>

<div>
	<Header />
	<h2 class="pb-2 text-center text-black dark:text-white my-6 text-2xl">{urlWithoutProtocol}</h2>
	<Tabs
		tabs={[
			{
				id: 'tab2',
				label: "AI's summary",
				component: Summary,
				props: {
					url: urlWithoutProtocol
				}
			},
			{
				id: 'tab1',
				label: 'Reviews',
				component: Reviews,
				props: { url: urlWithoutProtocol }
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

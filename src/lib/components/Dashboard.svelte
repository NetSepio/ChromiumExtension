<script lang="ts">
	// Importing Svelte components and functions
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Reviews from './Reviews.svelte';
	import Summary from './Summary.svelte';

	// Declaring variables and reactive statements
	let currentUrl: string | undefined;
	let isLoading = false;

	// Reactive statement to extract the domain from the URL
	$: urlWithoutProtocol = currentUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');

	// Asynchronous function to get the current URL
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

	// Hook that runs after the component is mounted
	onMount(async () => {
		await getUrl();
	});
</script>

<!-- HTML template -->
<div>
	<!-- Rendering Header component -->
	<Header />

	<!-- Displaying the URL without the protocol -->
	<h2 class="pb-2 text-center text-black dark:text-white my-6 text-2xl">{urlWithoutProtocol}</h2>

	<!-- Tabs component with two tabs: "AI's summary" and "Reviews" -->
	<Tabs
		tabs={[
			{
				id: 'tab2',
				label: "AI's summary",
				component: Summary
			},
			{
				id: 'tab1',
				label: 'Reviews',
				component: Reviews
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

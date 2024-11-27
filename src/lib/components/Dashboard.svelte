<script lang="ts">
	// Importing Svelte components and functions
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Reviews from './Reviews.svelte';
	import Summary from './Summary.svelte';
	import { urlMap } from '$lib/store/store';
	// import { ApolloClient, InMemoryCache, useQuery as useGraphqlQuery, gql } from '@apollo/client';

	// Declaring variables and reactive statements
	let currentUrl: string | undefined;
	let isLoading = false;
	let val: any = '';
	$: currentUrlWithoutProtocol = currentUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');

	// Asynchronous function to get the current URL and update mappings
	const getUrl = async () => {
		isLoading = true;
		try {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			currentUrl = tab.url?.toLocaleLowerCase() as string;
			// currentUrl = 'https://netsepio.com/login';
			// currentUrl2 = 'https://overmind.xyz/quests/join';

			// Extract host url from currentUrl
			const hostUrl = new URL(currentUrl!).origin;
			const urlObject = new URL(currentUrl!);
			console.log(urlObject.origin, urlObject.pathname);

			// Retrieve URL mappings from Chrome storage
			chrome.storage.local.get('urlMappings', (result) => {
				const urlMappings = result.urlMappings || {};
				if (!urlMappings[hostUrl]) {
					urlMappings[hostUrl] = [];
				}
				if (!urlMappings[hostUrl].includes(urlObject.pathname)) {
					urlMappings[hostUrl].push(urlObject.pathname);
				}
				// Update URL mappings in Chrome storage
				chrome.storage.local.set({ urlMappings: urlMappings }, () => {
					urlMap.set(urlMappings);
				});
			});

			console.log(val);
			// console.log('vals', currentUrl, tab);
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

<div class=" h-full">
	<Header />

	<Tabs
		header={currentUrlWithoutProtocol}
		tabs={[
			{
				id: 'tab2',
				label: 'AI Summary',
				//@ts-ignore
				component: Summary
			},
			{
				id: 'tab1',
				label: 'Reviews',
				//@ts-ignore
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

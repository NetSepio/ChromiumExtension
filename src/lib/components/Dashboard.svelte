<script lang="ts">
	// Importing Svelte components and functions
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Reviews from './Reviews.svelte';
	import Summary from './Summary.svelte';
	import { testnet, urlMap, walletAddress } from '$lib/store/store';
	// import { ApolloClient, InMemoryCache, useQuery as useGraphqlQuery, gql } from '@apollo/client';
	import { setClient } from 'svelte-apollo';

	// Declaring variables and reactive statements
	let currentUrl: string | undefined;
	let isLoading = false;
	let val: any = '';
	let uri: string;
	let appIsTestnet = true;
	let address: any;
	$: currentUrlWithoutProtocol = currentUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');
	testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
	uri = appIsTestnet
		? 'https://api.testnet.aptoslabs.com/v1/graphql'
		: 'https://api.mainnet.aptoslabs.com/v1/graphql';

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
		// walletAddress.subscribe((data) => (address = data));

		// let unlocked = JSON.parse(sessionStorage.getItem('unlocked') || 'false');
		// if (!unlocked && address) {
		// 	window.location.href = '/signIn';
		// }
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

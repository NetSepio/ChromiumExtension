<script lang="ts">
	// Importing Svelte components and functions
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import Loader from './Loader.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import Reviews from './Reviews.svelte';
	import Summary from './Summary.svelte';
	import { testnet, urlMap } from '$lib/store/store';
	// import { ApolloClient, InMemoryCache, useQuery as useGraphqlQuery, gql } from '@apollo/client';
	import { setClient } from 'svelte-apollo';

	// Declaring variables and reactive statements
	let currentUrl: string | undefined;
	let isLoading = false;
	let val: any = '';
	let uri: string;
	let appIsTestnet = true;
	$: currentUrlWithoutProtocol = currentUrl?.replace(/^https?:\/\/([^/]+)\/.*/, '$1');
	testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
	uri = appIsTestnet
		? 'https://api.testnet.aptoslabs.com/v1/graphql'
		: 'https://api.mainnet.aptoslabs.com/v1/graphql';

	// Initialize apollo client
	// function createApolloClient() {
	// 	const cache = new InMemoryCache();
	// 	const client = new ApolloClient({
	// 		uri: uri,
	// 		cache
	// 	});
	// 	return client;
	// }

	// const client = createApolloClient();
	// setClient(client);

	//Testing the appollo client

	// function useGetAccountAllTransactionVersions(
	// 	address: string,
	// 	limit: number,
	// 	offset?: number
	// ): number[] {
	// 	const addr64Hash = normalizeAddress(address);

	// 	const { loading, error, data } = useGraphqlQuery(ACCOUNT_TRANSACTIONS_QUERY, {
	// 		variables: { address: addr64Hash, limit: limit, offset: offset }
	// 	});

	// 	if (loading || error || !data) {
	// 		return [];
	// 	}

	// 	const versions: number[] = data.address_version_from_move_resources.map(
	// 		(resource: { transaction_version: number }) => {
	// 			return resource.transaction_version;
	// 		}
	// 	);
	// 	console.log(versions);

	// 	return versions;
	// }

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
		let unlocked = JSON.parse(localStorage.getItem('unlocked') || 'true');
		if (!unlocked) {
			window.location.href = '/signIn';
		}
		await getUrl();
		// useGetAccountAllTransactionVersions(
		// 	'0x30fc5066aa21bdf9d2ab60353a81601927ea2877966adea38ae821f55b976891',
		// 	5,
		// 	0
		// );
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

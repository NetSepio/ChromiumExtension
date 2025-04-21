<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import NftDetails from '$lib/components/NftDetails.svelte';
	import fetchGraphQLData from '$lib/graphql/fetchGraphQLData ';
	import { TOKEN } from '$lib/graphql/queries';
	import { publicKey, walletAddress, privateKey, darktheme, testnet } from '$lib/store/store';

	import { onMount } from 'svelte';
	import { formatDate } from '$lib/utils';
	import { HexString } from 'aptos';
	import {
		Aptos,
		Account,
		AptosConfig,
		Ed25519PublicKey,
		Network,
		type AccountAddress,
		type InputGenerateTransactionData,
		type InputGenerateTransactionPayloadData,
		PublicKey,
		Ed25519PrivateKey
	} from '@aptos-labs/ts-sdk';
	import Loader from '$lib/components/Loader.svelte';

	let isLoading = $state(false);
	let userWalletAddress: string = $state();
	let appIsTestnet = true;
	let token_main: any = $state();
	let darkMode = $state(true);
	let activities: any = $state([]);
	let state = $state('Default');
	let address: AccountAddress = $state();
	let max_gas = $state(0);
	let pubKey: string;
	let privKey: string;
	let sent = false;
	let accountExist = $state(false);
	let fillColor = $derived(darkMode ? '#171C2F' : 'white');

	let {
		params: { token }
	} = $page;
	walletAddress.subscribe((value) => (userWalletAddress = value));
	darktheme.subscribe((data) => (darkMode = data));
	publicKey.subscribe((val) => (pubKey = val));
	privateKey.subscribe((val) => (privKey = val));

	//Function to check if account exist
	const checkAccount = async () => {
		// Access clipboard data and extract address
		const pastedData = await navigator.clipboard.readText();
		address = pastedData as unknown as AccountAddress;

		console.log('checking', address);
		isLoading = true;
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		const config = new AptosConfig({ network: app }); // default network is testnet
		const aptos = new Aptos(config);

		try {
			let res = await aptos.getAccountInfo({ accountAddress: address });
			console.log(res);
			isLoading = !true;
			accountExist = true;
		} catch (error) {
			isLoading = !true;
			accountExist = !true;
		}
	};

	const getResource = async () => {
		isLoading = true;
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		let data = await fetchGraphQLData(
			TOKEN,
			{ owner_address: userWalletAddress, token_data_id: token },
			`https://api.${app}.aptoslabs.com/v1/graphql`
		);
		token_main = data.current_token_ownerships_v2[0];
		activities = data.token_activities_v2;
		console.log('token', data);

		isLoading = !true;
	};

	const sendAsset = async () => {
		console.log('semding');
		console.log(pubKey as unknown as PublicKey);
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		const config = new AptosConfig({ network: app }); // default network is testnet
		const aptos = new Aptos(config);

		try {
			isLoading = true;
			// Initialize Aptos SDK

			const key = new HexString(privKey).toUint8Array();
			const privateKey = new Ed25519PrivateKey(key);
			const account = Account.fromPrivateKey({ privateKey });
			const transaction = await aptos.transferDigitalAssetTransaction({
				sender: account,
				digitalAssetAddress: token,
				recipient: address
			});
			const res = await aptos.transaction.signAndSubmitTransaction({
				signer: account,
				transaction
			});
			console.log(res);
			isLoading = !true;
			state = 'Success';
		} catch (error) {
			console.log(error);
			isLoading = !true;
		}
	};
	const getFees = async () => {
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;
		console.log(privKey, 'privekey', pubKey);

		const config = new AptosConfig({ network: app }); // default network is testnet
		const aptos = new Aptos(config);
		try {
			isLoading = true;
			// Initialize Aptos SDK

			// const payload: InputGenerateTransactionPayloadData = {
			// 	function: '0x1::coin::transfer',
			// 	typeArguments: ['0x1::aptos_coin::AptosCoin'],
			// 	functionArguments: [address, amount * 10 ** 8]
			// };

			const key = new HexString(privKey).toUint8Array();
			const privateKey = new Ed25519PrivateKey(key);
			const account = Account.fromPrivateKey({ privateKey });

			const transaction = await aptos.transferDigitalAssetTransaction({
				sender: account,
				digitalAssetAddress: token,
				recipient: address
			});
			const [res] = await aptos.transaction.simulate.simple({
				signerPublicKey: account.publicKey,
				transaction
			});

			console.log(res);
			max_gas =
				Math.min(
					Number(res.max_gas_amount),
					Number(parseInt(res.gas_used) * 1.5 * parseInt(res.gas_unit_price))
				) *
				10 ** -8;

			isLoading = !true;
			state = 'Confirm';
		} catch (error) {
			console.log(error);
			isLoading = !true;
		}
	};
	onMount(async () => {
		await getResource();
	});
</script>

<Header />
{#if isLoading}
	<Loader />
{:else if state === 'Default'}
	<div class=" flex flex-col justify-start overflow-y-scroll h-[520px]">
		<div class="flex my-[8%] px-[6%] h-full justify-start relative items-center">
			<a href="/wallet" class="">
				<!-- SVG icon for the back a -->
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="fill-[#263238] dark:fill-[#11D9C5]"
				>
					<path
						d="M16.6185 2.99028C16.5024 2.87387 16.3645 2.78152 16.2126 2.7185C16.0608 2.65548 15.898 2.62305 15.7335 2.62305C15.5691 2.62305 15.4063 2.65548 15.2545 2.7185C15.1026 2.78152 14.9647 2.87387 14.8485 2.99028L6.53854 11.3003C6.44583 11.3928 6.37229 11.5027 6.32211 11.6237C6.27192 11.7446 6.24609 11.8743 6.24609 12.0053C6.24609 12.1362 6.27192 12.2659 6.32211 12.3869C6.37229 12.5079 6.44583 12.6178 6.53854 12.7103L14.8485 21.0203C15.3385 21.5103 16.1285 21.5103 16.6185 21.0203C17.1085 20.5303 17.1085 19.7403 16.6185 19.2503L9.37854 12.0003L16.6285 4.75028C17.1085 4.27028 17.1085 3.47028 16.6185 2.99028Z"
					/>
				</svg>
			</a>
			<p class="ml-[3%]">{token_main?.current_token_data.token_name || ''}</p>
			<button
				onclick={() => (state = 'Send')}
				class="flex h-[28px] absolute right-[6%] hover:scale-95 active:scale-100 duration-150 gap-2 bg-secondary dark:bg-action dark:border-[#11D9C5] items-center justify-center rounded-full w-[30px]"
			>
				<!-- <p class="font-medium dark:font-semibold text-[10px] dark:text-secondary text-white">Send</p> -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="none"
					class="scale-[2]"
				>
					<path
						d="M8.47084 1.5292C8.39202 1.45094 8.29315 1.39592 8.18509 1.37019C8.07704 1.34446 7.96398 1.34902 7.85834 1.38337L1.76251 3.4167C1.64946 3.45252 1.54956 3.52105 1.47542 3.61361C1.40129 3.70618 1.35625 3.81864 1.346 3.93679C1.33574 4.05494 1.36073 4.17348 1.41781 4.27744C1.47488 4.38139 1.56149 4.4661 1.66668 4.52087L4.19584 5.77087L5.44584 8.30837C5.49609 8.40769 5.57297 8.49108 5.66789 8.54921C5.76281 8.60734 5.87204 8.63792 5.98334 8.63753H6.02501C6.14422 8.62875 6.25803 8.58433 6.35165 8.51002C6.44528 8.43571 6.51439 8.33497 6.55001 8.22087L8.61251 2.1417C8.64934 2.03667 8.65558 1.92334 8.6305 1.81491C8.60542 1.70647 8.55005 1.60739 8.47084 1.5292ZM2.02084 3.9917L7.34168 2.2167L4.38751 5.17087L2.02084 3.9917ZM6.01251 7.9792L4.82918 5.61253L7.78334 2.65837L6.01251 7.9792Z"
						fill={fillColor}
					/>
				</svg>
			</button>
		</div>
		<img
			width="280"
			height="250"
			class="rounded-lg shadow-sm shadow-appPurple mx-auto"
			src={token_main?.current_token_data.cdn_asset_uris?.cdn_image_uri ||
				'https://imgs.search.brave.com/3coUlesYINwfDymt7-BwP7neumXS8M2kGKcGWfTsnAA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9nb2xk/ZW4tbmZ0LWlzb2xh/dGVkLXdoaXRlLWJh/Y2tncm91bmQtbm9u/LWZ1bmdpYmxlLXRv/a2VuLTIxNDQ2Njg0/OC5qcGc'}
			alt="nft_image"
		/>
		<section
			class="mx-[7%] my-[5%] border-b border-secondary dark:border-action dark:border-opacity-40 border-opacity-40"
		>
			<h3 class="heading">Description</h3>
			<p class="my-[5%]">{token_main?.current_token_data.description}</p>
			<!-- <p class="underline mb-[7%] font-light text-xs">See more</p> -->
		</section>
		<section
			class="mx-[6%] my-[5%] pb-[7%] border-b border-secondary dark:border-action dark:border-opacity-40 border-opacity-40"
		>
			<h3 class="heading">Details</h3>
			<div class="flex justify-start items-center gap-5">
				<img
					width="60"
					height="60"
					class="rounded-full shadow-sm h-[60px] w-[60px] shadow-appPurple mt-[5%]"
					src={token_main?.current_token_data.current_collection.cdn_asset_uris?.cdn_image_uri ||
						'https://imgs.search.brave.com/0jfGCIlDuPKAJnAhmFNK0Q92pmGkm5EH6Wh5dK_MdR8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM1/OTg0ODU4Mi9waG90/by9uZnQtZnV0dXJp/c3RpYy1iYWNrZ3Jv/dW5kLndlYnA_Yj0x/JnM9MTcwNjY3YSZ3/PTAmaz0yMCZjPWtD/X1Q2V2EzczFVb0dr/cXZNS01zNFhUTDh0/TlZsd0d6NTNvbFRq/VUJ4QWc9'}
					alt="nft_image"
				/>
				<div class="flex flex-col justify-start">
					<h6 class="font-extralight">Collection</h6>
					<p class="font-bold uppercase">
						{token_main?.current_token_data.current_collection.collection_name}
					</p>
				</div>
			</div>
			<div class="flex justify-start items-center gap-5">
				<div
					class="rounded-full bg-action bg-opacity-50 h-[60px] w-[60px] shadow-sm shadow-appPurple mt-[5%]"
				></div>
				<div class="flex flex-col justify-start">
					<h6 class="font-extralight">Created by</h6>
					<p class="bg-appAsh px-2 dark:bg-action text-sm py-1 dark:bg-opacity-30 rounded-full">
						{token_main?.current_token_data.current_collection.creator_address
							.slice(0, 5)
							.concat('...')
							.concat(token_main?.current_token_data.current_collection.creator_address.slice(-5))}
					</p>
				</div>
			</div>
		</section>
		<section
			class="mx-[6%] my-[5%] pb-[7%] border-b h-full border-secondary dark:border-action dark:border-opacity-40 border-opacity-40"
		>
			<NftDetails title={'Attributes'}>No Attributes</NftDetails>
		</section>
		<section
			class="mx-[6%] my-[5%] pb-[7%] border-b h-full border-secondary dark:border-action dark:border-opacity-40 border-opacity-40"
		>
			<NftDetails title={'On-Chain Properties'}>No properties</NftDetails>
		</section>
		<section
			class="mx-[6%] my-[5%] pb-[7%] border-b h-full border-secondary dark:border-action dark:border-opacity-40 border-opacity-40"
		>
			<NftDetails title={'Pending Offers'}>No Pending offers</NftDetails>
		</section>
		<section class="mx-[6%] my-[5%] pb-[7%] h-full">
			<h1 class="heading mb-[5%]">History</h1>
			{#each activities as item}
				<div
					class="rounded-md w-full bg-appPurple bg-opacity-25 my-[8%] flex flex-col gap-1 px-[3%] py-[4%] h-max"
				>
					<h4 class="text- font-semibold opacity-75">
						{item.entry_function_id_str.includes('transfer')
							? 'Transfer'
							: item.entry_function_id_str.includes('mint')
							? 'Minted'
							: 'Transfer'}
					</h4>
					<div class="flex items-center gap-3">
						<p class="text-sm">from</p>
						<p
							class="bg-appAsh text-xs w-max px-2 py-1 dark:bg-action dark:bg-opacity-30 rounded-full"
						>
							{item.from_address.slice(0, 7).concat('..').concat(item.from_address.slice(-5))}
						</p>
					</div>
					<div class="flex items-center gap-3">
						<p class="text-sm">to</p>
						<p
							class="bg-appAsh text-xs w-max px-2 py-1 dark:bg-action dark:bg-opacity-30 rounded-full"
						>
							{item.to_address.slice(0, 7).concat('..').concat(item.to_address.slice(-5))}
						</p>
					</div>
					<p class="text-sm">{formatDate(item.transaction_timestamp)}</p>
				</div>
			{/each}
		</section>
	</div>
{:else if state === 'Send'}
	<div class="flex flex-col w-[80%] mx-auto pt-[10%] items-center">
		<h3 class="font-semibold text-xl self-start">Add a wallet address</h3>
		<input
			bind:value={address}
			onpaste={checkAccount}
			placeholder="Enter an address"
			class="input rounded-full w-[100%] h-10 dark:border-opacity-100 border-opacity-100 mt-[5%] primary-input"
			type="text"
		/>
		{#if !accountExist}
			<p class="text-red-500 text-sm my-[3%]">Invalid address</p>
		{:else}
			<p class="text-green-500 text-sm my-[3%]">Address found</p>
		{/if}
		<img
			width="250"
			height="180"
			class="rounded-lg shadow-sm my-[5%] shadow-appPurple mx-auto"
			src={token_main?.current_token_data.cdn_asset_uris?.cdn_image_uri ||
				'https://imgs.search.brave.com/3coUlesYINwfDymt7-BwP7neumXS8M2kGKcGWfTsnAA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9nb2xk/ZW4tbmZ0LWlzb2xh/dGVkLXdoaXRlLWJh/Y2tncm91bmQtbm9u/LWZ1bmdpYmxlLXRv/a2VuLTIxNDQ2Njg0/OC5qcGc'}
			alt="nft_image"
		/>
		<div class="flex w-full justify-between items-center mt-[6%]">
			<button
				onclick={() => (state = 'Default')}
				class=" w-[130px] h-[36px] secondary-button border-appPink text-appPink"
			>
				Cancel
			</button>
			<button
				onclick={() => {
					getFees();
				}}
				class=" w-[130px] disabled:opacity-40 h-[36px] primary-button"
				>Next
			</button>
		</div>
	</div>
{:else if state === 'Confirm'}
	<div class="bg-[#058074] flex flex-col gap-1 h-[20%] mb-[10%] p-[10%] bg-opacity-90">
		<h4 class="text-xl font-medium">Confirm</h4>
		<p class="text-xs font-light">Please review your transaction</p>
	</div>
	<div
		class="flex border-b mx-auto border-action border-opacity-40 w-[97%] pb-[5%] mb-[5%] justify-around items-center"
	>
		<p class="text-sm w-1/2 pl-[5%] font-light opacity-50">From:</p>
		<p class="bg-appAsh px-2 self-end dark:bg-action text-sm py-1 dark:bg-opacity-30 rounded-full">
			{userWalletAddress.slice(0, 5).concat('...').concat(userWalletAddress.slice(-5))}
		</p>
	</div>
	<div
		class="flex border-b mx-auto border-action border-opacity-40 w-[97%] pb-[5%] mb-[5%] justify-around items-center"
	>
		<p class="text-sm w-1/2 pl-[5%] font-light opacity-50">Recipient:</p>
		<p class="bg-appAsh px-2 self-end dark:bg-action text-sm py-1 dark:bg-opacity-30 rounded-full">
			{address?.toString().slice(0, 5).concat('...').concat(address?.toString().slice(-5))}
		</p>
	</div>
	<div
		class="flex border-b mx-auto border-action border-opacity-40 w-[97%] pb-[5%] mb-[5%] justify-around items-center"
	>
		<p class="text-sm w-1/2 pl-[5%] font-light opacity-50">Delivery Method:</p>
		<p class=" px-2 self-end text-sm py-1">Direct Transfer</p>
	</div>
	<div
		class="flex flex-col border-b mx-auto border-action border-opacity-40 w-[97%] pb-[5%] mb-[5%] justify-start items-center"
	>
		<div class="flex mb-[2%] w-full justify-between items-center">
			<p class="text-sm w-1/2 pl-[9%] font-light opacity-50">NFT Name:</p>
			<p class=" px-2 self-end pr-[7%] text-sm py-1">{token_main?.current_token_data.token_name}</p>
		</div>
		<div class="flex mb-[2%] w-full justify-between items-center">
			<p class="text-sm w-1/2 pl-[9%] font-light opacity-50">Quantity:</p>
			<p class=" px-2 self-end pr-[7%] text-sm py-1">1</p>
		</div>
		<div class="flex mb-[2%] w-full justify-between items-center">
			<p class="text-sm w-1/2 pl-[9%] font-light opacity-50">Gas Fee:</p>
			<p class=" px-2 self-end pr-[7%] text-sm py-1">{max_gas} APT</p>
		</div>
		<div class="flex w-full justify-between items-center mt-[6%]">
			<button onclick={sendAsset} class=" w-[130px] disabled:opacity-40 h-[36px] primary-button"
				>Send
			</button>
		</div>
	</div>
{:else if state === 'Success'}
	<!-- Container for success message and button -->
	<div class="h-[460px] text-center flex flex-col items-center justify-center gap-4">
		<!-- Success illustration with a circle and path -->
		<svg
			width="180"
			height="180"
			viewBox="0 0 180 180"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="75" cy="105" r="52.5" fill="#222944" />
			<path
				d="M44.9998 97.502L74.2205 119.417C74.6542 119.743 75.268 119.663 75.6045 119.238L126.9 54.4531"
				stroke="#11D9C5"
				stroke-width="7"
				stroke-linecap="round"
			/>
		</svg>

		<!-- Success message -->
		<h1 class="text-black dark:text-white text-xl text-center font-bold">
			Transaction Successfull!
		</h1>

		<!-- Button to navigate to the homepage -->
		<div class="flex w-[80%] mx-auto mt-[20%] justify-between items-center">
			<button class=" w-[130px] h-[36px] secondary-button border-appPink text-appPink">
				Cancel
			</button>
			<button class=" w-[130px] disabled:opacity-40 h-[36px] primary-button">View Details </button>
		</div>
	</div>
{/if}

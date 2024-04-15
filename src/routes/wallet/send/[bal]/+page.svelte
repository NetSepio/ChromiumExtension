<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import {
		Aptos,
		Account,
		AptosConfig,
		Ed25519PublicKey,
		Network,
		type InputGenerateTransactionData,
		type InputGenerateTransactionPayloadData,
		PublicKey,
		Ed25519PrivateKey
	} from '@aptos-labs/ts-sdk';
	import { publicKey, walletAddress, privateKey, darktheme, testnet } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { HexString } from 'aptos';
	import { fade, slide } from 'svelte/transition';
	import Loader from '$lib/components/Loader.svelte';

	let receiverAddress: string = '';
	let loading: boolean = false;
	let amount: number;
	let showModal: boolean;
	let sender: string = '';
	let pubKey: string;
	let privKey: string;
	let accountExist: boolean = false;
	let max_gas: number;
	let sent = false;
	let appIsTestnet = true;

	// Destructure params from $page
	let { params } = $page;
	let darkMode: boolean | undefined = undefined; // Initial dark mode state
	darktheme.subscribe((data) => (darkMode = data));
	$: src = darkMode ? '/done.svg' : '/done_light.svg';
	// Computed value for displaying wallet balance
	$: walletBalance = Number(parseInt(params.bal) / 100000000).toFixed(4);
	walletAddress.subscribe((data) => (sender = data));
	publicKey.subscribe((val) => (pubKey = val));
	privateKey.subscribe((val) => (privKey = val));

	//Function to check if account exist
	const checkAccount = async () => {
		// Access clipboard data and extract address
		const pastedData = await navigator.clipboard.readText();
		receiverAddress = pastedData;

		console.log('checking', receiverAddress);
		loading = true;
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		const config = new AptosConfig({ network: app }); // default network is testnet
		const aptos = new Aptos(config);

		try {
			let res = await aptos.getAccountInfo({ accountAddress: receiverAddress });
			console.log(res);
			loading = !true;
			accountExist = true;
		} catch (error) {
			loading = !true;
			accountExist = !true;
		}
	};

	const handleSend = async () => {
		console.log('semding', sender);
		console.log(pubKey as unknown as PublicKey);
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		const config = new AptosConfig({ network: app }); // default network is testnet
		const aptos = new Aptos(config);

		try {
			loading = true;
			// Initialize Aptos SDK
			const payload: InputGenerateTransactionPayloadData = {
				function: '0x1::coin::transfer',
				typeArguments: ['0x1::aptos_coin::AptosCoin'],
				functionArguments: [receiverAddress, amount * 10 ** 8]
			};
			const transaction = await aptos.transaction.build.simple({ sender: sender, data: payload });

			const key = new HexString(privKey).toUint8Array();
			const privateKey = new Ed25519PrivateKey(key);
			const account = Account.fromPrivateKey({ privateKey });
			const res = await aptos.transaction.signAndSubmitTransaction({
				signer: account,
				transaction
			});
			console.log(res);
			loading = !true;
			sent = true;
		} catch (error) {
			console.log(error);
			loading = !true;
		}
	};
	const getFees = async () => {
		console.log('semding', receiverAddress);
		console.log(pubKey as unknown as PublicKey);
		testnet.subscribe((data) => (appIsTestnet = JSON.parse(data)));
		let app = appIsTestnet ? Network.TESTNET : Network.MAINNET;

		const config = new AptosConfig({ network: app }); // default network is testnet
		const aptos = new Aptos(config);
		try {
			loading = true;
			// Initialize Aptos SDK

			const payload: InputGenerateTransactionPayloadData = {
				function: '0x1::coin::transfer',
				typeArguments: ['0x1::aptos_coin::AptosCoin'],
				functionArguments: [receiverAddress, amount * 10 ** 8]
			};
			const transaction = await aptos.transaction.build.simple({ sender: sender, data: payload });
			const key = new HexString(privKey).toUint8Array();
			const privateKey = new Ed25519PrivateKey(key);
			const account = Account.fromPrivateKey({ privateKey });
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

			loading = !true;
		} catch (error) {
			console.log(error);
			loading = !true;
		}
	};
	onMount(async () => {});
</script>

<Header />
<div class=" mx-auto flex flex-col items-center h-[520px] w-[80%]">
	{#if !sent}
		<div class="flex mt-[5%] w-full items-center">
			<p class="text-dark dark:text-white w-full text-center">Send to</p>
			<p
				class="text-secondary hover:scale-90 active:scale-100 duration-150 dark:text-action text-xs"
			>
				<a href="/wallet"> Cancel </a>
			</p>
		</div>
		<input
			type="search"
			on:paste={checkAccount}
			bind:value={receiverAddress}
			placeholder="Enter Address (0x)"
			class="input rounded-md w-full h-10 dark:border-opacity-50 border-opacity-50 mt-[5%] primary-input"
		/>
	{/if}
	{#if accountExist && !loading && !sent}
		<div in:fade={{ duration: 300 }} class="flex-1 w-[100%] mt-[15%] mx-auto">
			<div class="flex justify-between w-full">
				<p class="text-xs mt-3">Asset:</p>
				<div
					class="border p-3 flex border-secondary dark:border-action border-opacity-30 dark:border-opacity-30 rounded-md w-[80%] h-[70px]"
				>
					<img src="/logo.svg" alt="token" class="w-12 h-12 mr-[10%] rounnded-full" />
					<div class="h-full flex flex-col justify-around">
						<p class="text-xs">APT</p>
						<p class="text-[11px]">
							{`Balance: ${walletBalance} APT`}
						</p>
					</div>
				</div>
			</div>
			<div class="flex justify-between mt-[10%] w-full">
				<p class="text-xs mt-3">Amount:</p>
				<div
					class="border relative py-[4%] pl-[12%] flex justify-between flex-col border-secondary dark:border-action border-opacity-30 dark:border-opacity-30 rounded-md w-[80%] h-[70px]"
				>
					<input
						type="number"
						bind:value={amount}
						on:blur={getFees}
						placeholder="0 APT"
						class="text-lg bg-transparent focus:outline-none focus:border-b border-white border-opacity-0"
					/>
					<!-- <p class="text-[10px] mt-2 w-max opacity-60">{`$0.00 USD`}</p> -->
					{#if amount + max_gas > Number(walletBalance)}
						<p class="absolute right-1 top-1 animate-bounce text-red-500 text-[8px]">
							Not Enough Money
						</p>
					{/if}
				</div>
			</div>
			<div
				class="w-full rounded-lg mt-[10%] opacity-75 text-xs border-secondary border flex items-center p-5 justify-start dark:border-action border-opacity-30 dark:border-opacity-30 h-[100px]"
			>
				{max_gas ? max_gas : 'Estimated Fee'}
			</div>
			<!-- Buttons for cancelling or signing -->
			<div class="flex w-full justify-between items-center mt-8">
				<button class=" w-[120px] h-[36px] secondary-button" on:click={() => (showModal = false)}>
					Cancel
				</button>
				<button
					disabled={!max_gas || !amount || amount + max_gas > Number(walletBalance)}
					class=" w-[120px] disabled:opacity-40 h-[36px] primary-button"
					on:click={handleSend}
				>
					Send
				</button>
			</div>
		</div>

		<!-- {:else} -->
	{/if}
	{#if loading}
		<Loader />
	{/if}
	{#if !accountExist && !loading && !sent}
		<h4 class="text-appPink mt-[15%] animate-pulse flex items-center">Invalid Address</h4>
	{/if}
	{#if sent}
		<div
			in:slide={{ duration: 200 }}
			class="w-[80%] mx-auto flex flex-col justify-start pt-[20%] pb-[30%] h-full items-center"
		>
			<img {src} class="object-cover relative left-3" alt="done" />
			<h4 class="semiBold mt-[8%] mb-[12%] text-[22px]">APT Sent!</h4>
			<button class="h-[36px] mx-auto text-xs w-[90%] primary-button"
				><a class="" href="/wallet">Go To Transactions</a></button
			>
		</div>
	{/if}
</div>

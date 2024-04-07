<!-- Wallet Display Component -->

<script lang="ts">
	// Importing necessary dependencies and functions
	import { darktheme, walletAddress, testnet, userBalance } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { generateQRCode } from '$lib/modules/qrCode';
	import { slide, fade, scale } from 'svelte/transition';

	// Initializations and state variables
	let aptosLogo = '/logo.svg';
	let walletBalance: any;
	let userWalletAddress = '';
	let copied = false;
	let qrCodeDataUrl: string = '';
	let clicked = false;
	let darkMode = true;
	let appNetwork = true;
	let networkModal = false;
	$: fillColor = darkMode ? '#171C2F' : 'white';
	$: src = darkMode ? '/dark_copy.svg' : 'light_copy.svg';

	darktheme.subscribe((data) => (darkMode = data));
	testnet.subscribe((data) => (appNetwork = JSON.parse(data)));

	// External prop for wallet balance
	let balance: any;
	export let getBalance: any;
	export let getTransactions: any;
	userBalance.subscribe((data) => (balance = JSON.parse(data)));

	// Subscribing to changes in the wallet address
	walletAddress.subscribe((value) => (userWalletAddress = value));

	// Computed value for displaying wallet balance
	$: walletBalance = Number(balance / 100000000).toFixed(8);

	// Function to handle copying wallet address to clipboard
	const handleCopyClick = () => {
		navigator.clipboard.writeText(userWalletAddress);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	};

	// Function to generate QR code data URL
	async function generateQRCodeDataUrl() {
		qrCodeDataUrl = await generateQRCode(userWalletAddress);
	}

	// Function to switch network
	const switchNetwork = async () => {
		testnet.update((data) => {
			const val = JSON.stringify(!JSON.parse(data));
			localStorage.setItem('testnet', val);
			return val;
		});
		await getBalance();
		await getTransactions();
		userBalance.subscribe((data) => (balance = JSON.parse(data)));
		// window.location.reload();
		// console.log(walletBalance);
		// console.log('waletaddress', balance, appNetwork);
	};

	// Function to handle button click (show QR code)
	function handleButtonClick() {
		const modalCheckbox = document.getElementById('my-modal-3') as HTMLInputElement;
		modalCheckbox.checked = true;
		clicked = true;
	}
</script>

<!-- HTML structure -->
{#if qrCodeDataUrl}
	<!-- Modal for displaying QR Code -->
	<div
		class="absolute top-[80px] flex flex-col items-center justify-start z-20 w-[351px] h-[520px] bg-[#F6F8FD] left-0 dark:bg-dark"
	>
		{#if copied}
			<p in:fade={{ duration: 200 }} class="text-[10px] mx-auto absolute top-[10px] font-medium">
				Copied!!
			</p>
		{/if}
		<div
			class="flex h-[75%] relative justify-between headerShadow py-[4%] bg-white mt-[15%] dark:bg-[#222944] rounded-lg w-[80%] flex-col items-center"
		>
			<h4 class="text-lg">Receive</h4>
			<button
				on:click={() => (qrCodeDataUrl = '')}
				class="btn outline-none btn-sm btn-circle bg-transparent border-none text-appPink absolute right-2 top-2"
				>✕</button
			>
			<div class="">
				<!-- Display QR Code image or message -->
				{#if qrCodeDataUrl}
					<img
						src={qrCodeDataUrl}
						alt="QR Code"
						class="w-[80%] mx-auto rounded-lg bg-transparent"
					/>
				{:else}
					<p>Generating QR code...</p>
				{/if}
			</div>
			<div
				class="flex flex-row-reverse w-[80%] border rounded-md border-secondary dark:border-action justify-between p-[3%]"
			>
				<button on:click={handleCopyClick} class="active:scale-90">
					<img {src} width={16} height={16} alt="copy" />
				</button>

				<p class="text-sm">{userWalletAddress.substring(0, 20) + '..'}</p>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col h-[50%] justify-around py-[5%] items-center">
		<!-- Display Network -->
		<button
			class="flex self-end relative bottom-2 mr-4 space-x-1 items-center"
			on:click={() => (networkModal = !networkModal)}
		>
			<div class="w-2 h-2 rounded-full bg-green-500" />
			<p class="text-xs capitalize">{appNetwork ? 'Testnet' : 'Mainnet'}</p>
			{#if networkModal}
				<div class="absolute dark:bg-[#222944] rounded-md -left-[100%] top-[100%]">
					<button
						class="text-xs hover:bg-secondary p-2 h-max rounded-md w-full"
						on:click={switchNetwork}
					>
						{!appNetwork ? 'Testnet' : 'Mainnet'}
					</button>
				</div>
			{/if}
		</button>
		<!-- Display Aptos logo and wallet balance -->
		<img src={aptosLogo} alt="Netsepio" class="h-16 w-16 object-cover" />
		<h3 class="text-[22px] semiBold text-center">{walletBalance.substring(0, 4)} APTOS</h3>
		<!-- Send and Receive Buttons-->
		<div class="flex w-max mx-auto space-x-5 items-center">
			<!-- <a
				href="/wallet/send/{balance}"
				class="flex h-[28px] hover:scale-95 active:scale-100 duration-150 gap-2 bg-secondary dark:bg-action dark:border-[#11D9C5] items-center justify-center rounded-full w-[81px]"
			>
				<p class="font-medium dark:font-semibold text-[10px] dark:text-secondary text-white">
					Send
				</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="none"
				>
					<path
						d="M8.47084 1.5292C8.39202 1.45094 8.29315 1.39592 8.18509 1.37019C8.07704 1.34446 7.96398 1.34902 7.85834 1.38337L1.76251 3.4167C1.64946 3.45252 1.54956 3.52105 1.47542 3.61361C1.40129 3.70618 1.35625 3.81864 1.346 3.93679C1.33574 4.05494 1.36073 4.17348 1.41781 4.27744C1.47488 4.38139 1.56149 4.4661 1.66668 4.52087L4.19584 5.77087L5.44584 8.30837C5.49609 8.40769 5.57297 8.49108 5.66789 8.54921C5.76281 8.60734 5.87204 8.63792 5.98334 8.63753H6.02501C6.14422 8.62875 6.25803 8.58433 6.35165 8.51002C6.44528 8.43571 6.51439 8.33497 6.55001 8.22087L8.61251 2.1417C8.64934 2.03667 8.65558 1.92334 8.6305 1.81491C8.60542 1.70647 8.55005 1.60739 8.47084 1.5292ZM2.02084 3.9917L7.34168 2.2167L4.38751 5.17087L2.02084 3.9917ZM6.01251 7.9792L4.82918 5.61253L7.78334 2.65837L6.01251 7.9792Z"
						fill={fillColor}
					/>
				</svg>
			</a> -->
			<button
				on:click={generateQRCodeDataUrl}
				class="flex h-[28px] hover:scale-95 active:scale-100 duration-150 gap-2 bg-secondary dark:bg-action dark:border-[#11D9C5] items-center justify-center rounded-full w-[81px]"
			>
				<p class="font-medium dark:font-semibold text-[10px] dark:text-secondary text-white">
					Receive
				</p>
				<svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M0.866589 6.02596C0.969253 6.02596 1.06771 6.06675 1.14031 6.13934C1.2129 6.21194 1.25369 6.3104 1.25369 6.41306V7.5759C1.25369 7.64713 1.31149 7.70493 1.38272 7.70493H7.57627C7.61049 7.70493 7.64331 7.69134 7.66751 7.66714C7.6917 7.64294 7.7053 7.61012 7.7053 7.5759V6.41306C7.7053 6.3104 7.74608 6.21194 7.81868 6.13934C7.89127 6.06675 7.98973 6.02596 8.0924 6.02596C8.19506 6.02596 8.29352 6.06675 8.36611 6.13934C8.43871 6.21194 8.47949 6.3104 8.47949 6.41306V7.5759C8.47949 7.81545 8.38433 8.04519 8.21494 8.21458C8.04556 8.38396 7.81582 8.47913 7.57627 8.47913H1.38272C1.14317 8.47913 0.913429 8.38396 0.744041 8.21458C0.574653 8.04519 0.479492 7.81545 0.479492 7.5759V6.41306C0.479492 6.3104 0.520275 6.21194 0.59287 6.13934C0.665465 6.06675 0.763925 6.02596 0.866589 6.02596ZM4.58375 0.479126C4.68641 0.479126 4.78487 0.519909 4.85747 0.592504C4.93006 0.665099 4.97085 0.763558 4.97085 0.866223V5.03964C4.97085 5.14231 4.93006 5.24077 4.85747 5.31336C4.78487 5.38596 4.68641 5.42674 4.58375 5.42674C4.48109 5.42674 4.38263 5.38596 4.31003 5.31336C4.23744 5.24077 4.19665 5.14231 4.19665 5.03964V0.866223C4.19665 0.763558 4.23744 0.665099 4.31003 0.592504C4.38263 0.519909 4.48109 0.479126 4.58375 0.479126Z"
						fill={fillColor}
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M2.58085 3.76989C2.65254 3.69651 2.75043 3.65458 2.85301 3.65332C2.95559 3.65206 3.05448 3.69158 3.12795 3.76318L4.58343 5.18512L6.03891 3.76318C6.07512 3.72691 6.11816 3.69818 6.16556 3.67868C6.21295 3.65917 6.26374 3.64927 6.31499 3.64954C6.36624 3.64982 6.41693 3.66027 6.46411 3.68029C6.51128 3.70031 6.55402 3.7295 6.58983 3.76616C6.62564 3.80282 6.65381 3.84623 6.67271 3.89387C6.69161 3.94151 6.70087 3.99243 6.69994 4.04367C6.699 4.09491 6.68791 4.14546 6.66729 4.19237C6.64667 4.23929 6.61694 4.28165 6.57982 4.31699L4.85388 6.00318C4.78157 6.0738 4.6845 6.11333 4.58343 6.11333C4.48236 6.11333 4.38529 6.0738 4.31298 6.00318L2.58704 4.31699C2.51372 4.24523 2.47189 4.14731 2.47073 4.04472C2.46957 3.94214 2.50917 3.84329 2.58085 3.76989Z"
						fill={fillColor}
					/>
				</svg>
			</button>
		</div>
	</div>
{/if}

<!-- Buy and Send token-->

<!-- <div class="flex justify-between mb-4">
		<button
			class="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white w-auto h-auto mx-0.5 flex items-center"
		>
			<Icon src={RiFinanceCoinsFill} color="white" size="35" />
			Buy Token
		</button>
		<button
			class="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white mr-0.5 w-auto h-auto mx-0.5 flex items-center"
		>
			<Icon src={AiOutlineSend} color="white" size="35" />
			Send Token
		</button>
		<button
			class="px-4 py-2 rounded-full shadow-lg bg-zinc-700 text-white w-auto h-auto mx-0.5 flex items-center"
		>
			<Icon src={RiFinanceExchangeFill} color="white" size="35" />
			Swap Token
		</button>
	</div> -->

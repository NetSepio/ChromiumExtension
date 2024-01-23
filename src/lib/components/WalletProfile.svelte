<!-- Wallet Display Component -->

<script lang="ts">
	// Importing necessary dependencies and functions
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { generateQRCode } from '$lib/modules/qrCode';

	// Initializations and state variables
	let aptosLogo = '/aptos-logo.png';
	let walletBalance: any;
	let userWalletAddress = '';
	let copied = false;
	let qrCodeDataUrl: string = '';
	let clicked = false;

	// External prop for wallet balance
	export let balance: any;

	// Subscribing to changes in the wallet address
	walletAddress.subscribe((value) => (userWalletAddress = value));

	// Computed value for displaying wallet balance
	$: walletBalance = Number(balance / 100000000).toFixed(8);

	// Function to handle copying wallet address to clipboard
	const handleCopyClick = () => {
		navigator.clipboard.writeText(userWalletAddress);
		copied = true;
	};

	// Function to generate QR code data URL
	async function generateQRCodeDataUrl() {
		qrCodeDataUrl = await generateQRCode(userWalletAddress);
	}

	// Function to handle button click (show QR code)
	function handleButtonClick() {
		const modalCheckbox = document.getElementById('my-modal-3') as HTMLInputElement;
		modalCheckbox.checked = true;
		clicked = true;
	}

	// On component mount, generate QR code data URL
	onMount(async () => {
		generateQRCodeDataUrl();
	});
</script>

<!-- HTML structure -->
<div class="flex flex-col items-center">
	<div class="flex flex-col mb-8">
		<!-- Display Aptos logo and wallet balance -->
		<div class="flex items-center mb-4">
			<img src={aptosLogo} alt="Netsepio" class="h-20 w-20 flex items-center mx-28 mb-4" />
		</div>
		<div class="flex justify-center">
			<span class="text-3xl font-bold text-center">{walletBalance.substring(0, 4)} APTOS</span>
		</div>
	</div>

	<div class="flex items-center mb-4">
		<!-- QR Code button -->
		<label for="my-modal-3">
			<button
				class="flex gap-8 items-center px-4 py-2 rounded-full border border-[#11D9C5] bg-transparent text-black w-auto h-auto content-around dark:text-white"
				on:click={handleButtonClick}
			>
				<span class="text-sm">Show QR Code</span>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="fill-[#263238] dark:fill-[#11D9C5]"
				>
					<!-- SVG path for QR Code icon -->
				</svg>
			</button>
		</label>

		<!-- Modal for displaying QR Code -->
		<input type="checkbox" id="my-modal-3" class="modal-toggle" />
		<div class="modal">
			<div class="modal-box relative dark:bg-gray-800 dark:text-gray-100">
				<label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
				<div class="py-10">
					<!-- Display QR Code image or message -->
					{#if qrCodeDataUrl}
						<img src={qrCodeDataUrl} alt="QR Code" class="w-full" />
					{:else}
						<p>Generating QR code...</p>
					{/if}
				</div>
				<p>{userWalletAddress.substring(0, 25) + '...'}</p>
			</div>
		</div>
	</div>
</div>

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

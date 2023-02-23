<script lang="ts">
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import AiFillCopy from 'svelte-icons-pack/ai/AiFillCopy';
	import RiFinanceCoinsFill from 'svelte-icons-pack/ri/RiFinanceCoinsFill';
	import AiOutlineSend from 'svelte-icons-pack/ai/AiOutlineSend';
	import RiFinanceExchangeFill from 'svelte-icons-pack/ri/RiFinanceExchangeFill';
	import MaticImg from '$lib/images/matic-token.png';
	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import { PUBLIC_JSON_RPC_PROVIDER_URL } from '$env/static/public';
	import { generateQRCode } from '$lib/modules/qrCode';

	let truncatedAddress = '';
	let walletBalance = '...';
	let userWalletAddress = '';
	let copied = false;
	let qrCodeDataUrl: string = '';
	let clicked = false;

	walletAddress.subscribe((value) => (userWalletAddress = value));

	const handleCopyClick = () => {
		navigator.clipboard.writeText(userWalletAddress);
		copied = true;
	};

	const getWalletBalance = async () => {
		const provider = new ethers.providers.JsonRpcProvider(PUBLIC_JSON_RPC_PROVIDER_URL);
		let balanceInWei = await provider.getBalance(userWalletAddress);

		walletBalance = (
			Math.round(Number(ethers.utils.formatEther(balanceInWei)) * 1000) / 1000
		).toString();
	};

	async function generateQRCodeDataUrl() {
		qrCodeDataUrl = await generateQRCode(userWalletAddress);
	}

	function handleButtonClick() {
		const modalCheckbox = document.getElementById('my-modal-3') as HTMLInputElement;
		modalCheckbox.checked = true;
		clicked = true;
	}

	onMount(() => {
		truncatedAddress = `${userWalletAddress.substring(0, 5)}...${userWalletAddress.substring(
			userWalletAddress.length - 4
		)}`;
		generateQRCodeDataUrl();
		getWalletBalance();
	});
</script>

<div class="flex flex-col items-center">
	<div class="flex items-center mb-4">
		<h1 class="font-semibold text-black dark:text-white text-lg">{truncatedAddress}</h1>
		<button
			class="ml-1 px-4 py-2 rounded-xl bg-zinc-200 text-white w-auto h-auto content-around dark:bg-gray-700"
			on:click={handleCopyClick}
			class:bg-gray-600={copied}
		>
			{#if copied}
				COPIED
			{:else}
				<Icon src={AiFillCopy} />
			{/if}
		</button>
	</div>

	<div class="flex items-center mb-4">
		<!--QR CODE BUTTON-->
		<label for="my-modal-3">
			<button
				class="ml-1 px-4 py-2 rounded-xl bg-zinc-200 text-black w-auto h-auto content-around dark:bg-gray-700 dark:text-white"
				on:click={handleButtonClick}
			>
				Show QR Code
			</button>
		</label>
		<!-- HTML modal code -->
		<input type="checkbox" id="my-modal-3" class="modal-toggle" />
		<div class="modal">
			<div class="modal-box relative dark:bg-gray-800 dark:text-gray-100">
				<label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
				<div class="py-10">
					{#if qrCodeDataUrl}
						<img src={qrCodeDataUrl} alt="QR Code" class="w-full" />
					{:else}
						<p>Generating QR code...</p>
					{/if}
				</div>
				<p>{userWalletAddress}</p>
			</div>
		</div>
	</div>

	<div class="flex flex-col mb-4">
		<div class="flex items-center mb-4">
			<img src={MaticImg} alt="MATIC token" class="h-16 w-16 flex items-center mx-28 mb-4" />
		</div>
		<div class="flex justify-center">
			<span class="text-4xl text-center">{walletBalance} MATIC</span>
		</div>
	</div>

	<div class="flex justify-between mb-4">
		<!-- <button
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
		</button> -->
	</div>
</div>

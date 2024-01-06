<script lang="ts">
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import IoCopy from 'svelte-icons-pack/io/IoCopy';

	import { walletAddress } from '$lib/store/store';
	import { onMount } from 'svelte';
	import { generateQRCode } from '$lib/modules/qrCode';

	let aptosLogo = '/aptos-logo.png';

	let walletBalance: any;
	let userWalletAddress = '';
	let copied = false;
	let qrCodeDataUrl: string = '';
	let clicked = false;

	export let balance: any;

	walletAddress.subscribe((value) => (userWalletAddress = value));
	$: walletBalance = Number(balance / 100000000).toFixed(8);

	const handleCopyClick = () => {
		navigator.clipboard.writeText(userWalletAddress);
		copied = true;
	};

	async function generateQRCodeDataUrl() {
		qrCodeDataUrl = await generateQRCode(userWalletAddress);
	}

	function handleButtonClick() {
		const modalCheckbox = document.getElementById('my-modal-3') as HTMLInputElement;
		modalCheckbox.checked = true;
		clicked = true;
	}

	onMount(async () => {
		generateQRCodeDataUrl();
	});
</script>

<div class="flex flex-col items-center">
	<div class="flex flex-col mb-8">
		<div class="flex items-center mb-4">
			<img src={aptosLogo} alt="Netsepio " class="h-20 w-20 flex items-center mx-28 mb-4" />
		</div>
		<div class="flex justify-center">
			<span class="text-3xl font-bold text-center"
				>{walletBalance.substring(0, 5) + '...'} APTOS</span
			>
		</div>
	</div>
	<!-- <div class="flex items-center mb-4">
		<button
			class="ml-1 px-4 py-2 rounded-xl bg-zinc-200 text-white w-auto h-auto content-around border border-[#11D9C5] dark:bg-gray-700"
			on:click={handleCopyClick}
			class:bg-gray-600={copied}
		>
			{#if copied}
				COPIED
			{:else}
				<Icon src={IoCopy} color="#11D9C5" />
			{/if}
		</button>
	</div> -->

	<div class="flex items-center mb-4">
		<!--QR CODE BUTTON-->
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
				>
					<g clip-path="url(#clip0_6768_6370)">
						<path
							d="M7.875 7.875H9.75V9.75H7.875V7.875ZM6.375 6.375H7.875V7.875H6.375V6.375ZM9.75 9.75H11.25V11.25H9.75V9.75ZM10.125 6.375H11.25V7.5H10.125V6.375ZM6.375 10.125H7.5V11.25H6.375V10.125ZM7.875 2.25H9.75V4.125H7.875V2.25Z"
							fill="#11D9C5"
						/>
						<path
							d="M11.25 5.625H6.375V0.75H11.25V5.625ZM7.40625 4.59375H10.2188V1.78125H7.40625V4.59375ZM2.25 2.25H4.125V4.125H2.25V2.25Z"
							fill="#11D9C5"
						/>
						<path
							d="M5.625 5.625H0.75V0.75H5.625V5.625ZM1.78125 4.59375H4.59375V1.78125H1.78125V4.59375ZM2.25 7.875H4.125V9.75H2.25V7.875Z"
							fill="#11D9C5"
						/>
						<path
							d="M5.625 11.25H0.75V6.375H5.625V11.25ZM1.78125 10.2188H4.59375V7.40625H1.78125V10.2188Z"
							fill="#11D9C5"
						/>
					</g>
					<defs>
						<clipPath id="clip0_6768_6370">
							<rect width="12" height="12" fill="white" />
						</clipPath>
					</defs>
				</svg>
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
				<p>{userWalletAddress.substring(0, 25) + '...'}</p>
			</div>
		</div>
	</div>

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
</div>

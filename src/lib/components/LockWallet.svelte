<!-- Lock wallet component -->
<script lang="ts">
	// Importing a variable from the Svelte store
	import { mnemonicPhrase } from '$lib/store/store';

	// Declaring local variables
	let showModal = false; // To control the visibility of the modal
	export let isWalletUnlocked: boolean;

	// Function to handle locking the wallet
	const handleLockWallet = async () => {
		// Remove the mnemonic phrase from the store
		await mnemonicPhrase.remove();

		// Update the wallet unlock status and hide the modal
		isWalletUnlocked = false;
		showModal = false;
	};
</script>

<div>
	<!-- Button to trigger modal -->
	<button
		on:click={() => (showModal = true)}
		class="flex items-center gap-2 px-4 py-2 rounded-full capitalize bg-white dark:bg-[#222944] dark:text-white w-full h-auto hover:bg-slate-200 hover:text-black active:bg-slate-500 text-sm text-center shadow-md dark:shadow-none"
	>
		<svg
			width="38"
			height="38"
			viewBox="0 0 38 38"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="fill-[#263238] dark:fill-[#11D9C5]"
		>
			<g filter="url(#filter0_d_6771_6548)">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M26 8.98853V9.99953C26.5304 9.99953 27.0391 10.2102 27.4142 10.5853C27.7893 10.9604 28 11.4691 28 11.9995V21.9995C28 22.53 27.7893 23.0387 27.4142 23.4137C27.0391 23.7888 26.5304 23.9995 26 23.9995H12C11.4696 23.9995 10.9609 23.7888 10.5858 23.4137C10.2107 23.0387 10 22.53 10 21.9995V11.9995C10 10.9545 10.835 10.0065 11.813 9.72753L22.813 6.58453C23.1851 6.47818 23.5768 6.45967 23.9573 6.53045C24.3377 6.60123 24.6966 6.75938 25.0055 6.99242C25.3145 7.22547 25.5651 7.52706 25.7377 7.87344C25.9102 8.21982 26 8.60154 26 8.98853ZM22.5 15.4995C22.1022 15.4995 21.7206 15.6576 21.4393 15.9389C21.158 16.2202 21 16.6017 21 16.9995C21 17.3974 21.158 17.7789 21.4393 18.0602C21.7206 18.3415 22.1022 18.4995 22.5 18.4995C22.8978 18.4995 23.2794 18.3415 23.5607 18.0602C23.842 17.7789 24 17.3974 24 16.9995C24 16.6017 23.842 16.2202 23.5607 15.9389C23.2794 15.6576 22.8978 15.4995 22.5 15.4995ZM24 8.98853C24.0001 8.91794 23.9852 8.84814 23.9563 8.78372C23.9274 8.71931 23.8853 8.66173 23.8326 8.61478C23.7798 8.56783 23.7178 8.53258 23.6505 8.51133C23.5832 8.49009 23.5121 8.48334 23.442 8.49153L23.362 8.50753L18.14 9.99953H24V8.98853Z"
				/>
			</g>
			<defs>
				<filter
					id="filter0_d_6771_6548"
					x="0"
					y="0.488281"
					width="38"
					height="37.5117"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="5" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0666667 0 0 0 0 0.85098 0 0 0 0 0.772549 0 0 0 0.1 0"
					/>
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6771_6548" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_6771_6548"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
		<span>lock your wallet</span>
	</button>

	<!-- Modal -->
	<div class="modal modal-bottom sm:modal-middle" class:modal-open={showModal}>
		<div class="modal-box dark:bg-gray-900 dark:text-white">
			<!-- Close button for the modal -->
			<button
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={() => {
					showModal = false;
				}}
			>
				✕
			</button>
			<p class="text-xl mt-5 mb-3">Sure want to lock the wallet?</p>
			<div class="modal-action flex gap-4">
				<button
					class="btn secondary-button"
					on:click={() => {
						showModal = false;
					}}
				>
					Cancel
				</button>
				<button class="btn primary-button" on:click={handleLockWallet}> Lock </button>
			</div>
		</div>
	</div>
</div>
